"use strict";
import { Router } from "express";
import {
  createTemplate,
  deleteTemplate,
  getTemplateById,
  getTemplateFiles,
  getTemplates,
} from "../controllers/template.controller.js";

const router = Router();

router.post("/", createTemplate);
router.get("/", getTemplates);
router.get("/:id", getTemplateById);
router.get("/:id/files", getTemplateFiles);
router.delete("/:id", deleteTemplate);

export default router;
