"use strict";
import { Router } from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  getTemplateFiles,
  getTemplates,
  searchTemplates,
  updateTemplate,
} from "../controllers/template.controller.js";

const router = Router();

router.post("/", createTemplate);
router.get("/", getTemplates);
router.get("/search", searchTemplates);
router.get("/:id", getTemplateById);
router.get("/:id/files", getTemplateFiles);
router.patch("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
