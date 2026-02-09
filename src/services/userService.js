import '../utils/handleJSONResponse.js'
const API_URL = (import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3000")
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
        handleError("@userSVC > index()", err);
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
        const res = await fetch(BASE_URL+'/'+uid+'/'+item+'/'+limit, {
            method: 'GET',
            headers: { 
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('token')}`
            },
        });

        return await handleJSONResponse(res);
    } catch (err) {
        handleError("@userSVC > notifications()", err);
    }
}