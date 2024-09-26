const { getAllPhoto: getAllPhotoLib } = require("@lib/v1/photo");
const { functions } = require("@utils");

const getAllPhoto = async (req, res, next) => {
  try {
    const userId = req.query.id || req.user.id;
    const filterData = {
      search: req.query?.search ? req.query?.search : "",
      sortBy: req.query?.sortBy ? req.query?.sortBy : "updatedAt",
      sortType: req.query?.sortType ? req.query?.sortType : "dsc",
      page: req.query?.page ? parseInt(req.query?.page) : 1,
      limit: req.query?.limit ? parseInt(req.query?.limit) : 10,
    };

    const { photos, counts } = await getAllPhotoLib({ userId, filterData });

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
      message: "Fetched photos successfully",
      data: photos,
      pagination,
      self: req.url,
      links: hateoas,
    };

    res.status(response.code).json(response);
  } catch (err) {
    next(err);
  }
};

module.exports = getAllPhoto;
