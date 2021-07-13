import React from 'react';

class MyModal extends React.Component {
  render() {
    return (
      <div>
        <div
          className='modal fade'
          id='exampleModal'
          tabIndex='-1'
          aria-label='exampleModalLabel'
          aria-hidden='true'
        >
          <div className='modal-dialog'>
            <div className='modal-content'>
              <div className='modal-header'>
                {/* <h5 className='modal-title' id='exampleModalLabel'>
                  Modal title
                </h5> */}
                <button
                  type='button'
                  className='btn-close'
                  data-bs-dismiss='modal'
                  aria-label='Close'
                ></button>
              </div>
              <div className='modal-body'>{this.props.body}</div>
              <div className='modal-footer'>
                <button
                  type='button'
                  className='btn btn-stabraq'
                  data-bs-dismiss='modal'
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default MyModal;
