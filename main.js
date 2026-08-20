/**
 * main.js - SMAGA Campus Fair 2027
 * Engine Utama Game Walkthrough 3D (Scene, Lighting, Session Management & Loop)
 */

import { Player } from './player.js';
import { loadMapLapangan } from './mapLapangan.js';

// =========================================================================
// 1. INISIALISASI DASAR THREE.JS
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

// =========================================================================
// 2. SISTEM PENCAHAYAAN GLOBAL
// =========================================================================
const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xfffaed, 1.35);
dirLight.position.set(25, 42, 28);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 0.5;
dirLight.shadow.camera.far = 120;
dirLight.shadow.camera.left = -40;
dirLight.shadow.camera.right = 40;
dirLight.shadow.camera.top = 40;
dirLight.shadow.camera.bottom = -40;
scene.add(dirLight);

const fillLight = new THREE.DirectionalLight(0x38bdf8, 0.45);
fillLight.position.set(-30, 20, -20);
scene.add(fillLight);

// Grid Lapangan Sekunder
const grid = new THREE.GridHelper(70, 70, 0x00f3ff, 0x1e293b);
grid.position.y = 0.001;
scene.add(grid);

// =========================================================================
// 3. LOAD MAP LAPANGAN & REGISTER INTERACTABLES
// =========================================================================
const { mapGroup, interactables, spawnPoint } = loadMapLapangan(scene);

// Inisialisasi Kontrol Pemain
const player = new Player(camera, renderer.domElement);
player.setPosition(spawnPoint.x, spawnPoint.y, spawnPoint.z);
player.setRotation(spawnPoint.yaw, 0);

// =========================================================================
// 4. RUNDOWN & QUEST ENGINE (SESI A, B, C)
// =========================================================================
const questData = {
  currentSessionIndex: 0,
  stampsCollected: new Set(),
  totalStampsNeeded: 5,
  sessions: [
    {
      id: 'SESI_A',
      timeText: '08:00 WIB • SESI A',
      eventName: 'Parade Universitas & Sambutan',
      questText: 'Lewati Welcome Gate & Kunjungi Stan Kampus',
      stageEventText: 'Panggung Utama: Sesi Parade Pembukaan Kampus sedang berlangsung!'
    },
    {
      id: 'SESI_B',
      timeText: '10:00 WIB • SESI B',
      eventName: 'Penampilan Teater Siswa',
      questText: 'Kumpulkan minimal 5 Stempel Stan Universitas',
      stageEventText: 'Panggung Utama: Pertunjukan Seni Teater Budaya sedang tampil!'
    },
    {
      id: 'SESI_C',
      timeText: '13:00 WIB • SESI C',
      eventName: 'Modern Dance & Festival Closing',
      questText: 'Menuju Panggung Utama untuk Doorprize & Penutupan',
      stageEventText: 'Panggung Utama: Penampilan Modern Dance & Pengundian Doorprize!'
    }
  ]
};

// Update Tampilan HUD Sesi & Misi
function updateHUD() {
  const current = questData.sessions[questData.currentSessionIndex];
  const hudTime = document.getElementById('hud-time');
  const hudEvent = document.getElementById('hud-event-name');
  const hudQuest = document.getElementById('hud-quest');

  if (hudTime) hudTime.innerText = current.timeText;
  if (hudEvent) hudEvent.innerText = current.eventName;
  if (hudQuest) {
    if (questData.currentSessionIndex === 1) {
      hudQuest.innerText = `Kumpulkan Stempel (${questData.stampsCollected.size}/${questData.totalStampsNeeded})`;
    } else {
      hudQuest.innerText = current.questText;
    }
  }
}
updateHUD();

// =========================================================================
// 5. INTERACTION DISPATCHER (LOGIKA DIALOG & QUEST PROGRESSION)
// =========================================================================
player.setInteractionCallback((item) => {
  let customDialog = item.dialogText;

  // Interaksi Khusus Stan Universitas (Koleksi Stempel)
  if (item.id.startsWith('terop_')) {
    if (!questData.stampsCollected.has(item.id)) {
      questData.stampsCollected.add(item.id);
      customDialog += `\n\n★ [SUKSES]: Kamu memperoleh stempel resmi! (Total: ${questData.stampsCollected.size} stempel)`;

      // Auto-progress ke Sesi B jika sudah mengumpulkan 3 stempel pertama
      if (questData.stampsCollected.size === 3 && questData.currentSessionIndex === 0) {
        questData.currentSessionIndex = 1;
      }
      // Auto-progress ke Sesi C jika sudah mencapai target 5 stempel
      if (questData.stampsCollected.size >= questData.totalStampsNeeded && questData.currentSessionIndex === 1) {
        questData.currentSessionIndex = 2;
      }
      updateHUD();
    } else {
      customDialog += `\n\n(Kamu sudah mencatat stempel dari stan universitas ini).`;
    }
  }

  // Interaksi Panggung Sesuai Sesi Aktif
  if (item.id === 'stage_main') {
    const sessionInfo = questData.sessions[questData.currentSessionIndex];
    customDialog = `${sessionInfo.stageEventText}\n\nJadwal Rundown Saat Ini: ${sessionInfo.eventName}. Pastikan kamu sudah mengunjungi stan-stan kampus impianmu!`;
  }

  // Buka Dialog Visual Novel
  player.openDialog(item.name, item.role, customDialog);
});

// =========================================================================
// 6. SISTEM TRANSISI AREA (FADE TO BLACK - PERSAPAN MASJID & KELAS)
// =========================================================================
export function switchArea(targetAreaName, callback) {
  const fadeOverlay = document.getElementById('fade-overlay');
  if (fadeOverlay) fadeOverlay.classList.add('active');

  setTimeout(() => {
    if (callback) callback();
    setTimeout(() => {
      if (fadeOverlay) fadeOverlay.classList.remove('active');
    }, 300);
  }, 500);
}

// =========================================================================
// 7. RENDER LOOP & RESIZE HANDLER
// =========================================================================
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = Math.min(clock.getDelta(), 0.1);
  player.update(delta, interactables);

  renderer.render(scene, camera);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
