# Documentación del Proyecto

**Autor**: Yonatan Vigilio Lavado

---

## 📚 Conocimientos Técnicos

-   **Frontend**: HTML, CSS, TailwindCSS, TypeScript (decoradores), React
-   **Backend**: MySQL, Sequelize
-   **Arquitectura**: Software en Servicios

---

## 🛠️ Extensiones de VSCode para Productividad

-   **Linting/Formatting**: Biome, Prettier, Pretty TypeScript
-   **Tailwind**: TailwindCSS Intellisense
-   **React**: ES7+ React/Redux/React-Native
-   **Productividad**:
    -   Auto Close Tag, Auto Rename Tag
    -   Inline Fold, Multiple Cursor Case Preserve
    -   TypeScript Importer

---

## 🚀 Getting Started

Este proyecto utiliza **Arquitectura de Monorepositorio** con NPM Workspaces:  
[Guía de Monorepositorios](https://www.paradigmadigital.com/dev/monorepositorios-npm-workspaces/)
Frontend y servidor en un solo proyecto. Personalmente la mejor arquitectura de software

---

## 📝 Notas Técnicas

### Backend

-   Inspirado en NestJS (servicios, controladores, pipes, middlewares, guards) pero optimizado.
-   Framework escalable `@vigilio/express-core` (usa Express@4 como core).  
    → Ubicación start: `/src/main.ts`

### Frontend

-   **Librerías clave**:
    -   `@vigilio/preact-fetching`: Alternativa ligera a React Query.
    -   `@vigilio/preact-table`: Tablas dinámicas.
    -   `@vigilio/preact-paginator`: Paginación.
    -   `@vigilio/sweet`: Alternativa a SweetAlert2.
    -   `@preact/signals`: Reemplazo de `useState` (mejor rendimiento).
    -   `wouter-preact`: Alternativa a React Router v6.
    -   `million-js`: Optimización de reactividad.
    -   `react-hook-form`: Manejo de formularios.
    -   `@vigilio/valibot`: Validaciones (alternativa a Zod).
-   **Herramientas**:
    -   `@biomejs/biome`: Linting y formateo (solo desarrollo).
        ```bash
        npm run biome:format
        npm run biome:check
        ```

---

→ Ubicación start: `/src/pages/main.tsx`

IMPORTANTE: los helpers o libs funciones estan separados por client y server ya que el servidor nodejs. No lee la API de window por que es del cliente y habrá error, por eso la separación

## ✅ Buenas Prácticas y Convenciones

### Sintaxis

-   **Funciones**:

    ```ts
    // ❌ Incorrecto
    const hi = () => {};

    // ✅ Correcto
    function hi() {}

    // Arrow functions solo en callbacks
    array.map(() => {}); // ✅
    element.addEventListener(() => {}); // ✅
    ```

## SERVER PRACTICAS

### Schemas

Es el nucleo de cada servicio, la cual servirá para que los demas trabajen (dtos,pipes, entidades,etc).

```ts
export const usersSchema = object({
    id: number(),
    fullname: string([minLength(3), maxLenth(20)]),
    email: string([email()]),
    age: number(),
    rol: union([literal("admin"), literal("client")]),
    address: nullable(object({ zip: string(), code: string() })),
    enabled: boolean(),
});
export type UsersSchema = Input<typeof usersSchema>;
```

### Entidades

Es conocido tambien como model, el que se conecta y inserta en la base de datos.

```ts
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import type { UsersSchema } from "../schemas/users.schema";

@Table({ tableName: "users" })
export class UsersEntity extends Model implements Omit<UsersSchema, "id"> {
    @Column({ type: DataType.STRING(255), allowNull: false })
    fullname: string;

    @Column({ type: DataType.STRING(255), allowNull: false })
    email: string;

    @Column({ type: DataType.INTEGER, allowNull: false })
    age: number;

    @Column({ type: DataType.ENUM("admin", "client"), allowNull: false })
    role: "admin" | "client";

    @Column({ type: DataType.INTEGER })
    address: UsersSchema["address"];
}
```

### Controladores

Crear un controlador - Solo sirve para crear endpoint y validar los body, parametros y obtener los resultados.
Buena practica usar convesión de laravel: index, show, store, update, delete.
Si muestras vistas: create y edit

```ts
//@Injectable() - Esto es obligatorio si inyectas un servicio
@Controller("/users")
export class UsersController{
    constructor(private readonly usersService:UsersService){}
     //mostrar todos los usuarios
    @Get("/",[/* entra  middlewares nativos */])
    async index(){
        const result = await this.usersService.index()
        return result;
    }

    @Get("/:id")  //mostrar un usuario
    async show(@Params("id")id:string){}

    @Post("/")
    async store(@Body()body){}

    @Put("/:id")  //editar un usuario
    async update(@Params("id")id:string@Body()body){}

    @Delete("/:id")  //eliminar un usuario
    async destroy(@Params("id")id:string){}
}
```

### Dtos y Pipes

Dtos: Para validar el body que viene desde el cliente
Pipes: Para validar los parametros /:id
Ambos se usan en los controladores

```ts
export const usersStoreDto = omit(usersSchema, ["id"]); // quitar id, puedes quitar
export type UsersStoreDto = Input<typeof usersStoreDto>;

export const usersUpdateDto = omit(usersSchema, ["id"]); // quitar id
export type UsersUpdateDto = Input<typeof usersStoreDto>;

// omit: omitir atributos
// pick: escoger atributos. es lo contrario de omit. solo escoger los attributos
// merge: juntar dos schemas, dtos, etc
// https://www.npmjs.com/package/@vigilio/valibot

@Controller("/users")
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Validator(usersStoreDto) //dto validacion
    @Pipe(object({ id: string() })) //aca puedes hacer validacion del parametro
    @Get("/:id") //editar un  usuario por id
    async update(@Params("id") id: string, @Body() body: UsersStoreDto) {
        const result = await this.usersService.update(id, body);
        return result;
    }
}
```

### Servicios

Se encarga de la logica de cada controlador.

```ts
export class UsersService {
    async index() {
        const data = await Users.findAll();
        return { success: true, data };
    }

    async show(id: string) {
        const data = await Users.findByPK(id);
        if (!data) {
            throw new NotFoundException("usuario no found");
            // NotFoundException(404), BadRequestException(400), InternalServerException(500) y más
        }
        return { success: true, data };
    }

    async store(body: UsersStoreDto) {
        const user = await Users.create(body);
        return { success: true, user };
    }

    async update(id: string, body: UsersStoreDto) {
        const { user } = await this.show(id); // aqui de show y lo elimina
        await user.update(body);
        return { success: true, user };
    }

    async destroy(id: string, body: UsersStoreDto) {
        const { user } = await this.show(id);
        await user.destroy();
        return { success: true, message: "Eliminado correctamente" };
    }
}
```

### Middlewares

Antes de entrar a un endpoint se ejecuta un middleware.

```ts
export function Auth() {
    return (
        target: unknown,
        propertyKey: string,
        _descriptor: PropertyDescriptor
    ) => {
        attachMiddleware(
            target,
            propertyKey,
            async (req: Request, res: Response, next: NextFunction) => {
                const autenticado = true;
                if (!autenticado) {
                    return res
                        .status(401)
                        .json({ success: false, message: "Unauthorized" });
                }
                next();
            }
        );
    };
}

@Controller("/users")
export class UsersController {
    @Auth() // se ejecuta esto primero antes de entrar al enpoint
    @Post("/")
    async store() {}
}
```

### Guards

Es un middleware pero se encarga proteger los endpoint segun roles.

```ts
const user = { id: 1, name: "yonatan", role: "admin" };
if (!user.role !== "admin") {
    return res.status(401).json({ success: false, message: "Unauthorized" });
}
next();
```

### FRONTEND

-   React, Signals, valibot para formularios

```tsx
const novedadTypeStoreForm = useForm<NovedadTypeStoreDto>({
    resolver: valibotResolver(novedadTypeStoreDto),
    mode: "all",
    // defaultValues: ...para que autocomplete
});
const novedadTypeStoreMutation = novedadTypeStoreApi();

function onNovedadTypeStore(body: NovedadTypeStoreDto) {
    sweetModal({
        title: "¿Estas seguro de crear este tipo de novedad?",
        isCloseInBackground: false,
        showCancelButton: true,
        showCloseButton: true,
        showConfirmButton: true,
    }).then(({ isConfirmed }) => {
        if (isConfirmed) {
            novedadTypeStoreMutation.mutate(body, {
                onSuccess(data) {
                    // refetch({
                    //     ...data.novedadType,
                    //     user_academic: authStore.user!,
                    // });
                    novedadTypeStoreForm.reset(); // reiniciar formulario
                    sweetAlert({
                        icon: "success",
                        title: "Novedad creado correctamente",
                    });
                },
                onError(error) {
                    sweetAlert({
                        icon: "danger",
                        title: error.message || "Error al crear el novedad",
                    });
                },
            });
        }
    });
}

return (
    <>
        <Form onSubmit={onNovedadTypeStore} {...novedadTypeStoreForm}>
            <Form.control
                name="name"
                title="Nombre"
                placeholder="ejm: Lectura"
            />
            {/* archivos */}
            <Form.control.file name="image" title="Imagen" />
            {/* select */}
            <Form.control.select name="" />
            <Form.button.submit
                isLoading={novedadTypeStoreMutation.isLoading || false}
                disabled={novedadTypeStoreMutation.isLoading || false}
                title="Crear"
            />
        </Form>
    </>
);
```

#### PM2

pm2 start app.js --name "my-api" --restart-delay=3000 --max-restarts=5

# POSIBLES ERRORES QUE PUEDES ENCONTRAR

1.

```cmd
ver. 5.8.3)
 ReferenceError: exports is not defined
 ERROR: Uncaught Exception
    err: {
      "type": "ReferenceError",
      "message": "exports is not defined",
      "stack":
          ReferenceError: exports is not defined
              at file:///C:/Users/user/Deskto
```

Solución: Quiere decir que haz usado algun metodo del cliente en el servidor. Ejemplo usaste environments del cliente y lo importaste al servidor por error. o importaste algun metodo o funcion que tuvo en el archivo alguno de eso. solución compleja, buscar eso. mayormente lo encontraras en los schemas ese error ya que importaste algun metodo filesSchema() es lo mas comun

{# GITHUB ACTIONS #}
github/settings/secrets

1. Usar abort controller
   Evita bugs

```js
export function emailUsuarioIndexApi() {
    const query = useQuery("/usuario", async (url, signal) => {
        const response = await fetch(`/api${url}`, {
            signal,
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.message);
        }
        return result;
    });
    return query;
}
```
