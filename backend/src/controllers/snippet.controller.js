"use strict";
import {
  buscarSnippetsPorTexto as buscarSnippetsPorTextoService,
} from "../services/template.service.js";
import { templateSearchValidation } from "../validations/template.validation.js";
import { handleErrorClient, handleErrorServer } from "../handlers/responseHandlers.js";

export async function buscarSnippetsPorTexto(req, res) {
  try {
    const { error, value } = templateSearchValidation.validate(req.query);

    if (error) {
      return handleErrorClient(res, 400, "Error de validacion", error.message);
    }

    const [snippet, serviceError] = await buscarSnippetsPorTextoService(value.q);

    if (serviceError) {
      return handleErrorServer(res, 500, serviceError);
    }

    if (!snippet) {
      return res.status(200).json({ encontrado: false });
    }

    return res.status(200).json({
      encontrado: true,
      titulo: snippet.titulo,
      codigo: snippet.codigo,
      lenguaje: snippet.lenguaje,
    });
  } catch (error) {
    console.error("Error en snippet.controller -> buscarSnippetsPorTexto():", error);
    return handleErrorServer(res, 500, "Error interno del servidor");
  }
}
