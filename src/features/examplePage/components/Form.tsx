import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import BerryWeightFeedback from './BerryWeightFeedback'
import BerryWeightForm from './BerryWeightForm'
import { allSettledToCatchError, catchError, handleGET } from '@/lib/async'

const queryClient = new QueryClient()

export type GetBerryWeight = (url: string) => Promise<string>

const getBerryWeight: GetBerryWeight = async (getUrl: string) => {
    const [error, allSettledRes] = await catchError(
        Promise.allSettled([
            catchError(new Promise((resolve) => setTimeout(resolve, 3000))),
            handleGET(getUrl)
        ])
    )

    if (error) {
        return error.message
    }

    const allRes = allSettledToCatchError(allSettledRes)

    const [delay, getResolve] = allRes

    const [delayErr, _] = delay

    if (delayErr) {
        return delayErr.message
    }

    const [getErr, getResponse] = getResolve

    if (getErr) {
        return getErr.message
    }

    return getResponse.size
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

    return (
        <>
            <BerryWeightFeedback mutation={mutation} />
            <BerryWeightForm getBerryWeight={mutation.mutateAsync} resetResponseError={() => { mutation.reset() }} isResponseError={mutation.isError} />
        </>
    )
}

export default Form
