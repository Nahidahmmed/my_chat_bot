"use strict";
const dialogflow = require("@google-cloud/dialogflow");
const { struct } = require("pb-util");
require("dotenv").config();

const projectID = process.env.DIALOGFLOW_PROJECT_ID;
const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Ensure line breaks in private key
};

const sessionClient = new dialogflow.SessionsClient({ credentials });

module.exports = {
  textQuery: async function (text, parameters = {}) {
    let self = module.exports;
    
    // Define session path using sessionClient and session ID
    const sessionId = "unique-session-id"; // Replace with dynamic session ID as needed
    const sessionpath = sessionClient.projectAgentSessionPath(projectID, sessionId);

    const request = {
      session: sessionpath,
      queryInput: {
        text: {
          text: text,
          languageCode: process.env.DIALOGFLOW_SESSION_LANGUAGE_CODE || 'en', // Default to English if not set
        },
      },
      queryParams: {
        payload: {
          data: parameters,
        },
      },
    };
    
    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },

  eventQuery: async function (event, parameters = {}) {
    let self = module.exports;

    // Define session path using sessionClient and session ID
    const sessionId = "unique-session-id"; // Replace with dynamic session ID as needed
    const sessionpath = sessionClient.projectAgentSessionPath(projectID, sessionId);

    const request = {
      session: sessionpath,
      queryInput: {
        event: {
          name: event,
          parameters: struct.encode(parameters),
          languageCode: process.env.DIALOGFLOW_SESSION_LANGUAGE_CODE || 'en',
        },
      },
    };

    let responses = await sessionClient.detectIntent(request);
    responses = await self.handleAction(responses);
    return responses;
  },

  handleAction: function (responses) {
    return responses;
  },
};
