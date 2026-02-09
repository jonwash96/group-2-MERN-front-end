export default async function handleJSONResponse(res) {
    if (!res.ok) {
        throw new Error(`Request failed: ${res.status} ${res.statusText}`); //? .status or .statusCode? -JW
    }

    if (res.status === 204) return null; //? What's this do? -JW

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
        const text = await res.text();
        throw new Error(
            `Expected JSON response, got ${contentType || "unknown"}: ${text.slice(0, 80)}`,
        );
    }

    return res.json();
}