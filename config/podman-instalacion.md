# INSTALAR PODMAN

1.  Descargar podman cli https://podman.io/ (no desktop - para juniors es)
2.  Descargar powershell - wsl --list debian
3.  podman machine init
4.  podman machine start
5.  instalar python https://www.python.org/downloads/ y incluir path que esta en el instalador
6.  pip install podman-compose

# 🐧 Crear alias pd para podman

## 📝 Pasos:

1. Editar el archivo de configuración del shell
   Bash:

```bash
nano ~/.bashrc # o ~/.bash_profile
```

Agrega al final del archivo:

```bash
alias pd='podman'
```

(Si necesitas sudo):

```bash
alias pd='sudo podman' 3. Guardar y aplicar cambios
```

Guarda el archivo (Ctrl + O + Enter en nano).

Cierra el editor (Ctrl + X).

Recarga el shell:

```bash
source ~/.bashrc  # (o ~/.zshrc, ~/.bash_profile, etc.)
```

{# EJECUTAR PODMAN #}
pd machine start ---iniciar podman
pd compose up -d --build -- ejecutar proyecto
pd ps -a -- ver los contenedores del proyecto
pd image ls -- ver imagenes
pd volume ls -- ver volumenes
pd network ls -- ver canales
pd stop iddeconrendor
pd start iddecontenedor
pd restart iddecontenedor
pd exec -it iddecontenedor sh
// instar paquetes dentro del contenedor segun imagen apk update && apk add nano
npm run dev dentor del contenedor de la aplicacion para corra vite y tambien afuera

pd compose down -v -- bajar el podman

{# reiniciar wsl #}
wsl --shutdown
