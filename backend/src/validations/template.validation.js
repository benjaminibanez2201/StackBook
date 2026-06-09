"use strict";
import Joi from "joi";

const nombre = Joi.string()
  .min(3)
  .max(50)
  .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ0-9\s\-_]+$/)
  .messages({
    "string.empty": "El nombre no puede estar vacío.",
    "string.base": "El nombre debe ser de tipo string.",
    "string.min": "El nombre debe tener como mínimo 3 caracteres.",
    "string.max": "El nombre debe tener como máximo 50 caracteres.",
    "string.pattern.base":
      "El nombre solo puede contener letras, números, espacios, guiones y guiones bajos.",
  });

const descripcion = Joi.string()
  .messages({
    "string.base": "La descripción debe ser de tipo string.",
  });
  const tags = Joi.array()
  .items(Joi.string())
  .messages({
    "array.base": "Las etiquetas deben ser de tipo array.",
    "array.items": "Cada etiqueta debe ser de tipo string.",
  });

  const files = Joi.array()
  .items(Joi.object({
    fileName: Joi.string().required(),
    content: Joi.string().required(),
    type: Joi.string().required(),
  })).messages({
    "array.base": "Los archivos deben ser de tipo array.",
    "array.items": "Cada archivo debe ser de tipo objeto.",
    "object.base": "Cada archivo debe ser de tipo objeto.",
    "object.missing": "Cada archivo debe tener un nombre, contenido y tipo (jsx, css, js).",
  });

export const templateBodyValidation = Joi.object({
  nombre: nombre,
  descripcion: descripcion,
  tags: tags,
  files: files,
})
  .or("nombre", "descripcion", "tags", "files")
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
    "object.missing":
      "Debes proporcionar al menos un parámetro: nombre, descripcion, tags o files.",
  });

export const templateQueryValidation = Joi.object({
  id: Joi.number().integer().positive().messages({
    "number.base": "El id debe ser un número.",
    "number.integer": "El id debe ser un número entero.",
    "number.positive": "El id debe ser un número positivo.",
  }),
})
  .or("id")
  .unknown(false)
  .messages({
    "object.missing": "Debes proporcionar al menos un parámetro: id.",
    "object.unknown": "No se permiten propiedades adicionales.",
  });

export const templateFiltersValidation = Joi.object({
  lenguaje: Joi.string().trim(),
  categoria: Joi.string().trim(),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten filtros adicionales.",
  });

export const templateCreateValidation = Joi.object({
  nombre: nombre.required().messages({ "any.required": "El nombre es obligatorio." }),
  lenguaje: Joi.string().required(),
  categoria: Joi.string().required(),
  descripcion: descripcion.required().messages({ "any.required": "La descripción es obligatoria." }),
  tags: tags.required().messages({ "any.required": "Las etiquetas son obligatorias." }),
  files: files.required().messages({ "any.required": "Los archivos son obligatorios." }),
})
  .unknown(false)
  .messages({
    "object.unknown": "No se permiten propiedades adicionales.",
  });
