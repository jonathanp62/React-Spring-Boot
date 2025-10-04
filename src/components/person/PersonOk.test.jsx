/*
 * (#)PersonOk.test.jsx 0.1.0   10/02/2025
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

import { API_PERSON_ENDPOINTS} from "../../constants/api.jsx";

import PersonOk from './PersonOk';

const mockFetch = vi.fn();

describe('Person OK component', () => {
    beforeEach(() => {
        globalThis.fetch = mockFetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Should display OK on successful fetch', async () => {
        const mockOk = 'OK';

        const mockResponse = {
            ok: true,
            status: 200,
            text: () => Promise.resolve(mockOk)
        };

        mockFetch.mockResolvedValueOnce(mockResponse);

        render(<PersonOk />);

        // Check that "Loading..." is displayed initially
        expect(screen.getByText('Loading ok...')).toBeInTheDocument();

        // Wait for the mock fetch to resolve and the UI to update
        await waitFor(() => {
            expect(screen.getByText(/OK API: OK/i)).toBeInTheDocument();
        });

        // Optionally, assert that fetch was called with the correct URL
        expect(globalThis.fetch).toHaveBeenCalledWith(API_PERSON_ENDPOINTS.OK);
    });

    it('Should display an error on an unsuccessful fetch', async () => {
        const mockResponse = {
            ok: false,
            status: 500
        };

        globalThis.fetch.mockResolvedValueOnce(mockResponse);

        render(<PersonOk />);

        expect(screen.getByText('Loading ok...')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText(/OK API HTTP error: 500/i)).toBeInTheDocument();
        });

        expect(globalThis.fetch).toHaveBeenCalledWith(API_PERSON_ENDPOINTS.OK);
    });
});
