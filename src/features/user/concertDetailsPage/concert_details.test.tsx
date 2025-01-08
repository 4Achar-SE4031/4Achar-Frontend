// ConcertDetails.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer } from 'react-toastify';
import ConcertDetails from './concertDetail';
import { useAuth } from '../Authentication/authProvider';

jest.mock('../Authentication/authProvider', () => ({
    useAuth: jest.fn(),
}));

jest.mock('axios');

describe('ConcertDetails Component', () => {
    const mockAuth = { token: 'mockToken' };
    beforeEach(() => {
        (useAuth as jest.Mock).mockReturnValue(mockAuth);
        jest.clearAllMocks();
    });

    test('renders loading animation initially', () => {
        render(
            <MemoryRouter>
                <ConcertDetails />
            </MemoryRouter>
        );
        expect(screen.getByText(/loading/i)).toBeInTheDocument();
    });

    test('renders event details after loading', async () => {
        render(
            <MemoryRouter>
                <ConcertDetails />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/کنسرت ارکستر سمفونیک قاف/i)).toBeInTheDocument());
        expect(screen.getByText(/تهران، خیابان حافظ، تالار وحدت/i)).toBeInTheDocument();
    });

    test('handles bookmark toggling', async () => {
        (axios.post as jest.Mock).mockResolvedValue({ data: {} });
        render(
            <MemoryRouter>
                <ToastContainer />
                <ConcertDetails />
            </MemoryRouter>
        );

        const bookmarkButton = await screen.findByText(/بعدا یادآوری کن/i);
        fireEvent.click(bookmarkButton);

        await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
            expect.stringMatching(/\/bookmark\//),
            {},
            expect.objectContaining({
                headers: expect.objectContaining({
                    Authorization: `JWT ${mockAuth.token}`,
                }),
            })
        ));

        await waitFor(() => expect(screen.getByText(/رویداد به علاقه مندی ها اضافه شد/i)).toBeInTheDocument());
    });

    test('renders error page if an error occurs', async () => {
        (axios.get as jest.Mock).mockRejectedValue(new Error('Error fetching data'));
        render(
            <MemoryRouter>
                <ConcertDetails />
            </MemoryRouter>
        );

        await waitFor(() => expect(screen.getByText(/Page Not Found/i)).toBeInTheDocument());
    });

    test('copies the link to clipboard', async () => {
        const mockClipboard = { writeText: jest.fn() };
        Object.assign(navigator, { clipboard: mockClipboard });

        render(
            <MemoryRouter>
                <ConcertDetails />
            </MemoryRouter>
        );

        const copyButton = await screen.findByText(/کپی/i);
        fireEvent.click(copyButton);

        expect(mockClipboard.writeText).toHaveBeenCalledWith(window.location.href);
    });
});
