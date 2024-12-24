
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userModel from '../models/users.model.js';
import { createJWT, verifyJWT } from '../middleware/auth.middleware.js';
import jiraAccountModel from '../models/jiraAcounts.model.js';
import { encrypt, decrypt } from '../utils/encryption-decryption.js';
import axios from 'axios';

const VideoController = {
    connectJira: async (body, token) => {
        try {
            const { title, jira_base_url, jira_email, jira_api_token, openai_key } = body;
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
}

export default VideoController;