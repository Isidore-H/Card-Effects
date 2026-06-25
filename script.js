import './styles.css'
import 'uno.css'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

const initAnimations = () => {
  // 注册 GSAP ScrollTrigger 插件
  gsap.registerPlugin(ScrollTrigger)

  // Lenis 平滑滚动初始化
  // 使页面滚动更流畅，同时与 ScrollTrigger 保持同步
  const lenis = new Lenis()
  // Lenis 滚动时通知 ScrollTrigger 更新
  lenis.on('scroll', ScrollTrigger.update)
  // 将 Lenis 的更新循环绑定到 GSAP 的 ticker 上
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000)
  })
  // 关闭 GSAP 的滞后平滑，避免与 Lenis 冲突
  gsap.ticker.lagSmoothing(0)

  // 平滑插值函数（smoothstep）
  // 将线性 progress 映射为缓入缓出曲线，使动画更自然
  const smoothStep = (p) => p * p * (3 - 2 * p)

  // ScrollTrigger 1：Hero 卡片散开动画
  // 滚动 Hero 区域时，三张卡片逐渐淡出并向不同方向散开
  ScrollTrigger.create({
    trigger: '.hero',           // 触发元素
    start: 'top top',           // Hero 顶部到达视口顶部时开始
    end: '75% top',             // Hero 顶部在视口上方 75% 时结束
    scrub: 1,                   // 滚动与动画一一对应（1 秒惯性）
    onUpdate: (self) => {
      const progress = self.progress  // 0 → 1

      // Hero 卡片容器整体淡出（透明度 1 → 0.5）
      const heroCardsContainerOpacity = gsap.utils.interpolate(1, 0.5, smoothStep(progress))
      gsap.set('.hero-cards', {
        opacity: heroCardsContainerOpacity
      })

      // 逐张卡片处理（卡片 1/2/3）
      ;['#hero-card-1', '#hero-card-2', '#hero-card-3'].forEach((cardId, index) => {
        // 每张卡片依次延迟开始运动
        const delay = index * 0.9
        const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (1 - delay * 0.1))

        // 所有卡片向下移动
        const y = gsap.utils.interpolate('0%', '250%', smoothStep(cardProgress))
        // 所有卡片缩小
        const scale = gsap.utils.interpolate(1, 0.75, smoothStep(cardProgress))

        let x = '0%'
        let rotation = 0
        // 卡片 1 向右散开并左旋，卡片 3 向左散开并右旋
        if (index === 0) {
          x = gsap.utils.interpolate('0%', '90%', smoothStep(cardProgress))
          rotation = gsap.utils.interpolate(0, -15, smoothStep(cardProgress))
        } else if (index === 2) {
          x = gsap.utils.interpolate('0%', '-90%', smoothStep(cardProgress))
          rotation = gsap.utils.interpolate(0, 15, smoothStep(cardProgress))
        }

        // 应用变换
        gsap.set(cardId, {
          y: y,
          x: x,
          rotation: rotation,
          scale: scale,
        })
      })
    }
  })

  // ScrollTrigger 2：固定 Services 区域
  // 当滚动到 Services 时将其固定，撑起 4 屏高度的滚动空间
  ScrollTrigger.create({
    trigger: '.services',
    start: 'top top',
    end: `+=${window.innerHeight * 4}px`,  // 持续 4 屏高度
    pin: '.services',          // 固定 services 区域
    pinSpacing: true           // 自动补充间距防止跳动
  })

  // ScrollTrigger 3：卡片容器定位切换
  // 固定阶段结束时，将 .cards 从 fixed 改为 absolute 跟随滚动
  // 回滚时恢复 fixed
  ScrollTrigger.create({
    trigger: '.services',
    start: 'top top',
    end: `+=${window.innerHeight * 4}px`,
    onLeave: () => {
      // 固定结束时：计算 services 当前在文档流中的位置
      const servicesSection = document.querySelector('.services')
      const servicesRect = servicesSection.getBoundingClientRect()
      const servicesTop = window.pageYOffset + servicesRect.top

      // 将 .cards 改为 absolute，定位在 services 底部
      gsap.set('.cards', {
        position: 'absolute',
        top: servicesTop,
        left: 0,
        width: '100vw',
        height: '100vh',
      })
    },
    onEnterBack: () => {
      // 回滚时：恢复 fixed 定位覆盖全屏
      gsap.set('.cards', {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
      })
    }
  })

  // ScrollTrigger 4：翻转卡片入场 + 3D 翻转动画
  // 在 Services 固定期间，三张卡片从散开状态聚拢并完成翻转
  ScrollTrigger.create({
    trigger: '.services',
    start: 'top bottom',       // Services 底部到达视口顶部时开始
    end: `+=${window.innerHeight * 4}px`,
    scrub: 1,
    onUpdate: (self) => {
      const progress = self.progress  // 0 → 1

      // ===== Services 标题动画 =====
      // 标题从下方 400% 位置滑入到正常位置
      const headerProgress = gsap.utils.clamp(0, 1, progress / 0.9)
      const headerY = gsap.utils.interpolate('400%', '0%', smoothStep(headerProgress))
      gsap.set('.services-header', {
        y: headerY,
      })

      // ===== 三张翻转卡片动画 =====
      ;['#card-1', '#card-2', '#card-3'].forEach((cardId, index) => {
        // 每张卡片依次延迟（错开入场时间）
        const delay = index * 0.5
        const cardProgress = gsap.utils.clamp(0, 1, (progress - delay * 0.1) / (0.9 - delay * 0.1))

        const innerCard = document.querySelector(`${cardId} .flip-card-inner`)

        // ---- Y 轴位置动画（三段式） ----
        // [0→0.4] 从上方 -100% 下落到 50%
        // [0.4→0.6] 从 50% 弹回到 0%
        // [0.6→1]   保持在 0%
        let y
        if (cardProgress < 0.4) {
          const normalizedProgress = cardProgress / 0.4
          y = gsap.utils.interpolate('-100%', '50%', smoothStep(normalizedProgress))
        } else if (cardProgress < 0.6) {
          const normalizedProgress = (cardProgress - 0.4) / 0.2
          y = gsap.utils.interpolate('50%', '0%', smoothStep(normalizedProgress))
        } else {
          y = '0%'
        }

        // ---- 缩放动画（三段式） ----
        // [0→0.4] 从 0.25 放大到 0.75
        // [0.4→0.6] 从 0.75 放大到 1
        // [0.6→1]   保持 1
        let scale
        if (cardProgress < 0.4) {
          const normalizedProgress = cardProgress / 0.4
          scale = gsap.utils.interpolate(0.25, 0.75, smoothStep(normalizedProgress))
        } else if (cardProgress < 0.6) {
          const normalizedProgress = (cardProgress - 0.4) / 0.2
          scale = gsap.utils.interpolate(0.75, 1, smoothStep(normalizedProgress))
        } else {
          scale = 1
        }

        // ---- 透明度动画 ----
        // [0→0.2] 从 0 淡入到 1
        let opacity
        if (cardProgress < 0.2) {
          const normalizedProgress = cardProgress / 0.2
          opacity = smoothStep(normalizedProgress)
        } else {
          opacity = 1
        }

        // ---- X 轴位置 & 旋转 & 3D 翻转（两段式） ----
        // [0→0.5] 保持初始散开状态（各自偏左/中/右，带小角度旋转，无翻转）
        // [0.6→1] 向中间聚拢（x→0%, rotate→0°），同时 rotationY 从 0→180° 翻转
        let x, rotate, rotationY
        if (cardProgress < 0.5) {
          // 保持初始位置
          x = index === 0 ? '100%' : index === 1 ? '0%' : '-100%'
          rotate = index === 0 ? -5 : index === 1 ? 0 : 5
          rotationY = 0
        } else if (cardProgress < 1) {
          // 从 0.6 开始过渡（0.5-0.6 之间保持不动，0.6 开始变化）
          const normalizedProgress = (cardProgress - 0.6) / 0.4
          x = gsap.utils.interpolate(index === 0 ? '100%' : index === 1 ? '0%' : '-100%', '0%', smoothStep(normalizedProgress))
          rotate = gsap.utils.interpolate(index === 0 ? -5 : index === 1 ? 0 : 5, 0, smoothStep(normalizedProgress))
          // 3D 翻转角度 0→180°
          rotationY = smoothStep(normalizedProgress) * 180
        } else {
          // 最终状态：居中、无旋转、完全翻转
          x = '0%'
          rotate = 0
          rotationY = 180
        }

        // 应用卡片整体变换（位置、缩放、旋转、透明度）
        gsap.set(cardId, {
          opacity: opacity,
          y: y,
          x: x,
          rotate: rotate,
          scale: scale,
        })

        // 应用卡片内层的 3D 翻转（rotationY 驱动正反面切换）
        gsap.set(innerCard, {
          rotationY: rotationY,
        })
      })
    }
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initAnimations, { once: true })
} else {
  initAnimations()
}