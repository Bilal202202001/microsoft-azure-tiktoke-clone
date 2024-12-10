import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import OpenAI from "openai";
import axios from "axios";

dotenv.config();

const app = express();
console.log(process.env.FRONTEND_URL);

app.use(cors({
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(bodyParser.json());

// OpenAI Initialization
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Jira API configuration
const jiraInstance = axios.create({
    baseURL: process.env.JIRA_BASE_URL,  // Example: https://your-domain.atlassian.net
    headers: {
        Authorization: `Basic ${Buffer.from(`${process.env.JIRA_EMAIL}:${process.env.JIRA_API_TOKEN}`).toString('base64')}`,
        'Content-Type': 'application/json'
    }
});

// Map natural language operations to HTTP methods
const operationMapping = {
    fetch: 'GET',
    create: 'POST',
    update: 'PUT',
    delete: 'DELETE'
};

// Function to clean JQL query returned from OpenAI
const cleanJQLQuery = (responseText) => {
    return responseText.replace(/```[\s\S]*?```/g, '').trim();  // Remove markdown code blocks and clean the text
};

// Function to convert a natural language query to JQL or API payload using OpenAI
const convertToJQL = async (query, retries = 3) => {
    try {
        const prompt = `
        Convert the following natural language query into a valid JQL query that can be used directly with Jira's REST API. 
        Only return the JQL query, nothing else. 
        Make sure the JQL query is formatted properly for use in a Jira API request.
        
        Natural Language Query: "${query}"
        `;

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
                { role: "system", content: "You are an expert at converting natural language into precise JQL queries." },
                { role: "user", content: prompt }
            ],
            max_tokens: 100,
            temperature: 0.2,
        });

        const jqlQuery = response.choices[0].message.content.trim();  // Ensure we get a clean JQL query
        return { operation: 'fetch', jqlQuery, endpoint: '/rest/api/3/search', dataPayload: null };
    } catch (error) {
        if (error.message.includes('insufficient_quota') && retries > 0) {
            console.log(`Retrying... Attempts left: ${retries}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return convertToJQL(query, retries - 1);
        }
        console.error("Error generating JQL or Jira operation:", error);
        throw new Error("Failed to convert query");
    }
};


// Function to process Jira API calls based on the operation type (fetch, create, update, delete)
const processJiraQuery = async (operation, endpoint, dataPayload = null, jqlQuery = null) => {
    try {
        const method = operationMapping[operation];
        if (!method) {
            throw new Error("Unsupported operation");
        }
        let response;
        switch (method) {
            case 'GET':
                response = await jiraInstance.get(endpoint, { params: { jql: jqlQuery } });
                break;
            case 'POST':
                response = await jiraInstance.post(endpoint, dataPayload);
                break;
            case 'PUT':
                response = await jiraInstance.put(endpoint, dataPayload);
                break;
            case 'DELETE':
                response = await jiraInstance.delete(endpoint);
                break;
            default:
                throw new Error("Unsupported operation");
        }
        return response.data;
    } catch (error) {
        if (error.response) {
            console.error("Error response data:", error.response.data);
            console.error("Error response status:", error.response.status);
        } else {
            console.error("Error message:", error.message);
        }
        throw error;
    }
};


// Express route to handle incoming queries and send requests to Jira
app.post("/convert-query", async (req, res) => {
    const { query } = req.body;

    if (!query) {
        return res.status(400).json({ error: "Query is required" });
    }

    try {
        // Extract information from the query using OpenAI
        const extractedInfo = await convertToJQL(query);
        console.log(`Extracted Info:`, extractedInfo);

        const { operation, endpoint, dataPayload, jqlQuery } = extractedInfo;

        // Process the Jira query (fetch, create, update, delete)
        const result = await processJiraQuery(operation, endpoint, dataPayload, jqlQuery);
        console.log(`Result:`, result);

        // return res.json({ result });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to process query" });
    }
});

app.listen(process.env.PORT || 5000, () => {
    console.log("Server started on port 5000");
});