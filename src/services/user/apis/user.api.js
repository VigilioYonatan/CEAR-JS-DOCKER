import { useMutation, useQuery } from "@vigilio/preact-fetching";

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

/**
 * GET http://localhost:3000/api/user/:id
 * params: id
 */
export function userShowApi() {
    return useQuery("/user/:id", async (url) => {
        const response = await fetch(`/api${url}`, {
            method: "GET",
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    });
}

/**
 * PUT http://localhost:3000/api/user/:id
 * params: id
 * body: userUpdateDto
 */
export function userUpdateApi() {
    return useMutation("/user/:id", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "PUT",
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

/**
 * DELETE http://localhost:3000/api/user/:id
 * params: id
 */
export function userDestroyApi() {
    return useMutation("/user/:id", async (url, body) => {
        const response = await fetch(`/api${url}`, {
            method: "DELETE",
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    });
}
