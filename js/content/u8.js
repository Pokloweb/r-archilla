// Unidad 8 — Tema 6: análisis exploratorio de datos (EDA)
(function () {
  const R = String.raw;
  const ENCUESTA = R`encuesta <- data.frame(
  edad = c(19, 21, 18, 22, 20, 19, 35, 21, 20, 19),
  sexo = c("M", "H", "M", "H", "M", "M", "H", "H", "M", "H"),
  horas_estudio = c(10, 4, 12, 6, 8, NA, 2, 7, 9, 5),
  nota = c(8.2, 5.1, 9.0, 6.3, 7.4, 6.8, 4.0, 6.9, 7.8, 5.5),
  carrera = c("IACD", "ADE", "IACD", "Derecho", "ADE", "IACD", "ADE", "Derecho", "IACD", "ADE")
)`;
  RA_UNITS.push({
    id: 'u8', tema: 'Tema 6', icon: '🔍', short: 'Análisis exploratorio', title: 'Análisis exploratorio (EDA)', color: '#3c8dbc',
    desc: R`Describe y visualiza datos como un científico de datos: medidas, tablas de frecuencias, gráficos y relaciones entre variables.`,
    cheat: [
      [R`mean(x); median(x)`, R`Media y mediana (centralidad).`],
      [R`var(x); sd(x)`, R`Varianza y desviación típica (dispersión).`],
      [R`range(x); diff(range(x)); IQR(x)`, R`Rango, amplitud y rango intercuartílico.`],
      [R`quantile(x); quantile(x, 0.9)`, R`Cuartiles / percentil 90.`],
      [R`summary(x); summary(df)`, R`Mínimo, cuartiles, media, máximo (y NA).`],
      [R`table(x); prop.table(table(x))`, R`Frecuencias absolutas y relativas.`],
      [R`round(100 * prop.table(table(x)), 1)`, R`Porcentajes.`],
      [R`names(which.max(table(x)))`, R`Moda de una variable cualitativa.`],
      [R`hist(x); boxplot(x); barplot(table(x))`, R`Gráficos base: histograma, caja, barras.`],
      [R`plot(x, y)`, R`Diagrama de dispersión.`],
      [R`boxplot(y ~ grupo, data = df)`, R`Cajas de una numérica por grupos.`],
      [R`cor(x, y)`, R`Correlación lineal (−1 a 1).`],
      [R`table(df$a, df$b)`, R`Tabla de contingencia (dos cualitativas).`],
      [R`aggregate(y ~ g, data = df, FUN = mean)`, R`Medias por grupo.`],
      [R`colSums(is.na(df)); na.omit(df)`, R`NA por columna / quitar filas con NA.`],
      [R`q <- quantile(x, c(.25, .75)); x < q[1] - 1.5*IQR(x)`, R`Regla de atípicos (1.5 · IQR).`],
    ],
    lessons: [
      {
        id: 'u8l1', title: 'Centralidad y dispersión', icon: '🎯', desc: R`media, mediana, varianza, desviación típica y cuantiles.`,
        theory: [
          { title: 'Medidas de centralidad', md: R`Resumen en un número el «valor típico»:

~~~r
x <- c(2, 3, 3, 5, 7, 10, 40)
mean(x)     # media: sensible a valores extremos
median(x)   # mediana: valor central, robusta
~~~

>! El 40 tira de la media hacia arriba; la mediana apenas se entera. Con datos **asimétricos** (salarios, precios…) la mediana describe mejor.

R no tiene función para la **moda**: para una variable cualitativa usa «names(which.max(table(x)))».` },
          { title: 'Medidas de dispersión', md: R`¿Cómo de separados están los datos?

~~~r
x <- c(2, 3, 3, 5, 7, 10, 40)
var(x)             # varianza (unidades al cuadrado)
sd(x)              # desviación típica (mismas unidades)
range(x)           # mínimo y máximo
diff(range(x))     # amplitud
quantile(x)        # cuartiles: 0%, 25%, 50%, 75%, 100%
IQR(x)             # Q3 - Q1
summary(x)
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`median(c(7, 1, 3, 9, 4))`, answers: [R`[1] 4`], explain: R`Ordenados: 1 3 **4** 7 9.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`median(c(1, 2, 8, 10))`, answers: [R`[1] 5`], explain: R`Con número par de datos, media de los dos centrales: (2 + 8) / 2.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`diff(range(c(12, 4, 30, 18)))`, answers: [R`[1] 26`] },
          { type: 'mc', q: R`Los salarios de una empresa son muy desiguales (unos pocos cobran muchísimo). ¿Qué describe mejor el salario «típico»?`, options: [R`La mediana`, R`La media`, R`La varianza`, R`El máximo`], answer: 0 },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`sd(c(5, 5, 5, 5))`, answers: [R`[1] 0`], explain: R`Si todos los valores son iguales no hay dispersión.` },
          { type: 'match', q: R`Empareja cada función con lo que mide`, pairs: [[R`mean`, R`Media`], [R`sd`, R`Desviación típica`], [R`IQR`, R`Rango intercuartílico`], [R`quantile`, R`Cuantiles`]] },
          { type: 'code', q: R`Con «mtcars», guarda en «media», «mediana» y «desv» la media, mediana y desviación típica de «mpg», y en «p90» el percentil 90.`, check: R`.eq(media, mean(mtcars$mpg)) && .eq(mediana, 19.2) && .eq(desv, sd(mtcars$mpg)) && .eq(p90, quantile(mtcars$mpg, 0.9))`, solution: R`media <- mean(mtcars$mpg)
mediana <- median(mtcars$mpg)
desv <- sd(mtcars$mpg)
p90 <- quantile(mtcars$mpg, 0.9)`, hint: R`«quantile(x, 0.9)».` },
          { type: 'code', q: R`Con «encuesta» cargada, guarda en «media_h» la media de horas de estudio ignorando los NA, y en «cv» el coeficiente de variación de la nota (sd / media).`, setup: ENCUESTA, check: R`.eq(media_h, mean(encuesta$horas_estudio, na.rm = TRUE)) && .eq(cv, sd(encuesta$nota) / mean(encuesta$nota))`, solution: R`media_h <- mean(encuesta$horas_estudio, na.rm = TRUE)
cv <- sd(encuesta$nota) / mean(encuesta$nota)`, hint: R`«na.rm = TRUE» para los NA.` },
        ],
      },
      {
        id: 'u8l2', title: 'Variables cualitativas', icon: '🍰', desc: R`Frecuencias absolutas, relativas, porcentajes y moda.`,
        theory: [
          { title: 'Tablas de frecuencias', md: R`~~~r
carrera <- c("IACD", "ADE", "IACD", "Derecho", "ADE", "IACD")
tabla <- table(carrera)
tabla                                # frecuencia absoluta
prop.table(tabla)                    # relativa (suma 1)
round(100 * prop.table(tabla), 1)    # porcentaje
names(which.max(tabla))              # moda
sort(tabla, decreasing = TRUE)
~~~` },
          { title: 'Gráficos para cualitativas', md: R`~~~r
carrera <- c("IACD", "ADE", "IACD", "Derecho", "ADE", "IACD")
barplot(table(carrera), col = "steelblue", main = "Alumnos por carrera")
pie(table(carrera))
~~~

> 💡 Los gráficos de barras se leen mejor que los de tarta: compara longitudes, no ángulos.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c("a", "b", "a", "c", "a")
as.vector(table(x))`, answers: [R`[1] 3 1 1`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c("sí", "no", "sí", "sí")
prop.table(table(x))[["sí"]]`, answers: [R`[1] 0.75`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c("rojo", "azul", "azul", "verde", "azul")
names(which.max(table(x)))`, answers: [R`[1] "azul"`] },
          { type: 'mc', q: R`¿Qué gráfico es el adecuado para la variable «carrera»?`, options: [R`barplot(table(carrera))`, R`hist(carrera)`, R`plot(carrera, carrera)`, R`boxplot(carrera)`], answer: 0, mono: true, explain: R`«hist» y «boxplot» son para variables numéricas.` },
          { type: 'code', q: R`Con «encuesta» cargada, guarda en «freq» la tabla de frecuencias de «carrera», en «porc» los porcentajes redondeados a 1 decimal y en «moda» la carrera más frecuente.`, setup: ENCUESTA, check: R`.eq(as.vector(freq), c(4, 2, 4)) && .eq(as.vector(porc), c(40, 20, 40)) && moda %in% c("ADE", "IACD")`, solution: R`freq <- table(encuesta$carrera)
porc <- round(100 * prop.table(freq), 1)
moda <- names(which.max(freq))`, hint: R`«table», «prop.table» y «which.max».` },
          { type: 'code', q: R`Dibuja un gráfico de barras de la frecuencia de «cyl» en «mtcars» con «barplot», título "Coches por cilindros" y color "orange".`, check: R`TRUE`, solution: R`barplot(table(mtcars$cyl), main = "Coches por cilindros", col = "orange")`, hint: R`«barplot(table(mtcars$cyl), main = ..., col = ...)».` },
        ],
      },
      {
        id: 'u8l3', title: 'Gráficos con R base', icon: '🖼️', desc: R`hist, boxplot y plot con sus opciones.`,
        theory: [
          { title: 'Histograma y caja', md: R`~~~r
hist(mtcars$mpg, breaks = 8, col = "skyblue",
     main = "Distribución del consumo", xlab = "Millas por galón")
boxplot(mtcars$mpg, horizontal = TRUE, col = "orange")
~~~

El **diagrama de caja** muestra: la mediana (línea), la caja de Q1 a Q3 (50 % central), los «bigotes» y los **atípicos** como puntos sueltos.` },
          { title: 'Dispersión y argumentos comunes', md: R`~~~r
plot(mtcars$wt, mtcars$mpg, pch = 19, col = "tomato",
     main = "Peso vs consumo", xlab = "Peso", ylab = "mpg")
abline(lm(mpg ~ wt, data = mtcars), col = "blue")   # recta de regresión
~~~

| Argumento | Para… |
|---|---|
| «main» | título |
| «xlab», «ylab» | etiquetas de ejes |
| «col» | color |
| «breaks» | nº de intervalos (hist) |
| «pch» | forma del punto |` },
        ],
        exercises: [
          { type: 'match', q: R`Empareja cada gráfico con su uso`, pairs: [[R`hist()`, R`Distribución de una numérica`], [R`boxplot()`, R`Mediana, cuartiles y atípicos`], [R`plot(x, y)`, R`Relación entre dos numéricas`], [R`barplot()`, R`Frecuencias de categorías`]] },
          { type: 'mc', q: R`En un diagrama de caja, la línea gruesa del centro es…`, options: [R`La mediana`, R`La media`, R`La moda`, R`El máximo`], answer: 0 },
          { type: 'mc', q: R`¿Qué argumento pone el título de un gráfico base?`, options: [R`main`, R`title`, R`label`, R`head`], answer: 0, mono: true },
          { type: 'code', q: R`Dibuja un histograma de «hp» de «mtcars» con 6 intervalos («breaks = 6»), color "lightgreen" y etiqueta del eje x "Caballos".`, check: R`TRUE`, solution: R`hist(mtcars$hp, breaks = 6, col = "lightgreen", xlab = "Caballos")`, hint: R`«hist(x, breaks = 6, col = ..., xlab = ...)».` },
          { type: 'code', q: R`Dibuja la dispersión de «hp» (x) frente a «mpg» (y) de «mtcars» con puntos rellenos («pch = 19») y título "Potencia vs consumo".`, check: R`TRUE`, solution: R`plot(mtcars$hp, mtcars$mpg, pch = 19, main = "Potencia vs consumo")`, hint: R`«plot(x, y, pch = 19, main = ...)».` },
        ],
      },
      {
        id: 'u8l4', title: 'Relaciones entre variables', icon: '🔗', desc: R`Correlación, tablas de contingencia y comparaciones por grupos.`,
        theory: [
          { title: 'Dos numéricas: correlación', md: R`«cor(x, y)» mide la relación **lineal** entre −1 y 1:

- cerca de **1**: cuando una sube, la otra sube.
- cerca de **−1**: cuando una sube, la otra baja.
- cerca de **0**: sin relación lineal.

~~~r
cor(mtcars$wt, mtcars$mpg)
cor(mtcars$hp, mtcars$qsec)
round(cor(mtcars[, c("mpg", "hp", "wt")]), 2)
~~~

>! Correlación **no** implica causalidad.` },
          { title: 'Cualitativa vs cualitativa / numérica', md: R`~~~r
table(mtcars$cyl, mtcars$am)                       # tabla de contingencia
aggregate(mpg ~ cyl, data = mtcars, FUN = mean)    # media por grupo
tapply(mtcars$mpg, mtcars$am, median)
boxplot(mpg ~ cyl, data = mtcars, col = "gold")
~~~

| Variables | Herramienta |
|---|---|
| numérica – numérica | «cor», «plot» |
| cualitativa – cualitativa | «table(a, b)» |
| numérica – cualitativa | «aggregate», «tapply», «boxplot(y ~ g)» |` },
        ],
        exercises: [
          { type: 'mc', q: R`«cor(mtcars$wt, mtcars$mpg)» vale −0.87. ¿Qué significa?`, options: [R`Los coches más pesados tienden a recorrer menos millas por galón`, R`El peso no tiene relación con el consumo`, R`Los coches más pesados consumen menos`, R`El peso causa exactamente el consumo`], answer: 0 },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`cor(1:10, (1:10) * 3 + 2)`, answers: [R`[1] 1`], explain: R`Es una relación lineal perfecta y creciente.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`t <- table(mtcars$cyl, mtcars$am)
t["8", "1"]`, answers: [R`[1] 2`], explain: R`Solo hay 2 coches de 8 cilindros con cambio manual.` },
          { type: 'mc', q: R`Quieres comparar la nota media según la carrera. ¿Qué usas?`, options: [R`aggregate(nota ~ carrera, data = encuesta, FUN = mean)`, R`cor(encuesta$nota, encuesta$carrera)`, R`table(encuesta$nota)`, R`hist(encuesta$carrera)`], answer: 0, mono: true },
          { type: 'code', q: R`Con «encuesta» cargada, guarda en «r» la correlación entre horas de estudio y nota (usa «use = "complete.obs"» para ignorar el NA) y en «media_carrera» la nota media por carrera con «tapply».`, setup: ENCUESTA, check: R`.eq(r, cor(encuesta$horas_estudio, encuesta$nota, use = "complete.obs")) && .eq(media_carrera[["IACD"]], mean(c(8.2, 9, 6.8, 7.8)))`, solution: R`r <- cor(encuesta$horas_estudio, encuesta$nota, use = "complete.obs")
media_carrera <- tapply(encuesta$nota, encuesta$carrera, mean)`, hint: R`«cor(x, y, use = "complete.obs")».` },
          { type: 'code', q: R`Guarda en «tabla» la tabla de contingencia de «sexo» y «carrera» de «encuesta», y dibuja un boxplot de la nota por sexo.`, setup: ENCUESTA, check: R`identical(dim(tabla), c(2L, 3L)) && tabla["M", "IACD"] == 4`, solution: R`tabla <- table(encuesta$sexo, encuesta$carrera)
boxplot(nota ~ sexo, data = encuesta)`, hint: R`«table(a, b)» y «boxplot(nota ~ sexo, data = encuesta)».` },
        ],
      },
      {
        id: 'u8l5', title: 'Datos faltantes y atípicos', icon: '🧽', desc: R`Detectar NA y valores extremos antes de analizar.`,
        theory: [
          { title: 'Valores faltantes', md: R`~~~r
df <- data.frame(a = c(1, NA, 3, 4), b = c("x", "y", NA, "z"))
colSums(is.na(df))        # NA por columna
complete.cases(df)        # filas completas
df_limpio <- na.omit(df)  # quitar filas con algún NA
nrow(df_limpio)
summary(df$a)             # summary también cuenta los NA
~~~

>! Quitar filas con NA reduce tus datos. Piensa si es razonable o si conviene imputar (p. ej. con la media).` },
          { title: 'Valores atípicos (outliers)', md: R`Regla clásica (la que usa el boxplot): un valor es atípico si está fuera de

**[Q1 − 1.5·IQR , Q3 + 1.5·IQR]**

~~~r
x <- c(10, 12, 11, 13, 12, 50, 11, 9)
q <- quantile(x, c(0.25, 0.75))
li <- q[1] - 1.5 * IQR(x)
ls <- q[2] + 1.5 * IQR(x)
x[x < li | x > ls]
boxplot.stats(x)$out      # lo mismo, directamente
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`df <- data.frame(a = c(1, NA, 3), b = c(NA, NA, 6))
as.vector(colSums(is.na(df)))`, answers: [R`[1] 1 2`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`df <- data.frame(a = c(1, NA, 3, 4), b = c(5, 6, NA, 8))
nrow(na.omit(df))`, answers: [R`[1] 2`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`boxplot.stats(c(10, 12, 11, 13, 12, 50, 11, 9))$out`, answers: [R`[1] 50`] },
          { type: 'tf', q: R`Según la regla del boxplot, un valor es atípico si supera Q3 + 1.5·IQR.`, answer: true },
          { type: 'code', q: R`Con «encuesta» cargada, guarda en «atipicos» las edades atípicas según la regla 1.5·IQR y en «sin_na» el data frame sin filas con NA.`, setup: ENCUESTA, check: R`.eq(atipicos, 35) && nrow(sin_na) == 9`, solution: R`q <- quantile(encuesta$edad, c(0.25, 0.75))
r <- IQR(encuesta$edad)
atipicos <- encuesta$edad[encuesta$edad < q[1] - 1.5 * r | encuesta$edad > q[2] + 1.5 * r]
sin_na <- na.omit(encuesta)`, hint: R`Calcula Q1, Q3 e IQR y filtra; «na.omit()» para los NA.` },
          { type: 'code', q: R`Imputa el NA de «horas_estudio» en «encuesta» con la **mediana** del resto de valores.`, setup: ENCUESTA, check: R`!anyNA(encuesta$horas_estudio) && .eq(encuesta$horas_estudio[6], median(c(10, 4, 12, 6, 8, 2, 7, 9, 5)))`, solution: R`mediana <- median(encuesta$horas_estudio, na.rm = TRUE)
encuesta$horas_estudio[is.na(encuesta$horas_estudio)] <- mediana`, hint: R`«x[is.na(x)] <- median(x, na.rm = TRUE)».` },
        ],
      },
      {
        id: 'u8l6', title: 'Mini-proyecto EDA', icon: '🚀', desc: R`Un análisis completo del dataset iris, paso a paso.`,
        theory: [
          { title: 'Guion de un EDA', md: R`1. **Conocer los datos**: «dim», «str», «head», «summary».
2. **Calidad**: NA, duplicados, atípicos, tipos correctos.
3. **Univariante**: cada variable por separado (tablas, medidas, histogramas).
4. **Bivariante**: relaciones (correlaciones, comparaciones por grupo).
5. **Conclusiones** en lenguaje claro.

~~~r
str(iris)
summary(iris)
table(iris$Species)
aggregate(Petal.Length ~ Species, data = iris, FUN = mean)
round(cor(iris[, 1:4]), 2)
boxplot(Petal.Length ~ Species, data = iris, col = c("pink", "lightblue", "lightgreen"))
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`dim(iris)`, answers: [R`[1] 150   5`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`nlevels(iris$Species)`, answers: [R`[1] 3`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`sum(duplicated(iris))`, answers: [R`[1] 1`], explain: R`Hay una flor repetida exactamente igual: algo que un buen EDA detecta.` },
          { type: 'code', q: R`Guarda en «medias» la media de «Sepal.Length» por especie de «iris» (con «tapply») y en «mas_larga» el **nombre** de la especie con mayor media.`, check: R`.eq(as.vector(medias), c(5.006, 5.936, 6.588)) && identical(mas_larga, "virginica")`, solution: R`medias <- tapply(iris$Sepal.Length, iris$Species, mean)
mas_larga <- names(which.max(medias))`, hint: R`«names(which.max(medias))».` },
          { type: 'code', q: R`Guarda en «r» la correlación entre «Petal.Length» y «Petal.Width» de «iris» redondeada a 2 decimales, y en «grandes» cuántas flores tienen pétalos de más de 5 cm de largo.`, check: R`.eq(r, 0.96) && .eq(grandes, sum(iris$Petal.Length > 5))`, solution: R`r <- round(cor(iris$Petal.Length, iris$Petal.Width), 2)
grandes <- sum(iris$Petal.Length > 5)`, hint: R`«round(cor(x, y), 2)».` },
        ],
      },
    ],
    boss: {
      id: 'u8b', title: 'Jefe del mundo', icon: '🏰', desc: R`Un análisis exploratorio de principio a fin.`,
      exercises: [
        { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c(4, 8, 6, 2, 10)
c(mean(x), median(x))`, answers: [R`[1] 6 6`] },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`round(100 * prop.table(table(c("A", "B", "B", "B"))), 0)[["B"]]`, answers: [R`[1] 75`] },
        { type: 'mc', q: R`Un boxplot muestra varios puntos sueltos por encima del bigote superior. Significa que…`, options: [R`Hay valores atípicos altos`, R`Hay valores faltantes`, R`La media es mayor que la mediana seguro`, R`Hay un error en el gráfico`], answer: 0 },
        { type: 'code', q: R`Con «airquality» (incluido en R): guarda en «na_ozone» cuántos NA tiene «Ozone», en «media_mes» la media de «Temp» por mes («Month») con tapply, y en «r» la correlación entre Ozone y Temp usando solo casos completos.`, check: R`.eq(na_ozone, 37) && .eq(media_mes, tapply(airquality$Temp, airquality$Month, mean)) && .eq(r, cor(airquality$Ozone, airquality$Temp, use = "complete.obs"))`, solution: R`na_ozone <- sum(is.na(airquality$Ozone))
media_mes <- tapply(airquality$Temp, airquality$Month, mean)
r <- cor(airquality$Ozone, airquality$Temp, use = "complete.obs")`, hint: R`«sum(is.na(...))», «tapply(...)», «cor(..., use = "complete.obs")».` },
        { type: 'code', q: R`Con «mtcars»: guarda en «tabla» la tabla de «gear» (marchas), en «resumen» la media de mpg por «gear» con «aggregate» y dibuja un boxplot de mpg por gear.`, check: R`.eq(as.vector(tabla), c(15, 12, 5)) && is.data.frame(resumen) && .eq(resumen$mpg, as.vector(tapply(mtcars$mpg, mtcars$gear, mean)))`, solution: R`tabla <- table(mtcars$gear)
resumen <- aggregate(mpg ~ gear, data = mtcars, FUN = mean)
boxplot(mpg ~ gear, data = mtcars)`, hint: R`«aggregate(mpg ~ gear, data = mtcars, FUN = mean)».` },
      ],
    },
  });
})();
