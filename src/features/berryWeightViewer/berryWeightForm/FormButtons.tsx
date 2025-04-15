import { Button } from "@/components/ui/button"

function FormButtons({
    canSubmit,
    isSubmitting,
    handleReset
}: {
    canSubmit: boolean,
    isSubmitting: boolean,
    handleReset: () => void
}) {
    return (
        <>
            <Button type="submit" disabled={!canSubmit}>
                {isSubmitting ? '...' : 'Submit'}
            </Button>
            <Button type="reset" onClick={handleReset}>
                Reset
            </Button>
        </>
    )
}

export default FormButtons
