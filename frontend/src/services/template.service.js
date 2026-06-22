import axios from "./root.service.js";

export async function createTemplate(data) {
  const response = await axios.post("/templates", data);
  return response.data;
}

export async function getTemplates({
  lenguaje,
  categoria,
  subcategoria,
} = {}) {
  const response = await axios.get("/templates", {
    params: { lenguaje, categoria, subcategoria },
  });
  return response.data;
}

export async function searchTemplates(query) {
  const response = await axios.get("/templates/search", {
    params: { q: query },
  });
  return response.data;
}

export async function getTemplateCounts() {
  const response = await axios.get("/templates/counts");
  return response.data;
}

export async function getTemplateById(id) {
  const response = await axios.get(`/templates/${id}`);
  return response.data;
}

export async function updateTemplate(id, data) {
  const response = await axios.patch(`/templates/${id}`, data);
  return response.data;
}

export async function deleteTemplate(id) {
  const response = await axios.delete(`/templates/${id}`);
  return response.data;
}
