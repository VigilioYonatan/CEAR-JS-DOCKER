import "module-alias/register.js";
import { client } from "@vigilio/express-core/client";
import express from "express";
import enviroments from "./config/server/environments.config.js";
import userRouter from "./services/user/controllers/user.controller.js";
import webRouter from "./services/web/controllers/index.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(client({ file: "pages/main.jsx" }));

app.use("/", webRouter);
app.use("/users", userRouter);

app.listen(enviroments.PORT, () => {
    // biome-ignore lint/suspicious/noConsole: <explanation>
    console.log(
        `Server is running on port ${enviroments.PORT} - ${enviroments.NODE_ENV}`
    );
});
