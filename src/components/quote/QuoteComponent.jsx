/*
 * (#)QuoteComponent.jsx    0.1.0   09/30/2025
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

import QuoteFinder from "./QuoteFinder.jsx";
import QuoteOk from "./QuoteOk.jsx";
import QuoteRandom from "./QuoteRandom.jsx";

import {API_QUOTE_ENDPOINTS} from "../../constants/api.jsx";

/**
 * The quote component.
 *
 * @returns {React.JSX.Element}
 */
const QuoteComponent = () => {
    const [quotes, setQuotes] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Define an async function to perform the fetch
        const fetchData = async () => {
            try {
                const [response] = await Promise.all([
                    fetch(API_QUOTE_ENDPOINTS.ALL)
                ]);

                if (response.ok) {
                    const result = await response.json();

                    setQuotes(result);
                } else if (!response.ok) {
                    setError(`All API HTTP error: ${response.status}`);
                }
            } catch (e) {
                setError(e.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []); // The empty dependency array ensures this effect runs only once

    if (isLoading) {
        return <div>Loading ok...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Quote API</h2>
            <QuoteOk />
            <QuoteRandom />
            <table className="table-container">
                <tbody>
                {quotes.map((quote) => (
                    <tr key={quote.value.id}>
                        <td>{quote.value.id}</td>
                        <td>{quote.value.text}</td>
                        <td>{quote.type}</td>
                    </tr>))}
                </tbody>
            </table>
            <p/>
            <QuoteFinder />
        </div>
    );
};

export default QuoteComponent;