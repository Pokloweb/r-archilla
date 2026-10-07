// Unidad 3 — Tema 2 (parte 2): matrices, arrays y listas
(function () {
  const R = String.raw;
  RA_UNITS.push({
    id: 'u3', num: 3, tema: 'Tema 2', short: 'Matrices y listas', title: 'Matrices, arrays y listas', color: '#ce82ff',
    desc: R`Datos en filas y columnas, en varias dimensiones y estructuras flexibles que lo mezclan todo.`,
    cheat: [
      [R`matrix(1:6, nrow = 2, ncol = 3)`, R`Matriz 2×3, se rellena **por columnas**.`],
      [R`matrix(1:6, nrow = 2, byrow = TRUE)`, R`Rellenar **por filas**.`],
      [R`dim(m); nrow(m); ncol(m)`, R`Dimensiones, nº de filas, nº de columnas.`],
      [R`m[1, 2]`, R`Elemento fila 1, columna 2.`],
      [R`m[2, ]; m[, 3]`, R`Fila 2 entera / columna 3 entera (devuelven vector).`],
      [R`m[2:3, 1:2]`, R`Submatriz.`],
      [R`rownames(m) <- c(...); colnames(m) <- c(...)`, R`Poner nombres a filas y columnas.`],
      [R`dimnames(m) <- list(filas, columnas)`, R`Ambos nombres a la vez.`],
      [R`m["Ana", "T2"]; m[, c("T1", "T4")]`, R`Acceder por nombre.`],
      [R`rbind(m, c(7, 8, 9)); cbind(m, nueva)`, R`Añadir una fila / columna (misma longitud).`],
      [R`apply(m, 1, sum); apply(m, 2, mean)`, R`Aplicar función por filas (1) o columnas (2).`],
      [R`rowSums(m); colMeans(m)`, R`Atajos de apply para sumas y medias.`],
      [R`t(m)`, R`Matriz traspuesta.`],
      [R`array(1:12, dim = c(2, 3, 2))`, R`Array de 3 dimensiones.`],
      [R`a[1, 2, 2]`, R`Elemento de un array (fila, columna, capa).`],
      [R`list(nombre = "Jorge", notas = c(8, 9))`, R`Lista con elementos de distinto tipo.`],
      [R`l$notas; l[["notas"]]; l[[2]]`, R`Acceder a un elemento de una lista.`],
      [R`l[2]`, R`Sub-lista (sigue siendo una lista).`],
    ],
    lessons: [
      {
        id: 'u3l1', title: 'Crear matrices', icon: '🔢', desc: R`matrix(), byrow y las dimensiones.`,
        theory: [
          { title: 'Datos en filas y columnas', md: R`Una **matriz** es una estructura **bidimensional** (filas × columnas) con elementos **del mismo tipo**:

~~~r
m <- matrix(1:6, nrow = 2, ncol = 3)
m
~~~

>! Por defecto, R rellena la matriz **por columnas**: primero baja por la columna 1, luego la 2…` },
          { title: 'byrow: rellenar por filas', md: R`~~~r
m1 <- matrix(c(1, 2, 3, 4, 5, 6), nrow = 2, byrow = TRUE)
m1
m2 <- matrix(c(1, 2, 3, 4, 5, 6), nrow = 2, byrow = FALSE)
m2
~~~

Con «byrow = TRUE» los datos se colocan fila a fila, como cuando lees una tabla.

> 💡 Si das «nrow», R calcula solo las columnas (y al revés).` },
          { title: 'Dimensiones', md: R`~~~r
m <- matrix(1:12, nrow = 3)
dim(m)      # filas y columnas
nrow(m)
ncol(m)
length(m)   # número total de elementos
is.matrix(m)
~~~

Usos reales: una imagen de 100×100 píxeles es una matriz de 100×100; una tabla de distancias entre ciudades, también.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:6, nrow = 2)
m[1, 2]`, answers: [R`[1] 3`], explain: R`Se rellena por columnas: la columna 2 es (3, 4).` },
          { type: 'output', q: R`¿Y ahora, con byrow = TRUE?`, code: R`m <- matrix(1:6, nrow = 2, byrow = TRUE)
m[1, 2]`, answers: [R`[1] 2`], explain: R`Por filas: la fila 1 es (1, 2, 3).` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`dim(matrix(1:12, nrow = 3))`, answers: [R`[1] 3 4`] },
          { type: 'mc', q: R`¿Qué muestra R?`, code: R`matrix(1:4, nrow = 2, byrow = TRUE)`, options: [R`     [,1] [,2]
[1,]    1    2
[2,]    3    4`, R`     [,1] [,2]
[1,]    1    3
[2,]    2    4`, R`[1] 1 2 3 4`, R`     [,1] [,2] [,3] [,4]
[1,]    1    2    3    4`], answer: 0, mono: true, run: true },
          { type: 'tf', q: R`Una matriz puede tener una columna numérica y otra de texto.`, answer: false, explain: R`Todos los elementos de una matriz son del mismo tipo. Para mezclar tipos usarás data frames.` },
          { type: 'fill', q: R`Completa para crear una matriz 3×3 con 1:9 rellenada por filas`, code: R`m <- matrix(1:9, nrow = 3, ___ = TRUE)`, blanks: [[R`byrow`]], bank: [R`byrow`, R`byrows`, R`rows`, R`bycol`], check: R`identical(m[1, ], 1:3)` },
          { type: 'code', q: R`Crea la matriz «m» de 4 filas y 4 columnas con los valores del 1 al 16 y guarda en «total» la suma de todos sus elementos.`, check: R`is.matrix(m) && identical(dim(m), c(4L, 4L)) && .eq(total, 136)`, solution: R`m <- matrix(1:16, nrow = 4, ncol = 4)
total <- sum(m)`, hint: R`«sum()» funciona igual con matrices.` },
          { type: 'code', q: R`Crea la matriz «m» de 3×5 con los números del 1 al 15 y guarda su valor máximo en «maximo» y su número de columnas en «columnas».`, check: R`identical(dim(m), c(3L, 5L)) && .eq(maximo, 15) && .eq(columnas, 5)`, solution: R`m <- matrix(1:15, nrow = 3, ncol = 5)
maximo <- max(m)
columnas <- ncol(m)`, hint: R`«max(m)» y «ncol(m)».` },
        ],
      },
      {
        id: 'u3l2', title: 'Acceder a una matriz', icon: '🗺️', desc: R`m[fila, columna], filas y columnas enteras y submatrices.`,
        theory: [
          { title: 'm[fila, columna]', md: R`Se usa **una coma** dentro del corchete: primero la fila, luego la columna.

~~~r
m <- matrix(1:6, nrow = 2, ncol = 3)
m
m[1, 2]    # fila 1, columna 2
m[, 1]     # columna 1 entera
m[2, ]     # fila 2 entera
m[1, 1:2]  # fila 1, columnas 1 y 2
~~~

> 💡 Dejar un lado de la coma vacío significa «todas».` },
          { title: 'Submatrices y modificar', md: R`~~~r
m <- matrix(1:16, nrow = 4)
m[2:3, 1:2]        # filas 2-3, columnas 1-2
m[-1, ]            # todas las filas menos la 1
mean(m[3, ])       # media de la fila 3
m[1, 1] <- 100     # cambiar un valor
m[1, ]
~~~

Al sacar una sola fila o columna, R devuelve un **vector**.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:9, nrow = 3)
m[2, ]`, answers: [R`[1] 2 5 8`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:9, nrow = 3, byrow = TRUE)
m[, 3]`, answers: [R`[1] 3 6 9`] },
          { type: 'mc', q: R`¿Cómo obtienes la **columna 2** completa de «m»?`, options: [R`m[, 2]`, R`m[2, ]`, R`m[2]`, R`m(2)`], answer: 0, mono: true },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:16, nrow = 4)
mean(m[3, ])`, answers: [R`[1] 9`], explain: R`La fila 3 es 3, 7, 11, 15 → media 9.` },
          { type: 'mc', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:16, nrow = 4)
m[2:3, 1:2]`, options: [R`     [,1] [,2]
[1,]    2    6
[2,]    3    7`, R`     [,1] [,2]
[1,]    5    6
[2,]    9   10`, R`[1] 2 3 6 7`, R`     [,1] [,2]
[1,]    2    3
[2,]    6    7`], answer: 0, mono: true, run: true },
          { type: 'code', q: R`Banco ej. 9: crea la matriz «m» 3×3 con los valores del 1 al 9 (por columnas) y guarda en «fila2» la segunda fila completa.`, check: R`identical(dim(m), c(3L, 3L)) && .eq(fila2, c(2, 5, 8))`, solution: R`m <- matrix(1:9, nrow = 3, ncol = 3)
fila2 <- m[2, ]`, hint: R`«m[2, ]».` },
          { type: 'code', q: R`Banco ej. 12: con la matriz 4×4 de 1 a 16 (ya cargada en «m»), guarda en «sub» la submatriz de filas 2 a 3 y columnas 1 a 2, y en «media3» la media de la tercera fila.`, setup: R`m <- matrix(1:16, nrow = 4, ncol = 4)`, check: R`identical(sub, m[2:3, 1:2]) && .eq(media3, 9)`, solution: R`sub <- m[2:3, 1:2]
media3 <- mean(m[3, ])`, hint: R`«m[2:3, 1:2]» y «mean(m[3, ])».` },
        ],
      },
      {
        id: 'u3l3', title: 'Nombres de filas y columnas', icon: '🪪', desc: R`rownames, colnames, dimnames y acceso por nombre.`,
        theory: [
          { title: 'Poner nombres', md: R`Con nombres, la matriz se lee como una tabla:

~~~r
m3 <- matrix(c(20, 65, 174, 22, 70, 180, 19, 68, 170), nrow = 3, byrow = TRUE)
colnames(m3) <- c("edad", "peso", "altura")
rownames(m3) <- c("Luis", "Ana", "Pepe")
m3
~~~

O todo a la vez con «dimnames» (una **lista** con filas y columnas):

~~~norun
dimnames(m3) <- list(c("Luis", "Ana", "Pepe"), c("edad", "peso", "altura"))
~~~` },
          { title: 'Acceder y modificar por nombre', md: R`~~~r
m3 <- matrix(c(20, 65, 174, 22, 70, 180, 19, 68, 170), nrow = 3, byrow = TRUE,
             dimnames = list(c("Luis", "Ana", "Pepe"), c("edad", "peso", "altura")))
m3["Luis", ]                  # datos de Luis
m3[, "edad"]                  # edades de todos
m3[, c("edad", "altura")]     # dos columnas
m3["Ana", "peso"] <- 71       # modificar
mean(m3[, "altura"])
~~~

> 💡 En el simulacro sale justo esto: nombrar una matriz de notas por alumno y tema, cambiar una nota y calcular medias y máximos.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(c(8, 6, 5, 9), nrow = 2, byrow = TRUE)
rownames(m) <- c("Ana", "Luis")
colnames(m) <- c("T1", "T2")
m["Luis", "T1"]`, answers: [R`[1] 5`] },
          { type: 'mc', q: R`¿Cómo obtienes la columna «altura» de la matriz «m3» para todas las personas?`, options: [R`m3[, "altura"]`, R`m3["altura", ]`, R`m3$altura`, R`m3[altura]`], answer: 0, mono: true, explain: R`«$» es para data frames y listas, no para matrices.` },
          { type: 'fill', q: R`Completa para poner nombre a las filas`, code: R`m <- matrix(1:4, nrow = 2)
___(m) <- c("fila1", "fila2")`, blanks: [[R`rownames`]], bank: [R`rownames`, R`colnames`, R`names`, R`dim`], check: R`identical(rownames(m), c("fila1", "fila2"))` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:6, nrow = 2,
            dimnames = list(c("a", "b"), c("x", "y", "z")))
m["b", c("x", "z")]`, answers: [R`x z
2 6`] },
          { type: 'code', q: R`Clase de matrices: pon nombres a «matriz_notas» (filas = «nombres», columnas = «asignaturas») y guarda en «nota_ana» la nota de Ana en Álgebra y en «media_ana» la media de todas sus notas.`, setup: R`nombres <- c("Ana", "Luis", "Marta", "Pedro", "Lucía", "Carlos")
asignaturas <- c("Álgebra", "Progra", "Cálculo", "Física")
matriz_notas <- matrix(c(3,4,3,4,5,6,7,6,5,3,4,5,6,7,5,6,5,3,8,7,6,5,4,3), nrow = 6, ncol = 4)`, check: R`identical(rownames(matriz_notas), nombres) && identical(colnames(matriz_notas), asignaturas) && .eq(nota_ana, 3) && .eq(media_ana, mean(c(3, 7, 6, 8)))`, solution: R`rownames(matriz_notas) <- nombres
colnames(matriz_notas) <- asignaturas
nota_ana <- matriz_notas["Ana", "Álgebra"]
media_ana <- mean(matriz_notas["Ana", ])`, hint: R`Primero «rownames(...) <- nombres» y «colnames(...) <- asignaturas».` },
          { type: 'code', q: R`**Simulacro ej. 2.** Con «m» ya nombrada: cambia la nota de Luis en T3 por un 9. Guarda en «luis» todas las notas de Luis, en «sub» las notas de Ana y Marta en T2 y T4, en «media_ana» la media de Ana, en «max_t3» la máxima de T3 y en «media_t1_t4» la media de las columnas T1 y T4 juntas.`, setup: R`m <- matrix(c(8, 6, 7, 9,
              5, 8, 6, 7,
              9, 7, 8, 10), nrow = 3, byrow = TRUE)
rownames(m) <- c("Ana", "Luis", "Marta")
colnames(m) <- c("T1", "T2", "T3", "T4")`, check: R`.eq(m["Luis", "T3"], 9) && .eq(luis, c(5, 8, 9, 7)) && identical(sub, m[c("Ana", "Marta"), c("T2", "T4")]) && .eq(media_ana, 7.5) && .eq(max_t3, 9) && .eq(media_t1_t4, mean(c(8, 5, 9, 9, 7, 10)))`, solution: R`m["Luis", "T3"] <- 9
luis <- m["Luis", ]
sub <- m[c("Ana", "Marta"), c("T2", "T4")]
media_ana <- mean(m["Ana", ])
max_t3 <- max(m[, "T3"])
media_t1_t4 <- mean(m[, c("T1", "T4")])`, hint: R`Todo se hace con «m[filas, columnas]» usando nombres entre comillas.` },
        ],
      },
      {
        id: 'u3l4', title: 'rbind, cbind y apply', icon: '🧱', desc: R`Añadir filas y columnas y calcular por filas o columnas.`,
        theory: [
          { title: 'Añadir filas y columnas', md: R`~~~r
m4 <- matrix(1:6, nrow = 2, byrow = TRUE)
m4 <- rbind(m4, c(7, 8, 9))     # nueva fila
m4 <- cbind(m4, c(10, 11, 12))  # nueva columna
m4
~~~

>! La fila nueva debe tener tantos elementos como **columnas** tenga la matriz (y la columna nueva, tantos como **filas**).

También sirven para **crear** matrices a partir de vectores:

~~~r
v1 <- c(1, 2, 3)
v2 <- c(4, 5, 6)
rbind(v1, v2)
cbind(v1, v2)
~~~` },
          { title: 'apply(): calcular por filas o columnas', md: R`«apply(X, MARGIN, FUN)»:
- «X»: la matriz
- «MARGIN»: **1 = filas**, **2 = columnas**
- «FUN»: la función (sum, mean, max…)

~~~r
m6 <- matrix(1:9, nrow = 3, byrow = TRUE)
apply(m6, 1, sum)    # suma de cada fila
apply(m6, 2, sum)    # suma de cada columna
apply(m6, 2, max)
~~~

Atajos: «rowSums», «colSums», «rowMeans», «colMeans». Y «t(m)» da la **traspuesta**.

> 💡 Truco para recordarlo: **1 va antes que 2**, igual que **filas van antes que columnas** en «m[fila, columna]».` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:6, nrow = 2, byrow = TRUE)
apply(m, 1, sum)`, answers: [R`[1] 6 15`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:6, nrow = 2, byrow = TRUE)
apply(m, 2, sum)`, answers: [R`[1] 5 7 9`] },
          { type: 'mc', q: R`En «apply(m, 2, mean)», ¿qué significa el 2?`, options: [R`Que se aplica por columnas`, R`Que se aplica por filas`, R`Que se redondea a 2 decimales`, R`Que se usan las 2 primeras filas`], answer: 0 },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- rbind(c(1, 2), c(3, 4))
m <- cbind(m, c(5, 6))
dim(m)`, answers: [R`[1] 2 3`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:6, nrow = 2)
dim(t(m))`, answers: [R`[1] 3 2`] },
          { type: 'code', q: R`Crea «matriz_jugadores» uniendo como columnas los vectores «edades» y «goles» (usa «cbind»). Después guarda en «medias» la media de cada columna con «apply».`, setup: R`edades <- c(22, 21, 18, 28, 33, 26)
goles <- c(6, 3, 9, 12, 0, 2)`, check: R`identical(dim(matriz_jugadores), c(6L, 2L)) && .eq(medias, c(mean(edades), mean(goles)))`, solution: R`matriz_jugadores <- cbind(edades, goles)
medias <- apply(matriz_jugadores, 2, mean)`, hint: R`«cbind(edades, goles)» y «apply(..., 2, mean)».` },
          { type: 'code', q: R`Añade a «m» una nueva fila con los valores 19 y 4 (usa «rbind») y guarda en «sumas_filas» la suma de cada fila.`, setup: R`m <- cbind(edad = c(22, 21, 18), goles = c(6, 3, 9))`, check: R`nrow(m) == 4 && .eq(m[4, ], c(19, 4)) && .eq(sumas_filas, c(28, 24, 27, 23))`, solution: R`m <- rbind(m, c(19, 4))
sumas_filas <- apply(m, 1, sum)`, hint: R`Recuerda guardar el resultado de «rbind» en «m».` },
        ],
      },
      {
        id: 'u3l5', title: 'Arrays', icon: '🧊', desc: R`Matrices con más de dos dimensiones.`,
        theory: [
          { title: 'Más allá de 2D', md: R`Un **array** generaliza la matriz a 3 o más dimensiones (mismo tipo de dato):

~~~r
a1 <- array(1:12, dim = c(2, 3, 2))
a1
a1[1, 2, 2]   # fila 1, columna 2, capa 2
dim(a1)
~~~

Piensa en un array 3D como **varias matrices apiladas** (capas).` },
          { title: 'Arrays con nombres', md: R`Media de edad, peso y altura de hombres y mujeres en dos ciudades:

~~~r
a2 <- array(c(43, 44, 71, 61, 175, 168, 45, 46, 69, 58, 174, 167), dim = c(2, 3, 2))
dimnames(a2) <- list(c("hombres", "mujeres"), c("edad", "peso", "altura"), c("Segovia", "Burgos"))
a2[, , "Burgos"]     # la capa de Burgos
a2["mujeres", , ]    # mujeres de ambas ciudades
apply(a2, 2, mean)   # media de cada variable
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`Banco ej. 21: ¿qué muestra R?`, code: R`a <- array(1:12, dim = c(2, 3, 2))
a[2, 2, 1]`, answers: [R`[1] 4`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`a <- array(1:12, dim = c(2, 3, 2))
a[1, 2, 2]`, answers: [R`[1] 9`], explain: R`La capa 2 empieza en 7: su columna 2 es (9, 10).` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`a <- array(1:24, dim = c(2, 3, 4))
length(a)`, answers: [R`[1] 24`] },
          { type: 'mc', q: R`¿Cuántas «capas» (matrices) tiene «array(1:12, dim = c(2, 3, 2))»?`, options: [R`2`, R`3`, R`6`, R`12`], answer: 0 },
          { type: 'code', q: R`Crea el array «a» de dimensiones 2×2×3 con los valores del 1 al 12 y guarda en «capa3» la tercera capa completa.`, check: R`identical(dim(a), c(2L, 2L, 3L)) && identical(capa3, a[, , 3])`, solution: R`a <- array(1:12, dim = c(2, 2, 3))
capa3 <- a[, , 3]`, hint: R`La capa va en la tercera posición: «a[, , 3]».` },
        ],
      },
      {
        id: 'u3l6', title: 'Listas', icon: '🎒', desc: R`La estructura que lo guarda todo: $, [[ ]] y [ ].`,
        theory: [
          { title: 'Una mochila para todo', md: R`Una **lista** puede contener elementos de **distintos tipos y tamaños**: vectores, matrices, data frames, otras listas…

~~~r
l1 <- list(nombre = "Jorge", edad = 18, notas = c(8, 9, 10), aprobado = TRUE)
l1
length(l1)
names(l1)
~~~` },
          { title: 'Acceder: $, [[ ]] y [ ]', md: R`~~~r
l1 <- list(nombre = "Jorge", edad = 18, notas = c(8, 9, 10))
l1$nombre       # por nombre
l1[["edad"]]    # por nombre con dobles corchetes
l1[[2]]         # por posición: el ELEMENTO
l1[2]           # una SUB-LISTA con ese elemento
l1$notas[2]     # segundo elemento del vector notas
~~~

| Sintaxis | Devuelve |
|---|---|
| «l[[2]]» o «l$edad» | el elemento (p. ej. el número 18) |
| «l[2]» | una lista de un elemento |

> 💡 Muchas funciones de R devuelven listas (por ejemplo, los modelos estadísticos). Saber sacar cosas de ellas es clave.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`l <- list(nombre = "Jorge", edad = 18, notas = c(8, 9, 10))
l$notas[2]`, answers: [R`[1] 9`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`l <- list(nombre = "Jorge", edad = 18, notas = c(8, 9, 10))
l[[2]]`, answers: [R`[1] 18`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`l <- list(nombre = "Jorge", edad = 18)
class(l[2])`, answers: [R`[1] "list"`], explain: R`Con un solo corchete obtienes una **sub-lista**.` },
          { type: 'tf', q: R`Una lista puede contener a la vez un vector de texto, un número y una matriz.`, answer: true },
          { type: 'match', q: R`Empareja cada estructura con su descripción`, pairs: [[R`vector`, R`1D, un solo tipo`], [R`matriz`, R`2D, un solo tipo`], [R`array`, R`nD, un solo tipo`], [R`lista`, R`Tipos distintos`]] },
          { type: 'code', q: R`Banco ej. 20: crea la lista «lst» con un vector numérico «nums» (1, 2, 3) y un vector de caracteres «chars» ("a", "b", "c"). Guarda en «segundo» el segundo elemento de «chars».`, check: R`is.list(lst) && .eq(lst$nums, c(1, 2, 3)) && identical(lst$chars, c("a", "b", "c")) && identical(segundo, "b")`, solution: R`lst <- list(nums = c(1, 2, 3), chars = c("a", "b", "c"))
segundo <- lst$chars[2]`, hint: R`«lst$chars[2]».` },
          { type: 'code', q: R`Crea la lista «alumno» con «nombre» = "Lucía", «notas» = c(7, 8.5, 9) y «beca» = FALSE. Guarda en «media» la media de sus notas usando la lista.`, check: R`is.list(alumno) && identical(alumno$nombre, "Lucía") && isFALSE(alumno$beca) && .eq(media, mean(c(7, 8.5, 9)))`, solution: R`alumno <- list(nombre = "Lucía", notas = c(7, 8.5, 9), beca = FALSE)
media <- mean(alumno$notas)`, hint: R`«mean(alumno$notas)».` },
        ],
      },
    ],
    boss: {
      id: 'u3b', title: 'Examen Unidad 3', icon: '🏰', desc: R`Matrices, arrays y listas como en el simulacro.`,
      exercises: [
        { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:12, nrow = 3, byrow = TRUE)
m[3, 2]`, answers: [R`[1] 10`] },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:12, nrow = 3)
apply(m, 2, max)`, answers: [R`[1] 3 6 9 12`] },
        { type: 'mc', q: R`«matrix(1:6, nrow = 2)» tiene 2 filas y 3 columnas. ¿Qué instrucción da un **aviso** y rellena mal la matriz porque la longitud no encaja?`, options: [R`rbind(matrix(1:6, nrow = 2), c(7, 8))`, R`rbind(matrix(1:6, nrow = 2), c(7, 8, 9))`, R`cbind(matrix(1:6, nrow = 2), c(7, 8))`, R`t(matrix(1:6, nrow = 2))`], answer: 0, mono: true, explain: R`La nueva fila necesita 3 valores (uno por columna). Con 2, R recicla (7, 8, 7) y avisa: *number of columns of result is not a multiple of vector length*.` },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`l <- list(a = 1:3, b = "hola", c = list(x = 10))
l$c$x * 2`, answers: [R`[1] 20`] },
        { type: 'code', q: R`Crea la matriz «ventas» de 3 filas (tiendas "Centro", "Norte", "Sur") y 4 columnas (trimestres "Q1"…"Q4") con los valores de «datos» **por filas**. Guarda en «total_tienda» la suma por tienda y en «mejor_q» el **nombre** del trimestre con más ventas totales.`, setup: R`datos <- c(10, 12, 9, 15,
           8, 7, 11, 10,
           14, 13, 12, 16)`, check: R`identical(dim(ventas), c(3L, 4L)) && identical(rownames(ventas), c("Centro", "Norte", "Sur")) && .eq(total_tienda, c(46, 36, 55)) && identical(unname(mejor_q), "Q4")`, solution: R`ventas <- matrix(datos, nrow = 3, byrow = TRUE)
rownames(ventas) <- c("Centro", "Norte", "Sur")
colnames(ventas) <- c("Q1", "Q2", "Q3", "Q4")
total_tienda <- apply(ventas, 1, sum)
totales_q <- apply(ventas, 2, sum)
mejor_q <- names(totales_q)[totales_q == max(totales_q)]`, hint: R`Para el nombre del máximo: «names(x)[x == max(x)]» (o «which.max»).` },
        { type: 'code', q: R`Con la matriz «m» cargada, guarda en «m_sin» la matriz sin la primera fila y en «media_col2» la media de la columna 2 de esa nueva matriz.`, setup: R`m <- matrix(c(4, 8, 15, 16, 23, 42), nrow = 3, byrow = TRUE)`, check: R`identical(m_sin, m[-1, ]) && .eq(media_col2, mean(c(16, 42)))`, solution: R`m_sin <- m[-1, ]
media_col2 <- mean(m_sin[, 2])`, hint: R`«m[-1, ]» quita la primera fila.` },
      ],
    },
  });
})();
