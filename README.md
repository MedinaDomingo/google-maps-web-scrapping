# Google Maps Scraper

Este código realiza scraping en Google Maps utilizando **Puppeteer** y **Express.js** para extraer información detallada sobre lugares basados en una consulta de búsqueda.

## Características

- Búsqueda en Google Maps a través de un endpoint.
- Extrae nombres, enlaces, calificaciones, opiniones, direcciones y comentarios de lugares.

## Requisitos previos

Asegúrate de tener instalado lo siguiente:

- [Node.js](https://nodejs.org/) (versión 14 o superior)
- npm (normalmente se instala junto a Node.js)

## Instalación

1. Clona este repositorio:

```bash
git clone https://github.com/MedinaDomingo/google-maps-web-scrapping.git
cd google-maps-scrapping
```

2. Instala las dependencias:

```bash 
npm install
```
## Uso
1. Inicia el servidor:
```bash 
npm start
```
Esto iniciará la aplicación en el puerto 3000 o en el puerto especificado en la variable de entorno PORT.

2. Consulta de búsqueda:
```bash
GET /search?q=<término_de_búsqueda>
```

# Ejemplo de uso:
```bash
http://localhost:3000/search?q=restaurantes+en+Buenos+Aires
```
