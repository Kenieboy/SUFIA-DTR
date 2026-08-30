import express from "express";
import multer from "multer";

import {
  getEmployees,
  getEmployee,
  createEmployeeRecord,
  updateEmployeeRecord,
  deleteEmployeeRecord,
} from "../controllers/employeeController.js";

import { authenticate } from "../middleware/authMiddleware.js";

const router = express.Router();

const upload = multer({
  dest: "uploads/employees/",
});

// All employee routes require authentication
router.use(authenticate);

// GET /api/employees
router.get("/", getEmployees);

// GET /api/employees/:id
router.get("/:id", getEmployee);

// POST /api/employees
router.post("/", upload.single("photo"), createEmployeeRecord);

// PUT /api/employees/:id
router.put("/:id", upload.single("photo"), updateEmployeeRecord);

// DELETE /api/employees/:id
router.delete("/:id", deleteEmployeeRecord);

export default router;
