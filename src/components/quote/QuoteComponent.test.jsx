/*
 * (#)QuoteComponent.test.jsx   0.1.0   10/05/2025
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

import { API_QUOTE_ENDPOINTS } from "../../constants/api.jsx";

import QuoteComponent from './QuoteComponent.jsx';

const mockFetch = vi.fn();

describe('Quote component', () => {
    beforeEach(() => {
        globalThis.fetch = mockFetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Should display all quotes on successful fetch', async () => {
        const mockQuotes = [
            {
                value: {
                    id: 9,
                    text: 'So easy it is to switch container in #springboot.'
                },
                type: 'success'
            },
            {
                value: {
                    id: 10,
                    text: 'Really loving Spring Boot, makes stand alone Spring apps easy.'
                },
                type: 'success'
            }
        ];

        // Mock a successful fetch response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockQuotes),
        });

        render(<QuoteComponent />);

        // Check that "Loading..." is displayed initially
        expect(screen.getByText('Loading ok...')).toBeInTheDocument();

        // Wait for the mock fetch to resolve and the UI to update
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(API_QUOTE_ENDPOINTS.ALL);

            expect(screen.getByText(/Quote API/i)).toBeInTheDocument();
            expect(screen.getByText(/So easy it is to switch container in #springboot./i)).toBeInTheDocument();
            expect(screen.getByText(/Really loving Spring Boot, makes stand alone Spring apps easy./i)).toBeInTheDocument();
            expect(screen.getByText(/Quote ID:/i)).toBeInTheDocument();
        });
    });

    it('Should display a message when an error occurs', async () => {
        const mockMessage = 'All API HTTP error: 500';

        // Mock a failed fetch response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: () => Promise.resolve(mockMessage),
        });

        render(<QuoteComponent />);

        await waitFor(() => {
            // Assert that fetch was called correctly using GET method
            expect(mockFetch).toHaveBeenCalledWith(API_QUOTE_ENDPOINTS.ALL);

            // Assert that the error message is displayed
            expect(screen.getByText('Error: All API HTTP error: 500')).toBeInTheDocument();
        });
    });
});
