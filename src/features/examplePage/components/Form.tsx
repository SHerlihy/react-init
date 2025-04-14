import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import BerryWeightFeedback from './BerryWeightFeedback'
import BerryWeightForm from './BerryWeightForm'
import { handleGET } from '@/lib/async'

const queryClient = new QueryClient()

export type GetBerryWeight = (url: string) => Promise<string>

const getBerryWeight: GetBerryWeight = async (getUrl: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const [error, berryRes] = await handleGET(getUrl)

    if (error) {
        return error.message
    }

    return berryRes.size
}

function Form() {
    return (
        <QueryClientProvider client={queryClient}>
            <BerryForm />
        </QueryClientProvider>
    )
}

function BerryForm() {
    const mutation = useMutation({
        mutationFn: getBerryWeight
    })

    function resetResponseError() {
        console.log("reset called")
        mutation.reset()
    }

    return (
        <>
            <BerryWeightFeedback mutation={mutation} />
            <BerryWeightForm getBerryWeight={mutation.mutateAsync} resetResponseError={resetResponseError} isResponseError={mutation.isError} />
        </>
    )
}

export default Form
