// AccountDetails.jsx
import React from 'react';

const DetailsTag = ({ details }) => {
    return (
        <div className="bg-gray-50 p-4 rounded-lg shadow-md">
            {Object.keys(details).map((key) => (
                <div key={key} className="text-gray-500 font-medium mb-1">
                    <span className="font-semibold text-gray-700">{key}:</span>{" "}
                    {key === "Jira Base URL" ? (
                        <a
                            href={details[key]}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-slate-950 underline hover:text-slate-600"
                        >
                            {details[key]}
                        </a>
                    ) : (
                        <span className="text-gray-600">{details[key]}</span>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DetailsTag;
