import { useMutation } from '@tanstack/react-query'

type Mutation = ReturnType<typeof useMutation<string, Error, string>>

function BerryWeightFeedback({ mutation }: { mutation: Mutation }) {
    return (
        <>
            {mutation.isPending && <p>...</p>}
            {mutation.isSuccess && <p>{mutation.data}</p>}
            {mutation.isError && <p>Unable to get berry weight</p>}
        </>
    )
}

export default BerryWeightFeedback
