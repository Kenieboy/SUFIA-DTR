import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

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
  dest: "uploads/temp/",
});

// ========================================
// ALL EMPLOYEE ROUTES REQUIRE AUTH
// ========================================

router.use(authenticate);

// ========================================
// EMPLOYEE PHOTO
// ========================================

router.get("/photo/:filename", (req, res) => {
  const { filename } = req.params;

  const filePath = path.join(process.cwd(), "uploads", "employee", filename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({
      success: false,
      message: "Employee photo not found.",
    });
  }

  res.sendFile(filePath);
});

// ========================================
// EMPLOYEES
// ========================================

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
