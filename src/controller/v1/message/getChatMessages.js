const { getChatMessages: getChatMessagesLib } = require("@lib/v1/message");
const { functions } = require("@utils");

const getChatMessages = async (req, res, next) => {
  try {
    const filterData = {
      sortBy: req.query?.sortBy ? req.query?.sortBy : "updatedAt",
      sortType: req.query?.sortType ? req.query?.sortType : "dsc",
      page: req.query?.page ? parseInt(req.query?.page) : 1,
      limit: req.query?.limit ? parseInt(req.query?.limit) : 10,
    };

    const { counts, messages } = await getChatMessagesLib({
      userId: req.user.id,
      chatId: req.params?.id,
      filterData,
    });

    const pagination = functions.paginationDetails({
      page: filterData.page,
      limit: filterData.limit,
      totalResources: counts,
    });

    // hateoas
    const hateoas = await functions.paginationLinks({
      path: req.path,
      page: filterData.page,
      query: {
        ...filterData,
        page: parseInt(filterData.page),
        limit: parseInt(filterData.limit),
      },
      hasPrev: !!pagination.prvPage,
      hasNext: !!pagination.nxtPage,
    });

    const response = {
      code: 200,
      message: "Fetched friend requests successfully",
      data: messages,
      pagination,
      self: req.url,
      links: hateoas,
    };

    res.status(200).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = getChatMessages;
