/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from 'react';
import PropTypes from 'prop-types';
import { useStaticQuery, graphql, Link } from 'gatsby';
import { Helmet } from "react-helmet"
import Header from './header';
import { Button, Col, Row } from 'react-bootstrap';
import classname from 'classnames';

import './layout.scss';

const Layout = ({ children, page, isHideNav, pageTitle }) => {
  const data = useStaticQuery(graphql`
    query SiteTitleQuery {
      site {
        siteMetadata {
          title
        }
      }
    }
  `);

  const toolbarClass = classname({ 'isHideNav': isHideNav }, 'toolbar');

  const title = pageTitle ? pageTitle : data.site.siteMetadata.title;

  return (
    <div className='layout'>
      <Helmet>
        <meta charSet="utf-8" />
        <title>{title}</title>
      </Helmet>
      <Header siteTitle={title}/>
      <div className='layoutBody'>
        <Col>
          <Row>
            <div className={toolbarClass}>
              <Link to='/'>
                <Button variant={page === 'home' ? 'primary' : 'outline-primary'} size="sm">
                  Video
                </Button>
              </Link>
            </div>
          </Row>
          <Row>
            <main>{children}</main>
          </Row>
        </Col>
        <footer
          style={{ marginTop: '20px', textAlign: 'center' }}>
          © {new Date().getFullYear()}, Built by QuanLe
        </footer>
      </div>
    </div>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
