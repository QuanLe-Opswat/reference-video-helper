import React, { useEffect, useMemo, useState } from 'react';
import FileUpload from '../file-upload/FileUpload';
import FbReferenceService from '../../service/FbReferenceService';
import Constant from '../../service/Constant';

import './UploadContainer.scss';
import { Alert, Button } from 'react-bootstrap';
import UploadSummary from '../upload-summary/UploadSummary';

const STATE = ['none', 'loading', 'invalid', 'done'];
const { VIDEO_STATE } = Constant;

const UploadContainer = ({ config, copyrights, files, fbApi, pageData, onStart }) => {

  const [state, setState] = useState(STATE[0]);
  const [lock, setLock] = useState(false);
  const [error, setError] = useState('');
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    (async () => {
      if (config && files && Array.isArray(files) && files.length > 0 && fbApi && pageData) {
        setState(STATE[1]);
        // Check valid
        const result = await FbReferenceService.checkValid({ config, files, copyrights });
        if (result.success) {
          setState(STATE[3]);
          setVideos(result.videos);
        } else {
          setState(STATE[2]);
          setError(result.error);
        }
      } else {
        setState(STATE[0]);
      }
    })();
  }, [config, files, fbApi, pageData, copyrights]);

  const videosDOM = useMemo(() => {
    return <ul>
      {videos.map((video) => <li key={video.id}>
        <FileUpload video={video}/>
      </li>)}
    </ul>;
  }, [videos]);

  const startUpload = useMemo(() => () => {
    if (onStart)
      onStart();
    setLock(true);
  }, [onStart]);

  // const reset = useMemo(() => () => {
  //   if (onReset)
  //     onReset();
  // }, [onReset]);

  const updateCallback = useMemo(() => (update) => {
    videos.filter(video => video.id === update.id).forEach(video => {
      if (update.progress !== undefined && isFinite(update.progress) && !isNaN(update.progress)) {
        video.progress = update.progress;
      }

      if (update.done) {
        video.state = update.success ? VIDEO_STATE[3] : VIDEO_STATE[2];
        if (update.isCancel) {
          video.state = VIDEO_STATE[0];
          video.progress = 0;
        }
      }
    });

    setVideos(videos.slice(0));
  }, [videos]);

  const startAll = useMemo(() => (anyVideos) => {
    const vs = anyVideos ? anyVideos : videos;
    const ready = vs.filter(v => !v.state || v.state === VIDEO_STATE[0]);
    ready.forEach(video => {
      video.state = VIDEO_STATE[1];
      video.progress = 0;
      video.cancel = FbReferenceService.startUpload({ pageData, api: fbApi, video, callback: updateCallback });
    });

    setVideos(vs.slice(0));
  }, [videos, fbApi, pageData, updateCallback]);

  const stopAll = useMemo(() => () => {
    const running = videos.filter(v => v.state && v.state === VIDEO_STATE[1]);
    running.forEach(video => {
      if (video.cancel)
        video.cancel();
    });
  }, [videos]);

  const retryAll = useMemo(() => () => {
    const fail = videos.filter(v => v.state && v.state === VIDEO_STATE[2]);
    fail.forEach(video => {
      video.state = VIDEO_STATE[0];
    });

    startAll(videos);
  }, [videos, startAll]);

  const controlDOM = useMemo(() => {
    if (!lock) {
      return <>
        <Button variant='outline-primary' size='sm' onClick={startUpload}>LOCK & READY</Button>
      </>;
    }
    return <>
      <UploadSummary videos={videos} onStartAll={() => startAll()} onStopAll={() => stopAll()} onRetryAll={() => retryAll()}/>
    </>;
  }, [startUpload, lock, videos, startAll, stopAll, retryAll]);

  const mainDOM = useMemo(() => {
    if (state === STATE[0]) {
      return <span>
        ...
      </span>;
    } else if (state === STATE[1]) {
      return <span>
        Loading...
      </span>;
    } else if (state === STATE[2]) {
      return <Alert variant='danger'>
        Error: {error}
      </Alert>;
    } else {
      return <>
        <div className='controlContainer'>
          {controlDOM}
        </div>
        {videosDOM}
      </>;
    }
  }, [state, error, videosDOM, controlDOM]);

  return <div className='uploadContainer'>
    {mainDOM}
  </div>;

};

export default UploadContainer;
