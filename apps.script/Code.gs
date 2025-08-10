/*****************************************************************************************/
// Author : William J Gay III
// Date   : Aug 2025
// 
// REVISION HISTORY
// Name             Date        Description
// ---------------  ----------  ---------------------------------------------------------
// Will Gay         08/09/2025  Initial development
//
/*****************************************************************************************/

// Build the date string manually from local date components
const NOW = new Date();
const YEAR = NOW.getFullYear();
const MONTH = (NOW.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
const DAY = NOW.getDate().toString().padStart(2, '0');
const TODAY = `${YEAR}-${MONTH}-${DAY}`;

// Build sheet and header constants
const SHEET_NAME = "Roster";
const HEADERS = [
  "Id", "First Name", "Last Name", "SSN", "Street",
  "City", "State", "Zip", "Facility", "Donation",
  "Person", "Notes", "Verified", "Updated"
];
const headArr = {
  colId: {pos: 0, name: HEADERS[0]},
  colFirstName: {pos: 1, name: HEADERS[1]},
  colLastName: {pos: 2, name: HEADERS[2]},
  colSSN: {pos: 3, name: HEADERS[3]},
  colStreet: {pos: 4, name: HEADERS[4]},
  colCity: {pos: 5, name: HEADERS[5]},
  colState: {pos: 6, name: HEADERS[6]},
  colZip: {pos: 7, name: HEADERS[7]},
  colFacility: {pos: 8, name: HEADERS[8]},
  colDonation: {pos: 9, name: HEADERS[9]},
  colPerson: {pos: 10, name: HEADERS[10]},
  colNotes: {pos: 11, name: HEADERS[11]},
  colVerified: {pos: 12, name: HEADERS[12]},
  colUpdated: {pos: 13, name: HEADERS[13]},
}

/***************************************************************/
// Code that runs on app load
/***************************************************************/
function doGet() {
  //Logger.log("TODAY: " + JSON.stringify(TODAY));
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("CPOF Member Maintenance")
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

/***************************************************************/
// Convert any date objects to string
/***************************************************************/
function sanitizeRow(row, headerMap) {
  return HEADERS.map((header, index) => {
    const val = row[headerMap[header]];
    if (val instanceof Date) {
      return val.toISOString().split("T")[0];
    }
    return val;
  });
}

/***************************************************************/
// Return header array for UI
/***************************************************************/
function getHeaderArray() {
  return headArr;
}

function getHeaders(){
  return {
    headers: HEADERS,
    headArray: headArr
  }
}

/***************************************************************/
// Build empty response to support empty UI table
/***************************************************************/
function getEmptyData() {
  return {
    data: new Array(),
    headers: HEADERS,
    filters: false
  }
}

/***************************************************************/
// Server-side filtered data fetcher
/***************************************************************/
function getFilteredData(filters) {
  //Logger.log("filters: " + JSON.stringify(filters));
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  if (!sheet) throw new Error("Sheet not found");

  const data = sheet.getDataRange().getValues();
  //Logger.log("data: " + JSON.stringify(data))
  const headerRow = data[0];
  const headerMap = {};

  headerRow.forEach((name, i) => {
    headerMap[name] = i;
  });

  const rows = data.slice(1)
    .map(row => {
      const obj = {};
      HEADERS.forEach(header => {
        const value = row[headerMap[header]];
        obj[header] = value instanceof Date ? value.toISOString().split("T")[0] : value;
      });
      return obj;
    })
    .filter(row => {
      return Object.entries(filters).every(([key, val]) => {
        //Logger.log("key: " + JSON.stringify(key));
        //Logger.log("val: " + JSON.stringify(val));
        //Logger.log("row[key]: " + JSON.stringify(row[key]));
        if (!val) return true;
        return String(row[key]).toLowerCase().includes(String(val).toLowerCase());
      });
    });

  //Logger.log("data: " + JSON.stringify(rows));
  //Logger.log("Headers: " + JSON.stringify(HEADERS));

  return {
    data: rows,
    headers: HEADERS,
    filters: true
  };
}

/***************************************************************/
// Get sheet and row number by member id
/***************************************************************/
function getRowById(memberId) {
  //Logger.log("getRowById memberId: " + JSON.stringify(memberId));
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME);
  const data = sheet.getDataRange().getValues();

  for (let i = 1; i < data.length; i++) {
    if (String(data[i][headArr.colId.pos]) === String(memberId)) {
      //Logger.log("sheet id: " + JSON.stringify(data[i][headArr.colId.pos]));
      
      // Return row num + 1 (0 based)
      return {sheet: sheet, rowId: i + 1};
    }
  }

  throw new Error("Record not found for ID: " + id);
}

/***************************************************************/
// Update member verified date when no changes are needed
/***************************************************************/
function verifyMember(memberId) {
  //Logger.log("verifyMember memberId: " + JSON.stringify(memberId));
  let response = getRowById(memberId);

  response.sheet.getRange(response.rowId, headArr.colVerified.pos + 1).setValue(TODAY);
  SpreadsheetApp.flush(); // <-- Force sheet to finish processing

  return true;
}

/***************************************************************/
// Update member details and date fields
/***************************************************************/
function saveMemberData(updatedData) {
  let response = getRowById(updatedData[headArr.colId.name]);
  
/*
  HEADERS.forEach(field => {
    if ([headArr.colId.name, headArr.colVerified.name, headArr.colUpdated.name].includes(field)) return;

    const col = headerMap[field];
    sheet.getRange(i + 1, col + 1).setValue(updatedData[field]);
  });
*/

  // Update data
  response.sheet.getRange(response.rowId, headArr.colFirstName.pos + 1).setValue(updatedData[headArr.colFirstName.name]);
  response.sheet.getRange(response.rowId, headArr.colLastName.pos + 1).setValue(updatedData[headArr.colLastName.name]);
  response.sheet.getRange(response.rowId, headArr.colSSN.pos + 1).setValue(updatedData[headArr.colSSN.name]);
  response.sheet.getRange(response.rowId, headArr.colStreet.pos + 1).setValue(updatedData[headArr.colStreet.name]);
  response.sheet.getRange(response.rowId, headArr.colCity.pos + 1).setValue(updatedData[headArr.colCity.name]);
  response.sheet.getRange(response.rowId, headArr.colState.pos + 1).setValue(updatedData[headArr.colState.name]);
  response.sheet.getRange(response.rowId, headArr.colZip.pos + 1).setValue(updatedData[headArr.colZip.name]);
  response.sheet.getRange(response.rowId, headArr.colFacility.pos + 1).setValue(updatedData[headArr.colFacility.name]);
  response.sheet.getRange(response.rowId, headArr.colDonation.pos + 1).setValue(updatedData[headArr.colDonation.name]);
  response.sheet.getRange(response.rowId, headArr.colPerson.pos + 1).setValue(updatedData[headArr.colPerson.name]);
  response.sheet.getRange(response.rowId, headArr.colVerified.pos + 1).setValue(TODAY);
  response.sheet.getRange(response.rowId, headArr.colUpdated.pos + 1).setValue(TODAY);
  response.sheet.getRange(response.rowId, headArr.colNotes.pos + 1).setValue(updatedData[headArr.colNotes.name]);
  SpreadsheetApp.flush(); // <-- Force sheet to finish processing

  return true;
}
