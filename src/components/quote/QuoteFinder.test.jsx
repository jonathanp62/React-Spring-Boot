/*
 * (#)QuoteFinder.test.jsx 0.1.0   10/03/2025
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

import { API_QUOTE_ENDPOINTS } from "../../constants/api.jsx";

import QuoteFinder from './QuoteFinder';

const mockFetch = vi.fn();

describe('Quote finder component', () => {
    beforeEach(() => {
        globalThis.fetch = mockFetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Should display a quote on successful fetch', async () => {
        const user = userEvent.setup();

        const mockQuote = {
            value: {
                id: 9,
                text: 'So easy it is to switch container in #springboot.'
            },
            type: 'success'
        };

        // Mock a successful fetch response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockQuote),
        });

        render(<QuoteFinder />);

        // Get the form fields
        const quoteIdInput = screen.getByRole('textbox', {
            name: /Quote ID:/i
        });

        const findButton = screen.getByRole('button', {
            name: /Find/i
        });

        /*
        screen.debug(quoteIdInput);
        screen.debug(findButton);
         */

        const quoteID = '9';

        // Populate the form field
        await user.type(quoteIdInput, quoteID);

        expect(quoteIdInput).toHaveValue(quoteID);

        // Submit the form
        await user.click(findButton);

        await waitFor(() => {
            // Assert that fetch was called correctly using GET method
            expect(mockFetch).toHaveBeenCalledWith(API_QUOTE_ENDPOINTS.QUOTE_BY_ID(quoteID));

            // Assert that the found quote is displayed
            expect(screen.getByText('So easy it is to switch container in #springboot.')).toBeInTheDocument();
        });
    });

    it('Should display a message when a quote is not found', async () => {
        const user = userEvent.setup();
        const mockMessage = 'Quote 0 not found';

        // Mock a not found fetch response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            text: () => Promise.resolve(mockMessage),
        });

        render(<QuoteFinder />);

        // Get the form fields
        const quoteIdInput = screen.getByRole('textbox', {
            name: /Quote ID:/i
        });

        const findButton = screen.getByRole('button', {
            name: /Find/i
        });

        const quoteID = '0';

        // Populate the form field
        await user.type(quoteIdInput, quoteID);

        expect(quoteIdInput).toHaveValue(quoteID);

        // Submit the form
        await user.click(findButton);

        await waitFor(() => {
            // Assert that fetch was called correctly using GET method
            expect(mockFetch).toHaveBeenCalledWith(API_QUOTE_ENDPOINTS.QUOTE_BY_ID(quoteID));

            // Assert that the not found message is displayed
            expect(screen.getByText('Quote 0 not found')).toBeInTheDocument();
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

        render(<QuoteFinder />);

        // Get the form fields
        const quoteIdInput = screen.getByRole('textbox', {
            name: /Quote ID:/i
        });

        const findButton = screen.getByRole('button', {
            name: /Find/i
        });

        const quoteID = '9';

        // Populate the form field
        await user.type(quoteIdInput, quoteID);

        expect(quoteIdInput).toHaveValue(quoteID);

        // Submit the form
        await user.click(findButton);

        await waitFor(() => {
            // Assert that fetch was called correctly using GET method
            expect(mockFetch).toHaveBeenCalledWith(API_QUOTE_ENDPOINTS.QUOTE_BY_ID(9));

            // Assert that the error message is displayed
            expect(screen.getByText('HTTP error: Status: 500')).toBeInTheDocument();
        });
    });
});
