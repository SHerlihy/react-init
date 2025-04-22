import { useState } from 'react'
import '@features/examplePage/index.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

function ExamplePage() {
    const [count, setCount] = useState(0)

    return (
        <section>
            <h1>Vite + React</h1>
            <Card>
                <Button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </Button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </Card>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </section>
    )
}

export default ExamplePage
