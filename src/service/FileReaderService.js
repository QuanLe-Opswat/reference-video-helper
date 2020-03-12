class FileReaderService {
  constructor(file) {
    this.file = file;
  }

  getSize() {
    return this.file.size;
  }

  getChuck(callback, chunkSize) {
    this.fileSize = this.getSize();
    this.chunkSize = chunkSize ? chunkSize : 64 * 1024; // bytes
    this.offset = 0;
    this.callback = callback;

    // now let's start the read with the first block
    this.chunkReaderBlock(this.offset, this.chunkSize, this.file);
  };

  chunkReaderBlock(_offset, length, _file) {
    const r = new FileReader();
    const blob = _file.slice(_offset, length + _offset);
    r.onload = (evt) => {
      if (evt.target.error == null) {
        this.offset += evt.target.result.length;
        this.callback(evt.target.result); // callback for handling read chunk
      } else {
        console.log('Read error: ' + evt.target.error);
        return;
      }
      if (this.offset >= this.fileSize) {
        console.log('Done reading file');
        return;
      }

      // of to the next chunk
      this.chunkReaderBlock(this.offset, this.chunkSize, this.file);
    };

    r.readAsText(blob);
  };
}

export default FileReaderService;


