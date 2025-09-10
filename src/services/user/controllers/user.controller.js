import { Router } from "express";
import usersService from "../services/users.service.js";

export const router = Router();

router.get("/", usersService.index);

export default router;
