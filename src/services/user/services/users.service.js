import { User } from "../../../config/server/db.config.js";

const usersService = {
    index: async (_, res) => {
        const data = await User.find();
        return res.json({
            success: true,
            data,
        });
    },
    show: async (req, res) => {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "error",
            });
        }
        return res.json({
            success: true,
            user,
        });
    },
    store: async (req, res) => {
        console.log({ us: req.body });
        const user = new User(req.body);
        await user.save();
        return res.json({
            success: true,
            user,
        });
    },
    update: async (req, res) => {
        const { id } = req.params;
        const body = req.body;
        await User.update(body, { where: { id } });
        return res.json({
            message: "User updated",
            status: "success",
        });
    },
    destroy: async (req, res) => {
        const { id } = req.params;
        await User.destroy({ where: { id } });
        return res.json({
            message: "User deleted",
            status: "success",
        });
    },
};
export default usersService;
