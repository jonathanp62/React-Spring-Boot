/*
 * (#)PersonFinder.test.jsx 0.1.0   10/09/2025
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
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { API_PERSON_ENDPOINTS } from "../../constants/api.jsx";

import PersonDeleter from './PersonDeleter';

const mockFetch = vi.fn();

describe('Person deleter component', () => {
    beforeEach(() => {
        globalThis.fetch = mockFetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Should delete a person on successful fetch', async () => {
        const user = userEvent.setup();
        const mockMessage = 'Person 1 deleted';

        // Mock a successful fetch response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            text: () => Promise.resolve(mockMessage),
        });

        // Mock the onRefresh function
        const mockOnRefresh = vi.fn();

        render(<PersonDeleter onRefresh={mockOnRefresh} />);

        // Get the form fields
        const personIdInput = screen.getByRole('textbox', {
            name: /Person ID:/i
        });

        const deleteButton = screen.getByRole('button', {
            name: /Delete/i
        });

        const personID = '1';

        // Populate the form field
        await user.type(personIdInput, personID);

        expect(personIdInput).toHaveValue(personID);

        // Submit the form
        await user.click(deleteButton);

        await waitFor(() => {
            // Assert that fetch was called correctly using DELETE method
            expect(mockFetch).toHaveBeenCalledWith(
                API_PERSON_ENDPOINTS.PERSON_BY_ID(personID),
                expect.objectContaining({
                    method: 'DELETE',
                })
            );

            // Assert that the error message is displayed
            expect(screen.getByText('Person 1 deleted')).toBeInTheDocument();
        });
    });

    it('Should display a message when a person is not found', async () => {
        const user = userEvent.setup();
        const mockMessage = 'Person 0 not found';

        // Mock a failed fetch response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: () => Promise.resolve(mockMessage),
        });

        // Mock the onRefresh function
        const mockOnRefresh = vi.fn();

        render(<PersonDeleter onRefresh={mockOnRefresh} />);

        // Get the form fields
        const personIdInput = screen.getByRole('textbox', {
            name: /Person ID:/i
        });

        const deleteButton = screen.getByRole('button', {
            name: /Delete/i
        });

        const personID = '0';

        // Populate the form field
        await user.type(personIdInput, personID);

        expect(personIdInput).toHaveValue(personID);

        // Submit the form
        await user.click(deleteButton);

        await waitFor(() => {
            // Assert that fetch was called correctly using DELETE method
            expect(mockFetch).toHaveBeenCalledWith(
                API_PERSON_ENDPOINTS.PERSON_BY_ID(personID),
                expect.objectContaining({
                    method: 'DELETE',
                })
            );

            // Assert that the error message is displayed
            expect(screen.getByText('Person 0 not found')).toBeInTheDocument();
        });
    });

    it('Should display a message when an error occurs', async () => {
        const user = userEvent.setup();
        const mockMessage = 'HTTP error: Status: 500';

        // Mock a failed fetch response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: () => Promise.resolve(mockMessage),
        });

        // Mock the onRefresh function
        const mockOnRefresh = vi.fn();

        render(<PersonDeleter onRefresh={mockOnRefresh} />);

        // Get the form fields
        const personIdInput = screen.getByRole('textbox', {
            name: /Person ID:/i
        });

        const deleteButton = screen.getByRole('button', {
            name: /Delete/i
        });

        const personID = '1';

        // Populate the form field
        await user.type(personIdInput, personID);

        expect(personIdInput).toHaveValue(personID);

        // Submit the form
        await user.click(deleteButton);

        await waitFor(() => {
            // Assert that fetch was called correctly using DELETE method
            expect(mockFetch).toHaveBeenCalledWith(
                API_PERSON_ENDPOINTS.PERSON_BY_ID(personID),
                expect.objectContaining({
                    method: 'DELETE',
                })
            );

            // Assert that the error message is displayed
            expect(screen.getByText('HTTP error: Status: 500')).toBeInTheDocument();
        });
    });
});
