import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';
import { OpenAI } from 'openai';
import axios from 'axios';
import authRouter from "./routes/authRoutes.js";
import jiraRoutes from './routes/jira.routes.js';
import openAiRoutes from './routes/openai.routes.js';
dotenv.config();

const app = express();
mongoose.connect(process.env.MONGODB_URL);
app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(cookieParser());
app.use(bodyParser.json());

// const openai = new OpenAI({
//     apiKey: process.env.OPENAI_API_KEY,
// });

// const jiraInstance = axios.create({
//     baseURL: process.env.JIRA_BASE_URL,
//     headers: {
//         Authorization: `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`,
//         'Content-Type': 'application/json'
//     }
// });

// const convertToJQL = async (query, retries = 3) => {
//     try {
//         const prompt = `
//         Analyze and convert the following detailed natural language query into multiple JIRA API requests in JSON format  
//         Each distinct task should be converted into a separate API call in the format shown below.
//         Provide all bodyData that are mentioned in jira rest api routes documentation. 
//         Find the leadAccountId using some route in any case if required using the provided information and add it into the request body parameters if needed
//         Dont include any other text in the response.
//         Add query parameters with ? in the api route if needed(not every time , exceptional cases like ?accountId).
//         In case if we have to use the old response so in the parameters mention that parameters value with exactly the same thing we will recieve from the response of older reoute in a way response.data.'exact parameter name'
//         Don't use the older response in any case
//         Always provide route to search user if name or email is passed in the query
//         Add all parameters in the request body without which api wouldn't execute properly
//         Query: "${query}"

//         Expected response format for multiple tasks:
//         [
//             {
//                 "Method": "HTTP_METHOD",
//                 "API_URL": "/rest/api/path",
//                 "Parameters": {
//                     "key1": "value1",
//                     "key2": "value2"
//                 }
//             },
//             {
//                 "Method": "HTTP_METHOD",
//                 "API_URL": "/rest/api/another_path",
//                 "Parameters": {
//                     "key1": "value1",
//                     "key2": "value2"
//                 }
//             }
//         ]

//         If only one task is detected, format the response as a single JSON object.
//         `;

//         const response = await openai.chat.completions.create({
//             model: "gpt-4",
//             messages: [
//                 {
//                     role: "system",
//                     content: knowledgeBase
//                 },
//                 {
//                     role: "user",
//                     content: prompt
//                 }
//             ],
//             max_tokens: 250,
//             temperature: 0.2,
//         });

//         const jsonText = response.choices[0].message.content
//             .replace(/```json/g, '')
//             .replace(/```/g, '')
//             .trim();
//         if (!jsonText) throw new Error("No JSON found in response");
//         const operations = JSON.parse(jsonText);
//         return Array.isArray(operations) ? operations : [operations];

//     } catch (error) {
//         console.error("Error generating JQL or Jira operation:", error);
//         throw new Error("Failed to convert query");
//     }
// };


// const executeJiraOperations = async (operations) => {
//     let responseContext = {};
//     const results = [];

//     for (const operation of operations) {
//         try {
//             if (!operation.Method || !operation.API_URL) {
//                 throw new Error("Operation missing necessary properties (Method or API_URL)");
//             }
//             let data = operation.Parameters;
//             if (data.leadAccountId) {
//                 data.leadAccountId = responseContext.accountId;
//             }
//             console.log(data);
//             const method = operation.Method.toLowerCase();
//             const url = operation.API_URL;

//             const responseGot = await jiraInstance({
//                 method,
//                 url,
//                 data
//             });

//             responseContext = responseGot.data[0];
//             // if (operation.Method === 'GET' && operation.API_URL.includes('user/search')) {
//             //     responseContext.accountId = responseGot.data[0].accountId;
//             // }

//             console.log('JIRA Response:', responseGot.data);
//             results.push({ success: true, data: responseGot.data, operation });
//         } catch (error) {
//             console.error('Failed JIRA Operation:', error);
//             console.error("Error data:", error.response.data);
//             results.push({ success: false, error: error.message, operation });
//         }
//     }
//     return results;
// };


app.use('/auth', authRouter);
app.use('/jira', jiraRoutes);
app.use('/openai', openAiRoutes);

// app.post("/convert-query", async (req, res) => {
//     const { query } = req.body;
//     if (!query) {
//         return res.status(400).json({ error: "Query is required" });
//     }

//     try {
//         const operations = await convertToJQL(query);
//         console.log('JIRA Operations:', operations);
//         const results = await executeJiraOperations(operations);
//         // console.log('JIRA Results:', results);
//         res.status(200).json({
//             message: "JIRA operations performed successfully.",
//             results: results
//         });
//     } catch (error) {
//         console.error('Error processing query:', error);
//         res.status(500).json({ error: "Failed to process query" });
//     }
// });

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});


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