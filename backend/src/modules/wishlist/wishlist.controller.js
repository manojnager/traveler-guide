import { successResponse } from "../../responses/apiResponse.js";
import {
  getAdminWishlist,
  deleteWishlistItem
} from "./wishlist.service.js";

export const adminIndex = async (req, res, next) => {
  try {
    const wishlist = await getAdminWishlist(req.query);
    return successResponse(res, "Wishlist fetched successfully.", wishlist);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteWishlistItem(
      req.params.userId,
      req.params.destinationId
    );
    return successResponse(res, "Wishlist entry removed successfully.", null);
  } catch (error) {
    next(error);
  }
};