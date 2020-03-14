class FileReaderService {
  constructor(file) {
    this.file = file;
  }

  getSize() {
    return this.file.size;
  }

  getChunk(start, end) {
    return this.file.slice(start, end);
  };
}

export default FileReaderService;


