/*
 * (#)PersonDeleter.jsx 0.1.0   09/302025
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

import React, { useState } from "react";

import { API_PERSON_ENDPOINTS } from "../../constants/api.jsx";

/**
 * The person deleter component.
 *
 * @param   onRefresh
 * @returns {React.JSX.Element}
 */
const PersonDeleter = ({ onRefresh }) => {
    const [message, setMessage] = useState(null);
    const [personId, setPersonId] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();

        const deletePerson = async() => {
            try {
                setMessage(null);

                const response = await fetch(API_PERSON_ENDPOINTS.PERSON_BY_ID(personId), {
                    method: 'DELETE'
                });

                if (response.ok) {
                    setMessage(`Person ${personId} deleted`);
                    onRefresh();
                } else if (response.status === 404) {
                    setMessage(`Person ${personId} not found`);
                } else {
                    const messageText = `HTTP error: Status: ${response.status}`;

                    setMessage(messageText);
                    console.error(messageText);
                }
            } catch (e) {
                console.error(e);
            }
        };

        deletePerson();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Person ID:
                    <input
                        type="text"
                        value={personId}
                        onChange={(e) => setPersonId(e.target.value)}
                    />
                </label>
                <button type="submit">Delete</button>
            </form>
            { message ? (
                <p>{message}</p>
            ) : (
                <p/>
            )
            }
        </div>
    );
};

export default PersonDeleter;