import React from 'react';
import { Card } from 'react-bootstrap';

import './FileUpload.scss';

const FileUpload = ({ fileName }) => {

  return <div className='fileUpload'>
    <Card>
      <Card.Body>
        {fileName}
      </Card.Body>
    </Card>
  </div>;
};

export default FileUpload;
