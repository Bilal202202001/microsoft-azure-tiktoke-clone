
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/users.model.js';
import { createJWT, verifyJWT } from '../middleware/auth.middleware.js';
import jiraAccountModel from '../models/jiraAcounts.model.js';
import { encrypt, decrypt } from '../utils/encryption-decryption.js';
import axios from 'axios';

const JiraAccountController = {
    connectJira: async (body, token) => {
        try {
            const { title, jira_base_url, jira_email, jira_api_token,openai_key } = body;
            const decodedToken = await verifyJWT(token);
            const userId = decodedToken.id;
            const user = await userModel.findOne({ _id: userId });

            if (!user) {
                return { error: true, message: 'User not found' };
            }
            const jiraAccount = {
                userId,
                title,
                jira_base_url,
                jira_email,
                jira_api_token: encrypt(jira_api_token),
                openai_key: encrypt(openai_key),
                users: [],
                projects: [],
                issues: [],
            };
            const jiraAccountExists = await jiraAccountModel.findOne({ userId });
            if (jiraAccountExists) {
                return { error: true, message: 'Jira account already exists' };
            }
            const newJiraAccount = new jiraAccountModel(jiraAccount);
            await newJiraAccount.save();
            await fetchUsers(jira_base_url, jira_email, jira_api_token, newJiraAccount);
            await fetchProjects(jira_base_url, jira_email, jira_api_token, newJiraAccount);
            await fetchIssues(jira_base_url, jira_email, jira_api_token, newJiraAccount);
            return { success: true, message: 'Jira account created successfully' };
        } catch (error) {
            console.error(error);
            return { error: true, message: 'Internal server error' };
        }
    }
    ,
    getConnectedAccounts: async (token) => {
        try {
            const decodedToken = await verifyJWT(token);
            const userId = decodedToken.id;
            const user = await userModel.findOne({ _id: userId });
            if (!user) {
                return { error: true, message: 'User not found' };
            }
            const jiraAccount = await jiraAccountModel.find({ userId: userId }, 'title jira_base_url jira_email timestamp jira_api_token openai_key');
            jiraAccount[0].jira_api_token = decrypt(jiraAccount[0].jira_api_token);
            jiraAccount[0].openai_key = decrypt(jiraAccount[0].openai_key);

            return { success: true, jiraAccount: jiraAccount };
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
    getJiraAccountData: async (token) => {
        try {
            const decodedToken = await verifyJWT(token);
            const userId = decodedToken.id;
            const user = await userModel.findOne({ _id: userId });
            if (!user) {
                return { error: true, message: 'User not found' };
            }
            const jiraAccountCheck = await jiraAccountModel.findOne({ userId: userId }, 'title jira_base_url jira_email jira_api_token ');
            if (!jiraAccountCheck) {
                return { error: true, message: 'Jira account not found' };
            }
            jiraAccountCheck.users = [];
            jiraAccountCheck.projects = [];
            const users = await fetchUsers(jiraAccountCheck.jira_base_url, jiraAccountCheck.jira_email, decrypt(jiraAccountCheck.jira_api_token), jiraAccountCheck);
            const projects = await fetchProjects(jiraAccountCheck.jira_base_url, jiraAccountCheck.jira_email, decrypt(jiraAccountCheck.jira_api_token), jiraAccountCheck);
            const jiraAccountData = await jiraAccountModel.findOne({ userId: userId }, 'title jira_base_url jira_email timestamp users projects issues');
            return { success: true, jiraAccountData: jiraAccountData };
        } catch (error) {
            console.error(error);
            return { error: true, message: 'Internal server error' };
        }
    },
    updateJiraData: async (body, token) => {
        try {
            const decodedToken = await verifyJWT(token);
            const userId = decodedToken.id;
            const user = await userModel.findOne({ _id: userId });
            if (!user) {
                return { error: true, message: 'User not found' };
            }
            const jiraAccount = await jiraAccountModel.findOne({ userId: userId });
            if (!jiraAccount) {
                return { error: true, message: 'Jira account not found' };
            }
            const { title, jira_base_url, jira_email, jira_api_token,openai_key } = body;
            jiraAccount.title = title;
            jiraAccount.jira_base_url = jira_base_url;
            jiraAccount.jira_email = jira_email;
            jiraAccount.jira_api_token = encrypt(jira_api_token);
            jiraAccount.openai_key = encrypt(openai_key);
            jiraAccount.timestamp = Date.now();
            jiraAccount.users = [];
            jiraAccount.projects = [];
            await jiraAccount.save();
            return { success: true, message: 'Jira account updated successfully' };
        } catch (error) {
            console.error(error);
            return { error: true, message: 'Internal server error' };
        }
    }
}
const fetchUsers = async (jira_base_url, jira_email, jira_api_token, jiraAccount) => {
    try {
        const response = await axios.get(`${jira_base_url}/rest/api/3/users/search`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${jira_email}:${jira_api_token}`).toString('base64')}`,
                'Accept': 'application/json',
            }
        });

        if (response.data && Array.isArray(response.data)) { 
        if (!Array.isArray(jiraAccount.users)) {
            jiraAccount.users = [];
        }

        const newUsers = response.data
            .map(user => ({
                accountId: user.accountId,
                accountType: user.accountType,
                displayName: user.displayName,
                emailAddress: user.emailAddress,
            }))
            .filter(newUser => !jiraAccount.users.some(existingUser => existingUser.accountId === newUser.accountId));

        if (newUsers.length > 0) {
            jiraAccount.users = jiraAccount.users.concat(newUsers);
            await jiraAccount.save();
        }
    }
    } catch (error) {
    console.error("Error fetching Jira users:", error);
}
};

const fetchProjects = async (jira_base_url, jira_email, jira_api_token, jiraAccount) => {
    try {
        const response = await axios.get(`${jira_base_url}/rest/api/3/project`, {
            headers: {
                'Authorization': `Basic ${Buffer.from(`${jira_email}:${jira_api_token}`).toString('base64')}`,
                'Accept': 'application/json',
            },
            timeout: 30000
        });

        if (response.data && Array.isArray(response.data)) {
            if (!Array.isArray(jiraAccount.projects)) {
                jiraAccount.projects = [];
            }

            const projectsWithIssues = await Promise.all(
                response.data.map(async (project) => {
                    // console.log(project.key, "project.key");

                    try {
                        // Fetch issue types
                        const issueTypesResponse = await axios.get(`${jira_base_url}/rest/api/3/issuetype/project?projectId=${project.id}`, {
                            headers: {
                                'Authorization': `Basic ${Buffer.from(`${jira_email}:${jira_api_token}`).toString('base64')}`,
                                'Accept': 'application/json',
                            },
                            timeout: 30000
                        });
                        const issueTypes = issueTypesResponse.data.map(issueType => ({
                            id: issueType.id,
                            name: issueType.name,
                            description: issueType.description
                        }));

                        // Fetch issues for the project
                        const issuesResponse = await axios.get(`${jira_base_url}/rest/api/3/search?jql=project=${project.key}`, {
                            headers: {
                                'Authorization': `Basic ${Buffer.from(`${jira_email}:${jira_api_token}`).toString('base64')}`,
                                'Accept': 'application/json',
                            },
                            timeout: 30000
                        });

                        const issues = issuesResponse.data.issues.map(issue => ({
                            id: issue.id,
                            key: issue.key,
                            summary: issue.fields.summary,
                            status: issue.fields.status.name,
                            assignee: issue.fields.assignee ? issue.fields.assignee.displayName : 'Unassigned',
                            reporter: issue.fields.reporter ? issue.fields.reporter.displayName : 'Unknown',
                        }));

                        return {
                            id: project.id,
                            key: project.key,
                            name: project.name,
                            projectTypeKey: project.projectTypeKey,
                            entityId: project.entityId,
                            uuid: project.uuid,
                            issueTypes: issueTypes,
                            issues: issues,
                        };
                    } catch (error) {
                        console.error(`Error fetching data for project ${project.key}:`, error.response ? error.response.data : error.message);
                        return null;
                    }
                })
            );

            // Filter out null projects (those with errors)
            const validProjects = projectsWithIssues.filter(project => project !== null);

            const newProjects = validProjects.filter(newProject =>
                !jiraAccount.projects.some(existingProject => existingProject.id === newProject.id)
            );

            if (newProjects.length > 0) {
                jiraAccount.projects = jiraAccount.projects.concat(newProjects);
                await jiraAccount.save();
            }
        }
    } catch (error) {
        console.error("Error fetching Jira projects:", error.response ? error.response.data : error.message);
    }
};



const fetchIssues = async (jira_base_url, jira_email, jira_api_token, jiraAccount) => {
    try {

        const response = await axios.get(`${jira_base_url}/rest/api/3/search?jql=project=${project.key}`, bodyData, {
            headers: {
                'Accept': 'application/json',
                'Authorization': `Basic ${Buffer.from(`${jira_email}:${jira_api_token}`).toString('base64')}`
            }
        });

        if (response.data && response.data.issues) {

            const newIssues = response.data.issues.map(issue => ({
                issueId: issue.id,
                key: issue.key,
                fields: {
                    summary: issue.fields.summary,
                    project: {
                        id: issue.fields.project.id,
                        key: issue.fields.project.key,
                        name: issue.fields.project.name,
                        projectTypeKey: issue.fields.project.projectTypeKey,
                    },
                    assignee: issue.fields.assignee ? {
                        accountId: issue.fields.assignee.accountId,
                        displayName: issue.fields.assignee.displayName,
                        emailAddress: issue.fields.assignee.emailAddress,
                    } : null
                }
            }));

            jiraAccount.issues = jiraAccount.issues || [];
            const existingIssueIds = new Set(jiraAccount.issues.map(issue => issue.issueId));
            const uniqueIssues = newIssues.filter(issue => !existingIssueIds.has(issue.issueId));
            jiraAccount.issues = jiraAccount.issues.concat(uniqueIssues);
            await jiraAccount.save();
            // console.log("Issues saved successfully.");
        } else {
            console.log("No issues found in the response.");
        }
    } catch (error) {
        console.error("Error fetching Jira issues:", error);
    }
};
// const fetchAllProjectTemplates = async (jira_base_url, jira_email, jira_api_token, jiraAccount) => {
//     try {
//         const response = await axios.get(`${jira_base_url}/rest/api/3/project/templates`, {
//             headers: {
//                 'Accept': 'application/json',
//                 'Authorization': `Basic ${Buffer.from(`${jira_email}:${jira_api_token}`).toString('base64')}`
//             }
//         });

//         console.log(response.data);
//     } catch (error) {
//         console.error("Error fetching all project templates:", error);
//     }
// };

export default JiraAccountController;