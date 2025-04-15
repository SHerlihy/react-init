import { StandardSchemaV1Issue } from "@tanstack/react-form"
import { ReactNode } from "react"

function Field({
    children,
    errors
}: {
    children: ReactNode
    errors?: StandardSchemaV1Issue[]
}) {
    return (
        <>
            {children}
            <p>
                {errors && errors.length > 0 ? (
                    errors.map((fErr) => (fErr.message))
                ) : <>
                    &nbsp;
                </>
                }
            </p>
        </>
    )
}

export default Field
