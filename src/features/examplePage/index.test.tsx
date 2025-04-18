import { describe, expect, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ExamplePage from './index';

describe('App', () => {
    it('renders the App component', () => {
        render(<ExamplePage />)
        screen.debug();
    })

    it('tab navigate to count button', async () => {
        render(<ExamplePage />)
        const user = userEvent.setup()

        const countButton = await screen.findByText(/count is \d+/)

        while (countButton !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(countButton)
    })

it('click on count button', async ()=>{
        render(<ExamplePage />)
        const user = userEvent.setup()

        const countButton = await screen.findByText(/count is 0/)
        within(countButton).getByText("count is 0")

        let clickCount = 0
        while (clickCount < 13) {
            await user.click(countButton)
            clickCount++
            within(countButton).getByText(`count is ${clickCount}`)
        }
})

    it('press enter on count button', async () => {
        render(<ExamplePage />)
        const user = userEvent.setup()

        const countButton = await screen.findByText(/count is 0/)
        within(countButton).getByText("count is 0")

        while (countButton !== document.activeElement) {
            await user.tab()
        }

        let clickCount = 0
        while (clickCount < 13) {
            await user.keyboard('{Enter}')
            clickCount++
            within(countButton).getByText(`count is ${clickCount}`)
        }
    })
})
