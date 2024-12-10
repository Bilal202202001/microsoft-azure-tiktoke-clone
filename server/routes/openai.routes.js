import express from 'express';
import upload from "../middleware/multer.js"
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import { OpenAI } from 'openai';
import axios from 'axios';
import jiraAccountModel from '../models/jiraAcounts.model.js';
import { encrypt, decrypt } from '../utils/encryption-decryption.js';
import JiraAccountController from '../controllers/jira.controller.js';
import { verifyJWT } from '../middleware/auth.middleware.js';

const router = express.Router();
dotenv.config();
router.use(bodyParser.json());




let JIRA_BASE_URL;
let JIRA_EMAIL;
let JIRA_API_TOKEN;
let openai;
router.post("/convert-query", upload.none(), async (req, res) => {
    const { query } = req.body;
    const token = req.cookies.token;
    await JiraAccountController.getJiraAccountData(token);
    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }
    try {
        const user = await verifyJWT(token);
        const userId = user.id;
        const account = await jiraAccountModel.find({ userId: userId });

        openai = new OpenAI({
            apiKey: decrypt(account[0].openai_key),
        });

        JIRA_BASE_URL = account[0].jira_base_url;
        JIRA_EMAIL = account[0].jira_email;
        JIRA_API_TOKEN = decrypt(account[0].jira_api_token);

        const operations = await convertToJQL(query);
        // const operations = [
        //     {
        //         Method: 'POST',
        //         API_URL: '/rest/api/3/project',
        //         Parameters: {
        //             key: 'DEMOTR',
        //             name: 'Demo TR',
        //             leadAccountId: 'Haab.dev',
        //             projectTypeKey: 'software',
        //             projectTemplateKey: 'com.atlassian.jira-core-project-templates:jira-core-project-template'
        //         },
        //         ViewToLoad: 'project'
        //     }
        // ]
        const jiraInstance = axios.create({
            baseURL: JIRA_BASE_URL,
            headers: {
                Authorization: `Basic ${Buffer.from(`${JIRA_EMAIL}:${JIRA_API_TOKEN}`).toString('base64')}`,
                'Content-Type': 'application/json'
            }
        });

        const results = await executeJiraOperations(jiraInstance, operations, query, userId);
        res.status(200).json({
            message: "JIRA operations performed successfully.",
            results: results
        });
    } catch (error) {
        console.error('Error processing query:', error);
        res.status(500).json({ error: "Failed to process query" });
    }
});
const convertToJQL = async (query, retries = 3) => {
    try {
        let prompt = `
        Analyze and convert the following detailed natural language query into multiple JIRA API requests in JSON format  
        Each distinct task should be converted into a separate API call in the format shown below.
        Provide all bodyData that are mentioned in jira rest api routes documentation. 
        In case if we require the id,accountId, projectId, issueId, issueKey for body paramters so dont provide the seperate route to search its value just simply create a variable in body paramters and write this type of text in value of that variable i.e 
        'accountId: "name or email of user from natural query",
        projectId: "name of project from natural query",
        issueId: "name of issue from natural query",
        issueKey: "name of issue from natural query",
        assignee: {
            id: "email or name of assignee from natural query,dont assign varibale as accountID",
        }
        issue: {
            id: "id or name or key of the issue from natural query",
        }
        Dont include any other text in the response.Just return the JSON object
        Add query parameters with ? in the api route if needed(not every time , exceptional cases like ?accountId).
        In case if we have to use the old response so in the parameters mention that parameters value with exactly the same thing we will recieve from the response of older route in a way response.data.'exact parameter name'
        Don't use the older response in any case
        provide all parameters in the request body without which api wouldn't execute properly
        Dont add these paramter in body if not exact values provided[ avatarId,issueSecurityScheme,permissionScheme,notificationScheme,categoryId]
        Add issuetype with id always if provided the name of issueType or type of issueType and create parameter as issuetype:{id:""}
        Provide the required exact parameters format in case of time format like this format rest/api/3/search?jql=assignee=haab.dev AND updated >= -1w
       Completely fill up the search params as per required by JIRA docs for rest apis
        To create the description for creating issue:
        "description": {
      "type": "doc",
      "version": 1,
      "content": [
        {
          "type": "paragraph",
          "content": [
            {
              "text": "description text",
              "type": "text"
            }
          ]
        }
      ]
    }
create user:
    "applicationRoles": [
        {
        "key" : "..."},
        ...
    ],

   To create Issue Type : {
   {
    "Method": "POST",
    "API_URL": "/rest/api/3/issuetype",
    "Parameters": {
      "name": "name of issue type",
      "description": "description of issue type",
      "type": "standard as default if not provided or else use from natural query"
    },
  }
    }

    To create a project : {
    {
    "Method": "POST",
    "API_URL": "/rest/api/3/project",
    "Parameters": {
      "key": "key of project from natural query",
      "name": "name of project from natural query",
      "leadAccountId": "name or email of user from natural query",
      "projectTypeKey": "use from natural query",
      "projectTemplateKey": "search for the projectTypeKey provided from jira rest api documentation for the one provided in natural query"
    }
  }
    }
    
        Query: "${query}"
        
        Expected response format for multiple tasks:
        [
            {
                "Method": "HTTP_METHOD",
                "API_URL": "/rest/api/path",
                "Parameters": {
                    "key1": "value1",
                    "key2": "value2"
                },
                "ViewToLoad": "name of main entity being interacted in case of delete , create or update anything like issues,projects,users etc"
            },
            {
                "Method": "HTTP_METHOD",
                "API_URL": "/rest/api/another_path",
                "Parameters": {
                    "key1": "value1",
                    "key2": "value2"
                },
                "ViewToLoad": "name of main entity being interacted in case of delete , create or update anything like issues,projects,users etc"
            }
        ]
        
        If only one task is detected, format the response as a single JSON object.
        
        `;
        const response = await openai.chat.completions.create({
            model: "gpt-4",
            messages: [
                { role: "system", content: knowledgeBase },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.2,
        });

        const jsonText = response.choices[0].message.content
            .replace(/```json/g, '')
            .replace(/```/g, '')
            .trim();

        const jsonMatch = jsonText.match(/(\[.*\]|\{.*\})/s);
        if (!jsonMatch) throw new Error("No JSON found in response");

        const operations = JSON.parse(jsonMatch[0]);
        return Array.isArray(operations) ? operations : [operations];

    } catch (error) {
        console.error("Error generating JQL or Jira operation:", error.message);
        console.error("Response Content:", jsonText || "No content received");
        throw new Error("Failed to convert query");
    }
};

const provideMessageResponse = async (data, query, retries = 3) => {
    // console.log(data);

    try {
        let prompt = `Here is the data: ${JSON.stringify(data)}
        "Use the following query: ${query}
            I will provide JSON data. Analyze the provided data and respond dynamically based on its structure. Follow these rules strictly:

            If the data contains activities, issues, or assignments for users:

            Start by explaining what the user or assignee was doing in the given timeframe (e.g., 'The assignee in [timeframe] was ...').
            Identify and list all issues assigned to the user with their names and any updates or technical details, if available.
            For utilization:

            Check if the issues in the data have a due date:
            If any single issue has a due date, mark the assignee as busy (not underutilized).
            If all issues lack due dates or no issues are provided, the assignee is underutilized.
            List the names of underutilized assignees.
            For project-related issues:

            Return relevant details about the issues, such as their names, updates, and any technical details included in the data.
            Do not link the issues to any previous context or response.
            Response Rules:

            Always respond in a conversational manner, as if chatting directly.
            Do not include generic phrases like 'Based on the provided data' or 'The data shows.'
            Use only the provided JSON data to formulate your response.
            Be concise, clear, and direct without using headings, bullet points, or redundant statements."

       `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: prompt }
            ],
            max_tokens: 500,
            temperature: 0.2,
        });

        const messageResponse = response.choices[0].message.content.trim();
        // console.log("Message Response: ", messageResponse);

        return messageResponse;

    } catch (error) {
        console.error("Error processing the query:", error.message);
        throw new Error("Failed to process the query");
    }
};
const findAndLogAccountId = async (obj, key, userId) => {
    const jiraAccountDetails = await jiraAccountModel.findOne({ userId: userId }, 'users');
    const userField = obj[key];
    // console.log("User Field : ", userField);
    if (userField.includes('@')) {
        console.log('User by Email:', userField);

        const users = jiraAccountDetails.users.filter(user => user.emailAddress === userField.toLowerCase());
        if (users.length > 0) {
            // console.log('User by Email (Case Insensitive):', users[0].accountId);
            obj[key] = users[0].accountId;
        }
    } else {
        const users = jiraAccountDetails.users.filter(user => user.displayName.toLowerCase() === userField.toLowerCase());
        if (users.length > 0) {
            // console.log('User by DisplayName (Case Insensitive):', users[0].accountId);
            obj[key] = users[0].accountId;
        }
    }
};

const findAndLogProjectID = async (obj, key, type, userId) => {
    const jiraAccountDetails = await jiraAccountModel.findOne({ userId: userId }, 'projects');
    const userField = obj[key];
    if (type === 'key') {
        let project = jiraAccountDetails.projects.filter(project => project.key === userField.toLowerCase());
        if (project.length > 0) {
            // console.log('Project by Key (Case Insensitive):', project[0].id);
            obj[key] = project[0].key;
        } else {
            project = jiraAccountDetails.projects.filter(project => project.name.toLowerCase() === userField.toLowerCase());
            if (project.length > 0) {
                // console.log('Project by Name (Case Insensitive):', project[0].key);
                obj[key] = project[0].key;
            }
            else {
                console.log('Project not found');
            }
        }

    } else {
        let project = jiraAccountDetails.projects.filter(project => project.key === userField.toLowerCase());
        if (project.length > 0) {
            // console.log('Project by Key (Case Insensitive):', project[0].id);
            obj[key] = project[0].id;
        } else {
            project = jiraAccountDetails.projects.filter(project => project.name.toLowerCase() === userField.toLowerCase());
            if (project.length > 0) {
                // console.log('Project by Name (Case Insensitive):', project[0].id);
                obj[key] = project[0].id;
            }
            else {
                console.log('Project not found');
            }
        }
    }
};

const findAndLogIssueID = async (obj, key, userId) => {
    const jiraAccountDetails = await jiraAccountModel.findOne({ userId: userId }, 'issues');
    const userField = obj[key];
    const issue = jiraAccountDetails.issues.filter(issue => issue.key === userField.toLowerCase());
    if (issue.length > 0) {
        // console.log('Issue by Key (Case Insensitive):', issue[0].id);
        obj[key] = issue[0].id;
    } else {
        console.log('Issue not found');
    }
};

const processNestedIssueId = async (obj, key, ALL, userId) => {
    const userField = obj[key];
    const jiraAccountDetails = await jiraAccountModel.findOne({ userId: userId }, 'projects');
    let projects = [];
    if (ALL?.fields?.project?.key) {
        projects = jiraAccountDetails.projects.filter(project => project.key === ALL?.fields?.project?.key);
    }
    else if (ALL?.fields?.project?.id) {
        projects = jiraAccountDetails.projects.filter(project => project.id === ALL?.fields?.project?.id);
    }
    if (projects.length > 0) {
        const issueType = projects[0].issueTypes.filter(issueType => issueType.name === obj[key]);
        if (issueType.length > 0) {
            // console.log('Issue Type by ID (Case Insensitive):', issueType[0].id);
            obj[key] = issueType[0].id;
        }
        else {
            console.log('Issue Type not found');
        }
    }

};

const processParams = async (obj, ALL, userId) => {
    for (const key of Object.keys(obj)) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            if (key === 'assignee' || key === 'issuetype') {
                await processSpecialField(obj[key], key, ALL, userId);
            } else {
                await processParams(obj[key], ALL, userId);
            }
        } else {
            await handleField(obj, key, ALL, userId);
        }
    }
};

const processSpecialField = async (fieldObj, key, ALL, userId) => {
    switch (key) {
        case 'assignee':
            if (fieldObj && fieldObj.id) {
                await findAndLogAccountId(fieldObj, 'id', userId);
            }
            break;
        case 'issuetype':
            await processNestedIssueId(fieldObj, 'id', ALL, userId);

            break;
        default:
            break;
    }
};

const handleField = async (obj, key, ALL, userId) => {
    switch (key) {
        case 'leadAccountId':
        case 'accountId':
            await findAndLogAccountId(obj, key, userId);
            break;
        case 'projectId':
        case 'projectIdOrKey':
            await findAndLogProjectID(obj, key, 'id', userId);
            break;
        case 'projectKey':
            await findAndLogProjectID(obj, key, 'key', userId);
            break;
        case 'issueIdOrKey':
            await findAndLogIssueID(obj, key, userId);
            break;
        default:
            break;
    }
};


function isBaseRouteMatch(operation) {
    const urlsToCheck = [
        '/rest/api/3/search?jql',
    ];
    const operationBaseRoute = operation.API_URL.split('?')[0];
    return urlsToCheck.some(url => url.startsWith(operationBaseRoute));
}

const executeJiraOperations = async (jiraInstance, operations, query, userId) => {
    const results = [];
    for (const operation of operations) {
        try {
            if (!operation.Method || !operation.API_URL) {
                throw new Error("Operation missing necessary properties (Method or API_URL)");
            }
            await processParams(operation.Parameters, operation.Parameters, userId);
            // console.log("After Processing", operation.Parameters);
            const method = operation.Method.toLowerCase();
            const url = operation.API_URL;
            const data = operation.Parameters;

            const responseGot = await jiraInstance({
                method,
                url,
                data
            });

            console.log('JIRA Response:', responseGot.data);


            if (method === 'get') {
                const result = isBaseRouteMatch(operation);
                if (result === true) {
                    const getResponse = await provideMessageResponse(responseGot.data, query);
                    results.push({ success: true, data: getResponse });

                }
                else {
                    results.push({ success: true, data: responseGot.data, operation });
                }
            }
            else {
                results.push({ success: true, data: responseGot.data, operation });
            }


        } catch (error) {
            // console.error('Failed JIRA Operation:', error);
            console.error("Error data:", error.response?.data.errorMessages);
            results.push({ success: false, error: error.response?.data.errorMessages });
        }
    }
    return results;
};
const knowledgeBase = `
### Knowledge Base for a JIRA REST API Automation System Using OpenAI

#### **Project Overview**

The goal of this project is to seamlessly integrate OpenAI's natural language understanding capabilities with JIRA's REST API to facilitate intuitive issue and project management through natural language queries. Users can enter their requirements in simple spoken language, which the system will interpret to perform corresponding actions in JIRA, such as creating, updating, and retrieving issues or projects. This document serves as a comprehensive guide to the system's architecture, functionality, user interactions, and JIRA API integration.

---

#### **System Objectives**

1. **Natural Language Processing**: Utilize OpenAI to translate natural language queries into actionable JIRA API requests.
2. **Parameter Extraction and Validation**: Automatically extract and validate parameters from user input necessary for API requests.
3. **Interactive User Feedback**: Inform users about missing or required information to refine their queries.
4. **Complex Query Handling**: Process and execute multiple instructions contained within a single user query.
5. **JSON Responses**: Return structured JSON outputs detailing the REST API route, method, and parameters involved.

---

#### **System Architecture**

- **Frontend Interface**: Where users input their natural language queries.
- **OpenAI Model**:
- Analyzes the query to determine intent and extract entities like issue keys or project details.
- Matches intents to corresponding JIRA API endpoints and methods.
- Identifies and prompts for missing information.
- **Backend Service**:
- Validates and forwards the processed requests to the JIRA API.
- Retrieves responses from JIRA and formats them into JSON to send back to the frontend.
- **JIRA REST API**: The endpoint for all operations, handling tasks specified by the processed queries.

#### **Query Processing Flow**

- **Input**: "Change the priority of issue XYZ-123 to high."
- **Processing**: The model identifies "change priority" as the action, "XYZ-123" as the issue key, and "high" as the priority level.
- **API Call Generation**:
{
"Method": "PUT",
"Rest_API": "/rest/api/3/issue/XYZ-123",
"Required_Parameters": {
"fields": {
"priority": { "name": "high" }
}
}
}

#### **Handling Incomplete Queries**

When essential information is missing from the query, the system prompts the user to provide the necessary details:

- **Initial Query**: "Update the description of an issue."
- **System Response**:
{
"Message": "Please provide the issue ID or key and the new description."
}

#### **Supporting Complex Queries**

The system can decipher and separate multiple actions in a single query:

- **Input**: "Update the description and change the assignee of issue XYZ-123."
- **Output**:
[
{
"Method": "PUT",
"Rest_API": "/rest/api/3/issue/XYZ-123",
"Required_Parameters": {
"fields": {
  "description": "New description here"
}
}
},
{
"Method": "PUT",
"Rest_API": "/rest/api/3/issue/XYZ-123/assignee",
"Required_Parameters": {
"name": "new.assignee"
}
}
]

#### **API Endpoints and Use Cases**

A comprehensive mapping of user queries to JIRA API endpoints is provided, covering tasks from issue creation and modification to user and project management. Examples include:

- Creating issues.
- Retrieving and updating issue details.
- Managing project settings and components.
- Handling user roles and permissions.
- Conducting advanced searches using JQL.

---

#### **Development and Maintenance**

This knowledge base will be periodically updated to reflect changes in JIRA's API and enhancements in OpenAI's model capabilities. It serves as both a development guide and a reference for maintaining system accuracy and efficiency in translating user intentions into API actions.

---

This document outlines the structure and capabilities of the proposed system, ensuring that both developers and users understand the potential and operation of integrating OpenAI with JIRA's APIs.

`

export default router;


// //Recent_Prompt
// I want response as a chat reply from the openai for the query
// Use the ${query}
// Answer in a way that gpt is answerring itself like chatting app but keep information valid
// In case if query is related to give/provide the activities,performance,workload of some user then => {
// Starting with lines like => The {user} in {time} was ....
// Provide details about the work done by the user
// return us the issues assigned to that user without any history for issues just names and any update for that issue work
// Tell us the main activities which were assigned to the person and what this person did for the specific provided time
// Dont add any heading, points or any things, just proper reply 
// }
// Dont use  the old response or chatbot response in any case
// Directly provide information for the data accroding to query, dont use any user or detail from already generated response in past
// Dont add such lines in response like => Based on the provided data,The data provided includes information
// If query is related to some assignes utilization so provide a proper response for that situation , if an asssignee has issues with some due date then retuens assignee that he is busy so not unterutilized but is some assignee has issues with no due date then return that this assignee is free so underutilized,
// properly read the due date field from provided response and thenn answer
// If query contain search issues of projects etc then simply return information as per query, dont link any user or detail from already generated response in past



// const operations = [
//     {
//         "Method": 'GET',
//         "API_URL": '/rest/api/3/search?jql=assignee=haab.dev AND updated >= -1w',
//         "Parameters": {}
//     }
// ]

// const operations = [
//     {
//         Method: 'POST',
//         API_URL: '/rest/api/3/project',
//         Parameters: {
//             key: 'DEMO',
//             name: 'Demo',
//             leadAccountId: 'John Doe',
//             projectTypeKey: 'software',
//             projectTemplateKey: 'com.atlassian.jira-core-project-templates:jira-core-project-template'
//         },
//         ViewToLoad: 'project'
//     }
// ]

// const operations = [{
//     "Method": "GET",
//     "API_URL": "/rest/api/3/search",
//     "Parameters": {
//         "fields": {
//             "project": {
//                 "key": "AIMETH"
//             },
//             "summary": "Login Error on Homepage",
//             "description": {
//                 "type": "doc",
//                 "version": 1,
//                 "content": [
//                     {
//                         "type": "paragraph",
//                         "content": [
//                             {
//                                 "text": "Users are unable to log in on the homepage, experiencing a timeout error.",
//                                 "type": "text"
//                             }
//                         ]
//                     }
//                 ]
//             },
//             "issuetype": {
//                 "id": "Task"
//             },
//             "assignee": {
//                 "id": "haab.dev@gmail.com"
//             }
//         }
//     }
// }];