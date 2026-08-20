/**
 * mapLapangan.js - SMAGA Campus Fair 2027
 * Modul Denah 3D Area Lapangan Expo + Titik Interaksi Prosedural
 */

export function loadMapLapangan(scene) {
  const mapGroup = new THREE.Group();
  const interactables = [];

  // =========================================================================
  // 1. MATERIAL MASTER
  // =========================================================================
  const matField = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
  const matPlazaPath = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
  const matBuildingWall = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6 });
  const matBuildingCorridor = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
  const matRoof = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7, side: THREE.DoubleSide });
  const matGlassWindow = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.55, roughness: 0.2 });
  const matPillar = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.4 });
  const matPodiumIntegrated = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
  const matRedCarpet = new THREE.MeshStandardMaterial({ color: 0xbe123c, roughness: 0.8 });
  const matCardboardKraft = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.9 });
  const matTentRoof = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.35, roughness: 0.3, side: THREE.DoubleSide });
  const matTable = new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.5 });
  const matTentFrame = new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 1.5 });

  // Panggung Open Stage
  const matStageFloor = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.6, metalness: 0.1 });
  const matStageSkirt = new THREE.MeshStandardMaterial({ color: 0x090d16, roughness: 0.9 });
  const matSpeaker = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5 });

  // Welcome Gate Biru & Kayu
  const matWoodFrameBack = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.8 });
  const matWoodKaso = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.75 });
  const matSupportWood = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.85 });
  const matGateStructure = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4, metalness: 0.2 });
  const matGateBaseFoot = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.7 });
  const matGateGoldTrim = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.6 });
  const matGlowAccent = new THREE.MeshStandardMaterial({ color: 0x00f3ff, emissive: 0x00f3ff, emissiveIntensity: 0.7 });

  // Taman
  const matGardenGrass = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
  const matGardenCurb = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 });
  const matBushDark = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
  const matBushLight = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.8 });
  const matFlowerPink = new THREE.MeshStandardMaterial({ color: 0xf43f5e, roughness: 0.6 });
  const matFlowerYellow = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.6 });

  const lineCyan = new THREE.LineBasicMaterial({ color: 0x00f3ff, linewidth: 1.5 });
  const lineDark = new THREE.LineBasicMaterial({ color: 0x0f172a, linewidth: 1.2 });
  const lineRed = new THREE.LineBasicMaterial({ color: 0xf43f5e, linewidth: 2 });
  const lineYellow = new THREE.LineBasicMaterial({ color: 0xfacc15, linewidth: 1.5 });

  // =========================================================================
  // 2. HELPER FUNCTIONS
  // =========================================================================
  function createWireMesh(geo, mat, edgeMat = lineDark) {
    const mesh = new THREE.Mesh(geo, mat);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    const edges = new THREE.EdgesGeometry(geo);
    const line = new THREE.LineSegments(edges, edgeMat);
    mesh.add(line);
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
    const labelMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.4), new THREE.MeshBasicMaterial({ map: tex, side: THREE.DoubleSide }));
    return labelMesh;
  }

  // =========================================================================
  // 3. LAPANGAN SEKOLAH & PLAZA
  // =========================================================================
  const fieldZ = -5.00;
  const fieldMesh = new THREE.Mesh(new THREE.PlaneGeometry(22, 16), matField);
  fieldMesh.rotation.x = -Math.PI / 2;
  fieldMesh.position.set(0, 0.005, fieldZ);
  fieldMesh.receiveShadow = true;
  mapGroup.add(fieldMesh);

  const plazaMesh = new THREE.Mesh(new THREE.PlaneGeometry(42, 8.5), matPlazaPath);
  plazaMesh.rotation.x = -Math.PI / 2;
  plazaMesh.position.set(-8, 0.003, 7.25);
  plazaMesh.receiveShadow = true;
  mapGroup.add(plazaMesh);

  const borderPoints = [
    new THREE.Vector3(-11, 0.01, fieldZ - 8),
    new THREE.Vector3( 11, 0.01, fieldZ - 8),
    new THREE.Vector3( 11, 0.01, fieldZ + 8),
    new THREE.Vector3(-11, 0.01, fieldZ + 8),
    new THREE.Vector3(-11, 0.01, fieldZ - 8)
  ];
  const borderGeo = new THREE.BufferGeometry().setFromPoints(borderPoints);
  const borderLine = new THREE.Line(borderGeo, new THREE.LineDashedMaterial({ color: 0x00f3ff, dashSize: 0.6, gapSize: 0.4 }));
  borderLine.computeLineDistances();
  mapGroup.add(borderLine);

  const fieldLabel = createTextLabel('LAPANGAN EXPO', '22.00 x 16.00 m');
  fieldLabel.rotation.x = -Math.PI / 2;
  fieldLabel.position.set(0, 0.02, fieldZ);
  fieldLabel.scale.set(1.5, 1.5, 1.5);
  mapGroup.add(fieldLabel);

  // =========================================================================
  // 4. GEDUNG 2 LANTAI MEMANJANG (36.00 M) & PODIUM
  // =========================================================================
  const bldgW = 36.00, bldgD = 7.00, floorH = 3.60, bldgTotalH = 7.20, bldgZ = 16.00;
  const buildingGroup = new THREE.Group();

  const floor1Mesh = createWireMesh(new THREE.BoxGeometry(bldgW, floorH, bldgD), matBuildingWall, lineDark);
  floor1Mesh.position.set(0, floorH / 2, 0);
  buildingGroup.add(floor1Mesh);

  const floor2Mesh = createWireMesh(new THREE.BoxGeometry(bldgW, floorH, bldgD), matBuildingWall, lineDark);
  floor2Mesh.position.set(0, floorH + (floorH / 2), 0);
  buildingGroup.add(floor2Mesh);

  const corridorSlab = createWireMesh(new THREE.BoxGeometry(bldgW, 0.20, 1.60), matBuildingCorridor, lineDark);
  corridorSlab.position.set(0, floorH, -bldgD / 2 - 0.80);
  buildingGroup.add(corridorSlab);

  const railingMesh = createWireMesh(new THREE.BoxGeometry(bldgW, 0.90, 0.05), matPillar, lineCyan);
  railingMesh.position.set(0, floorH + 0.45, -bldgD / 2 - 1.55);
  buildingGroup.add(railingMesh);

  const pillarCount = 10;
  const pillarSpacing = bldgW / (pillarCount - 1);
  for (let i = 0; i < pillarCount; i++) {
    const px = -bldgW / 2 + (i * pillarSpacing);
    const p1 = createWireMesh(new THREE.BoxGeometry(0.35, floorH, 0.35), matPillar, lineDark);
    p1.position.set(px, floorH / 2, -bldgD / 2 - 1.55);
    buildingGroup.add(p1);

    const p2 = createWireMesh(new THREE.BoxGeometry(0.30, floorH, 0.30), matPillar, lineDark);
    p2.position.set(px, floorH + (floorH / 2), -bldgD / 2 - 1.55);
    buildingGroup.add(p2);
  }

  for (let r = 0; r < 8; r++) {
    const rx = -bldgW / 2 + (r * (bldgW / 8)) + (bldgW / 16);
    const win1 = createWireMesh(new THREE.BoxGeometry(2.40, 1.60, 0.08), matGlassWindow, lineCyan);
    win1.position.set(rx, 1.80, -bldgD / 2 - 0.02);
    buildingGroup.add(win1);

    const win2 = createWireMesh(new THREE.BoxGeometry(2.40, 1.60, 0.08), matGlassWindow, lineCyan);
    win2.position.set(rx, floorH + 1.80, -bldgD / 2 - 0.02);
    buildingGroup.add(win2);
  }

  const roofX1 = -bldgW / 2 - 0.60, roofX2 = bldgW / 2 + 0.60;
  const roofZFront = -bldgD / 2 - 1.85, roofZBack = bldgD / 2 + 0.65;
  const roofZRidge = (roofZFront + roofZBack) / 2;
  const roofEavesY = bldgTotalH, roofRidgeY = bldgTotalH + 2.20;

  const frontSlopeGeo = new THREE.BufferGeometry();
  frontSlopeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    roofX1, roofEavesY, roofZFront,   roofX2, roofEavesY, roofZFront,   roofX2, roofRidgeY, roofZRidge,
    roofX1, roofEavesY, roofZFront,   roofX2, roofRidgeY, roofZRidge,   roofX1, roofRidgeY, roofZRidge
  ]), 3));
  frontSlopeGeo.computeVertexNormals();
  buildingGroup.add(createWireMesh(frontSlopeGeo, matRoof, lineCyan));

  const backSlopeGeo = new THREE.BufferGeometry();
  backSlopeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    roofX2, roofEavesY, roofZBack,   roofX1, roofEavesY, roofZBack,   roofX1, roofRidgeY, roofZRidge,
    roofX2, roofEavesY, roofZBack,   roofX1, roofRidgeY, roofZRidge,   roofX2, roofRidgeY, roofZRidge
  ]), 3));
  backSlopeGeo.computeVertexNormals();
  buildingGroup.add(createWireMesh(backSlopeGeo, matRoof, lineCyan));

  const ridgeCap = createWireMesh(new THREE.BoxGeometry(roofX2 - roofX1 + 0.1, 0.08, 0.18), matRoof, lineCyan);
  ridgeCap.position.set(0, roofRidgeY + 0.04, roofZRidge);
  buildingGroup.add(ridgeCap);

  // Podium Terintegrasi Tengah
  const podW = 7.00, podD = 3.40, podH = 0.40, corridorFrontZ = -bldgD / 2 - 1.55;
  const podiumPlatform = createWireMesh(new THREE.BoxGeometry(podW, podH, podD), matPodiumIntegrated, lineYellow);
  podiumPlatform.position.set(0, podH / 2, corridorFrontZ - (podD / 2));
  buildingGroup.add(podiumPlatform);

  const canopy = createWireMesh(new THREE.BoxGeometry(podW, 0.20, podD), matBuildingCorridor, lineCyan);
  canopy.position.set(0, floorH, corridorFrontZ - (podD / 2));
  buildingGroup.add(canopy);

  [-podW / 2 + 0.20, podW / 2 - 0.20].forEach(cx => {
    const col = createWireMesh(new THREE.BoxGeometry(0.30, floorH, 0.30), matPillar, lineDark);
    col.position.set(cx, floorH / 2, corridorFrontZ - podD + 0.20);
    buildingGroup.add(col);
  });

  const frontStep = createWireMesh(new THREE.BoxGeometry(5.00, podH / 2, 0.60), matBuildingCorridor, lineDark);
  frontStep.position.set(0, podH / 4, corridorFrontZ - podD - 0.30);
  buildingGroup.add(frontStep);

  const bldgLabel = createTextLabel('GEDUNG 2 LANTAI (36.00 M)', 'RUANG GURU & KELAS');
  bldgLabel.position.set(0, bldgTotalH + 0.9, -bldgD / 2 - 1.6);
  bldgLabel.scale.set(1.4, 1.4, 1.4);
  buildingGroup.add(bldgLabel);

  buildingGroup.position.set(0, 0, bldgZ);
  mapGroup.add(buildingGroup);

  // =========================================================================
  // 5. GEDUNG PERPUSTAKAAN (1 LANTAI, X = -30.00 M)
  // =========================================================================
  const libW = 12.00, libD = 7.00, libH = 3.80, libZ = 16.00, libCenterX = -30.00;
  const libraryGroup = new THREE.Group();

  const libBody = createWireMesh(new THREE.BoxGeometry(libW, libH, libD), matBuildingWall, lineDark);
  libBody.position.set(0, libH / 2, 0);
  libraryGroup.add(libBody);

  const libCorridor = createWireMesh(new THREE.BoxGeometry(libW, 0.20, 1.60), matBuildingCorridor, lineDark);
  libCorridor.position.set(0, 0.10, -libD / 2 - 0.80);
  libraryGroup.add(libCorridor);

  for (let p = 0; p < 4; p++) {
    const px = -libW / 2 + (p * (libW / 3));
    const col = createWireMesh(new THREE.BoxGeometry(0.30, libH, 0.30), matPillar, lineDark);
    col.position.set(px, libH / 2, -libD / 2 - 1.55);
    libraryGroup.add(col);
  }

  for (let r = 0; r < 3; r++) {
    const rx = -libW / 2 + (r * 4.00) + 2.00;
    const win = createWireMesh(new THREE.BoxGeometry(2.40, 1.80, 0.08), matGlassWindow, lineCyan);
    win.position.set(rx, 2.00, -libD / 2 - 0.02);
    libraryGroup.add(win);
  }

  const libRoofX1 = -libW / 2 - 0.60, libRoofX2 = libW / 2 + 0.60;
  const libRoofRidgeY = libH + 1.80;

  const libFrontSlopeGeo = new THREE.BufferGeometry();
  libFrontSlopeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    libRoofX1, libH, roofZFront,   libRoofX2, libH, roofZFront,   libRoofX2, libRoofRidgeY, roofZRidge,
    libRoofX1, libH, roofZFront,   libRoofX2, libRoofRidgeY, roofZRidge,   libRoofX1, libRoofRidgeY, roofZRidge
  ]), 3));
  libFrontSlopeGeo.computeVertexNormals();
  libraryGroup.add(createWireMesh(libFrontSlopeGeo, matRoof, lineCyan));

  const libBackSlopeGeo = new THREE.BufferGeometry();
  libBackSlopeGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
    libRoofX2, libH, roofZBack,   libRoofX1, libH, roofZBack,   libRoofX1, libRoofRidgeY, roofZRidge,
    libRoofX2, libH, roofZBack,   libRoofX1, libRoofRidgeY, roofZRidge,   libRoofX2, libRoofRidgeY, roofZRidge
  ]), 3));
  libBackSlopeGeo.computeVertexNormals();
  libraryGroup.add(createWireMesh(libBackSlopeGeo, matRoof, lineCyan));

  const libRidgeCap = createWireMesh(new THREE.BoxGeometry(libRoofX2 - libRoofX1 + 0.1, 0.08, 0.18), matRoof, lineCyan);
  libRidgeCap.position.set(0, libRoofRidgeY + 0.04, roofZRidge);
  libraryGroup.add(libRidgeCap);

  const libLabel = createTextLabel('PERPUSTAKAAN', '1 LANTAI');
  libLabel.position.set(0, libH + 1.1, -libD / 2 - 1.6);
  libLabel.scale.set(1.3, 1.3, 1.3);
  libraryGroup.add(libLabel);

  libraryGroup.position.set(libCenterX, 0, libZ);
  mapGroup.add(libraryGroup);

  // =========================================================================
  // 6. PHOTOBOOTH UTAMA DI GAP 6M (TEMBOK PERPUS, X = -24.00 M)
  // =========================================================================
  const pbGroup = new THREE.Group();
  const pbStageW = 2.00, pbStageL = 3.00, pbStageH = 0.20;

  function createPBTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#0284c7';
    ctx.fillRect(0, 0, 1200, 800);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 6;
    ctx.setLineDash([16, 12]);
    ctx.strokeRect(50, 50, 1100, 700);

    ctx.setLineDash([]);
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 82px sans-serif';
    ctx.fillText('tema blom ada', 600, 400);

    ctx.font = 'bold 32px sans-serif';
    ctx.fillStyle = '#bae6fd';
    ctx.fillText('( [ DRAFT BACKDROP 3x2m ] )', 600, 490);

    return new THREE.CanvasTexture(canvas);
  }

  const matPBBackdrop = new THREE.MeshStandardMaterial({ map: createPBTexture(), roughness: 0.5 });
  const pbStage = createWireMesh(new THREE.BoxGeometry(pbStageW, pbStageH, pbStageL), matBuildingWall, lineDark);
  pbStage.position.set(-24.00 + pbStageW / 2, pbStageH / 2, 14.50);
  pbGroup.add(pbStage);

  const pbCarpet = createWireMesh(new THREE.BoxGeometry(pbStageW, 0.015, pbStageL), matRedCarpet, lineRed);
  pbCarpet.position.set(-24.00 + pbStageW / 2, pbStageH + 0.0075, 14.50);
  pbGroup.add(pbCarpet);

  const pbBackdropMesh = createWireMesh(new THREE.BoxGeometry(0.06, 2.00, pbStageL), matPBBackdrop, lineCyan);
  pbBackdropMesh.position.set(-23.96, pbStageH + 1.00, 14.50);
  pbGroup.add(pbBackdropMesh);

  function createCardboardLetter(char, colorHex) {
    const group = new THREE.Group();
    const faceMat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.6 });
    const thick = 0.06, depth = 0.08, H = 0.38, W = 0.22;

    function addBar(w, h, x, y) {
      const b = createWireMesh(new THREE.BoxGeometry(depth, h, w), faceMat, lineDark);
      b.position.set(0, y, x);
      group.add(b);
    }

    if (char === 'S') {
      addBar(W, thick, 0, H/2 - thick/2);
      addBar(thick, H/2, -W/2 + thick/2, H/4);
      addBar(W, thick, 0, 0);
      addBar(thick, H/2, W/2 - thick/2, -H/4);
      addBar(W, thick, 0, -H/2 + thick/2);
    } else if (char === 'C') {
      addBar(W, thick, 0, H/2 - thick/2);
      addBar(thick, H, -W/2 + thick/2, 0);
      addBar(W, thick, 0, -H/2 + thick/2);
    } else if (char === 'F') {
      addBar(thick, H, -W/2 + thick/2, 0);
      addBar(W, thick, 0, H/2 - thick/2);
      addBar(W * 0.7, thick, -0.02, 0.02);
    } else if (char === '2') {
      addBar(W, thick, 0, H/2 - thick/2);
      addBar(thick, H/2, W/2 - thick/2, H/4);
      addBar(W, thick, 0, 0);
      addBar(thick, H/2, -W/2 + thick/2, -H/4);
      addBar(W, thick, 0, -H/2 + thick/2);
    } else if (char === '0') {
      addBar(thick, H, -W/2 + thick/2, 0);
      addBar(thick, H, W/2 - thick/2, 0);
      addBar(W, thick, 0, H/2 - thick/2);
      addBar(W, thick, 0, -H/2 + thick/2);
    } else if (char === '7') {
      addBar(W, thick, 0, H/2 - thick/2);
      addBar(thick, H, W/2 - thick/2, 0);
    }

    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.30, 0.04), matCardboardKraft);
    leg.rotation.z = 0.35;
    leg.position.set(-0.08, -0.05, 0);
    group.add(leg);

    return group;
  }

  const letters = [
    { char: 'S', color: 0xfacc15 }, { char: 'C', color: 0xf43f5e }, { char: 'F', color: 0x00f3ff },
    { char: '2', color: 0x4ade80 }, { char: '0', color: 0xfb923c }, { char: '2', color: 0xa855f7 }, { char: '7', color: 0xfde047 }
  ];

  letters.forEach((item, idx) => {
    const lMesh = createCardboardLetter(item.char, item.color);
    const lz = 13.35 + (idx * 0.36) + (idx >= 3 ? 0.06 : -0.06);
    lMesh.position.set(-21.85, pbStageH + 0.19, lz);
    pbGroup.add(lMesh);
  });

  mapGroup.add(pbGroup);

  // Register Interaksi Photobooth Utama
  interactables.push({
    id: 'photobooth_main',
    name: 'Fotografer Panitia',
    role: 'Red Carpet Photobooth SCF 2027',
    position: new THREE.Vector3(-22.0, 1.65, 14.5),
    actionText: 'Foto di Red Carpet',
    dialogText: 'Keren banget outfit-mu hari ini! Ayo berpose bareng teman-teman di atas Red Carpet dengan backdrop dan huruf timbul SCF 2027!'
  });

  // =========================================================================
  // 7. PANGGUNG UTAMA OPEN STAGE (NEMPEL PODIUM, Z = 5.25 M)
  // =========================================================================
  function createOpenCleanStage() {
    const stageGroup = new THREE.Group();
    const sW = 6.00, sD = 4.00, sH = 0.50;

    const stageBase = new THREE.Mesh(
      new THREE.BoxGeometry(sW, sH, sD),
      [matStageSkirt, matStageSkirt, matStageFloor, matStageSkirt, matStageSkirt, matStageSkirt]
    );
    stageBase.position.set(0, sH / 2, 0);
    stageBase.receiveShadow = true;
    stageBase.castShadow = true;
    stageGroup.add(stageBase);

    const stageCarpet = new THREE.Mesh(new THREE.PlaneGeometry(2.40, sD - 0.1), matRedCarpet);
    stageCarpet.rotation.x = -Math.PI / 2;
    stageCarpet.position.set(0, sH + 0.005, 0);
    stageGroup.add(stageCarpet);

    [-sW / 2 - 0.55, sW / 2 + 0.55].forEach(sx => {
      const sub = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.70, 0.65), matSpeaker);
      sub.position.set(sx, 0.35, -sD / 2 + 0.6);
      stageGroup.add(sub);

      const top1 = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.35, 0.45), matSpeaker);
      top1.position.set(sx, 0.70 + 0.18, -sD / 2 + 0.6);
      stageGroup.add(top1);

      const top2 = new THREE.Mesh(new THREE.BoxGeometry(0.70, 0.35, 0.45), matSpeaker);
      top2.position.set(sx, 0.70 + 0.55, -sD / 2 + 0.6);
      top2.rotation.x = -0.06;
      stageGroup.add(top2);
    });

    [-1.8, 1.8].forEach(mx => {
      const mon = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.20, 0.30), matSpeaker);
      mon.rotation.x = 0.35;
      mon.position.set(mx, sH + 0.10, -sD / 2 + 0.35);
      stageGroup.add(mon);
    });

    const podium = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.05, 0.35), matPodiumIntegrated);
    podium.position.set(1.5, sH + 0.525, -sD / 2 + 0.9);
    stageGroup.add(podium);

    const micStem = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.35), matPillar);
    micStem.rotation.x = 0.3;
    micStem.position.set(1.5, sH + 1.15, -sD / 2 + 0.85);
    stageGroup.add(micStem);

    const label = createTextLabel('PANGGUNG UTAMA', '6.00 x 4.00 m (OPEN STAGE 0.50 M)');
    label.position.set(0, sH + 1.4, 0);
    label.scale.set(1.1, 1.1, 1.1);
    stageGroup.add(label);

    return stageGroup;
  }

  const expoStage = createOpenCleanStage();
  expoStage.position.set(0, 0, 5.25);
  mapGroup.add(expoStage);

  // Register Interaksi Panggung Utama
  interactables.push({
    id: 'stage_main',
    name: 'MC Panggung Utama',
    role: 'Main Stage Schedule',
    position: new THREE.Vector3(0, 1.65, 3.8),
    actionText: 'Cek Rundown & Penampilan',
    dialogText: 'Selamat datang di Campus Fair 2027! Saat ini di Lapangan sedang bersiap Sesi A: Parade Universitas. Nanti di Sesi B ada Teater, dan Sesi C penampilan Modern Dance!'
  });

  // =========================================================================
  // 8. 10 UNIT TEROP STAND (TOTAL 28 MEJA UNIVERSITAS)
  // =========================================================================
  function createTerop(x, z, rotY, teropName, univCount, teropId, campusNames) {
    const group = new THREE.Group();
    const tW = 5.50, tD = 3.50, tH = 2.30, tPeak = 3.00;

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(tW, tD), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0.01;
    group.add(floor);

    const halfW = tW / 2, halfD = tD / 2;
    [[-halfW, -halfD], [halfW, -halfD], [halfW, halfD], [-halfW, halfD]].forEach(([px, pz]) => {
      const postGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(px, 0, pz),
        new THREE.Vector3(px, tH, pz)
      ]);
      group.add(new THREE.Line(postGeo, matTentFrame));
    });

    const roofPoints = [
      new THREE.Vector3(-halfW, tH, halfD), new THREE.Vector3(halfW, tH, halfD),
      new THREE.Vector3(halfW, tH, -halfD), new THREE.Vector3(-halfW, tH, -halfD),
      new THREE.Vector3(-halfW, tH, halfD), new THREE.Vector3(0, tPeak, 0),
      new THREE.Vector3(halfW, tH, halfD), new THREE.Vector3(0, tPeak, 0),
      new THREE.Vector3(halfW, tH, -halfD), new THREE.Vector3(0, tPeak, 0),
      new THREE.Vector3(-halfW, tH, -halfD)
    ];
    group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(roofPoints), matTentFrame));

    const roofPyramidGeo = new THREE.ConeGeometry(3.6, tPeak - tH, 4);
    const roofMesh = new THREE.Mesh(roofPyramidGeo, matTentRoof);
    roofMesh.position.set(0, tH + (tPeak - tH) / 2, 0);
    roofMesh.rotation.y = Math.PI / 4;
    group.add(roofMesh);

    const tableSpacing = tW / (univCount + 1);
    for (let i = 1; i <= univCount; i++) {
      const tblX = -halfW + (i * tableSpacing);
      const tbl = createWireMesh(new THREE.BoxGeometry(1.20, 0.75, 0.50), matTable, lineDark);
      tbl.position.set(tblX, 0.375, 0.40);
      group.add(tbl);

      [-0.3, 0.3].forEach(cx => {
        const chair = createWireMesh(new THREE.BoxGeometry(0.35, 0.45, 0.35), new THREE.MeshStandardMaterial({ color: 0x475569 }), lineDark);
        chair.position.set(tblX + cx, 0.225, -0.25);
        group.add(chair);
      });
    }

    const label = createTextLabel(teropName, `${univCount} UNIV`);
    label.position.set(0, tPeak + 0.75, 0);
    group.add(label);

    const arrowGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0.06, halfD + 0.2),
      new THREE.Vector3(0, 0.06, halfD + 1.1)
    ]);
    group.add(new THREE.Line(arrowGeo, lineRed));

    group.position.set(x, 0, z);
    group.rotation.y = rotY;

    // Register Interaksi Stan
    interactables.push({
      id: teropId,
      name: campusNames,
      role: `Stan ${teropName} (${univCount} Kampus)`,
      position: new THREE.Vector3(x, 1.65, z),
      actionText: 'Konsultasi Jurusan & Stempel',
      dialogText: `Halo siswa SMAGA! Selamat datang di stan ${campusNames}. Mau tahu informasi passing grade, jalur beasiswa, atau prospek kerja lulusan kami? Ini stempel resmi untuk buku passport expo-mu!`
    });

    return group;
  }

  // Baris Sisi Utara / Lapangan (Z = -15.50 m)
  mapGroup.add(createTerop(-8.7, fieldZ - 10.5, 0, 'TEROP 04', 3, 'terop_04', 'Universitas Indonesia (UI) & ITB'));
  mapGroup.add(createTerop(-2.9, fieldZ - 10.5, 0, 'TEROP 05', 3, 'terop_05', 'Universitas Diponegoro (UNDIP) & UNS'));
  mapGroup.add(createTerop( 2.9, fieldZ - 10.5, 0, 'TEROP 06', 3, 'terop_06', 'Universitas Padjadjaran (UNPAD) & IPB'));
  mapGroup.add(createTerop( 8.7, fieldZ - 10.5, 0, 'TEROP 07', 2, 'terop_07', 'UPN Veteran & Politeknik Negeri'));

  // Baris Sisi Timur (X = -13.50 m)
  mapGroup.add(createTerop(-13.5, fieldZ - 5.0, -Math.PI / 2, 'TEROP 03', 3, 'terop_03', 'Universitas Gadjah Mada (UGM) & UNY'));
  mapGroup.add(createTerop(-13.5, fieldZ + 0.5, -Math.PI / 2, 'TEROP 02', 3, 'terop_02', 'Universitas Brawijaya (UB) & UM'));
  mapGroup.add(createTerop(-13.5, fieldZ + 6.0, -Math.PI / 2, 'TEROP 01', 3, 'terop_01', 'Universitas Airlangga (UNAIR) & ITS'));

  // Baris Sisi Barat (X = +13.50 m)
  mapGroup.add(createTerop( 13.5, fieldZ - 5.0, Math.PI / 2, 'TEROP 08', 3, 'terop_08', 'Universitas Jember (UNEJ) & Trunojoyo'));
  mapGroup.add(createTerop( 13.5, fieldZ + 0.5, Math.PI / 2, 'TEROP 09', 3, 'terop_09', 'PTS Unggulan (Telkom, UMM, Petra)'));
  mapGroup.add(createTerop( 13.5, fieldZ + 6.0, Math.PI / 2, 'TEROP 10', 2, 'terop_10', 'Sekolah Kedinasan (STAN, STIS, IPDN)'));

  // =========================================================================
  // 9. TAMAN TIMUR (X = -17.35 M)
  // =========================================================================
  function createEastGardenNearPerpus() {
    const gardenGroup = new THREE.Group();
    const gardenW = 1.20, gardenL = 18.00, gardenH = 0.18, gardenX = -17.35, gardenZ = -5.00;

    const curbMesh = createWireMesh(new THREE.BoxGeometry(gardenW + 0.16, gardenH, gardenL + 0.16), matGardenCurb, lineDark);
    curbMesh.position.set(gardenX, gardenH / 2, gardenZ);
    gardenGroup.add(curbMesh);

    const grassMesh = new THREE.Mesh(new THREE.BoxGeometry(gardenW, gardenH + 0.04, gardenL), matGardenGrass);
    grassMesh.position.set(gardenX, (gardenH + 0.04) / 2, gardenZ);
    grassMesh.receiveShadow = true;
    gardenGroup.add(grassMesh);

    const bushCount = 14;
    const stepZ = (gardenL - 1.5) / (bushCount - 1);
    for (let i = 0; i < bushCount; i++) {
      const bz = (gardenZ - gardenL / 2 + 0.75) + (i * stepZ);
      const bx = gardenX + ((i % 2 === 0 ? 0.12 : -0.12));
      const bushRadius = 0.32 + ((i % 3) * 0.06);

      const shrubGeo = new THREE.DodecahedronGeometry(bushRadius, 1);
      const shrubMat = (i % 2 === 0) ? matBushDark : matBushLight;
      const shrubMesh = new THREE.Mesh(shrubGeo, shrubMat);
      shrubMesh.castShadow = true;
      shrubMesh.position.set(bx, gardenH + bushRadius * 0.7, bz);
      shrubMesh.rotation.set(i * 0.4, i * 0.8, 0);
      gardenGroup.add(shrubMesh);

      if (i % 2 === 1) {
        const flowerGeo = new THREE.SphereGeometry(0.10, 6, 6);
        const flowerMat = (i % 4 === 1) ? matFlowerPink : matFlowerYellow;
        const flowerMesh = new THREE.Mesh(flowerGeo, flowerMat);
        flowerMesh.position.set(bx, gardenH + (bushRadius * 1.4), bz);
        gardenGroup.add(flowerMesh);
      }
    }

    const gardenLabel = createTextLabel('TAMAN TIMUR', '1.20 x 18.00 M', '#4ade80');
    gardenLabel.rotation.y = Math.PI / 2;
    gardenLabel.position.set(gardenX + 0.75, 1.20, gardenZ);
    gardenLabel.scale.set(1.2, 1.2, 1.2);
    gardenGroup.add(gardenLabel);

    return gardenGroup;
  }
  mapGroup.add(createEastGardenNearPerpus());

  // =========================================================================
  // 10. ENHANCED BLUE WELCOME GATE (Z = +6.00 M)
  // =========================================================================
  function createEnhancedBlueWelcomeGate() {
    const gateGroup = new THREE.Group();
    const totalW = 4.40, totalH = 3.40, gateDepth = 0.65;
    const pillarW = 0.70, pillarH = 2.65, beamH = 0.75;
    const portalClearW = 3.00, portalClearH = 2.65;
    const pillarCenterX = (totalW / 2) - (pillarW / 2);

    [-pillarCenterX, pillarCenterX].forEach(px => {
      const plinth = createWireMesh(new THREE.BoxGeometry(pillarW + 0.16, 0.18, gateDepth + 0.20), matGateBaseFoot, lineDark);
      plinth.position.set(px, 0.09, 0);
      gateGroup.add(plinth);

      const pMesh = createWireMesh(new THREE.BoxGeometry(pillarW, pillarH - 0.18, gateDepth), matGateStructure, lineCyan);
      pMesh.position.set(px, 0.18 + (pillarH - 0.18) / 2, 0);
      gateGroup.add(pMesh);

      const neonStrip = new THREE.Mesh(new THREE.BoxGeometry(0.04, pillarH - 0.30, gateDepth + 0.02), matGlowAccent);
      neonStrip.position.set(px, 0.18 + (pillarH - 0.18) / 2, 0);
      gateGroup.add(neonStrip);

      const cap = createWireMesh(new THREE.BoxGeometry(pillarW + 0.10, 0.10, gateDepth + 0.10), matGateGoldTrim, lineYellow);
      cap.position.set(px, pillarH + 0.05, 0);
      gateGroup.add(cap);

      const foot = createWireMesh(new THREE.BoxGeometry(0.09, 0.06, 1.60), matSupportWood, lineDark);
      foot.position.set(px, 0.03, 0);
      gateGroup.add(foot);

      const strutF = createWireMesh(new THREE.BoxGeometry(0.06, 1.70, 0.06), matSupportWood, lineDark);
      strutF.position.set(px, 0.85, 0.40);
      strutF.rotation.x = 0.45;
      gateGroup.add(strutF);

      const strutB = createWireMesh(new THREE.BoxGeometry(0.06, 1.70, 0.06), matSupportWood, lineDark);
      strutB.position.set(px, 0.85, -0.40);
      strutB.rotation.x = -0.45;
      gateGroup.add(strutB);
    });

    const beamMesh = createWireMesh(new THREE.BoxGeometry(totalW + 0.20, beamH, gateDepth), matGateStructure, lineCyan);
    beamMesh.position.set(0, pillarH + beamH / 2, 0);
    gateGroup.add(beamMesh);

    const topCrown = createWireMesh(new THREE.BoxGeometry(totalW + 0.35, 0.12, gateDepth + 0.08), matGateGoldTrim, lineYellow);
    topCrown.position.set(0, totalH + 0.06, 0);
    gateGroup.add(topCrown);

    function makeEnhancedBluePortalTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1760;
      canvas.height = 1360;
      const ctx = canvas.getContext('2d');

      const grad = ctx.createLinearGradient(0, 0, 1760, 1360);
      grad.addColorStop(0, '#0369a1');
      grad.addColorStop(0.3, '#0284c7');
      grad.addColorStop(0.7, '#0ea5e9');
      grad.addColorStop(1, '#075985');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1760, 1360);

      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 18;
      ctx.strokeRect(25, 25, 1710, 1310);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('★ SMAGA CAMPUS FAIR 2027 ★', 880, 95);

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 78px sans-serif';
      ctx.fillText('SELAMAT DATANG DI EXPO', 880, 180);

      ctx.fillStyle = '#bae6fd';
      ctx.font = 'bold 32px sans-serif';
      ctx.fillText('GERBANG MENUJU PERGURUAN TINGGI IMPIAN', 880, 240);

      [140, 1620].forEach(cx => {
        for(let y = 350; y <= 1120; y += 185) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(cx - 100, y, 200, 95);
          ctx.fillStyle = '#0f172a';
          ctx.font = 'bold 22px sans-serif';
          ctx.fillText('SPONSOR', cx, y + 54);
        }
      });

      return new THREE.CanvasTexture(canvas);
    }

    const matPortalFace = new THREE.MeshStandardMaterial({ map: makeEnhancedBluePortalTexture(), roughness: 0.35, side: THREE.DoubleSide });
    const portalShape = new THREE.Shape();
    portalShape.moveTo(-totalW / 2, 0);
    portalShape.lineTo( totalW / 2, 0);
    portalShape.lineTo( totalW / 2, totalH);
    portalShape.lineTo(-totalW / 2, totalH);
    portalShape.closePath();

    const portalHole = new THREE.Path();
    portalHole.moveTo(-portalClearW / 2, 0);
    portalHole.lineTo( portalClearW / 2, 0);
    portalHole.lineTo( portalClearW / 2, portalClearH);
    portalHole.lineTo(-portalClearW / 2, portalClearH);
    portalHole.closePath();
    portalShape.holes.push(portalHole);

    const portalGeoFront = new THREE.ShapeGeometry(portalShape);
    const portalMeshFront = new THREE.Mesh(portalGeoFront, matPortalFace);
    portalMeshFront.position.set(0, 0, gateDepth / 2 + 0.008);
    gateGroup.add(portalMeshFront);

    const portalGeoBack = new THREE.ShapeGeometry(portalShape);
    const portalMeshBack = new THREE.Mesh(portalGeoBack, matPortalFace);
    portalMeshBack.rotation.y = Math.PI;
    portalMeshBack.position.set(0, 0, -gateDepth / 2 - 0.008);
    gateGroup.add(portalMeshBack);

    return gateGroup;
  }

  const welcomeGate = createEnhancedBlueWelcomeGate();
  welcomeGate.position.set(-11.80, 0, 6.00);
  welcomeGate.rotation.y = -Math.PI / 3.2; 
  mapGroup.add(welcomeGate);

  // Register Interaksi Welcome Gate
  interactables.push({
    id: 'welcome_gate',
    name: 'Panitia Registrasi',
    role: 'Welcome Gate Portal',
    position: new THREE.Vector3(-11.80, 1.65, 6.00),
    actionText: 'Check-In & Ambil Passport',
    dialogText: 'Halo siswa SMAGA! Selamat datang di Campus Fair 2027. Silakan ambil Expo Passport-mu dan kunjungi stan-stan universitas untuk mendapatkan stempel!'
  });

  // =========================================================================
  // 11. 2 UNIT PHOTOBOOTH FRAME STANDING
  // =========================================================================
  function createPhotoboothFrameItem(frameId, frameRole) {
    const group = new THREE.Group();
    const W = 1.22, H = 2.00, T = 0.03;
    const holeW = 0.82, holeH = 1.10, holeBottomY = 0.65;

    function makeFrameTexture() {
      const canvas = document.createElement('canvas');
      canvas.width = 1220;
      canvas.height = 2000;
      const ctx = canvas.getContext('2d');

      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(0, 0, 1220, 2000);
      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 14;
      ctx.strokeRect(20, 20, 1180, 1960);

      ctx.textAlign = 'center';
      ctx.fillStyle = '#0284c7';
      ctx.font = 'bold 110px sans-serif';
      ctx.fillText('SCF 2027', 610, 130);
      ctx.fillStyle = '#f59e0b';
      ctx.font = 'bold 34px sans-serif';
      ctx.fillText('★ SMAGA CAMPUS FAIR ★', 610, 200);

      ctx.fillStyle = '#0f172a';
      ctx.fillRect(80, 1420, 1060, 240);
      ctx.fillStyle = '#00f3ff';
      ctx.font = 'bold 64px sans-serif';
      ctx.fillText('SMAGA CAMPUS FAIR', 610, 1500);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 36px sans-serif';
      ctx.fillText('#FutureStartsHere • 2027', 610, 1580);

      return new THREE.CanvasTexture(canvas);
    }

    const matGraphic = new THREE.MeshStandardMaterial({ map: makeFrameTexture(), roughness: 0.4 });
    const shape = new THREE.Shape();
    shape.moveTo(-W/2, 0); shape.lineTo( W/2, 0); shape.lineTo( W/2, H); shape.lineTo(-W/2, H); shape.closePath();

    const hole = new THREE.Path();
    hole.moveTo(-holeW/2, holeBottomY); hole.lineTo( holeW/2, holeBottomY); hole.lineTo( holeW/2, holeBottomY + holeH); hole.lineTo(-holeW/2, holeBottomY + holeH); hole.closePath();
    shape.holes.push(hole);

    const frameGeo = new THREE.ExtrudeGeometry(shape, { depth: T, bevelEnabled: false });
    const frameMesh = new THREE.Mesh(frameGeo, [matGraphic, matWoodKaso]);
    frameMesh.position.set(0, 0, -T / 2);
    frameMesh.castShadow = true;
    group.add(frameMesh);

    [-0.50, 0.50].forEach(kx => {
      const leg = createWireMesh(new THREE.BoxGeometry(0.04, 1.65, 0.04), matWoodFrameBack, lineDark);
      leg.rotation.x = -0.38;
      leg.position.set(kx, 0.75, -0.36);
      group.add(leg);

      const foot = createWireMesh(new THREE.BoxGeometry(0.04, 0.03, 0.80), matWoodFrameBack, lineDark);
      foot.position.set(kx, 0.015, -0.38);
      group.add(foot);
    });

    return group;
  }

  const frame1 = createPhotoboothFrameItem('frame_1', 'Spot Foto Sayap Timur');
  frame1.position.set(-10.20, 0, 1.50);
  frame1.rotation.y = Math.PI / 6;
  mapGroup.add(frame1);

  interactables.push({
    id: 'frame_1',
    name: 'Standing Frame Timur',
    role: 'Spot Foto Mahasiswa',
    position: new THREE.Vector3(-10.20, 1.65, 1.50),
    actionText: 'Ambil Foto Frame',
    dialogText: 'Cekrekk! Foto di frame SCF 2027 berhasil disimpan. Keren banget posemu bareng teman-teman!'
  });

  const frame2 = createPhotoboothFrameItem('frame_2', 'Spot Foto Sayap Barat');
  frame2.position.set(10.20, 0, 1.50);
  frame2.rotation.y = -Math.PI / 6;
  mapGroup.add(frame2);

  interactables.push({
    id: 'frame_2',
    name: 'Standing Frame Barat',
    role: 'Spot Foto Mahasiswa',
    position: new THREE.Vector3(10.20, 1.65, 1.50),
    actionText: 'Ambil Foto Frame',
    dialogText: 'Cekrekk! Spot foto estetik di depan stan universitas barat siap diunggah ke media sosial!'
  });

  // =========================================================================
  // 12. ALUR JALUR SIRKULASI & MATA ANGIN 3D
  // =========================================================================
  const flowPoints = [
    new THREE.Vector3(-21.0, 0.05, 20.0),
    new THREE.Vector3(-21.0, 0.05, 11.0),
    new THREE.Vector3(-14.5, 0.05,  8.0),
    new THREE.Vector3(-11.8, 0.05,  6.0),
    new THREE.Vector3(-7.0,  0.05, -1.0)
  ];
  const flowGeo = new THREE.BufferGeometry().setFromPoints(flowPoints);
  const flowLine = new THREE.Line(flowGeo, new THREE.LineDashedMaterial({ color: 0xf43f5e, dashSize: 0.8, gapSize: 0.4 }));
  flowLine.computeLineDistances();
  mapGroup.add(flowLine);

  function create3DCompass(x, z) {
    const compassGroup = new THREE.Group();
    const outerRing = new THREE.Mesh(new THREE.RingGeometry(3.6, 3.8, 48), new THREE.MeshBasicMaterial({ color: 0x00f3ff, side: THREE.DoubleSide }));
    outerRing.rotation.x = -Math.PI / 2;
    outerRing.position.y = 0.02;
    compassGroup.add(outerRing);

    function makeArrowBlade(dirX, dirZ, length, width, colorHex) {
      const perpX = -dirZ * (width / 2);
      const perpZ =  dirX * (width / 2);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array([
        0, 0.03, 0, dirX * length, 0.03, dirZ * length, perpX, 0.03, perpZ,
        0, 0.03, 0, -perpX, 0.03, -perpZ, dirX * length, 0.03, dirZ * length
      ]), 3));
      geo.computeVertexNormals();
      return new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: colorHex, side: THREE.DoubleSide }));
    }

    compassGroup.add(makeArrowBlade(0, -1, 4.4, 0.9, 0x38bdf8));
    compassGroup.add(makeArrowBlade(0, 1, 4.4, 0.9, 0xf43f5e));
    compassGroup.add(makeArrowBlade(-1, 0, 4.4, 0.9, 0xfacc15));
    compassGroup.add(makeArrowBlade(1, 0, 4.4, 0.9, 0x00f3ff));
    compassGroup.position.set(x, 0, z);
    return compassGroup;
  }
  mapGroup.add(create3DCompass(21.0, -6.0));

  scene.add(mapGroup);

  // Titik Spawn Awal Karakter Siswa (Di lorong gap masuk menghadap ke Lapangan)
  const spawnPoint = {
    x: -21.0,
    y: 1.65,
    z: 17.5,
    yaw: 0 // Menghadap ke Utara (-Z)
  };

  return { mapGroup, interactables, spawnPoint };
}