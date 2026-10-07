// Unidad 1 — Tema 1: Introducción a R y su entorno (RStudio)
(function () {
  const R = String.raw;
  RA_UNITS.push({
    id: 'u1', num: 1, tema: 'Tema 1', short: 'R y RStudio', title: 'Primeros pasos en R y RStudio', color: '#58cc02',
    desc: R`Qué es R, cómo se organiza RStudio, R como calculadora y tus primeras variables.`,
    cheat: [
      [R`# esto es un comentario`, R`Todo lo que va tras «#» lo ignora R. Úsalo para explicar tu código.`],
      [R`x <- 5      # o  x = 5`, R`Asignación: guarda el valor 5 en la variable «x».`],
      [R`print(x)`, R`Muestra el valor de un objeto (en la consola basta con escribir «x»).`],
      [R`+  -  *  /  ^`, R`Suma, resta, multiplicación, división y potencia.`],
      [R`7 %% 2    # 1`, R`Resto de la división entera (módulo). Clave para saber si un número es par.`],
      [R`7 %/% 2   # 3`, R`Cociente de la división entera.`],
      [R`sqrt(16); abs(-3); round(3.1416, 2)`, R`Raíz cuadrada, valor absoluto y redondeo.`],
      [R`exp(1); log(100, base = 10)`, R`Exponencial y logaritmo (por defecto, neperiano).`],
      [R`ls()`, R`Lista los objetos del Environment.`],
      [R`rm(x); rm(list = ls())`, R`Borra un objeto / borra todos.`],
      [R`?mean   help(mean)`, R`Abre la ayuda de una función.`],
      [R`install.packages("dplyr")`, R`Descarga e instala un paquete desde CRAN (una vez).`],
      [R`library(dplyr)`, R`Carga un paquete instalado (en cada sesión).`],
      [R`getwd(); setwd("C:/ruta")`, R`Consulta / cambia el directorio de trabajo.`],
      [R`Ctrl + Enter`, R`Ejecuta la línea del cursor (o la selección) del script.`],
      [R`Alt + -`, R`Escribe el operador «<-».`],
      [R`Ctrl + L`, R`Limpia la consola.`],
    ],
    lessons: [
      {
        id: 'u1l1', title: '¿Qué es R?', icon: '📘', desc: R`El lenguaje, su historia y por qué se usa en ciencia de datos.`,
        theory: [
          { title: '¿Por qué programar con datos?', md: R`Imagina miles de transacciones de clientes. Con Excel filtras a mano… pero ¿y si mañana llegan 10.000 registros más y hay que repetir el análisis cada semana?

**Programar** te permite **automatizar**, analizar grandes volúmenes de datos y **reproducir** el análisis cuando quieras, siempre igual.

> 💡 Aprender a programar no es solo escribir código: es aprender a pensar y resolver problemas con datos de forma precisa, rápida y escalable.` },
          { title: 'R en pocas palabras', md: R`**R** es un lenguaje de programación y entorno de software diseñado para el **análisis estadístico** y la **visualización de datos**.

- Es **libre** (licencia GNU) y **multiplataforma** (Windows, Mac, Linux).
- Lee casi cualquier formato: «.csv», «.xls», «.sav», «.sas»…
- Tiene miles de **paquetes** que amplían lo que puede hacer.
- Lo usan Google, Facebook, Microsoft, Ford, American Express…

### Un poco de historia
R viene de **S**, creado en los Laboratorios Bell (1976) por John Chambers. **Ross Ihaka y Robert Gentleman** (Univ. de Auckland) crearon una versión libre de S: así nació R. Hoy lo mantiene el **R Development Core Team**.` },
          { title: 'CRAN, R base y paquetes', md: R`- **CRAN** (*Comprehensive R Archive Network*) es la red de servidores espejo desde donde se descarga R y sus paquetes: «https://cran.r-project.org».
- **R base**: lo que viene con la instalación (funciones como «mean()», «sum()», «plot()»).
- **Paquetes**: se instalan aparte (por ejemplo «dplyr» o «ggplot2»). No son R base, pero son parte de R.

>! Ojo: R distingue **mayúsculas y minúsculas**. «Mean(x)» da error; la función es «mean(x)».` },
          { title: 'Lenguaje vs IDE', md: R`Un **lenguaje** (R, Python…) es el conjunto de reglas para dar instrucciones al ordenador. Un **IDE** (*Integrated Development Environment*) es el programa que te ayuda a escribirlo y ejecutarlo: autocompletado, colores, gestión de archivos…

| Analogía | Programación |
|---|---|
| El idioma (español) | El lenguaje (R) |
| El editor de texto (Word) | El IDE (RStudio) |

**RStudio** (de la empresa *Posit*) es el IDE que usaremos. Siempre hay que instalar **primero R** y **después RStudio**. Si no puedes instalar nada, existe **Posit Cloud** (RStudio en el navegador).` },
        ],
        exercises: [
          { type: 'mc', q: R`¿Para qué está diseñado especialmente R?`, options: [R`Análisis estadístico y visualización de datos`, R`Crear videojuegos 3D`, R`Diseñar páginas web`, R`Programar sistemas operativos`], answer: 0 },
          { type: 'tf', q: R`R es un software de pago: hay que comprar una licencia para usarlo.`, answer: false, explain: R`R es libre y gratuito (licencia GNU).` },
          { type: 'match', q: R`Empareja cada concepto con su descripción`, pairs: [[R`R`, R`Lenguaje`], [R`RStudio`, R`IDE`], [R`CRAN`, R`Repositorio de paquetes`], [R`S`, R`Lenguaje del que viene R`]] },
          { type: 'mc', q: R`¿Qué hay que instalar **primero** para poder usar RStudio?`, options: [R`R`, R`Python`, R`Excel`, R`El paquete ggplot2`], answer: 0, explain: R`RStudio es solo el IDE: necesita que R esté instalado antes.` },
          { type: 'mc', q: R`¿Quiénes crearon R como una implementación libre de S?`, options: [R`Ross Ihaka y Robert Gentleman`, R`Bill Gates y Paul Allen`, R`Guido van Rossum`, R`John Chambers y Hadley Wickham`], answer: 0 },
          { type: 'tf', q: R`Para R, «Notas» y «notas» son el mismo nombre.`, answer: false, explain: R`R distingue mayúsculas de minúsculas (es *case sensitive*).` },
          { type: 'mc', q: R`Un paquete como «ggplot2»…`, options: [R`Se instala aparte desde CRAN; no forma parte de R base`, R`Viene siempre incluido en R base`, R`Solo funciona en Posit Cloud`, R`Es otro lenguaje distinto de R`], answer: 0 },
        ],
      },
      {
        id: 'u1l2', title: 'El entorno RStudio', icon: '🖥️', desc: R`Los paneles de RStudio, la consola y los scripts.`,
        theory: [
          { title: 'Los 4 paneles de RStudio', md: R`Al abrir RStudio ves la pantalla dividida en paneles:

1. **Editor de scripts** (arriba a la izquierda): donde escribes y guardas tu código en archivos «.R».
2. **Consola** (abajo a la izquierda): donde R ejecuta las instrucciones. Su símbolo es el *prompt* «>».
3. **Environment / History** (arriba a la derecha): los objetos que has creado y el historial de comandos.
4. **Files / Plots / Packages / Help / Viewer** (abajo a la derecha): archivos, gráficos, paquetes y ayuda.

> 💡 Nada más arrancar puede que solo veas 3 paneles: el editor aparece al abrir o crear un script (File › New File › R Script, o «Ctrl+Shift+N»).` },
          { title: 'Consola vs script', md: R`En la **consola** escribes una instrucción, pulsas Enter y ves el resultado al momento… pero no queda guardada.

En un **script** escribes muchas líneas, las guardas y las ejecutas cuando quieras:

- «Ctrl + Enter»: ejecuta la línea donde está el cursor (o lo seleccionado).
- «Ctrl + Shift + Enter»: ejecuta todo el script (*Source*).

~~~r
# Esto es un comentario: R lo ignora
2 + 3      # el resultado aparece en la consola
~~~

> 💡 Usa **comentarios** con «#» para explicar qué hace tu código. En los exámenes ayudan a que el profesor entienda tu razonamiento.` },
          { title: 'Environment, History y Help', md: R`- **Environment**: muestra cada variable con su valor. Si creas «x <- 5», aparece «x» con «5».
- **History**: todas las órdenes que has ejecutado.
- **Help**: documentación de las funciones (se abre con «?funcion»).
- **Plots**: los gráficos que generas.
- **Packages**: paquetes instalados y cargados.

Atajos útiles: «Ctrl + L» limpia la consola, «Alt + -» escribe «<-», «Tab» autocompleta, y la tecla **Esc** detiene una ejecución que no termina.` },
        ],
        exercises: [
          { type: 'match', q: R`Empareja cada panel con lo que muestra`, pairs: [[R`Console`, R`Ejecuta órdenes con el prompt >`], [R`Environment`, R`Variables creadas`], [R`Plots`, R`Gráficos`], [R`History`, R`Órdenes ya ejecutadas`]] },
          { type: 'mc', q: R`¿Qué atajo ejecuta en RStudio la línea donde está el cursor?`, options: [R`Ctrl + Enter`, R`Ctrl + S`, R`Alt + F4`, R`Ctrl + Z`], answer: 0 },
          { type: 'mc', q: R`¿Qué símbolo usa R para los comentarios?`, options: [R`#`, R`//`, R`--`, R`/* */`], answer: 0, mono: true },
          { type: 'output', q: R`¿Qué muestra la consola al ejecutar esto?`, code: R`# 10 + 10
5 + 5`, answers: [R`[1] 10`], explain: R`La primera línea es un comentario: R la ignora.` },
          { type: 'tf', q: R`El código escrito directamente en la consola queda guardado en un archivo .R.`, answer: false, explain: R`Para guardar código hay que escribirlo en un **script** y guardarlo.` },
          { type: 'mc', q: R`¿Qué atajo escribe el operador de asignación «<-»?`, options: [R`Alt + -`, R`Ctrl + A`, R`Shift + <`, R`Ctrl + Shift + M`], answer: 0, explain: R`«Ctrl + Shift + M» escribe el *pipe* (lo verás en el Tema 5).` },
          { type: 'mc', q: R`Un bucle se ha quedado ejecutándose sin parar. ¿Qué haces en RStudio?`, options: [R`Pulsar Esc o el botón STOP de la consola`, R`Pulsar Ctrl + L`, R`Cerrar el Environment`, R`Escribir «#» delante`], answer: 0 },
          { type: 'code', q: R`Escribe un comentario que diga «mi primer script» y, en la línea siguiente, calcula «100 - 58».`, check: R`TRUE`, out: [R`42`], solution: R`# mi primer script
100 - 58`, hint: R`Un comentario empieza por «#». La resta se escribe tal cual.` },
        ],
      },
      {
        id: 'u1l3', title: 'R como calculadora', icon: '🧮', desc: R`Operadores aritméticos y funciones matemáticas.`,
        theory: [
          { title: 'Operadores aritméticos', md: R`R puede usarse como una calculadora muy potente:

| Operador | Significado | Ejemplo | Resultado |
|---|---|---|---|
| «+» «-» | suma, resta | «7 - 2» | 5 |
| «*» «/» | multiplicación, división | «7 / 2» | 3.5 |
| «^» | potencia | «2 ^ 3» | 8 |
| «%%» | resto (módulo) | «7 %% 2» | 1 |
| «%/%» | división entera | «7 %/% 2» | 3 |

~~~r
7 / 2
7 %% 2
7 %/% 2
2 ^ 10
~~~

El «[1]» que ves delante de cada resultado indica la **posición** del primer elemento mostrado (lo entenderás con los vectores).` },
          { title: 'Orden de las operaciones', md: R`R respeta la jerarquía matemática: primero «^», luego «*» y «/», y después «+» y «-». Usa **paréntesis** para cambiar el orden.

~~~r
2 + 3 * 4
(2 + 3) * 4
-2 ^ 2
~~~

>! «-2 ^ 2» da «-4»: la potencia se calcula antes que el signo menos. Si quieres «(-2)²» escribe «(-2) ^ 2».` },
          { title: 'Funciones matemáticas', md: R`Una **función** recibe valores (argumentos) entre paréntesis y devuelve un resultado:

~~~r
sqrt(81)          # raíz cuadrada
abs(-12)          # valor absoluto
round(3.14159, 2) # redondear a 2 decimales
exp(1)            # número e
log(100)          # logaritmo neperiano
log(100, base = 10)
~~~

> 💡 «%%» es muy útil: «n %% 2 == 0» comprueba si «n» es **par**. Lo usarás mucho en condicionales y bucles.` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`2 + 3 * 4`, answers: [R`[1] 14`], explain: R`Primero la multiplicación (12) y luego la suma.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`17 %% 5`, answers: [R`[1] 2`], explain: R`17 = 5·3 + **2**. El operador «%%» devuelve el resto.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`17 %/% 5`, answers: [R`[1] 3`], explain: R`«%/%» devuelve la parte entera de la división.` },
          { type: 'mc', q: R`¿Cuál de estas expresiones vale **20**?`, options: [R`(2 + 3) * 4`, R`2 + 3 * 4`, R`2 + 3 ^ 2`, R`20 %% 4`], answer: 0, mono: true },
          { type: 'match', q: R`Empareja cada operación con su resultado`, pairs: [[R`2 ^ 3`, R`8`], [R`10 / 4`, R`2.5`], [R`10 %% 3`, R`1`], [R`11 %/% 4`, R`2`]] },
          { type: 'fill', q: R`Completa para calcular la raíz cuadrada de 144`, code: R`___(144)`, blanks: [[R`sqrt`]], bank: [R`sqrt`, R`root`, R`sqr`, R`raiz`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`round(7.4567, 1)`, answers: [R`[1] 7.5`] },
          { type: 'code', q: R`Un producto cuesta 80 € y tiene un 15% de descuento. Calcula el precio final y guárdalo en la variable «precio_final».`, check: R`.eq(precio_final, 68)`, solution: R`precio_final <- 80 * (1 - 0.15)`, hint: R`El 15% de descuento significa pagar el 85%: «80 * 0.85».`, explain: R`80 · 0.85 = 68.` },
          { type: 'code', q: R`Comprueba con el operador módulo si 2026 es divisible entre 3: calcula el **resto** de dividir 2026 entre 3 y guárdalo en «resto».`, check: R`.eq(resto, 2026 %% 3)`, solution: R`resto <- 2026 %% 3
resto`, hint: R`Usa «%%».`, explain: R`El resto es 1, así que 2026 **no** es divisible entre 3.` },
        ],
      },
      {
        id: 'u1l4', title: 'Variables y asignación', icon: '📦', desc: R`Guardar valores con «<-» o «=», nombres válidos y el Environment.`,
        theory: [
          { title: 'Una variable es una caja con nombre', md: R`Una **variable** es un nombre que apunta a un valor. Se crea con una **asignación**:

~~~r
edad <- 19        # forma clásica de R
nombre = "Lucas"  # también vale (la que usamos en clase)
edad
nombre
~~~

Al asignar, R no muestra nada: solo guarda el valor. Para verlo, escribe el nombre o usa «print(edad)».

> 💡 «<-» y «=» funcionan igual para asignar. Elige uno y sé coherente. En RStudio, «Alt + -» escribe «<-».` },
          { title: 'Usar y reasignar variables', md: R`Las variables se usan en cálculos y se pueden **sobrescribir**:

~~~r
precio <- 20
cantidad <- 3
total <- precio * cantidad
total
precio <- 25      # el valor anterior se pierde
total             # ¡total NO cambia solo! sigue siendo 60
~~~

>! «total» se calculó con el precio antiguo. Si cambias «precio», tienes que volver a calcular «total».` },
          { title: 'Nombres válidos', md: R`Reglas para nombrar variables:

- Empiezan por **letra** (o por punto no seguido de número).
- Sin espacios ni símbolos raros como «?», «+», «(», «-».
- Pueden llevar letras, números, «_» y «.».
- **Mayúsculas importan**: «Edad» ≠ «edad».

Buenas prácticas: nombres descriptivos y cortos, con «snake_case» («media_alumnos») o «camelCase» («mediaAlumnos»).

| ✅ Válidos | ❌ No válidos |
|---|---|
| «nota_final» | «nota final» |
| «notaFinal» | «2nota» |
| «nota2» | «nota-final» |` },
          { title: 'Gestionar el Environment', md: R`~~~r
a <- 1
b <- 2
ls()        # lista los objetos creados
rm(a)       # borra 'a'
ls()
~~~

Para borrar todo: «rm(list = ls())» (o la escoba 🧹 del panel Environment).` },
        ],
        exercises: [
          { type: 'output', q: R`¿Qué muestra la última línea?`, code: R`x <- 10
y <- 3
x - y`, answers: [R`[1] 7`] },
          { type: 'mc', q: R`¿Cuál de estos nombres de variable **no** es válido en R?`, options: [R`2notas`, R`notas_2`, R`notas.media`, R`mediaNotas`], answer: 0, mono: true, explain: R`Un nombre no puede empezar por un número.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`a = 5
a = a + 2
a`, answers: [R`[1] 7`], explain: R`Se toma el valor actual de «a» (5), se le suma 2 y se guarda de nuevo en «a».` },
          { type: 'output', q: R`Atento: ¿qué muestra la última línea?`, code: R`precio <- 10
total <- precio * 2
precio <- 50
total`, answers: [R`[1] 20`], explain: R`«total» se calculó cuando «precio» valía 10. Cambiar «precio» después no lo recalcula.` },
          { type: 'tf', q: R`En R, «x <- 3» y «x = 3» hacen lo mismo.`, answer: true },
          { type: 'mc', q: R`¿Qué función lista los objetos que hay en el Environment?`, options: [R`ls()`, R`list()`, R`env()`, R`objects.show()`], answer: 0, mono: true },
          { type: 'fill', q: R`Completa para borrar la variable «temporal»`, code: R`temporal <- 99
___(temporal)`, blanks: [[R`rm`, R`remove`]], bank: [R`rm`, R`del`, R`drop`, R`clear`] },
          { type: 'code', q: R`Crea la variable «nombre» con tu nombre (texto entre comillas) y la variable «edad» con tu edad. Después crea «edad_en_10» con la edad que tendrás dentro de 10 años.`, check: R`is.character(nombre) && is.numeric(edad) && .eq(edad_en_10, edad + 10)`, solution: R`nombre <- "Lucas"
edad <- 19
edad_en_10 <- edad + 10`, hint: R`Los textos van entre comillas: «nombre <- "Ana"».` },
          { type: 'code', q: R`Tienes las notas de 3 parciales: 6.5, 8 y 7.25. Guárdalas en «p1», «p2» y «p3» y calcula su media en la variable «media».`, check: R`.eq(media, (6.5 + 8 + 7.25) / 3)`, solution: R`p1 <- 6.5
p2 <- 8
p3 <- 7.25
media <- (p1 + p2 + p3) / 3
media`, hint: R`¡Cuidado con los paréntesis! Sin ellos solo dividirías «p3» entre 3.` },
        ],
      },
      {
        id: 'u1l5', title: 'Ayuda, paquetes y directorio', icon: '🧰', desc: R`Pedir ayuda, instalar y cargar paquetes y el directorio de trabajo.`,
        theory: [
          { title: 'Pedir ayuda a R', md: R`R trae documentación de todas sus funciones:

~~~norun
?mean            # ayuda de la función mean
help(mean)       # lo mismo
??regression     # busca un tema en toda la ayuda
example(mean)    # ejecuta los ejemplos de la ayuda
~~~

La ayuda tiene siempre: *Description*, *Usage* (cómo se llama), *Arguments* (qué recibe), *Value* (qué devuelve) y *Examples*.

> 💡 Si un mensaje de error no se entiende, cópialo tal cual en Google: casi siempre alguien tuvo el mismo problema.` },
          { title: 'Paquetes: instalar vs cargar', md: R`Un paquete se **instala una vez** y se **carga en cada sesión**:

~~~norun
install.packages("dplyr")   # descarga desde CRAN (con comillas)
library(dplyr)              # lo carga para usarlo (sin comillas)
dplyr::filter(...)          # usar una función sin cargar el paquete
~~~

| Acción | Función | ¿Cuándo? |
|---|---|---|
| Instalar | «install.packages("x")» | Una vez por ordenador |
| Cargar | «library(x)» | Cada vez que abres R |

>! Si ves «Error: could not find function "filter"», seguramente olvidaste «library(dplyr)».` },
          { title: 'Directorio y espacio de trabajo', md: R`- El **directorio de trabajo** es la carpeta donde R busca y guarda archivos.
- El **espacio de trabajo** (*workspace*) son los objetos de la sesión (el Environment).

~~~norun
getwd()                         # ¿dónde estoy?
setwd("C:/Users/yo/CUNEF/R")    # cambiar de carpeta (barras /)
list.files()                    # archivos de la carpeta
~~~

>! En Windows las rutas en R se escriben con «/» o con «\\», nunca con una sola «\».

En RStudio también puedes cambiarlo en *Session › Set Working Directory*.` },
        ],
        exercises: [
          { type: 'mc', q: R`¿Cómo abres la ayuda de la función «sum»?`, options: [R`?sum`, R`help sum`, R`#sum`, R`sum?`], answer: 0, mono: true },
          { type: 'match', q: R`Empareja cada instrucción con lo que hace`, pairs: [[R`install.packages("x")`, R`Descarga el paquete`], [R`library(x)`, R`Carga el paquete`], [R`getwd()`, R`Muestra la carpeta actual`], [R`setwd("...")`, R`Cambia la carpeta`]] },
          { type: 'tf', q: R`Hay que ejecutar «install.packages()» cada vez que abres RStudio.`, answer: false, explain: R`Se instala una vez. Lo que se repite en cada sesión es «library()».` },
          { type: 'mc', q: R`Te sale «could not find function "ggplot"». ¿Qué es lo más probable?`, options: [R`No has cargado el paquete con library(ggplot2)`, R`R no está instalado`, R`Has usado = en vez de <-`, R`Falta un comentario`], answer: 0 },
          { type: 'fill', q: R`Completa para cargar el paquete «ggplot2»`, code: R`___(ggplot2)`, blanks: [[R`library`, R`require`]], bank: [R`library`, R`install`, R`load`, R`import`], run: false },
          { type: 'mc', q: R`¿Qué ruta es correcta en R (Windows)?`, options: [R`"C:/Users/ana/datos"`, R`"C:\Users\ana\datos"`, R`C:/Users/ana/datos`, R`'C:|Users|ana|datos'`], answer: 0, mono: true, explain: R`Usa «/» (o «\\» doble) y siempre entre comillas.` },
          { type: 'mc', q: R`¿Qué sección de la ayuda explica qué valores recibe una función?`, options: [R`Arguments`, R`Value`, R`See Also`, R`References`], answer: 0 },
        ],
      },
    ],
    boss: {
      id: 'u1b', title: 'Examen Unidad 1', icon: '🏰', desc: R`Demuestra que dominas lo básico de R y RStudio.`,
      exercises: [
        { type: 'mc', q: R`¿Qué es RStudio?`, options: [R`Un IDE para trabajar con R`, R`Un paquete de R`, R`Una versión de R de pago`, R`Un servidor de CRAN`], answer: 0 },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`(10 + 2) / 4 ^ 2`, answers: [R`[1] 0.75`], explain: R`Primero la potencia (16), luego el paréntesis (12): 12 / 16 = 0.75.` },
        { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- 9
x <- x %% 4
x * 10`, answers: [R`[1] 10`] },
        { type: 'mc', q: R`¿Qué atajo ejecuta **todo** el script?`, options: [R`Ctrl + Shift + Enter`, R`Ctrl + Enter`, R`Alt + -`, R`Ctrl + L`], answer: 0 },
        { type: 'tf', q: R`«library(paquete)» descarga el paquete de Internet.`, answer: false, explain: R`Descargar = «install.packages()». «library()» solo lo carga.` },
        { type: 'mc', q: R`¿Qué nombre de variable sigue el estilo *snake_case*?`, options: [R`nota_media`, R`notaMedia`, R`NotaMedia`, R`nota.media`], answer: 0, mono: true },
        { type: 'code', q: R`Una tienda vende 3 camisetas a 12.5 € y 2 pantalones a 30 €. Guarda el total en «total» y el IVA (21% del total) en «iva».`, check: R`.eq(total, 97.5) && .eq(iva, 97.5 * 0.21)`, solution: R`total <- 3 * 12.5 + 2 * 30
iva <- total * 0.21`, hint: R`Calcula primero «total» y úsalo para «iva».` },
        { type: 'code', q: R`Guarda en «horas» y «minutos» cuántas horas completas y minutos sobrantes hay en 200 minutos (usa «%/%» y «%%»).`, check: R`.eq(horas, 3) && .eq(minutos, 20)`, solution: R`horas <- 200 %/% 60
minutos <- 200 %% 60`, hint: R`200 %/% 60 da las horas completas.` },
      ],
    },
  });
})();
