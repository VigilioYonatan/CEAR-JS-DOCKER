import { valibotResolver } from "@vigilio/valibot/resolver/react-hook-form";
import { useForm } from "react-hook-form";
import { userStoreDto } from "../dtos/user.dto";
import { userGeneroArray } from "../libs";
import { useQuery } from "@vigilio/preact-fetching";

export function UserIndex() {
    // useQuery para meodos get y useMutation para meodos post, put, delete
    // https://www.npmjs.com/package/@vigilio/preact-fetching

    const pokeapiQuery = useQuery(
        "https://pokeapi.co/api/v2/pokemon",
        async (url) => {
            const response = await fetch(url);
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message);
            }
            return result;
        }
    );

    if (pokeapiQuery.isLoading) return <div>Loading...</div>;
    if (pokeapiQuery.error)
        return <div>Error: {pokeapiQuery.error.message}</div>;

    return <div>{JSON.stringify(pokeapiQuery.data)}</div>;
}

export function UserStore() {
    // react hook form paa manejar los formularios
    // https://react-hook-form.com/get-started

    const userStoreForm = useForm({
        resolver: valibotResolver(userStoreDto),
        defaultValues: {
            name: "YONATHAN",
        },
        mode: "all",
    });

    // VER ERRORS
    console.log(userStoreForm.formState.errors);
    console.log(userStoreForm.watch("name"));

    function onSubmonUserStore(data) {
        console.log(data);
        // mutation.mutate(data,{onSuccess,onError});
    }
    return (
        <div>
            <form onSubmit={userStoreForm.handleSubmit(onSubmonUserStore)}>
                <input type="text" {...userStoreForm.register("name")} />
                <input type="email" {...userStoreForm.register("email")} />
                <input
                    type="password"
                    {...userStoreForm.register("password")}
                />
                {userGeneroArray.map((genero) => (
                    <div key={genero.key}>
                        <input
                            type="radio"
                            {...userStoreForm.register("genero")}
                            id={genero.key}
                        />
                        <label htmlFor={genero.key}>{genero.value}</label>
                    </div>
                ))}
                <button
                    className="bg-blue-500 text-white p-2 rounded-md "
                    type="submit"
                >
                    Guardando..
                </button>
            </form>
        </div>
    );
}
