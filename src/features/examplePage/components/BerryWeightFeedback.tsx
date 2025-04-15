import { useMutation } from '@tanstack/react-query'
import { Ref } from 'react'

type Mutation = ReturnType<typeof useMutation<string, Error, string>>

function BerryWeightFeedback({ mutation, ref }: { mutation: Mutation, ref: Ref<null|HTMLParagraphElement> }) {
    return (
        <p ref={ref}>
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
