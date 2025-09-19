import { onMounted, Ref } from 'vue'
import { gsap } from 'gsap'

/**
 * Hook for standard page entrance animation
 * @param selector - CSS selector of the element to animate
 * @param delay - Animation delay in seconds
 */
export function usePageAnimation(selector: string, delay = 0.2) {
	onMounted(() => {
		gsap.from(selector, {
			y: 50,
			opacity: 0,
			duration: 1,
			ease: 'expo.out',
			delay,
		})
	})
}

/**
 * Hook for staggered animation of multiple elements
 * @param selector - CSS selector of the elements to animate
 * @param options - Animation options
 */
export function useStaggeredAnimation(
	selector: string,
	options: {
		delay?: number
		duration?: number
		stagger?: number
		y?: number
		ease?: string
	} = {}
) {
	const { delay = 0.6, duration = 0.8, stagger = 0.1, y = 30, ease = 'power3.out' } = options

	onMounted(() => {
		gsap.from(selector, {
			y,
			opacity: 0,
			duration,
			stagger,
			delay,
			ease,
		})
	})
}

/**
 * Hook for animating an element on hover
 * @param targetRef - Ref of the element to animate
 * @param scaleAmount - Amount to scale the element
 */
export function useHoverAnimation(targetRef: Ref<HTMLElement | null>, scaleAmount = 1.05) {
	const handleMouseEnter = () => {
		gsap.to(targetRef.value, {
			scale: scaleAmount,
			duration: 0.3,
			ease: 'power2.out',
		})
	}

	const handleMouseLeave = () => {
		gsap.to(targetRef.value, {
			scale: 1,
			duration: 0.3,
			ease: 'power2.out',
		})
	}

	return {
		handleMouseEnter,
		handleMouseLeave,
	}
}
