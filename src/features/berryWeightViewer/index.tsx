import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import BerryWeightFeedback from './BerryWeightFeedback'
import { useRef } from 'react'
import { berryWeightController, getBerryWeight, GetBerryWeight } from './getBerryWeight'
import BerryWeightForm from './berryWeightForm'

const queryClient = new QueryClient()

function BerryWeightViewer() {
    return (
        <QueryClientProvider client={queryClient}>
            <BerryWeightController />
        </QueryClientProvider>
    )
}

function BerryWeightController() {
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

    const handleFormActionReset = () => {
        mutation.reset()
        berryWeightController?.abort()
    }

    return (
        <>
            <BerryWeightFeedback mutation={mutation} ref={feedbackRef} />
            <BerryWeightForm getBerryWeight={mutation.mutateAsync} handleFormActionReset={handleFormActionReset} isResponseError={mutation.isError} />
        </>
    )
}

export default BerryWeightViewer
