import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from './Table';

export default function ResponseView({ viewType, issueKey }) {
    console.log("View Type: ", viewType);
    console.log("Issue Key (Project Key): ", issueKey);

    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/jira/getJiraAccountData`);
                const accountData = response.data.jiraAccountData;
                if (viewType.toLowerCase() === 'project') {
                    const projectColumns = [
                        { header: 'Key', key: 'key' },
                        { header: 'Name', key: 'name' },
                        { header: 'Project Type Key', key: 'projectTypeKey' },
                        { header: 'Entity ID', key: 'entityId' },
                        { header: 'UUID', key: 'uuid' },
                    ];
                    setColumns(projectColumns);
                    setData(accountData.projects || []);
                } else if (viewType.toLowerCase() === 'issue') {
                    const issueColumns = [
                        { header: 'Key', key: 'key' },
                        { header: 'Summary', key: 'summary' },
                        { header: 'Status', key: 'status' },
                        { header: 'Assignee', key: 'assignee' },
                        { header: 'Reporter', key: 'reporter' },
                    ];
                    setColumns(issueColumns);
                    const matchingProject = accountData.projects.find(project => project.key === issueKey);

                    if (matchingProject && matchingProject.issues) {
                        const issuesData = matchingProject.issues.map(issue => ({
                            id: issue.id,
                            key: issue.key,
                            summary: issue.summary,
                            status: issue.status,
                            assignee: issue.assignee || 'Unassigned',
                            reporter: issue.reporter || 'Unknown',
                        }));
                        setData(issuesData);
                    } else {
                        setData([]);
                    }
                } else if (viewType.toLowerCase() === 'issues') {
                    const issuesColumns = [
                        { header: 'Key', key: 'key' },
                        { header: 'Summary', key: 'summary' },
                        { header: 'Status', key: 'status' },
                        { header: 'Assignee', key: 'assignee' },
                        { header: 'Reporter', key: 'reporter' },
                    ];
                    setColumns(issuesColumns);
                    const allIssues = accountData.projects.flatMap(project => project.issues || []).map(issue => ({
                        id: issue.id,
                        key: issue.key,
                        summary: issue.summary,
                        status: issue.status,
                        assignee: issue.assignee || 'Unassigned',
                        reporter: issue.reporter || 'Unknown',
                    }));

                    setData(allIssues);
                }
                else if (viewType.toLowerCase() === 'users') {
                    const userColumns = [
                        { header: 'Account Type', key: 'accountType' },
                        { header: 'Display Name', key: 'displayName' },
                        { header: 'Email Address', key: 'emailAddress' },
                    ];
                    setColumns(userColumns);
                    setData(accountData.users || []);
                }
                else {
                    setData([]);
                }

                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setLoading(false);
            }
        };
        fetchData();
    }, [viewType, issueKey]);

    if (loading) return <div className="text-center mt-10 text-slate-950 font-semibold">Loading...</div>;
    if (data.length === 0) return <div className="text-center mt-10 text-red-600 font-semibold">No data available</div>;

    return (
        <div className="p-8 bg-white">
            <Table columns={columns} data={data} />
        </div>
    );
}
