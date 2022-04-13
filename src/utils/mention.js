/* eslint-disable arrow-body-style */
const MENTION_REGEX = new RegExp('@{{.+?\\|\\|.+?}}', 'g');

export const getPlainText = (content) => {
  return content.replace(MENTION_REGEX, (m) => {
    const arr = m.split('||');
    const display = arr[1].slice(0, -2);
    return display;
  });
};

export const parseMention = (content) => {
  return content.replace(MENTION_REGEX, (m) => {
    const arr = m.split('||');
    const id = arr[0].slice(3);
    return `@{{${id}}}`;
  });
};

export const replaceMentionNotExist = (content, memtions) => {
  return content.replace(MENTION_REGEX, (m) => {
    const arr = m.split('||');
    const id = arr[0].slice(3);
    const display = arr[1].slice(0, -2);
    const mentionIndex = memtions.findIndex((item) => item.id === id);
    if (mentionIndex !== -1) return m;
    return display;
  });
};
