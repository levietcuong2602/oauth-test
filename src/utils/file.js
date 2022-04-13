const MB_UNIT = 1024 * 1024;

const checkFileSize = (file, maxSize = 5) => {
  if (!file || !file.size) return false;
  return file.size / MB_UNIT < maxSize;
};

const getFileExtension = (file) => {
  if (!file) return null;
  return file.name.split('.').pop();
};

const getFileName = (url) => {
  if (!url) return '';
  let fileName = url.split('/').pop();
  if (fileName.includes('?')) {
    fileName = fileName.substring(0, fileName.indexOf('?'));
  }
  return fileName;
};

export { checkFileSize, getFileExtension, getFileName };
