/**
 * Hero3D.jsx
 * ------------------------------------------------------------
 * 这个文件做了什么？
 * ✅ 一个可点击交互的 3D Hero 区域（R3F + Rapier 物理）
 * ✅ 30 个 “三向圆柱贯穿 + 中心圆角块” 的工业积木在空间漂浮
 * ✅ 鼠标有一个“碰撞体”可以推动物体
 * ✅ 点击时：切换配色 + 施加冲击波让附近物体飞散 & 旋转
 * ✅ 电影级自适应相机：根据屏幕宽度自动推近/拉远 + 调整 FOV
 * ✅ 背景：保持原本深色背景，同时叠加一个「中间圆形光晕」(Shader平面)
 */

import React, {
  Suspense,
  useRef,
  useState,
  useMemo,
  useCallback,
  useEffect,
} from "react";

import { Canvas, useFrame, useThree } from "@react-three/fiber";

import {
  Environment,
  Lightformer,
  PerspectiveCamera,
  ContactShadows,
  RoundedBox,
} from "@react-three/drei";

import {
  EffectComposer,
  N8AO,
  ToneMapping,
} from "@react-three/postprocessing";

import {
  Physics,
  RigidBody,
  BallCollider,
  CuboidCollider,
} from "@react-three/rapier";

import * as THREE from "three";
import "./Hero3D.css";

/**
 * ------------------------------
 * 1) 全局主题色：用于“有色物体”
 * ------------------------------
 * 你点击会切换 colorIndex
 * 物体的颜色会从这里循环取值
 */
const COLOR_CYCLE = [
  "#1F3FBF", // 深工业蓝（偏注塑件）
  "#8FBF00", // 工业草绿（偏荧光但压亮度）
  "#C4161C", // 工业红（工程红，不糖果）
  "#6A2DBF", // 深工业紫
  "#C9A400", // 工业黄（工程警示黄/偏屎黄）
];

/**
 * ------------------------------
 * 2) 背景深色：用于“整体暗基底”
 * ------------------------------
 * 你点击会切换 colorIndex
 * 背景深色也会跟着切换（偏对应色调）
 */
const BG_CYCLE = ["#0D1120", "#0E1A14", "#1A0E0E", "#14101F", "#1A160E"];

/**
 * ------------------------------
 * 3) 光源强调色：用于部分灯（Lightformer）染色
 * ------------------------------
 * 用来给某些灯/高光一个轻微色相倾向
 */
const ACCENT_CYCLE = ["#EEF2FF", "#EAF7F0", "#FFEAE5", "#F0EBFF", "#FAF4DF"];

/**
 * ============================================================
 * AdaptiveCamera
 * ------------------------------------------------------------
 * 电影级自适应推拉摄像机
 * 逻辑：
 * - 屏幕越宽：相机 z 越小（更靠近物体），FOV 越小（更“聚焦”）
 * - 屏幕越窄：相机 z 越大（离远一点），FOV 越大（更“广角”）
 * - 使用 lerp 做平滑过渡：防止窗口缩放时抖动
 * ============================================================
 */
const AdaptiveCamera = () => {
  // useThree() 能拿到当前 R3F 场景的一些状态：size、viewport、camera等
  const { size } = useThree();
  const cameraRef = useRef();

  // useFrame: 每一帧渲染都会执行（大约 60fps）
  useFrame(() => {
    if (!cameraRef.current) return;

    // 1) 当前屏幕宽度（像素）
    const width = size.width;

    // 2) 计算目标 Z（镜头距离）
    // 公式：z = 30 - width/150
    // 再 clamp 限制在 [4, 16]，避免太近/太远
    let targetZ = 30 - width / 150;
    targetZ = THREE.MathUtils.clamp(targetZ, 4, 16);

    // 3) 计算目标 FOV（视野角度）
    // 公式：fov = 55 - width/100
    // clamp 在 [12, 60]
    let targetFOV = 55 - width / 100;
    targetFOV = THREE.MathUtils.clamp(targetFOV, 12, 60);

    // 4) 平滑插值：让相机慢慢靠近目标值
    cameraRef.current.position.z = THREE.MathUtils.lerp(
      cameraRef.current.position.z,
      targetZ,
      0.1
    );

    cameraRef.current.fov = THREE.MathUtils.lerp(
      cameraRef.current.fov,
      targetFOV,
      0.1
    );

    // 5) 修改 FOV 后必须更新投影矩阵，否则不会生效
    cameraRef.current.updateProjectionMatrix();
  });

  return (
    /**
     * PerspectiveCamera（透视相机）
     * - makeDefault：把它设为场景默认相机（替代 Canvas 默认相机）
     * - position={[0,0,20]}：只是初始值，会很快被上面的逻辑 lerp 到 targetZ
     */
    <PerspectiveCamera ref={cameraRef} makeDefault position={[0, 0, 20]} />
  );
};

/**
 * ============================================================
 * IndustrialCylinder
 * ------------------------------------------------------------
 * 用 ExtrudeGeometry “挤出”一根中空圆柱
 * 逻辑：
 * 1) 画一个圆形截面（Shape）
 * 2) 再在里面挖一个圆孔（holePath）
 * 3) ExtrudeGeometry 沿 z 方向挤出 length 得到“管子”
 * 4) bevel = 圆角倒角（更像工业加工件）
 * 5) useMemo([]) 只生成一次几何，避免每次 render 重建导致卡顿
 * ============================================================
 */
const IndustrialCylinder = () => {
  return useMemo(() => {
    const radius = 0.5; // 外半径
    const length = 2.5; // 挤出长度
    const holeRadius = 0.2; // 内孔半径

    // 1) 外轮廓（圆）
    const shape = new THREE.Shape();
    shape.absarc(0, 0, radius, 0, Math.PI * 2, false);

    // 2) 内孔（圆孔）
    const holePath = new THREE.Path();
    holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, true);
    shape.holes.push(holePath);

    // 3) 挤出变成“中空圆柱”
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: length,
      bevelEnabled: true,
      bevelThickness: 0.12, // 倒角厚度（越大越肉）
      bevelSize: 0.02, // 倒角大小
      bevelSegments: 20, // 倒角分段（越大越圆滑）
      curveSegments: 64, // 圆弧分段（越大越圆）
    });

    // 4) 把几何中心移到 (0,0,0)，便于旋转/对齐
    geo.center();

    return geo;
  }, []);
};

/**
 * ============================================================
 * LusionObject
 * ------------------------------------------------------------
 * 单个“十字积木”物体（带物理）
 * 结构：
 * - 3 根中空圆柱：分别沿 X/Y/Z 方向
 * - 中心用 RoundedBox 做圆角块（看起来像圆角布尔连接）
 *
 * 物理：
 * - 用 Rapier 的 RigidBody（动态刚体）
 * - 每帧施加向心力（把它拉回中心）+ 微漂浮（像在水里呼吸）
 * - 用 BallCollider 做近似球形碰撞（性能友好）
 * ============================================================
 */
const LusionObject = ({
  id,
  colorIndex,
  isColored,
  materialType,
  onRegistered,
  scaleFactor = 1,
  ...props
}) => {
  // 刚体引用：用于 applyImpulse 等
  const rigidBody = useRef();

  // 三根圆柱共享同一个几何（节省内存）
  const cylinderGeo = IndustrialCylinder();

  /**
   * 物体注册：把每个刚体引用存到 Hero3D 的 rbMap
   * 这样点击时就能遍历所有刚体，做冲击波
   */
  useEffect(() => {
    if (rigidBody.current && onRegistered) {
      onRegistered(id, rigidBody.current); // 注册
      return () => onRegistered(id, null); // 卸载时清除
    }
  }, [id, onRegistered]);

  /**
   * 材质参数：不同 materialType 不同手感
   * 0：黑（偏磨砂胶/低反）
   * 1：彩色（偏注塑/清漆）
   * 2：灰白（偏塑料白/略反光）
   *
   * ⚠️ 注意：这里返回对象里包含 color 的只有 0、2
   * materialType=1 不包含 color，因为会用 currentColor 覆盖
   */
  const materialProps = useMemo(() => {
    switch (materialType) {
      case 0:
        return {
          color: "#0B0B0B",
          metalness: 0.0,
          roughness: 0.32,
          clearcoat: 0.45,
          clearcoatRoughness: 0.22,
          envMapIntensity: 0.85,
        };
      case 1:
        return {
          metalness: 0.0,
          roughness: 0.26,
          clearcoat: 0.6,
          clearcoatRoughness: 0.18,
          envMapIntensity: 0.95,
        };
      case 2:
        return {
          color: "#D8D8D8",
          metalness: 0.0,
          roughness: 0.3,
          clearcoat: 0.55,
          clearcoatRoughness: 0.2,
          envMapIntensity: 0.9,
        };
      default:
        return {};
    }
  }, [materialType]);

  // 如果是“有色物体”，颜色来自 COLOR_CYCLE；否则用材质自带的 color（黑/灰）
  const currentColor = isColored ? COLOR_CYCLE[colorIndex] : materialProps.color;

  /**
   * 每帧给物体一个“回中心的力 + 漂浮扰动”
   * 这样它们会形成一个“群落”而不是飞散到无限远
   */
  useFrame((state) => {
    if (!rigidBody.current) return;

    try {
      // 1) 向心力：把位置向量取反 -> 指向原点
      const pos = rigidBody.current.translation();
      const vec = new THREE.Vector3(pos.x, pos.y, pos.z);
      rigidBody.current.applyImpulse(vec.negate().multiplyScalar(0.45), true);

      // 2) 漂浮扰动：用 sin/cos 生成细微的“呼吸式漂移”
      const time = state.clock.getElapsedTime();
      const drift = new THREE.Vector3(
        Math.sin(time * 0.4 + props.position[0]) * 0.2,
        Math.cos(time * 0.4 + props.position[1]) * 0.2,
        0
      );

      rigidBody.current.applyImpulse(drift, true);
    } catch (e) {
      // 容错：避免某些帧刚体状态异常导致崩溃
    }
  });

  return (
    <RigidBody
      ref={rigidBody}
      colliders={false} // 我们手动加 collider
      mass={6} // 质量更大 -> 更“沉”
      linearDamping={5.5} // 线性阻尼 -> 移动更粘稠
      angularDamping={3.5} // 旋转阻尼 -> 不会狂转
      restitution={0.1} // 弹性低 -> 不会弹飞
      {...props} // position/rotation 等来自 objects 数组
    >
      {/* group 只是视觉缩放，不影响物理体（物理体由 collider 决定） */}
      <group scale={scaleFactor}>
        {/* Z 方向圆柱 */}
        <mesh geometry={cylinderGeo}>
          <meshPhysicalMaterial color={currentColor} {...materialProps} />
        </mesh>

        {/* X 方向圆柱：绕 X 轴旋转 90° */}
        <mesh geometry={cylinderGeo} rotation={[Math.PI / 2, 0, 0]}>
          <meshPhysicalMaterial color={currentColor} {...materialProps} />
        </mesh>

        {/* Y 方向圆柱：绕 Y 轴旋转 90° */}
        <mesh geometry={cylinderGeo} rotation={[0, Math.PI / 2, 0]}>
          <meshPhysicalMaterial color={currentColor} {...materialProps} />
        </mesh>

        {/* 中心圆角块：让交叉处看起来更像“圆角布尔连接” */}
        <RoundedBox args={[0.98, 0.98, 0.98]} radius={0.3} smoothness={10}>
          <meshPhysicalMaterial color={currentColor} {...materialProps} />
        </RoundedBox>
      </group>

      {/* 碰撞体：用一个球近似，避免复杂网格碰撞造成性能问题 */}
      <BallCollider args={[2 * (scaleFactor / 1.15)]} />
    </RigidBody>
  );
};

/**
 * ============================================================
 * BackgroundHalo
 * ------------------------------------------------------------
 * 目标：做一个“中间有圆形光晕”的背景
 *
 * 实现方法：
 * - 放一个覆盖全屏的 plane（平面）
 * - 使用 ShaderMaterial 在片元里做径向渐变：
 *   中心更亮（主题色），越往外越接近背景深色
 *
 * 关键点：
 * - position z = -18：放在物体后面
 * - depthWrite=false, depthTest=false：永远画在最底层，不参与深度
 * - renderOrder=-10：强制先渲染它（更稳定）
 * ============================================================
 */
const BackgroundHalo = ({ colorIndex }) => {
  const meshRef = useRef();
  const materialRef = useRef();
  const { viewport } = useThree();

  // 当前主题色 & 当前背景色，转成 THREE.Color 便于传 shader uniform
  const haloColor = useMemo(
    () => new THREE.Color(COLOR_CYCLE[colorIndex]),
    [colorIndex]
  );
  const bgColor = useMemo(
    () => new THREE.Color(BG_CYCLE[colorIndex]),
    [colorIndex]
  );

  /**
   * Shader uniforms 解释：
   * uHalo：光晕颜色（中心偏亮）
   * uBg：背景颜色（外圈偏暗）
   * uStrength：光晕强度（越大越像“滤镜覆盖”）
   * uRadius：光晕半径（越大越扩散）
   */
  const shader = useMemo(() => {
    return {
      uniforms: {
        uHalo: { value: haloColor },
        uBg: { value: bgColor },
        uStrength: { value: 0.04 }, // 建议 0.06~0.18 微调
        uRadius: { value: 0.9 }, // 建议 0.55~0.9 微调
      },

      // 顶点着色器：把 uv 传给片元即可（plane 自带 uv）
      vertexShader: `
        varying vec2 vUv;
        void main(){
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
      `,

      // 片元着色器：做径向渐变
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uHalo;
        uniform vec3 uBg;
        uniform float uStrength;
        uniform float uRadius;

        void main(){
          // uv 中心是 (0.5,0.5)
          vec2 p = vUv - vec2(0.5);
          float d = length(p);

          // smoothstep：d越小（越接近中心），halo越接近1
          float halo = smoothstep(uRadius, 0.0, d);

          // 让过渡更柔（平方）
          halo = halo * halo;

          // 用 halo 强度混合背景和光晕色
          vec3 col = mix(uBg, uHalo, halo * uStrength);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    };
  }, [haloColor, bgColor]);

  // 当 colorIndex 切换时，同步更新 shader uniforms
  useEffect(() => {
    if (!materialRef.current) return;
    materialRef.current.uniforms.uHalo.value = haloColor;
    materialRef.current.uniforms.uBg.value = bgColor;
  }, [haloColor, bgColor]);

  return (
    <mesh
      ref={meshRef}
      // 放在物体后面（负 z），看起来像“背后透出来的光”
      position={[0, 0, -18]}
      renderOrder={-10}
    >
      {/* plane 覆盖屏幕：viewport 是 “世界单位的可视宽高” */}
      <planeGeometry
        args={[viewport.width * 2.2, viewport.height * 2.2, 1, 1]}
      />

      {/* depthWrite/depthTest 关掉：保证它永远当背景 */}
      <shaderMaterial
        ref={materialRef}
        args={[shader]}
        depthWrite={false}
        depthTest={false}
      />
    </mesh>
  );
};

/**
 * ============================================================
 * MouseCollider
 * ------------------------------------------------------------
 * 用一个“跟随鼠标移动的刚体”作为推子
 * - type="kinematicPosition"：由我们手动控制位置（不受力）
 * - CuboidCollider Z 轴拉长：让它能影响深度范围内的物体
 * ============================================================
 */
const MouseCollider = ({ onUpdatePos }) => {
  const { viewport, mouse } = useThree();
  const ref = useRef();

  useFrame(() => {
    if (!ref.current) return;

    // mouse.x / mouse.y 是 -1~1
    // viewport.width/height 是世界单位
    const x = (mouse.x * viewport.width) / 2;
    const y = (mouse.y * viewport.height) / 2;

    // 鼠标碰撞体在 z=0 平面移动
    ref.current.setNextKinematicTranslation({ x, y, z: 0 });

    // 把鼠标世界坐标回传给父组件（点击冲击波用）
    onUpdatePos(new THREE.Vector3(x, y, 0));
  });

  return (
    <RigidBody ref={ref} type="kinematicPosition" colliders={false} mass={5}>
      {/* 长方体碰撞：x/y 小，z 很长 -> 像一根“推杆” */}
      <CuboidCollider args={[0.3, 0.3, 10]} />
    </RigidBody>
  );
};

/**
 * ============================================================
 * Hero3D (主组件)
 * ------------------------------------------------------------
 * - 管理 colorIndex（点击切换）
 * - 管理 rbMap（收集所有刚体引用）
 * - 管理 mousePosRef（鼠标世界坐标）
 * - 点击：对周围物体施加冲击波 + 扭矩
 * ============================================================
 */
const Hero3D = () => {
  // 当前主题色索引：点击时 +1 循环
  const [colorIndex, setColorIndex] = useState(0);
  const clickSoundRef = useRef(null);
  const bubbleSoundRef = useRef(null);
  const bubble2SoundRef = useRef(null);
  const bubbleToggleRef = useRef(false);

  // 保存所有刚体引用：Map<id, rigidBody>
  const rbMap = useRef(new Map());

  // 鼠标世界坐标（由 MouseCollider 持续更新）
  const mousePosRef = useRef(new THREE.Vector3());

  useEffect(() => {
    const color = COLOR_CYCLE[colorIndex];
    window.dispatchEvent(new CustomEvent("hero3d-color", { detail: color }));
  }, [colorIndex]);

  useEffect(() => {
    clickSoundRef.current = new Audio("/bricks.mp3");
    clickSoundRef.current.volume = 0.03;
    clickSoundRef.current.preload = "auto";
    bubbleSoundRef.current = new Audio("/bubble.mp3");
    bubbleSoundRef.current.volume = 0.1;
    bubbleSoundRef.current.preload = "auto";
    bubble2SoundRef.current = new Audio("/bubble2.mp3");
    bubble2SoundRef.current.volume = 0.1;
    bubble2SoundRef.current.preload = "auto";

    return () => {
      if (clickSoundRef.current) {
        clickSoundRef.current.pause();
        clickSoundRef.current = null;
      }
      if (bubbleSoundRef.current) {
        bubbleSoundRef.current.pause();
        bubbleSoundRef.current = null;
      }
      if (bubble2SoundRef.current) {
        bubble2SoundRef.current.pause();
        bubble2SoundRef.current = null;
      }
    };
  }, []);

  /**
   * 注册刚体：子组件 LusionObject mount 时注册，unmount 时删除
   */
  const registerRb = useCallback((id, rb) => {
    if (rb) rbMap.current.set(id, rb);
    else rbMap.current.delete(id);
  }, []);

  /**
   * 初始化 30 个物体
   * - position：随机散布在一个盒子内
   * - rotation：随机
   * - isColored：前 18 个有色
   * - materialType：
   *   前 18 -> 彩色材质 1
   *   18~23 -> 黑色材质 0
   *   24~29 -> 灰白材质 2
   *
   * useMemo([]) 确保只生成一次，避免每次 render 都重新随机（画面会跳）
   */
  const objects = useMemo(
    () =>
      Array.from({ length: 34 }).map((_, i) => ({
        id: `obj-${i}`,
        position: [
          (Math.random() - 0.5) * 18,
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 6,
        ],
        rotation: [
          Math.random() * Math.PI,
          Math.random() * Math.PI,
          Math.random() * Math.PI,
        ],
        isColored: i < 20,
        materialType: i < 20 ? 1 : i < 28 ? 0 : 2,
      })),
    []
  );

  /**
   * 点击交互：
   * 1) 切换主题色 index
   * 2) 以鼠标位置为冲击中心，给附近刚体施加：
   *    - 平移冲击（applyImpulse）
   *    - 旋转冲击（applyTorqueImpulse）
   */
  const handleInteraction = () => {
    if (!window.soundEnabled) {
      window.soundEnabled = true;
      if (!window.bgmAudio) {
        window.bgmAudio = new Audio('/bgm.mp3');
        window.bgmAudio.loop = true;
        window.bgmAudio.volume = 0.8;
      }
      window.bgmAudio.play().catch(() => {});
      window.dispatchEvent(new Event("sound-enable"));
    }

    if (window.soundEnabled) {
      if (clickSoundRef.current) {
        clickSoundRef.current.currentTime = 0;
        clickSoundRef.current.play().catch(() => {});
      }
      const bubbleRef = bubbleToggleRef.current ? bubble2SoundRef.current : bubbleSoundRef.current;
      if (bubbleRef) {
        bubbleRef.currentTime = 0;
        bubbleRef.play().catch(() => {});
      }
      bubbleToggleRef.current = !bubbleToggleRef.current;
    }

    // 切换主题色（会影响：彩色物体 + 背景光晕 + 背景深色）
    setColorIndex((prev) => (prev + 1) % COLOR_CYCLE.length);

    // 冲击中心：鼠标世界坐标
    const impactPoint = mousePosRef.current;

    rbMap.current.forEach((rb) => {
      if (!rb) return;

      try {
        const rbPos = rb.translation();

        // 从冲击中心指向刚体的方向向量
        const dir = new THREE.Vector3(
          rbPos.x - impactPoint.x,
          rbPos.y - impactPoint.y,
          rbPos.z - impactPoint.z
        );

        const dist = dir.length();

        // 只影响一定范围内的物体
        if (dist < 18) {
          // 距离越近力度越大
          const strength = (1 - dist / 18) * 150;

          // A) 平移冲击
          rb.applyImpulse(dir.normalize().multiplyScalar(strength), true);

          // B) 扭矩冲击：随机方向让它疯狂打转
          const torqueStrength = strength * 8;
          rb.applyTorqueImpulse(
            new THREE.Vector3(
              (Math.random() - 0.5) * torqueStrength,
              (Math.random() - 0.5) * torqueStrength,
              (Math.random() - 0.5) * torqueStrength
            ),
            true
          );
        }
      } catch (e) {
        // 容错
      }
    });
  };

  const SceneContent = () => {
    const { size } = useThree();
    const objectScale = useMemo(() => {
      if (size.width <= 640) return 0.85;
      if (size.width <= 1024) return 0.95;
      return 1.15;
    }, [size.width]);

    return (
      <>
        {/* 纯色背景底（深色基底）。光晕会叠加在上面 */}
        <color attach="background" args={[BG_CYCLE[colorIndex]]} />

        {/* 自适应相机：根据屏幕宽度自动推拉 */}
        <AdaptiveCamera />

        {/* 背景光晕：中间一个带主题色的圆形渐变 */}
        <BackgroundHalo colorIndex={colorIndex} />

        {/* 环境光：苹果风格更克制 */}
        <ambientLight intensity={0.65} />

        {/* 环境反射与布光：Lightformer 类似摄影棚软箱 */}
        <Environment resolution={256}>
          {/* 顶部主软箱：提供高光条 */}
          <Lightformer
            form="rect"
            intensity={14}
            position={[0, 15, 7]}
            scale={[22, 2.5, 1]}
            onUpdate={(s) => s.lookAt(0, 0, 0)}
          />

          {/* 侧面补光：让轮廓更立体 */}
          <Lightformer
            form="rect"
            intensity={5}
            position={[-14, 5, 10]}
            scale={[10, 10, 1]}
            onUpdate={(s) => s.lookAt(0, 0, 0)}
          />

          {/* 带色倾向的圆形光：用 ACCENT_CYCLE 轻微染色 */}
          <Lightformer
            form="circle"
            intensity={7}
            position={[14, 3, -10]}
            scale={[15, 15, 1]}
            color={ACCENT_CYCLE[colorIndex]}
          />
          <Lightformer
            form="rect"
            intensity={3.5}
            position={[0, -12, 5]}
            scale={[16, 5, 1]}
            onUpdate={(s) => s.lookAt(0, 0, 0)}
          />
        </Environment>

        {/* Suspense：未来如果你加载模型/贴图会用到；现在 fallback=null */}
        <Suspense fallback={null}>
          {/* Physics：Rapier 物理世界。重力=0 => 漂浮感 */}
          <Physics gravity={[0, 0, 0]}>
            {/* 批量生成物体 */}
            {objects.map((obj) => (
              <LusionObject
                key={obj.id}
                {...obj}
                colorIndex={colorIndex}
                onRegistered={registerRb}
                scaleFactor={objectScale}
              />
            ))}

            {/* 鼠标碰撞体：推动物体 + 给点击冲击波提供鼠标世界坐标 */}
            <MouseCollider onUpdatePos={(v) => (mousePosRef.current = v)} />
          </Physics>
        </Suspense>

        {/* 后期处理：AO + ToneMapping（让画面更“电影感”） */}
        <EffectComposer disableNormalPass>
          {/* N8AO：屏幕空间环境遮蔽，让缝隙更有深度 */}
          {/* <N8AO intensity={4.0} radius={1.2} distanceFalloff={0.5} /> */}

          {/* ToneMapping：色调映射。AgX 更像影视/摄影风格 */}
          <ToneMapping mode={THREE.AgXToneMapping} />
        </EffectComposer>

        {/* 接触阴影：物体与“地面”接触的软阴影，增强空间感 */}
        <ContactShadows
          position={[0, -10, 0]}
          opacity={0.45}
          scale={50}
          blur={2.2}
          far={12}
          color="#000000"
        />
      </>
    );
  };

  return (
    <section className="hero-3d-section">
      <div className="hero-3d-box">
        {/* Canvas：R3F 的渲染容器。onPointerDown 用来接收点击事件 */}
        <Canvas
          dpr={1}
          gl={{ antialias: false, powerPreference: "high-performance" }}
          onPointerDown={handleInteraction}
        >
          <SceneContent />
        </Canvas>
      </div>
    </section>
  );
};

export default Hero3D;
