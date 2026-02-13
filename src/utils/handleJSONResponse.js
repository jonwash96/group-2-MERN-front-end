export default async function handleJSONResponse(res) {
    if (!res.ok) {
        const contentType = res.headers.get("content-type") || "";
        if (contentType.includes("application/json")) {
            const data = await res.json().catch(() => null);
            throw new Error(
                data?.message || data?.err || `Request failed: ${res.status} ${res.statusText}`,
            );
        }

        const text = await res.text().catch(() => "");
        throw new Error(text || `Request failed: ${res.status} ${res.statusText}`);
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
