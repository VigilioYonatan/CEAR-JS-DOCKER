import { omitAsync } from "@vigilio/valibot";

export const userStoreDto = omitAsync(userSchema, ["id"]);