import { ref } from 'vue'

interface FormSubmitOptions {
	onSuccess?: () => void
	onError?: (error: any) => void
	resetAfter?: boolean
	resetDelay?: number
	simulateDelay?: number
}

/**
 * Hook for handling form submissions with loading and success states
 * @param initialValues - Initial form values
 * @param submitFunction - Actual function to execute on submit (optional)
 * @param options - Configuration options
 */
export function useFormSubmit<T extends object>(
	initialValues: T,
	submitFunction?: (values: T) => Promise<any>,
	options: FormSubmitOptions = {}
) {
	const { onSuccess, onError, resetAfter = true, resetDelay = 3000, simulateDelay = 1500 } = options

	const form = ref<T>({ ...initialValues })
	const isLoading = ref(false)
	const isSuccess = ref(false)
	const error = ref<any>(null)

	const resetForm = () => {
		form.value = { ...initialValues }
	}

	const handleSubmit = async (e?: Event) => {
		if (e) e.preventDefault()
		isLoading.value = true
		error.value = null

		try {
			if (submitFunction) {
				await submitFunction(form.value)
			} else {
				// Simulate API call if no submitFunction is provided
				await new Promise((resolve) => setTimeout(resolve, simulateDelay))
			}

			isSuccess.value = true
			if (onSuccess) onSuccess()

			// Reset form after success if requested
			if (resetAfter) {
				resetForm()

				// Reset success state after delay
				setTimeout(() => {
					isSuccess.value = false
				}, resetDelay)
			}
		} catch (err) {
			error.value = err
			if (onError) onError(err)
		} finally {
			isLoading.value = false
		}
	}

	return {
		form,
		isLoading,
		isSuccess,
		error,
		handleSubmit,
		resetForm,
	}
}
