export const duration = {
  fast:   0.15,
  base:   0.2,
  slow:   0.3,
  slower: 0.4,
} as const

export const ease = {
  enter: [0.22, 1, 0.36, 1] as [number, number, number, number],
  exit:  [0.4, 0, 1, 1]     as [number, number, number, number],
  inOut: [0.4, 0, 0.2, 1]   as [number, number, number, number],
} as const

export const spring = {
  default: { type: 'spring' as const, stiffness: 300, damping: 30 },
  gentle:  { type: 'spring' as const, stiffness: 200, damping: 25 },
  bouncy:  { type: 'spring' as const, stiffness: 400, damping: 20 },
  snappy:  { type: 'spring' as const, stiffness: 500, damping: 35 },
} as const

export const variants = {
  fadeUp: {
    hidden:  { opacity: 0, y: 8 },
    visible: { opacity: 1, y: 0,  transition: { duration: duration.base, ease: ease.enter } },
    exit:    { opacity: 0, y: 4,  transition: { duration: duration.fast, ease: ease.exit  } },
  },
  fadeIn: {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { duration: duration.base, ease: ease.enter } },
    exit:    { opacity: 0, transition: { duration: duration.fast, ease: ease.exit  } },
  },
  scaleIn: {
    hidden:  { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1,    transition: { duration: duration.base, ease: ease.enter } },
    exit:    { opacity: 0, scale: 0.95, transition: { duration: duration.fast, ease: ease.exit  } },
  },
  slideInFromBottom: {
    hidden:  { opacity: 0, y: '100%' },
    visible: { opacity: 1, y: 0,      transition: { duration: duration.slow, ease: ease.enter } },
    exit:    { opacity: 0, y: '100%', transition: { duration: duration.base, ease: ease.exit  } },
  },
  slideInFromRight: {
    hidden:  { opacity: 0, x: '100%' },
    visible: { opacity: 1, x: 0,      transition: { duration: duration.slow, ease: ease.enter } },
    exit:    { opacity: 0, x: '100%', transition: { duration: duration.base, ease: ease.exit  } },
  },
  staggerContainer: {
    hidden:  {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.1 } },
  },
  staggerItem: {
    hidden:  { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: duration.slow, ease: ease.enter } },
  },
  errorMessage: {
    hidden:  { opacity: 0, y: -4, height: 0 },
    visible: { opacity: 1, y: 0,  height: 'auto', transition: { duration: duration.base, ease: ease.enter } },
    exit:    { opacity: 0, y: -4, height: 0,      transition: { duration: duration.fast, ease: ease.exit  } },
  },
} as const
