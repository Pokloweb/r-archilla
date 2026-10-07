// Unidad 5 — Tema 3: estructuras de control (condicionales y bucles)
(function () {
  const R = String.raw;
  const REDES = R`redes_sociales <- c("Instagram", "Strava", "Linkedin", "Tiktok", "Whatsapp")`;
  RA_UNITS.push({
    id: 'u5', num: 5, tema: 'Tema 3', short: 'Control de flujo', title: 'Condicionales y bucles', color: '#ff4b4b',
    desc: R`if, else, for, while, repeat, break y next: haz que tu código tome decisiones y repita tareas. ¡Lo más preguntado en el parcial!`,
    cheat: [
      [R`==  !=  >  <  >=  <=`, R`Comparaciones: devuelven TRUE o FALSE.`],
      [R`&  |  !`, R`Y, O, NO (vectorizados).`],
      [R`&&  ||`, R`Y, O para **un solo valor** (dentro de «if»). Evalúan solo lo necesario.`],
      [R`if (cond) { ... }`, R`Ejecuta el bloque solo si la condición es TRUE.`],
      [R`if (cond) { ... } else { ... }`, R`Dos caminos.`],
      [R`if (c1) { } else if (c2) { } else { }`, R`Varios casos; se ejecuta el **primero** que se cumpla.`],
      [R`for (x in vector) { ... }`, R`Repite una vez por cada elemento.`],
      [R`for (i in 1:n) { ... }`, R`Repite n veces con un contador i.`],
      [R`for (i in seq_along(v)) v[i]`, R`Recorrer por posición (seguro aunque v esté vacío).`],
      [R`while (cond) { ...; actualizar }`, R`Repite mientras la condición sea TRUE. ¡Actualiza la variable o será infinito!`],
      [R`repeat { ...; if (cond) break }`, R`Repite hasta encontrar un «break».`],
      [R`break`, R`Sale del bucle.`],
      [R`next`, R`Salta a la siguiente iteración.`],
      [R`suma <- 0; for (x in v) suma <- suma + x`, R`Patrón acumulador.`],
      [R`cont <- 0; if (cond) cont <- cont + 1`, R`Patrón contador.`],
      [R`res <- c(); res <- c(res, nuevo)`, R`Ir construyendo un vector en un bucle.`],
      [R`print(paste(n, "es par")); cat("x =", x, "\n")`, R`Mostrar texto: «paste» une y «cat» imprime («\n» = salto de línea).`],
      [R`nchar("Madrid")`, R`Número de caracteres de un texto.`],
      [R`n %% 2 == 0`, R`¿Es par?`],
    ],
    lessons: [
      {
        id: 'u5l1', title: 'Condiciones lógicas', icon: '⚖️', desc: R`Comparar, combinar con & | ! y guardar el resultado.`,
        theory: [
          { title: 'Estructuras de control', md: R`Sin estructuras de control, un programa ejecuta las líneas **una tras otra**. Con ellas decide **qué** se ejecuta, **cuántas veces** y **en qué condiciones**:

- **Condicionales** (if/else): ejecutar un bloque solo si se cumple algo.
- **Bucles** (for, while, repeat): repetir un bloque.
- **Control adicional** (break, next, return): salir o saltar.

Ejemplo de negocio: calcular el margen de **un millón de clientes** con 4 tipos de contrato. El **condicional** elige la fórmula según el contrato y el **bucle** recorre a todos los clientes.` },
          { title: 'Condiciones y operadores', md: R`Una condición siempre da «TRUE» o «FALSE», y se puede guardar en una variable lógica:

~~~r
edad <- 20
es_mayor_de_edad <- edad >= 18
es_mayor_de_edad
typeof(es_mayor_de_edad)
~~~

| Operador | Significado |
|---|---|
| «==» «!=» | igual, distinto |
| «>» «<» «>=» «<=» | comparaciones |
| «&» | Y (deben cumplirse todas) |
| «\|» | O (basta con una) |
| «!» | NO (invierte) |

~~~r
edad <- 70
edad < 12 | edad > 65
edad >= 18 & edad < 65
!(edad > 65)
~~~` },
          { title: '& vs &&', md: R`- «&» y «|» trabajan con **vectores** (elemento a elemento).
- «&&» y «||» trabajan con **un solo valor** y paran en cuanto saben la respuesta. Son los típicos dentro de un «if».

~~~r
x <- 15
x %% 3 == 0 && x %% 5 == 0
c(1, 6, 9) > 5 & c(1, 6, 9) < 8
~~~

>! Desde R 4.3, usar «&&» con vectores de más de un elemento da **error**. En el «if» pon condiciones de un solo valor.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`edad <- 70
edad < 12 | edad > 65`, answers: [R`[1] TRUE`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- 15
x %% 3 == 0 & x %% 4 == 0`, answers: [R`[1] FALSE`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`!(5 > 3)`, answers: [R`[1] FALSE`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`TRUE & FALSE | TRUE`, answers: [R`[1] TRUE`], explain: R`Primero se evalúa «&» (FALSE) y luego «|» con TRUE → TRUE.` },
          { type: 'match', q: R`Empareja cada operador con su significado`, pairs: [[R`==`, R`igual a`], [R`!=`, R`distinto de`], [R`&`, R`Y`], [R`|`, R`O`]] },
          { type: 'mc', q: R`¿Qué condición es TRUE para edades **entre 18 y 64** (incluido el 18, no el 65)?`, options: [R`edad >= 18 & edad < 65`, R`edad > 18 & edad <= 65`, R`edad >= 18 | edad < 65`, R`18 <= edad <= 65`], answer: 0, mono: true, explain: R`R no admite «18 <= edad <= 65» encadenado como en matemáticas: hay que unir dos condiciones con «&».` },
          { type: 'code', q: R`Con «nota» y «asistencia» cargadas, guarda en «puede_examinarse» TRUE si la asistencia es de al menos 80 **y** la nota no es negativa.`, setup: R`nota <- 6.5
asistencia <- 82`, check: R`isTRUE(puede_examinarse)`, solution: R`puede_examinarse <- asistencia >= 80 & nota >= 0`, hint: R`«asistencia >= 80 & nota >= 0».` },
        ],
      },
      {
        id: 'u5l2', title: 'if y else', icon: '🔀', desc: R`Tomar una decisión con dos caminos.`,
        theory: [
          { title: 'La estructura if', md: R`~~~norun
if (condición) {
  # se ejecuta si la condición es TRUE
}
~~~

~~~r
edad <- 15
if (edad >= 18) {
  print("Eres mayor de edad")
}
print("Fin")
~~~

Como «edad >= 18» es FALSE, el bloque entre llaves se salta.` },
          { title: 'if … else', md: R`~~~r
numero <- 7
if (numero %% 2 == 0) {
  print("par")
} else {
  print("impar")
}
~~~

>! El «else» debe ir en la **misma línea** que la llave «}» que cierra el if: «} else {». Si lo pones en una línea nueva, R da error al ejecutar línea a línea.

> 💡 Indenta (sangra) el código de dentro de las llaves: RStudio lo hace solo y se lee mucho mejor.` },
          { title: 'Condiciones sobre estructuras', md: R`Puedes usar en la condición cualquier valor que calcules:

~~~r
edades <- c(15, 22, 67, 40)
if (edades[1] < 18) {
  resultado <- "El primer valor es menor de edad"
} else {
  resultado <- "El primer valor es adulto"
}
resultado

notas <- c(4, 6, 7)
if (mean(notas) >= 5) print("Aprobado") else print("Suspenso")
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- 7
if (x %% 2 == 0) {
  print("par")
} else {
  print("impar")
}`, answers: [R`[1] "impar"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`saldo <- 50
precio <- 80
if (saldo >= precio) {
  saldo <- saldo - precio
}
saldo`, answers: [R`[1] 50`], explain: R`La condición es FALSE: no se compra y el saldo no cambia.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(3, 9, 2)
if (max(v) > 5) print("hay valores altos") else print("todo bajo")`, answers: [R`[1] "hay valores altos"`] },
          { type: 'mc', q: R`¿Qué fragmento está bien escrito?`, options: [R`if (x > 0) {
  print("positivo")
} else {
  print("no positivo")
}`, R`if x > 0 {
  print("positivo")
} else {
  print("no positivo")
}`, R`if (x > 0)
  print("positivo")
else (print("no positivo"))`, R`if (x > 0) then {
  print("positivo")
}`], answer: 0, mono: true },
          { type: 'fill', q: R`Completa el programa que dice si un número es par o impar`, code: R`numero <- 10
if (numero ___ 2 == 0) {
  print("par")
} ___ {
  print("impar")
}`, blanks: [[R`%%`], [R`else`]], bank: [R`%%`, R`else`, R`%/%`, R`elif`, R`/`] },
          { type: 'code', q: R`Escribe un programa que, según «edad», imprima "Eres mayor de edad" si tiene 18 o más, y "Eres menor de edad" en otro caso.`, setup: R`edad <- 15`, check: R`TRUE`, out: [R`"Eres menor de edad"`], solution: R`if (edad >= 18) {
  print("Eres mayor de edad")
} else {
  print("Eres menor de edad")
}`, hint: R`Usa «print()» dentro de cada bloque.` },
          { type: 'code', q: R`Con «notas» cargado, guarda en «resultado» el texto "Aprobado" si la media es al menos 5, y "Suspenso" si no.`, setup: R`notas <- c(4, 6.5, 3, 7)`, check: R`identical(resultado, "Aprobado")`, solution: R`if (mean(notas) >= 5) {
  resultado <- "Aprobado"
} else {
  resultado <- "Suspenso"
}`, hint: R`La media es 5.125.` },
        ],
      },
      {
        id: 'u5l3', title: 'else if: varios casos', icon: '🪜', desc: R`Encadenar condiciones: tarifas, descuentos y becas.`,
        theory: [
          { title: 'Cadena de casos', md: R`~~~norun
if (cond1) {
  # si cond1 es TRUE
} else if (cond2) {
  # si cond1 es FALSE y cond2 es TRUE
} else {
  # si ninguna se cumple
}
~~~

~~~r
edad <- 25
if (edad < 18) {
  categoria <- "Menor de edad"
} else if (edad >= 18 & edad < 65) {
  categoria <- "Adulto"
} else {
  categoria <- "Adulto mayor"
}
categoria
~~~

>! R evalúa **de arriba abajo** y ejecuta **solo el primer bloque** cuyo test sea TRUE. El orden de las condiciones importa.` },
          { title: 'Ejemplos de clase', md: R`Descuento por edad:

~~~r
precio <- 100
edad <- 70
if (edad < 18 | edad > 65) {
  precio_final <- precio * 0.7      # 30 % de descuento
} else if (edad > 40 & edad < 50) {
  precio_final <- precio * 0.85     # 15 %
} else {
  precio_final <- precio
}
precio_final
~~~

FizzBuzz (¡el orden importa: primero el caso más restrictivo!):

~~~r
numero <- 15
if (numero %% 3 == 0 && numero %% 5 == 0) {
  print("FIZZBUZZ")
} else if (numero %% 3 == 0) {
  print("FIZZ")
} else if (numero %% 5 == 0) {
  print("BUZZ")
}
~~~` },
          { title: 'Condiciones compuestas (simulacro)', md: R`En el simulacro aparece un sistema de becas con paréntesis para agrupar condiciones:

~~~r
nota <- 8.7; creditos <- 45; renta <- 40000
if (nota >= 8 & creditos >= 54 & renta < 25000) {
  print("Beca completa")
} else if ((nota >= 7 & creditos >= 48 & renta < 30000) |
           (nota >= 8.5 & creditos >= 42)) {
  print("Beca parcial")
} else if (creditos >= 30 & (nota >= 6 | renta < 20000)) {
  print("Beca de matrícula")
} else {
  print("Sin beca")
}
~~~

> 💡 Para trazar a mano: evalúa cada condición con los valores, apunta TRUE/FALSE de cada trozo, y para en el primer bloque TRUE.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`edad <- 45
precio <- 100
if (edad < 18 | edad > 65) {
  precio_final <- precio * 0.7
} else if (edad > 40 & edad < 50) {
  precio_final <- precio * 0.85
} else {
  precio_final <- precio
}
precio_final`, answers: [R`[1] 85`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- 30
if (x > 10) {
  print("grande")
} else if (x > 20) {
  print("muy grande")
} else {
  print("pequeño")
}`, answers: [R`[1] "grande"`], explain: R`La primera condición ya es TRUE, así que nunca se llega a mirar «x > 20».` },
          { type: 'output', q: R`Simulacro de becas: ¿qué imprime?`, code: R`nota <- 7.5; creditos <- 50; renta <- 28000
if (nota >= 8 & creditos >= 54 & renta < 25000) {
  print("Beca completa")
} else if ((nota >= 7 & creditos >= 48 & renta < 30000) |
           (nota >= 8.5 & creditos >= 42)) {
  print("Beca parcial")
} else if (creditos >= 30 & (nota >= 6 | renta < 20000)) {
  print("Beca de matrícula")
} else {
  print("Sin beca")
}`, answers: [R`[1] "Beca parcial"`] },
          { type: 'output', q: R`Mismo sistema de becas, otros datos: ¿qué imprime?`, code: R`nota <- 5.5; creditos <- 36; renta <- 18000
if (nota >= 8 & creditos >= 54 & renta < 25000) {
  print("Beca completa")
} else if ((nota >= 7 & creditos >= 48 & renta < 30000) |
           (nota >= 8.5 & creditos >= 42)) {
  print("Beca parcial")
} else if (creditos >= 30 & (nota >= 6 | renta < 20000)) {
  print("Beca de matrícula")
} else {
  print("Sin beca")
}`, answers: [R`[1] "Beca de matrícula"`], explain: R`La nota es baja, pero la renta < 20000 hace TRUE el paréntesis del tercer caso.` },
          { type: 'mc', q: R`En FizzBuzz, ¿por qué la condición «divisible entre 3 y 5» va **la primera**?`, options: [R`Porque si fuera después, el 15 entraría antes en «divisible entre 3» y nunca diría FIZZBUZZ`, R`Porque R exige ordenar las condiciones de más larga a más corta`, R`Porque «&&» solo funciona en el primer if`, R`Da igual el orden`], answer: 0 },
          { type: 'order', q: R`Ordena las líneas del clasificador de color de pelo`, setup: R`color_pelo <- "Rubio"`, lines: [R`if (color_pelo == "Moreno") {`, R`print("Eres moreno")`, R`} else if (color_pelo == "Rubio") {`, R`print("Eres rubio")`, R`} else {`, R`print("Ni rubio ni moreno")`, R`}`] },
          { type: 'code', q: R`Clasifica «edad»: guarda en «etapa» "Pequeño" si está entre 0 y 17, "Joven" entre 18 y 39, "Adulto" si es 40 o más, y "Edad no válida" si es negativa.`, setup: R`edad <- 27`, check: R`identical(etapa, "Joven")`, solution: R`if (edad >= 0 & edad < 18) {
  etapa <- "Pequeño"
} else if (edad >= 18 & edad < 40) {
  etapa <- "Joven"
} else if (edad >= 40) {
  etapa <- "Adulto"
} else {
  etapa <- "Edad no válida"
}`, hint: R`Cuatro casos: tres «if/else if» con condiciones y un «else» final para los negativos.` },
          { type: 'code', q: R`FizzBuzz: con «numero» cargado, imprime "FIZZBUZZ" si es divisible entre 3 y 5, "FIZZ" si solo entre 3, "BUZZ" si solo entre 5, y el propio número en otro caso.`, setup: R`numero <- 10`, check: R`TRUE`, out: [R`BUZZ`], solution: R`if (numero %% 3 == 0 && numero %% 5 == 0) {
  print("FIZZBUZZ")
} else if (numero %% 3 == 0) {
  print("FIZZ")
} else if (numero %% 5 == 0) {
  print("BUZZ")
} else {
  print(numero)
}`, hint: R`Pon primero el caso de 3 y 5 a la vez.` },
        ],
      },
      {
        id: 'u5l4', title: 'Bucle for', icon: '🔁', desc: R`Repetir para cada elemento de un vector.`,
        theory: [
          { title: 'Sintaxis del for', md: R`Se usa cuando **sabes cuántas veces** repetir (una por elemento):

~~~norun
for (elemento in coleccion) {
  # bloque que se repite
}
~~~

~~~r
v <- c(1, 2, 3, 4, 5)
for (i in v) {
  print(i)
}
~~~

En cada vuelta (iteración), «i» toma el siguiente valor de «v».` },
          { title: 'Formas de recorrer', md: R`~~~r
for (i in 1:3) print(i)          # secuencia
for (i in seq(2, 10, by = 4)) print(i)

nombres <- c("lucas", "ana", "manolo")
for (nombre in nombres) {        # recorrer textos
  print(nombre)
}
for (i in 1:length(nombres)) {   # recorrer por posición
  print(paste(i, nombres[i]))
}
~~~

> 💡 Recorrer **por posición** («i in 1:length(v)») te permite usar «v[i]» y a la vez otro vector «w[i]» del mismo tamaño.` },
          { title: 'Mostrar resultados: print, paste y cat', md: R`- «paste(a, b)» une textos con un espacio («paste0» sin espacio).
- «print()» muestra un objeto (con «[1]» y comillas).
- «cat()» imprime texto «limpio», sin «[1]»; usa «"\n"» para el salto de línea y «"\t"» para tabular.

~~~r
n <- 3
print(paste(n, "es impar"))
cat(n, "es impar\n")
cat("Tabla del", 2, "\n")
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`for (i in 1:3) {
  print(i * 2)
}`, answers: [R`[1] 2
[1] 4
[1] 6`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`for (fruta in c("pera", "kiwi")) {
  print(nchar(fruta))
}`, answers: [R`[1] 4
[1] 4`], explain: R`«nchar» cuenta los caracteres: pera (4), kiwi (4).` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`cat("Hola", "R", "\n")`, answers: [R`Hola R`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`paste0("dato_", 1:3)`, answers: [R`[1] "dato_1" "dato_2" "dato_3"`] },
          { type: 'mc', q: R`¿Cuántas veces se ejecuta el bloque de «for (i in seq(1, 10, by = 3))»?`, options: [R`4`, R`3`, R`10`, R`9`], answer: 0, explain: R`seq(1, 10, by = 3) es 1, 4, 7, 10.` },
          { type: 'code', q: R`Recorre el vector «nombres» con un for e imprime cada nombre con «print()».`, setup: R`nombres <- c("lucas", "ana", "manolo")`, check: R`TRUE`, out: [R`"lucas"`, R`"ana"`, R`"manolo"`], solution: R`for (nombre in nombres) {
  print(nombre)
}` },
          { type: 'code', q: R`Imprime con un bucle los números del 3 al 8 (uno por línea).`, check: R`TRUE`, out: ['3', '4', '5', '6', '7', '8'], solution: R`for (numero in 3:8) {
  print(numero)
}`, hint: R`«for (numero in 3:8)».` },
          { type: 'code', q: R`Recorre «alumnos» por posición e imprime frases como "Ana tiene un 7" usando «paste» y el vector «notas».`, setup: R`alumnos <- c("Ana", "Luis", "Marta")
notas <- c(7, 4, 9)`, check: R`TRUE`, out: [R`"Ana tiene un 7"`, R`"Luis tiene un 4"`, R`"Marta tiene un 9"`], solution: R`for (i in 1:length(alumnos)) {
  print(paste(alumnos[i], "tiene un", notas[i]))
}`, hint: R`«for (i in 1:length(alumnos))» y dentro «alumnos[i]» y «notas[i]».` },
        ],
      },
      {
        id: 'u5l5', title: 'Acumuladores y contadores', icon: '🧮', desc: R`Sumar, contar, medias y máximos «a mano» dentro de un bucle.`,
        theory: [
          { title: 'El patrón acumulador', md: R`Una variable que empieza en 0 y en cada vuelta **suma** algo:

~~~r
notas <- c(4, 5, 6, 3, 4, 5)
suma <- 0
for (nota in notas) {
  suma <- suma + nota
}
media <- suma / length(notas)
print(media)
~~~

>! Inicializa el acumulador **fuera** del bucle. Si pones «suma <- 0» dentro, se reinicia en cada vuelta.` },
          { title: 'El patrón contador', md: R`Una variable que suma **1** cada vez que se cumple algo:

~~~r
goles <- c(4, 5, 17, 45, 23, 12)
suma <- 0
contador_jugadores <- 0
for (gol in goles) {
  if (gol > 15) {
    contador_jugadores <- contador_jugadores + 1
    suma <- suma + gol
  }
}
media <- suma / contador_jugadores
media
~~~` },
          { title: 'Máximo y mínimo a mano', md: R`Guarda el «mejor hasta ahora» y actualízalo si encuentras uno mejor:

~~~r
goles <- c(20, 4, 22, 15, 13, 19)
maximo <- goles[1]
minimo <- goles[1]
for (gol in goles) {
  if (gol > maximo) maximo <- gol
  if (gol < minimo) minimo <- gol
}
cat("Máximo:", maximo, " Mínimo:", minimo, "\n")
~~~

> 💡 Empieza con el **primer elemento** (no con 0): si todos los valores fueran negativos, un máximo inicial de 0 daría un resultado falso.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`s <- 0
for (i in 1:4) {
  s <- s + i
}
s`, answers: [R`[1] 10`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`cont <- 0
for (x in c(3, 8, 1, 9, 5)) {
  if (x > 4) cont <- cont + 1
}
cont`, answers: [R`[1] 3`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`p <- 1
for (i in 1:4) {
  p <- p * 2
}
p`, answers: [R`[1] 16`] },
          { type: 'mc', q: R`Este código debería sumar el vector, pero da 5. ¿Cuál es el fallo?`, code: R`for (x in c(2, 3, 5)) {
  suma <- 0
  suma <- suma + x
}
suma`, options: [R`«suma <- 0» está dentro del bucle y se reinicia en cada vuelta`, R`Falta «print(suma)» dentro del bucle`, R`«x» no se puede usar como variable de bucle`, R`Hay que usar «=» en vez de «<-»`], answer: 0 },
          { type: 'code', q: R`Calcula con un **bucle** (sin usar «sum» ni «mean») la media de «notas» y guárdala en «media».`, setup: R`notas <- c(7, 3, 8, 6, 9, 2)`, check: R`.eq(media, 5.833333333)`, solution: R`suma <- 0
for (nota in notas) {
  suma <- suma + nota
}
media <- suma / length(notas)`, hint: R`Acumula en «suma» y al final divide entre «length(notas)».` },
          { type: 'code', q: R`Clase de bucles: con «goles» cargado, calcula con un bucle la **media de goles de los que metieron más de 15** (guárdala en «media»), y también el máximo («maximo») y mínimo («minimo») de todo el vector, sin usar «max»/«min».`, setup: R`goles <- c(20, 4, 22, 15, 13, 19)`, check: R`.eq(media, mean(c(20, 22, 19))) && .eq(maximo, 22) && .eq(minimo, 4)`, solution: R`total <- 0
masde15 <- 0
maximo <- goles[1]
minimo <- goles[1]
for (gol in goles) {
  if (gol > 15) {
    total <- total + gol
    masde15 <- masde15 + 1
  }
  if (gol > maximo) maximo <- gol
  if (gol < minimo) minimo <- gol
}
media <- total / masde15`, hint: R`Necesitas un acumulador, un contador y dos variables «mejor hasta ahora».` },
          { type: 'code', q: R`Cuenta con un bucle cuántas frutas tienen **más de 5 letras** y guárdalo en «largas».`, setup: R`frutas <- c("Manzana", "Pera", "Kiwi", "Plátano", "Naranja", "Sandía")`, check: R`.eq(largas, 4)`, solution: R`largas <- 0
for (fruta in frutas) {
  if (nchar(fruta) > 5) {
    largas <- largas + 1
  }
}`, hint: R`«nchar(fruta) > 5».` },
        ],
      },
      {
        id: 'u5l6', title: 'for + if: procesar datos', icon: '⚙️', desc: R`Filtrar en un bucle, clasificar y construir vectores nuevos.`,
        theory: [
          { title: 'Decidir en cada vuelta', md: R`Meter un «if» dentro del «for» te permite tratar cada elemento según sus características:

~~~r
v <- c(1, -2, 6, -4, 3, -7, 9)
for (i in v) {
  if (i > 0) {
    print(i)
  }
}

numeros <- 1:5
for (n in numeros) {
  if (n %% 2 == 0) {
    print(paste(n, "es un número par"))
  } else {
    print(paste(n, "es un número impar"))
  }
}
~~~` },
          { title: 'Construir un vector resultado', md: R`Empieza con un vector vacío y añade elementos con «c()»:

~~~r
v <- c(1, 2, 3, 4, 5)
resultado <- c()
for (i in v) {
  nuevo_valor <- i^2
  resultado <- c(resultado, nuevo_valor)
}
print(resultado)
~~~

> 💡 Recuerda que en R casi todo está vectorizado: «v^2» hace lo mismo sin bucle. Pero en el examen te pedirán saber hacerlo **con** bucle.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`for (i in c(1, -2, 6, -4)) {
  if (i > 0) print(i)
}`, answers: [R`[1] 1
[1] 6`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`res <- c()
for (x in 1:4) {
  if (x %% 2 == 0) res <- c(res, x * 10)
}
res`, answers: [R`[1] 20 40`] },
          { type: 'order', q: R`Ordena el programa que guarda en «resultado» el cuadrado de cada elemento`, setup: R`v <- c(1, 2, 3)`, lines: [R`resultado <- c()`, R`for (i in v) {`, R`resultado <- c(resultado, i^2)`, R`}`, R`print(resultado)`], check: R`identical(resultado, c(1, 4, 9))` },
          { type: 'code', q: R`Recorre los números del 1 al 5 e imprime con «print(paste(...))» si cada uno es par o impar: "1 es impar", "2 es par"…`, check: R`TRUE`, out: [R`"1 es impar"`, R`"2 es par"`, R`"3 es impar"`, R`"4 es par"`, R`"5 es impar"`], solution: R`for (n in 1:5) {
  if (n %% 2 == 0) {
    print(paste(n, "es par"))
  } else {
    print(paste(n, "es impar"))
  }
}`, hint: R`«paste(n, "es par")».` },
          { type: 'code', q: R`Con un bucle, crea el vector «largas» con las marcas que tienen **más de 4 letras** (en el mismo orden).`, setup: R`marcas <- c("Zara", "Nike", "Adidas", "H&M", "PULL", "VANS", "Mango")`, check: R`identical(largas, c("Adidas", "Mango"))`, solution: R`largas <- c()
for (marca in marcas) {
  if (nchar(marca) > 4) {
    largas <- c(largas, marca)
  }
}`, hint: R`Empieza con «largas <- c()» y añade con «largas <- c(largas, marca)».` },
          { type: 'code', q: R`Con un bucle, cuenta cuántas marcas tienen **más de 5 letras** («mas5»), **exactamente 5** («igual5») y **menos de 5** («menos5»).`, setup: R`marcas <- c("Zara", "Nike", "Adidas", "H&M", "PULL", "VANS", "Mango")`, check: R`.eq(mas5, 1) && .eq(igual5, 1) && .eq(menos5, 5)`, solution: R`mas5 <- 0
igual5 <- 0
menos5 <- 0
for (marca in marcas) {
  if (nchar(marca) > 5) {
    mas5 <- mas5 + 1
  } else if (nchar(marca) == 5) {
    igual5 <- igual5 + 1
  } else {
    menos5 <- menos5 + 1
  }
}`, hint: R`Tres contadores a 0 antes del bucle y un if / else if / else dentro.` },
        ],
      },
      {
        id: 'u5l7', title: 'while y repeat', icon: '♾️', desc: R`Repetir mientras se cumpla algo… sin bucles infinitos.`,
        theory: [
          { title: 'Bucle while', md: R`Se usa cuando **no sabes** cuántas vueltas harán falta: repite **mientras** la condición sea TRUE.

~~~r
x <- 1
while (x <= 5) {
  print(paste("El valor de x es", x))
  x <- x + 1    # ¡imprescindible!
}
~~~

>! Si nunca actualizas la variable de la condición, el bucle es **infinito**. En RStudio se para con **Esc** o el botón rojo STOP.` },
          { title: 'Ejemplo: ¿cuántos años?', md: R`¿Cuántos años tardan 1000 € al 5 % anual en duplicarse?

~~~r
capital <- 1000
anios <- 0
while (capital < 2000) {
  capital <- capital * 1.05
  anios <- anios + 1
}
anios
round(capital, 2)
~~~` },
          { title: 'Bucle repeat', md: R`«repeat» repite **siempre**, hasta que encuentra un «break»:

~~~r
i <- 1
repeat {
  print(i)
  if (i == 5) {
    break
  }
  i <- i + 1
}
~~~

| Bucle | Úsalo cuando… |
|---|---|
| «for» | sabes cuántas vueltas (recorres un vector) |
| «while» | repites mientras se cumpla una condición |
| «repeat» | repites hasta que algo dentro decida parar |` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- 1
while (x < 20) {
  x <- x * 3
}
x`, answers: [R`[1] 27`], explain: R`1 → 3 → 9 → 27. Con 27 la condición ya es FALSE.` },
          { type: 'output', q: R`¿Cuántas veces se imprime? Escribe la salida.`, code: R`n <- 10
while (n > 0) {
  print(n)
  n <- n - 4
}`, answers: [R`[1] 10
[1] 6
[1] 2`] },
          { type: 'mc', q: R`¿Qué le pasa a este bucle?`, code: R`x <- 1
while (x <= 5) {
  print(x)
}`, options: [R`Es infinito: x nunca cambia`, R`Imprime del 1 al 5`, R`No imprime nada`, R`Da error de sintaxis`], answer: 0 },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`i <- 0
repeat {
  i <- i + 2
  if (i >= 7) break
}
i`, answers: [R`[1] 8`] },
          { type: 'code', q: R`Usa un «while» para calcular cuántos años («anios») tarda una población de 100 conejos en superar los 1000 si cada año crece un 30 %.`, check: R`.eq(anios, 9)`, solution: R`poblacion <- 100
anios <- 0
while (poblacion <= 1000) {
  poblacion <- poblacion * 1.3
  anios <- anios + 1
}`, hint: R`Mientras la población sea ≤ 1000: multiplica por 1.3 y suma un año.` },
          { type: 'code', q: R`Con «repeat» y «break», imprime los números 1, 2, 3, 4 y 5 (uno por línea).`, check: R`TRUE`, out: ['1', '2', '3', '4', '5'], solution: R`i <- 1
repeat {
  print(i)
  if (i == 5) {
    break
  }
  i <- i + 1
}`, hint: R`Inicializa «i <- 1» fuera, y dentro imprime, comprueba si parar y suma 1.` },
        ],
      },
      {
        id: 'u5l8', title: 'break y next', icon: '⏭️', desc: R`Salir del bucle o saltarse una vuelta.`,
        theory: [
          { title: 'break: salir del bucle', md: R`«break» interrumpe el bucle en cuanto se ejecuta:

~~~r
for (i in 1:10) {
  if (i == 5) {
    break    # se detiene en i = 5
  }
  print(i)
}
~~~

Útil cuando ya has encontrado lo que buscabas (por ejemplo, el primer divisor de un número).` },
          { title: 'next: saltar esta vuelta', md: R`«next» salta a la **siguiente iteración** sin ejecutar el resto del bloque:

~~~r
for (i in 1:5) {
  if (i == 3) {
    next     # se omite i = 3
  }
  print(i)
}
~~~

> 💡 «return» es el tercero de la familia: lo verás con las funciones (Tema 4). Devuelve un valor y termina la función.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`for (i in 1:10) {
  if (i == 4) break
  print(i)
}`, answers: [R`[1] 1
[1] 2
[1] 3`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`for (i in 1:5) {
  if (i %% 2 == 0) next
  print(i)
}`, answers: [R`[1] 1
[1] 3
[1] 5`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`s <- 0
for (x in c(4, -1, 6, -3, 2)) {
  if (x < 0) next
  s <- s + x
}
s`, answers: [R`[1] 12`] },
          { type: 'match', q: R`Empareja cada instrucción con lo que hace`, pairs: [[R`break`, R`Termina el bucle`], [R`next`, R`Salta a la siguiente vuelta`], [R`return`, R`Devuelve un valor de una función`]] },
          { type: 'code', q: R`Recorre «v» y guarda en «primero_neg» el **primer** número negativo que encuentres, saliendo del bucle con «break».`, setup: R`v <- c(5, 8, -3, 7, -10)`, check: R`.eq(primero_neg, -3)`, solution: R`for (x in v) {
  if (x < 0) {
    primero_neg <- x
    break
  }
}`, hint: R`Dentro del if: guarda el valor y después «break».` },
          { type: 'code', q: R`Suma en «suma» todos los números del 1 al 20 **excepto** los múltiplos de 3, usando «next».`, check: R`.eq(suma, sum((1:20)[(1:20) %% 3 != 0]))`, solution: R`suma <- 0
for (i in 1:20) {
  if (i %% 3 == 0) next
  suma <- suma + i
}`, hint: R`Si «i %% 3 == 0», «next»; si no, acumula.` },
        ],
      },
      {
        id: 'u5l9', title: 'Bucles anidados', icon: '🪆', desc: R`Un bucle dentro de otro: tablas y matrices.`,
        theory: [
          { title: 'Un bucle dentro de otro', md: R`El bucle interno se ejecuta **completo** en cada vuelta del externo:

~~~r
for (i in 1:3) {
  cat("Tabla del", i, "\n")
  for (j in 1:5) {
    cat(i, "x", j, "=", i * j, "\t")
  }
  cat("\n")
}
~~~

Si el externo da 3 vueltas y el interno 5, el bloque interior se ejecuta **3 × 5 = 15** veces.` },
          { title: 'Recorrer una matriz', md: R`~~~r
m <- matrix(1:9, nrow = 3, ncol = 3)
for (i in 1:nrow(m)) {          # filas
  for (j in 1:ncol(m)) {        # columnas
    cat("Elemento en fila", i, "columna", j, "=", m[i, j], "\n")
  }
}
~~~

> 💡 «nrow(m)» y «ncol(m)» hacen que el código funcione con matrices de cualquier tamaño.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`cont <- 0
for (i in 1:3) {
  for (j in 1:4) {
    cont <- cont + 1
  }
}
cont`, answers: [R`[1] 12`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`for (i in 1:2) {
  for (j in 1:2) {
    cat(i, j, "\n")
  }
}`, answers: [R`1 1
1 2
2 1
2 2`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:4, nrow = 2)
s <- 0
for (i in 1:2) {
  for (j in 1:2) {
    if (i == j) s <- s + m[i, j]
  }
}
s`, answers: [R`[1] 5`], explain: R`Suma la diagonal: m[1,1] = 1 y m[2,2] = 4.` },
          { type: 'code', q: R`Imprime con «cat» la tabla de multiplicar del número «n» (del 1 al 10) con el formato «7 x 1 = 7» (una línea por multiplicación).`, setup: R`n <- 7`, check: R`TRUE`, out: [R`7 x 1 = 7`, R`7 x 5 = 35`, R`7 x 10 = 70`], solution: R`for (i in 1:10) {
  cat(n, "x", i, "=", n * i, "\n")
}`, hint: R`«cat(n, "x", i, "=", n * i, "\n")».` },
          { type: 'code', q: R`Recorre la matriz «m» con dos bucles y guarda en «pares» cuántos de sus elementos son pares.`, setup: R`m <- matrix(c(3, 8, 5, 12, 7, 6, 10, 1, 4), nrow = 3)`, check: R`.eq(pares, 5)`, solution: R`pares <- 0
for (i in 1:nrow(m)) {
  for (j in 1:ncol(m)) {
    if (m[i, j] %% 2 == 0) {
      pares <- pares + 1
    }
  }
}`, hint: R`«for (i in 1:nrow(m))» y dentro «for (j in 1:ncol(m))».` },
        ],
      },
      {
        id: 'u5l10', title: 'Algoritmos clásicos', icon: '🧠', desc: R`Sumatorio, factorial, primos y más: los deberes de clase.`,
        theory: [
          { title: 'Sumatorio y factorial', md: R`~~~r
numero <- 5
sumatorio <- 0
for (i in 1:numero) {
  sumatorio <- sumatorio + i
}
sumatorio      # 1+2+3+4+5

fact <- 1      # ¡el factorial empieza en 1, no en 0!
for (i in 1:numero) {
  fact <- fact * i
}
fact           # 5! = 120
~~~` },
          { title: '¿Es primo?', md: R`Un número es primo si solo es divisible entre 1 y él mismo. Idea: buscar algún divisor entre 2 y n-1.

~~~r
n <- 17
es_primo <- TRUE
if (n < 2) es_primo <- FALSE
for (d in 2:(n - 1)) {
  if (n > 2 && n %% d == 0) {
    es_primo <- FALSE
    break
  }
}
es_primo
~~~

> 💡 Mejora: basta con probar divisores hasta «sqrt(n)». Reto extra de clase: expresar un número par como suma de dos primos (**conjetura de Goldbach**).` },
          { title: 'Suma de pares en un rango', md: R`~~~r
inicio <- 10
final <- 234
suma <- 0
for (numero in inicio:final) {
  if (numero %% 2 == 0) {
    suma <- suma + numero
  }
}
print(suma)
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`fact <- 1
for (i in 1:4) fact <- fact * i
fact`, answers: [R`[1] 24`] },
          { type: 'mc', q: R`¿Por qué el acumulador del factorial empieza en 1 y no en 0?`, options: [R`Porque cualquier número multiplicado por 0 da 0`, R`Porque R no permite multiplicar por 0`, R`Porque los bucles empiezan en 1`, R`Es indiferente`], answer: 0 },
          { type: 'code', q: R`Calcula con un bucle el sumatorio de 1 hasta «numero» y guárdalo en «sumatorio».`, setup: R`numero <- 12`, check: R`.eq(sumatorio, 78)`, solution: R`sumatorio <- 0
for (i in 1:numero) {
  sumatorio <- sumatorio + i
}`, hint: R`Acumulador a 0 y «for (i in 1:numero)».` },
          { type: 'code', q: R`Calcula con un bucle el factorial de «numero» y guárdalo en «fact».`, setup: R`numero <- 7`, check: R`.eq(fact, 5040)`, solution: R`fact <- 1
for (i in 1:numero) {
  fact <- fact * i
}`, hint: R`Empieza en 1 y multiplica.` },
          { type: 'code', q: R`Guarda en «es_primo» TRUE si «n» es primo y FALSE si no (usa un bucle buscando divisores).`, setup: R`n <- 91`, check: R`isFALSE(es_primo)`, solution: R`es_primo <- TRUE
for (d in 2:(n - 1)) {
  if (n %% d == 0) {
    es_primo <- FALSE
    break
  }
}`, hint: R`91 = 7 × 13. Busca un divisor entre 2 y n - 1; si lo encuentras, no es primo.` },
          { type: 'code', q: R`Suma en «suma» todos los **pares** comprendidos entre «inicio» y «final» (ambos incluidos) usando un bucle.`, setup: R`inicio <- 10
final <- 234`, check: R`.eq(suma, sum(seq(10, 234, by = 2)))`, solution: R`suma <- 0
for (numero in inicio:final) {
  if (numero %% 2 == 0) {
    suma <- suma + numero
  }
}`, hint: R`Recorre «inicio:final» y acumula solo si «numero %% 2 == 0».` },
          { type: 'code', q: R`Imprime FizzBuzz del 1 al 15: para cada número, "FizzBuzz" si es múltiplo de 15, "Fizz" si de 3, "Buzz" si de 5, o el número.`, check: R`TRUE`, out: ['1', '2', R`"Fizz"`, '4', R`"Buzz"`, R`"Fizz"`, '7', '8', R`"Fizz"`, R`"Buzz"`, '11', R`"Fizz"`, '13', '14', R`"FizzBuzz"`], solution: R`for (i in 1:15) {
  if (i %% 15 == 0) {
    print("FizzBuzz")
  } else if (i %% 3 == 0) {
    print("Fizz")
  } else if (i %% 5 == 0) {
    print("Buzz")
  } else {
    print(i)
  }
}`, hint: R`Un for con if / else if / else if / else.` },
        ],
      },
      {
        id: 'u5l11', title: 'Traza el código', icon: '🕵️', desc: R`Predice el resultado como en los ejercicios del profe.`,
        theory: [
          { title: 'Cómo trazar un bucle a mano', md: R`En el examen escrito te darán código y tendrás que decir qué imprime. Método:

1. Apunta el valor **inicial** de cada variable.
2. Haz una tabla con una fila por **vuelta** del bucle.
3. En cada vuelta calcula la condición (TRUE/FALSE) y actualiza las variables.
4. Al final, lee el valor que se imprime.

Ejemplo con «nchar»: Instagram (9), Strava (6), Linkedin (8), Tiktok (6), Whatsapp (8).

| vuelta | i | nchar | condición | contador |
|---|---|---|---|---|
| inicio | | | | 1 |
| 1 | Instagram | 9 | > 6 ✔ | 4 |
| 2 | Strava | 6 | == 6 ✔ | 0 |
| … | | | | |

> 💡 Cuenta letras con cuidado: es donde más se falla.` },
        ],
        exercises: [
          { type: 'output', q: R`Ejercicio del profe: ¿qué imprime?`, setup: REDES, code: R`contador <- 1
for (i in redes_sociales) {
  if (nchar(i) == 3) {
    contador <- contador + 1
  } else if (nchar(i) > 1) {
    contador <- contador + 3
  } else {
    contador <- 0
  }
}
print(contador)`, answers: [R`[1] 16`], explain: R`Ninguna tiene 3 letras y todas tienen más de 1: 1 + 3·5 = 16.` },
          { type: 'output', q: R`Ejercicio del profe: ¿qué imprime?`, setup: REDES, code: R`contador <- 1
for (i in redes_sociales) {
  if (nchar(i) > 6) {
    contador <- contador + 3
  } else if (nchar(i) == 6) {
    contador <- 0
  } else {
    contador <- 17
  }
}
print(contador)`, answers: [R`[1] 3`], explain: R`Instagram → 4, Strava → 0, Linkedin → 3, Tiktok → 0, Whatsapp → 3.` },
          { type: 'output', q: R`Ejercicio del profe: ¿qué imprime?`, setup: REDES, code: R`contador <- 1
for (i in redes_sociales) {
  if (nchar(i) > 6) {
    contador <- contador + 3
  } else if (nchar(i) < 6) {
    contador <- contador + 10
  } else {
    contador <- contador - nchar(i)
  }
}
print(contador)`, answers: [R`[1] -2`], explain: R`4 → −2 → 1 → −5 → −2.` },
          { type: 'output', q: R`¿Qué imprime?`, code: R`x <- 0
for (i in 1:6) {
  if (i %% 2 == 0) {
    x <- x + i
  } else {
    x <- x - 1
  }
}
print(x)`, answers: [R`[1] 9`], explain: R`Pares suman 2+4+6 = 12; impares restan 3. 12 − 3 = 9.` },
          { type: 'output', q: R`¿Qué imprime?`, code: R`v <- c(2, 7, 4, 9, 1)
m <- v[1]
pos <- 1
for (i in 2:length(v)) {
  if (v[i] > m) {
    m <- v[i]
    pos <- i
  }
}
cat(m, pos, "\n")`, answers: [R`9 4`] },
          { type: 'output', q: R`¿Qué imprime?`, code: R`n <- 6
res <- 0
while (n > 1) {
  if (n %% 2 == 0) n <- n / 2 else n <- 3 * n + 1
  res <- res + 1
}
res`, answers: [R`[1] 8`], explain: R`6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1: 8 pasos (conjetura de Collatz).` },
          { type: 'output', q: R`¿Qué imprime?`, code: R`palabras <- c("sol", "luna", "estrella", "mar")
total <- 0
for (p in palabras) {
  if (nchar(p) <= 3) next
  total <- total + nchar(p)
}
total`, answers: [R`[1] 12`], explain: R`Solo cuentan "luna" (4) y "estrella" (8).` },
        ],
      },
    ],
    boss: {
      id: 'u5b', title: 'Examen Unidad 5', icon: '🏰', desc: R`Condicionales y bucles nivel parcial.`,
      exercises: [
        { type: 'output', q: R`¿Qué imprime?`, code: R`total <- 0
for (i in 1:10) {
  if (i %% 3 == 0) next
  if (i > 8) break
  total <- total + i
}
total`, answers: [R`[1] 27`], explain: R`Se saltan 3, 6 y 9 (el «next» va antes que el «break»), y con i = 10 se sale. Suma: 1+2+4+5+7+8 = 27.` },
        { type: 'output', q: R`¿Qué imprime?`, code: R`edad <- 17; carnet <- TRUE
if (edad >= 18 && carnet) {
  print("Puede conducir")
} else if (edad >= 16) {
  print("Puede conducir moto")
} else {
  print("No puede conducir")
}`, answers: [R`[1] "Puede conducir moto"`] },
        { type: 'output', q: R`¿Qué imprime?`, code: R`x <- 100
pasos <- 0
while (x > 1) {
  x <- x %/% 3
  pasos <- pasos + 1
}
pasos`, answers: [R`[1] 4`], explain: R`100 → 33 → 11 → 3 → 1.` },
        { type: 'code', q: R`Con «notas» cargado, recorre el vector y crea el vector de texto «calificacion» con "Suspenso" (< 5), "Aprobado" (5 a < 7), "Notable" (7 a < 9) o "Sobresaliente" (≥ 9) para cada nota.`, setup: R`notas <- c(4.5, 7, 9.2, 5, 8.9, 3)`, check: R`identical(calificacion, c("Suspenso", "Notable", "Sobresaliente", "Aprobado", "Notable", "Suspenso"))`, solution: R`calificacion <- c()
for (nota in notas) {
  if (nota < 5) {
    calificacion <- c(calificacion, "Suspenso")
  } else if (nota < 7) {
    calificacion <- c(calificacion, "Aprobado")
  } else if (nota < 9) {
    calificacion <- c(calificacion, "Notable")
  } else {
    calificacion <- c(calificacion, "Sobresaliente")
  }
}`, hint: R`Vector vacío + for + if/else if/else, añadiendo con «c(calificacion, ...)».` },
        { type: 'code', q: R`Con «clientes» cargado, calcula con un bucle el margen total «margen_total» aplicando: contrato "A" → 10 % del importe, "B" → 15 %, "C" → 20 %, cualquier otro → 5 %.`, setup: R`clientes <- data.frame(
  contrato = c("A", "C", "B", "D", "A", "C"),
  importe = c(1000, 500, 2000, 800, 300, 1200)
)`, check: R`.eq(margen_total, 1000*0.10 + 500*0.20 + 2000*0.15 + 800*0.05 + 300*0.10 + 1200*0.20)`, solution: R`margen_total <- 0
for (i in 1:nrow(clientes)) {
  if (clientes$contrato[i] == "A") {
    m <- 0.10
  } else if (clientes$contrato[i] == "B") {
    m <- 0.15
  } else if (clientes$contrato[i] == "C") {
    m <- 0.20
  } else {
    m <- 0.05
  }
  margen_total <- margen_total + clientes$importe[i] * m
}`, hint: R`Recorre por filas: «for (i in 1:nrow(clientes))» y usa «clientes$contrato[i]».` },
        { type: 'code', q: R`Guarda en «primos» un vector con todos los números primos entre 2 y 50, usando bucles anidados.`, check: R`identical(as.numeric(primos), c(2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47))`, solution: R`primos <- c()
for (n in 2:50) {
  es_primo <- TRUE
  if (n > 2) {
    for (d in 2:(n - 1)) {
      if (n %% d == 0) {
        es_primo <- FALSE
        break
      }
    }
  }
  if (es_primo) primos <- c(primos, n)
}`, hint: R`Bucle externo por cada n; interno buscando divisores. Cuidado con n = 2 (2:1 recorre 2 y 1).` },
      ],
    },
  });
})();
