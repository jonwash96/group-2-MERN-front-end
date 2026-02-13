import handleJSONResponse from "../utils/handleJSONResponse";

const API_URL =
  import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3009";
const BASE_URL = `${API_URL}/budgets`;

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  };
}

// GET /budgets -> { budgets }
export async function index() {
  try {
    const res = await fetch(BASE_URL, {
      method: "GET",
      headers: authHeaders(),
    });

    return await handleJSONResponse(res);
  } catch (error) {
    console.error("@budgetsSVC > index()", error);
    throw error;
  }
}

// GET /budgets/:id -> { budget }
export async function showOne(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "GET",
      headers: authHeaders(),
    });

    return await handleJSONResponse(res);
  } catch (error) {
    console.error("@budgetsSVC > showOne()", error);
    throw error;
  }
}

// POST /budgets
export async function create(budget) {
  try {
    // Supports both RESTful POST and legacy PUT create routes.
    let res = await fetch(BASE_URL, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(budget),
    });

    if (res.status === 404 || res.status === 405) {
      res = await fetch(BASE_URL, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(budget),
      });
    }

    return await handleJSONResponse(res);
  } catch (error) {
    console.error("@budgetsSVC > create()", error);
    throw error;
  }
}

// PUT /budgets/:id
export async function update(budget) {
  try {
    if (!budget?._id) throw new Error("Budget _id is required for update");

    const res = await fetch(`${BASE_URL}/${budget._id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(budget),
    });

    return await handleJSONResponse(res);
  } catch (error) {
    console.error("@budgetsSVC > update()", error);
    throw error;
  }
}

// DELETE /budgets/:id
export async function deleteBudget(id) {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });

    await handleJSONResponse(res);
    return true;
  } catch (error) {
    console.error("@budgetsSVC > deleteBudget()", error);
    throw error;
  }
}
