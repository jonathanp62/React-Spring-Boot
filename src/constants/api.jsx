/*
 * (#)api.jsx   0.1.0   10/02/2025
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

export const BASE_URL = 'http://localhost:8080';

export const PERSON_URL = `${BASE_URL}/api/person`;
export const QUOTE_URL = `${BASE_URL}/api/quote`;

export const API_PERSON_ENDPOINTS = Object.freeze({
    OK: `${PERSON_URL}/ok`,
    PEOPLE: `${PERSON_URL}/people`,
    PERSON_BY_ID: (id) => `${PERSON_URL}/${id}`,
    ROOT: `${PERSON_URL}`
});

export const API_QUOTE_ENDPOINTS = Object.freeze({
    ALL: `${QUOTE_URL}/all`,
    OK: `${QUOTE_URL}/ok`,
    QUOTE_BY_ID: (id) => `${QUOTE_URL}/${id}`,
    RANDOM: `${QUOTE_URL}/random`,
    ROOT: `${QUOTE_URL}`
});
