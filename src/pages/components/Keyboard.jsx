import React from 'react';

const Keyboard = ({ onKeyPress, onBackspace, onSubmit }) => {
    const rows = [
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        ['@', '.', '-', '_'],
    ];

    return (
        <div className="virtual-keyboard">
            {rows.map((row, rowIndex) => (
                <div className="keyboard-row" key={`row-${rowIndex}`}>
                    {row.map((key) => (
                        <button
                            key={key}
                            onClick={() => onKeyPress(key)}
                            className="key-button"
                        >
                            {key}
                        </button>
                    ))}
                </div>
            ))}
            <div className="keyboard-row">
                <button onClick={onBackspace} className="key-button wide">⌫</button>
                <button onClick={onSubmit} className="key-button wide">Enter</button>
            </div>

            <style>{`
                .virtual-keyboard {
                    position: fixed;
                    bottom: 0;
                    left: 0;
                    width: 100%;
                    background: #f9f9f9;
                    padding: 10px;
                    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.15);
                    z-index: 1000;
                }

                .keyboard-row {
                    display: flex;
                    justify-content: center;
                    margin-bottom: 6px;
                }

                .key-button {
                    margin: 2px;
                    padding: 12px 16px;
                    font-size: 1rem;
                    background-color: #fff;
                    border: 1px solid #ccc;
                    border-radius: 6px;
                    cursor: pointer;
                    transition: background 0.2s ease;
                    min-width: 40px;
                    text-align: center;
                    user-select: none;
                }

                .key-button:hover {
                    background-color: #e0e0e0;
                }

                .key-button.wide {
                    flex: 1;
                    max-width: 150px;
                }

                @media (max-width: 600px) {
                    .key-button {
                        padding: 10px 12px;
                        font-size: 0.9rem;
                    }

                    .key-button.wide {
                        max-width: 120px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Keyboard;
