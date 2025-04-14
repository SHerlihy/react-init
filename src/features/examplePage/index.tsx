import { useState } from 'react'
import reactLogo from '@/assets/react.svg'
import viteLogo from '/vite.svg'
import '@features/examplePage/index.css'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Form from './components/Form'

function ExamplePage() {
    const [count, setCount] = useState(0)

    return (
        <section>
            <Form />
            <div className='flex justify-center'>
                <a href="https://react.dev" target="_blank">
                    <img src={reactLogo} className="logo react" alt="React logo" />
                </a>
                <a href="https://vite.dev" target="_blank">
                    <img src={viteLogo} className="logo" alt="Vite logo" />
                </a>
            </div>
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
