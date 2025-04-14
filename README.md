# CMPC-LIBROS

## Carpetas:

- Frontend: React + TypeScript + Vite

- Backend: Nestjs + sequelize
- Crear archivo .env indicando nombre de base de datos, password y usuario (considerar archivo env.example)

## Uso de docker

Para correr este proyecto usar docker, en mi caso:

Usé colima para docker.
Desde el terminal:

```bash
$ brew install colima
$ brew install lima
$ colima start
```

Luego para levantar los contenedores:
Desde la carpeta CMPC-LIBROS, en un terminal:

```bash
$ docker-compose up
```

## Para instalar nuevos paquetes:

### Eliminar el node modules:

```bash
$ rm -rf backend/node_modules
$ rm -rf frontend/node_modules
```

### Luego reconstruir el contenedor:

```bash
$ docker-compose up --build
```

# Levantar el proyecto:

Luego de levantar el contenedor:

```bash
$ http://localhost:3001/
```

# Swagger:

Para acceder a swagger, luego de levantar el contenedor:

```bash
$ http://localhost:3000/api-swagger
```

## Supuestos:

Se tienen dos gráficos de productos:

- Libros tienen atributos como: titulo, autor, editorial, precio, disponibilidad, género, stock, descripción y código isbn
- El género puede corresponder a un set definido de opciones como: no ficción, ficción, tecnología, historia, otros.

Los libros son obtenidos por medio de endpoints, desde el backend.
![Login](img1.png)
![Litado de libros filtrado por disponibilidad](img2.png)
![Edición](img3.png)
![Listado de libros](img4.png)

## Documentación utilizada

- Nestjs - [https://docs.nestjs.com/](https://docs.nestjs.com/)
- Material UI [https://mui.com/material-ui/getting-started/](https://mui.com/material-ui/getting-started/)
- React - [https://react.dev/reference/react](https://react.dev/reference/react)
- Colima - [https://github.com/abiosoft/colima](https://github.com/abiosoft/colima)

## Autor

Carolina Lagos - Ingeniero civil en informática
