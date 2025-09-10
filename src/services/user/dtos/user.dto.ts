import { omitAsync } from "@vigilio/valibot";
import userSchema from "../schemas/user.schema.js";

export const userStoreDto = omitAsync(userSchema, ["id"]);
