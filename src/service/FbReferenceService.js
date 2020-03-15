import Papa from 'papaparse';
import FileReaderService from './FileReaderService';
import Constant from './Constant.js';

const { Config_type } = Constant;

class FbReferenceService {

  startUpload({ pageData, api, video, callback }) {

    // Upload Initial
    const fr = new FileReaderService(video.file);
    const fullSize = fr.getSize();
    const id = video.id;

    let isCancel = false;

    new Promise(async resolve => {
      try {
        let response = await api.initialUploadVideo({ token: pageData.access_token, fileSize: fullSize, pageId: pageData.id });
        // console.log(response);
        const sessionId = response && response.upload_session_id;
        const videoId = response && response.video_id;

        while (response && isFinite(response.start_offset) && isFinite(response.end_offset)) {
          // Start upload
          const start = parseInt(response.start_offset);
          const end = parseInt(response.end_offset);
          if (start >= end)
            break;

          callback({ done: false, progress: Math.floor(start * 100 * 100/ fullSize) / 100, id });

          if (isCancel) {
            resolve({ success: false, isCancel });
            return;
          }

          response = await api.chunkUploadVideo({ pageId: pageData.id, token: pageData.access_token, chunk: fr.getChunk(start, end), offset: start, sessionId });
          // console.log(response);
        }

        // Publish Video
        await api.publishUploadVideo({ name: video.name, token: pageData.access_token, pageId: pageData.id, sessionId });

        // Create Copy right
        await api.CopyrightVideo({ token: pageData.access_token, pageId: pageData.id, ruleId: video.rule.id, videoId });

        resolve({ success: true, progress: 100 });
      } catch (e) {
        resolve({ success: false, error: e });
      }
    }).then(result => {
      callback({ done: true, ...result, id });
    }).catch(err => {
      callback({ done: true, success: false, error: err, id });
    });

    return () => isCancel = true; // Return cancelable
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

  async checkValid({ config, files, copyrights }) {
    if (config.type === Config_type[1]) {
      let videos = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const split = file.name.split('.');
        const name = split.length > 1 ? split.slice(0, split.length - 1).join('.') : file.name;
        if (copyrights.some(copy => copy.reference_file.title === name)) {
          return { success: false, error: `Video tên '${name}' đã tồn tại trong Right Management` };
        }
        videos.push({ id: Math.random(), file, name, rule: config.rule });
      }
      return { success: true, videos };
    } else {
      const configInfo = await this.getConfigInfo(config.file);
      if (!config) {
        return { success: false, error: 'Không thể đọc file CSV.' };
      }

      let data = configInfo.data;
      if (data.length - 1 !== files.length) {
        return { success: false, error: 'Số video bạn chọn và số video được cấu hình trong file CSV không bằng nhau.' };
      }

      const header = data[0];

      data = data.slice(1);
      let videos = [];
      for (let i = 0; i < data.length; i++) {
        let [file, name, rule] = data[i];
        rule = rule.trim();
        const ruleMatch = config.rules.filter(r => r.name.trim() === rule);
        if (ruleMatch.length <= 0) {
          return { success: false, error: `(Row ${i + 2}) | Rule: ${rule} => Không tồn tại` };
        }

        const fileMatch = files.filter(f => f.name === file);
        if (fileMatch.length <= 0) {
          return { success: false, error: `(Row ${i + 2}) | Video: ${file} => Không tồn tại trong các file được chọn` };
        }

        name = name.trim();
        if (name.length <= 0) {
          return { success: false, error: `(Row ${i + 2}) | Name: ${name} => Tên Không Hợp lệ` };
        }
        if (copyrights.some(copy => copy.reference_file.title === name)) {
          return { success: false, error: `(Row ${i + 2}) | Name: ${name} => Video này đã tồn tại trong Right Management` };
        }

        videos.push({ id: Math.random(), file: fileMatch[0], rule: ruleMatch[0], name });
      }

      return { success: true, videos, header };
    }
  }
}

export default new FbReferenceService();
