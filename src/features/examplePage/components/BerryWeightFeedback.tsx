import { useMutation } from '@tanstack/react-query'

type Mutation = ReturnType<typeof useMutation<string, Error, string>>

function BerryWeightFeedback({ mutation }: { mutation: Mutation }) {
    return (
        <p>
            {(() => {
                switch (mutation.status) {
                    case "idle":
                        return <>&nbsp;</>
                    case "pending":
                        return "..."
                    case "success":
                        return mutation.data
                    default:
                        return "unable to get berry weight"
                }
            }
            )()}
        </p>
    )
}

export default BerryWeightFeedback
