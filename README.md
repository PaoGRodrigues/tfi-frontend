# Trabajo Final Integrador - Frontend

![ReactJs](https://img.shields.io/badge/code-ReactJs-61DAFB?logo=react&logoColor=black)

## Introducción
Este repositorio contiene el frontend del trabajo final **Análisis, visibilidad de tráfico y seguridad para usuarios finales en redes hogareñas**

Esta aplicación otorga visibilidad sobre los datos obtenidos por el backend y la herramienta de monitoreo de tráfico. 

Información disponible
* Dispositivos conectados activos
* Cantidad de tráfico por destino
* Cantidad de tráfico por países
* Listado de alertas de los últimos 7 días
* Bloqueo de tráfico
* Configuración del bot de Telegram

## Instalación
### Prerrequisitos
* Configuración de la Raspberry Pi.
* Configuración e instalación de la herramienta de monitoreo de tráfico.
* Configuración del backend.

### Descarga y ejecución
1. Clonar el repositorio de Github https://github.com/PaoGRodrigues/tfi-frontend.
    ```$ git clone https://github.com/PaoGRodrigues/tfi-frontend```
2. Para instalar Node en la versión que se necesita, ejecutar los siguientes comandos:
    ```
    $ sudo apt-get install nodejs
    $ sudo apt-get install npm
    $ sudo npm install -g n
    $ sudo n 16.14.2
    $ hash -r
    ```
3. Moverse hasta el directorio de la aplicación para poder instalar las dependencias necesarias. Ejecutar:
    ```
    $ cd tfi-frontend/home-security
    $ npm install
    ```
4. Ejecutar el siguiente comando para correr la aplicación:
    ```$ HOST=192.168.0.13 PORT=4500 npm start ~/src/App```
5. Para ver el frontend, en un dispositivo conectado directamente a la red del router hogareño, abrir un navegador e ingresar ```192.168.0.13:4500```

    Cambiar la IP de la Raspberry Pi según sea necesario.