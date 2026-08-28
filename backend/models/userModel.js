import db from "../config/db.js";

async function findByUsername(username) {
  const [rows] = await db.execute(
    `
    SELECT
      ua.id,
      ua.username,
      ua.passwd,
      ua.employee_id,
      ua.user_type_id,
      ua.is_active,

      e.employee_no,
      e.biometric_id,
      e.first_name,
      e.middle_name,
      e.last_name,
      e.department_id,
      e.job_title_id

    FROM user_accounts ua

    LEFT JOIN employees e
      ON ua.employee_id = e.id

    WHERE ua.username = ?
    LIMIT 1
    `,
    [username],
  );

  return rows[0];
}

async function findById(id) {
  const [rows] = await db.execute(
    `
    SELECT
      ua.id,
      ua.username,
      ua.first_name,
      ua.last_name,
      ua.is_active

    FROM user_accounts ua

    WHERE ua.id = ?
    LIMIT 1
    `,
    [id],
  );

  return rows[0];
}

async function createUser({ username, passwordHash, employeeId, userTypeId }) {
  const [result] = await db.execute(
    `
    INSERT INTO user_accounts
      (
        username,
        passwd,
        employee_id,
        user_type_id,
        is_active
      )
    VALUES (?, ?, ?, ?, TRUE)
    `,
    [username, passwordHash, employeeId, userTypeId],
  );

  return result.insertId;
}

export default { findByUsername, findById, createUser };
