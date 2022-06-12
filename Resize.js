const sharp = require('sharp');
const { v4: uuidv4 } = require('uuid');
// const path = require('path');

class Resize {
  // constructor(folder) {
  //   this.folder = folder;
  // }
  async format(buffer) {
    const fileName = Resize.fileName();
    // const filepath = this.filepath(filename);
    // console.log(filepath);
    
    const formattedFile = await sharp(buffer)
      .resize(400, 400, {
        fit: sharp.fit.inside,
        withoutEnlargement: true,
      })
      .toFormat("jpeg", {mozjpeg: true })
      .toBuffer();
      // .toFile(filepath);

    return {fileName: fileName, formattedFile: formattedFile};
  }
  static fileName() {
    return `${uuidv4()}`;
  }
  // filepath(filename) {
  //   return path.resolve(`${this.folder}/${filename}`)
  // }
}

module.exports = Resize;
