import React from 'react';

class LoadingSpinner extends React.Component {
  render() {
    return (
      <div className='text-center'>
        <div className='spinner-border text-stabraq' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </div>
      </div>
    );
  }
}

export default LoadingSpinner;
