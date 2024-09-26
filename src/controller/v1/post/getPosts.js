const { getPosts: getPostsLib } = require("@lib/v1/post");
const { functions } = require("@utils");


const getPosts = async (req, res, next) => {
    try {
        const filterData = {
          sortBy: req.query?.sortBy || "updatedAt",
          sortType: req.query?.sortType || "dsc",
          page: parseInt(req.query?.page) || 1,
          limit: parseInt(req.query?.limit) || 10,
          search: req.query?.search || "",
        };
    
        const { posts, counts } = await getPostsLib({
          userId: req.user.id,
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
          message: "Posts fetched successfully",
          data: posts,
          pagination,
          self: req.url,
          links: hateoas,
        };
    
        res.status(200).json(response);
    }catch(err) {
        next(err);
    }
}

module.exports = getPosts;