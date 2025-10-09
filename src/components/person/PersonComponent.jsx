/*
 * (#)PersonComponent.jsx   0.1.0   09/30/2025
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

import "../styles/Tables.css";

import React, { useState, useEffect } from 'react';

import PersonCreator from "./PersonCreator.jsx";
import PersonDeleter from "./PersonDeleter.jsx";
import PersonFinder from "./PersonFinder.jsx";
import PersonOk from "./PersonOk.jsx";

import { API_PERSON_ENDPOINTS } from "../../constants/api.jsx";

/**
 * The person component.
 *
 * @returns {React.JSX.Element}
 */
const PersonComponent = () => {
    const [people, setPeople] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);

    const triggerRefresh = () => {
        setRefreshKey(prev => prev + 1); // Changing state triggers re-render
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [response] = await Promise.all([
                    fetch(API_PERSON_ENDPOINTS.PEOPLE)
                ]);

                if (response.ok) {
                    const result = await response.json();

                    setPeople(result);
                } else {
                    const messageText = `People API HTTP error: ${response.status}`;

                    setError(messageText);
                    console.log(messageText);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [refreshKey]);   // Re-render when refreshKey changes

    if (isLoading) {
        return <div>Loading ok...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Person API</h2>
            <PersonOk />
            <table className="table-container">
                <tbody>
                {people.map((person) => (
                    <tr key={person.id}>
                        <td>{person.id}</td>
                        <td>{person.firstName} {person.lastName}</td>
                        <td>{person.phoneNumber}</td>
                        <td>{person.emailAddress}</td>
                    </tr>))}
                </tbody>
            </table>
            <p/>
            <PersonFinder />
            <p/>
            <PersonCreator onRefresh={triggerRefresh}/>
            <p/>
            <PersonDeleter onRefresh={triggerRefresh}/>
        </div>
    );
};

export default PersonComponent;