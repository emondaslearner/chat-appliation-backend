const fs = require("fs");

const deleteUploadedFile = async (filePath) => {
  try {
    await fs.unlink(filePath);
    console.log(`Deleted uploaded file: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting uploaded file: ${error.message}`);
  }
};

// pagination
const paginationDetails = ({ page, limit, totalResources }) => {
  const totalPage = Math.ceil(totalResources / limit);

  const nxtPage = totalPage > page && page + 1;
  const prvPage = page > 1 && page - 1;

  const response = {
    page,
    limit,
    totalPage,
    totalResources,
  };

  if (nxtPage) response.nxtPage = nxtPage;
  if (prvPage) response.prvPage = prvPage;

  return response;
};

const generateQueryString = ({ queryObject = {} }) => {
  const queryString = Object.keys(queryObject)
    .filter(
      (key) =>
        queryObject[key] !== undefined &&
        queryObject[key] !== null &&
        queryObject[key] !== ""
    )
    .map(
      (key) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(queryObject[key])}`
    )
    .join("&");

  return queryString ? `?${queryString}` : "";
};

// links
const paginationLinks = async ({
  path = "/",
  page = 1,
  query = {},
  hasPrev = false,
  hasNext = false,
}) => {
  const links = {};

  if (hasPrev) {
    const queryString = await generateQueryString({
      queryObject: { ...query, page: page - 1 },
    });
    links.prvPage = `${path}/${queryString}`;
  }

  if (hasNext) {
    const queryString = await generateQueryString({
      queryObject: { ...query, page: page + 1 },
    });
    links.nxtPage = `${path}/${queryString}`;
  }

  return links;
};

// count post
const countEntities = async (model, filter) => {
  const counts = await model.countDocuments(filter);

  return counts;
};

module.exports = {
  deleteUploadedFile,
  paginationDetails,
  paginationLinks,
  countEntities,
};
