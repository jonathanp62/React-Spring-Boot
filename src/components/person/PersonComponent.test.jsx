/*
 * (#)PersonComponent.test.jsx  0.1.0   10/05/2025
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
import {render, screen, waitFor} from '@testing-library/react';

import { API_PERSON_ENDPOINTS} from "../../constants/api.jsx";

import PersonComponent from './PersonComponent.jsx';

const mockFetch = vi.fn();

describe('Person component', () => {
    beforeEach(() => {
        globalThis.fetch = mockFetch;
    });

    afterEach(() => {
        vi.clearAllMocks();
    });

    it('Should display all persons on successful fetch', async () => {
        const mockPersons = [
            {
                status: 'OK',
                id: 1,
                lastName: 'Spock',
                firstName: 'Mister',
                phoneNumber: '555-123-4567',
                emailAddress: 'spock@domain.com'
            },
            {
                status: 'OK',
                id: 2,
                lastName: 'Kirk',
                firstName: 'James',
                phoneNumber: '555-234-5678',
                emailAddress: 'james@domain.com'
            },
            {
                status: 'OK',
                id: 3,
                lastName: 'McCoy',
                firstName: 'Leonard',
                phoneNumber: '555-345-6789',
                emailAddress: 'leonard@domain.com'
            }
        ];

        // Mock a successful fetch response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockPersons),
        });

        render(<PersonComponent />);

        // Check that "Loading..." is displayed initially
        expect(screen.getByText('Loading ok...')).toBeInTheDocument();

        // Wait for the mock fetch to resolve and the UI to update
        await waitFor(() => {
            expect(mockFetch).toHaveBeenCalledWith(API_PERSON_ENDPOINTS.PEOPLE);

            expect(screen.getByText(/Person API/i)).toBeInTheDocument();

            expect(screen.getByRole('row', {
                name: /1 Mister Spock 555-123-4567/i
            })).toBeInTheDocument();

            expect(screen.getByRole('row', {
                name: /2 James Kirk 555-234-5678/i
            })).toBeInTheDocument();

            expect(screen.getByRole('row', {
                name: /3 Leonard McCoy 555-345-6789/i
            })).toBeInTheDocument();

            // expect(screen.getAllByText(/Person ID:/i)).toBeInTheDocument();
        });
    });
});
