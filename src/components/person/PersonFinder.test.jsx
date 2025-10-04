/*
 * (#)PersonFinder.test.jsx 0.1.0   10/03/2025
 *
 * @author  Jonathan Parker
 * @version 0.1.0
 * @since   0.1.0
 *
 * MIT License
 *
 * Copyright (c) 2025 Jonathan M. Parker
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {fireEvent, render, screen, waitFor} from '@testing-library/react';

import { API_PERSON_ENDPOINTS} from "../../constants/api.jsx";

import PersonFinder from './PersonFinder';

const mockFetch = vi.fn();

describe('Person finder component', () => {
    beforeEach(() => {
        globalThis.fetch = mockFetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Should display a name on successful fetch', async () => {
        const mockPerson = {
            status: 'OK',
            id: 2,
            lastName: 'Kirk',
            firstName: 'James',
            phoneNumber: '555-234-5678',
            emailAddress: 'james@domain.com'
        };

        // Mock a successful fetch response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockPerson),
        });

        render(<PersonFinder />);

        // Populate the form fields
        fireEvent.change(screen.getByLabelText(/Person ID:/i), { target: { value: '2' } });

        // Submit the form
        fireEvent.submit(screen.getByRole('button', { name: /Find/i }));

        await waitFor(() => {
            // Assert that fetch was called correctlyusing GET method
            expect(mockFetch).toHaveBeenCalledWith(API_PERSON_ENDPOINTS.PERSON_BY_ID(2));

            // Assert that the found person's name is displayed
            expect(screen.getByText('James Kirk')).toBeInTheDocument();
        });
    });

    it('Should display a message when a person is not found', async () => {
        const mockMessage = 'Person 0 not found';

        // Mock a successful fetch response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: () => Promise.resolve(mockMessage),
        });

        render(<PersonFinder />);

        // Populate the form fields
        fireEvent.change(screen.getByLabelText(/Person ID:/i), { target: { value: '0' } });

        // Submit the form
        fireEvent.submit(screen.getByRole('button', { name: /Find/i }));

        await waitFor(() => {
            // Assert that fetch was called correctlyusing GET method
            expect(mockFetch).toHaveBeenCalledWith(API_PERSON_ENDPOINTS.PERSON_BY_ID(0));

            // Assert that the found person's name is displayed
            expect(screen.getByText('Person 0 not found')).toBeInTheDocument();
        });
    });

    it('Should display a message when an error occurs', async () => {
        const mockMessage = 'HTTP error: Status: 500';

        // Mock a successful fetch response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: () => Promise.resolve(mockMessage),
        });

        render(<PersonFinder />);

        // Populate the form fields
        fireEvent.change(screen.getByLabelText(/Person ID:/i), { target: { value: '1' } });

        // Submit the form
        fireEvent.submit(screen.getByRole('button', { name: /Find/i }));

        await waitFor(() => {
            // Assert that fetch was called correctlyusing GET method
            expect(mockFetch).toHaveBeenCalledWith(API_PERSON_ENDPOINTS.PERSON_BY_ID(1));

            // Assert that the found person's name is displayed
            expect(screen.getByText('HTTP error: Status: 500')).toBeInTheDocument();
        });
    });
});
