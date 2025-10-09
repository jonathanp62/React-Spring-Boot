/*
 * (#)QuoteFinder.jsx   0.1.0   09/30/2025
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

import { API_QUOTE_ENDPOINTS } from "../../constants/api.jsx";

/**
 * The quote finder component.
 *
 * @returns {React.JSX.Element}
 */
const QuoteFinder = () => {
    const [message, setMessage] = useState(null);
    const [quoteId, setQuoteId] = useState('');
    const [quote, setQuote] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();

        const fetchQuote = async() => {
            try {
                setQuote(null);
                setMessage(null);

                const response = await fetch(API_QUOTE_ENDPOINTS.QUOTE_BY_ID(quoteId));

                if (response.ok) {
                    const data = await response.json();

                    setQuote(data);
                } else if (response.status === 404) {
                    setMessage(`Quote ${quoteId} not found`);
                } else {
                    const messageText = `HTTP error: Status: ${response.status}`;

                    setMessage(messageText);
                    console.error(messageText);
                }
            } catch (e) {
                console.error(e);
            }
        };

        fetchQuote();
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>
                    Quote ID:
                    <input
                        type="text"
                        value={quoteId}
                        onChange={(e) => setQuoteId(e.target.value)}
                    />
                </label>
                <button type="submit">Find</button>
            </form>
            { quote ? (
                <p>{quote.value.text}</p>
            ) : (
                message ? (
                    <p>{message}</p>
                ) : (
                    <p/>)
            )
            }
        </div>
    );
};

export default QuoteFinder;