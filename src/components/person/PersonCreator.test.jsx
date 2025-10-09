/*
 * (#)PersonCreator.test.jsx    0.1.0   10/08/2025
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

import PersonCreator from './PersonCreator';

const mockFetch = vi.fn();

describe('Person creator component', () => {
    let logSpy;

    beforeEach(() => {
        // Before each test, create the spy and suppress the output
        logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

        globalThis.fetch = mockFetch;
    });

    afterEach(() => {
        vi.clearAllMocks();

        // After each test, restore the original console.log
        logSpy.mockRestore();
    });

    it('Should successfully create a new person', async () => {
        const user = userEvent.setup();

        const mockPerson = {
            status: 'OK',
            id: 4,
            lastName: 'Uhura',
            firstName: 'Nyota',
            phoneNumber: '555-456-7890',
            emailAddress: 'nyota@domain.com'
        };

        // Mock a successful fetch response
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            json: () => Promise.resolve(mockPerson),
        });

        // Mock the onRefresh function
        const mockOnRefresh = vi.fn();

        render(<PersonCreator onRefresh={mockOnRefresh} />);

        // Get the form fields
        const lastNameInput = screen.getByRole('textbox', {
            name: /Edit last name/i
        });

        const firstNameInput = screen.getByRole('textbox', {
            name: /Edit first name/i
        });

        const emailAddressInput = screen.getByRole('textbox', {
            name: /Edit email address/i
        });

        const phoneNumberInput = screen.getByRole('textbox', {
            name: /Edit phone number/i
        });

        const createButton = screen.getByRole('button', {
            name: /Create/i
        });

        /*
        screen.debug(lastNameInput);
        screen.debug(firstNameInput);
        screen.debug(emailAddressInput);
        screen.debug(phoneNumberInput);
        screen.debug(createButton);
         */

        // Populate the form fields
        await user.type(lastNameInput, 'Uhura');
        await user.type(firstNameInput, 'Nyota');
        await user.type(emailAddressInput, 'nyota@domain.com');
        await user.type(phoneNumberInput, '555-456-7890');

        // Make sure the input controls were successfully populated
        expect(lastNameInput).toHaveValue('Uhura');
        expect(firstNameInput).toHaveValue('Nyota');
        expect(emailAddressInput).toHaveValue('nyota@domain.com');
        expect(phoneNumberInput).toHaveValue('555-456-7890');

        // Submit the form
        await user.click(createButton);

        expect(mockOnRefresh).toHaveBeenCalledTimes(1);

        const newPerson = {
            lastName: lastNameInput.value,
            firstName: firstNameInput.value,
            phoneNumber: phoneNumberInput.value,
            emailAddress: emailAddressInput.value
        };

        expect(mockFetch).toHaveBeenCalledWith(
            API_PERSON_ENDPOINTS.ROOT,
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPerson),
            })
        );

        // Assert that console.log was called
        expect(logSpy).toHaveBeenCalled();

        // Assert that console.log was called exactly once
        expect(logSpy).toHaveBeenCalledTimes(1);

        // Assert that console.log was called with the specific message
        expect(logSpy).toHaveBeenCalledWith(`Person created: ${mockPerson.firstName} ${mockPerson.lastName}`);
    });

    it('Should display a message when an error occurs', async () => {
        const user = userEvent.setup();

        // Mock the onRefresh function
        const mockOnRefresh = vi.fn();

        const mockMessage = 'HTTP error: Status: 500';

        // Mock a failed fetch response
        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            text: () => Promise.resolve(mockMessage),
        });

        render(<PersonCreator onRefresh={mockOnRefresh} />);

        // Get the form fields
        const lastNameInput = screen.getByRole('textbox', {
            name: /Edit last name/i
        });

        const firstNameInput = screen.getByRole('textbox', {
            name: /Edit first name/i
        });

        const emailAddressInput = screen.getByRole('textbox', {
            name: /Edit email address/i
        });

        const phoneNumberInput = screen.getByRole('textbox', {
            name: /Edit phone number/i
        });

        const createButton = screen.getByRole('button', {
            name: /Create/i
        });

        // Populate the form fields
        await user.type(lastNameInput, 'Uhura');
        await user.type(firstNameInput, 'Nyota');
        await user.type(emailAddressInput, 'nyota@domain.com');
        await user.type(phoneNumberInput, '555-456-7890');

        // Make sure the input controls were successfully populated
        expect(lastNameInput).toHaveValue('Uhura');
        expect(firstNameInput).toHaveValue('Nyota');
        expect(emailAddressInput).toHaveValue('nyota@domain.com');
        expect(phoneNumberInput).toHaveValue('555-456-7890');

        // Submit the form
        await user.click(createButton);

        const newPerson = {
            lastName: lastNameInput.value,
            firstName: firstNameInput.value,
            phoneNumber: phoneNumberInput.value,
            emailAddress: emailAddressInput.value
        };

        expect(mockFetch).toHaveBeenCalledWith(
            API_PERSON_ENDPOINTS.ROOT,
            expect.objectContaining({
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newPerson),
            })
        );

        await waitFor(() => {
            // Assert that the error message is displayed
            expect(screen.getByText('Error: HTTP error: Status: 500')).toBeInTheDocument();
        });
    });
});
