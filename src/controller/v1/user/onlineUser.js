const { getAllOnlineUser: getAllOnlineUserLib } = require("@lib/v1/user");
const { functions } = require("@utils");

const getAllOnlineUser = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const filterData = {
      sortBy: req.query?.sortBy || "updatedAt",
      sortType: req.query?.sortType || "dsc",
      page: parseInt(req.query?.page) || 1,
      limit: parseInt(req.query?.limit) || 10,
    };

    const { users, counts } = await getAllOnlineUserLib({ userId, filterData });

    const pagination = await functions.paginationDetails({
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

    const responseData = {
      code: 200,
      message: "User data fetched successfully",
      data: users,
      pagination,
      self: req.url,
      links: hateoas,
    };

    res.status(200).json(responseData);
  } catch (err) {
    next(err);
  }
};

module.exports = getAllOnlineUser;
