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

export async function searchTemplates(query) {
  try {
    const searchQuery = `%${query}%`;
    const templates = await templateRepository
      .createQueryBuilder("template")
      .where("template.nombre ILIKE :query", { query: searchQuery })
      .orWhere("template.tags ILIKE :query", { query: searchQuery })
      .orWhere("template.lenguaje ILIKE :query", { query: searchQuery })
      .orWhere("template.categoria ILIKE :query", { query: searchQuery })
      .orWhere("template.subcategoria ILIKE :query", { query: searchQuery })
      .orderBy("template.createdAt", "DESC")
      .getMany();

    return [templates, null];
  } catch (error) {
    console.error("Error al buscar templates:", error);
    return [null, "Error interno del servidor"];
  }
}

export async function buscarSnippetsPorTexto(query) {
  try {
    const searchQuery = `%${query}%`;
    const template = await templateRepository
      .createQueryBuilder("template")
      .leftJoinAndSelect("template.templateFiles", "templateFile")
      .where("template.nombre ILIKE :query", { query: searchQuery })
      .orWhere("template.categoria ILIKE :query", { query: searchQuery })
      .orWhere("templateFile.content ILIKE :query", { query: searchQuery })
      .orderBy("template.createdAt", "DESC")
      .addOrderBy("templateFile.id", "ASC")
      .getOne();

    if (!template) return [null, null];

    const matchingFile =
      template.templateFiles?.find((file) =>
        file.content.toLowerCase().includes(query.toLowerCase()),
      ) ?? template.templateFiles?.[0];

    return [
      {
        titulo: template.nombre,
        codigo: matchingFile?.content ?? "",
        lenguaje: template.lenguaje,
      },
      null,
    ];
  } catch (error) {
    console.error("Error al buscar snippets por texto:", error);
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

export async function updateTemplate(id, data) {
  try {
    const updatedTemplate = await AppDataSource.transaction(async (manager) => {
      const transactionTemplateRepository = manager.getRepository("Template");
      const templateFound = await transactionTemplateRepository.findOne({
        where: { id },
        relations: {
          templateFiles: true,
        },
      });

      if (!templateFound) {
        return null;
      }

      const { files, ...templateData } = data;
      Object.assign(templateFound, templateData);

      if (files) {
        await manager
          .createQueryBuilder()
          .delete()
          .from("TemplateFile")
          .where('"templateId" = :id', { id })
          .execute();

        templateFound.templateFiles = files.map((file) => ({
          fileName: file.fileName,
          content: file.content,
          type: file.type,
        }));
      }

      return transactionTemplateRepository.save(templateFound);
    });

    if (!updatedTemplate) {
      return [null, "Template no encontrado"];
    }

    return [updatedTemplate, null];
  } catch (error) {
    console.error("Error al actualizar el template:", error);
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
