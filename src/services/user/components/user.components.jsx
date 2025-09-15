import { useQuery } from "@vigilio/preact-fetching";
import {
    CakeCandlesIconSolid,
    CalendarIconSolid,
    EnvelopeIconSolid,
    LockIconSolid,
    UserIconSolid,
} from "@vigilio/react-icons";
import { sweetModal } from "@vigilio/sweet";
import { valibotResolver } from "@vigilio/valibot/resolver";
import { useForm } from "react-hook-form";
import Card from "../../../components/extras/card";
import Rerender from "../../../components/extras/rerender";
import Form from "../../../components/form";
import { handlerError } from "../../../libs/client/helpers";
import { userStoreApi, userUpdateApi } from "../apis/user.api";
import { userStoreDto } from "../dtos/user.dto";
import { userGeneroArray } from "../libs";

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

    let component = null;
    if (pokeapiQuery.isLoading) {
        component = <div>Loading...</div>;
    }
    if (pokeapiQuery.error) {
        component = <div>Error: {pokeapiQuery.error.message}</div>;
    }
    if (pokeapiQuery.data) {
        component = (
            <div className="flex flex-wrap gap-4 mx-auto justify-center items-center max-h-[500px] overflow-y-auto">
                {pokeapiQuery.data.results.map((item, index) => (
                    <Card className="p-4 min-w-[200px] group" key={item.name}>
                        {index + 1}. {item.name}
                        <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${
                                index + 1
                            }.png`}
                            alt={item.name}
                            className="group-hover:scale-110 transition-all duration-300"
                        />
                    </Card>
                ))}
            </div>
        );
    }
    return component;
}

export function UserStore() {
    // react hook form paa manejar los formularios
    // https://react-hook-form.com/get-started

    const userStoreMutation = userStoreApi();

    const userStoreForm = useForm({
        resolver: valibotResolver(userStoreDto),
        defaultValues: {
            // aqui puedes poner los valores por defecto
            name: "YONATHAN",
            fecha: new Date().toISOString().split("T")[0],
        },
        mode: "all", // all, onBlur, onChange, onSubmit : tipo de formulario
    });

    // VER ERRORS
    console.log(userStoreForm.formState.errors);
    // watch
    console.log(userStoreForm.watch("name"));

    function onSubmonUserStore(data) {
        sweetModal({
            title: "¿Estás seguro de querer guardar los datos?",
            showCancelButton: true,
            showCloseButton: true,
            isCloseInBackground: true,
            showConfirmButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // TAREA :ARREGAR Y AGREGAR LOS CAMPOS QUE FALTAN EN EL FORMULARIO
                userStoreMutation.mutate(data, {
                    onSuccess: () => {
                        sweetModal({
                            title: "Datos guardados correctamente",
                            type: "success",
                        });
                    },
                    onError: (error) => {
                        handlerError(
                            userStoreForm,
                            error,
                            "No se pudo guardar los datos"
                        );
                    },
                });
            }
        });
    }

    return (
        <Card className="p-4 m-6 max-w-[600px] mx-auto">
            <Rerender />
            <h3 class="text-2xl font-bold">Formulario de Usuario</h3>
            <Form onSubmit={onSubmonUserStore} {...userStoreForm}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.control
                        ico={<UserIconSolid />}
                        name="name"
                        title="Nombre"
                        required
                    />
                    <Form.control
                        ico={<EnvelopeIconSolid />}
                        name="email"
                        title="Email"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.control
                        ico={<LockIconSolid />}
                        name="password"
                        title="Contraseña"
                    />
                    <Form.control.select
                        array={userGeneroArray}
                        ico={<UserIconSolid />}
                        name="genero"
                        title="Género"
                        placeholder="Selecciona un género"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.control
                        type="number"
                        name="age"
                        title="Edad"
                        // obligatorio, es un numero
                        options={{ setValueAs: Number }}
                        ico={<CakeCandlesIconSolid />}
                    />
                    <Form.control
                        type="date"
                        name="fecha"
                        title="Fecha"
                        ico={<CalendarIconSolid />}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                <Form.control.toggle name="estado" title="Estado" />
                <Form.button.submit
                    isLoading={false}
                    disabled={false}
                    loading_title="Guardando..."
                    title="Guardar"
                />
            </Form>
            <pre class="p-4 border rounded-lg border-gray-300 mt-4 overflow-auto">
                {JSON.stringify(userStoreForm.watch(), null, 2)}
            </pre>
        </Card>
    );
}

export function UserShow() {
    return <div>UserShow</div>;
}

export function UserEdit(user) {
    const userUpdateMutation = userUpdateApi();
    const userUpdateForm = useForm({
        resolver: valibotResolver(userUpdateDto),
        defaultValues: user,
        mode: "all", // all, onBlur, onChange, onSubmit : tipo de formulario
    });
    function onSubmonUserUpdate(data) {
        userUpdateMutation.mutate(data, {
            onSuccess: () => {
                sweetModal({
                    title: "Datos actualizados correctamente",
                    type: "success",
                });
            },
        });
    }

    return (
        <Card className="p-4 m-6 max-w-[600px] mx-auto">
            <Rerender />
            <h3 class="text-2xl font-bold">Formulario de Usuario</h3>
            <Form onSubmit={onSubmonUserUpdate} {...userUpdateForm}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.control
                        ico={<UserIconSolid />}
                        name="name"
                        title="Nombre"
                        required
                    />
                    <Form.control
                        ico={<EnvelopeIconSolid />}
                        name="email"
                        title="Email"
                        required
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.control
                        ico={<LockIconSolid />}
                        name="password"
                        title="Contraseña"
                    />
                    <Form.control.select
                        array={userGeneroArray}
                        ico={<UserIconSolid />}
                        name="genero"
                        title="Género"
                        placeholder="Selecciona un género"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Form.control
                        type="number"
                        name="age"
                        title="Edad"
                        // obligatorio, es un numero
                        options={{ setValueAs: Number }}
                        ico={<CakeCandlesIconSolid />}
                    />
                    <Form.control
                        type="date"
                        name="fecha"
                        title="Fecha"
                        ico={<CalendarIconSolid />}
                        min={new Date().toISOString().split("T")[0]}
                    />
                </div>
                <Form.control.toggle name="estado" title="Estado" />
                <Form.button.submit
                    isLoading={false}
                    disabled={false}
                    loading_title="Guardando..."
                    title="Guardar"
                />
            </Form>
            <pre class="p-4 border rounded-lg border-gray-300 mt-4 overflow-auto">
                {JSON.stringify(userStoreForm.watch(), null, 2)}
            </pre>
        </Card>
    );
}
