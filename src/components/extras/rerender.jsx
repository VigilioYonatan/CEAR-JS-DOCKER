import enviroments from "../../config/client/environments.config";

let counter = 0;
function Rerender() {
    if (enviroments.VITE_ENV === "production") return null;
    counter++;
    return (
        <div className="fixed bottom-6 shadow-lg right-6 bg-primary text-white  rounded-lg  font-bold p-2 z-50">
            Render Count: <b className="font-black">{counter}</b>
        </div>
    );
}

export default Rerender;
