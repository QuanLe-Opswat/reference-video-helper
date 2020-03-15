import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';

import './SelectFile.scss';

const SelectFile = ({ onChange, disabled }) => {
  const filesRef = useRef(null);
  const [filesUpload, setFilesUpload] = useState([]);

  const onFilesChange = (e) => {
    const files = [].slice.call(e.target.files, 0);
    setFilesUpload(files);
    onChange(files);
  };

  return <div>
    <input style={{ display: 'none' }} type='file' ref={filesRef} multiple onChange={onFilesChange}
           accept='video/*'
    />
    <div>
      <Button size='sm' variant='outline-primary' onClick={() => filesRef.current.click()} disabled={disabled}>
        {filesUpload.length > 0 ? `Selected: ${filesUpload.length} files` : 'Select Video Files'}
      </Button>
    </div>
  </div>;
};

export default SelectFile;
