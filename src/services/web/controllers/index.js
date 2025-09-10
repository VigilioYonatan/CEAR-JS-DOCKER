import { Router } from "express";
import { Header, render } from "../libs/index.js";

export const router = Router();

router.get("/", async (req, res) => {
    const head = await Header({
        title: "Home",
    });
    return await render({
        head,
        props: {},
    })(req, res);
});

export default router;
