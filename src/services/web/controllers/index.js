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
router.get("/nosotros", async (req, res) => {
    const head = await Header({
        title: "Nosotros",
    });
    return await render({
        head,
        props: {},
    })(req, res);
});
router.get("/nosotros/:id", async (req, res) => {
    const head = await Header({
        title: `Nosotros ${req.params.id}`,
    });
    return await render({
        head,
        props: {
            id: req.params.id,
            hola: "mundo",
        },
    })(req, res);
});
export default router;
