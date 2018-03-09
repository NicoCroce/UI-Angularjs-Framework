# UI-Angularjs-Framework
## Descripción

Es un framework para facilitar tareas de desarrollo y producción.

*   Cuenta con tareas para Js, HTML, fonts, icons y SASS.
*   Levanta un servidor en el puerto 1111 por defecto.
*   Observa las modificaciones de todos los archivos y ejecuta la tarea correspondiente.
*   Para Prod concatena, minifica y limpia el js. Optimiza HTML, CSS y comprime las imágenes. 

## TAREAS

*   **gulp**  *Levanta servidor de desarrollo con sus subtareas.*
*   **gulp deploy** *Genera una carpeta con todos los archivos para el deploy.*
*   **gulp deploy-run** *Genera una carpeta con todos los archivos para el deploy y levanta un server de prueba para verificar que las tareas de PROD fueron realizadas correctamente.*


## Requerimientos
### Gulp 4

En una terminal ejecutar (*Si tenemos la versión 3 primero se debe desinstalar*)

```sh
$ npm rm gulp -g
```
```sh
$ npm rm gulp-cli -g
```

Install the latest Gulp CLI tools globally
```sh
$ npm install gulp-cli -g
```

## Descargar e instalar el Proyecto

Dentro de un directorio limpio ejecutar
```sh
$ git clone https://github.com/NicoCroce/UI-Angularjs-Framework.git
```
```sh
$ cd UI-Angularjs-Framework
```
*Verificar que nos encontramos en la rama "Angularjs"*

Para instalar todas las dependencias ejecutar
```sh
$ npm install
```

Esperar que termine de instalar las dependencias y ejecutar 
```sh
$ gulp
```

Por último observar el resultado en un navegador. 
http://127.0.0.1:1111/
