import React from 'react';
import { Card, Col, ProgressBar, Row } from 'react-bootstrap';
import Constant from '../../service/Constant';
import classnames from 'classnames';

import './FileUpload.scss';
import '../../style/fa/all.min.css';

const { VIDEO_STATE } = Constant;

const FileUpload = ({ video }) => {

  const progress = video.progress ? video.progress : 0;
  const state = video.state ? video.state : VIDEO_STATE[0];
  const stateClass = classnames(state);
  const className = classnames(stateClass, 'fileUpload');

  return <div className={className}>
    <Card>
      <Card.Body>
        <Row>
          <Col xs={1}>
            <i className='fas fa-file-signature'/>
          </Col>
          <Col xs={11}>
            <span className='name'>
              {video.name}
            </span>
          </Col>
        </Row>

        <Row>
          <Col xs={1}>
            <i className='fas fa-file-alt'/>
          </Col>
          <Col xs={11}>
            <span className='file'>
              {video.file.name}
            </span>
          </Col>
        </Row>

        <Row>
          <Col xs={1}>
            <i className='fas fa-fingerprint'/>
          </Col>
          <Col xs={11}>
            <span className='rule'>
              {video.rule.name}
            </span>
          </Col>
        </Row>

        <Row>
          <Col xs={1}>
            <i className='fas fa-cloud-upload-alt'/>
          </Col>
          <Col xs={11}>
            <ProgressBar variant={state === VIDEO_STATE[2] ? 'danger' : state === VIDEO_STATE[3] ? 'success' : 'primary'} now={progress} label={`${progress}%`}/>
          </Col>
        </Row>

      </Card.Body>
    </Card>
  </div>;
};

export default FileUpload;
