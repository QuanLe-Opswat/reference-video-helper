import React, { useEffect, useMemo, useState } from 'react';
import { Button } from 'react-bootstrap';
import FbApi from '../../service/FbApi';
import classnames from 'classnames';

import './AccountComponent.scss';
import '../../style/fa/all.min.css';

const AccountComponent = ({ onLogin, onPageChange, disabled }) => {
  const [fbLoaded, setFbLoaded] = useState(false);

  const [pagesData, setPagesData] = useState(undefined);
  const [fbApi, setFbApi] = useState(undefined);

  const [selectedPage, setSelectedPage] = useState(undefined);

  const onPageClick = (page) => {
    if (disabled) {
      return;
    }
    setSelectedPage(page);
  };

  useEffect(() => {
    (async () => {
      if (fbApi && !pagesData) {
        const pagesData = await fbApi.getPagesInfo();
        setPagesData(pagesData);
        console.log(pagesData);
        if (pagesData && pagesData.length > 0) {
          setSelectedPage(pagesData[0]);
        }
      }
    })();
  }, [fbApi, pagesData]);

  const loginEvent = useMemo(() => () => {
    const response = window.FB.getAuthResponse();
    if (response && response.userID && response.accessToken) {
      const api = new FbApi(response);
      setFbApi(api);
      onLogin(api);
    }
  }, [onLogin]);

  const fbLoadedEvent = useMemo(() => () => {
    setFbLoaded(true);
  }, []);

  useEffect(() => {
    window.addEventListener('loadFbEvent', fbLoadedEvent);

    return function() {
      window.removeEventListener('loadFbEvent', fbLoadedEvent);
    };
  }, [fbLoadedEvent]);

  useEffect(() => {
    if (onPageChange)
      onPageChange(selectedPage);
  }, [onPageChange, selectedPage]);

  const loginClick = async () => {
    const FB = window.FB;
    const response = await new Promise(resolve => FB.getLoginStatus(r => resolve(r)));

    if (response && response.status === 'connected') {
      loginEvent();
    } else {
      FB.login((r) => {
        if (r && r.status === 'connected') {
          loginEvent();
        }
      }, { scope: 'public_profile,pages_show_list,publish_pages,manage_pages' });
    }
  };

  const logoutClick = () => {
    const FB = window.FB;
    FB.logout(() => {
      setFbApi(undefined);
      setPagesData(undefined);
      setSelectedPage(undefined);
    });
  };

  const fbDOM = useMemo(() => {
      if (!fbApi) {
        if (!fbLoaded) {
          return <span>Loading... Please wait!</span>;
        }

        return <Button className='loginBtn' variant='primary' onClick={loginClick} disabled={disabled}>
          <i className='fab fa-facebook'/> Login to Facebook
        </Button>;
      }

      if (pagesData) {
        const pages = pagesData.map(page => {
          const classes = classnames({ selected: selectedPage && page.id === selectedPage.id }, 'pageItem');
          /* eslint-disable jsx-a11y/click-events-have-key-events */
          /* eslint-disable jsx-a11y/no-static-element-interactions */
          return <div key={page.id} className={classes} onClick={() => onPageClick(page)}>
            <img height={30} width={30} src={page.picture.data.url}
                 alt={page.name}/>
            <span className='pageName'>{page.name}</span>
          </div>;
        });

        return <>
          {pages}
          <Button className='logoutBtn' variant='outline-danger' size='sm' onClick={logoutClick} disabled={disabled}>
            Sign out
          </Button>
        </>;
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fbApi, pagesData, selectedPage, fbLoaded]);

  return <div className='accountComponent'>
    {fbDOM}
  </div>;
};

export default AccountComponent;
