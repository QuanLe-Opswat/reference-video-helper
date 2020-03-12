import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import Layout from '../components/layout';
import FbReferenceUpload from '../components/fb-ref-upload/FbReferenceUpload';

const IndexPage = ({ pageContext }) => (
  <Layout page={pageContext?.page} isHideNav={true}>
    <FbReferenceUpload/>
  </Layout>
);

export default IndexPage;
