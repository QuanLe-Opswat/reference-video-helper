import React from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import Constant from '../../service/Constant';

import './UploadSummary.scss';
import '../../style/fa/all.min.css';

const { VIDEO_STATE } = Constant;

const UploadSummary = ({ videos, onStartAll, onStopAll, onRetryAll }) => {

  const ready = videos.filter(v => !v.state || v.state === VIDEO_STATE[0]).length;
  const running = videos.filter(v => v.state && v.state === VIDEO_STATE[1]).length;
  const fail = videos.filter(v => v.state && v.state === VIDEO_STATE[2]).length;
  const done = videos.filter(v => v.state && v.state === VIDEO_STATE[3]).length;

  return <div className='uploadSummary'>
    <Card>
      <Card.Body>
        <Row>
          <Col xs={4}>
            <div>
              <i className='fas fa-flag'/>
              READY
            </div>
          </Col>
          <Col xs={4}>
            <div>
              {ready}
            </div>
          </Col>
          <Col xs={4}>
            <Button size='sm' onClick={onStartAll} variant='outline-primary' disabled={ready <= 0}>
              START ALL
            </Button>
          </Col>
        </Row>

        <Row>
          <Col xs={4} className='running'>
            <div>
              <i className='fas fa-play'/>
              RUNNING
            </div>
          </Col>
          <Col xs={4} className='running'>
            <div>
              {running}
            </div>
          </Col>
          <Col xs={4}>
            <Button size='sm' variant='outline-warning' onClick={onStopAll} disabled={running <= 0}>
              STOP ALL
            </Button>
          </Col>
        </Row>

        <Row>
          <Col xs={4} className='fail'>
            <div>
              <i className='fas fa-times-circle'/>
              FAIL
            </div>
          </Col>
          <Col xs={4} className='fail'>
            <div>
              {fail}
            </div>
          </Col>
          <Col xs={4}>
            <Button size='sm' variant='outline-info' onClick={onRetryAll} disabled={fail <= 0}>
              RETRY ALL
            </Button>
          </Col>
        </Row>

        <Row>
          <Col xs={4} className='done'>
            <div>
              <i className='fas fa-check-circle'/>
              DONE
            </div>
          </Col>
          <Col xs={4} className='done'>
            <div>
              {done}
            </div>
          </Col>
          <Col xs={4}>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  </div>;
};

export default UploadSummary;
