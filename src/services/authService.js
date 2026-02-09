import '../utils/handleJSONResponse.js'
const API_URL = (import.meta.env.VITE_BACK_END_SERVER_URL || "http://localhost:3000")
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
		
		localStorage.setItem('token', token);
		return JSON.parse(atob(token.split(".")[1])).payload;
	} catch (err) {
		throw new Error(err);
	}
};

export async function signIn(formData) {
	try {
		const res = await fetch(`${BASE_URL}/sign-in`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(formData),
		});

		const data = await res.json();
		if (data.err) throw new Error(data.err);
		if (!data.token) throw new Error("Invalid Response from server. Token not found.");

		localStorage.setItem("token", data.token);
		return JSON.parse(atob(data.token.split(".")[1])).payload;
	} catch (err) {
		throw new Error(err);
	}
};
