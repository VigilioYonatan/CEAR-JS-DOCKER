import { useMutation } from "@vigilio/preact-fetching";

/**
 * POST http://localhost:3000/api/user
 * body: userStoreDto
 */
export function userStoreApi() {
    return useMutation("/user", async (url, body) => {
        // No es necesario axios y /api/user es el endpoint de la api
        const response = await fetch(`/api${url}`, {
            method: "POST",
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
            },
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    });
}
