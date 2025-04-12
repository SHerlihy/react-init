import { describe, it } from 'vitest';
import { render, screen } from '@testing-library/react';
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
})
