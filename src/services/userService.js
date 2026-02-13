import handleJSONResponse from '../utils/handleJSONResponse.js'
const API_URL = (import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3009")
const BASE_URL = `${API_URL}/users`;

// getAllUserData
export async function index(uid) {
    try {
        const res = await fetch(BASE_URL+'/'+uid, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });

        return await handleJSONResponse(res);
    } catch (err) {
        console.error("@userSVC > index()", err);
    }
}

// getUserItems
    // getUserExpenses
    // getUserNotifications
    // getuserReceipts
    // getUserActivity
    // getUserBudgets
export async function getUserItem(uid, item, limit=10) {
    try {
        const qs = new URLSearchParams();
        if (limit) qs.set("limit", limit)

        const res = await fetch(BASE_URL, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });

        return await handleJSONResponse(res);
    } catch (err) {
        console.error("@userSVC > notifications()", err);
    }
}