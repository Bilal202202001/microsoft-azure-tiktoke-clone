import React, { useEffect, useState } from 'react';
import InputField from '../../components/InputField';
import Modal from '../../components/Modal';
import axios from 'axios';

axios.defaults.withCredentials = true;

const CredentialsPage = () => {
    const baseInputs = [
        {
            type: 'text',
            name: 'title',
            label: 'Account Title',
            placeholder: 'Enter Title',
            required: true,
        },
        {
            type: 'text',
            name: 'jira_base_url',
            label: 'Jira Base URL',
            placeholder: 'Enter Jira Base URL',
            required: true,
        },
        {
            type: 'email',
            name: 'jira_email',
            label: 'Jira Email',
            placeholder: 'Enter Jira Email',
            required: true,
        },
        {
            type: 'text',
            name: 'jira_api_token',
            label: 'Jira API Token',
            placeholder: 'Enter Jira API Token',
            required: true,
        },
        {
            type: 'text',
            name: 'openai_key',
            label: 'OpenAI Key',
            placeholder: 'Enter Open-AI Key',
            required: true,
        },
        {
            type: 'button',
            name: 'Connect',
        },
    ];
    const baseInputsEdit = [
        {
            type: 'text',
            name: 'title',
            label: 'Account Title',
            placeholder: 'Enter Title',
            required: true,
        },
        {
            type: 'text',
            name: 'jira_base_url',
            label: 'Jira Base URL',
            placeholder: 'Enter Jira Base URL',
            required: true,
        },
        {
            type: 'email',
            name: 'jira_email',
            label: 'Jira Email',
            placeholder: 'Enter Jira Email',
            required: true,
        },
        {
            type: 'text',
            name: 'jira_api_token',
            label: 'Jira API Token',
            placeholder: 'Enter Jira API Token',
            required: true,
        },
        {
            type: 'text',
            name: 'openai_key',
            label: 'OpenAI Key',
            placeholder: 'Enter Open-AI Key',
            required: true,
        },
        {
            type: 'button',
            name: 'Update',
        },
    ];

    const [accounts, setAccounts] = useState([]);

    const getConnectedAccounts = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_APP_BACKEND_URL}/jira/getConnectedAccounts`);
            console.log(response.data.jiraAccount);
            setAccounts(response.data.jiraAccount || []);
        } catch (error) {
            console.error("Error fetching connected accounts:", error);
        }
    };

    const handleResponse = () => {
        getConnectedAccounts();
    };

    useEffect(() => {
        getConnectedAccounts();
    }, []);

    return (
        <div className="p-8 min-h-[90vh] bg-white">
            <div className="flex justify-between items-center mb-8">
                <header className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-800">Jira Credentials</h1>
                    <p className="text-gray-600">Connect the Jira Accounts</p>
                </header>
                {
                    accounts.length == 0 && (
                        <Modal
                            buttonLabel="Add Jira Account"
                            url="jira/connectJira"
                            method="POST"
                            inputs={baseInputs}
                            heading="Connect Jira Account"

                            handleResponse={handleResponse}
                        />
                    )
                }
            </div>

            <div className="mt-6 w-full">
                <h2 className="text-2xl font-semibold mb-4 text-center">Connected Jira Accounts</h2>
                {accounts.length > 0 ? (
                    <div className="flex flex-wrap justify-start">
                        {accounts.map((account, index) => (
                            <div key={index} className="border border-gray-300 px-4 py-6 m-2 rounded-lg shadow w-1/4 min-w-[250px]">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-semibold">{account.title}</h3>
                                    <Modal
                                        buttonLabel="View Credentials"
                                        url="jira/updateJiraData"
                                        method="PUT"
                                        inputs={baseInputsEdit.map(input => ({
                                            ...input,
                                            value: account[input.name],
                                        }))}
                                        heading="Edit Jira Account"
                                        handleResponse={handleResponse}
                                    />
                                </div>
                                <p className="text-sm text-gray-700"><strong>Email:</strong> {account.jira_email}</p>
                                <p className="text-sm text-gray-700">
                                    <strong>Jira Base URL:</strong>
                                    <a href={account.jira_base_url} className='text-slate-950 font-semibold' target="_blank" rel="noopener noreferrer"> Visit JIRA URL</a>
                                </p>
                                <p className="text-sm text-gray-700">
                                    <strong>Connected At:</strong> {new Date(account.timestamp).toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: '2-digit',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                    })}
                                </p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center border px-4 py-2">
                        <p className="text-lg font-semibold">No accounts connected.</p>
                    </div>
                )}
            </div>
        </div>

    );
};

export default CredentialsPage;
