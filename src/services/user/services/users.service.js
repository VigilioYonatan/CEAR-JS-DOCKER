let users = [];

const usersService = {
    index: (_, res) => {
        res.json({
            users,
            message: "Hello World",
            status: "success",
            data: {
                name: "John Doe",
                email: "john.doe@example.com",
            },
        });
    },
    show: (req, res) => {
        const { id } = req.params;
        const user = users.find((user) => user.id === id);
        if (!user) {
            return res.status(404).json({
                message: "User not found",
                status: "error",
            });
        }
        res.json({
            success: true,
            user,
        });
    },
    store: (req, res) => {
        const { name, email } = req.body;
        const user = { id: users.length + 1, name, email };
        users = [...users, user];
        res.json({
            success: true,
            user,
        });
    },
    update: (req, res) => {
        const { id } = req.params;
        const { name, email } = req.body;
        users = users.map((user) =>
            user.id === id ? { ...user, name, email } : user
        );
        res.json({
            message: "User updated",
            status: "success",
        });
    },
    destroy: (req, res) => {
        const { id } = req.params;
        users = users.filter((user) => user.id !== id);
        res.json({
            message: "User deleted",
            status: "success",
        });
    },
};
export default usersService;
