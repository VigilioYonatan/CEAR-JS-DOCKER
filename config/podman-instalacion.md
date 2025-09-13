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
pd compose -f ./config/docker-compose.yml up -d --build
