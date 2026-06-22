"use strict";
import { Router } from "express";
import { buscarSnippetsPorTexto } from "../controllers/snippet.controller.js";

const router = Router();

router.get("/buscar", buscarSnippetsPorTexto);

export default router;
