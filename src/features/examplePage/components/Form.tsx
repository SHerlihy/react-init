import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import BerryWeightFeedback from './BerryWeightFeedback'
import BerryWeightForm from './BerryWeightForm'
import { allSettledToCatchError, catchError, handleGET } from '@/lib/async'
import { useRef } from 'react'

const queryClient = new QueryClient()

let controller: AbortController;

export type GetBerryWeight = (url: string) => Promise<string>

const getBerryWeight: GetBerryWeight = async (getUrl: string) => {
    controller = new AbortController()
    const minTimeout = new Promise((resolve, reject) => {
        controller!.signal.addEventListener(
            'abort',
            () => { reject() }
        )

        setTimeout(resolve, 3000)
    })

    const [error, allSettledRes] = await catchError(
        Promise.allSettled([
            catchError(minTimeout),
            handleGET(getUrl, controller.signal)
        ])
    )

    if (error) {
        return Promise.reject(error)
    }

    const allRes = allSettledToCatchError(allSettledRes)

    const [delay, getResolve] = allRes

    const [delayErr, _] = delay

    if (delayErr) {
        return Promise.reject(delayErr)
    }

    const [getErr, getResponse] = getResolve

    if (getErr) {
        return Promise.reject(getErr)
    }

    return Promise.resolve(getResponse.size)
}

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
        controller?.abort()
    }

    return (
        <>
            <BerryWeightFeedback mutation={mutation} ref={feedbackRef} />
            <BerryWeightForm getBerryWeight={mutation.mutateAsync} handleFormReset={handleFormReset} isResponseError={mutation.isError} />
        </>
    )
}

export default Form
