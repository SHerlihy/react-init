import { allSettledToCatchError, catchError, handleGET } from "@/lib/async";

export let berryWeightController: AbortController;

export type GetBerryWeight = (url: string) => Promise<string>

export const getBerryWeight: GetBerryWeight = async (getUrl: string) => {
    berryWeightController = new AbortController()
    const minTimeout = new Promise((resolve, reject) => {
        berryWeightController!.signal.addEventListener(
            'abort',
            () => { reject() }
        )

        setTimeout(resolve, 3000)
    })

    const [error, allSettledRes] = await catchError(
        Promise.allSettled([
            catchError(minTimeout),
            handleGET(getUrl, berryWeightController.signal)
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
