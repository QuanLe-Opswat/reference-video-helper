import Papa from 'papaparse';
import FileReaderService from './FileReaderService';

class FbReferenceService {

  async startUpload(fileConfig, filesUpload, pageData, api) {
    // Get config file info
    const configInfo = await this.getConfigInfo(fileConfig);

    if (!configInfo) {
      return { error: 'Read Config File Fail!!!' };
    }

    // validate video files

    // Upload Initial
    const fr = new FileReaderService(filesUpload[0]);
    const fullSize = fr.getSize();

    let response = await api.initialUploadVideo({ token: pageData.access_token, fileSize: fullSize, pageId: pageData.id });
    console.log(response);
    const sessionId = response && response.upload_session_id;
    const videoId = response && response.video_id;

    while (response && isFinite(response.start_offset) && isFinite(response.end_offset)) {
      // Start upload
      const start = parseInt(response.start_offset);
      const end = parseInt(response.end_offset);
      if (start >= end)
        break;

      response = await api.chunkUploadVideo({ pageId: pageData.id, token: pageData.access_token, chunk: fr.getChunk(start, end), offset: start, sessionId });
      console.log(response);
    }

    console.log('Done !!!');

    // Publish Video
    response = await api.publishUploadVideo({ name: 'test video - ' + filesUpload[0].name, token: pageData.access_token, pageId: pageData.id, sessionId });
    console.log(response);

    // Create Copy right


    return {};
  }

  getConfigInfo(fileConfig) {
    return new Promise(resolve => {
      Papa.parse(fileConfig, {
        complete: function(results) {
          console.log(results);
          resolve(results);
        },
        error: function() {
          resolve(undefined);
        },
      });
    });
  }

  uploadVideo(file, name) {

  }
}

export default new FbReferenceService();
