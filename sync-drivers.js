// File: sync-drivers.js
const fs = require('fs');
const path = require('path');
const { getSheet } = require('./google-auth');

// Data file paths
const DATA_DIR = path.join(__dirname, 'data');
const DRIVERS_FILE = path.join(DATA_DIR, 'drivers.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Initialize data files if they don't exist
if (!fs.existsSync(DRIVERS_FILE)) {
  fs.writeFileSync(DRIVERS_FILE, JSON.stringify([]));
}

// Function to read existing data
function readData(filePath) {
  try {
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading data from ${filePath}:`, error);
    return [];
  }
}

// Function to write data
function writeData(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error(`Error writing data to ${filePath}:`, error);
    return false;
  }
}

// Synchronize drivers from Google Sheets
async function syncDriversFromSheet() {
  try {
    console.log('Starting driver sync from Google Sheets...');
    
    const sheet = await getSheet();
    const rows = await sheet.getRows();
    
    // Get existing drivers to avoid duplicates
    const existingDrivers = readData(DRIVERS_FILE);
    const existingEmails = new Set(existingDrivers.map(d => d.email?.toLowerCase()).filter(Boolean));
    
    const newDrivers = [];
    let updatedCount = 0;
    
    for (const row of rows) {
      // Skip rows without email
      if (!row.email) {
        console.log('Skipping row without email');
        continue;
      }
      
      // Format phone number if needed
      let phone = row.phone || '';
      const digits = phone.replace(/\D/g, '');
      if (digits.length === 10) {
        phone = `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`;
      }
      
      // Map Google Sheets data to our driver format
      const driverData = {
        name: row.name || '',
        email: row.email,
        phone: phone,
        city: row.city || '',
        state: row.state || '',
        vehicleType: (row.vehicleTypes || '').split(',')[0] || 'car',
        status: 'pending',
        notes: row.notes || `Imported from Google Sheets`,
        applicationDate: row.createdAt || row.timestamp || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        contactPreference: row.contactPreference || '',
        backgroundCheckConsent: row.backgroundCheck === 'Yes' || row.backgroundCheck === 'true',
        drivingHistoryConfirmed: row.drivingHistory === 'Yes' || row.drivingHistory === 'true',
        smsConsent: row.smsConsent === 'Yes' || row.smsConsent === 'true',
        vehicleTypes: (row.vehicleTypes || '').split(',').filter(Boolean) || []
      };
      
      // Check if this email already exists
      const emailLowercase = row.email.toLowerCase();
      if (!existingEmails.has(emailLowercase)) {
        // New driver - add to the list
        const newDriver = {
          id: Date.now().toString() + Math.floor(Math.random() * 1000),
          ...driverData
        };
        
        newDrivers.push(newDriver);
        existingEmails.add(emailLowercase);
      } else {
        // Update existing driver
        const existingIndex = existingDrivers.findIndex(d => 
          d.email && d.email.toLowerCase() === emailLowercase
        );
        
        if (existingIndex !== -1) {
          // Only update if the data is newer
          const existingDate = new Date(existingDrivers[existingIndex].updatedAt);
          const rowDate = new Date(row.updatedAt || row.timestamp || 0);
          
          if (rowDate > existingDate) {
            existingDrivers[existingIndex] = {
              ...existingDrivers[existingIndex],
              ...driverData,
              updatedAt: new Date().toISOString()
            };
            updatedCount++;
          }
        }
      }
    }
    
    // Add new drivers to existing data
    const updatedDrivers = [...existingDrivers, ...newDrivers];
    
    // Save updated data
    if (writeData(DRIVERS_FILE, updatedDrivers)) {
      console.log(`Sync complete: Imported ${newDrivers.length} new drivers, updated ${updatedCount} existing drivers.`);
      return {
        success: true,
        imported: newDrivers.length,
        updated: updatedCount
      };
    } else {
      console.error('Failed to save synced drivers data');
      return {
        success: false,
        error: 'Failed to save synced data'
      };
    }
    
  } catch (error) {
    console.error('Error syncing from Google Sheets:', error);
    return {
      success: false,
      error: error.message
    };
  }
}

module.exports = { syncDriversFromSheet };