"use strict";
import { Router } from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  getTemplateCounts,
  getTemplateFiles,
  getTemplates,
  moveTemplateToFolder,
  searchTemplates,
  updateTemplate,
} from "../controllers/template.controller.js";

const router = Router();

router.post("/", createTemplate);
router.get("/", getTemplates);
router.get("/search", searchTemplates);
router.get("/counts", getTemplateCounts);
router.get("/:id", getTemplateById);
router.get("/:id/files", getTemplateFiles);
router.patch("/:id/move", moveTemplateToFolder);
router.patch("/:id", updateTemplate);
router.delete("/:id", deleteTemplate);

export default router;
