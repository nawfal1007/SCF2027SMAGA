/**
 * mapMasjid.js - SMAGA Campus Fair 2027
 * Modul Denah 3D Interior Masjid SMAN 3 Lamongan
 * Fitur: Mihrab 4m, 2 Saf Karpet Lesehan Depan, Kubah Kopong Biru Langit,
 * & NPC Siswa 3D Duduk Lesehan (Putra di Kanan, Putri di Kiri)
 */

export function loadMapMasjid() {
  const mapGroup = new THREE.Group();
  const interactables = [];

  // =========================================================================
  // 1. MATERIAL MASTER MASJID
  // =========================================================================
  const matWhiteFloor = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2, metalness: 0.05 });
  const matCarpetGreen = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.85 });
  const matSafLineGold = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
  const matWall = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.6 });
  const matWallAccent = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 });
  const matMihrabInner = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
  const matPillar = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });
  const matGoldTrim = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.5 });
  const matRailing = new THREE.MeshStandardMaterial({ color: 0x38bdf8, metalness: 0.8, roughness: 0.2 });
  const matRailingGlass = new THREE.MeshStandardMaterial({ color: 0x00f3ff, transparent: true, opacity: 0.35, roughness: 0.1 });
  const matHijabDivider = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.7, roughness: 0.5 });

  // Material Kubah Kopong Biru Langit
  const matSkyBlueDome = new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.35, side: THREE.DoubleSide });
  const lineDomeRibs = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 1.5 });

  const matChandelier = new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 0.9 });
  const matLowTable = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const matDoor = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });

  // Material Karakter Siswa 3D Lesehan
  const matSkin = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 });
  const matShirtWhite = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
  const matPantsDark = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const matPeci = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
  const matJilbab = new THREE.MeshStandardMaterial({ color: 0xe0f2fe, roughness: 0.5 });
  const matSkirt = new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.6 });

  const lineDark = new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 1.2 });
  const lineCyan = new THREE.LineBasicMaterial({ color: 0x00f3ff, linewidth: 1.5 });
  const lineYellow = new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 1.5 });

  function createWireMesh(geo, mat, edgeMat = lineDark) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const edges = new THREE.EdgesGeometry(geo);
    mesh.add(new THREE.LineSegments(edges, edgeMat));
    return mesh;
  }

  function createTextLabel(text, subtext = '', highlightColor = '#ffffff') {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, 512, 256);
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 8;
    ctx.strokeRect(10, 10, 492, 236);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = highlightColor;
    ctx.font = 'bold 48px sans-serif';
    ctx.fillText(text, 256, subtext ? 95 : 128);
    if (subtext) {
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 28px sans-serif';
      ctx.fillText(subtext, 256, 170);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.4), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
  }

  // =========================================================================
  // 2. STRUKTUR UTAMA RUANG MASJID
  // =========================================================================
  const roomW = 20.00, roomD = 16.00, floor1H = 3.80, floor2H = 3.40;
  const totalWallH = floor1H + floor2H; // 7.20 m

  // Lantai Keramik Putih Mengkilap Seluas Ruangan
  const whiteFloor = new THREE.Mesh(new THREE.PlaneGeometry(roomW, roomD), matWhiteFloor);
  whiteFloor.rotation.x = -Math.PI / 2;
  whiteFloor.position.set(0, 0.005, 0);
  whiteFloor.receiveShadow = true;
  mapGroup.add(whiteFloor);

  // 2 Baris Saf Karpet Hijau Lesehan (Z = -7.10 dan Z = -5.70)
  const carpetW = 16.00, safDepth = 1.25;
  const safPositionsZ = [-7.10, -5.70];

  safPositionsZ.forEach((sz) => {
    const carpetSaf = new THREE.Mesh(new THREE.PlaneGeometry(carpetW, safDepth), matCarpetGreen);
    carpetSaf.rotation.x = -Math.PI / 2;
    carpetSaf.position.set(0, 0.01, sz);
    carpetSaf.receiveShadow = true;
    mapGroup.add(carpetSaf);

    const safLineFront = new THREE.Mesh(new THREE.PlaneGeometry(carpetW, 0.06), matSafLineGold);
    safLineFront.rotation.x = -Math.PI / 2;
    safLineFront.position.set(0, 0.015, sz - (safDepth / 2) + 0.08);
    mapGroup.add(safLineFront);

    const safLineBack = new THREE.Mesh(new THREE.PlaneGeometry(carpetW, 0.04), matSafLineGold);
    safLineBack.rotation.x = -Math.PI / 2;
    safLineBack.position.set(0, 0.015, sz + (safDepth / 2) - 0.04);
    mapGroup.add(safLineBack);
  });

  // Label Penanda Zona Putra (Kanan) & Putri (Kiri)
  const labelPutra = createTextLabel('SAF IKHWAN (LAKI-LAKI)', 'SISI KANAN / SOSIALISASI UMLA', '#38bdf8');
  labelPutra.rotation.x = -Math.PI / 2;
  labelPutra.position.set(4.0, 0.02, -4.5);
  labelPutra.scale.set(0.75, 0.75, 0.75);
  mapGroup.add(labelPutra);

  const labelPutri = createTextLabel('SAF AKHWAT (PEREMPUAN)', 'SISI KIRI / AREA WISHLIST', '#f43f5e');
  labelPutri.rotation.x = -Math.PI / 2;
  labelPutri.position.set(-4.0, 0.02, -4.5);
  labelPutri.scale.set(0.75, 0.75, 0.75);
  mapGroup.add(labelPutri);

  // Pembatas Hijab Tengah (X = 0)
  const hijabWall = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.2, 3.8), matHijabDivider);
  hijabWall.position.set(0, 0.6, -6.4);
  mapGroup.add(hijabWall);

  // =========================================================================
  // 3. CERUK MIHRAB TEMPAT IMAM (PANJANG 4.00 M)
  // =========================================================================
  const mihrabW = 4.00, mihrabH = 3.40, mihrabDepth = 4.00, mihrabZ = -roomD / 2;

  const mihrabFloor = new THREE.Mesh(new THREE.PlaneGeometry(mihrabW, mihrabDepth), matCarpetGreen);
  mihrabFloor.rotation.x = -Math.PI / 2;
  mihrabFloor.position.set(0, 0.01, mihrabZ - mihrabDepth / 2);
  mapGroup.add(mihrabFloor);

  const mihrabBackWall = createWireMesh(new THREE.BoxGeometry(mihrabW, mihrabH, 0.2), matMihrabInner, lineCyan);
  mihrabBackWall.position.set(0, mihrabH / 2, mihrabZ - mihrabDepth);
  mapGroup.add(mihrabBackWall);

  [-mihrabW / 2, mihrabW / 2].forEach(mx => {
    const mSideWall = createWireMesh(new THREE.BoxGeometry(0.2, mihrabH, mihrabDepth), matWallAccent, lineCyan);
    mSideWall.position.set(mx, mihrabH / 2, mihrabZ - mihrabDepth / 2);
    mapGroup.add(mSideWall);
  });

  const archTop = createWireMesh(new THREE.BoxGeometry(mihrabW + 0.4, 0.4, 0.3), matGoldTrim, lineYellow);
  archTop.position.set(0, mihrabH + 0.2, mihrabZ);
  mapGroup.add(archTop);

  const pulpit = createWireMesh(new THREE.BoxGeometry(0.9, 1.2, 0.9), matDoor, lineDark);
  pulpit.position.set(1.3, 0.60, mihrabZ - 1.2);
  mapGroup.add(pulpit);

  // =========================================================================
  // 4. DINDING UTAMA KELILING (7.20 M)
  // =========================================================================
  const kiblatWallW = (roomW - mihrabW) / 2;
  [-roomW / 2 + kiblatWallW / 2, roomW / 2 - kiblatWallW / 2].forEach(kx => {
    const kWall = createWireMesh(new THREE.BoxGeometry(kiblatWallW, totalWallH, 0.3), matWall, lineDark);
    kWall.position.set(kx, totalWallH / 2, -roomD / 2);
    mapGroup.add(kWall);
  });

  const mihrabTopWall = createWireMesh(new THREE.BoxGeometry(mihrabW, totalWallH - mihrabH - 0.4, 0.3), matWall, lineDark);
  mihrabTopWall.position.set(0, mihrabH + 0.4 + (totalWallH - mihrabH - 0.4) / 2, -roomD / 2);
  mapGroup.add(mihrabTopWall);

  [-roomW / 2, roomW / 2].forEach(wx => {
    const sWall = createWireMesh(new THREE.BoxGeometry(0.3, totalWallH, roomD), matWall, lineDark);
    sWall.position.set(wx, totalWallH / 2, 0);
    mapGroup.add(sWall);
  });

  const backLeft = createWireMesh(new THREE.BoxGeometry(roomW / 2 - 2.0, totalWallH, 0.3), matWall, lineDark);
  backLeft.position.set(-roomW / 4 - 1.0, totalWallH / 2, roomD / 2);
  mapGroup.add(backLeft);

  const backRight = createWireMesh(new THREE.BoxGeometry(roomW / 2 - 2.0, totalWallH, 0.3), matWall, lineDark);
  backRight.position.set(roomW / 4 + 1.0, totalWallH / 2, roomD / 2);
  mapGroup.add(backRight);

  const exitPortal = createWireMesh(new THREE.BoxGeometry(4.0, 3.2, 0.4), matDoor, lineCyan);
  exitPortal.position.set(0, 1.6, roomD / 2);
  mapGroup.add(exitPortal);

  const exitLabel = createTextLabel('PINTU KELUAR', 'MENUJU LAPANGAN EXPO', '#facc15');
  exitLabel.position.set(0, 3.8, roomD / 2 - 0.25);
  exitLabel.scale.set(0.9, 0.9, 0.9);
  mapGroup.add(exitLabel);

  // =========================================================================
  // 5. 4 PILAR & VOID LANTAI 2
  // =========================================================================
  const pillarX = 5.20, pillarZ = 4.00, voidW = pillarX * 2, voidD = pillarZ * 2;

  [
    [-pillarX, -pillarZ], [pillarX, -pillarZ],
    [-pillarX, pillarZ],  [pillarX, pillarZ]
  ].forEach(([px, pz]) => {
    const col = createWireMesh(new THREE.BoxGeometry(0.65, totalWallH, 0.65), matPillar, lineCyan);
    col.position.set(px, totalWallH / 2, pz);
    mapGroup.add(col);

    const pBase = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.30, 0.85), matGoldTrim);
    pBase.position.set(px, 0.15, pz);
    mapGroup.add(pBase);
  });

  const slabThick = 0.25, slabY = floor1H - (slabThick / 2);
  const floor2Front = createWireMesh(new THREE.BoxGeometry(roomW, slabThick, (roomD - voidD) / 2), matWhiteFloor, lineDark);
  floor2Front.position.set(0, slabY, -roomD / 2 + (roomD - voidD) / 4);
  mapGroup.add(floor2Front);

  const floor2Back = createWireMesh(new THREE.BoxGeometry(roomW, slabThick, (roomD - voidD) / 2), matWhiteFloor, lineDark);
  floor2Back.position.set(0, slabY, roomD / 2 - (roomD - voidD) / 4);
  mapGroup.add(floor2Back);

  const floor2Left = createWireMesh(new THREE.BoxGeometry((roomW - voidW) / 2, slabThick, voidD), matWhiteFloor, lineDark);
  floor2Left.position.set(-roomW / 2 + (roomW - voidW) / 4, slabY, 0);
  mapGroup.add(floor2Left);

  const floor2Right = createWireMesh(new THREE.BoxGeometry((roomW - voidW) / 2, slabThick, voidD), matWhiteFloor, lineDark);
  floor2Right.position.set(roomW / 2 - (roomW - voidW) / 4, slabY, 0);
  mapGroup.add(floor2Right);

  // Railing Pagar Mezzanine
  const railingH = 0.90, railingY = floor1H + (railingH / 2);
  function addRailingSegment(w, d, x, z) {
    const railMesh = new THREE.Mesh(new THREE.BoxGeometry(w, railingH, d), matRailingGlass);
    railMesh.position.set(x, railingY, z);
    mapGroup.add(railMesh);
    const topBar = createWireMesh(new THREE.BoxGeometry(w + (d > w ? 0.06 : 0), 0.06, d + (w >= d ? 0.06 : 0)), matRailing, lineCyan);
    topBar.position.set(x, floor1H + railingH, z);
    mapGroup.add(topBar);
  }
  addRailingSegment(voidW, 0.06, 0, -pillarZ);
  addRailingSegment(voidW, 0.06, 0, pillarZ);
  addRailingSegment(0.06, voidD, -pillarX, 0);
  addRailingSegment(0.06, voidD, pillarX, 0);

  // =========================================================================
  // 6. KUBAH KOPONG BIRU LANGIT
  // =========================================================================
  const roofCeilingY = totalWallH, domeRadius = 4.80;

  const roofFront = createWireMesh(new THREE.BoxGeometry(roomW, 0.25, (roomD - (domeRadius * 2)) / 2), matWall, lineDark);
  roofFront.position.set(0, roofCeilingY + 0.125, -roomD / 2 + (roomD - (domeRadius * 2)) / 4);
  mapGroup.add(roofFront);

  const roofBack = createWireMesh(new THREE.BoxGeometry(roomW, 0.25, (roomD - (domeRadius * 2)) / 2), matWall, lineDark);
  roofBack.position.set(0, roofCeilingY + 0.125, roomD / 2 - (roomD - (domeRadius * 2)) / 4);
  mapGroup.add(roofBack);

  const roofLeft = createWireMesh(new THREE.BoxGeometry((roomW - (domeRadius * 2)) / 2, 0.25, domeRadius * 2), matWall, lineDark);
  roofLeft.position.set(-roomW / 2 + (roomW - (domeRadius * 2)) / 4, roofCeilingY + 0.125, 0);
  mapGroup.add(roofLeft);

  const roofRight = createWireMesh(new THREE.BoxGeometry((roomW - (domeRadius * 2)) / 2, 0.25, domeRadius * 2), matWall, lineDark);
  roofRight.position.set(roomW / 2 - (roomW - (domeRadius * 2)) / 4, roofCeilingY + 0.125, 0);
  mapGroup.add(roofRight);

  // Ring Cincin Terbuka
  const ringGeo = new THREE.CylinderGeometry(domeRadius, domeRadius, 0.35, 32, 1, true);
  const domeRingMesh = new THREE.Mesh(ringGeo, matGoldTrim);
  domeRingMesh.position.set(0, roofCeilingY + 0.18, 0);
  mapGroup.add(domeRingMesh);

  // Setengah Bola Kubah Kopong
  const domeGeo = new THREE.SphereGeometry(domeRadius, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
  const domeMesh = new THREE.Mesh(domeGeo, matSkyBlueDome);
  domeMesh.position.set(0, roofCeilingY + 0.35, 0);
  mapGroup.add(domeMesh);

  const domeEdges = new THREE.LineSegments(new THREE.EdgesGeometry(domeGeo), lineDomeRibs);
  domeMesh.add(domeEdges);

  // Chandelier Lampu Gantung
  const wireChain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 4.8, 8), new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9 }));
  wireChain.position.set(0, roofCeilingY + 2.2, 0);
  mapGroup.add(wireChain);

  const chandelierLight = new THREE.Mesh(new THREE.OctahedronGeometry(0.65, 2), matChandelier);
  chandelierLight.position.set(0, floor1H + 1.4, 0);
  mapGroup.add(chandelierLight);

  const pointLightChandelier = new THREE.PointLight(0xfffaed, 1.8, 18, 1.2);
  pointLightChandelier.position.set(0, floor1H + 1.2, 0);
  mapGroup.add(pointLightChandelier);

  // =========================================================================
  // 7. MEJA LESEHAN & BACKDROP SEMINAR
  // =========================================================================
  function createSeminarScreenTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1600;
    canvas.height = 900;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createLinearGradient(0, 0, 1600, 900);
    grad.addColorStop(0, '#0369a1');
    grad.addColorStop(0.5, '#0284c7');
    grad.addColorStop(1, '#0c4a6e');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1600, 900);
    ctx.strokeStyle = '#facc15';
    ctx.lineWidth = 14;
    ctx.strokeRect(30, 30, 1540, 840);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#facc15';
    ctx.font = 'bold 40px sans-serif';
    ctx.fillText('★ SESI 1: SEMINAR & SOSIALISASI KAMPUS ★', 800, 140);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 78px sans-serif';
    ctx.fillText('EXCAMP SMAGA 2026', 800, 260);
    ctx.fillStyle = '#bae6fd';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('Strategi Sukses Lolos SNBP, SNBT & Kampus Impian', 800, 360);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(140, 480, 1320, 300);
    ctx.strokeStyle = '#00f3ff';
    ctx.lineWidth = 4;
    ctx.strokeRect(140, 480, 1320, 300);
    ctx.fillStyle = '#00f3ff';
    ctx.font = 'bold 34px sans-serif';
    ctx.fillText('Pemateri 1 • Pemateri 2 • Sosialisasi Unisla, Umla, Polteksi', 800, 590);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '28px sans-serif';
    ctx.fillText('Masjid SMAN 3 Lamongan • 08.00 - 11.05 WIB', 800, 660);
    return new THREE.CanvasTexture(canvas);
  }

  const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 3.0), new THREE.MeshStandardMaterial({ map: createSeminarScreenTexture(), roughness: 0.3 }));
  screenMesh.position.set(0, 2.2, -roomD / 2 + 0.2);
  mapGroup.add(screenMesh);

  const speakerLowTable = createWireMesh(new THREE.BoxGeometry(3.6, 0.35, 0.6), matLowTable, lineCyan);
  speakerLowTable.position.set(0, 0.175, -7.40);
  mapGroup.add(speakerLowTable);

  const campusLowTable = createWireMesh(new THREE.BoxGeometry(3.0, 0.35, 0.6), matLowTable, lineDark);
  campusLowTable.position.set(6.5, 0.175, -7.10);
  campusLowTable.rotation.y = -Math.PI / 6;
  mapGroup.add(campusLowTable);

  const campusLabel = createTextLabel('SOSIALISASI', 'UNISLA • UMLA • POLTEKSI', '#38bdf8');
  campusLabel.position.set(6.5, 1.4, -7.10);
  campusLabel.rotation.y = -Math.PI / 6;
  campusLabel.scale.set(0.8, 0.8, 0.8);
  mapGroup.add(campusLabel);

  const wishlistStand = createWireMesh(new THREE.BoxGeometry(1.2, 1.8, 0.4), matWallAccent, lineCyan);
  wishlistStand.position.set(-6.5, 0.9, -7.10);
  wishlistStand.rotation.y = Math.PI / 6;
  mapGroup.add(wishlistStand);

  const wishlistLabel = createTextLabel('SESI WISHLIST', 'POHON HARAPAN SISWA', '#facc15');
  wishlistLabel.position.set(-6.5, 2.2, -7.10);
  wishlistLabel.rotation.y = Math.PI / 6;
  wishlistLabel.scale.set(0.8, 0.8, 0.8);
  mapGroup.add(wishlistLabel);

  // =========================================================================
  // 8. GENERATOR KARAKTER 3D SISWA LESEHAN (PROCEDURAL NPC)
  // =========================================================================
  function createSeatedMaleStudent() {
    const group = new THREE.Group();

    // Kaki Bersila di Karpet
    const legs = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.16, 0.45), matPantsDark);
    legs.position.set(0, 0.08, 0);
    group.add(legs);

    // Badan / Baju Putih
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.24), matShirtWhite);
    torso.position.set(0, 0.38, -0.04);
    group.add(torso);

    // Tangan Bertumpu di Lutut
    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.08), matShirtWhite);
    armL.position.set(-0.22, 0.32, 0.06);
    armL.rotation.x = Math.PI / 5;
    group.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.32, 0.08), matShirtWhite);
    armR.position.set(0.22, 0.32, 0.06);
    armR.rotation.x = Math.PI / 5;
    group.add(armR);

    // Kepala & Wajah
    const head = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 12), matSkin);
    head.position.set(0, 0.68, -0.04);
    group.add(head);

    // Peci Hitam
    const peci = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.10, 12), matPeci);
    peci.position.set(0, 0.77, -0.04);
    group.add(peci);

    return group;
  }

  function createSeatedFemaleStudent() {
    const group = new THREE.Group();

    // Rok Panjang Lesehan
    const skirt = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.36, 0.32, 12), matSkirt);
    skirt.position.set(0, 0.16, 0);
    group.add(skirt);

    // Badan / Baju Putih
    const torso = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.42, 0.22), matShirtWhite);
    torso.position.set(0, 0.42, -0.02);
    group.add(torso);

    // Kerudung / Jilbab Menutupi Kepala dan Bahu
    const jilbabHead = new THREE.Mesh(new THREE.SphereGeometry(0.16, 14, 14), matJilbab);
    jilbabHead.position.set(0, 0.70, -0.02);
    group.add(jilbabHead);

    const jilbabCape = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.36, 12), matJilbab);
    jilbabCape.position.set(0, 0.50, -0.02);
    group.add(jilbabCape);

    // Wajah Terbuka
    const face = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), matSkin);
    face.position.set(0, 0.69, -0.10);
    group.add(face);

    return group;
  }

  // Penempatan Siswa Laki-Laki (Sayap Kanan / X > 0)
  const maleGrid = [
    { x: 1.5, z: -7.1 }, { x: 2.8, z: -7.1 }, { x: 4.1, z: -7.1 }, { x: 5.4, z: -7.1 },
    { x: 1.5, z: -5.7 }, { x: 2.8, z: -5.7 }, { x: 4.1, z: -5.7 }, { x: 5.4, z: -5.7 }
  ];
  maleGrid.forEach((pos) => {
    const student = createSeatedMaleStudent();
    student.position.set(pos.x, 0, pos.z);
    student.rotation.y = Math.PI; // Menghadap ke arah kiblat/layar materi (-Z)
    mapGroup.add(student);
  });

  // Penempatan Siswi Perempuan (Sayap Kiri / X < 0)
  const femaleGrid = [
    { x: -1.5, z: -7.1 }, { x: -2.8, z: -7.1 }, { x: -4.1, z: -7.1 }, { x: -5.4, z: -7.1 },
    { x: -1.5, z: -5.7 }, { x: -2.8, z: -5.7 }, { x: -4.1, z: -5.7 }, { x: -5.4, z: -5.7 }
  ];
  femaleGrid.forEach((pos) => {
    const student = createSeatedFemaleStudent();
    student.position.set(pos.x, 0, pos.z);
    student.rotation.y = Math.PI;
    mapGroup.add(student);
  });

  // =========================================================================
  // 9. REGISTER INTERACTABLES AREA MASJID
  // =========================================================================
  interactables.push({
    id: 'masjid_speaker',
    name: 'Moderator & Pemateri Seminar',
    role: 'Sesi Lesehan Materi SNBP/SNBT',
    position: new THREE.Vector3(0, 1.65, -6.80),
    actionText: 'Dengarkan Materi Seminar',
    dialogText: 'Selamat datang adik-adik kelas! Dalam sesi materi lesehan ini kami membedah strategi lolos SNBP berdasarkan pemetaan nilai rapor, trik sukses SNBT, serta informasi beasiswa kuliah.'
  });

  interactables.push({
    id: 'masjid_campus_talk',
    name: 'Perwakilan Kampus Sosialisasi',
    role: 'Unisla • Umla • Polteksi Semen Gresik',
    position: new THREE.Vector3(6.5, 1.65, -6.50),
    actionText: 'Konsultasi Beasiswa Kampus',
    dialogText: 'Halo! Kami dari Unisla, Umla, dan Polteksi siap menyajikan info jalur beasiswa khusus dan program studi unggulan untuk siswa SMA Negeri 3 Lamongan!'
  });

  interactables.push({
    id: 'masjid_wishlist',
    name: 'Kotak Wishlist Kampus Impian',
    role: 'Sesi Wishlist Siswa',
    position: new THREE.Vector3(-6.5, 1.65, -6.50),
    actionText: 'Tulis Kampus Impian',
    dialogText: 'Tuliskan nama universitas dan jurusan impianmu di selembar kertas harapan! Semoga kamu lolos di kampus pilihan pertamamu tahun 2026 ini!'
  });

  interactables.push({
    id: 'masjid_exit_door',
    name: 'Pintu Keluar Masjid',
    role: 'Akses Menuju Lapangan Expo',
    position: new THREE.Vector3(0, 1.65, roomD / 2 - 1.2),
    actionText: 'Keluar ke Lapangan Expo',
    isDoorToLapangan: true,
    dialogText: 'Berjalan keluar menuju Lapangan Expo Kampus...'
  });

  // Titik Spawn Siswa: Di Lantai Putih Belakang menghadap Kiblat (-Z)
  const spawnPoint = { x: 0, y: 1.65, z: roomD / 2 - 2.5, yaw: Math.PI };

  return { mapGroup, interactables, spawnPoint };
}