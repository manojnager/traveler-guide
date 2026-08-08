import { successResponse } from "../../responses/apiResponse.js";
import {
  createContactMessage,
  getAdminContactMessages,
  getContactMessageById,
  updateContactMessageStatus,
  deleteContactMessage
} from "./contact.service.js";
import { createContactMessageSchema, updateContactMessageStatusSchema } from "./contact.validation.js";

export const store = async (req, res, next) => {
  try {
    const data = createContactMessageSchema.parse(req.body);
    const message = await createContactMessage(data);
    return successResponse(res, "Message sent successfully.", message, 201);
  } catch (error) {
    next(error);
  }
};

export const adminIndex = async (req, res, next) => {
  try {
    const messages = await getAdminContactMessages(req.query);
    return successResponse(res, "Messages fetched successfully.", messages);
  } catch (error) {
    next(error);
  }
};

export const adminShow = async (req, res, next) => {
  try {
    const message = await getContactMessageById(req.params.id);
    return successResponse(res, "Message fetched successfully.", message);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { status } = updateContactMessageStatusSchema.parse(req.body);
    const message = await updateContactMessageStatus(req.params.id, status);
    return successResponse(res, "Message status updated successfully.", message);
  } catch (error) {
    next(error);
  }
};

export const destroy = async (req, res, next) => {
  try {
    await deleteContactMessage(req.params.id);
    return successResponse(res, "Message deleted successfully.", null);
  } catch (error) {
    next(error);
  }
};