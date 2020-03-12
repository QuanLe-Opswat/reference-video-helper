/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// const path = require(`path`);

exports.createPages = ({ actions }) => {
  const { createPage } = actions;

  createPage({
    path: `/`,
    component: require.resolve('./src/pages/index.js'),
    context: { page: 'home' },
  });

  createPage({
    path: `/policy`,
    component: require.resolve('./src/pages/policy/policy.js'),
    context: {},
  });
};
