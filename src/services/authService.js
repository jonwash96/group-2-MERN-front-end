const API_URL = (import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3009")
const BASE_URL = `${API_URL}/auth`;

export async function signUp(formData) {
	try {
		const res = await fetch(`${BASE_URL}/sign-up`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		const data = await res.json();
		if (data.err) throw new Error(data.err);
		if (!data.token) throw new Error("Invalid response from the server. Token not found.");
		
		// fix: use data.token (token wasn't defined before)
		localStorage.setItem('token', data.token);

		return data.user; // kept it consistent with signIn by returning the user object
	} catch (err) {
		// err might already be an Error
		throw new Error(err?.message || String(err));
	}
};

export async function signIn(formData) {
	try {
		const res = await fetch(BASE_URL+'/sign-in', {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		const data = await res.json();
		if (data.err) throw new Error(data.err);
		if (!data.token) throw new Error("Invalid Response from server. Token not found.");

		console.log("@signin service", data);
		localStorage.setItem("token", data.token);
		// return JSON.parse(atob(data.token.split(".")[1])).payload;
		return data.user
	} catch (err) {
		throw new Error(err);
	}
};

// added a signOut helper
export function signOut() {
	localStorage.removeItem("token");
};