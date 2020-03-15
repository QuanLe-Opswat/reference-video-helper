import axios from 'axios';

const REGULAR_URL = 'https://graph.facebook.com/';
const VIDEO_URL = 'https://graph-video.facebook.com/';

class FbApi {
  constructor(fbLoginResponse) {
    this.instanceRegular = axios.create({
      baseURL: REGULAR_URL,
      timeout: 10000,
    });
    this.instanceVideo = axios.create({
      baseURL: VIDEO_URL,
      timeout: 60000,
    });
    this.fbLoginResponse = fbLoginResponse;
    this.accessToken = fbLoginResponse.accessToken;
  }

  buildUrlParams({ id, edge, params, fields, access_token }) {
    const url = `${id}${edge ? `/${edge}` : ''}`;

    if (access_token !== false) {
      params = { ...params, access_token: access_token ? access_token : this.accessToken };
    }
    if (fields && Array.isArray(fields)) {
      params = { ...params, fields: fields.join(',') };
    }
    return { url, params };
  }

  get({ id, edge, params, fields, access_token, isVideo }) {
    const { url, params: paramsBuilt } = this.buildUrlParams({ id, edge, params, fields, access_token });
    const instance = isVideo ? this.instanceVideo : this.instanceRegular;
    return instance.get(url, {
      params: paramsBuilt,
    });
  }

  post({ id, edge, params, fields, data, isVideo }) {
    const { url, params: paramsBuilt } = this.buildUrlParams({ id, edge, params, fields, access_token: false });

    const bodyFormData = new FormData();
    for (const key in data) {
      if (data.hasOwnProperty(key)) {
        bodyFormData.append(key, data[key]);
      }
    }

    let config = { params: paramsBuilt };
    const instance = isVideo ? this.instanceVideo : this.instanceRegular;
    return instance.post(url, bodyFormData, config);
  }

  async getPagesInfo() {
    const response = await this.get({ id: this.fbLoginResponse.id, fields: ['data'], edge: 'accounts' });
    if (response && response.data && response.data.data && response.data.data.length > 0) {
      // Get page detail
      return await Promise.all(response.data.data.map(async (page) => {
        const pageId = page.id;
        const res = await this.get({ id: pageId, fields: ['id,name,picture,access_token'] });
        if (res && res.data) {
          return res.data;
        }
      }));
    }
  }

  async getPageRules(page) {
    const id = page.id;
    const access_token = page.access_token;
    const response = await this.get({ id, fields: ['name', 'id'], edge: 'video_copyright_rules', access_token });
    return response.data.data;
  }

  async getPageCopyright(page) {
    const id = page.id;
    const access_token = page.access_token;
    const limit = 25;
    let after = undefined;
    let data = [];
    do {
      let params = { limit };
      if (after) {
        params = { ...params, after };
      }
      const response = await this.get({ id, fields: ['id', 'reference_file'], edge: 'video_copyrights', access_token, params });
      data = [...data, ...response.data.data];
      after = response.data.paging && response.data.paging.next ? response.data.paging.cursors.after : undefined;
    } while (after);

    return data;
  }

  async initialUploadVideo({ pageId, token, fileSize }) {
    let response = await this.post({
      isVideo: true,
      id: pageId,
      edge: 'videos',
      data: {
        access_token: token,
        upload_phase: 'start',
        file_size: fileSize,
      },
    });

    if (response && response.data)
      return response.data;
  }

  async chunkUploadVideo({ pageId, token, sessionId, chunk, offset }) {
    let response = await this.post({
      isVideo: true,
      id: pageId,
      edge: 'videos',
      data: {
        access_token: token,
        upload_phase: 'transfer',
        start_offset: offset,
        upload_session_id: sessionId,
        video_file_chunk: chunk,
      },
    });

    if (response && response.data)
      return response.data;
  }

  async publishUploadVideo({ name, pageId, token, sessionId }) {
    let response = await this.post({
      isVideo: true,
      id: pageId,
      edge: 'videos',
      data: {
        access_token: token,
        upload_phase: 'finish',
        upload_session_id: sessionId,
        reference_only: true,
        published: false,
        title: name,
      },
    });

    if (response && response.data)
      return response.data;
  }

  async CopyrightVideo({ pageId, token, videoId, ruleId }) {
    let response = await this.post({
      id: pageId,
      edge: 'video_copyrights',
      data: {
        access_token: token,
        is_reference_video: true,
        rule_id: ruleId,
        copyright_content_id: videoId,
      },
    });

    if (response && response.data)
      return response.data;
  }
}

export default FbApi;
