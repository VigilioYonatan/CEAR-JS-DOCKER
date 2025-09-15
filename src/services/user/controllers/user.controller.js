import { Router } from "express";
import { ValidatorValibot } from "../../../libs/server/index.js";
import { userStoreDto, userUpdateDto } from "../dtos/user.dto.js";
import usersService from "../services/users.service.js";

export const router = Router();

router.get("/", usersService.index);
router.get("/:id", usersService.show);
// validar el body con valibot req.body, esto todavia no
router.post("/", ValidatorValibot(userStoreDto), usersService.store);
router.put("/:id", ValidatorValibot(userUpdateDto), usersService.update);
router.delete("/:id", usersService.destroy);

export default router;
