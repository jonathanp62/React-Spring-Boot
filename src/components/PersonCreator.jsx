/*
 * (#)PersonCreator.jsx 0.1.0   09/30/2025
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

import "./Tables.css";

import React, { useState } from "react";

/**
 * The person creator component.
 *
 * @param   onRefresh
 * @returns {React.JSX.Element}
 */
const PersonCreator = ({ onRefresh }) => {
    const [error, setError] = useState(null);

    const [formData, setFormData] = useState({
        lastName: '',
        firstName: '',
        phoneNumber: '',
        emailAddress: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const savePerson = async() => {
            try {
                const response = await fetch(`http://localhost:8080/api/person`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(formData),
                });

                if (response.ok) {
                    const person = await response.json();

                    console.log(`Person created: ${person.firstName} ${person.lastName}`);
                    onRefresh();
                } else {
                    setError(`HTTP error! status: ${response.status}`);
                }
            } catch (e) {
                setError(e.message);
            }
        };

        savePerson();
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <table className="table-container">
                    <tbody>
                    <tr>
                        <td>Last Name:</td>
                        <td>
                            <input
                                name="lastName"
                                type="text"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>First Name:</td>
                        <td>
                            <input
                                name="firstName"
                                type="text"
                                value={formData.firstName}
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Email Address:</td>
                        <td>
                            <input
                                name="emailAddress"
                                type="email"
                                value={formData.emailAddress}
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>Phone Number:</td>
                        <td>
                            <input
                                name="phoneNumber"
                                type="tel"
                                value={formData.phoneNumber}
                                onChange={handleChange}
                            />
                        </td>
                    </tr>
                    <tr>
                        <td>{ ' ' }</td>
                        <td>
                            <button type="submit">Create</button>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </form>
        </div>
    );
};

export default PersonCreator;