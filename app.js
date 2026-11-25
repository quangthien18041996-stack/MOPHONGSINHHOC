/**
 * ====================================================================
 * MÔ PHỎNG 3D HỆ TUẦN HOÀN MÁU (HUMAN CIRCULATORY SYSTEM 3D)
 * Phục vụ giảng dạy & học tập trực quan theo chương trình Sinh học
 * ====================================================================
 */

// --- 1. BIẾN TOÀN CỤC & TRẠNG THÁI ---
const state = {
  isPlaying: true,
  speed: 1.0,
  showCells: true,
  showArrows: true,
  showLabels: true,
  heartTransparent: false,
  soundEnabled: false,
  voiceEnabled: true, // Tự động đọc giọng nói thuyết minh khi chọn bộ phận
  currentMode: 'all', // 'all', 'pulmonary', 'systemic', 'heart'
  selectedPart: null,
  time: 0
};

// --- 2. CƠ SỞ DỮ LIỆU BÀI HỌC (THEO CHUẨN SGK SINH HỌC) ---
const ANATOMY_DATA = {
  'capillaries-lungs': {
    name: 'Mao mạch phổi',
    badge: 'Vòng tuần hoàn nhỏ',
    badgeClass: 'pulmonary',
    colorType: 'purple-exchange',
    bloodDesc: 'Trao đổi khí: Biến đổi từ Máu đỏ thẫm (giàu CO₂) thành Máu đỏ tươi (giàu O₂)',
    from: 'Động mạch phổi',
    to: 'Tĩnh mạch phổi',
    desc: 'Lưới mao mạch phổi bao quanh hàng triệu phế nang. Tại đây diễn ra sự khuếch tán khí theo gradient nồng độ: CO₂ từ máu thấm qua màng mao mạch - phế nang đi ra ngoài phế nang để thở ra ngoài, đồng thời O₂ từ phế nang khuếch tán vào máu gắn với Hemoglobin (Hb) trong hồng cầu.',
    keyPoints: [
      'Thành mao mạch rất mỏng (chỉ gồm 1 lớp tế bào nội mô) giúp trao đổi khí cực nhanh.',
      'Máu sau khi qua mao mạch phổi trở thành máu giàu Oxy (màu đỏ tươi).',
      'Đây là trạm biến đổi chất trọng yếu của Vòng tuần hoàn nhỏ.'
    ]
  },
  'artery-pulmonary': {
    name: 'Động mạch phổi',
    badge: 'Vòng tuần hoàn nhỏ',
    badgeClass: 'pulmonary',
    colorType: 'blue-co2',
    bloodDesc: 'Máu đỏ thẫm (Nghèo O₂, giàu CO₂)',
    from: 'Tâm thất phải',
    to: 'Mao mạch phổi',
    desc: 'Động mạch phổi xuất phát từ tâm thất phải, chia làm 2 nhánh dẫn máu nghèo oxy lên 2 lá phổi. Điểm đặc biệt lưu ý: Dù mang tên là "Động mạch" (do dẫn máu rời khỏi tim), nhưng bên trong lại chứa máu đỏ thẫm (giàu CO₂).',
    keyPoints: [
      'Áp lực máu trong động mạch phổi thấp hơn nhiều so với động mạch chủ (khoảng 25/10 mmHg).',
      'Máu di chuyển theo chiều hướng lên đỉnh phổi.',
      'Học sinh thường hay nhầm lẫn: Cứ nghĩ động mạch là máu đỏ tươi, nhưng ĐỘNG MẠCH PHỔI là ngoại lệ!'
    ]
  },
  'vein-pulmonary': {
    name: 'Tĩnh mạch phổi',
    badge: 'Vòng tuần hoàn nhỏ',
    badgeClass: 'pulmonary',
    colorType: 'red-rich',
    from: 'Mao mạch phổi',
    to: 'Tâm nhĩ trái',
    desc: 'Bốn tĩnh mạch phổi (mỗi bên phổi 2 tĩnh mạch) dẫn máu đã được nạp đầy O₂ từ mao mạch phổi trở về tâm nhĩ trái của tim. Tương tự như động mạch phổi, tĩnh mạch phổi là "Tĩnh mạch" (dẫn máu về tim) nhưng lại chứa MÁU ĐỎ TƯƠI giàu oxy.',
    keyPoints: [
      'Đưa máu giàu O₂ về tâm nhĩ trái chuẩn bị cho chu kỳ bơm vào vòng tuần hoàn lớn.',
      'Dòng chảy xuôi chiều từ trên phổi xuống buồng tim trái.',
      'Ngoại lệ quan trọng trong bài kiểm tra: Tĩnh mạch phổi chứa máu đỏ tươi.'
    ]
  },
  'heart': {
    name: 'Tim (Khối cơ rỗng gồm 4 ngăn)',
    badge: 'Trung tâm tuần hoàn',
    badgeClass: 'heart',
    colorType: 'purple-exchange',
    bloodDesc: 'Nửa phải: Máu đỏ thẫm (CO₂) | Nửa trái: Máu đỏ tươi (O₂)',
    from: 'Tĩnh mạch (chủ & phổi)',
    to: 'Động mạch (chủ & phổi)',
    desc: 'Tim hoạt động như một chiếc máy bơm hút và đẩy máu liên tục. Tim người chia làm 4 buồng hoàn toàn độc lập: Tâm nhĩ phải, Tâm thất phải, Tâm nhĩ trái, Tâm thất trái. Giữa các ngăn và cuống mạch có các van tim (van 2 lá, 3 lá, van tổ chim) đảm bảo máu chỉ chảy theo MỘT CHIỀU DUY NHẤT.',
    keyPoints: [
      'Chu kỳ tim gồm 3 pha: Pha co tâm nhĩ (0.1s), Pha co tâm thất (0.3s), Pha giãn chung (0.4s).',
      'Thành tâm thất dày hơn tâm nhĩ; thành tâm thất trái dày nhất vì phải tạo lực đẩy máu đi khắp toàn cơ thể.',
      'Hai nửa tim tách biệt hoàn toàn giúp máu đỏ tươi không bị pha trộn với máu đỏ thẫm.'
    ]
  },
  'artery-systemic': {
    name: 'Động mạch (Động mạch chủ)',
    badge: 'Vòng tuần hoàn lớn',
    badgeClass: 'systemic',
    colorType: 'red-rich',
    from: 'Tâm thất trái',
    to: 'Mao mạch cơ quan',
    desc: 'Động mạch chủ là mạch máu lớn nhất trong cơ thể xuất phát từ tâm thất trái, uốn thành quai động mạch chủ rồi chia nhánh đến các cơ quan ở đầu, thân và chi. Chứa máu đỏ tươi giàu O₂ dưới áp lực rất cao để cung cấp oxy và dưỡng chất nuôi sống tế bào.',
    keyPoints: [
      'Thành động mạch có lớp cơ trơn và sợi đàn hồi rất dày để chịu được áp lực bơm cực lớn từ thất trái.',
      'Vận tốc dòng máu trong động mạch chủ là nhanh nhất trong toàn bộ hệ tuần hoàn (~30 - 50 cm/s).',
      'Dẫn máu đi xuống mạng lưới mao mạch các mô cơ quan.'
    ]
  },
  'vein-systemic': {
    name: 'Tĩnh mạch (Tĩnh mạch chủ)',
    badge: 'Vòng tuần hoàn lớn',
    badgeClass: 'systemic',
    colorType: 'blue-co2',
    from: 'Mao mạch cơ quan',
    to: 'Tâm nhĩ phải',
    desc: 'Hệ thống tĩnh mạch thu gom máu nghèo oxy và chứa chất thải từ các cơ quan (não, gan, thận, cơ bắp,...) đổ về tĩnh mạch chủ trên và tĩnh mạch chủ dưới, cuối cùng chảy vào tâm nhĩ phải của tim.',
    keyPoints: [
      'Thành tĩnh mạch mỏng hơn động mạch, có các van tĩnh mạch một chiều ngăn máu chảy ngược do trọng lực.',
      'Máu di chuyển nhờ sự co bóp của các cơ bắp xung quanh và sức hút của lồng ngực khi hít thở.',
      'Đưa máu đỏ thẫm trở lại nửa tim phải để bắt đầu vòng tuần hoàn phổi mới.'
    ]
  },
  'capillaries-body': {
    name: 'Mao mạch ở các cơ quan',
    badge: 'Vòng tuần hoàn lớn',
    badgeClass: 'systemic',
    colorType: 'purple-exchange',
    bloodDesc: 'Trao đổi chất & khí: Máu đỏ tươi nhường O₂ & dưỡng chất, nhận CO₂ trở thành Máu đỏ thẫm',
    from: 'Động mạch',
    to: 'Tĩnh mạch',
    desc: 'Mạng lưới mao mạch len lỏi đến từng milimet tế bào trong khắp cơ thể. Tại đây, áp lực máu chậm nhất (chỉ khoảng 0.5 mm/s), tạo điều kiện hoàn hảo để Oxy và glucose khuếch tán sang dịch mô nuôi tế bào, đồng thời hấp thu CO₂ và các sản phẩm dị hóa từ tế bào vào máu.',
    keyPoints: [
      'Tổng diện tích trao đổi chất của mạng mao mạch cơ quan ở người trưởng thành lên tới ~1000 m².',
      'Dòng máu chuyển màu từ Đỏ tươi (O₂) sang Đỏ thẫm (CO₂) tại đây.',
      'Là mắt xích quyết định chức năng dinh dưỡng và hô hấp nội bào của cơ thể sống.'
    ]
  }
};

// --- 3. KHỞI TẠO THREE.JS SCENE ---
const container = document.getElementById('canvas-container');
const canvas = document.getElementById('webgl-canvas');
const labelsOverlay = document.getElementById('labels-overlay');

const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0e17, 0.025);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.set(0, 0, 18);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.minDistance = 4;
controls.maxDistance = 65;
controls.maxPolarAngle = Math.PI * 0.85;
controls.minPolarAngle = Math.PI * 0.15;

// --- 5. HỆ THỐNG ÁNH SÁNG (LIGHTING) ---
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight1.position.set(5, 10, 8);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0x00d2ff, 0.6);
dirLight2.position.set(-8, -5, -4);
scene.add(dirLight2);

const pointLightRed = new THREE.PointLight(0xff334b, 1.5, 15);
pointLightRed.position.set(3, -1, 3);
scene.add(pointLightRed);

const pointLightBlue = new THREE.PointLight(0x0088ff, 1.5, 15);
pointLightBlue.position.set(-3, 1, 3);
scene.add(pointLightBlue);

// --- 6. XÂY DỰNG MÔ HÌNH TIM 3D (PROCEDURAL 3D HEART) ---
const heartGroup = new THREE.Group();
heartGroup.position.set(0, 0, 0);
scene.add(heartGroup);

// Materials for Heart
const heartMatRed = new THREE.MeshPhysicalMaterial({
  color: 0xd32f2f,
  emissive: 0x4a0a0a,
  roughness: 0.35,
  metalness: 0.1,
  clearcoat: 0.3,
  clearcoatRoughness: 0.2,
  transparent: true,
  opacity: 0.94
});

const heartMatBlue = new THREE.MeshPhysicalMaterial({
  color: 0x1565c0,
  emissive: 0x051d42,
  roughness: 0.35,
  metalness: 0.1,
  clearcoat: 0.3,
  clearcoatRoughness: 0.2,
  transparent: true,
  opacity: 0.94
});

const heartInnerMat = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  roughness: 0.5,
  metalness: 0.1,
  wireframe: true,
  transparent: true,
  opacity: 0.25
});

// Left Half of Heart (Tâm nhĩ trái & Tâm thất trái - Đỏ)
const leftVentricleGeom = new THREE.SphereGeometry(1.2, 32, 32);
leftVentricleGeom.scale(0.85, 1.35, 0.8);
const leftVentricleMesh = new THREE.Mesh(leftVentricleGeom, heartMatRed);
leftVentricleMesh.position.set(0.65, -0.4, 0);
leftVentricleMesh.rotation.z = -0.15;
heartGroup.add(leftVentricleMesh);

const leftAtriumGeom = new THREE.SphereGeometry(0.75, 24, 24);
leftAtriumGeom.scale(0.9, 0.85, 0.85);
const leftAtriumMesh = new THREE.Mesh(leftAtriumGeom, heartMatRed);
leftAtriumMesh.position.set(0.7, 0.8, -0.1);
heartGroup.add(leftAtriumMesh);

// Right Half of Heart (Tâm nhĩ phải & Tâm thất phải - Xanh)
const rightVentricleGeom = new THREE.SphereGeometry(1.15, 32, 32);
rightVentricleGeom.scale(0.85, 1.3, 0.8);
const rightVentricleMesh = new THREE.Mesh(rightVentricleGeom, heartMatBlue);
rightVentricleMesh.position.set(-0.65, -0.35, 0.05);
rightVentricleMesh.rotation.z = 0.15;
heartGroup.add(rightVentricleMesh);

const rightAtriumGeom = new THREE.SphereGeometry(0.78, 24, 24);
rightAtriumGeom.scale(0.9, 0.88, 0.85);
const rightAtriumMesh = new THREE.Mesh(rightAtriumGeom, heartMatBlue);
rightAtriumMesh.position.set(-0.7, 0.8, -0.05);
heartGroup.add(rightAtriumMesh);

// Heart Apex & Groove (Rãnh liên thất)
const septumGeom = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 16);
const septumMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });
const septumMesh = new THREE.Mesh(septumGeom, septumMat);
septumMesh.position.set(0.02, -0.4, 0.8);
septumMesh.rotation.z = 0.1;
heartGroup.add(septumMesh);

// Interactive hitboxes on Heart
leftVentricleMesh.userData = { id: 'heart', name: 'Tâm thất trái (Nửa tim trái)' };
rightVentricleMesh.userData = { id: 'heart', name: 'Tâm thất phải (Nửa tim phải)' };
leftAtriumMesh.userData = { id: 'heart', name: 'Tâm nhĩ trái' };
rightAtriumMesh.userData = { id: 'heart', name: 'Tâm nhĩ phải' };

// --- 7. ĐỊNH NGHĨA CÁC ĐƯỜNG CONG MẠCH MÁU (VASCULAR SPLINES) ---
// Định nghĩa các đường cong 3D mượt mà tương ứng với hình vẽ SGK
const curves = {
  // 1. Động mạch phổi: Từ Thất phải -> Lên Mao mạch phổi (Xanh)
  pulmonaryArtery: new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.4, 0.2, 0.3),
    new THREE.Vector3(-0.9, 1.4, 0.4),
    new THREE.Vector3(-1.7, 2.7, 0.3),
    new THREE.Vector3(-1.8, 4.1, 0.2),
    new THREE.Vector3(-1.1, 4.9, 0.0),
    new THREE.Vector3(-0.6, 5.3, 0.0)
  ]),

  // 2. Tĩnh mạch phổi: Từ Mao mạch phổi -> Xuống Tâm nhĩ trái (Đỏ)
  pulmonaryVein: new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.6, 5.3, 0.0),
    new THREE.Vector3(1.1, 4.9, 0.0),
    new THREE.Vector3(1.7, 3.9, 0.2),
    new THREE.Vector3(1.6, 2.4, 0.3),
    new THREE.Vector3(1.1, 1.4, 0.3),
    new THREE.Vector3(0.6, 0.8, 0.2)
  ]),

  // 3. Động mạch (Động mạch chủ): Từ Thất trái -> Uốn vòm -> Xuống Mao mạch cơ quan (Đỏ)
  systemicArtery: new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.4, 0.2, 0.3),
    new THREE.Vector3(0.8, 1.4, 0.4),
    new THREE.Vector3(1.4, 1.8, 0.2),
    new THREE.Vector3(1.9, 0.6, 0.3),
    new THREE.Vector3(2.0, -1.5, 0.3),
    new THREE.Vector3(1.8, -3.4, 0.2),
    new THREE.Vector3(1.2, -4.7, 0.1),
    new THREE.Vector3(0.5, -5.3, 0.0)
  ]),

  // 4. Tĩnh mạch (Tĩnh mạch chủ): Từ Mao mạch cơ quan -> Lên Tâm nhĩ phải (Xanh)
  systemicVein: new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.5, -5.3, 0.0),
    new THREE.Vector3(-1.2, -4.7, 0.1),
    new THREE.Vector3(-1.8, -3.4, 0.2),
    new THREE.Vector3(-2.0, -1.5, 0.3),
    new THREE.Vector3(-1.9, 0.2, 0.3),
    new THREE.Vector3(-1.4, 1.2, 0.3),
    new THREE.Vector3(-0.6, 0.8, 0.2)
  ])
};

// Tạo ống dẫn 3D cho các mạch máu (Translucent 3D Tubes)
const vesselMaterials = {
  blue: new THREE.MeshPhysicalMaterial({
    color: 0x0088ff,
    roughness: 0.2,
    metalness: 0.1,
    transmission: 0.6,
    thickness: 0.8,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  }),
  red: new THREE.MeshPhysicalMaterial({
    color: 0xff334b,
    roughness: 0.2,
    metalness: 0.1,
    transmission: 0.6,
    thickness: 0.8,
    transparent: true,
    opacity: 0.75,
    side: THREE.DoubleSide
  })
};

const interactiveObjects = [];

function createVessel(curve, material, id, radius = 0.28) {
  const geom = new THREE.TubeGeometry(curve, 64, radius, 18, false);
  const mesh = new THREE.Mesh(geom, material);
  mesh.userData = { id: id };
  scene.add(mesh);
  interactiveObjects.push(mesh);
  return mesh;
}

const vPulmonaryArtery = createVessel(curves.pulmonaryArtery, vesselMaterials.blue, 'artery-pulmonary');
const vPulmonaryVein = createVessel(curves.pulmonaryVein, vesselMaterials.red, 'vein-pulmonary');
const vSystemicArtery = createVessel(curves.systemicArtery, vesselMaterials.red, 'artery-systemic');
const vSystemicVein = createVessel(curves.systemicVein, vesselMaterials.blue, 'vein-systemic');

interactiveObjects.push(leftVentricleMesh, rightVentricleMesh, leftAtriumMesh, rightAtriumMesh);

// --- 8. TẠO LƯỚI MAO MẠCH 3D (CAPILLARY NETWORKS - PHỔI & CƠ QUAN) ---
function createCapillaryBed(centerPos, width, height, id, type) {
  const bedGroup = new THREE.Group();
  bedGroup.position.copy(centerPos);

  const matPurple = new THREE.MeshPhysicalMaterial({
    color: 0x9c27b0,
    emissive: 0x3d0c47,
    roughness: 0.3,
    transmission: 0.4,
    transparent: true,
    opacity: 0.85
  });

  // Outer organic rim
  const rimGeom = new THREE.TorusGeometry(width * 0.48, 0.14, 16, 32);
  rimGeom.scale(1.2, 0.8, 0.5);
  const rimMesh = new THREE.Mesh(rimGeom, matPurple);
  bedGroup.add(rimMesh);

  // Internal interlacing capillary loops
  const loopCount = 9;
  for (let i = 0; i < loopCount; i++) {
    const angle = (i / loopCount) * Math.PI * 2;
    const rx = (Math.cos(angle) * width * 0.3) + (Math.random() - 0.5) * 0.3;
    const ry = (Math.sin(angle) * height * 0.25) + (Math.random() - 0.5) * 0.2;
    const rz = (Math.random() - 0.5) * 0.4;

    const loopCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-width * 0.4, 0, 0),
      new THREE.Vector3(rx * 0.5, ry + 0.3, rz),
      new THREE.Vector3(rx, ry - 0.2, -rz),
      new THREE.Vector3(width * 0.4, 0, 0)
    ]);

    const loopGeom = new THREE.TubeGeometry(loopCurve, 24, 0.08, 8, false);
    const loopMesh = new THREE.Mesh(loopGeom, matPurple);
    bedGroup.add(loopMesh);
  }

  // Interaction collider
  const colliderGeom = new THREE.SphereGeometry(width * 0.55, 16, 16);
  colliderGeom.scale(1.2, 0.8, 0.6);
  const colliderMat = new THREE.MeshBasicMaterial({ visible: false });
  const colliderMesh = new THREE.Mesh(colliderGeom, colliderMat);
  colliderMesh.userData = { id: id };
  bedGroup.add(colliderMesh);
  interactiveObjects.push(colliderMesh);

  scene.add(bedGroup);
  return bedGroup;
}

const lungCapillaries = createCapillaryBed(new THREE.Vector3(0, 5.4, 0), 2.2, 1.4, 'capillaries-lungs', 'pulmonary');
const bodyCapillaries = createCapillaryBed(new THREE.Vector3(0, -5.4, 0), 2.4, 1.6, 'capillaries-body', 'systemic');

// --- 9. HỆ THỐNG DÒNG CHẢY TẾ BÀO MÁU (3D BLOOD PARTICLES & RBCs) ---
// Tạo hàng trăm tế bào máu di chuyển dọc theo các đường cong
class BloodCellSystem {
  constructor(curve, count, colorStart, colorEnd, isExchange = false, partId = null) {
    this.curve = curve;
    this.count = count;
    this.colorStart = new THREE.Color(colorStart);
    this.colorEnd = new THREE.Color(colorEnd);
    this.isExchange = isExchange;
    this.partId = partId;

    // Hình dạng đĩa lõm 2 mặt của Hồng cầu (Biconcave Red Blood Cell disc)
    const cellGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.03, 12);
    cellGeom.scale(1, 1, 0.7);

    this.instancedMesh = new THREE.InstancedMesh(
      cellGeom,
      new THREE.MeshStandardMaterial({
        roughness: 0.3,
        metalness: 0.1,
        emissiveIntensity: 0.3
      }),
      count
    );

    this.offsets = new Float32Array(count);
    this.speeds = new Float32Array(count);
    this.dummy = new THREE.Object3D();
    this.tempColor = new THREE.Color();

    for (let i = 0; i < count; i++) {
      this.offsets[i] = i / count;
      this.speeds[i] = 0.08 + Math.random() * 0.03;
    }

    scene.add(this.instancedMesh);
  }

  update(delta, speedMultiplier, heartPulseFactor) {
    let isVisible = state.showCells;
    if (isVisible && typeof labState !== 'undefined' && labState.active && labState.mode === 'puzzle') {
      isVisible = !!(this.partId && labState.parts[this.partId] && labState.parts[this.partId].assembled && labState.parts[this.partId].isCorrect);
    }

    if (!isVisible) {
      this.instancedMesh.visible = false;
      return;
    }
    this.instancedMesh.visible = true;

    for (let i = 0; i < this.count; i++) {
      // Nhịp đập tim đẩy máu nhanh hơn trong pha co bóp
      const effectiveSpeed = this.speeds[i] * speedMultiplier * (1 + heartPulseFactor * 0.4);
      this.offsets[i] = (this.offsets[i] + delta * effectiveSpeed * 0.5) % 1.0;

      const t = this.offsets[i];
      const pos = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t);

      // Random jitter bên trong lòng ống mạch máu
      const angle = i * 2.5;
      const radius = 0.12;
      pos.x += Math.cos(angle) * radius * 0.5;
      pos.z += Math.sin(angle) * radius * 0.5;

      this.dummy.position.copy(pos);
      this.dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      this.dummy.scale.setScalar(0.9 + Math.sin(t * Math.PI) * 0.2);
      this.dummy.updateMatrix();

      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);

      // Chuyển đổi màu sắc: Xanh <-> Tím <-> Đỏ
      if (this.isExchange) {
        if (t < 0.5) {
          this.tempColor.lerpColors(this.colorStart, new THREE.Color(0x9c27b0), t * 2);
        } else {
          this.tempColor.lerpColors(new THREE.Color(0x9c27b0), this.colorEnd, (t - 0.5) * 2);
        }
      } else {
        this.tempColor.copy(this.colorStart);
      }

      this.instancedMesh.setColorAt(i, this.tempColor);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
    if (this.instancedMesh.instanceColor) {
      this.instancedMesh.instanceColor.needsUpdate = true;
    }
  }

  setVisible(visible) {
    if (!visible) {
      this.instancedMesh.visible = false;
      return;
    }
    if (typeof labState !== 'undefined' && labState.active && labState.mode === 'puzzle') {
      this.instancedMesh.visible = !!(this.partId && labState.parts[this.partId] && labState.parts[this.partId].assembled && labState.parts[this.partId].isCorrect);
    } else {
      this.instancedMesh.visible = true;
    }
  }
}

// Đường nối mao mạch để tế bào máu chảy liên tục qua mao mạch
const lungCapillaryCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(-0.6, 5.3, 0.0),
  new THREE.Vector3(-0.3, 5.6, 0.2),
  new THREE.Vector3(0.0, 5.3, -0.2),
  new THREE.Vector3(0.3, 5.5, 0.2),
  new THREE.Vector3(0.6, 5.3, 0.0)
]);

const bodyCapillaryCurve = new THREE.CatmullRomCurve3([
  new THREE.Vector3(0.5, -5.3, 0.0),
  new THREE.Vector3(0.3, -5.6, 0.2),
  new THREE.Vector3(0.0, -5.3, -0.2),
  new THREE.Vector3(-0.3, -5.5, 0.2),
  new THREE.Vector3(-0.5, -5.3, 0.0)
]);

// Hệ thống Bạch cầu (White Blood Cells) & Tiểu cầu (Platelets) di chuyển trong mạch
class MixedCellSystem {
  constructor(curve, count, type, partId = null) {
    this.curve = curve;
    this.count = count;
    this.type = type;
    this.partId = partId;

    let geom, mat;
    if (type === 'wbc') {
      // Bạch cầu: Kích thước lớn hơn hồng cầu, hình cầu, màu trắng ánh xanh nhạt
      geom = new THREE.SphereGeometry(0.12, 14, 14);
      mat = new THREE.MeshStandardMaterial({
        color: 0xf0fdfa,
        emissive: 0x38bdf8,
        emissiveIntensity: 0.35,
        roughness: 0.2
      });
    } else {
      // Tiểu cầu: Kích thước rất nhỏ, hình mảnh đa diện/sao, màu tím
      geom = new THREE.DodecahedronGeometry(0.05, 0);
      mat = new THREE.MeshStandardMaterial({
        color: 0xa855f7,
        emissive: 0x6b21a8,
        emissiveIntensity: 0.4,
        roughness: 0.3
      });
    }

    this.instancedMesh = new THREE.InstancedMesh(geom, mat, count);
    this.offsets = new Float32Array(count);
    this.speeds = new Float32Array(count);
    this.dummy = new THREE.Object3D();

    for (let i = 0; i < count; i++) {
      this.offsets[i] = i / count;
      this.speeds[i] = 0.07 + Math.random() * 0.025;
    }

    scene.add(this.instancedMesh);
  }

  update(delta, speedMultiplier, heartPulseFactor) {
    let isVisible = state.showCells;
    if (isVisible && typeof labState !== 'undefined' && labState.active && labState.mode === 'puzzle') {
      isVisible = !!(this.partId && labState.parts[this.partId] && labState.parts[this.partId].assembled && labState.parts[this.partId].isCorrect);
    }

    if (!isVisible) {
      this.instancedMesh.visible = false;
      return;
    }
    this.instancedMesh.visible = true;

    for (let i = 0; i < this.count; i++) {
      const effectiveSpeed = this.speeds[i] * speedMultiplier * (1 + heartPulseFactor * 0.4);
      this.offsets[i] = (this.offsets[i] + delta * effectiveSpeed * 0.5) % 1.0;

      const t = this.offsets[i];
      const pos = this.curve.getPointAt(t);
      const tangent = this.curve.getTangentAt(t);

      const angle = i * 4.3;
      const radius = 0.09;
      pos.x += Math.cos(angle) * radius;
      pos.z += Math.sin(angle) * radius;

      this.dummy.position.copy(pos);
      this.dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      this.dummy.updateMatrix();

      this.instancedMesh.setMatrixAt(i, this.dummy.matrix);
    }

    this.instancedMesh.instanceMatrix.needsUpdate = true;
  }

  setVisible(visible) {
    if (!visible) {
      this.instancedMesh.visible = false;
      return;
    }
    if (typeof labState !== 'undefined' && labState.active && labState.mode === 'puzzle') {
      this.instancedMesh.visible = !!(this.partId && labState.parts[this.partId] && labState.parts[this.partId].assembled && labState.parts[this.partId].isCorrect);
    } else {
      this.instancedMesh.visible = true;
    }
  }
}

const bloodStreams = [
  // 1. Hồng cầu (Red Blood Cells)
  new BloodCellSystem(curves.pulmonaryArtery, 35, 0x0088ff, 0x0088ff, false, 'artery-pulmonary'),
  new BloodCellSystem(lungCapillaryCurve, 20, 0x0088ff, 0xff334b, true, 'capillaries-lungs'),
  new BloodCellSystem(curves.pulmonaryVein, 35, 0xff334b, 0xff334b, false, 'vein-pulmonary'),
  new BloodCellSystem(curves.systemicArtery, 45, 0xff334b, 0xff334b, false, 'artery-systemic'),
  new BloodCellSystem(bodyCapillaryCurve, 22, 0xff334b, 0x0088ff, true, 'capillaries-body'),
  new BloodCellSystem(curves.systemicVein, 45, 0x0088ff, 0x0088ff, false, 'vein-systemic'),

  // 2. Bạch cầu (White Blood Cells - to hơn, màu trắng/cyan)
  new MixedCellSystem(curves.pulmonaryArtery, 4, 'wbc', 'artery-pulmonary'),
  new MixedCellSystem(curves.pulmonaryVein, 4, 'wbc', 'vein-pulmonary'),
  new MixedCellSystem(curves.systemicArtery, 6, 'wbc', 'artery-systemic'),
  new MixedCellSystem(curves.systemicVein, 6, 'wbc', 'vein-systemic'),

  // 3. Tiểu cầu (Platelets - nhỏ, màu tím)
  new MixedCellSystem(curves.pulmonaryArtery, 8, 'platelet', 'artery-pulmonary'),
  new MixedCellSystem(curves.pulmonaryVein, 8, 'platelet', 'vein-pulmonary'),
  new MixedCellSystem(curves.systemicArtery, 10, 'platelet', 'artery-systemic'),
  new MixedCellSystem(curves.systemicVein, 10, 'platelet', 'vein-systemic')
];

// --- 10. MŨI TÊN CHỈ HƯỚNG DÒNG CHẢY (FLOW ARROWS THEO SGK) ---
const arrowsGroup = new THREE.Group();
scene.add(arrowsGroup);

function createFlowChevron(colorHex = 0xffffff) {
  const geom = new THREE.ConeGeometry(0.18, 0.35, 12);
  const mat = new THREE.MeshBasicMaterial({
    color: colorHex,
    transparent: true,
    opacity: 0.85
  });
  return new THREE.Mesh(geom, mat);
}

const arrowTrackers = [
  // Động mạch phổi (Mũi tên đi lên)
  { curve: curves.pulmonaryArtery, mesh: createFlowChevron(0xffffff), t: 0.25, partId: 'artery-pulmonary' },
  { curve: curves.pulmonaryArtery, mesh: createFlowChevron(0xffffff), t: 0.7, partId: 'artery-pulmonary' },
  // Tĩnh mạch phổi (Mũi tên đi xuống)
  { curve: curves.pulmonaryVein, mesh: createFlowChevron(0xffffff), t: 0.3, partId: 'vein-pulmonary' },
  { curve: curves.pulmonaryVein, mesh: createFlowChevron(0xffffff), t: 0.75, partId: 'vein-pulmonary' },
  // Động mạch chủ (Mũi tên đi xuống)
  { curve: curves.systemicArtery, mesh: createFlowChevron(0xffffff), t: 0.25, partId: 'artery-systemic' },
  { curve: curves.systemicArtery, mesh: createFlowChevron(0xffffff), t: 0.55, partId: 'artery-systemic' },
  { curve: curves.systemicArtery, mesh: createFlowChevron(0xffffff), t: 0.85, partId: 'artery-systemic' },
  // Tĩnh mạch chủ (Mũi tên đi lên)
  { curve: curves.systemicVein, mesh: createFlowChevron(0xffffff), t: 0.25, partId: 'vein-systemic' },
  { curve: curves.systemicVein, mesh: createFlowChevron(0xffffff), t: 0.55, partId: 'vein-systemic' },
  { curve: curves.systemicVein, mesh: createFlowChevron(0xffffff), t: 0.85, partId: 'vein-systemic' }
];

arrowTrackers.forEach(item => arrowsGroup.add(item.mesh));

// --- 11. NHÃN CHÚ THÍCH 3D (LABELS OVERLAY) ---
const LABELS_CONFIG = [
  { id: 'capillaries-lungs', text: 'Mao mạch phổi', pos: new THREE.Vector3(0, 6.4, 0), dotClass: 'purple' },
  { id: 'artery-pulmonary', text: 'Động mạch phổi', pos: new THREE.Vector3(-2.6, 3.4, 0.3), dotClass: 'blue' },
  { id: 'vein-pulmonary', text: 'Tĩnh mạch phổi', pos: new THREE.Vector3(2.6, 3.4, 0.3), dotClass: 'red' },
  { id: 'heart', text: 'Tim (4 ngăn)', pos: new THREE.Vector3(0, -0.2, 1.4), dotClass: 'yellow' },
  { id: 'artery-systemic', text: 'Động mạch (chủ)', pos: new THREE.Vector3(2.8, -2.6, 0.3), dotClass: 'red' },
  { id: 'vein-systemic', text: 'Tĩnh mạch', pos: new THREE.Vector3(-2.8, -2.6, 0.3), dotClass: 'blue' },
  { id: 'capillaries-body', text: 'Mao mạch ở các cơ quan', pos: new THREE.Vector3(0, -6.6, 0), dotClass: 'purple' }
];

const labelElements = [];

function initLabels() {
  labelsOverlay.innerHTML = '';
  LABELS_CONFIG.forEach(cfg => {
    const el = document.createElement('div');
    el.className = 'label-3d';
    el.dataset.id = cfg.id;
    el.innerHTML = `
      <span class="label-dot ${cfg.dotClass}"></span>
      <span class="label-text">${cfg.text}</span>
    `;
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      selectPart(cfg.id);
    });
    labelsOverlay.appendChild(el);
    labelElements.push({ el: el, pos: cfg.pos, id: cfg.id });
  });
}

function updateLabelsPosition() {
  if (!state.showLabels) {
    labelsOverlay.style.display = 'none';
    return;
  }
  labelsOverlay.style.display = 'block';

  const halfWidth = window.innerWidth / 2;
  const halfHeight = window.innerHeight / 2;

  labelElements.forEach(item => {
    const v = item.pos.clone().project(camera);
    // Kiểm tra xem nhãn có ở trước mặt camera không
    if (v.z > 1) {
      item.el.style.display = 'none';
      return;
    }
    item.el.style.display = 'flex';
    const x = (v.x * halfWidth) + halfWidth;
    const y = -(v.y * halfHeight) + halfHeight;
    item.el.style.left = `${x}px`;
    item.el.style.top = `${y}px`;
  });
}

// --- 12. ÂM THANH NHỊP TIM ĐIỆN TỬ (SYNTHESIZED HEARTBEAT AUDIO) ---
let audioCtx = null;
let lastHeartBeat = 0;

function playHeartbeatSound() {
  if (!state.soundEnabled) return;
  try {
    if (!audioCtx) {
      audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // Tiếng đập thứ 1: "LUB" (Van nhĩ-thất đóng)
    const osc1 = audioCtx.createOscillator();
    const gain1 = audioCtx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(80, now);
    osc1.frequency.exponentialRampToValueAtTime(35, now + 0.12);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
    osc1.connect(gain1);
    gain1.connect(audioCtx.destination);
    osc1.start(now);
    osc1.stop(now + 0.12);

    // Tiếng đập thứ 2: "DUB" (Van tổ chim động mạch đóng, cách 0.18s)
    const osc2 = audioCtx.createOscillator();
    const gain2 = audioCtx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(110, now + 0.18);
    osc2.frequency.exponentialRampToValueAtTime(45, now + 0.3);
    gain2.gain.setValueAtTime(0.35, now + 0.18);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc2.connect(gain2);
    gain2.connect(audioCtx.destination);
    osc2.start(now + 0.18);
    osc2.stop(now + 0.3);
  } catch (err) {
    console.warn('Audio synthesis note:', err);
  }
}

// --- 13. HỆ THỐNG GIỌNG ĐỌC THUYẾT MINH TIẾNG VIỆT (TEXT-TO-SPEECH) ---
let vietnameseVoice = null;
let isSpeaking = false;

function initVoices() {
  if (!('speechSynthesis' in window)) return;
  const voices = window.speechSynthesis.getVoices();
  // Tìm giọng đọc tiếng Việt có sẵn trong trình duyệt / hệ điều hành
  vietnameseVoice = voices.find(v => 
    v.lang === 'vi-VN' || 
    v.lang === 'vi_VN' || 
    v.lang.toLowerCase().startsWith('vi') ||
    v.name.toLowerCase().includes('vietnam') ||
    v.name.toLowerCase().includes('vietnamese')
  ) || null;
}

if ('speechSynthesis' in window) {
  window.speechSynthesis.onvoiceschanged = initVoices;
  initVoices();
}

function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
  isSpeaking = false;
  updateSpeakButtonUI(false);
}

function speakPartContent(id) {
  const data = ANATOMY_DATA[id];
  if (!data || !('speechSynthesis' in window)) return;

  stopSpeaking();

  // Soạn lời bình thuyết minh khoa học, dễ hiểu, sinh động cho học sinh
  let speechText = `${data.name}. `;
  speechText += `Thuộc ${data.badge}. `;
  if (data.bloodDesc) {
    speechText += `Tính chất máu: ${data.bloodDesc}. `;
  }
  speechText += `Hướng dòng chảy: từ ${data.from} đến ${data.to}. `;
  if (data.desc) {
    speechText += `${data.desc} `;
  }
  if (data.keyPoints && data.keyPoints.length > 0) {
    speechText += `Lưu ý trọng tâm: ${data.keyPoints[0]}`;
  }

  const utterance = new SpeechSynthesisUtterance(speechText);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95; // Tốc độ tự nhiên, rõ từng chữ
  utterance.pitch = 1.0;

  if (!vietnameseVoice) {
    initVoices();
  }
  if (vietnameseVoice) {
    utterance.voice = vietnameseVoice;
  }

  utterance.onstart = () => {
    isSpeaking = true;
    updateSpeakButtonUI(true);
  };

  utterance.onend = () => {
    isSpeaking = false;
    updateSpeakButtonUI(false);
  };

  utterance.onerror = (err) => {
    console.warn('Speech synthesis note:', err);
    isSpeaking = false;
    updateSpeakButtonUI(false);
  };

  window.speechSynthesis.speak(utterance);
}

function updateSpeakButtonUI(speaking) {
  const btn = document.getElementById('btn-speak-toggle');
  if (!btn) return;

  if (speaking) {
    btn.classList.add('speaking');
    btn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span id="speak-btn-text">Dừng đọc</span>';
  } else {
    btn.classList.remove('speaking');
    btn.innerHTML = '<i class="fa-solid fa-volume-low"></i> <span id="speak-btn-text">Đọc nội dung</span>';
  }
}

// --- 14. TƯƠNG TÁC CHỌN BỘ PHẬN & BẢNG THUYẾT MINH (INFO DRAWER) ---
const infoDrawer = document.getElementById('info-drawer');
const drawerTitle = document.getElementById('drawer-title');
const drawerBadge = document.getElementById('drawer-badge');
const drawerContent = document.getElementById('drawer-content');
const flowFrom = document.getElementById('flow-from');
const flowCurrent = document.getElementById('flow-current');
const flowTo = document.getElementById('flow-to');

function selectPart(id) {
  const data = ANATOMY_DATA[id];
  if (!data) return;

  state.selectedPart = id;

  // Cập nhật giao diện drawer
  drawerBadge.textContent = data.badge.toUpperCase();
  drawerBadge.className = `badge ${data.badgeClass}`;
  drawerTitle.textContent = data.name;

  let keyPointsHtml = '';
  if (data.keyPoints) {
    keyPointsHtml = `
      <div class="detail-card">
        <div class="detail-card-title"><i class="fa-solid fa-star"></i> Điểm cốt lõi cần nhớ</div>
        <ul style="padding-left: 18px; font-size: 12px; color: #cbd5e1; line-height: 1.6;">
          ${data.keyPoints.map(pt => `<li>${pt}</li>`).join('')}
        </ul>
      </div>
    `;
  }

  drawerContent.innerHTML = `
    <div class="blood-type-box ${data.colorType}">
      <i class="fa-solid fa-droplet" style="font-size: 16px;"></i>
      <span style="font-size: 12px; font-weight: 600;">${data.bloodDesc}</span>
    </div>

    <div class="detail-card">
      <div class="detail-card-title"><i class="fa-solid fa-circle-info"></i> Mô tả sinh học & Cơ chế</div>
      <div class="detail-card-content">${data.desc}</div>
    </div>

    ${keyPointsHtml}
  `;

  flowFrom.textContent = data.from;
  flowCurrent.textContent = data.name;
  flowTo.textContent = data.to;

  infoDrawer.classList.add('open');

  // Highlight nhãn 3D tương ứng
  document.querySelectorAll('.label-3d').forEach(el => {
    el.classList.toggle('active', el.dataset.id === id);
  });

  // Hướng camera tập trung nhẹ vào bộ phận
  focusCameraOn(id);

  // Tự động phát giọng đọc thuyết minh nội dung nếu được bật
  if (state.voiceEnabled) {
    speakPartContent(id);
  }
}

function focusCameraOn(id) {
  const cfg = LABELS_CONFIG.find(c => c.id === id);
  if (!cfg) return;

  const targetY = cfg.pos.y * 0.7;
  const targetDist = (id === 'heart') ? 11 : 15;

  // Mượt mà điều chỉnh vị trí camera
  animateCameraTo(new THREE.Vector3(0, targetY, targetDist), new THREE.Vector3(0, targetY, 0));
}

function animateCameraTo(targetPos, targetLookAt, duration = 800) {
  const startPos = camera.position.clone();
  const startTarget = controls.target.clone();
  const startTime = performance.now();

  function anim(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Smooth ease-out cubic
    const ease = 1 - Math.pow(1 - progress, 3);

    camera.position.lerpVectors(startPos, targetPos, ease);
    controls.target.lerpVectors(startTarget, targetLookAt, ease);
    controls.update();

    if (progress < 1) {
      requestAnimationFrame(anim);
    }
  }

  requestAnimationFrame(anim);
}

// Raycasting click detection
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('click', (e) => {
  // Chỉ bắt sự kiện click khi không bấm vào các nút điều khiển UI
  if (e.target.closest('.top-nav, .floating-controls, .info-drawer, .legend-card, .quick-nav, .modal-card, .label-3d, .assembly-lab-hud')) {
    return;
  }

  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  // Nếu đang trong Phòng Tháo Lắp 3D
  if (labState && labState.active) {
    handleLab3DClick();
    return;
  }

  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(interactiveObjects, true);

  if (intersects.length > 0) {
    let hitObject = intersects[0].object;
    while (hitObject && !hitObject.userData.id && hitObject.parent) {
      hitObject = hitObject.parent;
    }
    if (hitObject && hitObject.userData.id) {
      selectPart(hitObject.userData.id);
    }
  }
});

// --- 14. CHẾ ĐỘ HIỂN THỊ (VIEW MODES: ALL, PULMONARY, SYSTEMIC, HEART) ---
function setViewMode(mode) {
  state.currentMode = mode;
  document.querySelectorAll('.mode-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.mode === mode);
  });

  if (mode === 'all') {
    vPulmonaryArtery.visible = true;
    vPulmonaryVein.visible = true;
    lungCapillaries.visible = true;
    vSystemicArtery.visible = true;
    vSystemicVein.visible = true;
    bodyCapillaries.visible = true;
    heartGroup.visible = true;
    animateCameraTo(new THREE.Vector3(0, 0, 18), new THREE.Vector3(0, 0, 0));
  } else if (mode === 'pulmonary') {
    // Vòng tuần hoàn nhỏ (Phổi)
    vPulmonaryArtery.visible = true;
    vPulmonaryVein.visible = true;
    lungCapillaries.visible = true;
    vSystemicArtery.visible = false;
    vSystemicVein.visible = false;
    bodyCapillaries.visible = false;
    heartGroup.visible = true;
    animateCameraTo(new THREE.Vector3(0, 2.8, 14), new THREE.Vector3(0, 2.8, 0));
  } else if (mode === 'systemic') {
    // Vòng tuần hoàn lớn (Cơ quan)
    vPulmonaryArtery.visible = false;
    vPulmonaryVein.visible = false;
    lungCapillaries.visible = false;
    vSystemicArtery.visible = true;
    vSystemicVein.visible = true;
    bodyCapillaries.visible = true;
    heartGroup.visible = true;
    animateCameraTo(new THREE.Vector3(0, -2.8, 14), new THREE.Vector3(0, -2.8, 0));
  } else if (mode === 'heart') {
    // Cận cảnh tim
    vPulmonaryArtery.visible = true;
    vPulmonaryVein.visible = true;
    lungCapillaries.visible = false;
    vSystemicArtery.visible = true;
    vSystemicVein.visible = true;
    bodyCapillaries.visible = false;
    heartGroup.visible = true;
    animateCameraTo(new THREE.Vector3(0, 0, 8.5), new THREE.Vector3(0, 0, 0));
  }
}

// --- 15. HỆ THỐNG MÔ HÌNH 3D CÁC THÀNH PHẦN MÁU (3D BLOOD COMPONENTS) ---
let blood3DInit = false;
let bloodCanvas = null;
let bloodScene, bloodCamera, bloodRenderer, bloodControls;
let blood3DModels = {};
let currentBlood3DModel = 'vessel';
let blood3DAnimFrame = null;
let bloodCellsGroup = null;

// Hàm tạo hình đĩa lõm 2 mặt toán học chuẩn của tế bào Hồng cầu (Biconcave Erythrocyte)
function createBiconcaveRbcGeom(radius = 1.0, thickness = 0.35) {
  const points = [];
  const segments = 28;
  for (let i = 0; i <= segments; i++) {
    const u = i / segments;
    const r = u * radius;
    const u2 = u * u;
    // Công thức đa thức giải tích đảm bảo đạo hàm dh/du = 0 tại u = 0 (tâm đĩa lõm phẳng mịn màng, không bị nhọn đỉnh)
    const h = thickness * Math.max(0, 0.10 + 1.8 * u2 - 1.90 * u2 * u2);
    points.push(new THREE.Vector2(r, h));
  }
  for (let i = segments; i >= 0; i--) {
    const u = i / segments;
    const r = u * radius;
    const u2 = u * u;
    const h = -thickness * Math.max(0, 0.10 + 1.8 * u2 - 1.90 * u2 * u2);
    points.push(new THREE.Vector2(r, h));
  }
  return new THREE.LatheGeometry(points, 40);
}

function initBlood3DViewer() {
  bloodCanvas = document.getElementById('blood-3d-canvas');
  if (!bloodCanvas) return;

  const box = bloodCanvas.parentElement;
  const width = box.clientWidth || 440;
  const height = box.clientHeight || 380;

  bloodScene = new THREE.Scene();

  bloodCamera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  bloodCamera.position.set(0, 0, 7.5);

  bloodRenderer = new THREE.WebGLRenderer({
    canvas: bloodCanvas,
    antialias: true,
    alpha: true
  });
  bloodRenderer.setSize(width, height);
  bloodRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  bloodControls = new THREE.OrbitControls(bloodCamera, bloodRenderer.domElement);
  bloodControls.enableDamping = true;
  bloodControls.dampingFactor = 0.08;
  bloodControls.minDistance = 3.5;
  bloodControls.maxDistance = 15;

  // Ánh sáng cho khung cảnh 3D tế bào
  const bAmbLight = new THREE.AmbientLight(0xffffff, 0.75);
  bloodScene.add(bAmbLight);

  const bDirLight1 = new THREE.DirectionalLight(0xffffff, 1.2);
  bDirLight1.position.set(5, 8, 5);
  bloodScene.add(bDirLight1);

  const bDirLight2 = new THREE.DirectionalLight(0x00d2ff, 0.6);
  bDirLight2.position.set(-6, -4, -3);
  bloodScene.add(bDirLight2);

  // Materials
  const rbcMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xd32f2f,
    roughness: 0.3,
    metalness: 0.1,
    clearcoat: 0.4,
    clearcoatRoughness: 0.2
  });

  // --- MODEL 1: CẬN CẢNH HỒNG CẦU 3D (RBC) ---
  const rbcGroup = new THREE.Group();
  const bigRbcGeom = createBiconcaveRbcGeom(1.6, 0.55);
  const bigRbcMesh = new THREE.Mesh(bigRbcGeom, rbcMaterial);
  bigRbcMesh.rotation.x = 0.4;
  bigRbcMesh.rotation.y = 0.3;
  rbcGroup.add(bigRbcMesh);
  bloodScene.add(rbcGroup);
  blood3DModels['rbc'] = rbcGroup;

  // --- MODEL 2: CẬN CẢNH BẠCH CẦU 3D (WBC có nhân đa múi bên trong) ---
  const wbcGroup = new THREE.Group();
  // Màng tế bào gợn sóng bán trong suốt
  const wbcGeom = new THREE.SphereGeometry(1.35, 32, 32);
  const posAttr = wbcGeom.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const vx = posAttr.getX(i);
    const vy = posAttr.getY(i);
    const vz = posAttr.getZ(i);
    const bump = 1 + Math.sin(vx * 7) * Math.cos(vy * 7) * 0.045;
    posAttr.setXYZ(i, vx * bump, vy * bump, vz * bump);
  }
  wbcGeom.computeVertexNormals();

  const wbcMembraneMat = new THREE.MeshPhysicalMaterial({
    color: 0xf0fdfa,
    emissive: 0x38bdf8,
    emissiveIntensity: 0.15,
    roughness: 0.25,
    transmission: 0.72,
    transparent: true,
    opacity: 0.7,
    ior: 1.35
  });
  const wbcOuterMesh = new THREE.Mesh(wbcGeom, wbcMembraneMat);
  wbcGroup.add(wbcOuterMesh);

  // Nhân tế bào hình hạt đậu / 3 múi (Nucleus - màu tím sẫm)
  const nucleusMat = new THREE.MeshStandardMaterial({
    color: 0x312e81,
    roughness: 0.4,
    metalness: 0.1
  });
  const lobe1 = new THREE.Mesh(new THREE.SphereGeometry(0.42, 20, 20), nucleusMat);
  lobe1.position.set(-0.35, 0.15, 0);
  const lobe2 = new THREE.Mesh(new THREE.SphereGeometry(0.46, 20, 20), nucleusMat);
  lobe2.position.set(0.32, 0.2, 0.05);
  const lobe3 = new THREE.Mesh(new THREE.SphereGeometry(0.40, 20, 20), nucleusMat);
  lobe3.position.set(0.05, -0.35, -0.05);
  wbcGroup.add(lobe1, lobe2, lobe3);

  bloodScene.add(wbcGroup);
  blood3DModels['wbc'] = wbcGroup;

  // --- MODEL 3: CẬN CẢNH TIỂU CẦU 3D (PLATELET hình sao đa diện) ---
  const plateletGroup = new THREE.Group();
  const pletMat = new THREE.MeshPhysicalMaterial({
    color: 0xa855f7,
    emissive: 0x581c87,
    emissiveIntensity: 0.4,
    roughness: 0.35
  });
  const pletBody = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7, 1), pletMat);
  pleGroup = plateletGroup.add(pletBody);

  // 8 gai chân giả (Pseudopodia) tỏa ra các hướng
  const spikeGeom = new THREE.ConeGeometry(0.12, 0.65, 8);
  spikeGeom.translate(0, 0.32, 0);
  const spikeDirections = [
    [1, 0.5, 0], [-1, 0.4, 0.2], [0.3, 1, 0.2], [-0.2, -1, 0.3],
    [0.4, 0.2, 1], [-0.3, -0.2, -1], [0.7, -0.7, 0.4], [-0.6, 0.7, -0.5]
  ];
  spikeDirections.forEach(dir => {
    const spike = new THREE.Mesh(spikeGeom, pletMat);
    const vDir = new THREE.Vector3(...dir).normalize();
    spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), vDir);
    spike.position.copy(vDir.clone().multiplyScalar(0.65));
    plateletGroup.add(spike);
  });
  bloodScene.add(plateletGroup);
  blood3DModels['platelet'] = plateletGroup;

  // --- MODEL 4: ỐNG MÁU LY TÂM 3D (CENTRIFUGE TEST TUBE) ---
  const tubeGroup = new THREE.Group();
  tubeGroup.scale.set(0.85, 0.85, 0.85);

  // Vỏ ống nghiệm thủy tinh
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    roughness: 0.1,
    transmission: 0.92,
    transparent: true,
    opacity: 0.35,
    ior: 1.5,
    side: THREE.DoubleSide
  });
  const tubeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 4.4, 32, 1, true), glassMat);
  tubeBody.position.y = 0.2;
  const tubeBottom = new THREE.Mesh(new THREE.SphereGeometry(0.8, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), glassMat);
  tubeBottom.position.y = -2.0;
  tubeGroup.add(tubeBody, tubeBottom);

  // Nắp cao su đỏ phía trên
  const capMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.86, 0.86, 0.7, 32), new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.6 }));
  capMesh.position.y = 2.6;
  tubeGroup.add(capMesh);

  // Lớp 1 (Đáy - 45%): Hồng cầu (Đỏ sẫm)
  const rbcLayerMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 });
  const rbcLayerCyl = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 1.8, 32), rbcLayerMat);
  rbcLayerCyl.position.y = -1.1;
  const rbcLayerBottom = new THREE.Mesh(new THREE.SphereGeometry(0.78, 32, 16, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2), rbcLayerMat);
  rbcLayerBottom.position.y = -2.0;
  tubeGroup.add(rbcLayerCyl, rbcLayerBottom);

  // Lớp 2 (Giữa - <1%): Lớp đệm Bạch cầu & Tiểu cầu (Màu trắng tím nhạt)
  const buffyLayer = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0xe9d5ff, emissive: 0x4338ca, emissiveIntensity: 0.3 }));
  buffyLayer.position.y = -0.15;
  tubeGroup.add(buffyLayer);

  // Lớp 3 (Trên - 55%): Huyết tương (Màu vàng rơm trong suốt)
  const plasmaLayerMat = new THREE.MeshPhysicalMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    transmission: 0.65,
    transparent: true,
    opacity: 0.8
  });
  const plasmaLayer = new THREE.Mesh(new THREE.CylinderGeometry(0.78, 0.78, 2.2, 32), plasmaLayerMat);
  plasmaLayer.position.y = 1.0;
  tubeGroup.add(plasmaLayer);

  bloodScene.add(tubeGroup);
  blood3DModels['tube'] = tubeGroup;

  // --- MODEL 5: LÁT CẮT MẠCH MÁU DƯỚI KÍNH HIỂN VI 3D (VESSEL CROSS-SECTION) ---
  const vesselGroup = new THREE.Group();
  vesselGroup.scale.set(0.9, 0.9, 0.9);

  // Thành mạch máu cắt ngang (Vessel Wall)
  const wallGeom = new THREE.CylinderGeometry(2.35, 2.35, 2.6, 36, 1, true, -Math.PI * 0.65, Math.PI * 1.3);
  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x9f1239,
    roughness: 0.4,
    side: THREE.DoubleSide
  });
  const wallMesh = new THREE.Mesh(wallGeom, wallMat);
  vesselGroup.add(wallMesh);

  // Dịch huyết tương trong lòng mạch
  const lumenGeom = new THREE.CylinderGeometry(2.28, 2.28, 2.5, 36, 1, false, -Math.PI * 0.65, Math.PI * 1.3);
  const lumenMat = new THREE.MeshPhysicalMaterial({
    color: 0xfef08a,
    roughness: 0.3,
    transmission: 0.85,
    transparent: true,
    opacity: 0.28,
    side: THREE.DoubleSide
  });
  const lumenMesh = new THREE.Mesh(lumenGeom, lumenMat);
  vesselGroup.add(lumenMesh);

  // Các tế bào máu trôi lơ lửng bên trong lòng mạch
  const cellGeomRbc = createBiconcaveRbcGeom(0.38, 0.14);
  bloodCellsGroup = new THREE.Group();

  // 14 Hồng cầu
  for (let i = 0; i < 14; i++) {
    const rbcM = new THREE.Mesh(cellGeomRbc, rbcMaterial);
    rbcM.position.set(
      (Math.random() - 0.5) * 2.8,
      (Math.random() - 0.5) * 1.8,
      (Math.random() - 0.4) * 2.0
    );
    rbcM.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
    rbcM.userData = { rotSpeed: (Math.random() - 0.5) * 0.02 };
    bloodCellsGroup.add(rbcM);
  }

  // 3 Bạch cầu
  for (let i = 0; i < 3; i++) {
    const wbcM = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 16), new THREE.MeshStandardMaterial({ color: 0xf0fdfa, emissive: 0x06b6d4, emissiveIntensity: 0.3 }));
    wbcM.position.set(
      (Math.random() - 0.5) * 2.4,
      (Math.random() - 0.5) * 1.6,
      (Math.random() - 0.4) * 1.8
    );
    bloodCellsGroup.add(wbcM);
  }

  // 6 Tiểu cầu
  for (let i = 0; i < 6; i++) {
    const pletM = new THREE.Mesh(new THREE.DodecahedronGeometry(0.12, 0), pletMat);
    pletM.position.set(
      (Math.random() - 0.5) * 2.6,
      (Math.random() - 0.5) * 1.6,
      (Math.random() - 0.4) * 1.8
    );
    bloodCellsGroup.add(pletM);
  }

  vesselGroup.add(bloodCellsGroup);
  vesselGroup.rotation.y = 0.5;
  vesselGroup.rotation.x = 0.25;
  bloodScene.add(vesselGroup);
  blood3DModels['vessel'] = vesselGroup;

  // Mặc định ban đầu hiển thị 'vessel'
  switchBlood3DModel('vessel', false);

  blood3DInit = true;
  animateBlood3D();
}

function switchBlood3DModel(modelKey, autoSpeak = true) {
  currentBlood3DModel = modelKey;

  // Ẩn tất cả các model, chỉ hiện model được chọn
  Object.keys(blood3DModels).forEach(key => {
    if (blood3DModels[key]) {
      blood3DModels[key].visible = (key === modelKey);
    }
  });

  // Điều chỉnh camera phù hợp với từng model
  if (modelKey === 'tube') {
    bloodCamera.position.set(0, 0.4, 7.5);
    bloodControls.target.set(0, 0.3, 0);
  } else if (modelKey === 'rbc') {
    bloodCamera.position.set(0, 0, 4.8);
    bloodControls.target.set(0, 0, 0);
  } else if (modelKey === 'wbc') {
    bloodCamera.position.set(0, 0, 4.6);
    bloodControls.target.set(0, 0, 0);
  } else if (modelKey === 'platelet') {
    bloodCamera.position.set(0, 0, 4.4);
    bloodControls.target.set(0, 0, 0);
  } else {
    // vessel
    bloodCamera.position.set(0.2, 1.2, 5.8);
    bloodControls.target.set(0, 0, 0);
  }
  bloodControls.update();

  // Cập nhật giao diện nút bấm
  document.querySelectorAll('.b3d-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.model === modelKey);
  });

  // Highlight thẻ thành phần tương ứng ở cột phải
  let matchedComp = null;
  if (modelKey === 'rbc') matchedComp = 'rbc';
  else if (modelKey === 'wbc') matchedComp = 'wbc';
  else if (modelKey === 'platelet') matchedComp = 'platelet';
  else if (modelKey === 'tube') matchedComp = 'plasma';

  if (matchedComp) {
    document.querySelectorAll('.comp-item').forEach(el => {
      el.classList.toggle('active', el.dataset.comp === matchedComp);
    });
    if (autoSpeak && state.voiceEnabled && COMPONENT_SPEECH[matchedComp]) {
      speakText(COMPONENT_SPEECH[matchedComp]);
    }
  }
}

function animateBlood3D() {
  blood3DAnimFrame = requestAnimationFrame(animateBlood3D);

  if (!bloodCompModal || bloodCompModal.classList.contains('hidden')) {
    return;
  }

  // Xoay nhẹ nhàng các model 3D để tạo cảm giác không gian chiều sâu
  if (blood3DModels[currentBlood3DModel]) {
    const m = blood3DModels[currentBlood3DModel];
    if (currentBlood3DModel === 'rbc') {
      m.rotation.y += 0.008;
      m.rotation.x = Math.sin(Date.now() * 0.001) * 0.2 + 0.3;
    } else if (currentBlood3DModel === 'wbc') {
      m.rotation.y += 0.007;
      m.rotation.x += 0.004;
    } else if (currentBlood3DModel === 'platelet') {
      m.rotation.y += 0.012;
      m.rotation.z += 0.006;
    } else if (currentBlood3DModel === 'tube') {
      m.rotation.y += 0.005;
    } else if (currentBlood3DModel === 'vessel') {
      m.rotation.y += 0.003;
      if (bloodCellsGroup) {
        bloodCellsGroup.children.forEach(c => {
          c.rotation.x += 0.01;
          c.rotation.y += 0.015;
        });
      }
    }
  }

  if (bloodControls) bloodControls.update();
  if (bloodRenderer && bloodScene && bloodCamera) {
    bloodRenderer.render(bloodScene, bloodCamera);
  }
}

// --- XỬ LÝ SỰ KIỆN MODAL THÀNH PHẦN MÁU ---
const bloodCompModal = document.getElementById('blood-comp-modal');
const btnBloodComp = document.getElementById('btn-blood-comp');
const quickBloodComp = document.getElementById('quick-blood-comp');
const bloodCompClose = document.getElementById('blood-comp-close');

const COMPONENT_SPEECH = {
  plasma: 'Huyết tương chiếm năm mươi lăm phần trăm thể tích máu. Là chất lỏng màu vàng nhạt gồm chín mươi phần trăm là nước và mười phần trăm các chất hòa tan như chất dinh dưỡng, protein, kháng thể, hormone. Huyết tương duy trì máu ở trạng thái lỏng để lưu thông, vận chuyển các chất và điều hòa thân nhiệt.',
  rbc: 'Hồng cầu chiếm khoảng bốn mươi lăm phần trăm thể tích máu. Tế bào hình đĩa lõm hai mặt, không có nhân, chứa huyết sắc tố Hemoglobin màu đỏ. Hồng cầu vận chuyển oxy từ phổi đi nuôi cơ thể, và mang khí carbonic từ tế bào về phổi để đào thải.',
  wbc: 'Bạch cầu chiếm dưới một phần trăm thể tích máu. Là tế bào trong suốt có kích thước lớn nhất, có nhân rõ rệt. Bạch cầu bảo vệ cơ thể thông qua cơ chế thực bào, bắt nuốt vi khuẩn và tiết kháng thể tiêu diệt mầm bệnh.',
  platelet: 'Tiểu cầu chiếm dưới một phần trăm thể tích máu. Là các mảnh tế bào chất nhỏ hình sao, không nhân. Tiểu cầu đóng vai trò quan trọng trong việc đông máu, hình thành cục máu đông bịt kín vết thương để cầm máu.'
};

function speakText(text) {
  if (typeof labState !== 'undefined' && labState.active) return; // Không đọc nội dung khi ở trong phòng tháo lắp
  if (!('speechSynthesis' in window)) return;
  stopSpeaking();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = 'vi-VN';
  utterance.rate = 0.95;
  utterance.pitch = 1.0;
  if (!vietnameseVoice) initVoices();
  if (vietnameseVoice) utterance.voice = vietnameseVoice;
  utterance.onstart = () => { isSpeaking = true; };
  utterance.onend = () => { isSpeaking = false; };
  window.speechSynthesis.speak(utterance);
}

function speakBloodCompOverview() {
  const fullText = 'Máu gồm hai phần chính: Huyết tương chiếm 55%, và các tế bào máu chiếm 45% gồm Hồng cầu, Bạch cầu và Tiểu cầu. Em có thể xoay 360 độ các mô hình 3D và bấm vào từng thành phần để nghe giải thích chi tiết.';
  speakText(fullText);
}

function openBloodCompModal() {
  bloodCompModal.classList.remove('hidden');

  // Khởi tạo khung cảnh 3D lần đầu tiên khi mở modal
  if (!blood3DInit) {
    setTimeout(() => {
      initBlood3DViewer();
    }, 50);
  } else {
    // Kích hoạt cập nhật kích thước canvas
    setTimeout(() => {
      const bloodCanvas = document.getElementById('blood-3d-canvas');
      if (bloodCanvas && bloodRenderer && bloodCamera) {
        const box = bloodCanvas.parentElement;
        bloodCamera.aspect = box.clientWidth / box.clientHeight;
        bloodCamera.updateProjectionMatrix();
        bloodRenderer.setSize(box.clientWidth, box.clientHeight);
      }
    }, 50);
  }

  if (state.voiceEnabled) {
    speakBloodCompOverview();
  }
}

if (btnBloodComp) btnBloodComp.addEventListener('click', openBloodCompModal);
if (quickBloodComp) quickBloodComp.addEventListener('click', openBloodCompModal);
if (bloodCompClose) {
  bloodCompClose.addEventListener('click', () => {
    stopSpeaking();
    bloodCompModal.classList.add('hidden');
  });
}

// Chuyển đổi tab 3D / 2D (SGK)
document.querySelectorAll('.blood-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.blood-tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const tab = btn.dataset.tab;
    const w3d = document.getElementById('blood-3d-wrapper');
    const w2d = document.getElementById('blood-2d-wrapper');

    if (tab === '3d') {
      w3d.style.display = 'block';
      w2d.style.display = 'none';
      if (bloodCanvas && bloodRenderer && bloodCamera) {
        const box = bloodCanvas.parentElement;
        bloodRenderer.setSize(box.clientWidth, box.clientHeight);
      }
    } else {
      w3d.style.display = 'none';
      w2d.style.display = 'block';
    }
  });
});

// Nút chọn mô hình 3D (Lát cắt mạch máu, Ống ly tâm, Hồng cầu, Bạch cầu, Tiểu cầu)
document.querySelectorAll('.b3d-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    switchBlood3DModel(btn.dataset.model, true);
  });
});

// Bấm vào từng thẻ thành phần máu ở cột phải để chuyển sang mô hình 3D tương ứng
document.querySelectorAll('.comp-item').forEach(item => {
  item.addEventListener('click', () => {
    const compKey = item.dataset.comp;
    document.querySelectorAll('.comp-item').forEach(el => el.classList.remove('active'));
    item.classList.add('active');

    // Tự động chuyển tab sang 3D nếu đang xem 2D
    const tab3d = document.getElementById('tab-btn-3d');
    if (tab3d && !tab3d.classList.contains('active')) {
      tab3d.click();
    }

    // Chuyển mô hình 3D tương ứng
    if (compKey === 'rbc') switchBlood3DModel('rbc', false);
    else if (compKey === 'wbc') switchBlood3DModel('wbc', false);
    else if (compKey === 'platelet') switchBlood3DModel('platelet', false);
    else if (compKey === 'plasma') switchBlood3DModel('tube', false);

    if (COMPONENT_SPEECH[compKey]) {
      speakText(COMPONENT_SPEECH[compKey]);
    }
  });
});

const btnCompSpeakAll = document.getElementById('btn-comp-speak-all');
if (btnCompSpeakAll) {
  btnCompSpeakAll.addEventListener('click', () => {
    speakBloodCompOverview();
  });
}

// --- 16. MODAL ĐỐI CHIẾU SƠ ĐỒ GỐC SGK ---
const diagramModal = document.getElementById('diagram-modal');
document.getElementById('btn-compare-diagram').addEventListener('click', () => {
  diagramModal.classList.remove('hidden');
});
document.getElementById('diagram-close').addEventListener('click', () => {
  diagramModal.classList.add('hidden');
});

// Modal Hướng dẫn
const helpModal = document.getElementById('help-modal');
document.getElementById('btn-help').addEventListener('click', () => helpModal.classList.remove('hidden'));
document.getElementById('help-close').addEventListener('click', () => helpModal.classList.add('hidden'));

// Đóng modal khi click ra vùng xám ngoài
[bloodCompModal, diagramModal, helpModal].forEach(m => {
  if (m) {
    m.addEventListener('click', (e) => {
      if (e.target === m) {
        stopSpeaking();
        m.classList.add('hidden');
      }
    });
  }
});

// --- 16. GẮN SỰ KIỆN CÁC NÚT ĐIỀU KHIỂN GIAO DIỆN ---
// Chọn chế độ vòng tuần hoàn
document.querySelectorAll('.mode-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    setViewMode(btn.dataset.mode);
  });
});

// Quick Nav Pills
document.querySelectorAll('.quick-nav-pill').forEach(pill => {
  pill.addEventListener('click', () => {
    selectPart(pill.dataset.target);
  });
});

// Nút Play / Pause
const btnPlayPause = document.getElementById('btn-play-pause');
btnPlayPause.addEventListener('click', () => {
  state.isPlaying = !state.isPlaying;
  btnPlayPause.innerHTML = state.isPlaying
    ? '<i class="fa-solid fa-pause"></i>'
    : '<i class="fa-solid fa-play"></i>';
});

// Tốc độ dòng chảy (Speed buttons)
document.querySelectorAll('.speed-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.speed-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.speed = parseFloat(btn.dataset.speed);
  });
});

// Toggles (Tế bào máu, Mũi tên, Nhãn, Buồng tim trong suốt)
document.getElementById('toggle-cells').addEventListener('change', (e) => {
  state.showCells = e.target.checked;
  bloodStreams.forEach(stream => stream.setVisible(state.showCells));
});

document.getElementById('toggle-arrows').addEventListener('change', (e) => {
  state.showArrows = e.target.checked;
  arrowsGroup.visible = state.showArrows;
});

document.getElementById('toggle-labels').addEventListener('change', (e) => {
  state.showLabels = e.target.checked;
  updateLabelsPosition();
});

document.getElementById('toggle-transparent').addEventListener('change', (e) => {
  state.heartTransparent = e.target.checked;
  heartMatRed.opacity = state.heartTransparent ? 0.35 : 0.94;
  heartMatBlue.opacity = state.heartTransparent ? 0.35 : 0.94;
  heartMatRed.needsUpdate = true;
  heartMatBlue.needsUpdate = true;
});

// Bật / Tắt tự động đọc giọng nói thuyết minh
const toggleVoice = document.getElementById('toggle-voice');
if (toggleVoice) {
  toggleVoice.addEventListener('change', (e) => {
    state.voiceEnabled = e.target.checked;
    if (!state.voiceEnabled) {
      stopSpeaking();
    }
  });
}

// Nút bấm đọc hoặc dừng đọc giọng nói trên Drawer
const btnSpeakToggle = document.getElementById('btn-speak-toggle');
if (btnSpeakToggle) {
  btnSpeakToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else if (state.selectedPart) {
      speakPartContent(state.selectedPart);
    }
  });
}

// Âm thanh nhịp tim
const btnSound = document.getElementById('btn-sound');
btnSound.addEventListener('click', () => {
  state.soundEnabled = !state.soundEnabled;
  btnSound.innerHTML = state.soundEnabled
    ? '<i class="fa-solid fa-volume-high" style="color: #00e676;"></i>'
    : '<i class="fa-solid fa-volume-xmark"></i>';
  if (state.soundEnabled) {
    playHeartbeatSound();
  }
});

// Đặt lại camera (Reset Cam)
document.getElementById('btn-reset-cam').addEventListener('click', () => {
  setViewMode('all');
});

// Đóng drawer chi tiết
document.getElementById('drawer-close').addEventListener('click', () => {
  stopSpeaking();
  infoDrawer.classList.remove('open');
  document.querySelectorAll('.label-3d').forEach(el => el.classList.remove('active'));
});

// --- 17. PHÒNG THỰC HÀNH THÁO LẮP 3D (ASSEMBLY LAB) ---
const labState = {
  active: false,
  mode: 'puzzle', // 'puzzle' or 'explode'
  explodeFactor: 0.0,
  selectedPartId: 'heart',
  assembledCount: 7,
  parts: {},
  ghostObjects: []
};

// Khởi tạo các thông số & bóng mờ vị trí chuẩn của 7 bộ phận
function initAssemblyLab() {
  labState.parts = {
    'heart': {
      id: 'heart',
      name: 'Tim (4 ngăn)',
      type: 'heart',
      object: heartGroup,
      originPos: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(0, 0, 0.4),
      puzzleSidePos: new THREE.Vector3(9.5, -0.4, 0.4),
      color: 0xffb300,
      icon: 'fa-heart',
      badge: 'Trung tâm tuần hoàn',
      clue: 'Khối cơ rỗng gồm 4 ngăn nằm ở trung tâm lồng ngực, hoạt động như chiếc máy bơm hút và đẩy máu đi khắp 2 vòng tuần hoàn.',
      assembled: true,
      isCorrect: true,
      currentSlot: 'slot-heart',
      ghost: null
    },
    'artery-pulmonary': {
      id: 'artery-pulmonary',
      name: 'Động mạch phổi',
      type: 'vessel',
      object: vPulmonaryArtery,
      originPos: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(-3.2, 1.8, 1.2),
      puzzleSidePos: new THREE.Vector3(9.5, 0.4, 0.5),
      color: 0x0088ff,
      icon: 'fa-arrow-up',
      badge: 'Vòng tuần hoàn nhỏ',
      clue: 'Mạch máu xuất phát từ Tâm thất phải, dẫn máu đỏ thẫm (giàu CO₂) đi lên lưới mao mạch phổi để trao đổi khí.',
      assembled: true,
      isCorrect: true,
      currentSlot: 'slot-artery-pulmonary',
      ghost: null
    },
    'capillaries-lungs': {
      id: 'capillaries-lungs',
      name: 'Mao mạch phổi',
      type: 'capillaries',
      object: lungCapillaries,
      originPos: new THREE.Vector3(0, 5.4, 0),
      explodeOffset: new THREE.Vector3(0, 4.0, 0.8),
      puzzleSidePos: new THREE.Vector3(9.5, 6.2, 0.5),
      color: 0x9c27b0,
      icon: 'fa-lungs',
      badge: 'Vòng tuần hoàn nhỏ',
      clue: 'Lưới mao mạch nằm ở đỉnh phía trên bao quanh phế nang, nơi máu thải khí CO₂ và nhận O₂ biến thành máu đỏ tươi.',
      assembled: true,
      isCorrect: true,
      currentSlot: 'slot-capillaries-lungs',
      ghost: null
    },
    'vein-pulmonary': {
      id: 'vein-pulmonary',
      name: 'Tĩnh mạch phổi',
      type: 'vessel',
      object: vPulmonaryVein,
      originPos: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(3.2, 1.8, 1.2),
      puzzleSidePos: new THREE.Vector3(9.5, 0.4, 0.5),
      color: 0xff334b,
      icon: 'fa-arrow-down',
      badge: 'Vòng tuần hoàn nhỏ',
      clue: 'Mạch máu dẫn máu đỏ tươi (giàu O₂) vừa được nạp oxy từ mao mạch phổi đi xuống đổ về Tâm nhĩ trái của tim.',
      assembled: true,
      isCorrect: true,
      currentSlot: 'slot-vein-pulmonary',
      ghost: null
    },
    'artery-systemic': {
      id: 'artery-systemic',
      name: 'Động mạch (chủ)',
      type: 'vessel',
      object: vSystemicArtery,
      originPos: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(3.5, -2.2, 1.2),
      puzzleSidePos: new THREE.Vector3(9.5, -0.6, 0.5),
      color: 0xff334b,
      icon: 'fa-arrow-down',
      badge: 'Vòng tuần hoàn lớn',
      clue: 'Động mạch lớn nhất cơ thể xuất phát từ Tâm thất trái, dẫn dòng máu đỏ tươi giàu O₂ đi xuống nuôi dưỡng các cơ quan.',
      assembled: true,
      isCorrect: true,
      currentSlot: 'slot-artery-systemic',
      ghost: null
    },
    'capillaries-body': {
      id: 'capillaries-body',
      name: 'Mao mạch ở các cơ quan',
      type: 'capillaries',
      object: bodyCapillaries,
      originPos: new THREE.Vector3(0, -5.4, 0),
      explodeOffset: new THREE.Vector3(0, -4.0, 0.8),
      puzzleSidePos: new THREE.Vector3(9.5, -6.5, 0.5),
      color: 0x9c27b0,
      icon: 'fa-network-wired',
      badge: 'Vòng tuần hoàn lớn',
      clue: 'Mạng lưới mao mạch phía dưới nuôi tế bào cơ quan, tại đây máu nhường O₂ & dưỡng chất, nhận lại CO₂ trở thành máu đỏ thẫm.',
      assembled: true,
      isCorrect: true,
      currentSlot: 'slot-capillaries-body',
      ghost: null
    },
    'vein-systemic': {
      id: 'vein-systemic',
      name: 'Tĩnh mạch',
      type: 'vessel',
      object: vSystemicVein,
      originPos: new THREE.Vector3(0, 0, 0),
      explodeOffset: new THREE.Vector3(-3.5, -2.2, 1.2),
      puzzleSidePos: new THREE.Vector3(9.5, -0.6, 0.5),
      color: 0x0088ff,
      icon: 'fa-arrow-up',
      badge: 'Vòng tuần hoàn lớn',
      clue: 'Hệ thống tĩnh mạch thu gom máu nghèo O₂ (màu xanh/đỏ thẫm) từ các cơ quan đi lên để đổ về Tâm nhĩ phải.',
      assembled: true,
      isCorrect: true,
      currentSlot: 'slot-vein-systemic',
      ghost: null
    }
  };

  // Tạo nhóm bóng mờ hiển thị vị trí lắp ráp chuẩn trong 3D
  const ghostGroup = new THREE.Group();
  ghostGroup.name = 'assemblyGhostGroup';
  scene.add(ghostGroup);

  Object.values(labState.parts).forEach(part => {
    let gMesh = null;
    const gMat = new THREE.MeshBasicMaterial({
      color: part.color,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    if (part.object.isMesh) {
      gMesh = new THREE.Mesh(part.object.geometry.clone(), gMat);
      gMesh.position.copy(part.originPos);
      gMesh.rotation.copy(part.object.rotation);
      gMesh.scale.copy(part.object.scale);
      gMesh.userData = { isGhost: true, partId: part.id };
    } else {
      gMesh = new THREE.Group();
      part.object.traverse(child => {
        if (child.isMesh && child.geometry) {
          const cm = new THREE.Mesh(child.geometry.clone(), gMat);
          cm.position.copy(child.position);
          cm.rotation.copy(child.rotation);
          cm.scale.copy(child.scale);
          cm.userData = { isGhost: true, partId: part.id };
          gMesh.add(cm);
        }
      });
      gMesh.position.copy(part.originPos);
      gMesh.userData = { isGhost: true, partId: part.id };
    }

    gMesh.visible = false;
    ghostGroup.add(gMesh);
    part.ghost = gMesh;
    labState.ghostObjects.push(gMesh);
  });

  // Các vị trí ô chứa (Slots) độc lập, xếp ngay ngắn thành 2 cột theo đúng thứ tự 1 -> 7
  const partSlots = {
    // Cột 1 (Bên trái kệ): Tim + Vòng tuần hoàn nhỏ (thứ tự 1 -> 4)
    'heart':             { slot: new THREE.Vector3(8.0, 4.3, 0.4), order: 1 },
    'artery-pulmonary':  { slot: new THREE.Vector3(8.0, 1.4, 0.4), order: 2 },
    'capillaries-lungs': { slot: new THREE.Vector3(8.0, -1.5, 0.4), order: 3 },
    'vein-pulmonary':    { slot: new THREE.Vector3(8.0, -4.4, 0.4), order: 4 },
    // Cột 2 (Bên phải kệ): Vòng tuần hoàn lớn (thứ tự 5 -> 7)
    'artery-systemic':   { slot: new THREE.Vector3(12.0, 3.4, 0.4), order: 5 },
    'capillaries-body':  { slot: new THREE.Vector3(12.0, 0.0, 0.4), order: 6 },
    'vein-systemic':     { slot: new THREE.Vector3(12.0, -3.4, 0.4), order: 7 }
  };

  // Tạo nhóm kệ & bệ đỡ cho các linh kiện bên phải
  let shelfGroup = scene.getObjectByName('assemblyShelfGroup');
  if (!shelfGroup) {
    shelfGroup = new THREE.Group();
    shelfGroup.name = 'assemblyShelfGroup';
    shelfGroup.visible = false;
    scene.add(shelfGroup);
  } else {
    while (shelfGroup.children.length > 0) shelfGroup.remove(shelfGroup.children[0]);
  }

  // Tính toán tâm hình học chính xác và tạo bệ đỡ cho từng bộ phận
  Object.values(labState.parts).forEach(part => {
    const slotInfo = partSlots[part.id];
    if (slotInfo) {
      part.slotPos = slotInfo.slot.clone();
      part.order = slotInfo.order;

      // Đo tâm hình học chuẩn xác của vật thể 3D
      const origPos = part.object.position.clone();
      part.object.position.set(0, 0, 0);
      part.object.updateMatrixWorld(true);
      const box = new THREE.Box3().setFromObject(part.object);
      const geoCenter = new THREE.Vector3();
      box.getCenter(geoCenter);
      part.object.position.copy(origPos);
      part.object.updateMatrixWorld(true);

      // Đặt vị trí vật thể sao cho tâm của nó trùng khớp vào slotPos độc lập
      part.puzzleSidePos = part.slotPos.clone().sub(geoCenter);

      // Tạo bệ đỡ tròn phát sáng cho từng ô linh kiện
      const baseGeo = new THREE.CylinderGeometry(1.2, 1.35, 0.06, 20);
      const baseMat = new THREE.MeshBasicMaterial({
        color: part.color,
        transparent: true,
        opacity: 0.28
      });
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.set(part.slotPos.x, part.slotPos.y - 1.25, 0.1);
      baseMesh.rotation.x = Math.PI * 0.1;
      baseMesh.userData = { partId: part.id };
      shelfGroup.add(baseMesh);

      // Thêm nhãn số thứ tự [1] -> [7] bằng Sprite
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = 128;
      spriteCanvas.height = 128;
      const ctx = spriteCanvas.getContext('2d');
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(64, 64, 52, 0, Math.PI * 2);
      ctx.fill();
      ctx.lineWidth = 8;
      ctx.strokeStyle = `#${part.color.toString(16).padStart(6, '0')}`;
      ctx.stroke();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 54px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${part.order}`, 64, 64);

      const spriteTexture = new THREE.CanvasTexture(spriteCanvas);
      const spriteMat = new THREE.SpriteMaterial({ map: spriteTexture, transparent: true });
      const numSprite = new THREE.Sprite(spriteMat);
      numSprite.scale.set(0.9, 0.9, 1);
      numSprite.position.set(part.slotPos.x - 1.5, part.slotPos.y + 1.25, 1.0);
      numSprite.renderOrder = 99;
      shelfGroup.add(numSprite);
    }
  });
}

function setGhostHighlight(ghostObj, hexColor, opacity) {
  if (!ghostObj) return;
  ghostObj.traverse(child => {
    if (child.isMesh && child.material) {
      if (child.material.color) child.material.color.setHex(hexColor);
      child.material.opacity = opacity;
      child.material.transparent = true;
    }
  });
}

// 7 vị trí cắm (Target Slots) trên khung mô hình đích
const TARGET_SLOTS = {
  'slot-heart': {
    id: 'slot-heart',
    name: 'Tim (4 ngăn)',
    targetCenter: new THREE.Vector3(0, 0, 0),
    correctPartId: 'heart',
    allowedTypes: ['heart'],
    occupant: null
  },
  'slot-artery-pulmonary': {
    id: 'slot-artery-pulmonary',
    name: 'Động mạch phổi (Phía trên - Trái)',
    targetCenter: new THREE.Vector3(-1.3, 3.0, 0),
    correctPartId: 'artery-pulmonary',
    allowedTypes: ['vessel'],
    occupant: null
  },
  'slot-vein-pulmonary': {
    id: 'slot-vein-pulmonary',
    name: 'Tĩnh mạch phổi (Phía trên - Phải)',
    targetCenter: new THREE.Vector3(1.3, 3.0, 0),
    correctPartId: 'vein-pulmonary',
    allowedTypes: ['vessel'],
    occupant: null
  },
  'slot-artery-systemic': {
    id: 'slot-artery-systemic',
    name: 'Động mạch (chủ) (Phía dưới - Phải)',
    targetCenter: new THREE.Vector3(1.5, -2.5, 0),
    correctPartId: 'artery-systemic',
    allowedTypes: ['vessel'],
    occupant: null
  },
  'slot-vein-systemic': {
    id: 'slot-vein-systemic',
    name: 'Tĩnh mạch (Phía dưới - Trái)',
    targetCenter: new THREE.Vector3(-1.5, -2.5, 0),
    correctPartId: 'vein-systemic',
    allowedTypes: ['vessel'],
    occupant: null
  },
  'slot-capillaries-lungs': {
    id: 'slot-capillaries-lungs',
    name: 'Mao mạch phổi (Đỉnh trên)',
    targetCenter: new THREE.Vector3(0, 5.4, 0),
    correctPartId: 'capillaries-lungs',
    allowedTypes: ['capillaries'],
    occupant: null
  },
  'slot-capillaries-body': {
    id: 'slot-capillaries-body',
    name: 'Mao mạch ở các cơ quan (Đáy dưới)',
    targetCenter: new THREE.Vector3(0, -5.4, 0),
    correctPartId: 'capillaries-body',
    allowedTypes: ['capillaries'],
    occupant: null
  }
};

function getPartSlotTransform(partId, slotId) {
  if (slotId === 'slot-heart') {
    return { pos: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(1, 1, 1) };
  }
  if (slotId === 'slot-capillaries-lungs') {
    return { pos: new THREE.Vector3(0, 5.4, 0), scale: new THREE.Vector3(1, 1, 1) };
  }
  if (slotId === 'slot-capillaries-body') {
    return { pos: new THREE.Vector3(0, -5.4, 0), scale: new THREE.Vector3(1, 1, 1) };
  }

  // 4 nhánh mạch máu
  const slotQuadrant = {
    'slot-artery-pulmonary': { x: -1, y: 1 },
    'slot-vein-pulmonary':   { x: 1,  y: 1 },
    'slot-artery-systemic':  { x: 1,  y: -1 },
    'slot-vein-systemic':    { x: -1, y: -1 }
  };
  const partQuadrant = {
    'artery-pulmonary': { x: -1, y: 1 },
    'vein-pulmonary':   { x: 1,  y: 1 },
    'artery-systemic':  { x: 1,  y: -1 },
    'vein-systemic':    { x: -1, y: -1 }
  };

  const sQ = slotQuadrant[slotId];
  const pQ = partQuadrant[partId];
  if (!sQ || !pQ) {
    return { pos: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(1, 1, 1) };
  }

  const sx = (sQ.x === pQ.x) ? 1 : -1;
  const sy = (sQ.y === pQ.y) ? 1 : -1;
  return { pos: new THREE.Vector3(0, 0, 0), scale: new THREE.Vector3(sx, sy, 1) };
}

function setShelfPedestalVisible(partId, visible) {
  const shelfGroup = scene.getObjectByName('assemblyShelfGroup');
  if (shelfGroup) {
    shelfGroup.traverse(child => {
      if (child.userData && child.userData.partId === partId) {
        child.visible = visible;
      }
    });
  }
}

function showLabAlert(msg) {
  let alertBox = document.getElementById('lab-alert-box');
  if (!alertBox) {
    alertBox = document.createElement('div');
    alertBox.id = 'lab-alert-box';
    alertBox.className = 'lab-alert-box';
    const hud = document.getElementById('assembly-lab-hud');
    if (hud) hud.appendChild(alertBox);
  }
  if (alertBox) {
    alertBox.innerHTML = msg;
    alertBox.classList.add('show');
    clearTimeout(alertBox._timer);
    alertBox._timer = setTimeout(() => {
      alertBox.classList.remove('show');
    }, 4500);
  }
}

function updateGhostVisibility() {
  Object.values(TARGET_SLOTS).forEach(slot => {
    const correctPart = labState.parts[slot.correctPartId];
    if (correctPart && correctPart.ghost) {
      correctPart.ghost.visible = !slot.occupant;
    }
  });
}

function playSnapSound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(523.25, now);
    osc.frequency.exponentialRampToValueAtTime(1046.5, now + 0.15);
    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.22);
  } catch(e) {}
}

function playVictorySound() {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const now = audioCtx.currentTime;
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((freq, idx) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.1);
      gain.gain.setValueAtTime(0.3, now + idx * 0.1);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now + idx * 0.1);
      osc.stop(now + idx * 0.1 + 0.35);
    });
  } catch(e) {}
}

function enterAssemblyLab() {
  labState.active = true;
  document.body.classList.add('in-lab-mode');
  stopSpeaking();

  if (Object.keys(labState.parts).length === 0) {
    initAssemblyLab();
  }

  // Ẩn các thanh HUD thông thường
  document.getElementById('assembly-lab-hud').classList.remove('hidden');
  document.querySelector('.floating-controls').style.display = 'none';
  document.querySelector('.quick-nav').style.display = 'none';
  document.querySelector('.legend-card').style.display = 'none';
  document.getElementById('labels-overlay').style.display = 'none';
  infoDrawer.classList.remove('open');

  // Đưa camera về góc nhìn toàn cảnh rộng rãi, vừa vặn toàn bộ mô hình và các chi tiết tháo rời
  animateCameraTo(new THREE.Vector3(2.5, 0, 31), new THREE.Vector3(2.5, 0, 0), 600);

  // Mặc định ban đầu vào chế độ Thử thách Lắp ráp 3D
  setLabMode('puzzle');
}

function exitAssemblyLab() {
  labState.active = false;
  document.body.classList.remove('in-lab-mode');
  stopSpeaking();

  const zoneIndicators = document.getElementById('lab-zone-indicators');
  if (zoneIndicators) zoneIndicators.classList.add('hidden');

  const shelfGroup = scene.getObjectByName('assemblyShelfGroup');
  if (shelfGroup) shelfGroup.visible = false;

  // Ráp lại toàn bộ về vị trí chuẩn
  setExplodeFactor(0.0);
  Object.values(labState.parts).forEach(part => {
    part.assembled = true;
    part.object.position.copy(part.originPos);
    if (part.ghost) part.ghost.visible = false;
  });

  // Hiện lại giao diện thông thường
  document.getElementById('assembly-lab-hud').classList.add('hidden');
  document.querySelector('.floating-controls').style.display = 'flex';
  document.querySelector('.quick-nav').style.display = 'flex';
  document.querySelector('.legend-card').style.display = 'block';
  document.getElementById('labels-overlay').style.display = 'block';

  // Khôi phục camera
  setViewMode('all');
}

function setLabMode(mode) {
  labState.mode = mode;
  const btnExplode = document.getElementById('btn-lab-mode-explode');
  if (btnExplode) btnExplode.classList.toggle('active', mode === 'explode');
  const btnPuzzle = document.getElementById('btn-lab-mode-puzzle');
  if (btnPuzzle) btnPuzzle.classList.toggle('active', mode === 'puzzle');

  const explodeCtrl = document.getElementById('lab-explode-control');
  const clueCard = document.getElementById('lab-clue-card');
  const partsTray = document.getElementById('lab-parts-tray');
  const zoneIndicators = document.getElementById('lab-zone-indicators');
  const shelfGroup = scene.getObjectByName('assemblyShelfGroup');

  if (mode === 'explode') {
    if (explodeCtrl) explodeCtrl.style.display = 'flex';
    if (clueCard) clueCard.classList.add('hidden');
    if (partsTray) partsTray.classList.add('hidden');
    if (zoneIndicators) zoneIndicators.classList.add('hidden');
    if (shelfGroup) shelfGroup.visible = false;

    animateCameraTo(new THREE.Vector3(0, 0, 27), new THREE.Vector3(0, 0, 0), 600);

    // Ẩn các bóng mờ
    Object.values(labState.parts).forEach(part => {
      if (part.ghost) part.ghost.visible = false;
    });

    setExplodeFactor(labState.explodeFactor);
  } else {
    // Chế độ Thử thách Lắp ráp 3D
    if (explodeCtrl) explodeCtrl.style.display = 'none';
    if (clueCard) clueCard.classList.remove('hidden');
    if (partsTray) partsTray.classList.remove('hidden');
    if (zoneIndicators) zoneIndicators.classList.remove('hidden');

    startPuzzleChallenge();
  }
}

function setExplodeFactor(factor) {
  labState.explodeFactor = factor;
  Object.values(labState.parts).forEach(part => {
    const targetPos = part.originPos.clone().add(part.explodeOffset.clone().multiplyScalar(factor));
    part.object.position.copy(targetPos);
  });

  const slider = document.getElementById('explode-slider');
  const txt = document.getElementById('explode-val-txt');
  if (slider) slider.value = Math.round(factor * 100);
  if (txt) txt.textContent = `${Math.round(factor * 100)}%`;

  // Cập nhật tiến độ
  const progText = document.getElementById('lab-progress-text');
  if (progText) {
    if (factor === 0) {
      progText.textContent = 'Tiến độ: Hoàn chỉnh 7 / 7 bộ phận';
    } else {
      progText.textContent = `Tháo rã: ${Math.round(factor * 100)}% khoảng cách`;
    }
  }
}

function startPuzzleChallenge() {
  labState.assembledCount = 0;
  // Căn góc camera cân đối, thoáng đãng giữa Khung mô hình đích (bên trái) và Kệ linh kiện (bên phải)
  animateCameraTo(new THREE.Vector3(2.5, 0, 31), new THREE.Vector3(2.5, 0, 0), 600);

  // Reset toàn bộ các vị trí cắm (Slots)
  Object.values(TARGET_SLOTS).forEach(slot => {
    slot.occupant = null;
  });

  const shelfGroup = scene.getObjectByName('assemblyShelfGroup');
  if (shelfGroup) {
    shelfGroup.visible = true;
    shelfGroup.traverse(child => {
      if (child.userData && child.userData.partId) {
        child.visible = true;
      }
    });
  }

  // Xếp tất cả các bộ phận dạt gọn gàng sang một bên theo thứ tự độc lập
  Object.values(labState.parts).forEach(part => {
    part.assembled = false;
    part.isCorrect = false;
    part.currentSlot = null;
    part.object.scale.set(1, 1, 1);
    part.object.position.copy(part.puzzleSidePos);
    if (part.ghost) part.ghost.visible = true;
  });

  renderTrayItems();
  updateLabProgress();
  selectTrayPart('heart');
}

// ================= DRAG & DROP KHAY LINH KIỆN VÀ MÔ HÌNH 3D =================
const dragPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
const dragRaycaster = new THREE.Raycaster();
const dragPlaneIntersect = new THREE.Vector3();
let activeDragPart = null;

function get3DWorldPos(clientX, clientY) {
  const rect = renderer.domElement.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return null;
  const ndcX = ((clientX - rect.left) / rect.width) * 2 - 1;
  const ndcY = -((clientY - rect.top) / rect.height) * 2 + 1;
  dragRaycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  if (dragRaycaster.ray.intersectPlane(dragPlane, dragPlaneIntersect)) {
    return dragPlaneIntersect.clone();
  }
  return null;
}

function showDropOverlay(show = false) {
  const overlay = document.getElementById('lab-drop-overlay');
  if (overlay) overlay.classList.toggle('hidden', !show);
}

function handleDragMove(clientX, clientY) {
  if (!activeDragPart) return;
  const worldPos = get3DWorldPos(clientX, clientY);
  if (!worldPos) return;

  // Di chuyển bộ phận 3D trực tiếp theo con trỏ chuột
  activeDragPart.object.position.set(worldPos.x, worldPos.y, activeDragPart.originPos.z + 0.3);
}

function findBestMatchingSlot(part, worldPos) {
  let bestSlot = null;
  let minDist = 999;

  Object.values(TARGET_SLOTS).forEach(slot => {
    // Chỉ xét các slot tương thích với loại bộ phận (mao mạch vào mao mạch, mạch máu vào mạch máu, tim vào tim)
    if (!slot.allowedTypes.includes(part.type)) return;

    const dist = worldPos.distanceTo(slot.targetCenter);
    if (dist < minDist) {
      minDist = dist;
      bestSlot = slot;
    }
  });

  // Cự ly cho phép bắt dính vào slot (4.8 đơn vị thế giới)
  if (minDist < 4.8) {
    return bestSlot;
  }
  return null;
}

function handleDragEnd(clientX, clientY) {
  if (!activeDragPart) return;
  const part = activeDragPart;
  activeDragPart = null;
  controls.enabled = true;
  showDropOverlay(false);

  const rect = renderer.domElement.getBoundingClientRect();
  const insideCanvas = clientX >= rect.left && clientX <= rect.right &&
                       clientY >= rect.top && clientY <= rect.bottom;

  const worldPos = get3DWorldPos(clientX, clientY);

  if (insideCanvas && worldPos) {
    // 1. Nếu kéo thả về khu vực kệ linh kiện bên phải (X > 2.8) hoặc thả xuống khay phía dưới: tháo bộ phận trả về kệ chờ ban đầu
    if (worldPos.x > 2.8 || clientY > rect.bottom - 100) {
      uninstallPartToShelf(part.id);
      return;
    }

    // 2. Nếu thả sang khu vực mô hình đích bên trái (X <= 2.8): tìm vị trí cắm (slot) tương thích gần nhất
    if (worldPos.x <= 2.8 && clientY <= rect.bottom - 100) {
      const bestSlot = findBestMatchingSlot(part, worldPos);
      if (bestSlot) {
        snapPartIntoSlot(part.id, bestSlot.id);
        return;
      }
    }
  }

  // 3. Nếu thả ra ở khoảng trống không hợp lệ:
  // Nếu là bộ phận đang lắp sai vị trí mà bị kéo ra khỏi socket: tự động trả về kệ ban đầu
  if (part.assembled && !part.isCorrect) {
    uninstallPartToShelf(part.id);
    return;
  }

  if (part.assembled && part.currentSlot) {
    const tf = getPartSlotTransform(part.id, part.currentSlot);
    part.object.scale.copy(tf.scale);
    animatePartTo(part.object, tf.pos, 280);
  } else {
    // Trả về vị trí kệ linh kiện bên phải
    part.object.scale.set(1, 1, 1);
    animatePartTo(part.object, part.puzzleSidePos, 280);
    setGhostHighlight(part.ghost, part.color, 0.25);
  }
}

// Bắt sự kiện kéo thả toàn cục cho HTML5 Drag & Drop
window.addEventListener('dragover', (e) => {
  if (activeDragPart) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    handleDragMove(e.clientX, e.clientY);
  }
});

window.addEventListener('drop', (e) => {
  if (activeDragPart) {
    e.preventDefault();
    handleDragEnd(e.clientX, e.clientY);
  }
});

function setupCardDragDrop(card, part) {
  card.addEventListener('dragstart', (e) => {
    activeDragPart = part;
    part.object.scale.set(1, 1, 1);
    controls.enabled = false;
    card.classList.add('dragging');
    selectTrayPart(part.id);
    showDropOverlay(true);
    e.dataTransfer.setData('text/plain', part.id);
    e.dataTransfer.effectAllowed = 'copyMove';

    // Tạo hình preview trong suốt để vật thể 3D trực tiếp di chuyển theo chuột
    const transparentImg = new Image();
    transparentImg.src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
    e.dataTransfer.setDragImage(transparentImg, 0, 0);
  });

  card.addEventListener('dragend', (e) => {
    card.classList.remove('dragging');
    if (activeDragPart) {
      handleDragEnd(e.clientX, e.clientY);
    }
  });
}

function setupCardPointerDrag(card, part) {
  let isDown = false;
  let didMove = false;
  let startX = 0;
  let startY = 0;

  card.addEventListener('pointerdown', (e) => {
    isDown = true;
    didMove = false;
    startX = e.clientX;
    startY = e.clientY;
  });

  card.addEventListener('pointermove', (e) => {
    if (!isDown) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    if (!didMove && Math.hypot(dx, dy) > 8) {
      didMove = true;
      card._wasDragged = true;
      activeDragPart = part;
      part.object.scale.set(1, 1, 1);
      controls.enabled = false;
      card.classList.add('dragging');
      try { card.setPointerCapture(e.pointerId); } catch(err) {}
      selectTrayPart(part.id);
      showDropOverlay(true);
    }

    if (didMove && activeDragPart === part) {
      handleDragMove(e.clientX, e.clientY);
    }
  });

  const onPointerUp = (e) => {
    if (!isDown) return;
    isDown = false;
    if (didMove) {
      try { card.releasePointerCapture(e.pointerId); } catch(err) {}
      card.classList.remove('dragging');
      handleDragEnd(e.clientX, e.clientY);
      setTimeout(() => { card._wasDragged = false; }, 120);
    }
  };

  card.addEventListener('pointerup', onPointerUp);
  card.addEventListener('pointercancel', onPointerUp);
}

function renderTrayItems() {
  const grid = document.getElementById('tray-items-grid');
  if (!grid) return;

  grid.innerHTML = '';
  Object.values(labState.parts).forEach(part => {
    let placedClass = '';
    if (part.assembled) {
      placedClass = part.isCorrect ? 'placed correct' : 'placed wrong';
    }

    const card = document.createElement('div');
    card.className = `tray-item-card ${placedClass} ${labState.selectedPartId === part.id ? 'selected' : ''}`;
    card.dataset.id = part.id;
    card.setAttribute('draggable', 'true');

    card.innerHTML = `
      <span class="tray-order-num">${part.order || ''}</span>
      <i class="fa-solid fa-grip-vertical tray-grip" title="Kéo thả vào mô hình"></i>
      <div class="tray-item-icon" style="background: ${part.color}">
        <i class="fa-solid ${part.icon}"></i>
      </div>
      <span class="tray-item-name">${part.name}</span>
    `;

    // Nhấp chọn xem thông tin & phát sáng vị trí đích (học sinh phải tự kéo thả mới lắp ráp được)
    card.addEventListener('click', () => {
      if (card._wasDragged) return;
      selectTrayPart(part.id);
    });

    // Kéo thả HTML5
    setupCardDragDrop(card, part);

    // Kéo thả cảm ứng Touch / Pointer
    setupCardPointerDrag(card, part);

    grid.appendChild(card);
  });
}

function selectTrayPart(partId) {
  const part = labState.parts[partId];
  if (!part) return;

  labState.selectedPartId = partId;

  // Cập nhật giao diện khay
  document.querySelectorAll('.tray-item-card').forEach(c => {
    c.classList.toggle('selected', c.dataset.id === partId);
  });

  // Cập nhật hộp gợi ý
  const clueBadge = document.getElementById('clue-badge');
  const clueTitle = document.getElementById('clue-title');
  const clueDesc = document.getElementById('clue-desc');

  if (clueBadge) clueBadge.textContent = part.badge.toUpperCase();
  if (clueTitle) clueTitle.textContent = `Lắp: ${part.name}`;
  if (part.assembled && !part.isCorrect) {
    if (clueDesc) {
      clueDesc.innerHTML = `
        <span style="color: #fbbf24; font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> Bộ phận này đang lắp sai vị trí (dòng máu chưa thể lưu thông)!</span><br>
        <span style="font-size: 12.5px; color: #cbd5e1; display: inline-block; margin-top: 4px;">Em có thể kéo vật thể 3D ngược về kệ bên phải/khay dưới, hoặc bấm nút tháo:</span>
        <div style="margin-top: 8px;">
          <button id="btn-return-misplaced" class="btn-return-misplaced" type="button">
            <i class="fa-solid fa-rotate-left"></i> Tháo về kệ ban đầu
          </button>
        </div>
      `;
      const btnReturn = document.getElementById('btn-return-misplaced');
      if (btnReturn) {
        btnReturn.onclick = (e) => {
          e.stopPropagation();
          uninstallPartToShelf(part.id);
        };
      }
    }
  } else if (part.assembled && part.isCorrect) {
    if (clueDesc) clueDesc.innerHTML = `<span style="color: #10b981; font-weight: 700;">✓ Đã lắp đúng vị trí giải phẫu!</span> ${part.clue}`;
  } else {
    if (clueDesc) clueDesc.textContent = part.clue;
  }

  // Giữ toàn bộ khung bóng mờ ở màu tự nhiên đồng nhất, không phát sáng màu xanh chỉ điểm
  Object.values(labState.parts).forEach(p => {
    if (p.ghost && !p.assembled) {
      setGhostHighlight(p.ghost, p.color, 0.25);
    }
  });
}

function snapPartIntoSlot(partId, slotId) {
  const part = labState.parts[partId];
  const slot = TARGET_SLOTS[slotId];
  if (!part || !slot) return;

  // Nếu bộ phận này đang ở slot khác, giải phóng slot cũ
  if (part.currentSlot && part.currentSlot !== slotId) {
    const oldSlot = TARGET_SLOTS[part.currentSlot];
    if (oldSlot && oldSlot.occupant === partId) {
      oldSlot.occupant = null;
    }
  }

  // Nếu slot này đã có bộ phận khác đang cắm, đưa bộ phận cũ về kệ bên phải
  if (slot.occupant && slot.occupant !== partId) {
    const prevOccupant = labState.parts[slot.occupant];
    if (prevOccupant) {
      prevOccupant.assembled = false;
      prevOccupant.isCorrect = false;
      prevOccupant.currentSlot = null;
      prevOccupant.object.scale.set(1, 1, 1);
      animatePartTo(prevOccupant.object, prevOccupant.puzzleSidePos, 350);
      setShelfPedestalVisible(prevOccupant.id, true);
    }
  }

  // Gắn bộ phận vào slot mới
  slot.occupant = partId;
  part.currentSlot = slotId;
  part.assembled = true;
  part.isCorrect = (slot.correctPartId === partId);

  // Áp dụng phép biến đổi vị trí và tỷ lệ đối xứng (nếu cắm vào nhánh đối xứng)
  const tf = getPartSlotTransform(part.id, slot.id);
  part.object.scale.copy(tf.scale);
  animatePartTo(part.object, tf.pos, 350);

  // Ẩn bệ đỡ trên kệ
  setShelfPedestalVisible(part.id, false);

  // Cập nhật ẩn/hiện bóng mờ
  updateGhostVisibility();

  // Âm thanh và thông báo phản hồi sư phạm
  playSnapSound();
  if (!part.isCorrect) {
    showLabAlert(`⚠️ <strong>${part.name}</strong> đã lắp nhưng <strong>sai vị trí giải phẫu</strong>!<br>Dòng máu không thể chảy qua đây. Em hãy kéo đổi lại đúng vị trí.`);
    selectTrayPart(part.id);
  }

  // Cập nhật tiến độ
  updateLabProgress();

  // Tự động gợi ý bộ phận tiếp theo nếu lắp đúng
  if (part.isCorrect) {
    const nextUnplaced = Object.values(labState.parts).find(p => !p.assembled || !p.isCorrect);
    if (nextUnplaced) {
      selectTrayPart(nextUnplaced.id);
    }
  }
}

function uninstallPartToShelf(partId) {
  const part = labState.parts[partId];
  if (!part) return;

  if (part.currentSlot) {
    const slot = TARGET_SLOTS[part.currentSlot];
    if (slot && slot.occupant === partId) {
      slot.occupant = null;
    }
  }

  part.assembled = false;
  part.isCorrect = false;
  part.currentSlot = null;
  part.object.scale.set(1, 1, 1);
  animatePartTo(part.object, part.puzzleSidePos, 350);
  setShelfPedestalVisible(part.id, true);

  updateGhostVisibility();
  updateLabProgress();
  selectTrayPart(part.id);
  showLabAlert(`↩ Đã tháo <strong>${part.name}</strong> về lại kệ ban đầu.`);
}

function snapPartIntoPlace(partId) {
  const slotId = 'slot-' + partId;
  snapPartIntoSlot(partId, slotId);
}

function animatePartTo(object, targetPos, duration = 400) {
  const startPos = object.position.clone();
  const startTime = performance.now();

  function anim(time) {
    const elapsed = time - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3);

    object.position.lerpVectors(startPos, targetPos, ease);
    if (progress < 1) {
      requestAnimationFrame(anim);
    }
  }
  requestAnimationFrame(anim);
}

function updateLabProgress() {
  const correctCount = Object.values(labState.parts).filter(p => p.assembled && p.isCorrect).length;
  const wrongCount = Object.values(labState.parts).filter(p => p.assembled && !p.isCorrect).length;
  labState.assembledCount = correctCount + wrongCount;

  const progText = document.getElementById('lab-progress-text');
  if (progText) {
    if (wrongCount > 0) {
      progText.innerHTML = `Tiến độ: <span style="color: #10b981; font-weight: 700;">Đúng ${correctCount}/7</span> • <span style="color: #fbbf24; font-weight: 700;"><i class="fa-solid fa-triangle-exclamation"></i> Có ${wrongCount} vị trí sai (máu không chảy)</span>`;
    } else {
      progText.textContent = `Tiến độ: Đã lắp đúng ${correctCount} / 7 bộ phận`;
    }
  }

  renderTrayItems();

  if (correctCount === 7) {
    setTimeout(onAssemblyComplete, 600);
  }
}

function onAssemblyComplete() {
  playVictorySound();
  const vicModal = document.getElementById('assembly-victory-modal');
  if (vicModal) vicModal.classList.remove('hidden');
}

let _justDragged3D = false;

function handleLab3DClick() {
  if (_justDragged3D) return;

  const labRay = new THREE.Raycaster();
  labRay.setFromCamera(mouse, camera);

  // Kiểm tra click vào bóng mờ vị trí mục tiêu: chỉ chọn xem gợi ý, không tự động ráp
  const ghostHits = labRay.intersectObjects(scene.getObjectByName('assemblyGhostGroup')?.children || [], true);
  if (ghostHits.length > 0) {
    let hit = ghostHits[0].object;
    while (hit && !hit.userData.partId && hit.parent) hit = hit.parent;
    if (hit && hit.userData.partId) {
      selectTrayPart(hit.userData.partId);
      return;
    }
  }

  // Kiểm tra click vào chính bộ phận đang nằm ở kệ: chỉ chọn xem vị trí, không tự động ráp
  const partHits = labRay.intersectObjects(interactiveObjects, true);
  if (partHits.length > 0) {
    let hit = partHits[0].object;
    while (hit && !hit.userData.id && hit.parent) hit = hit.parent;
    if (hit && hit.userData.id) {
      const pId = hit.userData.id;
      if (labState.parts[pId]) {
        selectTrayPart(pId);
      }
    }
  }
}

// Bắt sự kiện kéo thả trực tiếp vật thể 3D trên màn hình canvas (học sinh phải chủ động kéo sang khung đích)
renderer.domElement.addEventListener('pointerdown', (e) => {
  if (!labState.active || labState.mode !== 'puzzle') return;

  const rect = renderer.domElement.getBoundingClientRect();
  const ndcX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
  const ndcY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
  dragRaycaster.setFromCamera(new THREE.Vector2(ndcX, ndcY), camera);
  const partHits = dragRaycaster.intersectObjects(interactiveObjects, true);

  if (partHits.length > 0) {
    let hit = partHits[0].object;
    while (hit && !hit.userData.id && hit.parent) hit = hit.parent;
    if (hit && hit.userData.id && labState.parts[hit.userData.id]) {
      const part = labState.parts[hit.userData.id];
      selectTrayPart(part.id);
      const startX = e.clientX;
      const startY = e.clientY;
      let isDragging = false;

      const onSceneMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (!isDragging && Math.hypot(dx, dy) > 6) {
          isDragging = true;
          activeDragPart = part;
          part.object.scale.set(1, 1, 1);
          controls.enabled = false;
          showDropOverlay(true);
          try { renderer.domElement.setPointerCapture(e.pointerId); } catch(err) {}
        }
        if (isDragging && activeDragPart === part) {
          handleDragMove(ev.clientX, ev.clientY);
        }
      };

      const onSceneUp = (ev) => {
        renderer.domElement.removeEventListener('pointermove', onSceneMove);
        renderer.domElement.removeEventListener('pointerup', onSceneUp);
        renderer.domElement.removeEventListener('pointercancel', onSceneUp);
        if (isDragging) {
          _justDragged3D = true;
          setTimeout(() => { _justDragged3D = false; }, 200);
          try { renderer.domElement.releasePointerCapture(ev.pointerId); } catch(err) {}
          handleDragEnd(ev.clientX, ev.clientY);
        }
      };

      renderer.domElement.addEventListener('pointermove', onSceneMove);
      renderer.domElement.addEventListener('pointerup', onSceneUp);
      renderer.domElement.addEventListener('pointercancel', onSceneUp);
    }
  }
});

// Gắn sự kiện các nút điều khiển trong Phòng Tháo Lắp
document.getElementById('btn-assembly-lab').addEventListener('click', enterAssemblyLab);
const quickLabBtn = document.getElementById('quick-assembly-lab');
if (quickLabBtn) quickLabBtn.addEventListener('click', enterAssemblyLab);

document.getElementById('btn-lab-exit').addEventListener('click', exitAssemblyLab);

const btnLabModeExplode = document.getElementById('btn-lab-mode-explode');
if (btnLabModeExplode) {
  btnLabModeExplode.addEventListener('click', () => {
    setLabMode('explode');
  });
}

const btnLabModePuzzle = document.getElementById('btn-lab-mode-puzzle');
if (btnLabModePuzzle) {
  btnLabModePuzzle.addEventListener('click', () => {
    setLabMode('puzzle');
  });
}

const explodeSlider = document.getElementById('explode-slider');
if (explodeSlider) {
  explodeSlider.addEventListener('input', (e) => {
    setExplodeFactor(parseFloat(e.target.value) / 100);
  });
}


const btnLabZoomIn = document.getElementById('btn-lab-zoom-in');
if (btnLabZoomIn) {
  btnLabZoomIn.addEventListener('click', () => {
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
    const newDist = Math.max(controls.minDistance, dir.length() * 0.8);
    dir.setLength(newDist);
    animateCameraTo(controls.target.clone().add(dir), controls.target, 250);
  });
}

const btnLabZoomOut = document.getElementById('btn-lab-zoom-out');
if (btnLabZoomOut) {
  btnLabZoomOut.addEventListener('click', () => {
    const dir = new THREE.Vector3().subVectors(camera.position, controls.target);
    const newDist = Math.min(controls.maxDistance, dir.length() * 1.25);
    dir.setLength(newDist);
    animateCameraTo(controls.target.clone().add(dir), controls.target, 250);
  });
}

document.getElementById('btn-lab-auto-assemble').addEventListener('click', () => {
  Object.values(labState.parts).forEach(part => {
    snapPartIntoPlace(part.id);
  });
  setExplodeFactor(0.0);
});

document.getElementById('btn-lab-disassemble-all').addEventListener('click', () => {
  if (labState.mode === 'explode') {
    setExplodeFactor(1.0);
  } else {
    startPuzzleChallenge();
  }
});

// Victory Modal Events
const btnVictoryView = document.getElementById('btn-victory-view');
if (btnVictoryView) {
  btnVictoryView.addEventListener('click', () => {
    document.getElementById('assembly-victory-modal').classList.add('hidden');
    exitAssemblyLab();
  });
}

const btnVictoryReplay = document.getElementById('btn-victory-replay');
if (btnVictoryReplay) {
  btnVictoryReplay.addEventListener('click', () => {
    document.getElementById('assembly-victory-modal').classList.add('hidden');
    startPuzzleChallenge();
  });
}

// --- 18. VÒNG LẶP CHÍNH (RENDER & ANIMATION LOOP) ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  if (state.isPlaying) {
    state.time += delta * state.speed;

    // Chu kỳ nhịp tim: Co bóp cơ học sinh động (Systole / Diastole)
    const cycleFreq = 1.2 * state.speed; // ~72 nhịp/phút khi speed = 1.0
    const phase = (state.time * cycleFreq) % 1.0;

    // Tạo xung co bóp 2 thì: Tâm nhĩ co trước (0.1), Tâm thất co sau (0.3)
    let heartPulseScale = 1.0;
    if (phase < 0.2) {
      // Co tâm nhĩ
      heartPulseScale = 1.0 + Math.sin(phase * Math.PI * 5) * 0.06;
    } else if (phase >= 0.2 && phase < 0.6) {
      // Co tâm thất
      const subPhase = (phase - 0.2) / 0.4;
      heartPulseScale = 1.0 + Math.sin(subPhase * Math.PI) * 0.12;
    } else {
      // Giãn chung
      heartPulseScale = 1.0;
    }

    const isHeartAssembled = !(typeof labState !== 'undefined' && labState.active && labState.mode === 'puzzle') || (labState.parts['heart'] && labState.parts['heart'].assembled && labState.parts['heart'].isCorrect);

    if (isHeartAssembled) {
      heartGroup.scale.set(heartPulseScale, heartPulseScale * 1.02, heartPulseScale * 0.98);

      // Kích hoạt âm thanh nhịp tim mỗi chu kỳ
      const currentHeartCycle = Math.floor(state.time * cycleFreq);
      if (currentHeartCycle !== lastHeartBeat) {
        lastHeartBeat = currentHeartCycle;
        playHeartbeatSound();
      }
    } else {
      heartGroup.scale.set(1.0, 1.0, 1.0);
    }

    // Cập nhật vị trí các tế bào máu
    const heartFactor = isHeartAssembled ? Math.max(0, heartPulseScale - 1.0) * 8.0 : 0;
    bloodStreams.forEach(stream => {
      stream.update(delta, state.speed, heartFactor);
    });

    // Cập nhật vị trí mũi tên dòng chảy
    if (state.showArrows) {
      arrowTrackers.forEach(item => {
        let isVisible = true;
        if (typeof labState !== 'undefined' && labState.active && labState.mode === 'puzzle') {
          isVisible = !!(item.partId && labState.parts[item.partId] && labState.parts[item.partId].assembled && labState.parts[item.partId].isCorrect);
        }
        item.mesh.visible = isVisible;
        if (!isVisible) return;

        item.t = (item.t + delta * 0.08 * state.speed) % 1.0;
        const pos = item.curve.getPointAt(item.t);
        const tangent = item.curve.getTangentAt(item.t);

        item.mesh.position.copy(pos);
        item.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), tangent);
      });
    } else {
      arrowTrackers.forEach(item => { item.mesh.visible = false; });
    }

    // Rung nhẹ lưới mao mạch mô phỏng sự trao đổi chất
    lungCapillaries.rotation.z = Math.sin(state.time * 1.5) * 0.02;
    bodyCapillaries.rotation.z = Math.sin(state.time * 1.5 + 1) * 0.02;
  }

  // Cập nhật điều khiển góc nhìn & vị trí nhãn 2D
  controls.update();
  updateLabelsPosition();

  renderer.render(scene, camera);
}

// --- 19. RESPONSIVE RESIZE LISTENER ---
function onWindowResize() {
  const width = window.innerWidth || document.documentElement.clientWidth || 1200;
  const height = window.innerHeight || document.documentElement.clientHeight || 750;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  updateLabelsPosition();
}
window.addEventListener('resize', onWindowResize);
window.addEventListener('DOMContentLoaded', onWindowResize);
window.addEventListener('load', onWindowResize);
onWindowResize();

// Khởi chạy
initLabels();
animate();
