// Tema 2 (parte 1): Mundo Vectores
(function () {
  const R = String.raw;
  RA_UNITS.push({
    id: 'u2', tema: 'Tema 2', icon: '🧵', short: 'Vectores', title: 'Vectores', color: '#1cb0f6',
    desc: R`La estructura básica de R: crear, acceder, operar y filtrar vectores, valores NA, coerción de tipos y factores.`,
    cheat: [
      [R`class(x); typeof(x); mode(x)`, R`Tipo/clase de un objeto («numeric», «integer», «character», «logical»…).`],
      [R`5L`, R`La «L» fuerza un entero (*integer*). «5» a secas es *double*.`],
      [R`is.numeric(x); as.numeric(x)`, R`Comprobar («is.») y convertir («as.») tipos.`],
      [R`c(1, 2, 3)`, R`Crear un vector concatenando elementos.`],
      [R`1:10`, R`Secuencia de enteros de 1 a 10.`],
      [R`seq(1, 10, by = 2)`, R`Secuencia con salto: 1 3 5 7 9.`],
      [R`seq(0, 1, length.out = 5)`, R`5 valores equiespaciados entre 0 y 1.`],
      [R`rep(1, 4); rep(c(1, 2), 3)`, R`Repetir valores. «each = 2» repite cada uno.`],
      [R`length(v)`, R`Número de elementos.`],
      [R`v[3]; v[c(1, 3)]; v[2:4]`, R`Acceder por posición (empieza en 1).`],
      [R`v[-1]; v[-c(1, 3)]`, R`Todos **menos** esas posiciones.`],
      [R`v[length(v)]`, R`Último elemento.`],
      [R`names(v) <- c("a", "b")`, R`Poner nombres a los elementos; luego «v["a"]».`],
      [R`v * 2; v1 + v2`, R`Operaciones elemento a elemento (vectorizadas).`],
      [R`sum(v); mean(v); min(v); max(v)`, R`Suma, media, mínimo, máximo.`],
      [R`sort(v); sort(v, decreasing = TRUE); rev(v)`, R`Ordenar y dar la vuelta.`],
      [R`v[v > 5]`, R`Filtrar con una condición lógica.`],
      [R`v[v > 2 & v < 8]; v[v < 2 | v > 8]`, R`Y lógico «&», O lógico «|».`],
      [R`sum(v > 5)`, R`Contar cuántos cumplen la condición (TRUE vale 1).`],
      [R`which(v > 5)`, R`Posiciones que cumplen la condición.`],
      [R`x %in% c("a", "b")`, R`¿Está x en la lista de valores?`],
      [R`is.na(v); v[!is.na(v)]`, R`Detectar / quitar valores faltantes NA.`],
      [R`mean(v, na.rm = TRUE)`, R`Calcular ignorando los NA.`],
      [R`factor(x); levels(f); table(f)`, R`Variables categóricas: niveles y frecuencias.`],
      [R`factor(x, levels = c("bajo", "medio", "alto"))`, R`Fijar el orden de los niveles.`],
    ],
    lessons: [
      {
        id: 'u2l2', title: 'Comprobar y convertir tipos', icon: '🔄', desc: R`Funciones is.* y as.*, y la coerción automática.`,
        theory: [
          { title: 'is.* comprueba, as.* convierte', md: R`| Comprobar | Convertir |
|---|---|
| «is.numeric()» | «as.numeric()» |
| «is.character()» | «as.character()» |
| «is.logical()» | «as.logical()» |
| «is.vector()» | «as.vector()» |
| «is.factor()» | «as.factor()» |

~~~r
is.numeric(42)
is.character(42)
as.numeric("42") + 1
as.character(3.5)
as.numeric(TRUE)
~~~` },
          { title: 'Coerción: R convierte solo', md: R`Si mezclas tipos en un vector, R **no da error**: convierte todo al tipo más general. Esto se llama **coerción**.

La jerarquía es: **lógico → entero → numérico (double) → carácter**

~~~r
c(1, "a", 3)
c(TRUE, FALSE, 3)
c(TRUE, "hola")
~~~

> 💡 Como TRUE vale 1 y FALSE vale 0, «sum()» de un vector lógico **cuenta los TRUE**. ¡Esto lo usarás muchísimo!

~~~r
sum(c(TRUE, FALSE, TRUE, TRUE))
~~~` },
          { title: 'Conversiones imposibles: NA', md: R`Si R no puede convertir, devuelve «NA» (*Not Available*) y avisa con un *warning*:

~~~r
as.numeric("hola")
as.numeric("12,5")   # ¡la coma decimal no vale! Usa punto
as.numeric("12.5")
~~~

>! En R el separador decimal es el **punto**. «12,5» no es un número.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`c(1, "a", 3)`, answers: [R`[1] "1" "a" "3"`], explain: R`Al mezclar números y texto, todo se convierte a **texto** (coerción).` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`c(TRUE, FALSE, 3)`, answers: [R`[1] 1 0 3`], explain: R`Lógico + numérico → numérico: TRUE = 1, FALSE = 0.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`sum(c(TRUE, TRUE, FALSE, TRUE))`, answers: [R`[1] 3`], explain: R`Cada TRUE cuenta como 1.` },
          { type: 'mc', q: R`¿Cuál es el orden correcto de la jerarquía de coerción (de menos a más general)?`, options: [R`lógico → entero → double → carácter`, R`carácter → double → entero → lógico`, R`entero → lógico → carácter → double`, R`double → entero → lógico → carácter`], answer: 0 },
          { type: 'output', q: R`¿Qué devuelve esta conversión?`, code: R`as.numeric("hola")`, answers: [R`[1] NA`], allowWarn: true, explain: R`No se puede convertir: da «NA» y un aviso «NAs introduced by coercion».` },
          { type: 'fill', q: R`Completa para convertir el texto "3.75" en número y sumarle 1`, code: R`___("3.75") + 1`, blanks: [[R`as.numeric`, R`as.double`]], bank: [R`as.numeric`, R`is.numeric`, R`numeric`, R`as.character`] },
          { type: 'tf', q: R`«is.character(25)» devuelve TRUE.`, answer: false, explain: R`25 es numérico. «is.character("25")» sí sería TRUE.` },
          { type: 'code', q: R`Tienes «edad_texto <- "19"» (texto). Conviértelo a número, guárdalo en «edad» y calcula en «edad_2030» la edad dentro de 4 años.`, setup: R`edad_texto <- "19"`, check: R`is.numeric(edad) && .eq(edad, 19) && .eq(edad_2030, 23)`, solution: R`edad <- as.numeric(edad_texto)
edad_2030 <- edad + 4`, hint: R`Usa «as.numeric()».` },
        ],
      },
      {
        id: 'u2l3', title: 'Crear vectores', icon: '🧵', desc: R`c(), secuencias con : y seq(), repeticiones con rep().`,
        theory: [
          { title: 'El vector: la estructura básica', md: R`Un **vector** es una colección **ordenada** de elementos **del mismo tipo**. Se crea con «c()» (de *combinar/concatenar*):

~~~r
temperaturas <- c(22, 21.8, 18, 19.2, 17)
ciudades <- c("Madrid", "Toledo", "Valladolid")
aprobado <- c(TRUE, FALSE, TRUE)
temperaturas
length(temperaturas)
~~~

> 💡 En R, ¡un número suelto ya es un vector de longitud 1! Por eso ves «[1]» delante.

Puedes **unir** vectores: «c(v1, v2)».` },
          { title: 'Tipos de vector', md: R`Según lo que guarden, hay tres tipos de vector que usarás siempre:

| Tipo | Ejemplo | «class()» |
|---|---|---|
| numérico | «c(7, 4.5, 9)» | «"numeric"» |
| texto | «c("Ana", "Luis")» | «"character"» |
| lógico | «c(TRUE, FALSE)» | «"logical"» |

~~~r
notas <- c(7, 4.5, 9)
class(notas)
class(c("Ana", "Luis"))
class(notas >= 5)
~~~

>! Los textos van **entre comillas** y los lógicos se escriben «TRUE» / «FALSE» en mayúsculas. «"5"» es texto, no un número.` },
          { title: 'Secuencias: «:» y seq()', md: R`~~~r
1:10                      # de 1 a 10 de uno en uno
10:1                      # hacia atrás
seq(1, 10, by = 2)        # con salto de 2
seq(0, 10, length.out = 5) # 5 valores equiespaciados
~~~

| Necesito… | Uso |
|---|---|
| enteros consecutivos | «a:b» |
| saltos concretos | «seq(a, b, by = k)» |
| un número de valores | «seq(a, b, length.out = n)» |` },
          { title: 'Repeticiones: rep()', md: R`~~~r
rep(1, 4)                     # 1 1 1 1
rep(c(1, 2), 3)               # 1 2 1 2 1 2  (times)
rep(c("a", "b"), each = 2)    # "a" "a" "b" "b"
~~~

- «times»: repite el vector entero.
- «each»: repite cada elemento.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`seq(1, 10, by = 3)`, answers: [R`[1] 1 4 7 10`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`rep(c("a", "b"), each = 2)`, answers: [R`[1] "a" "a" "b" "b"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`5:1`, answers: [R`[1] 5 4 3 2 1`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`length(seq(2, 20, by = 2))`, answers: [R`[1] 10`], explain: R`2, 4, 6, …, 20: diez valores.` },
          { type: 'mc', q: R`¿Qué instrucción genera «0.0 2.5 5.0 7.5 10.0»?`, options: [R`seq(0, 10, length.out = 5)`, R`seq(0, 10, by = 5)`, R`0:10`, R`rep(2.5, 5)`], answer: 0, mono: true },
          { type: 'fill', q: R`Completa para obtener «1 2 1 2 1 2»`, code: R`rep(c(1, 2), ___)`, blanks: [[R`3`, R`times=3`, R`times = 3`]], check: R`TRUE` },
          { type: 'fill', q: R`Completa para crear los impares del 1 al 19`, code: R`impares <- seq(1, 19, ___ = 2)`, blanks: [[R`by`]], bank: [R`by`, R`step`, R`each`, R`length.out`], check: R`.eq(impares, seq(1, 19, 2))` },
          { type: 'code', q: R`Crea el vector «temperaturas» con 22, 21.8, 18, 19.2 y 17, y guarda en «n» cuántos elementos tiene.`, check: R`.eq(temperaturas, c(22, 21.8, 18, 19.2, 17)) && .eq(n, 5)`, solution: R`temperaturas <- c(22, 21.8, 18, 19.2, 17)
n <- length(temperaturas)`, hint: R`«length()» cuenta los elementos.` },
          { type: 'code', q: R`Crea «v» con los múltiplos de 5 desde 5 hasta 100 usando «seq()».`, check: R`.eq(v, seq(5, 100, by = 5))`, solution: R`v <- seq(5, 100, by = 5)`, hint: R`«seq(desde, hasta, by = salto)».` },
        ],
      },
      {
        id: 'u2l4', title: 'Acceder a los elementos', icon: '🎯', desc: R`Corchetes, índices negativos, último elemento y nombres.`,
        theory: [
          { title: 'Corchetes [ ]', md: R`Se accede a un elemento por su **posición**, empezando en **1**:

~~~r
notas <- c(7, 4, 9, 5, 6)
notas[1]          # primero
notas[c(1, 3)]    # primero y tercero
notas[2:4]        # del 2 al 4
notas[length(notas)]  # el último
~~~

>! A diferencia de Python, en R el primer índice es **1**, no 0.` },
          { title: 'Índices negativos: excluir', md: R`Un índice **negativo** quita esas posiciones:

~~~r
notas <- c(7, 4, 9, 5, 6)
notas[-1]          # todas menos la primera
notas[-c(1, 3)]    # todas menos la 1 y la 3
~~~

>! «v[-1]» en R **no** es el último elemento (como en Python): ¡es el vector **sin el primero**!

Si pides una posición que no existe, R devuelve «NA»: «notas[10]».` },
          { title: 'Modificar y nombrar', md: R`Puedes **cambiar** un elemento asignando a su posición:

~~~r
notas <- c(7, 4, 9)
notas[2] <- 5
notas
~~~

Con «names()» das nombre a cada elemento y accedes por nombre:

~~~r
temperaturas <- c(25.5, 32, 18)
names(temperaturas) <- c("Madrid", "Granada", "Soria")
temperaturas
temperaturas["Madrid"]
~~~` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(10, 20, 30, 40, 50)
v[c(2, 4)]`, answers: [R`[1] 20 40`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(10, 20, 30, 40, 50)
v[-1]`, answers: [R`[1] 20 30 40 50`], explain: R`El índice negativo **quita** el primer elemento.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(10, 20, 30, 40, 50)
v[length(v)]`, answers: [R`[1] 50`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(3, 6, 9)
v[5]`, answers: [R`[1] NA`], explain: R`La posición 5 no existe: R devuelve NA.` },
          { type: 'mc', q: R`Tienes «alumnos» con 10 nombres. ¿Cómo muestras los alumnos 4, 5 y 6?`, options: [R`alumnos[4:6]`, R`alumnos(4:6)`, R`alumnos[4, 5, 6]`, R`alumnos{4:6}`], answer: 0, mono: true },
          { type: 'fill', q: R`Completa para mostrar todas las notas **menos** las de las posiciones 2 y 5`, code: R`notas <- c(10, 4, 5, 8, 2, 6)
notas[___]`, blanks: [[R`-c(2,5)`, R`-c(2, 5)`, R`c(-2,-5)`, R`c(-2, -5)`]], check: R`TRUE` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`t <- c(Madrid = 25.5, Soria = 18)
t["Soria"]`, answers: [R`Soria
   18`], explain: R`Al acceder por nombre, R muestra el nombre encima del valor.` },
          { type: 'code', q: R`Con el vector «jugadores» ya cargado, guarda en «primero» el primer jugador, en «ultimo» el último (usa «length()») y en «medio» los jugadores 2 a 4.`, setup: R`jugadores <- c("Pedri", "Gavi", "Lamine", "Raphinha", "Ter Stegen", "Araujo")`, check: R`identical(primero, "Pedri") && identical(ultimo, "Araujo") && identical(medio, c("Gavi", "Lamine", "Raphinha"))`, solution: R`primero <- jugadores[1]
ultimo <- jugadores[length(jugadores)]
medio <- jugadores[2:4]`, hint: R`El último es «jugadores[length(jugadores)]».` },
          { type: 'code', q: R`En «notas» la tercera nota está mal: cámbiala por 7.5. Luego pon nombres al vector con «c("Ana", "Luis", "Marta", "Pepe")».`, setup: R`notas <- c(6, 8, 3, 9)`, check: R`.eq(notas, c(6, 8, 7.5, 9)) && identical(names(notas), c("Ana", "Luis", "Marta", "Pepe"))`, solution: R`notas[3] <- 7.5
names(notas) <- c("Ana", "Luis", "Marta", "Pepe")
notas`, hint: R`«notas[3] <- 7.5» y después «names(notas) <- ...».` },
        ],
      },
      {
        id: 'u2l5', title: 'Operar con vectores', icon: '➗', desc: R`Operaciones elemento a elemento, reciclaje y funciones resumen.`,
        theory: [
          { title: 'Vectorización', md: R`Las operaciones en R se aplican **a cada elemento** sin escribir bucles:

~~~r
v1 <- c(2, 4, 6, 7)
v1 * 3
v2 <- c(1, 3, 4, 6)
v1 + v2
v1 > 4
~~~

> 💡 Sumar medio punto a todas las notas es tan fácil como «notas + 0.5».

Dos operadores que usarás muchísimo para filtrar:

| Operador | Qué da | Ejemplo |
|---|---|---|
| «%%» | resto de la división | «7 %% 2» → 1 |
| «%/%» | división entera | «7 %/% 2» → 3 |

~~~r
v <- 1:10
v %% 2      # 0 = par, 1 = impar
v %% 3 == 0 # ¿múltiplo de 3?
~~~` },
          { title: 'Reciclaje', md: R`Si los vectores tienen distinta longitud, R **repite** (recicla) el corto:

~~~r
c(1, 2, 3, 4) + c(10, 20)
~~~

Si la longitud larga no es múltiplo de la corta, da un **aviso**. Normalmente querrás vectores de la misma longitud.` },
          { title: 'Funciones resumen', md: R`~~~r
edades <- c(18, 22, 20, 21, 17)
sum(edades)
mean(edades)
min(edades); max(edades)
range(edades)
sort(edades)
sort(edades, decreasing = TRUE)
rev(edades)
round(mean(edades) / 3, 2)
~~~

| Función | Devuelve |
|---|---|
| «sum» | suma |
| «mean» | media |
| «median» | mediana |
| «min» / «max» | mínimo / máximo |
| «range» | mínimo y máximo |
| «sort» | ordenado |
| «rev» | al revés |` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`c(5, 15, 25, 35) * 3`, answers: [R`[1] 15 45 75 105`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`c(1, 2, 3) + c(10, 20, 30)`, answers: [R`[1] 11 22 33`] },
          { type: 'output', q: R`Reciclaje: ¿qué muestra R?`, code: R`c(1, 2, 3, 4) + c(100, 200)`, answers: [R`[1] 101 202 103 204`], explain: R`El vector corto se repite: 100, 200, 100, 200.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`sort(c(8, 3, 5, 1), decreasing = TRUE)`, answers: [R`[1] 8 5 3 1`] },
          { type: 'match', q: R`Empareja cada función con lo que devuelve para «c(4, 1, 7)»`, pairs: [[R`sum`, R`12`], [R`max`, R`7`], [R`range`, R`1 7`], [R`rev`, R`7 1 4`]] },
          { type: 'code', q: R`Crea «v» con 10, 20, 30 y 40 y guarda en «total» la suma de todos sus elementos.`, check: R`.eq(v, c(10, 20, 30, 40)) && .eq(total, 100)`, solution: R`v <- c(10, 20, 30, 40)
total <- sum(v)`, hint: R`«sum(v)».` },
          { type: 'code', q: R`El profe sube medio punto a todos. Crea «notas_nuevas» sumando 0.5 a «notas» y guarda su media en «media», su máximo en «maxima» y su mínimo en «minima».`, setup: R`notas <- c(3, 4, 2, 5, 6, 3, 4, 5, 6, 7)`, check: R`.eq(notas_nuevas, notas + 0.5) && .eq(media, mean(notas + 0.5)) && .eq(maxima, 7.5) && .eq(minima, 2.5)`, solution: R`notas_nuevas <- notas + 0.5
media <- mean(notas_nuevas)
maxima <- max(notas_nuevas)
minima <- min(notas_nuevas)`, hint: R`«notas + 0.5» suma a todos a la vez.` },
          { type: 'code', q: R`Tienes «precios» y «unidades» de 4 productos. Calcula en «ingresos» el ingreso de cada producto (precio × unidades) y en «total» la suma.`, setup: R`precios <- c(1.5, 0.9, 2, 3)
unidades <- c(10, 25, 4, 6)`, check: R`.eq(ingresos, precios * unidades) && .eq(total, sum(precios * unidades))`, solution: R`ingresos <- precios * unidades
total <- sum(ingresos)`, hint: R`Multiplicar dos vectores lo hace elemento a elemento.` },
        ],
      },
      {
        id: 'u2l6', title: 'Filtrar con condiciones', icon: '🔍', desc: R`Vectores lógicos, &, |, !, contar con sum() y which().`,
        theory: [
          { title: 'Comparaciones → vector lógico', md: R`Comparar un vector devuelve un vector de TRUE/FALSE:

| Operador | Significado |
|---|---|
| «==» | igual |
| «!=» | distinto |
| «>» «<» | mayor, menor |
| «>=» «<=» | mayor o igual, menor o igual |

~~~r
notas <- c(3, 7, 5, 9, 4)
notas >= 5
~~~

>! Para comparar se usa «==» (doble). «=» (simple) es asignación.` },
          { title: 'Filtrar: v[condición]', md: R`Si metes un vector lógico entre corchetes, te quedas con los TRUE:

~~~r
alumnos <- c("Ana", "Dani", "Jose", "Marta", "Pepe")
notas <- c(3, 7, 5, 9, 4)
aprobados <- notas >= 5
alumnos[aprobados]
notas[notas >= 5]
~~~

Combina condiciones con **«&» (y)**, **«|» (o)** y **«!» (no)**:

~~~r
notas[notas > 4 & notas < 8]
notas[notas < 4 | notas > 8]
alumnos[!(notas >= 5)]
~~~` },
          { title: 'Contar, posiciones y %in%', md: R`~~~r
notas <- c(3, 7, 5, 9, 4)
sum(notas >= 5)            # cuántos aprueban
length(notas[notas >= 5])  # lo mismo
which(notas >= 5)          # en qué posiciones
mean(notas >= 5)           # proporción de aprobados
~~~

El operador «%in%» comprueba si un valor está en una lista:

~~~r
ciudad <- c("Madrid", "Toledo", "Cádiz")
ciudad %in% c("Madrid", "Toledo")
~~~

> 💡 Truco del banco de ejercicios: múltiplos de 3 → «v %% 3 == 0».` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(4, 8, 15, 16, 23, 42)
v[v > 15]`, answers: [R`[1] 16 23 42`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(4, 8, 15, 16, 23, 42)
sum(v > 15)`, answers: [R`[1] 3`], explain: R`«v > 15» da 3 TRUE, y «sum» los cuenta.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(4, 8, 15, 16, 23, 42)
which(v %% 2 == 0)`, answers: [R`[1] 1 2 4 6`], explain: R`«which» devuelve las **posiciones**, no los valores.` },
          { type: 'mc', q: R`¿Qué expresión selecciona las notas **entre 5 y 7 (ambas incluidas)**?`, options: [R`notas[notas >= 5 & notas <= 7]`, R`notas[notas >= 5 | notas <= 7]`, R`notas[5:7]`, R`notas[notas = 5 & 7]`], answer: 0, mono: true },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`"Pinto" %in% c("Aranjuez", "Pinto", "Cádiz")`, answers: [R`[1] TRUE`] },
          { type: 'order', q: R`Ordena el código para mostrar los nombres de los alumnos suspensos`, lines: [R`alumnos <- c("Ana", "Luis", "Marta")`, R`notas <- c(7, 4, 3)`, R`suspensos <- notas < 5`, R`alumnos[suspensos]`], extra: [R`notas[alumnos]`] },
          { type: 'code', q: R`Banco de ejercicios Tema 2, ej. 6: crea un vector con los números del 1 al 20, extrae los múltiplos de 3 **menores que 15** y guarda su media en «resultado».`, check: R`.eq(resultado, 7.5)`, solution: R`v <- 1:20
v_filtrado <- v[v %% 3 == 0 & v < 15]
resultado <- mean(v_filtrado)`, hint: R`Múltiplo de 3: «v %% 3 == 0». Une las dos condiciones con «&».` },
          { type: 'code', q: R`Banco de ejercicios Tema 2, ej. 7: con los números del 1 al 50, selecciona los múltiplos de 4 **o** de 6 y guarda su suma en «suma».`, check: R`.eq(suma, sum((1:50)[(1:50) %% 4 == 0 | (1:50) %% 6 == 0]))`, solution: R`v <- 1:50
suma <- sum(v[v %% 4 == 0 | v %% 6 == 0])`, hint: R`«|» es el O lógico.` },
          { type: 'code', q: R`Con «jugadores» y «goles» cargados: guarda en «goleadores» los jugadores con **más de 5 goles** y en «cuantos» cuántos son.`, setup: R`jugadores <- c("Pedri", "Gavi", "Lamine", "Raphinha", "Ter Stegen", "Araujo")
goles <- c(6, 3, 9, 12, 0, 2)`, check: R`identical(goleadores, c("Pedri", "Lamine", "Raphinha")) && .eq(cuantos, 3)`, solution: R`goleadores <- jugadores[goles > 5]
cuantos <- length(goleadores)`, hint: R`Filtra el vector de **nombres** con la condición sobre los **goles**.` },
        ],
      },
      {
        id: 'u2l7', title: 'Valores faltantes: NA y NULL', icon: '🕳️', desc: R`Detectar y quitar NA, na.rm = TRUE y la diferencia con NULL.`,
        theory: [
          { title: 'NA: el dato que falta', md: R`«NA» (*Not Available*) representa un valor **desconocido**. Ocupa su posición en el vector, y **cualquier operación con NA da NA**:

~~~r
v <- c(24, NA, 31, NA, 16)
length(v)
mean(v)
v + 1
~~~` },
          { title: 'Detectar y quitar NA', md: R`~~~r
v <- c(24, NA, 31, NA, 16)
is.na(v)              # TRUE donde falta
sum(is.na(v))         # cuántos faltan
v[!is.na(v)]          # quitar los NA
mean(v, na.rm = TRUE) # ignorarlos al calcular
~~~

>! «v == NA» **no funciona** (da todo NA). Usa siempre «is.na(v)».

El símbolo «!» es la **negación**: cambia TRUE por FALSE y viceversa.` },
          { title: 'NULL: la nada', md: R`«NULL» es la **ausencia total** de objeto: no ocupa sitio.

~~~r
length(c(1, NA, 2))
length(c(1, NULL, 2))
~~~

| | NA | NULL |
|---|---|---|
| Significa | valor desconocido | no hay objeto |
| ¿Ocupa posición? | sí | no |
| Uso típico | datos faltantes | borrar (p. ej. columnas) |` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c(5, NA, 3)
mean(x)`, answers: [R`[1] NA`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c(5, NA, 3)
mean(x, na.rm = TRUE)`, answers: [R`[1] 4`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c(5, NA, 3, NA)
x[!is.na(x)]`, answers: [R`[1] 5 3`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`length(c(1, NULL, 2, NA))`, answers: [R`[1] 3`], explain: R`NULL no ocupa posición; NA sí.` },
          { type: 'tf', q: R`Para encontrar los NA de «v» se puede escribir «v == NA».`, answer: false, explain: R`Comparar con NA da NA. Hay que usar «is.na(v)».` },
          { type: 'fill', q: R`Completa para contar cuántos valores faltan en «v»`, code: R`v <- c(1, NA, 3, NA, NA)
___(is.na(v))`, blanks: [[R`sum`]], bank: [R`sum`, R`length`, R`count`, R`mean`] },
          { type: 'code', q: R`Simulacro Canvas (ej. 1): con «v» cargado, guarda en «sin_na» los valores no faltantes, en «mayores5» los no faltantes mayores que 5, en «media» la media sin NA y en «sin_146» el vector sin las posiciones 1, 4 y 6.`, setup: R`v <- c(5, 8, NA, 3, 10, 6, NA, 4)`, check: R`.eq(sin_na, c(5, 8, 3, 10, 6, 4)) && .eq(mayores5, c(8, 10, 6)) && .eq(media, 6) && identical(sin_146, v[-c(1, 4, 6)])`, solution: R`sin_na <- v[!is.na(v)]
mayores5 <- v[!is.na(v) & v > 5]
media <- mean(v[!is.na(v)])
sin_146 <- v[-c(1, 4, 6)]`, hint: R`«v[!is.na(v) & v > 5]» combina las dos condiciones.` },
        ],
      },
      {
        id: 'u2l8', title: 'Factores', icon: '🏷️', desc: R`Variables categóricas: niveles, orden y frecuencias.`,
        theory: [
          { title: 'Variables cualitativas', md: R`- **Cuantitativas**: se miden o cuentan (edad, altura, goles).
- **Cualitativas**: describen categorías (color de ojos, ciudad, estado civil).

Para las cualitativas R usa **factores**: un vector de enteros donde cada número es una **etiqueta (nivel)**.

~~~r
colores <- factor(c("rojo", "azul", "rojo", "verde", "azul"))
colores
levels(colores)
as.numeric(colores)
~~~

Por defecto los niveles se ordenan **alfabéticamente**: azul = 1, rojo = 2, verde = 3.` },
          { title: 'Fijar el orden y contar', md: R`Puedes elegir el orden de los niveles con «levels»:

~~~r
talla <- factor(c("M", "S", "L", "M"), levels = c("S", "M", "L"))
levels(talla)
table(talla)
nlevels(talla)
~~~

Si además el orden tiene sentido (bajo < medio < alto) usa «ordered = TRUE» y podrás comparar:

~~~r
nivel <- factor(c("bajo", "alto", "medio"), levels = c("bajo", "medio", "alto"), ordered = TRUE)
nivel[1] < nivel[2]
~~~

> 💡 «table()» cuenta cuántas veces aparece cada categoría. Imprescindible en estadística descriptiva.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`levels(factor(c("b", "a", "c", "a")))`, answers: [R`[1] "a" "b" "c"`], explain: R`Los niveles se ordenan alfabéticamente y sin repetir.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`f <- factor(c("rojo", "azul", "rojo", "verde"))
as.numeric(f)`, answers: [R`[1] 2 1 2 3`], explain: R`azul = 1, rojo = 2, verde = 3 (orden alfabético).` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`f <- factor(c("si", "no", "si", "si"))
nlevels(f)`, answers: [R`[1] 2`] },
          { type: 'mc', q: R`¿Qué tipo de variable se guarda mejor como factor?`, options: [R`El país de nacimiento`, R`La altura en cm`, R`El salario`, R`El número de goles`], answer: 0 },
          { type: 'fill', q: R`Completa para contar cuántos jugadores hay de cada posición`, code: R`posiciones <- factor(c("medio", "medio", "delantero", "portero"))
___(posiciones)`, blanks: [[R`table`, R`summary`]], bank: [R`table`, R`levels`, R`count`, R`length`] },
          { type: 'code', q: R`Pasa «posiciones» a factor y guárdalo en «pos_factor». Después guarda sus niveles en «niveles».`, setup: R`posiciones <- c("medio", "medio", "delantero", "delantero", "portero", "defensa")`, check: R`is.factor(pos_factor) && identical(niveles, c("defensa", "delantero", "medio", "portero"))`, solution: R`pos_factor <- factor(posiciones)
niveles <- levels(pos_factor)`, hint: R`«factor()» y después «levels()».` },
          { type: 'code', q: R`Crea el factor «satisfaccion» con los valores "alta", "baja", "media", "alta" y los niveles en el orden **baja, media, alta**.`, check: R`is.factor(satisfaccion) && identical(levels(satisfaccion), c("baja", "media", "alta")) && identical(as.character(satisfaccion), c("alta", "baja", "media", "alta"))`, solution: R`satisfaccion <- factor(c("alta", "baja", "media", "alta"),
                       levels = c("baja", "media", "alta"))`, hint: R`Usa el argumento «levels = c(...)».` },
        ],
      },
    ],
    boss: {
      id: 'u2b', title: 'Jefe del mundo', icon: '🏰', desc: R`Vectores a fondo, como en el parcial.`,
      exercises: [
        { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(2, 9, 4, 7, 1)
v[v > mean(v)]`, answers: [R`[1] 9 7`], explain: R`La media es 4.6; los mayores son 9 y 7.` },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c(1, "2", TRUE)
class(x)`, answers: [R`[1] "character"`] },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- seq(10, 50, by = 10)
v[-c(1, length(v))]`, answers: [R`[1] 20 30 40`] },
        { type: 'mc', q: R`¿Qué devuelve «mean(c(TRUE, FALSE, TRUE, TRUE))»?`, options: [R`0.75`, R`3`, R`TRUE`, R`Error`], answer: 0, mono: true, explain: R`Es la proporción de TRUE: 3/4.` },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(3, NA, 8, 1)
sum(v, na.rm = TRUE)`, answers: [R`[1] 12`] },
        { type: 'code', q: R`Con «alumnos» y «notas» cargados: guarda en «aprobados» los nombres con nota ≥ 5, en «entre5y7» los nombres con nota entre 5 y 7 (ambas incluidas) y en «n_aprob» cuántos aprueban.`, setup: R`alumnos <- c("diego", "guille", "juan", "pedro", "julia", "alvaro", "nano", "abel", "david", "maria")
notas <- c(10, 4, 5, 8, 2, 6, 5, 7, 9, 4)`, check: R`identical(aprobados, alumnos[notas >= 5]) && identical(entre5y7, c("juan", "alvaro", "nano", "abel")) && .eq(n_aprob, 7)`, solution: R`aprobados <- alumnos[notas >= 5]
entre5y7 <- alumnos[notas >= 5 & notas <= 7]
n_aprob <- length(aprobados)`, hint: R`Filtra los nombres usando condiciones sobre las notas.` },
        { type: 'code', q: R`Con «edades» cargado, guarda en «jovenes» las edades entre 20 y 25 (incluidas) **ordenadas de mayor a menor**.`, setup: R`edades <- c(22, 21, 18, 28, 33, 26, 24, 20)`, check: R`.eq(jovenes, c(24, 22, 21, 20))`, solution: R`jovenes <- sort(edades[edades >= 20 & edades <= 25], decreasing = TRUE)`, hint: R`Primero filtra, luego «sort(..., decreasing = TRUE)».` },
        { type: 'code', q: R`Con «ventas» (con NA) cargado: guarda en «n_faltan» cuántos NA hay, en «media» la media sin NA redondeada a 2 decimales y en «dias_altos» las **posiciones** con ventas mayores que 100.`, setup: R`ventas <- c(120, NA, 85, 140, NA, 99, 101)`, check: R`.eq(n_faltan, 2) && .eq(media, round(mean(ventas, na.rm = TRUE), 2)) && .eq(dias_altos, c(1, 4, 7))`, solution: R`n_faltan <- sum(is.na(ventas))
media <- round(mean(ventas, na.rm = TRUE), 2)
dias_altos <- which(ventas > 100)`, hint: R`«which()» ignora los NA automáticamente.` },
      ],
    },
  });
  // Orden del mundo: primero crear y usar vectores; la coerción de tipos, después de NA
  const orden = ['u2l3', 'u2l4', 'u2l5', 'u2l6', 'u2l7', 'u2l2', 'u2l8'];
  RA_UNITS.find((u) => u.id === 'u2').lessons.sort((a, b) => orden.indexOf(a.id) - orden.indexOf(b.id));
})();
