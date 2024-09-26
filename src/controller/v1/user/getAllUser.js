const { getAllUser: getAllUserLib } = require("@lib/v1/user");
const { functions } = require("@utils");

const getAllUser = async (req, res, next) => {
  try {
    const filterData = {
      sortBy: req.query?.sortBy || "updatedAt",
      sortType: req.query?.sortType || "dsc",
      page: parseInt(req.query?.page) || 1,
      limit: parseInt(req.query?.limit) || 10,
      search: req.query?.search || "",
    };

    const { users, counts } = await getAllUserLib({
      filterData,
      userId: req.user.id,
      type: req.query.type || "all"
    });

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

    const response = {
      code: 200,
      message: "User fetched successfully",
      data: users,
      pagination,
      self: req.url,
      links: hateoas,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = getAllUser;