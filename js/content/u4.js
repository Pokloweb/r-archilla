// Unidad 4 — Tema 2 (parte 3): data frames
(function () {
  const R = String.raw;
  const ALUMNOS = R`df <- data.frame(
  nombre = c("Ana", "Dani", "Jose", "Manolo", "Miriam"),
  nota = c(4, 5, 6, 5, 7),
  grado = c("Enfermería", "IACD", "Mecánica", "Teleco", "Derecho"),
  selectividad = c(10, 12, 13, 12, 11)
)`;
  const EMPLEADOS = R`empleados <- data.frame(
  nombre = c("Ana", "Luis", "Marta", "Pablo", "Lucia", "Carlos"),
  departamento = c("Ventas", "IT", "IT", "Ventas", "RRHH", "IT"),
  salario = c(28000, 35000, 42000, 31000, 29000, 38000),
  antiguedad = c(2, 5, 8, 4, 3, 6)
)`;
  RA_UNITS.push({
    id: 'u4', num: 4, tema: 'Tema 2', short: 'Data frames', title: 'Data frames: tablas de datos', color: '#ff9600',
    desc: R`La estructura estrella de la ciencia de datos: crear, seleccionar, filtrar, modificar y ordenar tablas.`,
    cheat: [
      [R`df <- data.frame(a = c(1, 2), b = c("x", "y"))`, R`Crear un data frame (columnas de igual longitud).`],
      [R`str(df); head(df); summary(df)`, R`Estructura, primeras filas, resumen estadístico.`],
      [R`nrow(df); ncol(df); dim(df); names(df)`, R`Filas, columnas, dimensiones, nombres de columnas.`],
      [R`df$nota`, R`Una columna (vector).`],
      [R`df[1, ]; df[, "nota"]; df[2, "nota"]`, R`Fila 1 / columna «nota» / un valor.`],
      [R`df[, c("nombre", "nota")]`, R`Varias columnas.`],
      [R`df[df$nota > 5, ]`, R`Filtrar filas con una condición (¡ojo a la coma!).`],
      [R`df[df$nota > 5 & df$ciudad == "Madrid", c("nombre", "nota")]`, R`Filtrar filas y elegir columnas a la vez.`],
      [R`df$aprobado <- df$nota >= 5`, R`Añadir una columna calculada.`],
      [R`df$columna <- NULL`, R`Borrar una columna.`],
      [R`df$nota[2] <- 6`, R`Modificar un valor.`],
      [R`df$sal[df$dep == "IT"] <- df$sal[df$dep == "IT"] + 100`, R`Modificar solo las filas que cumplen una condición.`],
      [R`df <- rbind(df, data.frame(nombre = "X", nota = 8))`, R`Añadir una fila (mismas columnas).`],
      [R`df[order(df$nota), ]`, R`Ordenar de menor a mayor.`],
      [R`df[order(df$nota, decreasing = TRUE), ]`, R`Ordenar de mayor a menor (o «order(-df$nota)»).`],
      [R`mean(df$nota[df$grado == "IACD"])`, R`Media de un subgrupo.`],
      [R`subset(df, nota > 5, select = c(nombre, nota))`, R`Filtrar con «subset» (sin «df$» ni comillas).`],
    ],
    lessons: [
      {
        id: 'u4l1', title: 'Crear y explorar', icon: '📋', desc: R`data.frame(), str(), head() y el operador $.`,
        theory: [
          { title: '¿Qué es un data frame?', md: R`Un **data frame** es una tabla, como una hoja de Excel:

- Cada **columna** es una variable y puede tener **su propio tipo** (número, texto, lógico…). ¡En esto se diferencia de una matriz!
- Cada **fila** es una observación (un alumno, una venta…).
- Todas las columnas tienen la **misma longitud**.

~~~r
df1 <- data.frame(
  nombre = c("Ana", "Luis", "Marta"),
  edad = c(28, 35, 42),
  ciudad = c("Salamanca", "Valencia", "Sevilla")
)
df1
~~~

Los números de la izquierda (1, 2, 3) son el **índice** de las filas.` },
          { title: 'Explorar la tabla', md: R`~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta"), edad = c(28, 35, 42))
str(df1)       # tipo de cada columna
nrow(df1); ncol(df1); dim(df1)
names(df1)     # nombres de columnas
head(df1, 2)   # primeras filas
summary(df1)   # resumen estadístico
~~~

> 💡 Lo primero que hay que hacer con unos datos nuevos: «str()» y «head()».` },
          { title: 'El operador $', md: R`«df$columna» devuelve esa columna como un **vector**, así que puedes usar todo lo que sabes de vectores:

~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta"), edad = c(28, 35, 42))
df1$edad
mean(df1$edad)
df1$nombre[2]
max(df1$edad)
~~~

Ejemplos reales de data frames: transacciones de e-commerce, cotizaciones bursátiles, registros médicos, notas de alumnos…` },
        ],
        exercises: [
          { type: 'tf', q: R`En un data frame, una columna puede ser numérica y otra de texto.`, answer: true },
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`nrow(df)`, answers: [R`[1] 5`] },
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`df$grado[2]`, answers: [R`[1] "IACD"`] },
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`mean(df$selectividad)`, answers: [R`[1] 11.6`] },
          { type: 'mc', q: R`¿Qué función te dice el **tipo de cada columna** de un data frame?`, options: [R`str(df)`, R`head(df)`, R`nrow(df)`, R`levels(df)`], answer: 0, mono: true },
          { type: 'match', q: R`Empareja cada función con lo que devuelve`, pairs: [[R`nrow(df)`, R`Número de filas`], [R`names(df)`, R`Nombres de columnas`], [R`head(df)`, R`Primeras filas`], [R`dim(df)`, R`Filas y columnas`]] },
          { type: 'code', q: R`Banco ej. 13: crea el data frame «df» con las columnas «Nombre» ("Ana", "Luis", "Pedro") y «Edad» (25, 30, 22). Guarda la columna «Edad» en «edades».`, check: R`is.data.frame(df) && identical(df$Nombre, c("Ana", "Luis", "Pedro")) && .eq(edades, c(25, 30, 22))`, solution: R`df <- data.frame(Nombre = c("Ana", "Luis", "Pedro"),
                 Edad = c(25, 30, 22))
edades <- df$Edad`, hint: R`«data.frame(Nombre = c(...), Edad = c(...))».` },
          { type: 'code', q: R`Banco ej. 14: crea «df» con «Producto» ("Pan", "Leche", "Huevos", "Queso") y «Precio» (1.5, 0.9, 2, 3). Guarda el número de filas en «n» y el precio medio en «precio_medio».`, check: R`is.data.frame(df) && .eq(n, 4) && .eq(precio_medio, 1.85)`, solution: R`df <- data.frame(Producto = c("Pan", "Leche", "Huevos", "Queso"),
                 Precio = c(1.5, 0.9, 2, 3))
n <- nrow(df)
precio_medio <- mean(df$Precio)`, hint: R`«nrow(df)» y «mean(df$Precio)».` },
        ],
      },
      {
        id: 'u4l2', title: 'Seleccionar filas y columnas', icon: '✂️', desc: R`df[filas, columnas] con números y nombres.`,
        theory: [
          { title: 'df[filas, columnas]', md: R`Igual que en las matrices, **primero filas, luego columnas**, separadas por **coma**:

~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta"), edad = c(28, 35, 42),
                  ciudad = c("Salamanca", "Valencia", "Sevilla"))
df1[1, ]               # fila 1, todas las columnas
df1[, "nombre"]        # columna nombre (vector)
df1[2, "ciudad"]       # un valor
df1[c(1, 3), c("nombre", "edad")]
df1[, 2]               # columna 2 por posición
~~~

>! Olvidar la coma es el error nº 1: «df1[1]» devuelve la **columna** 1 (como data frame), no la fila.` },
          { title: 'Varias formas de lo mismo', md: R`Estas tres expresiones devuelven el mismo vector:

~~~r
df1 <- data.frame(nombre = c("Ana", "Luis"), edad = c(28, 35))
df1$edad
df1[, "edad"]
df1[["edad"]]
~~~

Y estas dos, el mismo valor:

~~~r
df1 <- data.frame(nombre = c("Ana", "Luis"), edad = c(28, 35))
df1$edad[2]
df1[2, "edad"]
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`df[3, "nombre"]`, answers: [R`[1] "Jose"`] },
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`df[, "nota"]`, answers: [R`[1] 4 5 6 5 7`] },
          { type: 'mc', q: R`¿Cómo muestras la **primera fila** completa de «df»?`, options: [R`df[1, ]`, R`df[, 1]`, R`df[1]`, R`df$1`], answer: 0, mono: true },
          { type: 'mc', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`df[c(2, 5), c("nombre", "nota")]`, options: [R`  nombre nota
2   Dani    5
5 Miriam    7`, R`  nombre nota
1    Ana    4
2   Dani    5`, R`[1] "Dani" "Miriam" "5" "7"`, R`  nota nombre
2    5   Dani
5    7 Miriam`], answer: 0, mono: true, run: true },
          { type: 'fill', q: R`Completa para obtener la nota de la fila 1`, setup: ALUMNOS, code: R`df[1, ___]`, blanks: [[R`"nota"`, R`2`]], check: R`TRUE` },
          { type: 'code', q: R`Con «df» cargado, guarda en «dos_cols» las columnas «nombre» y «grado» de todas las filas, y en «ultima» la última fila completa (usa «nrow»).`, setup: ALUMNOS, check: R`identical(dos_cols, df[, c("nombre", "grado")]) && identical(ultima, df[nrow(df), ])`, solution: R`dos_cols <- df[, c("nombre", "grado")]
ultima <- df[nrow(df), ]`, hint: R`«df[nrow(df), ]» es la última fila.` },
        ],
      },
      {
        id: 'u4l3', title: 'Filtrar filas', icon: '🔎', desc: R`df[condición, ] con &, | y selección de columnas.`,
        theory: [
          { title: 'Filtrar con una condición', md: R`Pon un vector lógico en la parte de las **filas**:

~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta"), edad = c(28, 35, 42),
                  ciudad = c("Salamanca", "Valencia", "Sevilla"))
df1$edad > 30
df1[df1$edad > 30, ]
~~~

>! Dentro del corchete hay que escribir «df1$edad», no «edad» a secas (R no sabría de dónde sale «edad»).` },
          { title: 'Varias condiciones y columnas', md: R`~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta"), edad = c(28, 35, 42),
                  ciudad = c("Salamanca", "Valencia", "Sevilla"))
df1[df1$edad > 30 & df1$ciudad == "Valencia", ]           # Y
df1[df1$edad < 30 | df1$ciudad == "Sevilla", ]            # O
df1[df1$edad > 30, c("nombre", "ciudad")]                 # filas + columnas
df1[df1$ciudad %in% c("Sevilla", "Salamanca"), "nombre"]
~~~

> 💡 Patrón del examen: «df[CONDICIÓN_FILAS, COLUMNAS]». Si quieres todas las columnas, deja vacío tras la coma.` },
        ],
        exercises: [
          { type: 'mc', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`df[df$nota > 5, "nombre"]`, options: [R`[1] "Jose"   "Miriam"`, R`[1] "Dani" "Jose" "Manolo" "Miriam"`, R`[1] 6 7`, R`[1] "Ana"`], answer: 0, mono: true, run: true },
          { type: 'mc', q: R`¿Cuál filtra los alumnos con nota mayor que 4 **y** selectividad mayor que 11?`, options: [R`df[df$nota > 4 & df$selectividad > 11, ]`, R`df[nota > 4 & selectividad > 11, ]`, R`df[df$nota > 4 | df$selectividad > 11, ]`, R`df[, df$nota > 4 & df$selectividad > 11]`], answer: 0, mono: true },
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`nrow(df[df$nota == 5 | df$grado == "Derecho", ])`, answers: [R`[1] 3`] },
          { type: 'order', q: R`Ordena el código para quedarte con las columnas nota y grado de los alumnos con nota mayor que 5`, setup: ALUMNOS, lines: [R`filtro <- df$nota > 5`, R`df_filtrado <- df[filtro, c("nota", "grado")]`, R`df_filtrado`], extra: [R`df_filtrado <- df[c("nota", "grado"), filtro]`] },
          { type: 'code', q: R`Banco ej. 15: crea «df» con «Alumno» ("A", "B", "C", "D", "E") y «Nota» (8, 6, 9, 5, 7) y guarda en «buenos» los alumnos con nota mayor que 7.`, check: R`is.data.frame(buenos) && identical(buenos$Alumno, c("A", "C"))`, solution: R`df <- data.frame(Alumno = c("A", "B", "C", "D", "E"),
                 Nota = c(8, 6, 9, 5, 7))
buenos <- df[df$Nota > 7, ]`, hint: R`«df[df$Nota > 7, ]» — no olvides la coma.` },
          { type: 'code', q: R`Banco ej. 18: con «df» cargado, guarda en «seleccion» los empleados mayores de 30 años **con** salario superior a 2000.`, setup: R`df <- data.frame(Nombre = c("Ana", "Luis", "Pedro", "Marta", "Jorge", "Lucia"),
                 Edad = c(28, 35, 40, 25, 32, 38),
                 Salario = c(1800, 2200, 2500, 1900, 2100, 2300))`, check: R`identical(seleccion$Nombre, c("Luis", "Pedro", "Jorge", "Lucia"))`, solution: R`seleccion <- df[df$Edad > 30 & df$Salario > 2000, ]`, hint: R`Une las dos condiciones con «&».` },
          { type: 'code', q: R`Simulacro (empleados): guarda en «it» el nombre y salario de los empleados de IT, y en «veteranos» los empleados con salario superior a 30000 **y** antigüedad de al menos 5 años.`, setup: EMPLEADOS, check: R`identical(it, empleados[empleados$departamento == "IT", c("nombre", "salario")]) && identical(veteranos$nombre, c("Luis", "Marta", "Carlos"))`, solution: R`it <- empleados[empleados$departamento == "IT", c("nombre", "salario")]
veteranos <- empleados[empleados$salario > 30000 & empleados$antiguedad >= 5, ]`, hint: R`«al menos 5» es «>= 5».` },
        ],
      },
      {
        id: 'u4l4', title: 'Modificar un data frame', icon: '🛠️', desc: R`Añadir y borrar columnas, cambiar valores y añadir filas.`,
        theory: [
          { title: 'Añadir y borrar columnas', md: R`~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta"), edad = c(28, 35, 42))
df1$profesion <- c("Médica", "Ingeniero", "Profesora")  # desde un vector
df1$edad_2030 <- df1$edad + 4                          # calculada
df1$mayor40 <- df1$edad > 40                           # lógica
df1
df1$profesion <- NULL                                  # borrar
names(df1)
~~~` },
          { title: 'Cambiar valores', md: R`~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta"), edad = c(28, 35, 42))
df1$edad[1] <- 29                 # una celda
df1[2, "edad"] <- 36              # lo mismo, otra forma
df1
~~~

Cambiar **solo las filas que cumplen algo** (sale en el simulacro):

~~~r
emp <- data.frame(dep = c("Ventas", "IT", "Ventas"), salario = c(28000, 35000, 31000))
emp$salario[emp$dep == "Ventas"] <- emp$salario[emp$dep == "Ventas"] + 2000
emp
~~~` },
          { title: 'Añadir filas', md: R`Con «rbind», usando un data frame **con las mismas columnas**:

~~~r
df1 <- data.frame(nombre = c("Ana", "Luis"), edad = c(28, 35))
nueva_fila <- data.frame(nombre = "Carlos", edad = 31)
df1 <- rbind(df1, nueva_fila)
df1
~~~

>! Si los nombres de columna no coinciden exactamente, «rbind» da error: *names do not match previous names*.` },
        ],
        exercises: [
          { type: 'mc', q: R`¿Cómo **borras** la columna «sueldo» de «df»?`, options: [R`df$sueldo <- NULL`, R`df$sueldo <- NA`, R`rm(df$sueldo)`, R`df[-sueldo]`], answer: 0, mono: true, explain: R`Asignar «NA» dejaría la columna llena de NA; «NULL» la elimina.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`df <- data.frame(x = c(1, 2, 3))
df$y <- df$x * 10
sum(df$y)`, answers: [R`[1] 60`] },
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`df$nota[1] <- 7
mean(df$nota)`, answers: [R`[1] 6`] },
          { type: 'fill', q: R`Completa para añadir la fila nueva al final`, setup: R`df <- data.frame(nombre = c("Ana", "Luis"), nota = c(7, 4))`, code: R`nueva <- data.frame(nombre = "Gorka", nota = 8)
df <- ___(df, nueva)`, blanks: [[R`rbind`]], bank: [R`rbind`, R`cbind`, R`c`, R`append`], check: R`nrow(df) == 3` },
          { type: 'code', q: R`Banco ej. 17: crea «df» con «ID» = 1:5, «Valor1» = 1:5 y «Valor2» = c(2, 4, 6, 8, 10). Añade la columna «Suma» con la suma de Valor1 y Valor2.`, check: R`is.data.frame(df) && .eq(df$Suma, c(3, 6, 9, 12, 15))`, solution: R`df <- data.frame(ID = 1:5, Valor1 = 1:5, Valor2 = c(2, 4, 6, 8, 10))
df$Suma <- df$Valor1 + df$Valor2`, hint: R`«df$Suma <- df$Valor1 + df$Valor2».` },
          { type: 'code', q: R`Simulacro ej. 3: con «alumnos» cargado, cambia la nota de la fila 2 a un 6 y añade la columna lógica «aprobado» (TRUE si nota ≥ 5).`, setup: R`alumnos <- data.frame(
  nombre = c("Ana", "Luis", "Marta", "Pablo", "Lucia"),
  nota = c(7, 4, 9, 6, 5),
  asistencia = c(80, 90, 70, 85, 95)
)`, check: R`.eq(alumnos$nota, c(7, 6, 9, 6, 5)) && identical(alumnos$aprobado, rep(TRUE, 5))`, solution: R`alumnos$nota[2] <- 6
alumnos$aprobado <- alumnos$nota >= 5`, hint: R`Primero cambia la nota; después crea «aprobado» con una comparación.` },
          { type: 'code', q: R`Simulacro (empleados): crea la columna «bonus» con el 10 % del salario y después **sube 2000 €** el salario solo a los empleados de Ventas.`, setup: EMPLEADOS, check: R`.eq(empleados$bonus, c(28000, 35000, 42000, 31000, 29000, 38000) * 0.1) && .eq(empleados$salario, c(30000, 35000, 42000, 33000, 29000, 38000))`, solution: R`empleados$bonus <- empleados$salario * 0.10
empleados$salario[empleados$departamento == "Ventas"] <-
  empleados$salario[empleados$departamento == "Ventas"] + 2000`, hint: R`Calcula el bonus **antes** de subir el salario. Para Ventas: «empleados$salario[cond] <- empleados$salario[cond] + 2000».` },
        ],
      },
      {
        id: 'u4l5', title: 'Ordenar y resumir', icon: '📊', desc: R`order(), medias y máximos por grupos.`,
        theory: [
          { title: 'Ordenar con order()', md: R`«order()» devuelve las **posiciones** en el orden correcto; se usan en la parte de filas:

~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta", "Carlos"), edad = c(29, 35, 42, 31))
order(df1$edad)
df1[order(df1$edad), ]                         # menor a mayor
df1[order(df1$edad, decreasing = TRUE), ]      # mayor a menor
df1[order(-df1$edad), ]                        # igual (solo números)
df1[order(df1$nombre), ]                       # alfabético
~~~

>! «sort()» ordena un **vector**; para ordenar un **data frame** se usa «order()».` },
          { title: 'Resumir por grupos', md: R`Combina selección de columna + condición:

~~~r
emp <- data.frame(dep = c("Ventas", "IT", "IT", "RRHH"),
                  salario = c(28000, 35000, 42000, 29000),
                  antiguedad = c(2, 5, 8, 3))
mean(emp$salario[emp$dep == "IT"])        # salario medio de IT
max(emp$salario[emp$antiguedad > 3])     # máximo con antigüedad > 3
table(emp$dep)                           # cuántos por departamento
~~~

> 💡 Se lee de dentro afuera: «de la columna salario, quédate con los de IT, y haz la media».` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`order(c(30, 10, 20))`, answers: [R`[1] 2 3 1`], explain: R`El menor (10) está en la posición 2, luego el 20 (posición 3), luego el 30 (posición 1).` },
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`df[order(df$selectividad, decreasing = TRUE), "nombre"][1]`, answers: [R`[1] "Jose"`] },
          { type: 'mc', q: R`¿Qué ordena el data frame «df» por la columna «nota» de mayor a menor?`, options: [R`df[order(df$nota, decreasing = TRUE), ]`, R`sort(df, decreasing = TRUE)`, R`df[, order(df$nota)]`, R`order(df)`], answer: 0, mono: true },
          { type: 'output', q: R`¿Qué muestra R?`, setup: EMPLEADOS, code: R`mean(empleados$salario[empleados$departamento == "IT"])`, answers: [R`[1] 38333.33`] },
          { type: 'code', q: R`Banco ej. 16: crea «df» con «Ciudad» ("Madrid", "Sevilla", "Valencia", "Bilbao") y «Habitantes» (3000000, 700000, 800000, 350000). Guarda la media de habitantes en «media» y el data frame ordenado de más a menos habitantes en «ordenado».`, check: R`.eq(media, 1212500) && identical(ordenado$Ciudad, c("Madrid", "Valencia", "Sevilla", "Bilbao"))`, solution: R`df <- data.frame(Ciudad = c("Madrid", "Sevilla", "Valencia", "Bilbao"),
                 Habitantes = c(3000000, 700000, 800000, 350000))
media <- mean(df$Habitantes)
ordenado <- df[order(df$Habitantes, decreasing = TRUE), ]`, hint: R`«df[order(df$Habitantes, decreasing = TRUE), ]».` },
          { type: 'code', q: R`Banco ej. 19: con «df» (10 días) cargado, guarda en «temp_media» la temperatura media de los días con humedad **superior al 70 %**.`, setup: R`df <- data.frame(Fecha = as.Date("2025-09-01") + 0:9,
                 Temperatura = c(20, 22, 21, 19, 23, 25, 18, 24, 20, 22),
                 Humedad = c(65, 72, 60, 80, 75, 68, 90, 55, 85, 70))`, check: R`.eq(temp_media, mean(c(22, 19, 23, 18, 20)))`, solution: R`temp_media <- mean(df$Temperatura[df$Humedad > 70])`, hint: R`Superior a 70 → «> 70» (el día con 70 justo no entra).` },
          { type: 'code', q: R`Simulacro (empleados): guarda en «max_vet» el salario máximo de los empleados con **más de 3 años** de antigüedad y en «ord» el data frame ordenado de menor a mayor salario.`, setup: EMPLEADOS, check: R`.eq(max_vet, 42000) && identical(ord$nombre, c("Ana", "Lucia", "Pablo", "Luis", "Carlos", "Marta"))`, solution: R`max_vet <- max(empleados$salario[empleados$antiguedad > 3])
ord <- empleados[order(empleados$salario), ]`, hint: R`«max(col[condición])» y «df[order(df$salario), ]».` },
        ],
      },
      {
        id: 'u4l6', title: 'subset()', icon: '🪄', desc: R`Filtrar y seleccionar columnas con menos código.`,
        theory: [
          { title: 'subset(datos, condición, select)', md: R`«subset()» hace lo mismo que los corchetes, pero se escribe más limpio: dentro **no hace falta «df$»**.

~~~r
df1 <- data.frame(nombre = c("Ana", "Luis", "Marta", "Carlos"), edad = c(29, 35, 42, 31),
                  ciudad = c("Salamanca", "Valencia", "Sevilla", "Vigo"))
subset(df1, edad > 30)
subset(df1, edad > 30, select = c(nombre, ciudad))
subset(df1, edad > 30 & ciudad == "Valencia")
subset(df1, edad < 30 | ciudad == "Vigo")
~~~

| Corchetes | subset |
|---|---|
| «df[df$edad > 30, c("nombre", "ciudad")]» | «subset(df, edad > 30, select = c(nombre, ciudad))» |` },
        ],
        exercises: [
          { type: 'mc', q: R`¿Cuál es equivalente a «df[df$nota > 6, ]»?`, options: [R`subset(df, nota > 6)`, R`subset(df, df[nota > 6])`, R`subset(nota > 6, df)`, R`subset(df, select = nota > 6)`], answer: 0, mono: true },
          { type: 'output', q: R`¿Qué muestra R?`, setup: ALUMNOS, code: R`nrow(subset(df, nota >= 5 & selectividad >= 12))`, answers: [R`[1] 3`] },
          { type: 'fill', q: R`Completa para quedarte solo con nombre y grado de los alumnos de nota mayor que 5`, setup: ALUMNOS, code: R`subset(df, nota > 5, ___ = c(nombre, grado))`, blanks: [[R`select`]], bank: [R`select`, R`columns`, R`cols`, R`filter`] },
          { type: 'code', q: R`Tarea de clase: con «df_jugadores» cargado, usa «subset» para guardar en «delanteros» el jugador y los goles de los delanteros, y en «jovenes_o_porteros» los jugadores con menos de 22 años **o** que son porteros.`, setup: R`df_jugadores <- data.frame(
  jugador = c("Pedri", "Gavi", "Lamine", "Raphinha", "Ter Stegen", "Araujo"),
  edad = c(22, 21, 18, 28, 33, 26),
  goles = c(6, 3, 9, 12, 0, 2),
  posicion = c("medio", "medio", "delantero", "delantero", "portero", "defensa")
)`, check: R`identical(names(delanteros), c("jugador", "goles")) && identical(delanteros$jugador, c("Lamine", "Raphinha")) && identical(jovenes_o_porteros$jugador, c("Gavi", "Lamine", "Ter Stegen"))`, solution: R`delanteros <- subset(df_jugadores, posicion == "delantero", select = c(jugador, goles))
jovenes_o_porteros <- subset(df_jugadores, edad < 22 | posicion == "portero")`, hint: R`Recuerda «==» para comparar texto y «|» para el O.` },
          { type: 'code', q: R`Con «df» de alumnos cargado, usa «subset» para guardar en «aranjuez» el nombre y grado de los alumnos de la ciudad "Aranjuez".`, setup: R`df <- data.frame(nombre = c("Ana", "Dani", "Jose", "Manolo", "Miriam"),
                 grado = c("Enfermería", "IACD", "Mecánica", "Teleco", "Derecho"),
                 ciudad = c("Aranjuez", "Pinto", "Aranjuez", "Cádiz", "Segovia"))`, check: R`identical(names(aranjuez), c("nombre", "grado")) && identical(aranjuez$nombre, c("Ana", "Jose"))`, solution: R`aranjuez <- subset(df, ciudad == "Aranjuez", select = c(nombre, grado))`, hint: R`«subset(df, ciudad == "Aranjuez", select = c(nombre, grado))».` },
        ],
      },
    ],
    boss: {
      id: 'u4b', title: 'Examen Unidad 4', icon: '🏰', desc: R`Data frames estilo simulacro Proctorio.`,
      exercises: [
        { type: 'output', q: R`¿Qué muestra R?`, setup: EMPLEADOS, code: R`nrow(empleados[empleados$departamento != "IT", ])`, answers: [R`[1] 3`] },
        { type: 'output', q: R`¿Qué muestra R?`, setup: EMPLEADOS, code: R`empleados[order(-empleados$antiguedad), "nombre"][2]`, answers: [R`[1] "Carlos"`] },
        { type: 'mc', q: R`«df[df$edad > 30]» (sin coma) da error o resultados raros. ¿Por qué?`, options: [R`Sin coma, R interpreta la condición como selección de columnas`, R`Porque falta library(dplyr)`, R`Porque «>» no funciona con data frames`, R`Porque hay que usar «=» en vez de «>»`], answer: 0 },
        { type: 'code', q: R`**Simulacro ej. 3 completo.** Con «alumnos» cargado: guarda en «a» los alumnos con nota ≥ 6 **y** asistencia ≥ 80; en «b» nombre y nota de los de asistencia ≥ 85; en «c» la media de nota de los que tienen asistencia ≥ 80; y en «d» la nota máxima de los de asistencia menor que 90.`, setup: R`alumnos <- data.frame(
  nombre = c("Ana", "Luis", "Marta", "Pablo", "Lucia"),
  nota = c(7, 6, 9, 6, 5),
  asistencia = c(80, 90, 70, 85, 95)
)`, check: R`identical(a$nombre, c("Ana", "Luis", "Pablo")) && identical(names(b), c("nombre", "nota")) && identical(b$nombre, c("Luis", "Pablo", "Lucia")) && .eq(c, 6) && .eq(d, 9)`, solution: R`a <- alumnos[alumnos$nota >= 6 & alumnos$asistencia >= 80, ]
b <- alumnos[alumnos$asistencia >= 85, c("nombre", "nota")]
c <- mean(alumnos$nota[alumnos$asistencia >= 80])
d <- max(alumnos$nota[alumnos$asistencia < 90])`, hint: R`Cada apartado es «df[condición, columnas]» o «función(df$col[condición])».` },
        { type: 'code', q: R`Con «ventas» cargado: añade la columna «total» (= precio × unidades), quédate en «caras» con los productos de precio > 10 ordenados por «total» de mayor a menor, y guarda en «ingreso_tech» el total de la categoría "tech".`, setup: R`ventas <- data.frame(
  producto = c("Ratón", "Teclado", "Monitor", "Libro", "Cable", "Lámpara"),
  categoria = c("tech", "tech", "tech", "ocio", "tech", "hogar"),
  precio = c(15, 37.25, 180, 12, 5, 25),
  unidades = c(10, 4, 2, 7, 30, 3)
)`, check: R`.eq(ventas$total, ventas$precio * ventas$unidades) && identical(caras$producto, c("Monitor", "Ratón", "Teclado", "Libro", "Lámpara")) && .eq(ingreso_tech, 15*10 + 37.25*4 + 180*2 + 5*30)`, solution: R`ventas$total <- ventas$precio * ventas$unidades
caras <- ventas[ventas$precio > 10, ]
caras <- caras[order(caras$total, decreasing = TRUE), ]
ingreso_tech <- sum(ventas$total[ventas$categoria == "tech"])`, hint: R`Haz los pasos por separado: columna nueva, filtrar, ordenar, sumar.` },
        { type: 'code', q: R`Crea «df» con las columnas «alumno» ("Ana", "Luis", "Marta") y «nota» (6, 4, 8). Añade la fila de "Gorka" con nota 9, cambia la nota de Luis a 5 y guarda en «media» la media final.`, check: R`nrow(df) == 4 && identical(df$alumno, c("Ana", "Luis", "Marta", "Gorka")) && .eq(df$nota, c(6, 5, 8, 9)) && .eq(media, 7)`, solution: R`df <- data.frame(alumno = c("Ana", "Luis", "Marta"), nota = c(6, 4, 8))
df <- rbind(df, data.frame(alumno = "Gorka", nota = 9))
df$nota[df$alumno == "Luis"] <- 5
media <- mean(df$nota)`, hint: R`«rbind(df, data.frame(alumno = "Gorka", nota = 9))».` },
      ],
    },
  });
})();
