import { onMounted, type Ref } from 'vue'
import { gsap } from 'gsap'

export function usePageAnimation(selector: string, delay = 0.2) {
	onMounted(() => {
		gsap.from(selector, {
			y: 50,
			opacity: 0,
			duration: 1,
			ease: 'expo.out',
			delay,
			force3D: true,
		})
	})
}

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
			force3D: true,
		})
	})
}

export function useHoverAnimation(targetRef: Ref<HTMLElement | null>, scaleAmount = 1.05) {
	const handleMouseEnter = () => {
		gsap.to(targetRef.value, {
			scale: scaleAmount,
			duration: 0.3,
			ease: 'power2.out',
			force3D: true,
		})
	}

	const handleMouseLeave = () => {
		gsap.to(targetRef.value, {
			scale: 1,
			duration: 0.3,
			ease: 'power2.out',
			force3D: true,
		})
	}

	return { handleMouseEnter, handleMouseLeave }
}
