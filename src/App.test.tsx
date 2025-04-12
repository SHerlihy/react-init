import { describe, it } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

describe('App', () => {
    it('renders the App component', () => {
        render(<App />)
        screen.debug();
    })

    it('tab navigate to count button', async () => {
        render(<App />)
        const user = userEvent.setup()

        const countButton = await screen.findByText(/count is \d+/)

        while (countButton !== document.activeElement) {
            await user.tab()
        }

        expect(document.activeElement).toBe(countButton)
    })

    it('press enter on count button', async () => {
        render(<App />)
        const user = userEvent.setup()

        const countButton = await screen.findByText(/count is 0/)
        within(countButton).getByText("count is 0")

        while (countButton !== document.activeElement) {
            await user.tab()
        }

        await user.keyboard('{Enter}')

        within(countButton).getByText("count is 1")
    })
})
