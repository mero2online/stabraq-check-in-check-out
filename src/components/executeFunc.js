const SHEET_ID = process.env.REACT_APP_SHEET_ID;

export const executeValuesUpdate = (val) => {
  return window.gapi.client.sheets.spreadsheets.values
    .update({
      spreadsheetId: SHEET_ID,
      range: 'Clients!H2',
      valueInputOption: 'USER_ENTERED',
      resource: {
        // majorDimension: 'COLUMNS',
        values: [[`'${val}`]],
      },
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

// Make sure the client is loaded and sign-in is complete before calling this method.
export const executeBatchUpdateCutPaste = (destSheetId) => {
  return window.gapi.client.sheets.spreadsheets
    .batchUpdate({
      spreadsheetId: SHEET_ID,
      alt: 'json',
      resource: {
        requests: [
          {
            cutPaste: {
              source: {
                sheetId: 1430616672,
              },
              destination: {
                sheetId: destSheetId,
              },
              pasteType: 'PASTE_NORMAL',
            },
          },
        ],
      },
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

export const executeValuesAppend = (userData) => {
  return window.gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: SHEET_ID,
      range: 'Clients!A3',
      valueInputOption: 'RAW',
      resource: {
        majorDimension: 'COLUMNS',
        values: [
          // [new Date().toLocaleString()],
          [userData.mobile],
          [userData.userName],
          [userData.email],
          [userData.membership],
        ],
      },
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

export const executeValuesAppendCheckIn = (checkInOut, valuesMatched) => {
  return window.gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: SHEET_ID,
      range: 'Data!A2',
      valueInputOption: 'USER_ENTERED',
      resource: {
        majorDimension: 'COLUMNS',
        values: [
          [new Date().toLocaleTimeString()],
          [checkInOut],
          [`'${valuesMatched[0]}`],
          [valuesMatched[1]],
          [valuesMatched[2]],
          [valuesMatched[3]],
        ],
      },
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

export const executeValuesAppendCheckOut = (checkInOut, rowNumber) => {
  return window.gapi.client.sheets.spreadsheets.values
    .append({
      spreadsheetId: SHEET_ID,
      range: `Data!G${rowNumber}`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        majorDimension: 'COLUMNS',
        values: [
          [new Date().toLocaleTimeString()],
          [checkInOut],
          [`=TEXT(G${rowNumber}-A${rowNumber},"h:mm")`],
          [
            `=IF(I${rowNumber}*24<1,1,IF(OR(AND(I${rowNumber}*24-INT(I${rowNumber}*24)<=0.1),AND(I${rowNumber}*24-INT(I${rowNumber}*24)>0.5,I${rowNumber}*24-INT(I${rowNumber}*24)<=0.59)),FLOOR(I${rowNumber},"00:30")*24,CEILING(I${rowNumber},"00:30")*24))`,
          ],
          [`=J${rowNumber}*10`],
        ],
      },
    })
    .then(
      (response) => {
        // Handle the results here (response.result has the parsed body).
        console.log('Response', response);
      },
      (err) => {
        console.error('Execute error', err);
      }
    );
};

export const executeBatchUpdateAddSheet = async (sheetDate) => {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.batchUpdate({
      spreadsheetId: SHEET_ID,
      resource: {
        requests: [
          {
            addSheet: {
              properties: {
                title: sheetDate,
                rightToLeft: true,
              },
            },
          },
        ],
      },
    });
    console.log(
      'Response',
      response.result.replies[0].addSheet.properties.sheetId
    );
    return response.result.replies[0].addSheet.properties.sheetId;
  } catch (err) {
    console.error('Execute error', err.result.error.message);
    return false;
  }
};

export const executeValuesAppendAddSheet = async () => {
  try {
    const response = await window.gapi.client.sheets.spreadsheets.values.append(
      {
        spreadsheetId: SHEET_ID,
        range: 'Data!A1',
        valueInputOption: 'USER_ENTERED',
        resource: {
          majorDimension: 'COLUMNS',
          values: [
            ['Timestamp CheckIn'],
            ['Check In'],
            ['Mobile No.'],
            ['Name'],
            ['E-Mail'],
            ['Membership'],
            ['Timestamp CheckOut'],
            ['Check Out'],
            ['Duration'],
            [new Date().toLocaleDateString()],
          ],
        },
      }
    );
    console.log('Response', response);
  } catch (err) {
    console.error('Execute error', err);
  }
};
