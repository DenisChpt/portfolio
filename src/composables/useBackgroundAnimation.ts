import { ref } from 'vue'

/**
 * Pauses the animated canvas background while set.
 * Full-screen overlays with backdrop-filter (e.g. the project modal) must re-blur
 * whatever sits behind them on every frame the canvas changes, so freezing the
 * canvas while they are open keeps them cheap.
 */
export const isBackgroundPaused = ref(false)
