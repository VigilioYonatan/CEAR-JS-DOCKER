# EMPEZANDO

1. npm i && Instalar podman - ./config/podman.md
2. Ejecutar podman : docker compose -f ./config/docker-compose.yml up -d --build
3. ver contenedores corriendo: pd ps -a (veras tu app y base de datos corriendo up significa que esta corriendo, exited que se detuvo)
4. pd logs -f hashdeconenedorapp - ver en terminal en consola en tiempo real de la app servidor
5. pd exec -it hashdecontenedorapp sh - entrar en shell del contenedor y ejecuta npm run dev (correr vite)
6. y npm run dev de local . Eso quiero decir que tendras dos vite corriendo uno del contenedor podman y otro del contenedor. tendras 3 terminales corriendo , y ya puedes cerrar el vite del contenedor y solo el local abierto. y eso es todo puedes entrar a localhost:puertodeservidor y veras que ya corre en docker tu app
7. si qieres ver tu base de ddatos , usa en host HOST: localhost y no postgres_db , name: postgres, password: tupassword, etc
