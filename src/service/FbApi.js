import axios from 'axios';

class FbApi {
  constructor(fbLoginResponse) {
    this.instance = axios.create({
      baseURL: 'https://graph.facebook.com/',
      timeout: 10000,
    });
    this.fbLoginResponse = fbLoginResponse;
    this.accessToken = fbLoginResponse.accessToken;
  }

  get({ id, edge, params, fields }) {
    const url = `${id}${edge ? `/${edge}` : ''}`;

    params = params ? params : {};
    params = { ...params, access_token: this.accessToken };
    if (fields && Array.isArray(fields)) {
      params = { ...params, fields: fields.join(',') };
    }

    return this.instance.get(url, {
      params,
    });
  }

  async getPageInfo() {
    let response = await this.get({ id: this.fbLoginResponse.id, fields: ['data'], edge: 'accounts' });
    if (response && response.data && response.data.data && response.data.data.length > 0) {
      // Get page detail
      const pageId = response.data.data[0].id;
      response = await this.get({ id: pageId, fields: ['id,name,picture'] });
      if (response && response.data) {
        return response.data;
      }
    }
  }

  async uploadVideo(file, name, pageId) {

  }
}

export default FbApi;