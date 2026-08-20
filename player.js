/**
 * player.js - SMAGA Campus Fair 2027
 * Modul Kontrol Karakter POV Siswa (Anti-Macet / Hybrid PointerLock & Drag)
 */

export class Player {
  constructor(camera, domElement = document.body) {
    this.camera = camera;
    this.domElement = domElement;

    // Parameter Fisik Karakter
    this.height = 1.65;
    this.speed = 7.5;
    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    // Rotasi Kamera
    this.camera.rotation.order = 'YXZ';
    this.pitch = 0;
    this.yaw = 0;
    this.mouseSensitivity = 0.0022;
    this.touchSensitivity = 0.0035;

    // Status Kontrol
    this.isLocked = false;
    this.isMouseDown = false;
    this.lastMousePos = { x: 0, y: 0 };
    this.isDialogOpen = false;
    this.activeInteractable = null;
    this.onInteractionCallback = null;

    this.keys = { forward: false, backward: false, left: false, right: false };
    this.joystick = { active: false, touchId: null, origin: { x: 0, y: 0 }, vector: { x: 0, y: 0 } };
    this.touchLookId = null;
    this.lastTouchLook = { x: 0, y: 0 };

    // Element DOM
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

  initDeviceDetection() {
    const isTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.innerWidth <= 820;
    if (isTouch && this.dom.mobileControls) {
      this.dom.mobileControls.style.display = 'block';
    }
  }

  // =========================================================================
  // SISTEM BUKA GAME ANTI-MACET
  // =========================================================================
  startGame() {
    this.isLocked = true;
    if (this.dom.blocker) {
      this.dom.blocker.style.display = 'none'; // Langsung hilangkan layar hitam seketika
    }

    try {
      if (this.domElement.requestPointerLock) {
        this.domElement.requestPointerLock();
      }
    } catch (e) {
      console.warn('Pointer lock fallback mode aktif.');
    }
  }

  setupDesktopControls() {
    if (this.dom.playBtn) {
      this.dom.playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.startGame();
      });
    }

    if (this.dom.blocker) {
      this.dom.blocker.addEventListener('click', () => {
        this.startGame();
      });
    }

    document.addEventListener('pointerlockchange', () => {
      if (document.pointerLockElement === this.domElement || document.pointerLockElement === document.body) {
        this.isLocked = true;
      }
    });

    // Mouse Movement (Dukungan Pointer Lock + Drag Fallback)
    window.addEventListener('mousemove', (e) => {
      if (this.isDialogOpen || !this.isLocked) return;

      if (document.pointerLockElement) {
        this.yaw -= (e.movementX || 0) * this.mouseSensitivity;
        this.pitch -= (e.movementY || 0) * this.mouseSensitivity;
      } else if (this.isMouseDown) {
        const deltaX = e.clientX - this.lastMousePos.x;
        const deltaY = e.clientY - this.lastMousePos.y;
        this.yaw -= deltaX * this.mouseSensitivity * 1.5;
        this.pitch -= deltaY * this.mouseSensitivity * 1.5;
        this.lastMousePos = { x: e.clientX, y: e.clientY };
      }

      this.pitch = Math.max(-Math.PI / 2.2, Math.min(Math.PI / 2.2, this.pitch));
      this.camera.rotation.x = this.pitch;
      this.camera.rotation.y = this.yaw;
    });

    window.addEventListener('mousedown', (e) => {
      if (e.target.closest('#rundown-modal') || e.target.closest('#btn-open-rundown') || e.target.closest('#dialog-modal')) return;
      this.isMouseDown = true;
      this.lastMousePos = { x: e.clientX, y: e.clientY };
    });

    window.addEventListener('mouseup', () => {
      this.isMouseDown = false;
    });

    // Keyboard WASD
    window.addEventListener('keydown', (e) => {
      if (this.isDialogOpen) {
        if (e.code === 'Escape' || e.code === 'KeyE') this.closeDialog();
        return;
      }
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.forward = true; break;
        case 'KeyS': case 'ArrowDown': this.keys.backward = true; break;
        case 'KeyA': case 'ArrowLeft': this.keys.left = true; break;
        case 'KeyD': case 'ArrowRight': this.keys.right = true; break;
        case 'KeyE': case 'Enter': this.triggerInteraction(); break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch (e.code) {
        case 'KeyW': case 'ArrowUp': this.keys.forward = false; break;
        case 'KeyS': case 'ArrowDown': this.keys.backward = false; break;
        case 'KeyA': case 'ArrowLeft': this.keys.left = false; break;
        case 'KeyD': case 'ArrowRight': this.keys.right = false; break;
      }
    });
  }

  setupMobileControls() {
    if (!this.dom.joystickZone || !this.dom.touchLookZone) return;

    const joyZone = this.dom.joystickZone;
    const maxRadius = 45;

    joyZone.addEventListener('touchstart', (e) => {
      e.preventDefault();
      const touch = e.changedTouches[0];
      this.joystick.active = true;
      this.joystick.touchId = touch.identifier;
      const rect = joyZone.getBoundingClientRect();
      this.joystick.origin = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
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

    const resetJoy = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.joystick.touchId) {
          this.joystick.active = false;
          this.joystick.touchId = null;
          this.joystick.vector = { x: 0, y: 0 };
          if (this.dom.joystickKnob) this.dom.joystickKnob.style.transform = `translate(-50%, -50%)`;
          break;
        }
      }
    };
    joyZone.addEventListener('touchend', resetJoy);
    joyZone.addEventListener('touchcancel', resetJoy);

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

    const resetLook = (e) => {
      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === this.touchLookId) {
          this.touchLookId = null;
          break;
        }
      }
    };
    lookZone.addEventListener('touchend', resetLook);
    lookZone.addEventListener('touchcancel', resetLook);

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
    this.joystick.vector = { x: knobX / maxRadius, y: knobY / maxRadius };
  }

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

  update(delta, interactables = []) {
    if (!this.isLocked || this.isDialogOpen) return;

    this.direction.set(0, 0, 0);
    let moveZ = Number(this.keys.forward) - Number(this.keys.backward);
    let moveX = Number(this.keys.right) - Number(this.keys.left);

    if (this.joystick.active) {
      moveX = this.joystick.vector.x;
      moveZ = -this.joystick.vector.y;
    }

    this.direction.set(moveX, 0, -moveZ).normalize();

    if (this.direction.lengthSq() > 0) {
      const cosYaw = Math.cos(this.yaw);
      const sinYaw = Math.sin(this.yaw);
      const worldMoveX = this.direction.x * cosYaw + this.direction.z * sinYaw;
      const worldMoveZ = -this.direction.x * sinYaw + this.direction.z * cosYaw;

      const moveStep = this.speed * delta;
      this.camera.position.x += worldMoveX * moveStep;
      this.camera.position.z += worldMoveZ * moveStep;
    }

    this.camera.position.y = this.height;
    this.checkInteractables(interactables);
  }

  checkInteractables(interactables) {
    let closestItem = null;
    let minDistance = 3.5;

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
      if (this.dom.crosshair) this.dom.crosshair.style.background = '#facc15';
    } else {
      if (this.dom.prompt) this.dom.prompt.style.display = 'none';
      if (this.dom.crosshair) this.dom.crosshair.style.background = 'rgba(0, 243, 255, 0.8)';
    }
  }

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