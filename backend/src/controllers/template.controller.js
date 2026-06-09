"use strict";
import {
  createTemplate as createTemplateService,
  getTemplateById as getTemplateByIdService,
  getTemplateFiles as getTemplateFilesService,
  getTemplates as getTemplatesService,
  deleteTemplate as deleteTemplateService,
} from "../services/template.service.js";
import {
  templateCreateValidation,
  templateFiltersValidation,
  templateQueryValidation,
} from "../validations/template.validation.js";
import {
  handleErrorClient,
  handleErrorServer,
  handleSuccess,
} from "../handlers/responseHandlers.js";

export async function createTemplate(req, res) {
  try {
    const { error } = templateCreateValidation.validate(req.body);

    if (error) {
      return handleErrorClient(res, 400, "Error de validacion", error.message);
    }

    const [template, serviceError] = await createTemplateService(req.body);

    if (serviceError) {
      return handleErrorServer(res, 500, serviceError);
    }

    return handleSuccess(res, 201, "Template creado correctamente", template);
  } catch (error) {
    console.error("Error en template.controller -> createTemplate():", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getTemplates(req, res) {
  try {
    const { error, value } = templateFiltersValidation.validate(req.query);

    if (error) {
      return handleErrorClient(res, 400, "Error de validacion", error.message);
    }

    const [templates, serviceError] = await getTemplatesService(value);

    if (serviceError) {
      return handleErrorServer(res, 500, serviceError);
    }

    return handleSuccess(res, 200, "Templates encontrados", templates);
  } catch (error) {
    console.error("Error en template.controller -> getTemplates():", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getTemplateById(req, res) {
  try {
    const { error } = templateQueryValidation.validate(req.params);

    if (error) {
      return handleErrorClient(res, 400, "Error de validacion", error.message);
    }

    const [template, serviceError] = await getTemplateByIdService(
      Number(req.params.id),
    );

    if (serviceError) {
      return handleErrorClient(res, 404, serviceError);
    }

    return handleSuccess(res, 200, "Template encontrado", template);
  } catch (error) {
    console.error("Error en template.controller -> getTemplateById():", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function getTemplateFiles(req, res) {
  try {
    const { error } = templateQueryValidation.validate(req.params);

    if (error) {
      return handleErrorClient(res, 400, "Error de validacion", error.message);
    }

    const [files, serviceError] = await getTemplateFilesService(
      Number(req.params.id),
    );

    if (serviceError) {
      return handleErrorClient(res, 404, serviceError);
    }

    return handleSuccess(res, 200, "Archivos encontrados", files);
  } catch (error) {
    console.error("Error en template.controller -> getTemplateFiles():", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}

export async function deleteTemplate(req, res) {
    try {
      const { error } = templateQueryValidation.validate(req.params);
  
      if (error) {
        return handleErrorClient(res, 400, "Error de validacion", error.message);
      }
  
      const [result, serviceError] = await deleteTemplateService(
        Number(req.params.id),
      );
  
      if (serviceError) {
        return handleErrorClient(res, 404, serviceError);
      }
  
      return handleSuccess(res, 200, "Template eliminado correctamente", result);
    } catch (error) {
      console.error("Error en template.controller -> deleteTemplate():", error);
      return handleErrorServer(res, 500, "Error interno del servidor");
    }
  }
