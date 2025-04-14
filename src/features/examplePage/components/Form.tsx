import { useForm } from '@tanstack/react-form'
import { Input } from '@/components/ui/input'
import z from 'zod'


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

function Form() {
    const form = useForm({
        defaultValues: {
            berry: ''
        },
        validators: {
            onChange: berrySchema
        },
        onSubmit: async ({ value }) => {
            const response = await fetch(
                `${BASE_URL}${value.berry}`,
            )

            console.log(response)
            const resData = await response.json() as BerryRes

            console.log(resData)
        }
    })

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
        >
            <form.Field
                name="berry"
                children={(field) => (
                    <>
                        <Input
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
        </form >
    )
}

export default Form
