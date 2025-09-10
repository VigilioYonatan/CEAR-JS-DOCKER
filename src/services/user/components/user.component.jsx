import { valibotResolver } from "@vigilio/valibot/resolver/react-hook-form";
import { useForm } from "react-hook-form";
import { userStoreDto } from "../dtos/user.dto";
import { userGeneroArray } from "../libs";

export function UserStore() {
    const userStoreForm = useForm({
        resolver: valibotResolver(userStoreDto),
    });
    function onSubmonUserStore(data) {
        console.log(data);
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
                <button type="submit">Guardando..</button>
            </form>
        </div>
    );
}
