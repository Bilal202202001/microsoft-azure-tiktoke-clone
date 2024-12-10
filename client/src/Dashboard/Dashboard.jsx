import React from 'react';

export default function Foryou() {
    return (
        <div className="p-8 min-h-[90vh] bg-white">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-600">Convert natural language queries into JIRA routes with ease.</p>
            </header>


            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Total Queries Processed</h2>
                    <p className="text-4xl font-bold text-red-500">1,024</p>
                    <p className="text-gray-500 mt-1">Since last month</p>
                </div>


                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Success Rate</h2>
                    <p className="text-4xl font-bold text-green-500">98%</p>
                    <p className="text-gray-500 mt-1">Based on recent queries</p>
                </div>


                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Average Query Time</h2>
                    <p className="text-4xl font-bold text-yellow-600">2.1s</p>
                    <p className="text-gray-500 mt-1">Across all endpoints</p>
                </div>
            </div>


            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">


                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Start Guide</h2>
                    <ul className="text-gray-600 space-y-3">
                        <li>
                            <span className="font-semibold">1.</span> Start by entering your query in natural language.
                        </li>
                        <li>
                            <span className="font-semibold">2.</span> Our AI converts it to the corresponding JIRA API route.
                        </li>
                        <li>
                            <span className="font-semibold">3.</span> Get an endpoint response within seconds.
                        </li>
                        <li>
                            <span className="font-semibold">4.</span> Track progress in the "Recent Queries" section.
                        </li>
                    </ul>
                    <a
                        href="/jira/haab"
                        className="block w-full text-center mt-6 py-2 bg-slate-950 text-white font-semibold rounded-md shadow-md hover:bg-slate-700 transition"
                    >
                        Get Started
                    </a>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-xl font-semibold text-gray-700 mb-4">Recent Queries</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between text-gray-600">
                            <span>Retrieve project details by name</span>
                            <span className="text-gray-400">12 mins ago</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>List all issues in project ABC</span>
                            <span className="text-gray-400">24 mins ago</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Get user details by email</span>
                            <span className="text-gray-400">1 hr ago</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                            <span>Fetch sprint data for team XYZ</span>
                            <span className="text-gray-400">2 hrs ago</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
