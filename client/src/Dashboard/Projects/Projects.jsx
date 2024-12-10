import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../../components/Table.jsx';
import DetailsTag from '../../components/DeatilsTag.jsx';

export default function Projects() {
    const [accountData, setAccountData] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/jira/getJiraAccountData`);
                setAccountData(response.data.jiraAccountData);
            } catch (error) {
                console.error("Error fetching Jira account data:", error);
            }
        };
        fetchData();
    }, []);

    if (!accountData) return <div className="text-center mt-10 text-slate-950 font-semibold">Loading...</div>;

    const accountDetails = {
        Title: accountData.title,
        "Jira Base URL": accountData.jira_base_url,
        "Jira Email": accountData.jira_email
    };

    const columns = [
        { header: 'Key', key: 'key' },
        { header: 'Name', key: 'name' },
        { header: 'Project Type Key', key: 'projectTypeKey' },
    ];

    return (
        <div className="p-8 min-h-[90vh] bg-white">
            <div className="flex justify-between items-center mb-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Projects</h1>
                    <p className="text-gray-600">Details of the projects connected to our Platform</p>
                </header>
                <DetailsTag details={accountDetails} />
            </div>

            <div className="mt-8 bg-white p-6 rounded-lg shadow-md ">
                <Table columns={columns} data={accountData.projects} />
            </div>
        </div>
    );
}
