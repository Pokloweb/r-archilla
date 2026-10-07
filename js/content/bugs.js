// Cazabugs: código con los errores más típicos de R. El alumno tiene que arreglarlo.
// Cada ejercicio es de tipo 'code' con bug: true; el código de partida (starter) falla a propósito.
(function () {
  const R = String.raw;
  const DF = R`df <- data.frame(
  nombre = c("Ana", "Luis", "Marta", "Pablo"),
  nota = c(7, 4, 9, 6),
  ciudad = c("Madrid", "Toledo", "Madrid", "Segovia")
)`;
  const bug = (o) => ({ type: 'code', bug: true, ...o, q: o.q });
  RA_UNITS.push({
    id: 'bugs', kind: 'extra', tema: 'Todos', icon: '🐞', short: 'Cazabugs', title: 'Cazabugs', color: '#ff4b4b',
    lessons: [{
      id: 'bugs1', title: 'Cazabugs',
      exercises: [
        bug({ q: R`Este código debería guardar en «media» la media de las notas aprobadas, pero da error. Arréglalo.`, setup: R`notas <- c(3, 7, 5, 9, 4)`,
          starter: R`media <- mean(notas[notas >= 5]`, solution: R`media <- mean(notas[notas >= 5])`, check: R`.eq(media, 7)`,
          hint: R`Cuenta los paréntesis: cada «(» necesita su «)».`, explain: R`Faltaba cerrar el paréntesis de «mean(». R da *unexpected end of input*.` }),
        bug({ q: R`Debería calcular el máximo de «notas», pero R dice que el objeto no existe.`, setup: R`notas <- c(3, 7, 5, 9, 4)`,
          starter: R`maximo <- max(Notas)`, solution: R`maximo <- max(notas)`, check: R`.eq(maximo, 9)`,
          hint: R`Mira las mayúsculas.`, explain: R`R distingue mayúsculas: «Notas» y «notas» son objetos distintos (*object 'Notas' not found*).` }),
        bug({ q: R`Debería guardar en «resultado» "aprobado" si «nota» es 5, pero da error.`, setup: R`nota <- 5`,
          starter: R`if (nota = 5) {
  resultado <- "aprobado"
}`, solution: R`if (nota == 5) {
  resultado <- "aprobado"
}`, check: R`identical(resultado, "aprobado")`,
          hint: R`Para comparar se usan dos signos.`, explain: R`«=» asigna; para comparar hace falta «==».` }),
        bug({ q: R`Debería quedarse con las filas de «df» con nota mayor que 5, pero da *undefined columns selected*.`, setup: DF,
          starter: R`aprobados <- df[df$nota > 5]`, solution: R`aprobados <- df[df$nota > 5, ]`, check: R`identical(aprobados$nombre, c("Ana", "Marta", "Pablo"))`,
          hint: R`En un data frame, ¿dónde va la condición de las filas?`, explain: R`Faltaba la coma: «df[filas, columnas]». Sin ella R busca columnas.` }),
        bug({ q: R`Debería filtrar las filas de Madrid, pero R no encuentra «ciudad».`, setup: DF,
          starter: R`madrid <- df[ciudad == "Madrid", ]`, solution: R`madrid <- df[df$ciudad == "Madrid", ]`, check: R`identical(madrid$nombre, c("Ana", "Marta"))`,
          hint: R`Dentro de los corchetes, R no sabe que «ciudad» es una columna de «df».`, explain: R`Hay que escribir «df$ciudad». (Con «subset()» o dplyr sí basta el nombre de la columna).` }),
        bug({ q: R`Debería sumar todo el vector «v» con un bucle, pero el resultado sale 5 en vez de 15.`, setup: R`v <- c(1, 2, 3, 4, 5)`,
          starter: R`for (x in v) {
  suma <- 0
  suma <- suma + x
}`, solution: R`suma <- 0
for (x in v) {
  suma <- suma + x
}`, check: R`.eq(suma, 15)`,
          hint: R`¿Cuántas veces se pone «suma» a 0?`, explain: R`El acumulador se inicializa **fuera** del bucle; dentro se reiniciaba en cada vuelta.` }),
        bug({ q: R`Debería calcular el factorial de 5 en «fact», pero siempre sale 0.`,
          starter: R`fact <- 0
for (i in 1:5) {
  fact <- fact * i
}`, solution: R`fact <- 1
for (i in 1:5) {
  fact <- fact * i
}`, check: R`.eq(fact, 120)`,
          hint: R`¿Qué pasa al multiplicar por 0?`, explain: R`Un producto acumulado empieza en 1, no en 0.` }),
        bug({ q: R`Debería guardar en «ciudades» un vector de texto, pero da error.`,
          starter: R`ciudades <- c(Madrid, Toledo, Cádiz)`, solution: R`ciudades <- c("Madrid", "Toledo", "Cádiz")`, check: R`identical(ciudades, c("Madrid", "Toledo", "Cádiz"))`,
          hint: R`¿Cómo se escribe un texto en R?`, explain: R`Sin comillas, R cree que «Madrid» es una variable y no la encuentra.` }),
        bug({ q: R`Debería guardar en «ultimo» el último elemento de «v», pero da error.`, setup: R`v <- c(4, 8, 15, 16, 23, 42)`,
          starter: R`ultimo <- v[length]`, solution: R`ultimo <- v[length(v)]`, check: R`.eq(ultimo, 42)`,
          hint: R`«length» es una función: necesita paréntesis y saber de qué vector.`, explain: R`«length» a secas es la función, no un número. Hay que llamarla: «length(v)».` }),
        bug({ q: R`Debería guardar en «media» la media de «ventas», pero sale NA.`, setup: R`ventas <- c(120, NA, 85, 140)`,
          starter: R`media <- mean(ventas)`, solution: R`media <- mean(ventas, na.rm = TRUE)`, check: R`.eq(media, mean(c(120, 85, 140)))`,
          hint: R`Hay un dato que falta.`, explain: R`Cualquier operación con NA da NA: usa «na.rm = TRUE».` }),
        bug({ q: R`Debería crear «etiqueta» con el texto "Nota: 7", pero da *non-numeric argument to binary operator*.`, setup: R`nota <- 7`,
          starter: R`etiqueta <- "Nota: " + nota`, solution: R`etiqueta <- paste("Nota:", nota)`, check: R`identical(etiqueta, "Nota: 7")`,
          hint: R`En R los textos no se unen con «+».`, explain: R`Para unir texto se usa «paste()» (o «paste0()» sin espacio).` }),
        bug({ q: R`Debería sumar cada fila de «m», pero da error de dimensiones.`, setup: R`m <- matrix(1:6, nrow = 2, byrow = TRUE)`,
          starter: R`sumas <- apply(m, 3, sum)`, solution: R`sumas <- apply(m, 1, sum)`, check: R`.eq(sumas, c(6, 15))`,
          hint: R`En «apply», ¿qué número significa filas?`, explain: R`MARGIN = 1 son filas y 2 son columnas. Una matriz no tiene dimensión 3.` }),
        bug({ q: R`Debería guardar en «resultado» si cada nota de «df» es apta, pero da *the condition has length > 1*.`, setup: DF,
          starter: R`resultado <- c()
for (i in 1:nrow(df)) {
  if (df$nota >= 5) {
    resultado <- c(resultado, "apto")
  } else {
    resultado <- c(resultado, "no apto")
  }
}`, solution: R`resultado <- c()
for (i in 1:nrow(df)) {
  if (df$nota[i] >= 5) {
    resultado <- c(resultado, "apto")
  } else {
    resultado <- c(resultado, "no apto")
  }
}`, check: R`identical(resultado, c("apto", "no apto", "apto", "apto"))`,
          hint: R`Dentro del bucle hay que mirar solo la nota de la fila «i».`, explain: R`«df$nota» es el vector entero; en un «if» hace falta un solo valor: «df$nota[i]».` }),
        bug({ q: R`Debería añadir la columna «curso» a «df», pero da *replacement has 3 rows, data has 4*.`, setup: DF,
          starter: R`df$curso <- c(1, 2, 3)`, solution: R`df$curso <- c(1, 2, 1, 2)`, check: R`.eq(df$curso, c(1, 2, 1, 2))`,
          hint: R`Una columna nueva necesita un valor por fila.`, explain: R`El vector debe tener tantos elementos como filas tiene el data frame (4).` }),
        bug({ q: R`Debería añadir a Gorka (nota 8, Bilbao) a «df», pero después la columna «nota» deja de ser numérica.`, setup: DF,
          starter: R`df <- rbind(df, c("Gorka", 8, "Bilbao"))`, solution: R`df <- rbind(df, data.frame(nombre = "Gorka", nota = 8, ciudad = "Bilbao"))`, check: R`nrow(df) == 5 && is.numeric(df$nota) && .eq(df$nota[5], 8)`,
          hint: R`«c()» con texto y números lo convierte todo a texto (coerción).`, explain: R`Hay que añadir la fila como un «data.frame» con las mismas columnas, para conservar los tipos.` }),
        bug({ q: R`Debería guardar en «mayor» la nota más alta usando «sort», pero sale vacío.`, setup: R`notas <- c(6, 9, 4, 7)`,
          starter: R`mayor <- sort(notas, decreasing = TRUE)[0]`, solution: R`mayor <- sort(notas, decreasing = TRUE)[1]`, check: R`.eq(mayor, 9)`,
          hint: R`¿En qué número empiezan los índices en R?`, explain: R`En R los índices empiezan en 1; «v[0]» devuelve un vector vacío.` }),
        bug({ q: R`Debería usar «subset» para quedarse con los de Madrid con nota mayor que 6, pero da error.`, setup: DF,
          starter: R`res <- subset(df, nota > 6 & ciudad = "Madrid")`, solution: R`res <- subset(df, nota > 6 & ciudad == "Madrid")`, check: R`identical(res$nombre, c("Ana", "Marta"))`,
          hint: R`Otra vez: comparar no es asignar.`, explain: R`Dentro de la condición hace falta «==».` }),
        bug({ q: R`La función «area» debería calcular el área de un círculo de radio «r», pero da *object 'radio' not found*.`,
          starter: R`area <- function(r) {
  pi * radio^2
}
a <- area(2)`, solution: R`area <- function(r) {
  pi * r^2
}
a <- area(2)`, check: R`.eq(a, pi * 4)`,
          hint: R`Dentro de la función, ¿cómo se llama el argumento?`, explain: R`Una función usa sus **argumentos**: aquí se llama «r», no «radio».` }),
        bug({ q: R`Este «if / else» da *unexpected 'else'* al ejecutarlo. Arréglalo para que guarde "par" o "impar" en «tipo».`, setup: R`n <- 7`,
          starter: R`if (n %% 2 == 0) {
  tipo <- "par"
}
else {
  tipo <- "impar"
}`, solution: R`if (n %% 2 == 0) {
  tipo <- "par"
} else {
  tipo <- "impar"
}`, check: R`identical(tipo, "impar")`,
          hint: R`¿Dónde tiene que ir el «else» respecto a la llave que cierra el «if»?`, explain: R`El «else» debe ir en la misma línea que la «}» del if: «} else {». Si no, R cree que el «if» ya terminó.` }),
        bug({ q: R`Debería ordenar «df» de mayor a menor nota, pero da error.`, setup: DF,
          starter: R`ordenado <- sort(df, df$nota, decreasing = TRUE)`, solution: R`ordenado <- df[order(df$nota, decreasing = TRUE), ]`, check: R`identical(ordenado$nombre, c("Marta", "Ana", "Pablo", "Luis"))`,
          hint: R`«sort» es para vectores. Para un data frame se usa otra función dentro de los corchetes.`, explain: R`Para ordenar un data frame: «df[order(df$col, decreasing = TRUE), ]».` }),
      ],
    }],
  });
})();
