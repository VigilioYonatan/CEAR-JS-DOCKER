import { useSignal } from "@preact/signals";
import {
    UserIndex,
    UserStore,
} from "../services/user/components/user.components";

function index() {
    const counter = useSignal(0);
    function handleIncrement() {
        counter.value = counter.value + 1;
    }

    return (
        <div>
            {/* first example */}
            <button
                class="bg-blue-500 text-white p-2 rounded-md "
                onClick={handleIncrement}
                type="button"
            >
                Increment <b>{counter.value}</b>
            </button>
            <br />
            <br />

            <UserIndex />
            <br />
            <br />
            {/* second example */}
            <UserStore />
        </div>
    );
}

export default index;
