import {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from "../models/departmentModel.js";

/* =================================
   GET ALL
   GET /api/departments
================================= */

export async function getDepartments(req, res) {
  try {
    const departments = await getAllDepartments();

    return res.status(200).json({
      success: true,
      data: departments,
    });
  } catch (error) {
    console.error("Get departments error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load departments.",
    });
  }
}

/* =================================
   GET BY ID
   GET /api/departments/:id
================================= */

export async function getDepartment(req, res) {
  try {
    const { id } = req.params;

    const department = await getDepartmentById(id);

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: department,
    });
  } catch (error) {
    console.error("Get department error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to load department.",
    });
  }
}

/* =================================
   CREATE
   POST /api/departments
================================= */

export async function createDepartmentRecord(req, res) {
  try {
    const { code, description } = req.body;

    if (!code || !description) {
      return res.status(400).json({
        success: false,
        message: "Code and description are required.",
      });
    }

    const department = await createDepartment({
      code: code.trim(),
      description: description.trim(),
    });

    return res.status(201).json({
      success: true,
      message: "Department created successfully.",
      data: department,
    });
  } catch (error) {
    console.error("Create department error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Department code already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to create department.",
    });
  }
}

/* =================================
   UPDATE
   PUT /api/departments/:id
================================= */

export async function updateDepartmentRecord(req, res) {
  try {
    const { id } = req.params;
    const { code, description } = req.body;

    if (!code || !description) {
      return res.status(400).json({
        success: false,
        message: "Code and description are required.",
      });
    }

    const department = await updateDepartment(id, {
      code: code.trim(),
      description: description.trim(),
    });

    if (!department) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department updated successfully.",
      data: department,
    });
  } catch (error) {
    console.error("Update department error:", error);

    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "Department code already exists.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update department.",
    });
  }
}

/* =================================
   DELETE
   DELETE /api/departments/:id
================================= */

export async function deleteDepartmentRecord(req, res) {
  try {
    const { id } = req.params;

    const deleted = await deleteDepartment(id);

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Department not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Department deleted successfully.",
    });
  } catch (error) {
    console.error("Delete department error:", error);

    // Employee is probably using this department
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        success: false,
        message:
          "Cannot delete this department because it is assigned to an employee.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Failed to delete department.",
    });
  }
}
