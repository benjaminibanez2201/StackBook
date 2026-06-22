"use strict";
import { Router } from "express";
import snippetRoutes from "./snippet.routes.js";
import templateRoutes from "./template.routes.js";

const router = Router();

router.use("/snippets", snippetRoutes);
router.use("/templates", templateRoutes);


export default router;
