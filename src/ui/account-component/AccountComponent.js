import React, { useEffect, useMemo, useState } from 'react';
import FacebookLogin from 'react-facebook-login';
import FbApi from '../../service/FbApi';
import classnames from 'classnames';

import './AccountComponent.scss';

const AccountComponent = ({ onLogin, onPageChange, disabled }) => {
  const [pagesData, setPagesData] = useState(undefined);
  const [fbApi, setFbApi] = useState(undefined);

  const [selectedPage, setSelectedPage] = useState(undefined);

  const responseFacebook = async (response) => {
    console.log(response);
    if (response && response.name && response.accessToken) {
      const api = new FbApi(response);
      setFbApi(api);
      onLogin(api);
    }
  };

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

  useEffect(() => {
    if (onPageChange)
      onPageChange(selectedPage);
  }, [onPageChange, selectedPage]);

  const fbDOM = useMemo(() => {
      if (!fbApi) {
        return <FacebookLogin
          appId="214048743043727"
          fields="name,email,picture,permissions"
          scope="public_profile,pages_show_list,publish_pages,manage_pages"
          manage_pages
          size='small'
          icon="fa-facebook"
          callback={responseFacebook}/>;
      }

      if (pagesData) {
        return pagesData.map(page => {
          const classes = classnames({ selected: selectedPage && page.id === selectedPage.id }, 'pageItem');
          /* eslint-disable jsx-a11y/click-events-have-key-events */
          /* eslint-disable jsx-a11y/no-static-element-interactions */
          return <div key={page.id} className={classes} onClick={() => onPageClick(page)}>
            <img height={page.picture.data.height / 2} width={page.picture.data.width / 2} src={page.picture.data.url}
                 alt={page.name}/>
            <span className='pageName'>{page.name}</span>
          </div>;
        });
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fbApi, pagesData, selectedPage]);

  return <div className='accountComponent'>
    {fbDOM}
  </div>;
};

export default AccountComponent;
