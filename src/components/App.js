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
import MyModal from './MyModal';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import '../styles.css';
import { Modal } from 'bootstrap';

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
    modalBody: '',
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
    this.setState({
      numberExists: '',
      firstLoad: false,
      valuesMatched: [],
      checkInOut: '',
      duration: '',
      newSheetId: 0,
      checkedIn: false,
      checkedOut: false,
      modalBody: '',
    });
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
    this.setState({
      modalBody: (
        <div className='text-center'>
          {this.state.numberExists.includes('Exists') ? (
            <h1>Welcome Back {this.state.valuesMatched[1]}</h1>
          ) : (
            <div className='text-center'>
              <p>{this.state.numberExists}</p>
            </div>
          )}
        </div>
      ),
    });
    let myModal = new Modal(document.getElementById('exampleModal'), {});
    if (this.state.valuesMatched[4].includes('Not Checked In')) {
      myModal.show();
    }
  };

  onNewUserFormSubmit = async (userData) => {
    console.log(userData);
    if (this.state.firstLoad) {
      await authenticate();
      this.setState({ firstLoad: false });
    }
    await loadClient();
    await executeValuesAppend(userData);
    // this.setState({
    //   modalBody: (
    //     <div className='text-center'>
    //       <h1>Form Submitted</h1>
    //     </div>
    //   ),
    // });
    // let myModal = new Modal(document.getElementById('exampleModal'), {});
    // myModal.show();
  };

  onCheckInOutSubmit = async (checkInOut) => {
    if (checkInOut.includes('Check In')) {
      console.log('Welcome CheckIn');
      if (this.state.valuesMatched[4].includes('Not Checked In') === false) {
        this.setState({ checkedIn: true });
        this.setState({
          modalBody: (
            <div>
              <h1>You already Checked In</h1>
            </div>
          ),
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
        return;
      } else {
        await executeValuesAppendCheckIn(checkInOut, this.state.valuesMatched);
        this.setState({
          modalBody: (
            <div>
              <h1>Checked In Successfully</h1>
            </div>
          ),
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
      }
    } else {
      console.log('Welcome CheckOut');
      if (this.state.valuesMatched[5].includes('Check Out')) {
        this.setState({ checkedOut: true });
        this.setState({
          modalBody: (
            <div>
              <h1>You already Checked Out</h1>
            </div>
          ),
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
        return;
      } else if (this.state.valuesMatched[5].includes('Not Checked In')) {
        this.setState({
          modalBody: (
            <div>
              <h1>{this.state.valuesMatched[5]}</h1>
            </div>
          ),
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
        return;
      } else {
        await executeValuesAppendCheckOut(
          checkInOut,
          this.state.valuesMatched[4]
        );
        await this.getSheetValuesDuration();
        this.setState({
          modalBody: (
            <div>
              {this.state.duration.includes('') === false ? (
                <h1>Duration {this.state.duration}</h1>
              ) : (
                ''
              )}
            </div>
          ),
        });
        let myModal = new Modal(document.getElementById('exampleModal'), {});
        myModal.show();
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
        <SearchBar onSubmit={this.onSearchSubmit} />
        {this.state.loading ? <LoadingSpinner /> : ''}
        <div>
          {this.state.numberExists.includes('') ? (
            ''
          ) : this.state.numberExists.includes('Not Exists') ? (
            <NewUserForm onSubmit={this.onNewUserFormSubmit} />
          ) : (
            <CheckInOut onSubmit={this.onCheckInOutSubmit} />
          )}
        </div>
        <MyModal body={this.state.modalBody} />
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
