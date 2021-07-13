import React from 'react';
import { authenticate, loadClient } from './auth';
import {
  executeValuesUpdate,
  executeValuesAppend,
  executeValuesAppendCheckIn,
  executeValuesAppendCheckOut,
  executeBatchUpdateAddSheet,
  executeBatchUpdateCutPaste,
  executeValuesAppendAddSheet,
} from './executeFunc';
import SearchBar from './SearchBar';
import NewUserForm from './NewUserForm';
import CountDownTimer from './CountDownTimer';
import CheckInOut from './CheckInOut';
import LoadingSpinner from './LoadingSpinner';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles.css';

const SHEET_ID = process.env.REACT_APP_SHEET_ID;
const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;

const hoursMinSecs = { hours: 0, minutes: 59, seconds: 0 };

class App extends React.Component {
  state = {
    numberExists: '',
    firstLoad: false,
    valuesMatched: [],
    checkInOut: '',
    duration: '',
    newSheetId: 0,
    checkedIn: false,
    checkedOut: false,
    loading: false,
  };

  getNewSheetId = async () => {
    await authenticate();
    await loadClient();
    const newSheetId = await executeBatchUpdateAddSheet();
    if (newSheetId === false) return;
    this.setState({
      newSheetId: newSheetId,
    });
    await executeBatchUpdateCutPaste(this.state.newSheetId);
    await executeValuesAppendAddSheet();
  };

  onSearchSubmit = async (term) => {
    this.setState({ loading: true });
    if (this.state.firstLoad) {
      await authenticate();
      this.setState({ firstLoad: false });
    }
    await loadClient();
    await executeValuesUpdate(term);
    await this.getSheetValues();
    if (this.state.numberExists.includes('Exists')) {
      await this.getSheetValuesMatched();
    }
    this.setState({ loading: false });
  };

  onNewUserFormSubmit = async (userData) => {
    console.log(userData);
    if (this.state.firstLoad) {
      await authenticate();
      this.setState({ firstLoad: false });
    }
    await loadClient();
    await executeValuesAppend(userData);
  };

  onCheckInOutSubmit = async (checkInOut) => {
    if (checkInOut.includes('Check In')) {
      console.log('Welcome CheckIn');
      if (this.state.valuesMatched[4].includes('Not Checked In') === false) {
        this.setState({ checkedIn: true });
        return;
      } else {
        await executeValuesAppendCheckIn(checkInOut, this.state.valuesMatched);
      }
    } else {
      console.log('Welcome CheckOut');
      if (this.state.valuesMatched[5].includes('Check Out')) {
        this.setState({ checkedOut: true });
        return;
      } else {
        await executeValuesAppendCheckOut(
          checkInOut,
          this.state.valuesMatched[4]
        );
        await this.getSheetValuesDuration();
      }
    }
  };

  loadApiScript = async () => {
    const script = document.createElement('script');
    script.src = 'https://apis.google.com/js/api.js';
    document.body.appendChild(script);

    script.onload = async () => {
      await window.gapi.load('client:auth2', async () => {
        await window.gapi.auth2.init({ client_id: CLIENT_ID });
      });
    };

    this.setState({ firstLoad: true });
  };

  componentDidMount() {
    this.loadApiScript();
  }

  getSheetValues = async () => {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Clients!F2',
      });
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response.result.values[0]);
      this.setState({ numberExists: response.result.values[0] });
    } catch (err) {
      console.error('Execute error', err);
    }
  };

  getSheetValuesMatched = async () => {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: 'Clients!G2:L2',
      });
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response.result.values[0]);
      this.setState({ valuesMatched: response.result.values[0] });
    } catch (err) {
      console.error('Execute error', err);
    }
  };

  getSheetValuesDuration = async () => {
    try {
      const response = await window.gapi.client.sheets.spreadsheets.values.get({
        spreadsheetId: SHEET_ID,
        range: `Data!I${this.state.valuesMatched[4]}`,
      });
      // Handle the results here (response.result has the parsed body).
      console.log('Response', response.result.values[0]);
      this.setState({ duration: response.result.values[0] });
    } catch (err) {
      console.error('Execute error', err);
    }
  };

  render() {
    return (
      <div className='ui container' style={{ marginTop: '10px' }}>
        <div>
          {this.state.numberExists.includes('Exists') ? (
            <h1>Welcome Back {this.state.valuesMatched[1]}</h1>
          ) : (
            ''
          )}
        </div>
        <SearchBar onSubmit={this.onSearchSubmit} />
        {this.state.loading ? <LoadingSpinner /> : ''}
        <div className='text-center'>
          <p>{this.state.numberExists}</p>
        </div>
        <div>
          {this.state.numberExists.includes('') ? (
            ''
          ) : this.state.numberExists.includes('Not Exists') ? (
            <NewUserForm onSubmit={this.onNewUserFormSubmit} />
          ) : (
            <CheckInOut onSubmit={this.onCheckInOutSubmit} />
          )}
        </div>
        <div>{this.state.checkedIn ? 'You already checked in' : ''}</div>
        <div>{this.state.checkedOut ? 'You already checked out' : ''}</div>
        <div>
          {this.state.duration.includes('') === false ? (
            <h1>Duration {this.state.duration}</h1>
          ) : (
            ''
          )}
        </div>
        <footer>
          {this.state.firstLoad === false ? (
            <CountDownTimer hoursMinSecs={hoursMinSecs} />
          ) : (
            ''
          )}
          <button onClick={this.getNewSheetId}>AddSheet</button>
        </footer>
      </div>
    );
  }
}

export default App;
