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

- 9 mundos (Vectores, Matrices y listas, Data frames, Condicionales, Bucles, Funciones, dplyr,
  ggplot2 y R Markdown, Análisis exploratorio) + 2 simulacros, 62 niveles y unos 400 ejercicios.
- Temas 2–3 a partir de los apuntes, el banco de ejercicios, los scripts de clase y el simulacro de Canvas.
- Temas 4–6 (funciones, dplyr/ggplot2/R Markdown, análisis exploratorio) según la guía docente.
- Consola R tipo RStudio (script, consola, environment, gráficos), apuntes y chuletas.
- **Entrenar**: plan hasta el Parcial 1, reto diario, contrarreloj, tarjetas con repetición
  espaciada, Cazabugs (20 códigos con errores típicos), repaso de fallos, simulacros en modo
  examen (nota sobre 10 al final) y dominio por mundo.
- **Paso a paso**: tabla vuelta a vuelta de cualquier bucle, con R real.
- **Traductor de errores**: explica en español los mensajes de error de R.
- App instalable (PWA): funciona sin conexión y guarda R en caché tras la primera carga.
- El progreso se guarda en el navegador; desde **Perfil** se puede exportar e importar.

## Para desarrolladores

- `node tools/validate.js [u1 u2 ...]` ejecuta las soluciones y las salidas esperadas con el R instalado.
- `index.html?selftest` comprueba todos los ejercicios dentro de webR (incluye dplyr y ggplot2).
- El contenido está en `js/content/*.js`.
