import db from "../config/db.js";

export async function getAllEmployees() {
  const [rows] = await db.execute(`
    SELECT
      e.*,

      CONCAT_WS(
        ' ',
        e.prefix,
        e.first_name,
        e.middle_name,
        e.last_name,
        e.suffix
      ) AS full_name,

      d.code AS department_code,
      d.description AS department_name

    FROM employees e

    LEFT JOIN departments d
      ON e.department_id = d.id

    ORDER BY e.last_name ASC, e.first_name ASC
  `);

  return rows;
}

export async function getEmployeeById(id) {
  const [rows] = await db.execute(
    `
      SELECT
        e.*,

        CONCAT_WS(
          ' ',
          e.prefix,
          e.first_name,
          e.middle_name,
          e.last_name,
          e.suffix
        ) AS full_name,

        d.code AS department_code,
        d.description AS department_name

      FROM employees e

      LEFT JOIN departments d
        ON e.department_id = d.id

      WHERE e.id = ?

      LIMIT 1
    `,
    [id],
  );

  return rows[0];
}
export async function getEmployeeByEmployeeNo(employeeNo) {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM employees
      WHERE employee_no = ?
      LIMIT 1
    `,
    [employeeNo],
  );

  return rows[0];
}

export async function getEmployeeByBiometricId(biometricId) {
  const [rows] = await db.execute(
    `
      SELECT *
      FROM employees
      WHERE biometric_id = ?
      LIMIT 1
    `,
    [biometricId],
  );

  return rows[0];
}

export async function searchEmployees(search) {
  const keyword = `%${search}%`;

  const [rows] = await db.execute(
    `
      SELECT
        e.*,
        CONCAT_WS(
          ' ',
          e.prefix,
          e.first_name,
          e.middle_name,
          e.last_name,
          e.suffix
        ) AS full_name
      FROM employees e
      WHERE
        e.employee_no LIKE ?
        OR e.biometric_id LIKE ?
        OR e.first_name LIKE ?
        OR e.middle_name LIKE ?
        OR e.last_name LIKE ?
        OR e.email_address LIKE ?
        OR CONCAT_WS(
          ' ',
          e.first_name,
          e.middle_name,
          e.last_name
        ) LIKE ?
      ORDER BY e.last_name ASC, e.first_name ASC
    `,
    [keyword, keyword, keyword, keyword, keyword, keyword, keyword],
  );

  return rows;
}

export async function createEmployee(employee) {
  const {
    employee_no,
    biometric_id,
    photo,
    prefix,
    first_name,
    middle_name,
    last_name,
    suffix,
    street1,
    street2,
    city,
    province,
    postal_code,
    home_phone,
    mobile_phone,
    email_address,
    spouse_name,
    spouse_occupation,
    emergency_name,
    emergency_address,
    emergency_phone,
    sex,
    civil_status,
    birth_date,
    birth_place,
    religion,
    citizenship,
    tin_no,
    sss_no,
    philhealth_no,
    pagibig_no,
    remarks,
    date_hired,
    department_id,
    sched_in,
    sched_out,
    pay_type,
    is_active,
    min_allow,
  } = employee;

  const [result] = await db.execute(
    `
      INSERT INTO employees (
        employee_no,
        biometric_id,
        photo,
        prefix,
        first_name,
        middle_name,
        last_name,
        suffix,
        street1,
        street2,
        city,
        province,
        postal_code,
        home_phone,
        mobile_phone,
        email_address,
        spouse_name,
        spouse_occupation,
        emergency_name,
        emergency_address,
        emergency_phone,
        sex,
        civil_status,
        birth_date,
        birth_place,
        religion,
        citizenship,
        tin_no,
        sss_no,
        philhealth_no,
        pagibig_no,
        remarks,
        date_hired,
        department_id,
        sched_in,
        sched_out,
        pay_type,
        is_active,
        min_allow
      )
      VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `,
    [
      employee_no,
      biometric_id,
      photo ?? null,
      prefix ?? null,
      first_name ?? null,
      middle_name ?? null,
      last_name ?? null,
      suffix ?? null,
      street1 ?? null,
      street2 ?? null,
      city ?? null,
      province ?? null,
      postal_code ?? null,
      home_phone ?? null,
      mobile_phone ?? null,
      email_address ?? null,
      spouse_name ?? null,
      spouse_occupation ?? null,
      emergency_name ?? null,
      emergency_address ?? null,
      emergency_phone ?? null,
      sex ?? null,
      civil_status ?? null,
      birth_date ?? null,
      birth_place ?? null,
      religion ?? null,
      citizenship ?? null,
      tin_no ?? null,
      sss_no ?? null,
      philhealth_no ?? null,
      pagibig_no ?? null,
      remarks ?? null,
      date_hired ?? null,
      department_id ?? null,
      sched_in ?? null,
      sched_out ?? null,
      pay_type ?? null,
      is_active ?? 1,
      min_allow ?? 0.0,
    ],
  );

  return result.insertId;
}

export async function updateEmployee(id, employee) {
  const {
    employee_no,
    biometric_id,
    photo,
    prefix,
    first_name,
    middle_name,
    last_name,
    suffix,
    street1,
    street2,
    city,
    province,
    postal_code,
    home_phone,
    mobile_phone,
    email_address,
    spouse_name,
    spouse_occupation,
    emergency_name,
    emergency_address,
    emergency_phone,
    sex,
    civil_status,
    birth_date,
    birth_place,
    religion,
    citizenship,
    tin_no,
    sss_no,
    philhealth_no,
    pagibig_no,
    remarks,
    date_hired,
    type_id,
    department_id,
    job_title_id,
    sched_in,
    sched_out,
    pay_type,
    yearly_count,
    is_active,
    min_allow,
  } = employee;

  const [result] = await db.execute(
    `
      UPDATE employees
      SET
        employee_no = ?,
        biometric_id = ?,
        photo = ?,
        prefix = ?,
        first_name = ?,
        middle_name = ?,
        last_name = ?,
        suffix = ?,
        street1 = ?,
        street2 = ?,
        city = ?,
        province = ?,
        postal_code = ?,
        home_phone = ?,
        mobile_phone = ?,
        email_address = ?,
        spouse_name = ?,
        spouse_occupation = ?,
        emergency_name = ?,
        emergency_address = ?,
        emergency_phone = ?,
        sex = ?,
        civil_status = ?,
        birth_date = ?,
        birth_place = ?,
        religion = ?,
        citizenship = ?,
        tin_no = ?,
        sss_no = ?,
        philhealth_no = ?,
        pagibig_no = ?,
        remarks = ?,
        date_hired = ?,
        type_id = ?,
        department_id = ?,
        job_title_id = ?,
        sched_in = ?,
        sched_out = ?,
        pay_type = ?,
        yearly_count = ?,
        is_active = ?,
        min_allow = ?
      WHERE id = ?
    `,
    [
      employee_no,
      biometric_id,
      photo ?? null,
      prefix ?? null,
      first_name ?? null,
      middle_name ?? null,
      last_name ?? null,
      suffix ?? null,
      street1 ?? null,
      street2 ?? null,
      city ?? null,
      province ?? null,
      postal_code ?? null,
      home_phone ?? null,
      mobile_phone ?? null,
      email_address ?? null,
      spouse_name ?? null,
      spouse_occupation ?? null,
      emergency_name ?? null,
      emergency_address ?? null,
      emergency_phone ?? null,
      sex ?? null,
      civil_status ?? null,
      birth_date ?? null,
      birth_place ?? null,
      religion ?? null,
      citizenship ?? null,
      tin_no ?? null,
      sss_no ?? null,
      philhealth_no ?? null,
      pagibig_no ?? null,
      remarks ?? null,
      date_hired ?? null,
      type_id ?? null,
      department_id ?? null,
      job_title_id ?? null,
      sched_in ?? null,
      sched_out ?? null,
      pay_type ?? null,
      yearly_count ?? null,
      is_active ?? 1,
      min_allow ?? 0.0,
      id,
    ],
  );

  return result.affectedRows;
}

export async function deleteEmployee(id) {
  const [result] = await db.execute(
    `
      DELETE FROM employees
      WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows;
}
