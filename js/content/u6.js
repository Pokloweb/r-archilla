// Unidad 6 — Tema 4: funciones, texto y entrada/salida de ficheros
(function () {
  const R = String.raw;
  RA_UNITS.push({
    id: 'u6', tema: 'Tema 4', icon: '🧩', short: 'Funciones', title: 'Funciones, texto y ficheros', color: '#00c2a8',
    desc: R`Crea tus propias funciones, aplica funciones a colecciones, trabaja con texto y lee/escribe archivos CSV.`,
    cheat: [
      [R`f <- function(x, y = 2) { x * y }`, R`Definir una función con un argumento por defecto.`],
      [R`return(valor)`, R`Devuelve un valor y termina la función (si no, devuelve la última expresión).`],
      [R`f(3); f(3, 5); f(y = 5, x = 3)`, R`Llamar por posición o por nombre.`],
      [R`list(media = m, maximo = mx)`, R`Devolver varios resultados en una lista.`],
      [R`ifelse(v >= 5, "apto", "no apto")`, R`Condicional vectorizado (sin bucle).`],
      [R`sapply(v, f)`, R`Aplica «f» a cada elemento y simplifica a vector.`],
      [R`lapply(lista, f)`, R`Aplica «f» a cada elemento y devuelve una lista.`],
      [R`tapply(valores, grupos, mean)`, R`Calcula una función por grupos.`],
      [R`paste("a", "b"); paste0("a", "b")`, R`Unir textos (con / sin espacio).`],
      [R`paste(v, collapse = ", ")`, R`Unir todos los elementos de un vector en un texto.`],
      [R`sprintf("%.2f €", x)`, R`Formatear números (2 decimales).`],
      [R`toupper(x); tolower(x); nchar(x)`, R`Mayúsculas, minúsculas, nº de caracteres.`],
      [R`substr(x, 1, 3)`, R`Subcadena del carácter 1 al 3.`],
      [R`strsplit("a,b", ",")[[1]]`, R`Partir un texto.`],
      [R`grepl("patrón", x); gsub("a", "o", x)`, R`Buscar / reemplazar texto.`],
      [R`read.csv("datos.csv")`, R`Leer un CSV a un data frame.`],
      [R`read.csv("datos.csv", sep = ";", dec = ",")`, R`CSV «a la española» (punto y coma, coma decimal).`],
      [R`write.csv(df, "salida.csv", row.names = FALSE)`, R`Guardar un data frame en CSV.`],
      [R`file.exists("datos.csv")`, R`¿Existe el archivo?`],
    ],
    lessons: [
      {
        id: 'u6l1', title: 'Tus propias funciones', icon: '🧩', desc: R`function(), argumentos y return().`,
        theory: [
          { title: '¿Por qué funciones?', md: R`Hasta ahora has usado funciones de R («mean», «sum»…). Ahora crearás las tuyas para **organizar y reutilizar** código: escribes la lógica una vez y la usas mil.

~~~norun
nombre_funcion <- function(argumento1, argumento2) {
  # cuerpo: lo que hace
  return(resultado)
}
~~~` },
          { title: 'Primera función', md: R`~~~r
area_rectangulo <- function(base, altura) {
  area <- base * altura
  return(area)
}
area_rectangulo(3, 4)
area_rectangulo(10, 2.5)
~~~

- Los **argumentos** son los datos de entrada.
- «return()» devuelve el resultado. Si no lo pones, la función devuelve la **última expresión** evaluada.

~~~r
cuadrado <- function(x) {
  x^2
}
cuadrado(1:4)
~~~

> 💡 Como «x^2» está vectorizado, ¡tu función también funciona con vectores!` },
          { title: 'Variables locales', md: R`Lo que creas **dentro** de una función vive solo allí (es **local**) y no toca las variables de fuera:

~~~r
x <- 10
f <- function() {
  x <- 5
  x * 2
}
f()
x      # sigue valiendo 10
~~~

>! Una función debe recibir lo que necesita **por sus argumentos**, no depender de variables globales.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`cuadrado <- function(x) {
  return(x^2)
}
cuadrado(4) + 1`, answers: [R`[1] 17`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`doble <- function(v) v * 2
doble(c(1, 5, 10))`, answers: [R`[1]  2 10 20`] },
          { type: 'output', q: R`¿Qué muestra R al final?`, code: R`x <- 10
f <- function() {
  x <- 99
  x
}
f()
x`, answers: [R`[1] 99
[1] 10`], explain: R`Dentro de la función se usa una «x» local; la global no cambia.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`f <- function(a) {
  a + 1
  a * 10
}
f(2)`, answers: [R`[1] 20`], explain: R`Sin «return», se devuelve la **última** expresión.` },
          { type: 'fill', q: R`Completa la definición de la función que suma dos números`, code: R`sumar <- ___(a, b) {
  ___(a + b)
}`, blanks: [[R`function`], [R`return`]], bank: [R`function`, R`return`, R`def`, R`print`, R`func`], check: R`sumar(2, 3) == 5` },
          { type: 'code', q: R`Crea la función «area_circulo(r)» que devuelva el área de un círculo de radio «r» (usa «pi»).`, check: R`is.function(area_circulo) && .eq(area_circulo(2), pi * 4) && .eq(area_circulo(1:3), pi * (1:3)^2)`, solution: R`area_circulo <- function(r) {
  return(pi * r^2)
}`, hint: R`«pi * r^2».` },
          { type: 'code', q: R`Crea «es_par(n)» que devuelva TRUE si «n» es par y FALSE si no.`, check: R`is.function(es_par) && isTRUE(es_par(10)) && isFALSE(es_par(7))`, solution: R`es_par <- function(n) {
  return(n %% 2 == 0)
}`, hint: R`La comparación ya devuelve TRUE/FALSE.` },
          { type: 'code', q: R`Crea «media_sin_extremos(v)» que devuelva la media de «v» quitando el valor mínimo y el máximo (supón que no se repiten).`, check: R`.eq(media_sin_extremos(c(1, 5, 7, 100)), 6) && .eq(media_sin_extremos(c(3, 9, 4, 8, 1)), 5)`, solution: R`media_sin_extremos <- function(v) {
  v2 <- v[v != min(v) & v != max(v)]
  mean(v2)
}`, hint: R`Filtra «v[v != min(v) & v != max(v)]».` },
        ],
      },
      {
        id: 'u6l2', title: 'Argumentos y resultados', icon: '🎛️', desc: R`Valores por defecto, llamar por nombre y devolver varias cosas.`,
        theory: [
          { title: 'Argumentos por defecto y por nombre', md: R`~~~r
precio_final <- function(precio, iva = 0.21, descuento = 0) {
  precio * (1 - descuento) * (1 + iva)
}
precio_final(100)                       # usa iva y descuento por defecto
precio_final(100, 0.10)                 # por posición
precio_final(100, descuento = 0.2)      # por nombre
precio_final(descuento = 0.5, precio = 10)
~~~

> 💡 Así funcionan las funciones de R: «mean(x, na.rm = TRUE)», «seq(1, 10, by = 2)», «round(x, digits = 2)».` },
          { title: 'Devolver varios valores', md: R`Una función devuelve **un** objeto… pero ese objeto puede ser una **lista**:

~~~r
resumen <- function(v) {
  list(media = mean(v), minimo = min(v), maximo = max(v))
}
r <- resumen(c(4, 8, 6))
r$media
r$maximo
~~~` },
          { title: 'Validar la entrada', md: R`Usa «if» + «return» o «stop()» para casos raros:

~~~r
dividir <- function(a, b) {
  if (b == 0) {
    return(NA)
  }
  a / b
}
dividir(10, 2)
dividir(1, 0)
~~~

«stop("mensaje")» lanza un error con tu mensaje.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`f <- function(a, b = 2) a * b
f(5)`, answers: [R`[1] 10`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`f <- function(a, b = 2) a - b
f(b = 10, a = 1)`, answers: [R`[1] -9`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`stats <- function(v) list(s = sum(v), n = length(v))
r <- stats(c(2, 4, 6))
r$s / r$n`, answers: [R`[1] 4`] },
          { type: 'mc', q: R`Con «f <- function(x, y = 3) x + y», ¿qué llamada da error?`, options: [R`f(y = 1)`, R`f(1)`, R`f(1, 1)`, R`f(y = 1, x = 2)`], answer: 0, mono: true, explain: R`«x» no tiene valor por defecto: hay que dárselo.` },
          { type: 'code', q: R`Crea «precio_final(precio, iva = 0.21)» que devuelva el precio con IVA redondeado a 2 decimales.`, check: R`.eq(precio_final(100), 121) && .eq(precio_final(9.99), round(9.99 * 1.21, 2)) && .eq(precio_final(50, iva = 0.1), 55)`, solution: R`precio_final <- function(precio, iva = 0.21) {
  round(precio * (1 + iva), 2)
}`, hint: R`«round(precio * (1 + iva), 2)».` },
          { type: 'code', q: R`Crea «resumen_notas(notas)» que devuelva una lista con «media», «aprobados» (cuántas ≥ 5) y «mejor» (nota máxima).`, check: R`r <- resumen_notas(c(4, 7, 9, 5, 2)); is.list(r) && .eq(r$media, 5.4) && .eq(r$aprobados, 3) && .eq(r$mejor, 9)`, solution: R`resumen_notas <- function(notas) {
  list(media = mean(notas),
       aprobados = sum(notas >= 5),
       mejor = max(notas))
}`, hint: R`«list(media = ..., aprobados = ..., mejor = ...)».` },
          { type: 'code', q: R`Crea «dividir(a, b)» que devuelva «a / b», pero si «b» es 0 devuelva NA.`, check: R`.eq(dividir(10, 4), 2.5) && is.na(dividir(3, 0))`, solution: R`dividir <- function(a, b) {
  if (b == 0) {
    return(NA)
  }
  a / b
}`, hint: R`Un «if (b == 0) return(NA)» al principio.` },
        ],
      },
      {
        id: 'u6l3', title: 'Funciones con lógica de negocio', icon: '💼', desc: R`Funciones con if y bucles dentro, e ifelse() vectorizado.`,
        theory: [
          { title: 'Reglas de negocio en una función', md: R`El ejemplo del Tema 3 (margen según contrato) queda mucho mejor como función:

~~~r
margen <- function(importe, contrato) {
  if (contrato == "A") {
    importe * 0.10
  } else if (contrato == "B") {
    importe * 0.15
  } else {
    importe * 0.05
  }
}
margen(1000, "B")
~~~

Y para un data frame, la aplicas fila a fila con un bucle (o con «mapply»/«sapply»).` },
          { title: 'ifelse(): el if vectorizado', md: R`«if» solo admite **un** valor. Para decidir sobre un **vector entero** de golpe usa «ifelse(condición, si_TRUE, si_FALSE)»:

~~~r
notas <- c(3, 7, 5, 9)
ifelse(notas >= 5, "Aprobado", "Suspenso")

edad <- c(15, 40, 70)
ifelse(edad < 18, "menor", ifelse(edad < 65, "adulto", "mayor"))
~~~

> 💡 «ifelse» es perfecto para crear columnas nuevas: «df$aprobado <- ifelse(df$nota >= 5, "sí", "no")».` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`ifelse(c(3, 7, 5) >= 5, "apto", "no apto")`, answers: [R`[1] "no apto" "apto"    "apto"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(-2, 0, 4)
ifelse(v > 0, v, 0)`, answers: [R`[1] 0 0 4`] },
          { type: 'mc', q: R`Quieres crear la columna «tipo» con "alto" si «df$altura > 180» y "normal" si no. ¿Qué usas?`, options: [R`df$tipo <- ifelse(df$altura > 180, "alto", "normal")`, R`if (df$altura > 180) df$tipo <- "alto" else df$tipo <- "normal"`, R`df$tipo <- df$altura > 180`, R`df$tipo <- if.else(df$altura, 180)`], answer: 0, mono: true, explain: R`«if» no funciona con un vector de condiciones; «ifelse» sí.` },
          { type: 'code', q: R`Crea «tarifa(edad)» que devuelva 0 si la edad es menor que 4, 5 si es menor que 18, 3 si es mayor que 65 y 8 en otro caso.`, check: R`.eq(tarifa(2), 0) && .eq(tarifa(10), 5) && .eq(tarifa(70), 3) && .eq(tarifa(30), 8)`, solution: R`tarifa <- function(edad) {
  if (edad < 4) {
    0
  } else if (edad < 18) {
    5
  } else if (edad > 65) {
    3
  } else {
    8
  }
}`, hint: R`Cadena de «if / else if / else».` },
          { type: 'code', q: R`Con «df» cargado, añade la columna «nivel» con "alto" si «ventas» > 1000 y "bajo" si no, usando «ifelse».`, setup: R`df <- data.frame(tienda = c("A", "B", "C", "D"), ventas = c(1500, 800, 1001, 1000))`, check: R`identical(df$nivel, c("alto", "bajo", "alto", "bajo"))`, solution: R`df$nivel <- ifelse(df$ventas > 1000, "alto", "bajo")`, hint: R`«ifelse(df$ventas > 1000, "alto", "bajo")».` },
          { type: 'code', q: R`Crea «contar_vocales(texto)» que recorra las letras con un bucle y devuelva cuántas vocales (a, e, i, o, u) tiene. Pista: «strsplit(texto, "")[[1]]» separa las letras.`, check: R`.eq(contar_vocales("programacion"), 5) && .eq(contar_vocales("rstudio"), 3)`, solution: R`contar_vocales <- function(texto) {
  letras <- strsplit(texto, "")[[1]]
  n <- 0
  for (l in letras) {
    if (l %in% c("a", "e", "i", "o", "u")) n <- n + 1
  }
  n
}`, hint: R`«l %in% c("a", "e", "i", "o", "u")».` },
        ],
      },
      {
        id: 'u6l4', title: 'La familia apply', icon: '👨‍👩‍👧', desc: R`sapply, lapply y tapply: bucles sin escribir bucles.`,
        theory: [
          { title: 'sapply y lapply', md: R`Aplican una función a **cada elemento** de un vector o lista:

~~~r
sapply(1:5, function(i) i^2)          # devuelve un vector
lapply(1:3, function(i) i * 10)       # devuelve una lista
notas <- list(ana = c(7, 8), luis = c(4, 6, 5))
sapply(notas, mean)                   # media de cada alumno
~~~

> 💡 «function(i) i^2» es una **función anónima**: la defines en el momento sin ponerle nombre.` },
          { title: 'apply y tapply', md: R`- «apply(matriz, 1 o 2, f)»: por filas o columnas (ya la conoces).
- «tapply(valores, grupos, f)»: aplica «f» a los valores de **cada grupo**.

~~~r
salario <- c(28000, 35000, 42000, 31000, 29000)
dep <- c("Ventas", "IT", "IT", "Ventas", "RRHH")
tapply(salario, dep, mean)
tapply(salario, dep, max)
~~~

| Función | Entrada | Salida |
|---|---|---|
| «apply» | matriz | vector |
| «sapply» | vector/lista | vector |
| «lapply» | vector/lista | lista |
| «tapply» | vector + grupos | vector con nombres |` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`sapply(1:4, function(i) i * 10)`, answers: [R`[1] 10 20 30 40`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`sapply(list(a = 1:3, b = 4:6), sum)`, answers: [R` a  b
 6 15`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`tapply(c(10, 20, 30, 40), c("x", "y", "x", "y"), mean)`, answers: [R` x  y
20 30`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`class(lapply(1:3, sqrt))`, answers: [R`[1] "list"`] },
          { type: 'match', q: R`Empareja cada función con su uso`, pairs: [[R`apply`, R`Filas/columnas de matriz`], [R`sapply`, R`Cada elemento → vector`], [R`lapply`, R`Cada elemento → lista`], [R`tapply`, R`Por grupos`]] },
          { type: 'code', q: R`Usa «sapply» con la lista «notas» para guardar en «medias» la media de cada alumno.`, setup: R`notas <- list(ana = c(7, 8, 9), luis = c(4, 6, 5), marta = c(10, 9, 8))`, check: R`.eq(medias, c(8, 5, 9)) && identical(names(medias), c("ana", "luis", "marta"))`, solution: R`medias <- sapply(notas, mean)`, hint: R`«sapply(lista, función)».` },
          { type: 'code', q: R`Con «empleados» cargado, guarda en «sal_dep» el salario medio por departamento usando «tapply».`, setup: R`empleados <- data.frame(
  departamento = c("Ventas", "IT", "IT", "Ventas", "RRHH", "IT"),
  salario = c(28000, 35000, 42000, 31000, 29000, 38000)
)`, check: R`.eq(sal_dep[["IT"]], 115000/3) && .eq(sal_dep[["Ventas"]], 29500) && .eq(sal_dep[["RRHH"]], 29000)`, solution: R`sal_dep <- tapply(empleados$salario, empleados$departamento, mean)`, hint: R`«tapply(valores, grupos, mean)».` },
        ],
      },
      {
        id: 'u6l5', title: 'Trabajar con texto', icon: '🔡', desc: R`paste, sprintf, mayúsculas, subcadenas, buscar y reemplazar.`,
        theory: [
          { title: 'Unir y formatear', md: R`~~~r
paste("Hola", "Ana")                  # con espacio
paste0("dato", 1:3)                   # sin espacio
paste("a", "b", sep = "-")
paste(c("x", "y", "z"), collapse = " + ")
sprintf("Nota: %.1f", 7.456)          # 1 decimal
sprintf("%s tiene %d años", "Luis", 20L)
~~~

En «sprintf»: «%s» texto, «%d» entero, «%.2f» decimal con 2 cifras.` },
          { title: 'Transformar y buscar', md: R`~~~r
x <- "Programación en R"
nchar(x)
toupper(x); tolower(x)
substr(x, 1, 4)
strsplit("rojo,verde,azul", ",")[[1]]
grepl("R", c("R", "Python", "RStudio"))   # ¿contiene?
gsub("a", "4", "banana")                  # reemplazar
trimws("   hola  ")                        # quitar espacios
~~~

> 💡 En ciencia de datos limpias texto constantemente: nombres con mayúsculas mezcladas, espacios sobrantes, separadores raros…` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`toupper("cunef")`, answers: [R`[1] "CUNEF"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`substr("RStudio", 2, 4)`, answers: [R`[1] "Stu"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`paste(c("x", "y", "z"), collapse = "+")`, answers: [R`[1] "x+y+z"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`sprintf("%.2f", 3.14159)`, answers: [R`[1] "3.14"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`grepl("a", c("casa", "perro", "gato"))`, answers: [R`[1]  TRUE FALSE  TRUE`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`gsub(" ", "_", "nota media final")`, answers: [R`[1] "nota_media_final"`] },
          { type: 'code', q: R`Limpia el vector «nombres»: quita los espacios de los extremos y ponlo todo en minúsculas. Guárdalo en «limpios».`, setup: R`nombres <- c("  ANA ", "Luis", " mArTa")`, check: R`identical(limpios, c("ana", "luis", "marta"))`, solution: R`limpios <- tolower(trimws(nombres))`, hint: R`«trimws()» y «tolower()» se pueden encadenar.` },
          { type: 'code', q: R`Con «productos» y «precios» cargados, crea «etiquetas» con textos del tipo "Pan: 1.50 €" (precio con 2 decimales). Usa «sprintf» o «paste».`, setup: R`productos <- c("Pan", "Leche", "Queso")
precios <- c(1.5, 0.9, 3)`, check: R`identical(etiquetas, c("Pan: 1.50 €", "Leche: 0.90 €", "Queso: 3.00 €"))`, solution: R`etiquetas <- sprintf("%s: %.2f €", productos, precios)`, hint: R`«sprintf("%s: %.2f €", productos, precios)» está vectorizado.` },
        ],
      },
      {
        id: 'u6l6', title: 'Leer y escribir ficheros', icon: '📂', desc: R`read.csv, write.csv y el formato CSV.`,
        theory: [
          { title: 'El formato CSV', md: R`Un **CSV** (*comma-separated values*) es un texto con una fila por línea y las columnas separadas por comas:

~~~norun
nombre,edad,ciudad
Ana,28,Madrid
Luis,35,Valencia
~~~

En España es frecuente el formato con **punto y coma** y **coma decimal** (lo que exporta Excel en español). Para eso: «read.csv(..., sep = ";", dec = ",")» o «read.csv2()».` },
          { title: 'Guardar y leer', md: R`~~~r
df <- data.frame(nombre = c("Ana", "Luis"), nota = c(7.5, 6))
write.csv(df, "notas.csv", row.names = FALSE)   # guardar
file.exists("notas.csv")
datos <- read.csv("notas.csv")                  # leer
str(datos)
~~~

>! Sin «row.names = FALSE», R guarda una columna extra con los números de fila.

Las rutas son **relativas al directorio de trabajo** («getwd()»). En RStudio también puedes usar *File › Import Dataset*.` },
          { title: 'Primeros pasos tras leer', md: R`Siempre que cargues datos:

1. «str(datos)» → ¿los tipos son los esperados?
2. «head(datos)» → ¿se ha leído bien?
3. «summary(datos)» → valores extraños, NA…
4. «nrow(datos)» → ¿están todas las filas?

~~~r
write.csv(data.frame(x = 1:3, y = c("a", "b", "c")), "prueba.csv", row.names = FALSE)
datos <- read.csv("prueba.csv")
str(datos)
head(datos, 2)
~~~` },
        ],
        exercises: [
          { type: 'mc', q: R`Tu CSV usa «;» como separador y «,» como decimal. ¿Cómo lo lees?`, options: [R`read.csv("f.csv", sep = ";", dec = ",")`, R`read.csv("f.csv")`, R`read.csv("f.csv", sep = ",", dec = ";")`, R`load("f.csv")`], answer: 0, mono: true },
          { type: 'mc', q: R`¿Para qué sirve «row.names = FALSE» en «write.csv»?`, options: [R`Para no guardar la columna con los números de fila`, R`Para no guardar los nombres de las columnas`, R`Para no sobrescribir el archivo`, R`Para guardar sin comillas`], answer: 0 },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`write.csv(data.frame(a = 1:4, b = 5:8), "t.csv", row.names = FALSE)
d <- read.csv("t.csv")
sum(d$b)`, answers: [R`[1] 26`] },
          { type: 'output', q: R`¿Qué muestra R? (guardado **sin** row.names = FALSE)`, code: R`write.csv(data.frame(a = 1:2), "t2.csv")
ncol(read.csv("t2.csv"))`, answers: [R`[1] 2`], explain: R`Se guardó también la columna de nombres de fila (llamada «X» al leerla).` },
          { type: 'order', q: R`Ordena el flujo: crear datos, guardarlos, leerlos y ver su estructura`, lines: [R`df <- data.frame(id = 1:3, valor = c(10, 20, 30))`, R`write.csv(df, "datos.csv", row.names = FALSE)`, R`datos <- read.csv("datos.csv")`, R`str(datos)`] },
          { type: 'code', q: R`Guarda «ventas» en el archivo "ventas.csv" (sin nombres de fila), vuelve a leerlo en «leidas» y guarda en «total» la suma de la columna «importe» leída.`, setup: R`ventas <- data.frame(dia = 1:4, importe = c(120.5, 98, 143.25, 110))`, check: R`file.exists("ventas.csv") && is.data.frame(leidas) && ncol(leidas) == 2 && .eq(total, 471.75)`, solution: R`write.csv(ventas, "ventas.csv", row.names = FALSE)
leidas <- read.csv("ventas.csv")
total <- sum(leidas$importe)`, hint: R`«write.csv(..., row.names = FALSE)» y luego «read.csv()».` },
          { type: 'code', q: R`Se ha creado "notas_es.csv" en formato español (separador «;», decimal «,»). Léelo en «notas» y guarda la media de la columna «nota» en «media».`, setup: R`writeLines(c("alumno;nota", "Ana;7,5", "Luis;6,25", "Marta;9"), "notas_es.csv")`, showSetup: false, check: R`is.data.frame(notas) && .eq(media, mean(c(7.5, 6.25, 9)))`, solution: R`notas <- read.csv("notas_es.csv", sep = ";", dec = ",")
media <- mean(notas$nota)`, hint: R`«read.csv("notas_es.csv", sep = ";", dec = ",")» (o «read.csv2»).` },
        ],
      },
    ],
    boss: {
      id: 'u6b', title: 'Jefe del mundo', icon: '🏰', desc: R`Funciones y ficheros.`,
      exercises: [
        { type: 'output', q: R`¿Qué muestra R?`, code: R`g <- function(x, n = 2) {
  if (x > 10) return("grande")
  x^n
}
g(3) + g(2, 3)`, answers: [R`[1] 17`] },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`sapply(c(4, 9, 16), function(v) sqrt(v) + 1)`, answers: [R`[1] 3 4 5`] },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`paste0(toupper(substr("data", 1, 1)), substr("data", 2, 4))`, answers: [R`[1] "Data"`] },
        { type: 'code', q: R`Crea «clasificar(nota)» que devuelva "Suspenso", "Aprobado", "Notable" o "Sobresaliente" (cortes en 5, 7 y 9), y guarda en «resultado» el resultado de aplicarla con «sapply» a «notas».`, setup: R`notas <- c(9.5, 4, 7, 6.9, 5)`, check: R`identical(unname(resultado), c("Sobresaliente", "Suspenso", "Notable", "Aprobado", "Aprobado"))`, solution: R`clasificar <- function(nota) {
  if (nota < 5) {
    "Suspenso"
  } else if (nota < 7) {
    "Aprobado"
  } else if (nota < 9) {
    "Notable"
  } else {
    "Sobresaliente"
  }
}
resultado <- sapply(notas, clasificar)`, hint: R`Define la función con if/else if y luego «sapply(notas, clasificar)».` },
        { type: 'code', q: R`Crea «estadisticas(df, columna)» que reciba un data frame y el **nombre** de una columna (texto) y devuelva una lista con «media» y «maximo» de esa columna. Pista: «df[[columna]]».`, check: R`d <- data.frame(a = c(1, 5, 3), b = c(10, 20, 60)); r <- estadisticas(d, "b"); is.list(r) && .eq(r$media, 30) && .eq(r$maximo, 60)`, solution: R`estadisticas <- function(df, columna) {
  x <- df[[columna]]
  list(media = mean(x), maximo = max(x))
}`, hint: R`«df[[columna]]» saca la columna cuyo nombre está en la variable.` },
        { type: 'code', q: R`Lee "gastos.csv" en «gastos», añade la columna «con_iva» (importe × 1.21, redondeado a 2 decimales) y vuelve a guardarlo como "gastos_iva.csv" sin nombres de fila.`, setup: R`write.csv(data.frame(concepto = c("luz", "agua", "gas"), importe = c(60, 25.5, 40)), "gastos.csv", row.names = FALSE)`, showSetup: false, check: R`file.exists("gastos_iva.csv") && { g <- read.csv("gastos_iva.csv"); ncol(g) == 3 && .eq(g$con_iva, round(c(60, 25.5, 40) * 1.21, 2)) }`, solution: R`gastos <- read.csv("gastos.csv")
gastos$con_iva <- round(gastos$importe * 1.21, 2)
write.csv(gastos, "gastos_iva.csv", row.names = FALSE)`, hint: R`Leer → columna nueva → «write.csv(..., row.names = FALSE)».` },
      ],
    },
  });
})();
