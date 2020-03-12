import React, { useMemo, useRef, useState } from 'react';
import { Col, Row, Button } from 'react-bootstrap';
import FbReferenceService from '../../service/FbReferenceService';
import FacebookLogin from 'react-facebook-login';
import FbApi from '../../service/FbApi';

import './FbReferenceUpload.scss';
import LoadingComponent from '../../ui/loading/LoadingComponent';

const FbReferenceUpload = () => {

  const configRef = useRef(null);
  const [fileConfig, setFileConfig] = useState(undefined);

  const filesRef = useRef(null);
  const [filesUpload, setFilesUpload] = useState([]);

  const [pageData, setPageData] = useState(undefined);

  const [startUploading, setStartUploading] = useState(false);

  const onConfigChange = (e) => {
    setFileConfig(e.target.files[0]);
    // parse csv file: https://www.papaparse.com/
  };

  const onFilesChange = (e) => {
    const files = [];
    for (let i = 0; i < e.target.files.length; i++) {
      files.push(e.target.files[i]);
    }
    setFilesUpload(files);
  };

  const onStartClick = async () => {
    // console.log(filesUpload);
    // await FbReferenceService.startUpload(fileConfig, filesUpload);
    setStartUploading(true);
  };

  let fbApi = undefined;
  const responseFacebook = async (response) => {
    console.log(response);
    if (response && response.name && response.accessToken) {
      fbApi = new FbApi(response);
      const pageData = await fbApi.getPageInfo();
      setPageData(pageData);
      console.log(pageData);
    }
  };

  const fbDOM = useMemo(() =>
      (!pageData ?
        <FacebookLogin
          appId="214048743043727"
          fields="name,email,picture,permissions"
          scope="public_profile,pages_show_list,publish_pages,manage_pages"
          manage_pages
          size='small'
          icon="fa-facebook"
          callback={responseFacebook}/> :
        <div>
          <img height={pageData.picture.height} width={pageData.picture.width} src={pageData.picture.data.url}
               alt={pageData.name}/>
          <span className='pageName'>{pageData.name}</span>
        </div>),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageData]);

  const startDOM = useMemo(() => {
      if (!startUploading) {
        return <Button size='sm' variant='outline-primary'
                       onClick={onStartClick}
                       disabled={!(fileConfig && filesUpload && filesUpload.length > 0)}>
          Start Upload
        </Button>;
      }

      return <LoadingComponent/>;
    },
    [startUploading, fileConfig, filesUpload]);

  return <div className='fbReferenceUpload'>
    <Row>
      <Col lg={3} className='leftPanel'>
        <Row className='configContainer'>
          <div>
            <h5>
              File Configurator
            </h5>
            <input type='file' accept='.csv' ref={configRef} onChange={onConfigChange} style={{ display: 'none' }}/>
            <div>
              <Button size='sm' variant='outline-primary' onClick={() => configRef.current.click()}>
                Select Config file (*.csv)
              </Button>
              <p className='configFileName'>
                {fileConfig && fileConfig.name}
              </p>
            </div>
            <small>... download template here!!!</small>
          </div>
        </Row>
        <Row>
          <div>
            <h5>
              File Upload
            </h5>
            <input style={{ display: 'none' }} type='file' ref={filesRef} multiple onChange={onFilesChange}
                   accept='video/*'
            />
            <div>
              <Button size='sm' variant='outline-primary' onClick={() => filesRef.current.click()}>
                Select Files
              </Button>
              <p className='uploadFileInfo'>
                Upload files: <b>{filesUpload.length}</b>
              </p>
            </div>
          </div>
        </Row>
      </Col>
      <Col lg={9} className='rightPanel'>
        <Row>
          <div className='controlPanel'>
            <h5>
              Control Panel
            </h5>
            <div>
              <div className='fbBtnContainer'>
                {fbDOM}
              </div>
              {startDOM}
            </div>
          </div>
        </Row>
      </Col>
    </Row>

  </div>;
};

export default FbReferenceUpload;
