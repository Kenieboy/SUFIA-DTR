import db from "../config/db.js";

/* =================================
   GET ALL DEPARTMENTS
================================= */

export async function getAllDepartments() {
  const [rows] = await db.execute(`
    SELECT
      id,
      code,
      description
    FROM departments
    ORDER BY description ASC
  `);

  return rows;
}

/* =================================
   GET DEPARTMENT BY ID
================================= */

export async function getDepartmentById(id) {
  const [rows] = await db.execute(
    `
    SELECT
      id,
      code,
      description
    FROM departments
    WHERE id = ?
    `,
    [id],
  );

  return rows[0] || null;
}

/* =================================
   CREATE DEPARTMENT
================================= */

export async function createDepartment({ code, description }) {
  const [result] = await db.execute(
    `
    INSERT INTO departments (
      code,
      description
    )
    VALUES (?, ?)
    `,
    [code, description],
  );

  return getDepartmentById(result.insertId);
}

/* =================================
   UPDATE DEPARTMENT
================================= */

export async function updateDepartment(id, { code, description }) {
  const [result] = await db.execute(
    `
    UPDATE departments
    SET
      code = ?,
      description = ?
    WHERE id = ?
    `,
    [code, description, id],
  );

  if (result.affectedRows === 0) {
    return null;
  }

  return getDepartmentById(id);
}

/* =================================
   DELETE DEPARTMENT
================================= */

export async function deleteDepartment(id) {
  const [result] = await db.execute(
    `
    DELETE FROM departments
    WHERE id = ?
    `,
    [id],
  );

  return result.affectedRows > 0;
}
