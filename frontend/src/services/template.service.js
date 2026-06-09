import axios from "./root.service.js";

export async function createTemplate(data) {
  const response = await axios.post("/templates", data);
  return response.data;
}

export async function getTemplates() {
  const response = await axios.get("/templates");
  return response.data;
}

export async function getTemplateById(id) {
  const response = await axios.get(`/templates/${id}`);
  return response.data;
}

export async function deleteTemplate(id) {
  const response = await axios.delete(`/templates/${id}`);
  return response.data;
}