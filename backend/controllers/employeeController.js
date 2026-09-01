import {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmployeeNo,
  getEmployeeByBiometricId,
  searchEmployees,
  createEmployee,
  updateEmployee,
  updateEmployeePhoto,
  deleteEmployee,
} from "../models/employeeModel.js";

import fs from "fs/promises";
import path from "path";

export async function getEmployees(req, res) {
  try {
    const { search } = req.query;

    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);

    const offset = (page - 1) * limit;

    const result = search
      ? await searchEmployees(search, limit, offset)
      : await getAllEmployees(limit, offset);

    const { employees, total } = result;

    const totalPages = Math.ceil(total / limit);

    res.json({
      success: true,
      data: employees,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Get employees error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve employees.",
    });
  }
}

export async function getEmployee(req, res) {
  try {
    const { id } = req.params;

    const employee = await getEmployeeById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    res.json({
      success: true,
      data: employee,
    });
  } catch (error) {
    console.error("Get employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to retrieve employee.",
    });
  }
}

// export async function createEmployeeRecord(req, res) {
//   try {
//     const employee = req.body;

//     if (!employee.employee_no) {
//       return res.status(400).json({
//         success: false,
//         message: "Employee number is required.",
//       });
//     }

//     if (!employee.biometric_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Biometric ID is required.",
//       });
//     }

//     // Check duplicate employee number
//     const existingEmployee = await getEmployeeByEmployeeNo(
//       employee.employee_no,
//     );

//     if (existingEmployee) {
//       return res.status(409).json({
//         success: false,
//         message: "Employee number already exists.",
//       });
//     }

//     // Check duplicate biometric ID
//     const existingBiometric = await getEmployeeByBiometricId(
//       employee.biometric_id,
//     );

//     if (existingBiometric) {
//       return res.status(409).json({
//         success: false,
//         message: "Biometric ID already exists.",
//       });
//     }

//     const id = await createEmployee(employee);

//     const newEmployee = await getEmployeeById(id);

//     res.status(201).json({
//       success: true,
//       message: "Employee created successfully.",
//       data: newEmployee,
//     });
//   } catch (error) {
//     console.error("Create employee error:", error);

//     res.status(500).json({
//       success: false,
//       message: "Failed to create employee.",
//     });
//   }
// }

export async function createEmployeeRecord(req, res) {
  try {
    const employee = req.body;

    if (!employee.employee_no) {
      return res.status(400).json({
        success: false,
        message: "Employee number is required.",
      });
    }

    if (!employee.biometric_id) {
      return res.status(400).json({
        success: false,
        message: "Biometric ID is required.",
      });
    }

    // Check duplicate employee number
    const existingEmployee = await getEmployeeByEmployeeNo(
      employee.employee_no,
    );

    if (existingEmployee) {
      return res.status(409).json({
        success: false,
        message: "Employee number already exists.",
      });
    }

    // Check duplicate biometric ID
    const existingBiometric = await getEmployeeByBiometricId(
      employee.biometric_id,
    );

    if (existingBiometric) {
      return res.status(409).json({
        success: false,
        message: "Biometric ID already exists.",
      });
    }

    // ----------------------------------------
    // 1. CREATE EMPLOYEE FIRST
    // ----------------------------------------

    // Don't save the temporary multer filename
    employee.photo = null;

    const id = await createEmployee(employee);

    // ----------------------------------------
    // 2. PROCESS PHOTO AFTER GETTING ID
    // ----------------------------------------

    if (req.file) {
      const uploadDir = path.join(process.cwd(), "uploads", "employee");

      // Make sure uploads/employee exists
      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      // Get original extension
      const extension = path.extname(req.file.originalname).toLowerCase();

      // Example:
      // employee ID = 25
      // filename = 25.jpg
      const fileName = `${id}${extension}`;

      const newPath = path.join(uploadDir, fileName);

      // Move/rename temporary uploaded file
      await fs.rename(req.file.path, newPath);

      // Path saved in database
      const photoPath = `/uploads/employee/${fileName}`;

      // Update employee photo
      await updateEmployeePhoto(id, photoPath);
    }

    // ----------------------------------------
    // 3. GET FINAL EMPLOYEE
    // ----------------------------------------

    const newEmployee = await getEmployeeById(id);

    res.status(201).json({
      success: true,
      message: "Employee created successfully.",
      data: newEmployee,
    });
  } catch (error) {
    console.error("Create employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create employee.",
    });
  }
}

// export async function updateEmployeeRecord(req, res) {
//   try {
//     const { id } = req.params;

//     const employee = {
//       employee_no: req.body.employee_no,
//       biometric_id: req.body.biometric_id,

//       prefix: req.body.prefix || null,
//       first_name: req.body.first_name || null,
//       middle_name: req.body.middle_name || null,
//       last_name: req.body.last_name || null,
//       suffix: req.body.suffix || null,

//       street1: req.body.street1 || null,
//       street2: req.body.street2 || null,
//       city: req.body.city || null,
//       province: req.body.province || null,
//       postal_code: req.body.postal_code || null,

//       home_phone: req.body.home_phone || null,
//       mobile_phone: req.body.mobile_phone || null,
//       email_address: req.body.email_address || null,

//       spouse_name: req.body.spouse_name || null,
//       spouse_occupation: req.body.spouse_occupation || null,

//       emergency_name: req.body.emergency_name || null,
//       emergency_address: req.body.emergency_address || null,
//       emergency_phone: req.body.emergency_phone || null,

//       sex: req.body.sex || null,
//       civil_status: req.body.civil_status || null,
//       birth_date: req.body.birth_date || null,
//       birth_place: req.body.birth_place || null,
//       religion: req.body.religion || null,
//       citizenship: req.body.citizenship || null,

//       tin_no: req.body.tin_no || null,
//       sss_no: req.body.sss_no || null,
//       philhealth_no: req.body.philhealth_no || null,
//       pagibig_no: req.body.pagibig_no || null,

//       remarks: req.body.remarks || null,

//       date_hired: req.body.date_hired || null,
//       department_id: req.body.department_id || null,

//       sched_in: req.body.sched_in || null,
//       sched_out: req.body.sched_out || null,

//       is_active:
//         req.body.is_active === "true" ||
//         req.body.is_active === true ||
//         req.body.is_active === "1",

//       min_allow: req.body.min_allow || "0.00",
//     };

//     /*
//      * Photo
//      */
//     if (req.file) {
//       employee.photo = `employees/${req.file.filename}`;
//     }

//     const existingEmployee = await getEmployeeById(id);

//     if (!existingEmployee) {
//       return res.status(404).json({
//         success: false,
//         message: "Employee not found.",
//       });
//     }

//     /*
//      * Required fields
//      */
//     if (!employee.employee_no) {
//       return res.status(400).json({
//         success: false,
//         message: "Employee number is required.",
//       });
//     }

//     if (!employee.biometric_id) {
//       return res.status(400).json({
//         success: false,
//         message: "Biometric ID is required.",
//       });
//     }

//     /*
//      * Employee number duplicate check
//      */
//     const employeeNoExists = await getEmployeeByEmployeeNo(
//       employee.employee_no,
//     );

//     if (employeeNoExists && Number(employeeNoExists.id) !== Number(id)) {
//       return res.status(409).json({
//         success: false,
//         message: "Employee number already exists.",
//       });
//     }

//     /*
//      * Biometric ID duplicate check
//      */
//     const biometricExists = await getEmployeeByBiometricId(
//       employee.biometric_id,
//     );

//     if (biometricExists && Number(biometricExists.id) !== Number(id)) {
//       return res.status(409).json({
//         success: false,
//         message: "Biometric ID already exists.",
//       });
//     }

//     /*
//      * Update employee
//      */
//     await updateEmployee(id, employee);

//     /*
//      * Get updated employee
//      */
//     const updatedEmployee = await getEmployeeById(id);

//     return res.json({
//       success: true,
//       message: "Employee updated successfully.",
//       data: updatedEmployee,
//     });
//   } catch (error) {
//     console.error("Update employee error:", error);

//     return res.status(500).json({
//       success: false,
//       message: "Failed to update employee.",
//     });
//   }
// }

export async function updateEmployeeRecord(req, res) {
  try {
    const { id } = req.params;

    // ----------------------------------------
    // 1. GET EXISTING EMPLOYEE
    // ----------------------------------------

    const existingEmployee = await getEmployeeById(id);

    if (!existingEmployee) {
      // Remove uploaded temporary file
      if (req.file?.path) {
        try {
          await fs.unlink(req.file.path);
        } catch {
          // Ignore cleanup error
        }
      }

      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    // ----------------------------------------
    // 2. BUILD EMPLOYEE DATA
    // ----------------------------------------

    const employee = {
      employee_no: req.body.employee_no,
      biometric_id: req.body.biometric_id,

      prefix: req.body.prefix || null,
      first_name: req.body.first_name || null,
      middle_name: req.body.middle_name || null,
      last_name: req.body.last_name || null,
      suffix: req.body.suffix || null,

      street1: req.body.street1 || null,
      street2: req.body.street2 || null,
      city: req.body.city || null,
      province: req.body.province || null,
      postal_code: req.body.postal_code || null,

      home_phone: req.body.home_phone || null,
      mobile_phone: req.body.mobile_phone || null,
      email_address: req.body.email_address || null,

      spouse_name: req.body.spouse_name || null,
      spouse_occupation: req.body.spouse_occupation || null,

      emergency_name: req.body.emergency_name || null,
      emergency_address: req.body.emergency_address || null,
      emergency_phone: req.body.emergency_phone || null,

      sex: req.body.sex || null,
      civil_status: req.body.civil_status || null,

      birth_date: req.body.birth_date || null,

      birth_place: req.body.birth_place || null,

      religion: req.body.religion || null,

      citizenship: req.body.citizenship || null,

      tin_no: req.body.tin_no || null,

      sss_no: req.body.sss_no || null,

      philhealth_no: req.body.philhealth_no || null,

      pagibig_no: req.body.pagibig_no || null,

      remarks: req.body.remarks || null,

      date_hired: req.body.date_hired || null,

      department_id: req.body.department_id || null,

      sched_in: req.body.sched_in || null,

      sched_out: req.body.sched_out || null,

      is_active:
        req.body.is_active === "true" ||
        req.body.is_active === true ||
        req.body.is_active === "1",

      min_allow: req.body.min_allow || "0.00",
    };

    // ----------------------------------------
    // 3. REQUIRED FIELDS
    // ----------------------------------------

    if (!employee.employee_no) {
      return res.status(400).json({
        success: false,
        message: "Employee number is required.",
      });
    }

    if (!employee.biometric_id) {
      return res.status(400).json({
        success: false,
        message: "Biometric ID is required.",
      });
    }

    // ----------------------------------------
    // 4. CHECK EMPLOYEE NO DUPLICATE
    // ----------------------------------------

    const employeeNoExists = await getEmployeeByEmployeeNo(
      employee.employee_no,
    );

    if (employeeNoExists && Number(employeeNoExists.id) !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Employee number already exists.",
      });
    }

    // ----------------------------------------
    // 5. CHECK BIOMETRIC ID DUPLICATE
    // ----------------------------------------

    const biometricExists = await getEmployeeByBiometricId(
      employee.biometric_id,
    );

    if (biometricExists && Number(biometricExists.id) !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Biometric ID already exists.",
      });
    }

    // ----------------------------------------
    // 6. UPDATE EMPLOYEE INFORMATION
    // ----------------------------------------

    await updateEmployee(id, employee);

    // ----------------------------------------
    // 7. PROCESS NEW PHOTO
    // ----------------------------------------

    if (req.file) {
      const uploadDir = path.join(process.cwd(), "uploads", "employee");

      await fs.mkdir(uploadDir, {
        recursive: true,
      });

      const extension = path.extname(req.file.originalname).toLowerCase();

      const fileName = `${id}${extension}`;

      const newPath = path.join(uploadDir, fileName);

      /*
       * Delete old photo
       *
       * Example database value:
       * /uploads/employees/25.jpg
       */
      if (existingEmployee.photo) {
        const oldPhotoPath = path.join(
          process.cwd(),
          existingEmployee.photo.replace(/^\/+/, ""),
        );

        try {
          await fs.unlink(oldPhotoPath);
        } catch (error) {
          // Ignore if old file does not exist
          if (error.code !== "ENOENT") {
            console.error("Failed to delete old employee photo:", error);
          }
        }
      }

      // Move new uploaded photo
      await fs.rename(req.file.path, newPath);

      // Save new photo path
      const photoPath = `/uploads/employees/${fileName}`;

      await updateEmployeePhoto(id, photoPath);
    }

    // ----------------------------------------
    // 8. GET UPDATED EMPLOYEE
    // ----------------------------------------

    const updatedEmployee = await getEmployeeById(id);

    return res.json({
      success: true,
      message: "Employee updated successfully.",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Update employee error:", error);

    // Cleanup temporary upload
    if (req.file?.path) {
      try {
        await fs.unlink(req.file.path);
      } catch {
        // Ignore cleanup error
      }
    }

    return res.status(500).json({
      success: false,
      message: "Failed to update employee.",
    });
  }
}

export async function deleteEmployeeRecord(req, res) {
  try {
    const { id } = req.params;

    const employee = await getEmployeeById(id);

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    await deleteEmployee(id);

    res.json({
      success: true,
      message: "Employee deleted successfully.",
    });
  } catch (error) {
    console.error("Delete employee error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete employee.",
    });
  }
}
