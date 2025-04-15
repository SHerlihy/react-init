export async function catchError<T>(promise: Promise<T>): Promise<[undefined, T] | [Error]> {
    return promise
        .then(data => {
            return [undefined, data] as [undefined, T]
        })
        .catch(error => {
            return [error]
        })
}

export async function handleGET<TRes = any>(uri: string): Promise<[undefined, TRes] | [Error]> {
    const [error, response] = await catchError(fetch(uri))

    if (error !== undefined) {
        console.error(error.message)
        return [error]
    }
    
    return [error, await response.json()]
}

export function allSettledToCatchError<T>(settled: PromiseSettledResult<[Error] | [undefined, T]>[]): Array<[undefined, T]| [Error]> {
        return settled.map((settledRes) => {
            if (settledRes.status === "rejected") {
                return [new Error(settledRes.reason.message)]
            }

            return settledRes.value
        })
    }

