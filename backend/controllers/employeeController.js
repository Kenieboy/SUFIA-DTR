import {
  getAllEmployees,
  getEmployeeById,
  getEmployeeByEmployeeNo,
  getEmployeeByBiometricId,
  searchEmployees,
  createEmployee,
  updateEmployee,
  deleteEmployee,
} from "../models/employeeModel.js";

export async function getEmployees(req, res) {
  try {
    const { search } = req.query;

    const employees = search
      ? await searchEmployees(search)
      : await getAllEmployees();

    res.json({
      success: true,
      data: employees,
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

    const id = await createEmployee(employee);

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

export async function updateEmployeeRecord(req, res) {
  try {
    const { id } = req.params;

    const employee = {
      employee_no: req.body.employeeNo,
      biometric_id: req.body.biometricId,

      prefix: req.body.prefix || null,
      first_name: req.body.firstName || null,
      middle_name: req.body.middleName || null,
      last_name: req.body.lastName || null,
      suffix: req.body.suffix || null,

      street1: req.body.street1 || null,
      street2: req.body.street2 || null,
      city: req.body.city || null,
      province: req.body.province || null,
      postal_code: req.body.postalCode || null,

      home_phone: req.body.homePhone || null,
      mobile_phone: req.body.mobilePhone || null,
      email_address: req.body.emailAddress || null,

      spouse_name: req.body.spouseName || null,
      spouse_occupation: req.body.spouseOccupation || null,

      emergency_name: req.body.emergencyName || null,
      emergency_address: req.body.emergencyAddress || null,
      emergency_phone: req.body.emergencyPhone || null,

      sex: req.body.sex || null,
      civil_status: req.body.civilStatus || null,
      birth_date: req.body.birthDate || null,
      birth_place: req.body.birthPlace || null,
      religion: req.body.religion || null,
      citizenship: req.body.citizenship || null,

      tin_no: req.body.tinNo || null,
      sss_no: req.body.sssNo || null,
      philhealth_no: req.body.philhealthNo || null,
      pagibig_no: req.body.pagibigNo || null,

      remarks: req.body.remarks || null,

      date_hired: req.body.dateHired || null,
      type_id: req.body.typeId || null,
      department_id: req.body.departmentId || null,
      job_title_id: req.body.jobTitleId || null,

      sched_in: req.body.schedIn || null,
      sched_out: req.body.schedOut || null,

      pay_type: req.body.payType || null,
      yearly_count: req.body.yearlyCount || null,
      is_active:
        req.body.isActive === "true" ||
        req.body.isActive === true ||
        req.body.isActive === "1",

      min_allow: req.body.minAllow || "0.00",
    };

    /*
     * Photo
     */
    if (req.file) {
      employee.photo = `employees/${req.file.filename}`;
    }

    const existingEmployee = await getEmployeeById(id);

    if (!existingEmployee) {
      return res.status(404).json({
        success: false,
        message: "Employee not found.",
      });
    }

    /*
     * Required fields
     */
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

    /*
     * Employee number duplicate check
     */
    const employeeNoExists = await getEmployeeByEmployeeNo(
      employee.employee_no,
    );

    if (employeeNoExists && Number(employeeNoExists.id) !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Employee number already exists.",
      });
    }

    /*
     * Biometric ID duplicate check
     */
    const biometricExists = await getEmployeeByBiometricId(
      employee.biometric_id,
    );

    if (biometricExists && Number(biometricExists.id) !== Number(id)) {
      return res.status(409).json({
        success: false,
        message: "Biometric ID already exists.",
      });
    }

    /*
     * Update employee
     */
    await updateEmployee(id, employee);

    /*
     * Get updated employee
     */
    const updatedEmployee = await getEmployeeById(id);

    return res.json({
      success: true,
      message: "Employee updated successfully.",
      data: updatedEmployee,
    });
  } catch (error) {
    console.error("Update employee error:", error);

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
