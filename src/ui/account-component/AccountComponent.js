import React, { useEffect, useMemo, useState } from 'react';
import FbApi from '../../service/FbApi';
import classnames from 'classnames';

import './AccountComponent.scss';

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
    // console.log('log:' + window.login_fb);
    window.addEventListener('loginEvent', loginEvent);
    window.addEventListener('loadFbEvent', fbLoadedEvent);

    return function() {
      window.removeEventListener('loginEvent', loginEvent);
      window.removeEventListener('loadFbEvent', fbLoadedEvent);
    };
  }, [loginEvent, fbLoadedEvent]);

  useEffect(() => {
    if (onPageChange)
      onPageChange(selectedPage);
  }, [onPageChange, selectedPage]);

  const fbDOM = useMemo(() => {
      if (!fbApi) {

        if (!fbLoaded) {
          return <span>Loading... Please wait!</span>;
        }

        return <div className="fb-login-button" data-width="" data-size="large" data-button-type="login_with"
                    data-layout="rounded" data-auto-logout-link="false" data-use-continue-as="false"
                    data-onlogin="onLogin()"
                    data-scope="public_profile,pages_show_list,publish_pages,manage_pages"
        />;
      }

      if (pagesData) {
        return pagesData.map(page => {
          const classes = classnames({ selected: selectedPage && page.id === selectedPage.id }, 'pageItem');
          /* eslint-disable jsx-a11y/click-events-have-key-events */
          /* eslint-disable jsx-a11y/no-static-element-interactions */
          return <div key={page.id} className={classes} onClick={() => onPageClick(page)}>
            <img height={30} width={30} src={page.picture.data.url}
                 alt={page.name}/>
            <span className='pageName'>{page.name}</span>
          </div>;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fbApi, pagesData, selectedPage, fbLoaded]);

  return <div className='accountComponent'>
    {fbDOM}
  </div>;
};

export default AccountComponent;
