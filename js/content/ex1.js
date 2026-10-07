// Simulacro del Parcial 1 (Temas 1–3): parte escrita y parte en ordenador (estilo Proctorio)
(function () {
  const R = String.raw;
  const PEDIDOS = R`pedidos <- data.frame(
  id = 1:8,
  cliente = c("jlopez", "amartin", "jlopez", "cruiz", "amartin", "pgarcia", "cruiz", "jlopez"),
  producto = c("Teclado", "Ratón", "Monitor", "Teclado", "Cable", "Monitor", "Ratón", "Cable"),
  importe = c(37.25, 15, 180, 37.25, 5, 175, 15, 5),
  cantidad = c(2, 1, 1, 1, 4, 2, 3, 6),
  pagado = c(TRUE, TRUE, FALSE, TRUE, TRUE, FALSE, TRUE, TRUE)
)`;
  RA_UNITS.push({
    id: 'ex1', kind: 'exam', tema: 'Temas 1–3', short: 'Simulacro P1', title: 'Simulacro Parcial 1', color: '#7c4dff',
    desc: R`Preparación para el **Parcial 1 (15 %)**: una parte escrita (predecir resultados) y otra en ordenador como con Proctorio. Necesitas un 80 % para superarlo.`,
    cheat: [
      [R`v[!is.na(v) & v > 5]`, R`Filtrar no faltantes que cumplen una condición.`],
      [R`m["fila", "col"] <- valor`, R`Modificar una matriz por nombre.`],
      [R`df[df$a >= 6 & df$b >= 80, ]`, R`Filtrar filas de un data frame.`],
      [R`df[cond, c("x", "y")]`, R`Filtrar y elegir columnas.`],
      [R`mean(df$x[cond])`, R`Media de un subgrupo.`],
      [R`df[order(df$x), ]`, R`Ordenar un data frame.`],
      [R`for (...) { if (...) {...} else if (...) {...} else {...} }`, R`Bucle con clasificación.`],
    ],
    lessons: [
      {
        id: 'ex1-a', title: 'Parte escrita', icon: '📝', desc: R`Predice resultados y detecta errores, sin ejecutar.`,
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(12, NA, 7, 3, NA, 15)
v[!is.na(v) & v > 5]`, answers: [R`[1] 12  7 15`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c(TRUE, 4, "5")
x[2]`, answers: [R`[1] "4"`], explain: R`Hay un texto, así que todo el vector se convierte a carácter.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- seq(3, 30, by = 3)
v[c(-1, -length(v))][2]`, answers: [R`[1] 9`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:12, nrow = 4, byrow = TRUE)
m[3, ] + m[, 2][1]`, answers: [R`[1]  9 10 11`], explain: R`La fila 3 es 7 8 9; «m[, 2][1]» es 2. Se suma 2 a cada elemento.` },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`l <- list(a = c(3, 6), b = list(c = "hola"))
length(l$a) + nchar(l$b$c)`, answers: [R`[1] 6`] },
          { type: 'output', q: R`¿Qué muestra R?`, setup: PEDIDOS, code: R`sum(pedidos$pagado == FALSE)`, answers: [R`[1] 2`] },
          { type: 'output', q: R`¿Qué muestra R?`, setup: PEDIDOS, code: R`pedidos[pedidos$importe > 100 & pedidos$pagado, "cliente"]`, answers: [R`character(0)`], explain: R`Los dos pedidos de más de 100 € no están pagados: el resultado es un vector vacío.` },
          { type: 'output', q: R`¿Qué imprime?`, code: R`contador <- 0
for (palabra in c("R", "Studio", "CUNEF", "datos")) {
  if (nchar(palabra) >= 5) {
    contador <- contador + 2
  } else if (nchar(palabra) == 1) {
    contador <- contador * 10
  } else {
    contador <- contador - 1
  }
}
print(contador)`, answers: [R`[1] 6`], explain: R`R: 0·10 = 0; Studio: +2 → 2; CUNEF: +2 → 4; datos: +2 → 6.` },
          { type: 'output', q: R`¿Qué imprime?`, code: R`i <- 10
s <- 0
while (i > 0) {
  if (i %% 4 == 0) {
    i <- i - 3
    next
  }
  s <- s + i
  i <- i - 2
}
s`, answers: [R`[1] 19`], explain: R`i=10 → s=10, i=8 · i=8 (múltiplo de 4) → i=5 · i=5 → s=15, i=3 · i=3 → s=18, i=1 · i=1 → s=19, i=−1 y el bucle termina.` },
          { type: 'mc', q: R`¿Cuál de estas instrucciones **no** devuelve la columna «importe» como vector?`, options: [R`pedidos["importe"]`, R`pedidos$importe`, R`pedidos[, "importe"]`, R`pedidos[["importe"]]`], answer: 0, mono: true, explain: R`«pedidos["importe"]» devuelve un **data frame** de una columna.` },
          { type: 'mc', q: R`¿Qué error tiene este código?`, code: R`notas <- c(5, 8, 3)
if (notas > 4) {
  print("aprobado")
}`, options: [R`La condición del if tiene 3 valores, no uno: R da error`, R`Falta el else`, R`«print» no se puede usar en un if`, R`No tiene ningún error`], answer: 0, explain: R`Desde R 4.2, una condición de longitud > 1 en un «if» da error. Hay que recorrer con un for o usar «all()/any()».` },
          { type: 'tf', q: R`«apply(m, 1, mean)» calcula la media de cada columna de la matriz «m».`, answer: false, explain: R`El 1 es por **filas**; el 2, por columnas.` },
        ],
      },
      {
        id: 'ex1-b', title: 'Parte en ordenador', icon: '💻', desc: R`Programa como en el examen con Proctorio.`,
        exercises: [
          { type: 'code', q: R`**Ej. 1 (vectores).** Con «temperaturas» cargado: guarda en «validas» las temperaturas no faltantes, en «calurosos» cuántos días (no faltantes) superaron los 30 grados, en «media» la media sin NA redondeada a 1 decimal y en «semana2» las temperaturas de los días 8 a 14.`, setup: R`temperaturas <- c(28, 31, NA, 33, 29, 35, 30, 27, NA, 32, 34, 26, 31, 30)`, check: R`.eq(validas, temperaturas[!is.na(temperaturas)]) && .eq(calurosos, 6) && .eq(media, round(mean(temperaturas, na.rm = TRUE), 1)) && identical(semana2, temperaturas[8:14])`, solution: R`validas <- temperaturas[!is.na(temperaturas)]
calurosos <- sum(validas > 30)
media <- round(mean(temperaturas, na.rm = TRUE), 1)
semana2 <- temperaturas[8:14]`, hint: R`Para contar usa «sum()» de una condición sobre los valores válidos.` },
          { type: 'code', q: R`**Ej. 2 (matrices).** Crea la matriz «ventas» con «datos» por filas (3 vendedores × 4 meses). Nombra filas "Ana", "Luis", "Marta" y columnas "Ene", "Feb", "Mar", "Abr". Corrige la venta de Luis en Mar a 410. Guarda en «total_vend» el total por vendedor (apply) y en «media_ene_abr» la media conjunta de enero y abril.`, setup: R`datos <- c(320, 280, 350, 400,
           290, 310, 300, 330,
           410, 390, 420, 380)`, check: R`identical(dim(ventas), c(3L, 4L)) && .eq(ventas["Luis", "Mar"], 410) && .eq(total_vend, c(1350, 1340, 1600)) && .eq(media_ene_abr, mean(c(320, 290, 410, 400, 330, 380)))`, solution: R`ventas <- matrix(datos, nrow = 3, byrow = TRUE)
rownames(ventas) <- c("Ana", "Luis", "Marta")
colnames(ventas) <- c("Ene", "Feb", "Mar", "Abr")
ventas["Luis", "Mar"] <- 410
total_vend <- apply(ventas, 1, sum)
media_ene_abr <- mean(ventas[, c("Ene", "Abr")])`, hint: R`Corrige el dato **antes** de calcular los totales.` },
          { type: 'code', q: R`**Ej. 3 (data frames).** Con «pedidos» cargado: añade la columna «total» (importe × cantidad); guarda en «pendientes» los pedidos **no pagados**; en «jlopez» el producto y total de los pedidos de "jlopez"; en «media_pagados» el total medio de los pagados; y en «top» el data frame ordenado por total de mayor a menor.`, setup: PEDIDOS, check: R`.eq(pedidos$total, pedidos$importe * pedidos$cantidad) && identical(pendientes$id, c(3L, 6L)) && identical(names(jlopez), c("producto", "total")) && .eq(jlopez$total, c(74.5, 180, 30)) && .eq(media_pagados, mean(c(74.5, 15, 37.25, 20, 45, 30))) && identical(top$id[1:2], c(6L, 3L))`, solution: R`pedidos$total <- pedidos$importe * pedidos$cantidad
pendientes <- pedidos[pedidos$pagado == FALSE, ]
jlopez <- pedidos[pedidos$cliente == "jlopez", c("producto", "total")]
media_pagados <- mean(pedidos$total[pedidos$pagado])
top <- pedidos[order(pedidos$total, decreasing = TRUE), ]`, hint: R`Crea primero la columna «total»; el resto la usa.` },
          { type: 'code', q: R`**Ej. 4 (subset).** Con «pedidos» cargado, usa «subset» para guardar en «grandes» el cliente, producto e importe de los pedidos con importe mayor que 30 **o** cantidad de al menos 4.`, setup: PEDIDOS, check: R`identical(names(grandes), c("cliente", "producto", "importe")) && identical(rownames(grandes), c("1", "3", "4", "5", "6", "8"))`, solution: R`grandes <- subset(pedidos, importe > 30 | cantidad >= 4,
                  select = c(cliente, producto, importe))`, hint: R`«subset(datos, condición, select = c(...))».` },
          { type: 'code', q: R`**Ej. 5 (condicionales).** Escribe el sistema de envíos: con «total_compra» y «premium» cargados, guarda en «envio» 0 si es premium **o** la compra supera 50 €; 2.99 si la compra está entre 20 y 50 (incluidos); y 5.99 en otro caso.`, setup: R`total_compra <- 35
premium <- FALSE`, check: R`.eq(envio, 2.99)`, solution: R`if (premium | total_compra > 50) {
  envio <- 0
} else if (total_compra >= 20 & total_compra <= 50) {
  envio <- 2.99
} else {
  envio <- 5.99
}`, hint: R`Primero el caso gratis (premium o > 50).` },
          { type: 'code', q: R`**Ej. 6 (bucles).** Con «pedidos» cargado, recorre las filas con un for y calcula: «facturado» (suma de importe × cantidad de los pagados) y «n_monitores» (cuántos pedidos son de "Monitor"). No uses «sum» sobre columnas.`, setup: PEDIDOS, check: R`.eq(facturado, 74.5 + 15 + 37.25 + 20 + 45 + 30) && .eq(n_monitores, 2)`, solution: R`facturado <- 0
n_monitores <- 0
for (i in 1:nrow(pedidos)) {
  if (pedidos$pagado[i]) {
    facturado <- facturado + pedidos$importe[i] * pedidos$cantidad[i]
  }
  if (pedidos$producto[i] == "Monitor") {
    n_monitores <- n_monitores + 1
  }
}`, hint: R`«for (i in 1:nrow(pedidos))» y accede con «pedidos$columna[i]».` },
          { type: 'code', q: R`**Ej. 7 (bucle + vector).** Recorre «v» y crea «resultado» donde cada elemento par se divide entre 2 y cada impar se multiplica por 3 y se le suma 1.`, setup: R`v <- c(4, 7, 10, 3, 8)`, check: R`.eq(resultado, c(2, 22, 5, 10, 4))`, solution: R`resultado <- c()
for (x in v) {
  if (x %% 2 == 0) {
    resultado <- c(resultado, x / 2)
  } else {
    resultado <- c(resultado, 3 * x + 1)
  }
}`, hint: R`Vector vacío y añade en cada vuelta.` },
        ],
      },
    ],
  });
})();
