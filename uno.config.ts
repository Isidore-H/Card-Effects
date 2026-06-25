import { defineConfig, presetAttributify, presetIcons, presetUno, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetAttributify(), presetIcons(), presetUno()],
  transformers: [transformerDirectives()],
  shortcuts: {
    'section-shell': 'relative h-[100svh] w-screen overflow-hidden',
    'section-pad': 'p-4 sm:p-6 md:p-8',
    'section-center-dark': 'relative flex h-[100svh] w-screen items-center justify-center overflow-hidden bg-dark text-light',
    'eyebrow': 'font-mono text-[0.7rem] uppercase',
    'title-row': 'flex w-full justify-between',
    'hero-stack': 'absolute left-1/2 top-1/2 flex w-[min(86vw,24rem)] -translate-x-1/2 -translate-y-1/2 justify-center gap-3 sm:w-[min(78vw,30rem)] sm:gap-4 md:w-[min(64vw,36rem)] lg:w-[35%]',
    'hero-card': 'relative flex aspect-[5/7] flex-1 flex-col justify-between rounded-lg p-3',
    'services-shell': 'relative h-[100svh] w-screen overflow-hidden px-4 pb-4 pt-24 sm:px-6 sm:pb-6 sm:pt-28 md:px-8 md:pb-8 md:pt-32',
    'services-title-wrap': 'relative w-full translate-y-[400%] text-center [will-change:transform]',
    'cards-stage': 'fixed left-0 top-0 z-[-1] flex h-[100svh] w-screen justify-center bg-light',
    'cards-grid': 'relative flex h-full w-[min(92vw,24rem)] items-center justify-center gap-3 sm:w-[min(88vw,32rem)] sm:gap-4 md:w-[min(82vw,48rem)] md:gap-8 lg:w-[75%] lg:gap-16',
    'flip-card': 'relative aspect-[5/7] flex-1 opacity-0 [perspective:1000px]',
    'float-wrap': 'absolute left-1/2 top-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 [animation:floating_2s_infinite_ease-in-out]',
    'flip-inner': 'relative h-full w-full [transform-style:preserve-3d]',
    'flip-face-front': 'absolute h-full w-full flex flex-col items-center justify-between overflow-hidden rounded-2xl p-4 [backface-visibility:hidden]',
    'flip-face-back': 'absolute h-full w-full flex flex-col justify-between gap-8 overflow-hidden rounded-2xl bg-white p-4 [backface-visibility:hidden] [transform:rotateY(180deg)]',
    'copy-stack': 'flex h-full w-full flex-col gap-1',
    'copy-pill': 'flex flex-1 items-center justify-center rounded bg-light2 text-sm font-medium sm:text-base',
  },
  theme: {
    colors: {
      dark: '#000',
      light: '#f9f4eb',
      light2: '#f0ece5',
      'accent-1': '#e5d9f6',
      'accent-2': '#ffd2f3',
      'accent-3': '#fcdca6',
    },
    fontFamily: {
      sans: '"DM Sans", sans-serif',
      mono: '"DM Mono", monospace',
    },
  },
})