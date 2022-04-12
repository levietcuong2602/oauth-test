/* eslint-disable no-restricted-syntax */
export const getRangesObjectFromArray = (ranges, { initArray = false }) => {
  const rangesObject = {};
  if (initArray) {
    for (const range of ranges) {
      if (range.end && !range.start) {
        rangesObject[`lte_${range.end}`] = [];
      } else if (!range.end && range.start) {
        rangesObject[`gte_${range.start}`] = [];
      } else if (range.end && range.start) {
        rangesObject[`between_${range.start}_and_${range.end}`] = [];
      }
    }
  } else {
    for (const range of ranges) {
      if (range.end && !range.start) {
        rangesObject[`lte_${range.end}`] = 0;
      } else if (!range.end && range.start) {
        rangesObject[`gte_${range.start}`] = 0;
      } else if (range.end && range.start) {
        rangesObject[`between_${range.start}_and_${range.end}`] = 0;
      }
    }
  }

  return rangesObject;
};
