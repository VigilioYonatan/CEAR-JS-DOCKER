import { Router } from "express";
import usersService from "../services/users.service.js";

export const router = Router();

router.get("/", usersService.index);
router.get("/:id", usersService.show);
// validar el body con valibot req.body, esto todavia no
// router.post("/", ValidatorValibot(userStoreDto), usersService.store);
router.post("/", usersService.store);
router.put("/:id", usersService.update);
router.delete("/:id", usersService.destroy);

export default router;
