import React, { useState } from 'react';
import { Helmet } from "react-helmet"
import { Col, Row } from 'react-bootstrap';
import ConfigComponent from '../../ui/config-component/ConfigComponent';
import SelectFile from '../../ui/select-file/SelectFile';

import './FbReferenceUpload.scss';
import AccountComponent from '../../ui/account-component/AccountComponent';
import UploadContainer from '../../ui/upload-container/UploadContainer';

const FbReferenceUpload = () => {
  const [pageData, setPageData] = useState(undefined);
  const [fbApi, setFbApi] = useState(undefined);

  const [config, setConfig] = useState(undefined);
  const [copyrights, setCopyrights] = useState([]);
  const [filesUpload, setFilesUpload] = useState([]);

  const [disabled, setDisabled] = useState(false);

  const onStart = () => {
    setDisabled(true);
  };

  const onReset = () => {
    setFbApi(undefined);
    setPageData(undefined);
  };

  return <div className='fbReferenceUpload'>
    <Helmet>
      <script>
        {`
        function onLogin() {
          window.dispatchEvent(window.loginEvent);
        }
        window.loginEvent = new Event("loginEvent");
        function onFbApiLoaded() {
          window.dispatchEvent(window.loadFbEvent);
        }
        window.loadFbEvent = new Event("loadFbEvent");`}
      </script>
      <script async defer crossOrigin="anonymous"
              src="https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v6.0&appId=214048743043727&autoLogAppEvents=1"
              onLoad="onFbApiLoaded()"/>
    </Helmet>
    <Row>
      <Col md={3} className='leftPanel'>
        <Row>
          <div className='fbBtnContainer'>
            <AccountComponent onLogin={(api) => setFbApi(api)} onPageChange={(page) => setPageData(page)} disabled={disabled}/>
          </div>
        </Row>
        <Row className='configContainer'>
          <ConfigComponent fbApi={fbApi} pageData={pageData} onChange={(value) => setConfig(value)} disabled={disabled} onCopyrights={(copyright) => setCopyrights(copyright)}/>
        </Row>
        <Row>
          <SelectFile onChange={(files) => setFilesUpload(files)} disabled={disabled}/>
        </Row>
      </Col>
      <Col md={9} className='rightPanel'>
        <UploadContainer config={config} copyrights={copyrights} pageData={pageData} fbApi={fbApi} files={filesUpload} onStart={onStart} onReset={onReset}/>
      </Col>
    </Row>

  </div>;
};

export default FbReferenceUpload;
