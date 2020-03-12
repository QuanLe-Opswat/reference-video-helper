import React from 'react';
import { Spinner } from 'react-bootstrap';

import './LoadingComponent.scss';

const LoadingComponent = () => {

  return <div className='loadingComponent'>
    <Spinner animation="border" variant="primary"> </Spinner>
  </div>;
};

export default LoadingComponent;

