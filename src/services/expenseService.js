import '../utils/handleJSONResponse.js'
const API_URL = (import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3000")
const BASE_URL = `${API_URL}/expenses`;

// getAllUserExpenses => userService

export async function showOne(id) {
    try {
        const res = await fetch(BASE_URL+'/'+id, {
            method: 'GET',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });

        return await handleJSONResponse(res);
    } catch (err) {
        console.error("@expenseSVC > showOne()", err)
    }
}

export async function create(expense) {
    try {
        const res = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(expense)
        });

        return await handleJSONResponse(res);
    } catch (err) {
        console.error("@expenseSVC > create()", err)
    }
}

export async function update(track) {
    try {
        const res = await fetch(`${BASE_URL}/${track._id}`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(track)
        });

        return await handleJSONResponse(res);
    } catch (err) {
        console.error("@expenseSVC > update()", err)
    }
}

export async function deleteExpense(id) {
    try {
        const res = await fetch(BASE_URL + '/' + id, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });

        await handleJSONResponse(res);
        return true;
    } catch (err) {
        console.error("@expenseSVC > deleteExpense()", err)
    }
}