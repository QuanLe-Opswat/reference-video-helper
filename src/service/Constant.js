export default {
  ERROR_ServerSide: 'Server Error',
  ERROR_Network: 'Network error!!!',

  Config_type: ['csv', 'rule'],

  VIDEO_STATE : ['ready', 'running', 'fail', 'done'],

  GetHost: () => {
    if (window.location.hostname.includes('localhost')) {
      return 'http://localhost:8080';
    }
    return 'https://tiktok-7f5yfldkeq-de.a.run.app';
  },
};
