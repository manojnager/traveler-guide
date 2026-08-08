import api from "./api";

export const getAdminEmailLogs = async (params) => {
  const response = await api.get("/admin/email-logs", { params });
  return response.data.data;
};