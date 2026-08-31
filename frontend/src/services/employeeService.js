import api from "./api";

// export async function getEmployees(search = "") {
//   const response = await api.get("/employees", {
//     params: {
//       search: search || undefined,
//     },
//   });

//   return response.data.data;
// }

export async function getEmployees({ search = "", page = 1, limit = 10 }) {
  const response = await api.get("/employees", {
    params: {
      search,
      page,
      limit,
    },
  });

  return response.data;
}

export async function getEmployee(id) {
  const response = await api.get(`/employees/${id}`);

  return response.data.data;
}

export async function createEmployee(data) {
  const response = await api.post("/employees", data);

  return response.data;
}

export async function updateEmployee(id, data) {
  const response = await api.put(`/employees/${id}`, data);

  return response.data;
}

export async function deleteEmployee(id) {
  const response = await api.delete(`/employees/${id}`);

  return response.data;
}
