/* eslint-disable arrow-body-style */
const punctuatify = (string) => {
  return string.replace(/[^\w@.,\s]/g, '').replace(/\s{2,}/g, ' ');
};

const slugify = (string) => {
  return string
    .toLowerCase()
    .replace(/\s+/g, '_') // Replace spaces with _
    .replace(/[^\w@.,]+/g, '') // Remove all non-word chars, accept @
    .replace(/__+/g, '_') // Replace multiple _ with single _
    .replace(/^_+/, '') // Trim - from start of text
    .replace(/_+$/, ''); // Trim - from end of text
};

const nonAccentVietnamese = (string) => {
  return (
    string
      .toLowerCase()
      .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
      .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
      .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
      .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
      .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
      .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
      .replace(/đ/g, 'd')
      // Some system encode vietnamese combining accent as individual utf-8 characters
      .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '') // Huyền sắc hỏi ngã nặng
      .replace(/\u02C6|\u0306|\u031B/g, '') // Â, Ê, Ă, Ơ, Ư
  );
};

export const slugifyVietnamese = (string) => {
  return slugify(punctuatify(nonAccentVietnamese(string)));
};
