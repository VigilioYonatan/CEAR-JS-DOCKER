import { omit } from "@vigilio/valibot";
import userSchema from "../schemas/user.schema.js";

export const userStoreDto = omit(userSchema, ["id"]);

export const userUpdateDto = omit(userSchema, ["id"]);
