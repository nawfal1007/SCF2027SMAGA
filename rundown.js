/**
 * rundown.js - SMAGA Campus Fair 2027
 * Modul Manajemen Rundown Pop-Out & Dynamic Asset Loader Berdasarkan TOR Resmi
 */

export class RundownManager {
  constructor(scene, player, onSwitchAreaCallback) {
    this.scene = scene;
    this.player = player;
    this.onSwitchArea = onSwitchAreaCallback;

    // Group khusus untuk menampung dekorasi/properti panggung dinamis
    this.currentSessionGroup = new THREE.Group();
    this.scene.add(this.currentSessionGroup);

    this.isOpen = false;
    this.currentSessionId = 'SESI_EXPO';

    // Database 5 Sesi Utama Berdasarkan Dokumen TOR
    this.sessions = [
      {
        id: 'SESI_MASJID',
        targetArea: 'MASJID',
        time: '07.30 – 11.05',
        title: 'Sesi 1: Seminar & Sosialisasi Kampus (Masjid)',
        desc: 'Pembukaan, sambutan Kepsek, materi pemateri 1 & 2, tanya jawab, wishlist siswa, dan sosialisasi kampus (Unisla, Umla, Polteksi).',
        quest: 'Ikuti Seminar & Sosialisasi di Dalam Masjid',
        stageDialog: 'Sesi pagi sedang berlangsung di dalam Masjid. Area lapangan sedang disiapkan untuk pembukaan resmi.'
      },
      {
        id: 'SESI_ISHOMA',
        targetArea: 'LAPANGAN',
        time: '11.05 – 12.05',
        title: 'Sesi 2: ISHOMA & Breakout Photo',
        desc: 'Waktu istirahat, sholat dhuhur berjamaah, makan siang, dan sesi foto di spot Photobooth / Taman.',
        quest: 'Istirahat & Kunjungi Spot Foto Photobooth Gap / Taman Timur',
        stageDialog: 'Panggung Lapangan: Waktu ISHOMA. Siapkan energimu untuk pertunjukan seni ekskul pukul 12.05!'
      },
      {
        id: 'SESI_OPENING_ART',
        targetArea: 'LAPANGAN',
        time: '12.05 – 13.10',
        title: 'Sesi 3: Grand Opening & Gelar Seni Ekskul (Lapangan)',
        desc: 'Pembukaan resmi Kepsek (Gong & Balon) dilanjutkan penampilan Tari (12.15), Teater (12.23), Paskibra (12.40), dan Dance (12.55).',
        quest: 'Saksikan Peresmian Gong & 4 Penampilan Seni Ekskul di Depan Panggung',
        stageDialog: 'Panggung Utama: Peresmian Expo dimulai! Sedang berlangsung pementasan Tari, Teater, Paskibra, dan Modern Dance!'
      },
      {
        id: 'SESI_PARADE',
        targetArea: 'LAPANGAN',
        time: '13.10 – 14.10',
        title: 'Sesi 4: Parade Universitas (Lapangan)',
        desc: 'Arak-arakan parade perwakilan mahasiswa dari 28 universitas mengenakan jas almamater mengelilingi lapangan.',
        quest: 'Sambut Iring-Iringan Parade Jas Almamater Kampus di Lapangan',
        stageDialog: 'Panggung Utama: Parade 28 Universitas sedang mengitari lapangan expo! Bersiaplah menuju stan kampus impianmu.'
      },
      {
        id: 'SESI_EXPO',
        targetArea: 'LAPANGAN',
        time: '14.10 – 15.30',
        title: 'Sesi 5: Expo Booth Campus & Closing (Terop Stan)',
        desc: 'Siswa bebas berkeliling ke 10 Terop Stan kampus untuk konsultasi jurusan, pengumpulan stempel passport, doorprize, dan penutupan.',
        quest: 'Jelajahi 10 Terop Stan & Kumpulkan Stempel Resmi Kampus',
        stageDialog: 'Panggung Utama: Expo Campus dibuka penuh! Kunjungi stan universitas dan kumpulkan stempel untuk undian doorprize!'
      }
    ];

    this.createRundownUI();
    this.setupListeners();
  }

  // =========================================================================
  // 1. INJEKSI UI MODAL POP-OUT & TOMBOL RUNDOWN
  // =========================================================================
  createRundownUI() {
    // Tombol Buka Pop-Out (Pojok Kanan Atas)
    if (!document.getElementById('btn-open-rundown')) {
      const btnRundown = document.createElement('button');
      btnRundown.id = 'btn-open-rundown';
      btnRundown.innerHTML = `📜 PILIH RUNDOWN <span class="key-hint">[R]</span>`;
      btnRundown.style.cssText = `
        position: absolute;
        top: 20px;
        right: 140px;
        z-index: 25;
        background: linear-gradient(135deg, #0284c7, #0369a1);
        color: #ffffff;
        border: 1.5px solid #00f3ff;
        border-radius: 8px;
        padding: 9px 16px;
        font-weight: bold;
        font-size: 13px;
        cursor: pointer;
        box-shadow: 0 4px 15px rgba(0, 243, 255, 0.3);
        outline: none;
        display: flex;
        align-items: center;
        gap: 8px;
      `;
      document.body.appendChild(btnRundown);
    }

    // Modal Pop-Out Daftar Sesi
    if (!document.getElementById('rundown-modal')) {
      const modal = document.createElement('div');
      modal.id = 'rundown-modal';
      modal.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 92%;
        max-width: 620px;
        max-height: 85vh;
        overflow-y: auto;
        background: rgba(15, 23, 42, 0.98);
        border: 2px solid #00f3ff;
        border-radius: 16px;
        padding: 22px 26px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.85);
        z-index: 150;
        display: none;
        backdrop-filter: blur(12px);
        font-family: inherit;
      `;

      let sessionButtonsHTML = '';
      this.sessions.forEach(s => {
        sessionButtonsHTML += `
          <div class="rundown-item-card" data-id="${s.id}" data-area="${s.targetArea}" style="
            background: #1e293b;
            border: 1.5px solid #334155;
            border-left: 5px solid #0284c7;
            border-radius: 10px;
            padding: 12px 16px;
            margin-bottom: 10px;
            cursor: pointer;
            transition: all 0.2s;
          ">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:4px;">
              <span style="font-weight:900; color:#00f3ff; font-size:14px;">${s.title}</span>
              <span style="background:#0f172a; border:1px solid #facc15; color:#facc15; font-size:11px; font-weight:bold; padding:2px 8px; border-radius:4px;">${s.time}</span>
            </div>
            <div style="font-size:12px; color:#cbd5e1; line-height:1.5;">${s.desc}</div>
          </div>
        `;
      });

      modal.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #334155; padding-bottom:10px; margin-bottom:14px;">
          <h2 style="color:#ffffff; font-size:17px; font-weight:900; margin:0; display:flex; align-items:center; gap:8px;">
            <span>📅</span> TIMELINE RUNDOWN EXCAMP (TOR)
          </h2>
          <button id="btn-close-rundown" style="background:#334155; border:none; color:#ffffff; font-weight:bold; font-size:14px; padding:4px 10px; border-radius:6px; cursor:pointer;">✕</button>
        </div>
        <div style="margin-bottom:12px; font-size:12px; color:#94a3b8;">
          Klik salah satu sesi di bawah untuk mengubah atmosfer panggung, tata cahaya, dan tema kegiatan expo secara instan:
        </div>
        <div id="rundown-items-container">${sessionButtonsHTML}</div>
      `;
      document.body.appendChild(modal);

      const styleEl = document.createElement('style');
      styleEl.innerHTML = `
        .rundown-item-card:hover {
          border-color: #00f3ff !important;
          background: #0f172a !important;
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(0, 243, 255, 0.25);
        }
        .rundown-item-card.active-session {
          border-left-color: #facc15 !important;
          border-color: #facc15 !important;
          background: rgba(250, 204, 21, 0.08) !important;
        }
        .key-hint {
          background: rgba(15, 23, 42, 0.6);
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 11px;
          color: #facc15;
        }
      `;
      document.head.appendChild(styleEl);
    }
  }

  // =========================================================================
  // 2. EVENT LISTENER
  // =========================================================================
  setupListeners() {
    const btnOpen = document.getElementById('btn-open-rundown');
    const btnClose = document.getElementById('btn-close-rundown');
    const modal = document.getElementById('rundown-modal');

    const toggleRundown = () => {
      this.isOpen = !this.isOpen;
      if (modal) modal.style.display = this.isOpen ? 'block' : 'none';

      if (this.isOpen && document.pointerLockElement) {
        document.exitPointerLock();
      }
    };

    if (btnOpen) btnOpen.addEventListener('click', toggleRundown);
    if (btnClose) btnClose.addEventListener('click', toggleRundown);

    window.addEventListener('keydown', (e) => {
      if (e.code === 'KeyR' && !this.player.isDialogOpen) {
        toggleRundown();
      }
      if (e.code === 'Escape' && this.isOpen) {
        this.isOpen = false;
        if (modal) modal.style.display = 'none';
      }
    });

    const cards = document.querySelectorAll('.rundown-item-card');
    cards.forEach(card => {
      card.addEventListener('click', () => {
        const sessionId = card.getAttribute('data-id');
        const targetArea = card.getAttribute('data-area');

        if (this.onSwitchArea) {
          this.onSwitchArea(targetArea, () => {
            this.loadSessionAssets(sessionId, targetArea);
          });
        } else {
          this.loadSessionAssets(sessionId, targetArea);
        }

        this.isOpen = false;
        if (modal) modal.style.display = 'none';
      });
    });
  }

  // =========================================================================
  // 3. DYNAMIC ASSET LOADER (PROP PANGGUNG SESUAI TOR)
  // =========================================================================
  loadSessionAssets(sessionId, currentArea = 'LAPANGAN') {
    this.currentSessionId = sessionId;
    const sessionData = this.sessions.find(s => s.id === sessionId);
    if (!sessionData) return;

    // Bersihkan properti sesi panggung sebelumnya
    while (this.currentSessionGroup.children.length > 0) {
      const obj = this.currentSessionGroup.children[0];
      this.currentSessionGroup.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        if (Array.isArray(obj.material)) obj.material.forEach(m => m.dispose());
        else obj.material.dispose();
      }
    }

    // Update status aktif di menu pop-out
    document.querySelectorAll('.rundown-item-card').forEach(c => {
      c.classList.toggle('active-session', c.getAttribute('data-id') === sessionId);
    });

    // Update HUD Atas Layar
    const hudTime = document.getElementById('hud-time');
    const hudEvent = document.getElementById('hud-event-name');
    const hudQuest = document.getElementById('hud-quest');
    if (hudTime) hudTime.innerText = `${sessionData.time} WIB`;
    if (hudEvent) hudEvent.innerText = sessionData.title.split(': ')[1];
    if (hudQuest) hudQuest.innerText = sessionData.quest;

    // Tambahkan properti 3D khusus panggung jika pemain berada di Lapangan
    if (currentArea === 'LAPANGAN') {
      const stagePos = { x: 0, y: 0.50, z: 5.25 };

      if (sessionId === 'SESI_OPENING_ART') {
        // Simbolis Gong & Balon Pembukaan
        const gongStand = new THREE.Mesh(
          new THREE.BoxGeometry(1.6, 1.8, 0.2),
          new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.6 })
        );
        gongStand.position.set(stagePos.x - 2.0, stagePos.y + 0.9, stagePos.z - 0.5);
        this.currentSessionGroup.add(gongStand);

        const gongPlate = new THREE.Mesh(
          new THREE.CylinderGeometry(0.5, 0.5, 0.08, 24),
          new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.3 })
        );
        gongPlate.rotation.x = Math.PI / 2;
        gongPlate.position.set(stagePos.x - 2.0, stagePos.y + 0.9, stagePos.z - 0.45);
        this.currentSessionGroup.add(gongPlate);

        // Spotlight Penampilan Seni Ekskul
        const spotLight1 = new THREE.SpotLight(0x00f3ff, 2.5, 25, Math.PI / 5, 0.4);
        spotLight1.position.set(stagePos.x - 3.0, stagePos.y + 5.0, stagePos.z + 2.0);
        spotLight1.target.position.set(stagePos.x, stagePos.y, stagePos.z);
        this.currentSessionGroup.add(spotLight1);
        this.currentSessionGroup.add(spotLight1.target);

        const spotLight2 = new THREE.SpotLight(0xf43f5e, 2.5, 25, Math.PI / 5, 0.4);
        spotLight2.position.set(stagePos.x + 3.0, stagePos.y + 5.0, stagePos.z + 2.0);
        spotLight2.target.position.set(stagePos.x, stagePos.y, stagePos.z);
        this.currentSessionGroup.add(spotLight2);
        this.currentSessionGroup.add(spotLight2.target);

      } else if (sessionId === 'SESI_PARADE') {
        // Bendera Pataka Universitas di Panggung
        const flagColors = [0x0284c7, 0xfacc15, 0xf43f5e, 0x22c55e, 0xa855f7, 0xfb923c];
        for (let i = 0; i < 6; i++) {
          const fx = -2.5 + (i * 1.0);
          const pole = new THREE.Mesh(
            new THREE.CylinderGeometry(0.02, 0.02, 2.2, 8),
            new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 })
          );
          pole.position.set(stagePos.x + fx, stagePos.y + 1.1, stagePos.z + 1.2);
          this.currentSessionGroup.add(pole);

          const flag = new THREE.Mesh(
            new THREE.PlaneGeometry(0.5, 0.7),
            new THREE.MeshStandardMaterial({ color: flagColors[i % flagColors.length], side: THREE.DoubleSide })
          );
          flag.position.set(stagePos.x + fx + 0.25, stagePos.y + 1.7, stagePos.z + 1.2);
          this.currentSessionGroup.add(flag);
        }

      } else if (sessionId === 'SESI_EXPO') {
        // Lampu Terang Lapangan Expo
        const floodLight = new THREE.DirectionalLight(0xfffaed, 0.4);
        floodLight.position.set(0, 15, 0);
        this.currentSessionGroup.add(floodLight);
      }
    }
  }

  getCurrentSession() {
    return this.sessions.find(s => s.id === this.currentSessionId);
  }
}