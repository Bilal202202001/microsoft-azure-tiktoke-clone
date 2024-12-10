import mongoose from "mongoose";

const jiraAccountsSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData"
    },
    title: String,
    jira_base_url: String,
    jira_email: String,
    jira_api_token: String,
    openai_key: String,
    users: {
        type: [
            {
                accountId: String,
                accountType: String,
                displayName: String,
                emailAddress: String,
            }
        ]
    },
    projects: [{
        id: String,
        key: String,
        name: String,
        projectTypeKey: String,
        entityId: String,
        uuid: String,
        issueTypes: [{
            id: String,
            name: String,
            description: String,
        }],
        issues: [{
            id: String,
            key: String,
            summary: String,
            status: String,
            assignee: String,
            reporter: String,
        }]
    }]
    ,
    issues: {
        type: [
            {
                issueId: String,
                key: String,
                fields: {
                    summary: String,
                    project: {
                        id: String,
                        key: String,
                        name: String,
                        projectTypeKey: String,
                    },
                    assignee: {
                        accountId: String,
                        displayName: String,
                        emailAddress: String,
                    }
                },
            }
        ]
    },
    timestamp: { type: Date, default: Date.now },

});

const jiraAccountModel = mongoose.model("JiraAccount", jiraAccountsSchema);
export default jiraAccountModel;