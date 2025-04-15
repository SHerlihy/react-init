import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import BerryWeightFeedback from './BerryWeightFeedback'
import BerryWeightForm from './BerryWeightForm'
import { useRef } from 'react'
import { berryWeightController, getBerryWeight, GetBerryWeight } from './getBerryWeight'

const queryClient = new QueryClient()

function Form() {
    return (
        <QueryClientProvider client={queryClient}>
            <BerryForm />
        </QueryClientProvider>
    )
}

function BerryForm() {
    const feedbackRef = useRef<null | HTMLParagraphElement>(null)

    const handleGetBerryWeight: GetBerryWeight = async (url) => {
        const response = await getBerryWeight(url)

        if (feedbackRef.current) {
            feedbackRef.current.scrollIntoView()
        }

        return response
    }

    const mutation = useMutation({
        mutationFn: handleGetBerryWeight
    })

    const handleFormReset = () => {
        mutation.reset()
        berryWeightController?.abort()
    }

    return (
        <>
            <BerryWeightFeedback mutation={mutation} ref={feedbackRef} />
            <BerryWeightForm getBerryWeight={mutation.mutateAsync} handleFormReset={handleFormReset} isResponseError={mutation.isError} />
        </>
    )
}

export default Form
