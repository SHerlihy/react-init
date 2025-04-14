import { useForm } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import z from 'zod'

import {
    QueryClient,
    QueryClientProvider,
    useMutation,
} from '@tanstack/react-query'
import { Button } from '@/components/ui/button'

const berryTuple = ["cheri", "chesto", "pecha"] as const
const inputValidationError = `Input must match ${berryTuple.join(" | ")}`

const berrySchema = z.object({
    berry: z.enum(berryTuple, {
        message: inputValidationError,
    })
})

type BerryRes = {
    size: number
}

const BASE_URL = "https://pokeapi.co/api/v2/berry/"

const queryClient = new QueryClient()

type GetBerryWeight = (url: string) => Promise<number>

const getBerryWeight: GetBerryWeight = async (getUrl: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    const berryRes = await fetch(getUrl).then((res) =>
        res.json(),
    ) as BerryRes

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

    return (
        <>
            <BerryWeightFeedback mutation={mutation} />
            <BerryWeightForm getBerryWeight={mutation.mutateAsync} />
        </>
    )
}

type Mutation = ReturnType<typeof useMutation<number, Error, string>>

function BerryWeightFeedback({ mutation }: { mutation: Mutation }) {
    return (
        <>
            {mutation.isPending && <p>...</p>}
            {mutation.isSuccess && <p>{mutation.data}</p>}
            {mutation.isError && <p>{mutation.error.message}</p>}
        </>
    )
}

function BerryWeightForm({ getBerryWeight }: { getBerryWeight: GetBerryWeight }) {

    const form = useForm({
        defaultValues: {
            berry: ''
        },
        validators: {
            onChange: berrySchema,
            onMount: berrySchema,
        },
        onSubmit: async ({ value }) => {
            const url = `${BASE_URL}${value.berry}`
            return await getBerryWeight(url)
        }
    })

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
            >
                <form.Subscribe
                    selector={(state) => [state.isSubmitting]}
                    children={([isSubmitting]) => (
                        <form.Field
                            name="berry"
                            children={(field) => (
                                <>
                                    <Input
                                        disabled={isSubmitting}
                                        name={field.name}
                                        value={field.state.value}
                                        type='text'
                                        onChange={(e) => field.handleChange(e.target.value)}
                                    />
                                    {field.state.meta.errorMap.onChange?.length && (
                                        field.state.meta.errorMap.onChange.map((fErr) => (<p>{fErr.message}</p>)))
                                    }
                                </>
                            )}
                        />
                    )
                    }
                />
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <>
                            <Button type="submit" disabled={!canSubmit}>
                                {isSubmitting ? '...' : 'Submit'}
                            </Button>
                            <Button type="reset" onClick={() => form.reset()}>
                                Reset
                            </Button>
                        </>
                    )
                    }
                />
            </form >
        </>
    )
}

export default Form
