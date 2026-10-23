/**
 * ============================================================================
 * ALPHA LEAD ACADEMY — ADMISSIONS & INQUIRIES CRM (Google Apps Script)
 * ============================================================================
 * 
 * Instructions to install in Google Sheets:
 * 1. Open your Google Sheet: "Alpha Lead Academy - Admissions & Inquiries CRM"
 * 2. In the top menu, click: Extensions -> Apps Script
 * 3. Replace all existing code in Code.gs with this entire file.
 * 4. (Optional) Run the function 'setupAllSheets' once to auto-create and format all 6 tabs.
 * 5. Click "Deploy" (top right) -> "Manage deployments" -> Click the pencil edit icon -> Select "New version" -> Click "Deploy".
 *    (Or if first time: "Deploy" -> "New deployment" -> Web App -> Execute as: Me -> Who has access: Anyone).
 * 
 * Tabs Organized by Source Page:
 * 1. "General Inquiries"   — from Homepage (index.html)
 * 2. "Defence & SSB"       — from Defence Mentorship page (defence.html)
 * 3. "Career Guidance"     — from Career Launchpad page (career.html)
 * 4. "Corporate Solutions" — from Corporate page (corporate.html)
 * 5. "SSB Stay (2 AFSB)"   — from SSB Stay Accommodation page (ssb-stay.html)
 * 6. "Express Callbacks"   — from Quick Callback Popups across all pages
 * ============================================================================
 */

// CRM Configuration
var CRM_CONFIG = {
  headerBgColor: '#0F172A', // Premium Navy / Slate
  headerFontColor: '#FFFFFF',
  headerFontSize: 10,
  rowFontFamily: 'Arial',
  defaultStatus: 'New Lead'
};

// Definition of sheets, headers and column widths
var SHEET_DEFINITIONS = {
  'General Inquiries': {
    headers: [
      'Sl. No.',
      'Date & Time',
      'Full Name',
      'Phone / WhatsApp',
      'Email Address',
      'Interested Programme',
      'Message / Background',
      'Source Page',
      'Lead Status',
      'Counselor Notes'
    ],
    widths: [70, 150, 180, 140, 200, 200, 280, 220, 130, 220],
    statuses: ['New Lead', 'Contacted', 'In Discussion', 'Enrolled', 'Not Interested', 'Spam']
  },
  'Defence & SSB': {
    headers: [
      'Sl. No.',
      'Date & Time',
      'Candidate Name',
      'WhatsApp Number',
      'Email Address',
      'Target Entry',
      'Notes (Board / Date / Attempts)',
      'Source Page',
      'Lead Status',
      'Counselor Notes'
    ],
    widths: [70, 150, 180, 140, 200, 180, 280, 220, 130, 220],
    statuses: ['New Lead', 'Contacted', 'Trial / Assessment', 'Batch Allocated', 'Enrolled', 'Closed']
  },
  'Career Guidance': {
    headers: [
      'Sl. No.',
      'Date & Time',
      'Candidate Name',
      'Mobile Number',
      'Email Address',
      'Current Academic / Professional Status',
      'Target Roles & Development Goals',
      'Source Page',
      'Lead Status',
      'Counselor Notes'
    ],
    widths: [70, 150, 180, 140, 200, 220, 280, 220, 130, 220],
    statuses: ['New Lead', 'Diagnostic Scheduled', 'Session Completed', 'Enrolled', 'Closed']
  },
  'Corporate Solutions': {
    headers: [
      'Sl. No.',
      'Date & Time',
      'Contact Person Name',
      'Company / Organisation',
      'Official Work Email',
      'Contact Phone Number',
      'Primary Focus Area',
      'Objectives & Team Size',
      'Source Page',
      'Lead Status',
      'Account Manager Notes'
    ],
    widths: [70, 150, 180, 200, 200, 140, 220, 280, 220, 140, 240],
    statuses: ['New Lead', 'Discovery Call', 'Proposal Sent', 'MoU Signed', 'Follow Up', 'Closed']
  },
  'SSB Stay (2 AFSB)': {
    headers: [
      'Sl. No.',
      'Date & Time',
      'Candidate Full Name',
      'WhatsApp Number',
      'Email Address',
      'Check-In Date',
      '2 AFSB Reporting Date & Batch',
      'Arrival Notes / Dietary Needs',
      'Source Page',
      'Booking Status',
      'Warden Notes'
    ],
    widths: [70, 150, 180, 140, 200, 120, 200, 260, 220, 140, 220],
    statuses: ['Pending Confirmation', 'Bed Confirmed', 'Checked-In', 'Completed', 'Cancelled']
  },
  'Express Callbacks': {
    headers: [
      'Sl. No.',
      'Date & Time',
      'Full Name',
      'WhatsApp / Mobile',
      'Email Address',
      'Area of Interest',
      'Triggered From Page',
      'Callback Status',
      'Counselor Notes'
    ],
    widths: [70, 150, 180, 140, 200, 200, 220, 140, 220],
    statuses: ['New Callback', 'Called - No Answer', 'Call Scheduled', 'Connected / Converted', 'Invalid']
  }
};

/**
 * Handle incoming form submissions from the website
 */
function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000); // 30 sec lock
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: 'Lock timeout'
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var raw = e && e.postData ? e.postData.contents : null;
    var data = {};
    if (raw) {
      try {
        data = JSON.parse(raw);
      } catch (jsonErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var category = (data.category || '').toLowerCase();
    var sheetName = data.sheetTab || resolveSheetName(category);

    var sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
    }

    // Setup headers and formatting if sheet is new or empty
    formatSheetIfNeeded(sheet, sheetName);

    // Compute next Serial Number
    var lastRow = sheet.getLastRow();
    var nextSlNo = lastRow > 1 ? lastRow : 1;
    var nowFormatted = Utilities.formatDate(new Date(), 'Asia/Kolkata', 'dd/MM/yyyy, HH:mm:ss');

    // Build values aligned to this sheet's columns
    var rowValues = buildRow(sheetName, data, nextSlNo, nowFormatted);

    sheet.appendRow(rowValues);

    // Apply clean styling to the appended row
    var newRow = sheet.getLastRow();
    styleDataRow(sheet, sheetName, newRow);

    return ContentService.createTextOutput(JSON.stringify({
      status: 'success',
      sheet: sheetName,
      slNo: nextSlNo
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({
      status: 'error',
      message: err.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

/**
 * Health check endpoint for testing in browser
 */
function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'online',
    academy: 'Alpha Lead Academy CRM',
    sheetsAvailable: Object.keys(SHEET_DEFINITIONS),
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}

/**
 * Map category code to proper Sheet Name
 */
function resolveSheetName(cat) {
  if (cat === 'defence') return 'Defence & SSB';
  if (cat === 'career') return 'Career Guidance';
  if (cat === 'corporate') return 'Corporate Solutions';
  if (cat === 'stay') return 'SSB Stay (2 AFSB)';
  if (cat === 'callback') return 'Express Callbacks';
  return 'General Inquiries';
}

/**
 * Build column values array for a specific sheet
 */
function buildRow(sheetName, d, slNo, timestamp) {
  var name = d.fullName || d.name || 'Candidate';
  var phone = d.phone || d.mobile || '';
  var email = d.email || '';
  var page = d.sourcePage || '';

  if (sheetName === 'Defence & SSB') {
    return [
      slNo,
      timestamp,
      name,
      phone,
      email,
      d.entryType || 'SSB Training',
      d.notes || d.message || '',
      page,
      'New Lead',
      ''
    ];
  }

  if (sheetName === 'Career Guidance') {
    return [
      slNo,
      timestamp,
      name,
      phone,
      email,
      d.academicStatus || 'Candidate',
      d.targetGoals || d.notes || d.message || '',
      page,
      'New Lead',
      ''
    ];
  }

  if (sheetName === 'Corporate Solutions') {
    return [
      slNo,
      timestamp,
      name,
      d.company || 'Enterprise',
      email,
      phone,
      d.focusArea || 'Executive Leadership',
      d.notes || d.message || '',
      page,
      'New Lead',
      ''
    ];
  }

  if (sheetName === 'SSB Stay (2 AFSB)') {
    return [
      slNo,
      timestamp,
      name,
      phone,
      email,
      d.checkInDate || 'TBD',
      d.reportingBatch || '2 AFSB Mysuru',
      d.notes || d.message || '',
      page,
      'Pending Confirmation',
      ''
    ];
  }

  if (sheetName === 'Express Callbacks') {
    return [
      slNo,
      timestamp,
      name,
      phone,
      email || 'N/A',
      d.interest || d.programme || 'General Callback',
      page,
      'New Callback',
      ''
    ];
  }

  // Default: General Inquiries
  return [
    slNo,
    timestamp,
    name,
    phone,
    email,
    d.programme || 'General Inquiry',
    d.message || d.notes || '',
    page,
    'New Lead',
    ''
  ];
}

/**
 * Setup header row and freeze first row if needed
 */
function formatSheetIfNeeded(sheet, sheetName) {
  var def = SHEET_DEFINITIONS[sheetName] || SHEET_DEFINITIONS['General Inquiries'];
  var headers = def.headers;

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
  } else {
    // If first row doesn't match headers, ensure row 1 is headers
    var currentFirstCell = sheet.getRange(1, 1).getValue();
    if (currentFirstCell !== 'Sl. No.') {
      sheet.insertRowBefore(1);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    }
  }

  // Style header row
  var headerRange = sheet.getRange(1, 1, 1, headers.length);
  headerRange.setBackground(CRM_CONFIG.headerBgColor)
             .setFontColor(CRM_CONFIG.headerFontColor)
             .setFontWeight('bold')
             .setFontSize(CRM_CONFIG.headerFontSize)
             .setHorizontalAlignment('center')
             .setVerticalAlignment('middle');
  sheet.setRowHeight(1, 38);
  sheet.setFrozenRows(1);

  // Set preset column widths
  for (var i = 0; i < def.widths.length; i++) {
    sheet.setColumnWidth(i + 1, def.widths[i]);
  }
}

/**
 * Apply clean alignment and status dropdown to new rows
 */
function styleDataRow(sheet, sheetName, rowIdx) {
  var def = SHEET_DEFINITIONS[sheetName] || SHEET_DEFINITIONS['General Inquiries'];
  var numCols = def.headers.length;
  var rowRange = sheet.getRange(rowIdx, 1, 1, numCols);

  rowRange.setFontFamily(CRM_CONFIG.rowFontFamily)
          .setFontSize(10)
          .setVerticalAlignment('middle');
  sheet.setRowHeight(rowIdx, 30);

  // Center Sl. No. and Date columns
  sheet.getRange(rowIdx, 1).setHorizontalAlignment('center');
  sheet.getRange(rowIdx, 2).setHorizontalAlignment('center');

  // Add dropdown validation for Status column
  var statusColIdx = def.headers.indexOf('Lead Status') + 1;
  if (statusColIdx === 0) {
    statusColIdx = def.headers.indexOf('Booking Status') + 1;
  }
  if (statusColIdx === 0) {
    statusColIdx = def.headers.indexOf('Callback Status') + 1;
  }

  if (statusColIdx > 0 && def.statuses) {
    var rule = SpreadsheetApp.newDataValidation()
      .requireValueInList(def.statuses, true)
      .setAllowInvalid(true)
      .build();
    var statusCell = sheet.getRange(rowIdx, statusColIdx);
    statusCell.setDataValidation(rule);
    statusCell.setHorizontalAlignment('center');
    statusCell.setFontWeight('bold');
  }
}

/**
 * UTILITY: Run this once manually inside Apps Script editor to auto-create and style all 6 tabs!
 */
function setupAllSheets() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheetNames = Object.keys(SHEET_DEFINITIONS);

  sheetNames.forEach(function(name) {
    var sheet = ss.getSheetByName(name);
    if (!sheet) {
      sheet = ss.insertSheet(name);
    }
    formatSheetIfNeeded(sheet, name);
  });

  // Remove default empty 'Sheet1' if it has only blank or dummy rows
  var defaultSheet = ss.getSheetByName('Sheet1');
  if (defaultSheet && ss.getSheets().length > 1) {
    try {
      ss.deleteSheet(defaultSheet);
    } catch(e) {}
  }

  SpreadsheetApp.getUi().alert('Success! All 6 Alpha Lead CRM sheets have been created and formatted with Sl. No. and columns.');
}
