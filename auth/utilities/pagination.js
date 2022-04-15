const pagination = ({ totalCount, data, limit, pageNum }) => {
  if (totalCount <= 0)
    return {
      pager: {
        offset: 0,
        limit: 0,
        currentPageNum: 0,
        totalCount: 0,
        hasPrev: false,
        hasNext: false,
        prevPageNum: undefined,
        nextPageNum: undefined,
        lastPageNum: 0,
      },
      data: [],
    };

  const totalPage = Math.ceil(totalCount / limit);
  const currentPageNum = totalPage >= pageNum ? pageNum : 1; // <= totalPage ? pageNum : totalPage;
  const hasPrev = currentPageNum > 1;
  const hasNext = currentPageNum < totalPage;
  const offset = currentPageNum > 0 ? (currentPageNum - 1) * limit : 0;

  return {
    pager: {
      offset,
      limit,
      currentPageNum,
      totalCount,
      hasPrev,
      hasNext,
      prevPageNum: hasPrev ? currentPageNum - 1 : undefined,
      nextPageNum: hasNext ? currentPageNum + 1 : undefined,
      lastPageNum: totalPage,
    },
    data,
  };
};

module.exports = pagination;
