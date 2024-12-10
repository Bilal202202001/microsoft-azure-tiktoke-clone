// Table.jsx
import React from 'react';

const Table = ({ columns, data }) => {
    return (
        <div className="overflow-x-auto"> {/* Allow horizontal scrolling */}
            <table className="min-w-full border border-gray-300">
                <thead>
                    <tr>
                        {columns.map((column, index) => (
                            <th
                                key={column.key}
                                className={`p-4 text-left bg-slate-950 text-white ${
                                    index === 0 ? 'rounded-l-lg' : '' // Left corner
                                } ${
                                    index === columns.length - 1 ? 'rounded-r-lg' : '' // Right corner
                                }`}
                            >
                                {column.header}
                            </th>
                        ))}
                    </tr>
                </thead>
            </table>

            <div className="h-[50vh] overflow-y-auto"> {/* Set height and allow vertical scrolling for the body */}
                <table className="min-w-full border border-gray-300">
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex} className="border-b text-center">
                                {columns.map((column) => (
                                    <td key={column.key} className="p-4 text-gray-700 capitalize">
                                        {row[column.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;
