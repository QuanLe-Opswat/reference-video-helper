import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const [fbApi, setFbApi] = useState(undefined);

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

  const onStartClick = useMemo(() => {
    return (async () => {
      // console.log(filesUpload);
      // setStartUploading(true);
      await FbReferenceService.startUpload(fileConfig, filesUpload, pageData, fbApi);
    });
  }, [fileConfig, filesUpload, pageData, fbApi]);

  const responseFacebook = async (response) => {
    console.log(response);
    if (response && response.name && response.accessToken) {
      setFbApi(new FbApi(response));
    }
  };

  useEffect(() => {
    (async () => {
      if (fbApi && !pageData) {
        const pageData = await fbApi.getPageInfo();
        setPageData(pageData);
        console.log(pageData);
      }
    })();
  }, [fbApi, pageData]);

  const fbDOM = useMemo(() =>
      (!pageData ?
        <FacebookLogin
          appId="214048743043727"
          // appId="251636472667546"
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
    [startUploading, fileConfig, filesUpload, onStartClick]);

  return <div className='fbReferenceUpload'>
    <Row>
      <Col md={3} className='leftPanel'>
        <Row>
          <div className='fbBtnContainer'>
            {fbDOM}
          </div>
        </Row>
        <Row className='configContainer'>
          <div>
            <input type='file' accept='.csv' ref={configRef} onChange={onConfigChange} style={{ display: 'none' }}/>
            <div>
              <Button size='sm' variant='outline-primary' onClick={() => configRef.current.click()}>
                {fileConfig ?  fileConfig.name : 'Select Config file (*.csv)'}
              </Button>
            </div>
            <small>Download template <a href='/templateFbReference.csv' target='_blank'>HERE</a>!!!</small>
          </div>
        </Row>
        <Row>
          <div>
            <input style={{ display: 'none' }} type='file' ref={filesRef} multiple onChange={onFilesChange}
                   accept='video/*'
            />
            <div>
              <Button size='sm' variant='outline-primary' onClick={() => filesRef.current.click()}>
                {filesUpload.length > 0 ? `Selected: ${filesUpload.length} files` : 'Select Video Files'}
              </Button>
            </div>
          </div>
        </Row>
      </Col>
      <Col md={9} className='rightPanel'>
        {startDOM}

      </Col>
    </Row>

  </div>;
};

export default FbReferenceUpload;
