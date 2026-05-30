"use strict";
import { Router } from "express";
import templateRoutes from "./template.routes.js";

const router = Router();

router.use("/templates", templateRoutes);


export default router;
