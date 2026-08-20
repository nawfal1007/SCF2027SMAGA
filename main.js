/**
 * player.js - SMAGA Campus Fair 2027
 * Modul Kontrol Karakter POV Siswa (Hybrid Desktop Keyboard/Mouse & Mobile Touch Joystick)
 */

export class Player {
  constructor(camera, domElement = document.body) {
    this.camera = camera;
    this.domElement = domElement;

    // Parameter Fisik & Gerak Karakter
    this.height = 1.65; // Tinggi pandangan mata siswa (1.65 m)
    this.speed = 7.5;   // Kecepatan jalan normal (m/s)
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // Orientasi Rotasi Kamera (Euler YXZ)
    this.camera.rotation.order = 'YXZ';
    this.pitch = 0; // Rotasi sumbu X (atas-bawah)
    this.yaw = 0;   // Rotasi sumbu Y (kiri-kanan)
    this.mouseSensitivity = 0.0022;
    this.touchSensitivity = 0.0035;

    // Status Input Keyboard
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false
    };

    // Status Input Mobile Joystick
    this.joystick = {
      active: false,
      touchId: null,
      origin: { x: 0, y: 0 },
      vector: { x: 0, y: 0 }
    };

    this.touchLookId = null;
    this.lastTouchLook = { x: 0, y: 0 };

    // State Sistem
    this.isLocked = false;
    this.isMobile = false;
    this.isDialogOpen = false;
    this.activeInteractable = null;

    // Callback Eksternal
    this.onInteractionCallback = null;

    // DOM Elements
    this.dom = {
      blocker: document.getElementById('blocker'),
      playBtn: document.getElementById('play-button'),
      crosshair: document.getElementById('crosshair'),
      prompt: document.getElementById('interaction-prompt'),
      dialogModal: document.getElementById('dialog-modal'),
      dialogCloseBtn: document.getElementById('dialog-close-btn'),
      mobileControls: document.getElementById('mobile-controls'),
      joystickZone: document.getElementById('joystick-zone'),
      joystickKnob: document.getElementById('joystick-knob'),
      touchLookZone: document.getElementById('touch-look-zone'),
      btnActionTouch: document.getElementById('btn-action-touch')
    };

    this.initDeviceDetection();
    this.setupDesktopControls();
    this.setupMobileControls();
    this.setupDialogListeners();
  }

  // =========================================================================
  // 1. DETEKSI PERANGKAT (DESKTOP / MOBILE)
  // =========================================================================
  initDeviceDetection() {
    this.isMobile = (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.innerWidth <= 820
    );

    if (this.isMobile && this.dom.mobileControls) {
      this.dom.mobileControls.style.display = 'block';
    }
  }

  // =========================================================================
  // 2. KONTROL DESKTOP (POINTER LOCK & KEYBOARD WASD)
  // =========================================================================
  setupDesktopControls() {
    // Tombol Mulai Masuk ke Expo
    if (this.dom.playBtn) {
      this.dom.playBtn.addEventListener('click', () => {
        if (!this.isMobile) {
          this.domElement.requestPointerLock();
        } else {
          this.dom.blocker.style.display = 'none';
          this.isLocked = true;
        }
      });
    }

    // Pointer Lock Listener
    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === this.domElement) {
        this.isLocked = true;
        if (this.dom.blocker) this.dom.blocker.style.display = 'none';
      } else {
        this.isLocked = false;
        if (!this.isDialogOpen && this.dom.blocker) {
          this.dom.blocker.style.display = 'flex';
        }
      }
    });

    // Mouse Movement (Rotasi Kamera)
    document.addEventListener('mousemove', (e) => {
      if (!this.isLocked || this.isDialogOpen) return;

      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      this.yaw -= movementX * this.mouseSensitivity;
      this.pitch -= movementY * this.mouseSensitivity;

      // Batasi sudut pandang vertikal (tidak bisa jungkir balik)
      this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));

      this.camera.rotation.x = this.pitch;
      this.camera.rotation.y = this.yaw;
    });

    // Keyboard Event Listener
    window.addEventListener('keydown', (e) => {
      if (this.isDialogOpen) {
        if (e.code === 'Escape' || e.code === 'KeyE') {
          this.closeDialog();
        }
        return;
      }

      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = true;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = true;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = true;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = true;
          break;
        case 'KeyE':
        case 'Enter':
          this.triggerInteraction();
          break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW':
        case 'ArrowUp':
          this.keys.forward = false;
          break;
        case 'KeyS':
        case 'ArrowDown':
          this.keys.backward = false;
          break;
        case 'KeyA':
        case 'ArrowLeft':
          this.keys.left = false;
          break;
        case 'KeyD':
        case 'ArrowRight':
          this.keys.right = false;
          break;
      }
    });
  }

  // =========================================================================
  // 3. KONTROL SMARTPHONE (TOUCH JOYSTICK & TOUCH LOOK)
  // =========================================================================
  setupMobileControls() {
    if (!this.dom.joystickZone || !this.dom.touchLookZone) return;

    // A. Virtual Joystick (Layar Kiri Bawah)
    const joyZone = this.dom.joystickZone;
    const joyKnob = this.dom.joystickKnob;
    const maxRadius = 45; // Batas radius gerak knob (pixel)

    joyZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.joystick.active = true;
      this.joystick.touchId = touch.identifier;

      const rect = joyZone.getBoundingClientRect();
      this.joystick.origin = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
      };
      this.updateJoystick(touch.clientX, touch.clientY, maxRadius);
    }, { passive: false });

    joyZone.addEventListener('touchmove', (e) => {
      e.preventDefault();
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.joystick.touchId) {
          this.updateJoystick(touch.clientX, touch.clientY, maxRadius);
          break;
        }
      }
    }, { passive: false });

    const resetJoystick = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.joystick.touchId) {
          this.joystick.active = false;
          this.joystick.touchId = null;
          this.joystick.vector = { x: 0, y: 0 };
          if (joyKnob) {
            joyKnob.style.transform = `translate(-50%, -50%)`;
          }
          break;
        }
      }
    };

    joyZone.addEventListener('touchend', resetJoystick);
    joyZone.addEventListener('touchcancel', resetJoystick);

    // B. Touch Look Zone (Layar Kanan untuk Mengarahkan Kamera)
    const lookZone = this.dom.touchLookZone;

    lookZone.addEventListener('touchstart', (e) => {
      const touch = e.changedTouches[0];
      this.touchLookId = touch.identifier;
      this.lastTouchLook = { x: touch.clientX, y: touch.clientY };
    });

    lookZone.addEventListener('touchmove', (e) => {
      if (this.isDialogOpen) return;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === this.touchLookId) {
          const deltaX = touch.clientX - this.lastTouchLook.x;
          const deltaY = touch.clientY - this.lastTouchLook.y;

          this.yaw -= deltaX * this.touchSensitivity;
          this.pitch -= deltaY * this.touchSensitivity;
          this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));

          this.camera.rotation.x = this.pitch;
          this.camera.rotation.y = this.yaw;

          this.lastTouchLook = { x: touch.clientX, y: touch.clientY };
          break;
        }
      }
    });

    const resetTouchLook = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.touchLookId) {
          this.touchLookId = null;
          break;
        }
      }
    };

    lookZone.addEventListener('touchend', resetTouchLook);
    lookZone.addEventListener('touchcancel', resetTouchLook);

    // C. Tombol Aksi Mobile [TAP]
    if (this.dom.btnActionTouch) {
      this.dom.btnActionTouch.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.triggerInteraction();
      });
    }
  }

  updateJoystick(clientX, clientY, maxRadius) {
    const deltaX = clientX - this.joystick.origin.x;
    const deltaY = clientY - this.joystick.origin.y;
    const distance = Math.hypot(deltaX, deltaY);
    const angle = Math.atan2(deltaY, deltaX);

    const clampedDist = Math.min(distance, maxRadius);
    const knobX = Math.cos(angle) * clampedDist;
    const knobY = Math.sin(angle) * clampedDist;

    if (this.dom.joystickKnob) {
      this.dom.joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
    }

    // Normalisasi vektor gerak (-1 s/d +1)
    this.joystick.vector = {
      x: knobX / maxRadius,
      y: knobY / maxRadius
    };
  }

  // =========================================================================
  // 4. DIALOG & INTERACTION HANDLER
  // =========================================================================
  setupDialogListeners() {
    if (this.dom.dialogCloseBtn) {
      this.dom.dialogCloseBtn.addEventListener('click', () => {
        this.closeDialog();
      });
    }
  }

  openDialog(speaker, role, text) {
    this.isDialogOpen = true;
    if (this.dom.dialogModal) {
      document.getElementById('dialog-speaker').innerText = speaker;
      document.getElementById('dialog-role').innerText = role;
      document.getElementById('dialog-text').innerText = text;
      this.dom.dialogModal.style.display = 'block';
    }
  }

  closeDialog() {
    this.isDialogOpen = false;
    if (this.dom.dialogModal) {
      this.dom.dialogModal.style.display = 'none';
    }
  }

  triggerInteraction() {
    if (this.activeInteractable && this.onInteractionCallback) {
      this.onInteractionCallback(this.activeInteractable);
    }
  }

  setInteractionCallback(fn) {
    this.onInteractionCallback = fn;
  }

  // =========================================================================
  // 5. UPDATE LOOP (POSISI, COLLISION & INTERACTABLE CHECK)
  // =========================================================================
  update(delta, interactables = []) {
    if (!this.isLocked || this.isDialogOpen) return;

    // A. Menghitung Vektor Gerak Pemain
    this.direction.set(0, 0, 0);

    // Input Keyboard
    let moveZ = Number(this.keys.forward) - Number(this.keys.backward);
    let moveX = Number(this.keys.right) - Number(this.keys.left);

    // Input Mobile Joystick (Override jika aktif)
    if (this.joystick.active) {
      moveX = this.joystick.vector.x;
      moveZ = -this.joystick.vector.y; // Sumbu Y layar terbalik dengan Z 3D
    }

    this.direction.set(moveX, 0, -moveZ).normalize();

    // Hitung Perpindahan Berdasarkan Orientasi Arah Hadap (Yaw)
    if (this.direction.lengthSq() > 0) {
      const cosYaw = Math.cos(this.yaw);
      const sinYaw = Math.sin(this.yaw);

      const worldMoveX = this.direction.x * cosYaw + this.direction.z * sinYaw;
      const worldMoveZ = -this.direction.x * sinYaw + this.direction.z * cosYaw;

      const moveStep = this.speed * delta;
      this.camera.position.x += worldMoveX * moveStep;
      this.camera.position.z += worldMoveZ * moveStep;
    }

    // Ketinggian mata siswa tetap di 1.65 meter
    this.camera.position.y = this.height;

    // B. Pembatas Map Lapangan (World Boundary Collisions)
    this.camera.position.x = Math.max(-33.0, Math.min(22.0, this.camera.position.x));
    this.camera.position.z = Math.max(-20.0, Math.min(20.0, this.camera.position.z));

    // C. Pengecekan Interaksi Terdekat (Proximity Sensor)
    this.checkInteractables(interactables);
  }

  checkInteractables(interactables) {
    let closestItem = null;
    let minDistance = 3.2; // Radius interaksi maksimal (3.2 meter)

    for (const item of interactables) {
      const dist = this.camera.position.distanceTo(item.position);
      if (dist < minDistance) {
        minDistance = dist;
        closestItem = item;
      }
    }

    this.activeInteractable = closestItem;

    if (this.activeInteractable) {
      if (this.dom.prompt) {
        this.dom.prompt.style.display = 'block';
        this.dom.prompt.innerHTML = `Tekan <span style="color:#facc15;">[E]</span> untuk ${this.activeInteractable.actionText || 'Bicara'}`;
      }
      if (this.dom.crosshair) this.dom.crosshair.classList.add('active');
    } else {
      if (this.dom.prompt) this.dom.prompt.style.display = 'none';
      if (this.dom.crosshair) this.dom.crosshair.classList.remove('active');
    }
  }

  // =========================================================================
  // 6. HELPER METODE SPAWN
  // =========================================================================
  setPosition(x, y, z) {
    this.camera.position.set(x, y || this.height, z);
  }

  setRotation(yaw, pitch = 0) {
    this.yaw = yaw;
    this.pitch = pitch;
    this.camera.rotation.x = this.pitch;
    this.camera.rotation.y = this.yaw;
  }
}
