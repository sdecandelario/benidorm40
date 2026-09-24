# Benidorm 40

Página estática de una sola vista para invitar a los amigos al finde de celebración
del 40 cumpleaños de Sergio en Benidorm (17–21 de septiembre de 2027).

## Estructura

- `index.html` — contenido de la página (hero, plan, logística, RSVP).
- `css/style.css` — estilos.
- `js/main.js` — countdown hasta el evento.
- `assets/img/` — imágenes.

## Pendiente de rellenar

- Formulario real de Google Forms (sustituir el `src` del iframe y el enlace de
  fallback en la sección `#rsvp`).
- Punto de encuentro, alojamiento y cómo llegar (sección `#logistica`).
- Texto de "El plan".
- Fotos en `assets/img/`: son placeholders libres de derechos (Pexels). Sustitúyelas
  por fotos reales de Benidorm/del grupo manteniendo el mismo nombre de archivo,
  o cambia la ruta en `.scene-img-*` en `css/style.css`.

## Previsualizar en local

```bash
npx serve .
```

## Despliegue

Publicado con GitHub Pages desde la rama `main`, carpeta raíz.
