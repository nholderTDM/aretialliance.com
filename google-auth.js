// File: google-auth.js
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();

// Load credentials from file
const credentials = require('./google-credentials.json');

// Function to get authenticated sheet
async function getSheet() {
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;
  if (!spreadsheetId) {
    throw new Error('Google Sheet ID not provided in environment variables');
  }
  
  const doc = new GoogleSpreadsheet(spreadsheetId);
  await doc.useServiceAccountAuth(credentials);
  await doc.loadInfo();
  
  // Return the first sheet
  return doc.sheetsByIndex[0];
}

module.exports = { getSheet };