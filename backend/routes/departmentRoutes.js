import express from "express";

import {
  getDepartments,
  getDepartment,
  createDepartmentRecord,
  updateDepartmentRecord,
  deleteDepartmentRecord,
} from "../controllers/departmentController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

/* =================================
   DEPARTMENTS
================================= */

// All department routes require authentication
router.use(authenticate);

// GET /api/departments
router.get("/", getDepartments);

// GET /api/departments/:id
router.get("/:id", getDepartment);

// POST /api/departments
router.post("/", createDepartmentRecord);

// PUT /api/departments/:id
router.put("/:id", updateDepartmentRecord);

// DELETE /api/departments/:id
router.delete("/:id", deleteDepartmentRecord);

export default router;
