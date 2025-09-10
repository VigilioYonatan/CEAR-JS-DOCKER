const usersService = {
    index: (_, res) => {
        res.json({
            message: "Hello World",
            status: "success",
            data: {
                name: "John Doe",
                email: "john.doe@example.com",
            },
        });
    },
    show: (_, res) => {
        res.json({
            message: "Hello World",
            status: "success",
            data: {
                name: "John Doe",
                email: "john.doe@example.com",
            },
        });
    },
};
export default usersService;
