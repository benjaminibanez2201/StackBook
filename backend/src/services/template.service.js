"use strict";
import { AppDataSource } from "../config/configDb.js";

const templateRepository = AppDataSource.getRepository("Template");

export async function createTemplate(data) {
  try {
    const { files = [], ...templateData } = data;

    const newTemplate = templateRepository.create({
      ...templateData,
      templateFiles: files.map((file) => ({
        fileName: file.fileName,
        content: file.content,
        type: file.type,
      })),
    });

    const savedTemplate = await templateRepository.save(newTemplate);

    return [savedTemplate, null];
  } catch (error) {
    console.error("Error al crear template:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTemplates({ lenguaje, categoria, subcategoria } = {}) {
  try {
    const where = {};

    if (lenguaje) where.lenguaje = lenguaje;
    if (categoria) where.categoria = categoria;
    if (subcategoria) where.subcategoria = subcategoria;

    const templates = await templateRepository.find({
      where,
      order: {
        createdAt: "DESC",
      },
    });

    return [templates, null];
  } catch (error) {
    console.error("Error al encontrar los templates:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTemplateById(id) {
  try {
    const templateFound = await templateRepository.findOne({
      where: { id },
      relations: {
        templateFiles: true,
      },
    });

    if (!templateFound) return [null, "Template no encontrado"];

    return [templateFound, null];
  } catch (error) {
    console.error("Error al obtener el template:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function getTemplateFiles(id) {
  try {
    const templateFound = await templateRepository.findOne({
      where: { id },
      relations: {
        templateFiles: true,
      },
    });

    if (!templateFound) return [null, "Template no encontrado"];

    return [templateFound.templateFiles, null];
  } catch (error) {
    console.error("Error al obtener los archivos del template:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function deleteTemplate(id) {
    try {
      const templateFound = await templateRepository.findOne({
        where: { id },
      });
  
      if (!templateFound) return [null, "Template no encontrado"];
  
      await templateRepository.remove(templateFound);
  
      return [{ message: "Template eliminado correctamente" }, null];
    } catch (error) {
      console.error("Error al eliminar el template:", error);
      return [null, "Error interno del servidor"];
    }
}
