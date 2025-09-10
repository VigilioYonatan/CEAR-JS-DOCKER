import { useSignal } from "@preact/signals";

function index() {
    const counter = useSignal(0);

    return (
        <div>
            <div>index 2 {counter.value}</div>
            <button
                class="bg-blue-500 text-white p-2 rounded-md "
                onClick={() => counter.value++}
            >
                Increment
            </button>
        </div>
    );
}

export default index;
