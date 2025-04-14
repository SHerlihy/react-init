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

function Form() {
    return (
        <QueryClientProvider client={queryClient}>
            <BerryWeightForm />
        </QueryClientProvider>
    )
}

function BerryWeightForm() {
    const mutation = useMutation({
        mutationFn: async (getUrl: string) => {
            await new Promise((resolve) => setTimeout(resolve, 1000))
            const berryRes = await fetch(getUrl).then((res) =>
                res.json(),
            ) as BerryRes

            return berryRes.size
        },
    })

    const form = useForm({
        defaultValues: {
            berry: ''
        },
        validators: {
            onChange: berrySchema
        },
        onSubmit: async ({ value }) => {
            const url = `${BASE_URL}${value.berry}`
            return await mutation.mutateAsync(url)
        }
    })

    return (
        <>
            {mutation.isSuccess && <p>{mutation.data}</p>}
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
