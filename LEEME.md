# R Archilla

App tipo Duolingo para dominar R y RStudio, construida sobre el temario de Canvas de
*Programación para Ciencia de Datos I – R (G236)*.

## Cómo abrirla

**En el móvil o en cualquier sitio:** https://pokloweb.github.io/r-archilla/
(en el móvil, menú del navegador → «Añadir a pantalla de inicio» para tenerla como app).

**En el PC sin internet a GitHub:** doble clic en **`Abrir R Archilla.bat`**. Se abre el navegador en `http://localhost:8421`.
Deja abierta la ventana negra mientras la uses.

Necesita internet la primera vez de cada sesión: descarga R (webR, R compilado a WebAssembly)
para ejecutar tu código de verdad dentro del navegador. Sin conexión, los ejercicios de código
pasan a autoevaluación.

## Qué hay dentro

- 8 unidades + 2 simulacros (Parcial 1 y examen final), 67 niveles y más de 430 ejercicios.
- Temas 1–3 a partir de los apuntes, el banco de ejercicios, los scripts de clase y el simulacro de Canvas.
- Temas 4–6 (funciones, dplyr/ggplot2/R Markdown, análisis exploratorio) según la guía docente.
- Consola R tipo RStudio (script, consola, environment, gráficos), repaso de errores, apuntes y chuletas.
- El progreso se guarda en el navegador; desde **Perfil** se puede exportar e importar.

## Para desarrolladores

- `node tools/validate.js [u1 u2 ...]` ejecuta las soluciones y las salidas esperadas con el R instalado.
- `index.html?selftest` comprueba todos los ejercicios dentro de webR (incluye dplyr y ggplot2).
- El contenido está en `js/content/*.js`.
