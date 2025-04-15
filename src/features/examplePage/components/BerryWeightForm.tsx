import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { GetBerryWeight } from './Form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const BASE_URL = "https://pokeapi.co/api/v2//"

const berryTuple = ["cheri", "chesto", "pecha"] as const
const inputValidationError = `Input must match ${berryTuple.join(" | ")}`

const berrySchema = z.object({
    berry: z.enum(berryTuple, {
        message: inputValidationError,
    })
})

function BerryWeightForm({
    getBerryWeight,
    handleFormReset,
    isResponseError,
}: {
    getBerryWeight: GetBerryWeight,
    handleFormReset: () => void,
    isResponseError: boolean,
}) {
    const [postSubmitChange, setPostSubmitChange] = useState(false)
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

            setPostSubmitChange(false)

            return berryWeightResponse
        },
    })

    useEffect(() => {
        handleFormReset()
        setPostSubmitChange(false)
    }, [isResponseError && postSubmitChange])

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
                        setPostSubmitChange(true)
                    }
                }
                }
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
                            <p>
                                {field.state.meta.errorMap.onChange?.length ? (
                                    field.state.meta.errorMap.onChange.map((fErr) => (fErr.message))) : <>&nbsp;</>
                                }
                            </p>
                        </>
                    )}
                />
                <form.Subscribe
                    selector={(state) => [state.canSubmit, state.isSubmitting]}
                    children={([canSubmit, isSubmitting]) => (
                        <>
                            <Button type="submit" disabled={!canSubmit}>
                                {isSubmitting ? '...' : 'Submit'}
                            </Button>
                            <Button type="reset" onClick={() => {
                                form.reset()
                                handleFormReset()
                            }}>
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

export default BerryWeightForm
