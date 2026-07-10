import { errorResponse } from "../responses/apiResponse.js";

const notFound = (req, res) => {
  return errorResponse(
    res,
    `Route ${req.originalUrl} not found.`,
    404
  );
};

export default notFound;