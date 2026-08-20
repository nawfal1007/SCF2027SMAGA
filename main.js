/**
 * main.js - SMAGA Campus Fair 2027
 * Engine Utama Game Walkthrough 3D (Scene, Multi-Area Management & Render Loop)
 */

import { Player } from './player.js';
import { loadMapLapangan } from './mapLapangan.js';
import { loadMapMasjid } from './mapMasjid.js';
import { RundownManager } from './rundown.js';

// =========================================================================
// 1. SETUP ENGINE THREE.JS & PENCAHAYAAN GLOBAL
// =========================================================================
const container = document.getElementById('canvas-container');

const scene = new THREE.Scene();
scene.background = new THREE.Color('#0b0f19');
scene.fog = new THREE.FogExp2(0x0b0f19, 0.015);

const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
container.appendChild(renderer.domElement);

// Pencahayaan
const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfffaed, 1.35);
dirLight.position.set(25, 42, 28);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
fillLight.position.set(-30, 20, -20);
scene.add(fillLight);

// =========================================================================
// 2. INISIALISASI KARAKTER PEMAIN & STATE AREA
// =========================================================================
const player = new Player(camera, renderer.domElement);

let currentArea = 'LAPANGAN'; // 'LAPANGAN' atau 'MASJID'
let currentMapGroup = null;
let activeInteractables = [];

// =========================================================================
// 3. FUNGSI TRANSISI PERPINDAHAN AREA (LAPANGAN <-> MASJID)
// =========================================================================
function switchArea(targetAreaName, onComplete) {
  const fadeOverlay = document.getElementById('fade-overlay');
  if (fadeOverlay) fadeOverlay.classList.add('active');

  setTimeout(() => {
    // A. Bersihkan Objek Map Lama dari Memori GPU
    if (currentMapGroup) {
      scene.remove(currentMapGroup);
      currentMapGroup.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (Array.isArray(child.material)) child.material.forEach((m) => m.dispose());
          else child.material.dispose();
        }
      });
    }

    // B. Muat Map Baru Sesuai Target
    currentArea = targetAreaName;

    if (currentArea === 'MASJID') {
      const masjidData = loadMapMasjid();
      currentMapGroup = masjidData.mapGroup;
      activeInteractables = masjidData.interactables;
      scene.add(currentMapGroup);

      player.setPosition(masjidData.spawnPoint.x, masjidData.spawnPoint.y, masjidData.spawnPoint.z);
      player.setRotation(masjidData.spawnPoint.yaw, 0);
    } else {
      const lapanganData = loadMapLapangan(scene);
      currentMapGroup = lapanganData.mapGroup;
      activeInteractables = lapanganData.interactables;
      if (currentMapGroup.parent !== scene) {
        scene.add(currentMapGroup);
      }

      player.setPosition(lapanganData.spawnPoint.x, lapanganData.spawnPoint.y, lapanganData.spawnPoint.z);
      player.setRotation(lapanganData.spawnPoint.yaw, 0);
    }

    if (onComplete) onComplete();

    setTimeout(() => {
      if (fadeOverlay) fadeOverlay.classList.remove('active');
    }, 200);
  }, 350);
}

// Inisialisasi Boot Awal: Langsung Muat Lapangan secara Sinkron
const initialLapangan = loadMapLapangan(scene);
currentMapGroup = initialLapangan.mapGroup;
activeInteractables = initialLapangan.interactables;
if (currentMapGroup.parent !== scene) {
  scene.add(currentMapGroup);
}
player.setPosition(initialLapangan.spawnPoint.x, initialLapangan.spawnPoint.y, initialLapangan.spawnPoint.z);
player.setRotation(initialLapangan.spawnPoint.yaw, 0);

// Inisialisasi Manager Rundown
const rundownManager = new RundownManager(scene, player, (targetArea, callback) => {
  switchArea(targetArea, callback);
});
rundownManager.loadSessionAssets('SESI_EXPO', 'LAPANGAN');

// =========================================================================
// 4. SISTEM INTERAKSI DIALOG & KOLEKSI STEMPEL PASSPORT
// =========================================================================
const collectedStamps = new Set();
const totalStampsTarget = 5;

player.setInteractionCallback((item) => {
  // A. Pemicu Pintu Keluar Masjid Menuju Lapangan
  if (item.isDoorToLapangan) {
    switchArea('LAPANGAN', () => {
      rundownManager.loadSessionAssets('SESI_OPENING_ART', 'LAPANGAN');
    });
    return;
  }

  let customDialog = item.dialogText;

  // B. Pemicu Stan Terop Kampus (Koleksi Stempel)
  if (item.id.startsWith('terop_')) {
    if (!collectedStamps.has(item.id)) {
      collectedStamps.add(item.id);
      customDialog += `\n\n★ [SUKSES]: Kamu memperoleh stempel resmi! (Total: ${collectedStamps.size}/${totalStampsTarget} stempel)`;
      
      const hudQuest = document.getElementById('hud-quest');
      if (hudQuest) {
        hudQuest.innerText = `Kumpulkan Stempel (${collectedStamps.size}/${totalStampsTarget})`;
      }
    } else {
      customDialog += `\n\n(Kamu sudah mencatat stempel dari stan universitas ini).`;
    }
  }

  // C. Pemicu Panggung Utama Sesuai Sesi Rundown Aktif
  if (item.id === 'stage_main') {
    const currentSesi = rundownManager.getCurrentSession();
    customDialog = `${currentSesi.stageDialog}\n\nJadwal Rundown (${currentSesi.time}): ${currentSesi.desc}`;
  }

  // Buka Modal Dialog Gaya Visual Novel
  player.openDialog(item.name, item.role, customDialog);
});

// =========================================================================
// 5. RENDER LOOP & RESIZE HANDLER
// =========================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1);
  player.update(delta, activeInteractables);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});