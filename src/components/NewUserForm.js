import React from 'react';
import { checkForMobNum } from './validation';

class NewUserForm extends React.Component {
  state = {
    userName: '',
    mobile: '',
    email: '',
    membership: '',
    validate: { userName: null, mobile: null, email: null, membership: null },
  };

  onNewUserFormSubmit = async (event) => {
    event.preventDefault();
    const validMobile = await checkForMobNum(this.state.mobile);
    this.setState({ validate: { mobile: validMobile } });
    if (this.state.validate.mobile === false) return;

    this.props.onSubmit({
      userName: this.state.userName,
      mobile: this.state.mobile,
      email: this.state.email,
      membership: this.state.membership,
    });
  };

  myChangeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };

  render() {
    return (
      <div className='ui segment'>
        <form className='ui form'>
          <div>
            {this.state.userName !== '' && this.state.userName.length > 3 ? (
              <h1>Hello {this.state.userName}</h1>
            ) : (
              ''
            )}
          </div>
          <div className='field'>
            <label>User Name</label>
            <input
              type='text'
              name='userName'
              onChange={this.myChangeHandler}
            />
            <label>Mobile Number</label>
            <input
              type='text'
              name='mobile'
              onChange={this.myChangeHandler}
              maxLength={11}
            />
            {this.state.validate.mobile === null ||
            this.state.validate.mobile === true ? (
              ''
            ) : (
              <div className='alert alert-danger' role='alert'>
                Enter valid mobile number
              </div>
            )}
            <label>E-Mail Address</label>
            <input type='text' name='email' onChange={this.myChangeHandler} />
            <label>
              Membership
              <select name='membership' onChange={this.myChangeHandler}>
                <option value=''>...Select...</option>
                <option value='Not Member'>Not Member</option>
                <option value='Green'>Green</option>
                <option value='Orange'>Orange</option>
                <option value='Business'>Business</option>
                <option value='Ten Days'>Ten Days</option>
                <option value='Hours'>Hours</option>
              </select>
            </label>

            <button
              className='ui primary button stabraq-bg'
              onClick={this.onNewUserFormSubmit}
              type='submit'
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    );
  }
}

export default NewUserForm;
