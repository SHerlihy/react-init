import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Input } from '@/components/ui/input'
import Field from './Field'
import FormButtons from './FormButtons'
import { GetBerryWeight } from '@/features/berryWeightViewer/getBerryWeight'

const BASE_URL = "https://pokeapi.co/api/v2/berry/"

const berryTuple = ["cheri", "chesto", "pecha"] as const
const inputValidationError = `Input must match ${berryTuple.join(" | ")}`

const berrySchema = z.object({
    berry: z.enum(berryTuple, {
        message: inputValidationError,
    })
})

function BerryWeightForm({
    getBerryWeight,
    handleFormActionReset,
    isResponseError,
}: {
    getBerryWeight: GetBerryWeight,
    handleFormActionReset: () => void,
    isResponseError: boolean,
}) {
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

            const berryWeightResponse = await getBerryWeight(url)

            return berryWeightResponse
        },
    })

    const handleFormReset = () => {
        form.reset()
        handleFormActionReset()
    }

    return (
        <>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    form.handleSubmit()
                }}
                onChange={(e) => {
                    e.preventDefault()
                    e.stopPropagation()

                    if (isResponseError) {
                        handleFormActionReset()
                    }
                }}
            >
                <form.Field
                    name="berry"
                    children={(field) => (
                        <Field
                            errors={field.state.meta.errorMap.onChange}
                        >
                            <Input
                                name={field.name}
                                value={field.state.value}
                                type='text'
                                onChange={(e) => field.handleChange(e.target.value)}
                            />
                        </Field>
                    )}
                />
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) =>
                        <FormButtons
                            canSubmit={canSubmit}
                            isSubmitting={isSubmitting}
                            handleReset={handleFormReset}
                        />}
                />
            </form >
        </>
    )
}

export default BerryWeightForm
