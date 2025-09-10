import express from "express";
import userRouter from "./services/user/controllers/user.controller.js";
import webRouter from "./services/web/controllers/index.js";
import { client } from "@vigilio/express-core/client";
import enviroments from "./config/server/environments.config.js";

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(client({ file: "pages/main.jsx" }));

app.get("/", webRouter);
app.use("/users", userRouter);

app.listen(enviroments.PORT, () => {
    console.log(`Server is running on port ${enviroments.PORT}`);
});
