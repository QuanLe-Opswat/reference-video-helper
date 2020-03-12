import Papa from 'papaparse';
// import FileReaderService from './FileReaderService';

class FbReferenceService {

  async startUpload(fileConfig, filesUpload) {
    // Get config file info
    const configInfo = await this.getConfigInfo(fileConfig);

    if (!configInfo) {
      return { error: 'Read Config File Fail!!!' };
    }

    // validate video files

    // upload
    // const fr = new FileReaderService(filesUpload[0]);
    // fr.getChuck((result) => console.log(result));

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

  uploadVideo(file, name){

  }
}

export default new FbReferenceService();
