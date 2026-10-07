// Tema 5: paquetes para ciencia de datos — Mundo dplyr y Mundo ggplot2 + R Markdown
(function () {
  const R = String.raw;
  const F = '```';
  const NOTAS = R`notas <- data.frame(
  alumno = c("Ana", "Luis", "Marta", "Pablo", "Lucía", "Carlos", "Elena", "Jorge"),
  grupo = c("A", "B", "A", "B", "A", "B", "A", "B"),
  parcial1 = c(7.5, 4, 9, 6, 5.5, 3, 8, 6.5),
  parcial2 = c(8, 5, 9.5, 5, 6, 4.5, 7, 7),
  asistencia = c(95, 70, 100, 85, 90, 60, 80, 88)
)`;
  RA_UNITS.push({
    id: 'u7d', tema: 'Tema 5', icon: '🧹', short: 'dplyr', title: 'dplyr: manipular datos', color: '#e84393',
    desc: R`El pipe y los verbos de dplyr: filter, select, mutate, arrange, group_by y summarise. Lo mismo que con corchetes, pero más claro.`,
    cheat: [
      [R`library(dplyr)`, R`Cargar el paquete.`],
      [R`df |> f()   # o  df %>% f()`, R`Pipe: pasa el resultado de la izquierda como primer argumento. Atajo «Ctrl+Shift+M».`],
      [R`filter(df, nota >= 5, grupo == "A")`, R`Filtrar filas (comas = Y).`],
      [R`select(df, alumno, nota); select(df, -id)`, R`Elegir / quitar columnas.`],
      [R`mutate(df, media = (p1 + p2) / 2)`, R`Crear o modificar columnas.`],
      [R`arrange(df, nota); arrange(df, desc(nota))`, R`Ordenar ascendente / descendente.`],
      [R`group_by(df, grupo) |> summarise(media = mean(nota), n = n())`, R`Resumen por grupos.`],
      [R`count(df, grupo)`, R`Contar filas por grupo.`],
      [R`pull(df, columna)`, R`Extraer una columna como vector.`],
      [R`rename(df, nuevo = viejo)`, R`Renombrar columnas.`],
    ],
    lessons: [], // al final del archivo se mueven aquí u7l1–u7l4
    boss: {
      id: 'u7db', title: 'Examen dplyr', icon: '🏰', desc: R`Pipelines completos con dplyr.`, packages: ['dplyr'],
      exercises: [
        { type: 'output', q: R`¿Qué muestra R?`, setup: R`library(dplyr)`, code: R`mtcars |> filter(cyl == 4, mpg > 30) |> nrow()`, answers: [R`[1] 4`] },
        { type: 'output', q: R`¿Qué muestra R?`, setup: R`library(dplyr)
${NOTAS}`, code: R`notas |> mutate(media = (parcial1 + parcial2) / 2) |> filter(media >= 7) |> pull(alumno)`, answers: [R`[1] "Ana"   "Marta" "Elena"`], explain: R`Medias: Ana 7.75, Marta 9.25, Elena 7.5. Jorge se queda en 6.75.` },
        { type: 'match', q: R`Empareja cada verbo de dplyr con su equivalente en R base`, pairs: [[R`filter(df, x > 5)`, R`df[df$x > 5, ]`], [R`select(df, a, b)`, R`df[, c("a", "b")]`], [R`mutate(df, y = x * 2)`, R`df$y <- df$x * 2`], [R`arrange(df, x)`, R`df[order(df$x), ]`]] },
        { type: 'code', q: R`Con «notas» y dplyr, guarda en «ranking» los alumnos con asistencia ≥ 85, con una columna «media» (media de los dos parciales), ordenados de mayor a menor media y solo con las columnas alumno y media.`, setup: R`library(dplyr)
${NOTAS}`, check: R`identical(names(ranking), c("alumno", "media")) && identical(ranking$alumno, c("Marta", "Ana", "Jorge", "Lucía", "Pablo"))`, solution: R`ranking <- notas |>
  filter(asistencia >= 85) |>
  mutate(media = (parcial1 + parcial2) / 2) |>
  arrange(desc(media)) |>
  select(alumno, media)`, hint: R`filter → mutate → arrange(desc()) → select.` },
        { type: 'code', q: R`Con «mtcars», guarda en «res» por número de marchas («gear»): «n» coches, «hp_medio» y la proporción de manuales «prop_manual» (media de «am»).`, setup: R`library(dplyr)`, check: R`.eq(res$gear, c(3, 4, 5)) && .eq(res$n, c(15, 12, 5)) && .eq(res$prop_manual, as.vector(tapply(mtcars$am, mtcars$gear, mean)))`, solution: R`res <- mtcars |>
  group_by(gear) |>
  summarise(n = n(), hp_medio = mean(hp), prop_manual = mean(am))`, hint: R`La media de una columna 0/1 es la proporción de unos.` },
      ],
    },
  });
  RA_UNITS.push({
    id: 'u7', tema: 'Tema 5', icon: '🎨', short: 'ggplot2', title: 'ggplot2 y R Markdown', color: '#3949ab',
    desc: R`Gráficos profesionales por capas con ggplot2 e informes reproducibles con R Markdown.`,
    cheat: [
      [R`library(ggplot2)`, R`Cargar el paquete.`],
      [R`ggplot(df, aes(x = a, y = b)) + geom_point()`, R`Gráfico de dispersión.`],
      [R`geom_line(); geom_col(); geom_bar()`, R`Líneas; barras con altura dada; barras que cuentan.`],
      [R`geom_histogram(bins = 10); geom_boxplot()`, R`Histograma; diagrama de caja.`],
      [R`aes(color = grupo, fill = grupo)`, R`Colorear según una variable.`],
      [R`labs(title = "...", x = "...", y = "...")`, R`Títulos y etiquetas.`],
      [R`facet_wrap(~ grupo)`, R`Un panel por grupo.`],
      [R`theme_minimal()`, R`Cambiar el estilo del gráfico.`],
      [R`${F}{r} ... ${F}`, R`Chunk de código en R Markdown.`],
      [R`echo = FALSE; eval = FALSE; include = FALSE`, R`Opciones de chunk: ocultar código / no ejecutar / ocultar todo.`],
      [R`Ctrl + Shift + K`, R`*Knit*: generar el informe (HTML, PDF, Word).`],
    ],
    lessons: [
      {
        id: 'u7l1', title: 'El tidyverse y el pipe', icon: '🔗', desc: R`Paquetes de ciencia de datos y el operador |>.`, packages: ['dplyr'],
        theory: [
          { title: 'El tidyverse', md: R`El **tidyverse** es una colección de paquetes que comparten filosofía y estilo:

- **dplyr**: manipular datos (filtrar, seleccionar, resumir…).
- **ggplot2**: gráficos.
- **readr**, **tidyr**, **stringr**, **lubridate**…

~~~norun
install.packages("tidyverse")   # una vez
library(dplyr)                  # en cada sesión
library(ggplot2)
~~~

Al cargar dplyr verás un mensaje de que «enmascara» («masks») funciones como «filter» de stats. Es normal.` },
          { title: 'El pipe: |> y %>%', md: R`El **pipe** pasa lo que hay a la izquierda como **primer argumento** de la función de la derecha. Se lee «y después»:

~~~r
v <- c(4, 9, 16, 25)
round(mean(sqrt(v)), 1)          # se lee de dentro afuera
v |> sqrt() |> mean() |> round(1)   # se lee de izquierda a derecha
~~~

- «|>» es el pipe **nativo** de R (desde 4.1).
- «%>%» es el pipe de **magrittr/dplyr** (lo verás mucho en Internet). Funcionan casi igual.
- Atajo en RStudio: **Ctrl + Shift + M**.` },
          { title: 'Datos para practicar', md: R`R trae conjuntos de datos de ejemplo. El más famoso es «mtcars» (32 coches):

~~~r
head(mtcars, 3)
nrow(mtcars)
~~~

| Columna | Significado |
|---|---|
| «mpg» | millas por galón (consumo) |
| «cyl» | cilindros |
| «hp» | caballos |
| «wt» | peso (miles de libras) |
| «am» | 0 = automático, 1 = manual |

También «iris» (flores), «airquality»…` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`c(1, 4, 9) |> sqrt() |> sum()`, answers: [R`[1] 6`] },
          { type: 'mc', q: R`¿Qué es equivalente a «x |> f(y)»?`, options: [R`f(x, y)`, R`f(y, x)`, R`x(f, y)`, R`f(x)(y)`], answer: 0, mono: true },
          { type: 'mc', q: R`¿Qué atajo de RStudio escribe el pipe?`, options: [R`Ctrl + Shift + M`, R`Alt + -`, R`Ctrl + Enter`, R`Ctrl + P`], answer: 0 },
          { type: 'match', q: R`Empareja cada paquete con su función`, pairs: [[R`dplyr`, R`Manipular datos`], [R`ggplot2`, R`Gráficos`], [R`rmarkdown`, R`Informes`], [R`readr`, R`Leer ficheros`]] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`mtcars |> nrow()`, answers: [R`[1] 32`] },
          { type: 'code', q: R`Reescribe «round(mean(c(2.5, 3.7, 4.1)), 1)» usando el pipe «|>» y guarda el resultado en «res».`, check: R`.eq(res, 3.4)`, solution: R`res <- c(2.5, 3.7, 4.1) |> mean() |> round(1)`, hint: R`«vector |> mean() |> round(1)».` },
        ],
      },
      {
        id: 'u7l2', title: 'filter() y select()', icon: '🧹', desc: R`Quedarte con las filas y columnas que necesitas.`, packages: ['dplyr'],
        theory: [
          { title: 'filter(): filas', md: R`~~~r
library(dplyr)
${NOTAS}
filter(notas, parcial1 >= 5)
notas |> filter(grupo == "A", asistencia >= 90)   # coma = Y
notas |> filter(parcial1 < 5 | parcial2 < 5)       # O
notas |> filter(alumno %in% c("Ana", "Jorge"))
~~~

> 💡 Dentro de las funciones de dplyr **no** se escribe «notas$»: basta con el nombre de la columna.` },
          { title: 'select(): columnas', md: R`~~~r
library(dplyr)
${NOTAS}
notas |> select(alumno, parcial1)
notas |> select(-asistencia)              # todas menos asistencia
notas |> select(starts_with("parcial"))   # por patrón
notas |> filter(grupo == "B") |> select(alumno, parcial2)
~~~

| base R | dplyr |
|---|---|
| «df[df$x > 5, ]» | «filter(df, x > 5)» |
| «df[, c("a", "b")]» | «select(df, a, b)» |` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, setup: R`library(dplyr)`, code: R`mtcars |> filter(cyl == 6) |> nrow()`, answers: [R`[1] 7`] },
          { type: 'output', q: R`¿Qué muestra R?`, setup: R`library(dplyr)
${NOTAS}`, code: R`notas |> filter(grupo == "A", parcial1 > 7) |> nrow()`, answers: [R`[1] 3`] },
          { type: 'mc', q: R`¿Qué devuelve «select(notas, -grupo)»?`, options: [R`Todas las columnas excepto «grupo»`, R`Solo la columna «grupo»`, R`Las filas sin grupo`, R`Un error`], answer: 0 },
          { type: 'fill', q: R`Completa para quedarte con alumno y asistencia de los del grupo B`, setup: R`library(dplyr)
${NOTAS}`, code: R`notas |> ___(grupo == "B") |> ___(alumno, asistencia)`, blanks: [[R`filter`], [R`select`]], bank: [R`filter`, R`select`, R`mutate`, R`arrange`] },
          { type: 'code', q: R`Con dplyr, guarda en «riesgo» las filas de «notas» con parcial1 < 5 **o** asistencia < 80, y solo las columnas alumno, parcial1 y asistencia.`, setup: R`library(dplyr)
${NOTAS}`, check: R`identical(names(riesgo), c("alumno", "parcial1", "asistencia")) && identical(riesgo$alumno, c("Luis", "Carlos"))`, solution: R`riesgo <- notas |>
  filter(parcial1 < 5 | asistencia < 80) |>
  select(alumno, parcial1, asistencia)`, hint: R`«filter(... | ...)» y luego «select(...)».` },
          { type: 'code', q: R`Con «mtcars», guarda en «eficientes» los coches con mpg mayor que 25 y **manuales** (am == 1), quedándote con las columnas mpg, hp y wt.`, setup: R`library(dplyr)`, check: R`identical(names(eficientes), c("mpg", "hp", "wt")) && nrow(eficientes) == 6 && all(eficientes$mpg > 25)`, solution: R`eficientes <- mtcars |>
  filter(mpg > 25, am == 1) |>
  select(mpg, hp, wt)`, hint: R`Dos condiciones en «filter» separadas por coma.` },
        ],
      },
      {
        id: 'u7l3', title: 'mutate() y arrange()', icon: '🧪', desc: R`Crear columnas y ordenar.`, packages: ['dplyr'],
        theory: [
          { title: 'mutate(): columnas nuevas', md: R`~~~r
library(dplyr)
${NOTAS}
notas |>
  mutate(media = (parcial1 + parcial2) / 2,
         aprobado = media >= 5,
         nivel = ifelse(media >= 7, "alto", "normal"))
~~~

Puedes usar en la misma «mutate» una columna que acabas de crear («media» → «aprobado»).` },
          { title: 'arrange(): ordenar', md: R`~~~r
library(dplyr)
${NOTAS}
notas |> arrange(parcial1)                 # ascendente
notas |> arrange(desc(parcial1))           # descendente
notas |> arrange(grupo, desc(parcial2))    # por grupo y dentro de grupo
~~~

Encadenando todo:

~~~r
library(dplyr)
${NOTAS}
notas |>
  mutate(media = (parcial1 + parcial2) / 2) |>
  filter(asistencia >= 80) |>
  arrange(desc(media)) |>
  select(alumno, media)
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, setup: R`library(dplyr)
${NOTAS}`, code: R`notas |> arrange(desc(parcial2)) |> head(1) |> pull(alumno)`, answers: [R`[1] "Marta"`], explain: R`«pull()» extrae una columna como vector.` },
          { type: 'output', q: R`¿Qué muestra R?`, setup: R`library(dplyr)`, code: R`data.frame(x = 1:3) |> mutate(y = x * 2, z = y + 1) |> pull(z)`, answers: [R`[1] 3 5 7`] },
          { type: 'mc', q: R`¿Cómo ordenas de **mayor a menor** por «hp»?`, options: [R`arrange(mtcars, desc(hp))`, R`arrange(mtcars, hp, decreasing)`, R`sort(mtcars, hp)`, R`order(mtcars, -hp)`], answer: 0, mono: true },
          { type: 'code', q: R`Añade a «notas» (con mutate) la columna «media» = media de los dos parciales y «apto» = media ≥ 5 **y** asistencia ≥ 80. Guarda el resultado ordenado por media descendente en «final».`, setup: R`library(dplyr)
${NOTAS}`, check: R`.eq(final$media, sort((notas$parcial1 + notas$parcial2) / 2, decreasing = TRUE)) && identical(final$alumno[1], "Marta") && identical(final$apto[final$alumno == "Elena"], TRUE) && identical(final$apto[final$alumno == "Luis"], FALSE)`, solution: R`final <- notas |>
  mutate(media = (parcial1 + parcial2) / 2,
         apto = media >= 5 & asistencia >= 80) |>
  arrange(desc(media))`, hint: R`«mutate(media = ..., apto = ...)» y «arrange(desc(media))».` },
          { type: 'code', q: R`Con «mtcars», crea la columna «kml» (km por litro = mpg × 0.425) y guarda en «top3» los 3 coches con más kml (usa «arrange» y «head»), solo con las columnas mpg y kml.`, setup: R`library(dplyr)`, check: R`nrow(top3) == 3 && identical(names(top3), c("mpg", "kml")) && .eq(top3$mpg, c(33.9, 32.4, 30.4))`, solution: R`top3 <- mtcars |>
  mutate(kml = mpg * 0.425) |>
  arrange(desc(kml)) |>
  select(mpg, kml) |>
  head(3)`, hint: R`mutate → arrange(desc()) → select → head(3).` },
        ],
      },
      {
        id: 'u7l4', title: 'group_by() y summarise()', icon: '📦', desc: R`Resúmenes por grupos: medias, conteos y más.`, packages: ['dplyr'],
        theory: [
          { title: 'Resumir', md: R`«summarise()» reduce muchas filas a **una** con los cálculos que pidas:

~~~r
library(dplyr)
${NOTAS}
notas |> summarise(media_p1 = mean(parcial1), maximo = max(parcial2), n = n())
~~~

«n()» cuenta las filas.` },
          { title: 'Por grupos', md: R`Con «group_by()» antes, el resumen se hace **por cada grupo**:

~~~r
library(dplyr)
${NOTAS}
notas |>
  group_by(grupo) |>
  summarise(media_p1 = mean(parcial1),
            asistencia_media = mean(asistencia),
            n = n())

notas |> count(grupo)        # atajo para contar
mtcars |> group_by(cyl) |> summarise(mpg_medio = mean(mpg))
~~~

> 💡 Es el equivalente moderno de «tapply()» y «aggregate()», pero con varias medidas a la vez.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, setup: R`library(dplyr)
${NOTAS}`, code: R`notas |> summarise(n = n()) |> pull(n)`, answers: [R`[1] 8`] },
          { type: 'output', q: R`¿Qué muestra R?`, setup: R`library(dplyr)
${NOTAS}`, code: R`notas |> group_by(grupo) |> summarise(m = mean(asistencia)) |> pull(m)`, answers: [R`[1] 91.25 75.75`] },
          { type: 'mc', q: R`¿Qué función de dplyr cuenta filas dentro de «summarise»?`, options: [R`n()`, R`count()`, R`length()`, R`nrow()`], answer: 0, mono: true },
          { type: 'order', q: R`Ordena el pipeline que calcula el consumo medio por número de cilindros`, setup: R`library(dplyr)`, lines: [R`mtcars |>`, R`group_by(cyl) |>`, R`summarise(mpg_medio = mean(mpg))`] },
          { type: 'code', q: R`Guarda en «por_grupo» un resumen de «notas» por «grupo» con «media_p2» (media del parcial 2), «mejor_p1» (máximo del parcial 1) y «alumnos» (número de filas).`, setup: R`library(dplyr)
${NOTAS}`, check: R`.eq(por_grupo$media_p2, c(mean(c(8, 9.5, 6, 7)), mean(c(5, 5, 4.5, 7)))) && .eq(por_grupo$mejor_p1, c(9, 6.5)) && .eq(por_grupo$alumnos, c(4, 4))`, solution: R`por_grupo <- notas |>
  group_by(grupo) |>
  summarise(media_p2 = mean(parcial2),
            mejor_p1 = max(parcial1),
            alumnos = n())`, hint: R`group_by(grupo) |> summarise(... = ..., ... = n()).` },
          { type: 'code', q: R`Con «mtcars», guarda en «cambio» la media de caballos («hp_medio») y de consumo («mpg_medio») según el tipo de cambio «am».`, setup: R`library(dplyr)`, check: R`.eq(cambio$hp_medio, as.vector(tapply(mtcars$hp, mtcars$am, mean))) && .eq(cambio$mpg_medio, as.vector(tapply(mtcars$mpg, mtcars$am, mean)))`, solution: R`cambio <- mtcars |>
  group_by(am) |>
  summarise(hp_medio = mean(hp), mpg_medio = mean(mpg))`, hint: R`«group_by(am)».` },
        ],
      },
      {
        id: 'u7l5', title: 'ggplot2: la gramática', icon: '🎨', desc: R`Datos + estética + geometría = gráfico.`, packages: ['ggplot2'],
        theory: [
          { title: 'Gramática de gráficos', md: R`Todo gráfico de ggplot2 se construye **por capas** sumadas con «+»:

1. **Datos**: «ggplot(datos, ...)».
2. **Estética** «aes()»: qué variable va en x, y, color, tamaño…
3. **Geometría** «geom_*()»: puntos, líneas, barras…

~~~r
library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point()
~~~

>! Las capas se unen con **«+»**, no con el pipe «|>».` },
          { title: 'Color, tamaño y etiquetas', md: R`~~~r
library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg, color = factor(cyl))) +
  geom_point(size = 3) +
  labs(title = "Peso vs consumo",
       x = "Peso (miles de lb)", y = "Millas por galón",
       color = "Cilindros") +
  theme_minimal()
~~~

- Dentro de «aes()»: depende de una **variable** («color = factor(cyl)»).
- Fuera de «aes()»: valor **fijo** («color = "red"», «size = 3»).` },
          { title: 'Líneas y tendencias', md: R`~~~r
library(ggplot2)
ventas <- data.frame(mes = 1:12, importe = c(10, 12, 15, 14, 18, 21, 25, 24, 20, 17, 15, 22))
ggplot(ventas, aes(x = mes, y = importe)) +
  geom_line(color = "steelblue") +
  geom_point()

ggplot(mtcars, aes(x = hp, y = mpg)) +
  geom_point() +
  geom_smooth(method = "lm")
~~~` },
        ],
        exercises: [
          { type: 'match', q: R`Empareja cada parte con su papel`, pairs: [[R`ggplot(datos)`, R`Los datos`], [R`aes(x, y)`, R`Qué variable va en cada eje`], [R`geom_point()`, R`Tipo de gráfico`], [R`labs()`, R`Títulos y etiquetas`]] },
          { type: 'mc', q: R`¿Qué símbolo une las capas de un ggplot?`, options: [R`+`, R`|>`, R`%>%`, R`&`], answer: 0, mono: true },
          { type: 'mc', q: R`Quieres todos los puntos en rojo. ¿Qué es correcto?`, options: [R`geom_point(color = "red")`, R`aes(color = "red")`, R`ggplot(color = red)`, R`geom_point(aes = "red")`], answer: 0, mono: true, explain: R`Un color fijo va **fuera** de «aes()». Dentro de «aes» R lo trataría como una variable llamada "red".` },
          { type: 'fill', q: R`Completa el diagrama de dispersión de hp (x) frente a mpg (y)`, setup: R`library(ggplot2)`, code: R`p <- ggplot(mtcars, ___(x = hp, y = mpg)) +
  ___()`, blanks: [[R`aes`], [R`geom_point`]], bank: [R`aes`, R`geom_point`, R`geom_bar`, R`plot`, R`axis`], check: R`inherits(p, "ggplot")` },
          { type: 'code', q: R`Crea y guarda en «p» un gráfico de puntos de «mtcars» con «wt» en x, «mpg» en y y el color según «factor(cyl)». Muéstralo escribiendo «p».`, setup: R`library(ggplot2)`, check: R`inherits(p, "ggplot") && inherits(p$layers[[1]]$geom, "GeomPoint") && rlang::as_label(p$mapping$x) == "wt" && rlang::as_label(p$mapping$y) == "mpg" && !is.null(p$mapping$colour)`, solution: R`p <- ggplot(mtcars, aes(x = wt, y = mpg, color = factor(cyl))) +
  geom_point()
p`, hint: R`«aes(x = wt, y = mpg, color = factor(cyl))».` },
          { type: 'code', q: R`Con «ventas» cargado, guarda en «p» un gráfico de **líneas** del importe por mes con el título "Ventas 2026".`, setup: R`library(ggplot2)
ventas <- data.frame(mes = 1:12, importe = c(10, 12, 15, 14, 18, 21, 25, 24, 20, 17, 15, 22))`, check: R`inherits(p, "ggplot") && any(sapply(p$layers, function(l) inherits(l$geom, "GeomLine"))) && identical(p$labels$title, "Ventas 2026")`, solution: R`p <- ggplot(ventas, aes(x = mes, y = importe)) +
  geom_line() +
  labs(title = "Ventas 2026")
p`, hint: R`«geom_line()» + «labs(title = ...)».` },
        ],
      },
      {
        id: 'u7l6', title: 'ggplot2: tipos de gráfico', icon: '📊', desc: R`Barras, histogramas, cajas y paneles.`, packages: ['ggplot2'],
        theory: [
          { title: 'Barras', md: R`- «geom_bar()»: **cuenta** filas por categoría (solo necesita x).
- «geom_col()»: la altura es una variable (x e y).

~~~r
library(ggplot2)
ggplot(mtcars, aes(x = factor(cyl))) +
  geom_bar(fill = "orange")

resumen <- data.frame(grupo = c("A", "B"), media = c(7.1, 5.6))
ggplot(resumen, aes(x = grupo, y = media)) +
  geom_col(fill = "steelblue")
~~~` },
          { title: 'Distribuciones', md: R`~~~r
library(ggplot2)
ggplot(mtcars, aes(x = mpg)) +
  geom_histogram(bins = 8, fill = "skyblue", color = "white")

ggplot(mtcars, aes(x = factor(cyl), y = mpg)) +
  geom_boxplot() +
  labs(x = "Cilindros", y = "mpg")
~~~

| Quiero ver… | Geometría |
|---|---|
| relación entre 2 numéricas | «geom_point» |
| evolución en el tiempo | «geom_line» |
| frecuencia de categorías | «geom_bar» |
| distribución de 1 numérica | «geom_histogram» |
| numérica por grupos | «geom_boxplot» |` },
          { title: 'Paneles con facet_wrap', md: R`Divide el gráfico en un panel por grupo:

~~~r
library(ggplot2)
ggplot(mtcars, aes(x = wt, y = mpg)) +
  geom_point() +
  facet_wrap(~ am)
~~~` },
        ],
        exercises: [
          { type: 'match', q: R`Empareja cada objetivo con su geometría`, pairs: [[R`Relación entre dos numéricas`, R`geom_point`], [R`Distribución de una variable`, R`geom_histogram`], [R`Frecuencia de categorías`, R`geom_bar`], [R`Comparar grupos`, R`geom_boxplot`]] },
          { type: 'mc', q: R`Tienes un data frame con «producto» y «ventas_totales». ¿Qué geometría dibuja barras con esas alturas?`, options: [R`geom_col()`, R`geom_bar()`, R`geom_histogram()`, R`geom_point()`], answer: 0, mono: true, explain: R`«geom_bar» cuenta filas; «geom_col» usa la variable y como altura.` },
          { type: 'tf', q: R`«geom_histogram()» necesita una variable en x y otra en y.`, answer: false, explain: R`Solo necesita x: R calcula las frecuencias.` },
          { type: 'code', q: R`Guarda en «p» un diagrama de caja de «mpg» por «factor(cyl)» con «mtcars».`, setup: R`library(ggplot2)`, check: R`inherits(p, "ggplot") && inherits(p$layers[[1]]$geom, "GeomBoxplot") && rlang::as_label(p$mapping$y) == "mpg"`, solution: R`p <- ggplot(mtcars, aes(x = factor(cyl), y = mpg)) +
  geom_boxplot()
p`, hint: R`«aes(x = factor(cyl), y = mpg)» + «geom_boxplot()».` },
          { type: 'code', q: R`Guarda en «p» un histograma de «hp» de «mtcars» con 10 intervalos (bins) y relleno "tomato".`, setup: R`library(ggplot2)`, check: R`inherits(p, "ggplot") && inherits(p$layers[[1]]$geom, "GeomBar") && inherits(p$layers[[1]]$stat, "StatBin") && rlang::as_label(p$mapping$x) == "hp"`, solution: R`p <- ggplot(mtcars, aes(x = hp)) +
  geom_histogram(bins = 10, fill = "tomato")
p`, hint: R`«geom_histogram(bins = 10, fill = "tomato")».` },
          { type: 'code', q: R`Con «resumen» cargado, guarda en «p» un gráfico de barras (geom_col) con «grupo» en x y «media» en y, y etiquetas x = "Grupo", y = "Nota media".`, setup: R`library(ggplot2)
resumen <- data.frame(grupo = c("A", "B", "C"), media = c(7.1, 5.6, 6.3))`, check: R`inherits(p, "ggplot") && inherits(p$layers[[1]]$geom, "GeomCol") && identical(p$labels$x, "Grupo") && identical(p$labels$y, "Nota media")`, solution: R`p <- ggplot(resumen, aes(x = grupo, y = media)) +
  geom_col() +
  labs(x = "Grupo", y = "Nota media")
p`, hint: R`«geom_col()» + «labs(x = ..., y = ...)».` },
        ],
      },
      {
        id: 'u7l7', title: 'R Markdown', icon: '📄', desc: R`Informes reproducibles que mezclan texto, código y resultados.`,
        theory: [
          { title: '¿Qué es R Markdown?', md: R`Un archivo **.Rmd** combina:

1. **Cabecera YAML** (entre «---»): título, autor, formato de salida.
2. **Texto** en Markdown («#» títulos, «**negrita**», listas…).
3. **Chunks** de código R que se ejecutan al generar el informe.

Al pulsar **Knit** («Ctrl + Shift + K») se genera un HTML, PDF o Word con el texto, el código y sus resultados (tablas, gráficos). Si cambian los datos, vuelves a pulsar Knit y todo se actualiza: **análisis reproducible**.

~~~norun
---
title: "Análisis de notas"
author: "Tu nombre"
output: html_document
---

# Introducción
Este informe analiza las notas del **grupo A**.

${F}{r}
notas <- c(7, 8.5, 6)
mean(notas)
${F}
~~~` },
          { title: 'Opciones de los chunks', md: R`Se ponen dentro de las llaves: «{r nombre, echo = FALSE}».

| Opción | Efecto |
|---|---|
| «echo = FALSE» | ejecuta pero **no muestra el código** (solo el resultado) |
| «eval = FALSE» | muestra el código pero **no lo ejecuta** |
| «include = FALSE» | ejecuta pero **no muestra nada** (útil para cargar datos/paquetes) |
| «message = FALSE», «warning = FALSE» | oculta mensajes y avisos |

También puedes poner código **en línea** dentro del texto (comilla invertida, «r», la expresión y otra comilla invertida): «La media es 7.17» se calcula sola.

> 💡 Para crear uno: *File › New File › R Markdown…* Necesitas el paquete «rmarkdown» (RStudio te lo instala).` },
        ],
        exercises: [
          { type: 'match', q: R`Empareja cada parte de un .Rmd con su función`, pairs: [[R`YAML (---)`, R`Título y formato`], [R`Texto Markdown`, R`Explicaciones`], [R`Chunk de R`, R`Código que se ejecuta`], [R`Knit`, R`Genera el informe`]] },
          { type: 'mc', q: R`Quieres que en el informe salga el gráfico pero **no** el código que lo genera. ¿Qué opción usas?`, options: [R`echo = FALSE`, R`eval = FALSE`, R`include = FALSE`, R`code = FALSE`], answer: 0, mono: true },
          { type: 'mc', q: R`¿Qué opción ejecuta el chunk pero no muestra ni código ni resultados (ideal para «library()»)?`, options: [R`include = FALSE`, R`echo = FALSE`, R`eval = FALSE`, R`hide = TRUE`], answer: 0, mono: true },
          { type: 'tf', q: R`Con «eval = FALSE» el código del chunk se ejecuta pero no se ve.`, answer: false, explain: R`Es al revés: se **ve** pero **no se ejecuta**.` },
          { type: 'mc', q: R`¿Qué atajo genera (knit) el informe en RStudio?`, options: [R`Ctrl + Shift + K`, R`Ctrl + Enter`, R`Ctrl + Shift + M`, R`Ctrl + K`], answer: 0 },
          { type: 'order', q: R`Ordena las líneas de un documento R Markdown mínimo`, run: false, lines: [R`---`, R`title: "Mi informe"`, R`output: html_document`, R`---`, R`# Resultados`, R`${F}{r}`, R`summary(mtcars$mpg)`, R`${F}`] },
        ],
      },
    ],
    boss: {
      id: 'u7b', title: 'Examen ggplot2', icon: '🏰', desc: R`Gráficos e informes.`, packages: ['dplyr', 'ggplot2'],
      exercises: [
        { type: 'mc', q: R`¿Qué código dibuja la distribución de «mpg» separada por número de cilindros?`, options: [R`ggplot(mtcars, aes(x = factor(cyl), y = mpg)) + geom_boxplot()`, R`ggplot(mtcars, aes(x = mpg)) + geom_line()`, R`ggplot(mtcars, aes(x = cyl, y = mpg)) |> geom_boxplot()`, R`ggplot(mtcars) + geom_bar(mpg)`], answer: 0, mono: true },
        { type: 'mc', q: R`Este código da error. ¿Por qué?`, code: R`ggplot(mtcars, aes(x = wt, y = mpg)) |>
  geom_point()`, options: [R`Las capas de ggplot se unen con «+», no con el pipe`, R`Falta poner color`, R`«wt» no existe en mtcars`, R`geom_point necesita argumentos`], answer: 0 },
        { type: 'match', q: R`Empareja cada opción de chunk con su efecto`, pairs: [[R`echo = FALSE`, R`Oculta el código`], [R`eval = FALSE`, R`No lo ejecuta`], [R`include = FALSE`, R`No muestra nada`], [R`message = FALSE`, R`Oculta mensajes`]] },
        { type: 'code', q: R`Guarda en «p» un gráfico de dispersión de «mtcars» con «hp» en x y «mpg» en y, un panel por tipo de cambio (facet_wrap(~ am)) y el título "Potencia y consumo".`, setup: R`library(ggplot2)`, check: R`inherits(p, "ggplot") && inherits(p$layers[[1]]$geom, "GeomPoint") && inherits(p$facet, "FacetWrap") && identical(p$labels$title, "Potencia y consumo")`, solution: R`p <- ggplot(mtcars, aes(x = hp, y = mpg)) +
  geom_point() +
  facet_wrap(~ am) +
  labs(title = "Potencia y consumo")
p`, hint: R`Suma «facet_wrap(~ am)» y «labs(title = ...)».` },
        { type: 'code', q: R`Con «notas», calcula la media de los dos parciales con mutate y guarda en «p» un gráfico de barras (geom_col) con «alumno» en x y «media» en y, coloreando el relleno por «grupo».`, setup: R`library(dplyr)
library(ggplot2)
${NOTAS}`, check: R`inherits(p, "ggplot") && inherits(p$layers[[1]]$geom, "GeomCol") && "media" %in% names(p$data) && !is.null(p$mapping$fill)`, solution: R`notas <- notas |> mutate(media = (parcial1 + parcial2) / 2)
p <- ggplot(notas, aes(x = alumno, y = media, fill = grupo)) +
  geom_col()
p`, hint: R`Primero mutate, después «ggplot(notas, aes(x = alumno, y = media, fill = grupo)) + geom_col()».` },
      ],
    },
  });
  // Las cuatro primeras lecciones (pipe, filter/select, mutate/arrange, group_by) forman el mundo dplyr
  const dplyrMundo = RA_UNITS.find((u) => u.id === 'u7d');
  const ggplotMundo = RA_UNITS.find((u) => u.id === 'u7');
  dplyrMundo.lessons = ggplotMundo.lessons.splice(0, 4);
})();
