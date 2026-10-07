// Simulacro del examen final (todo el temario)
(function () {
  const R = String.raw;
  const TIENDA = R`tienda <- data.frame(
  fecha = as.Date("2026-11-02") + 0:9,
  canal = c("web", "tienda", "web", "app", "web", "tienda", "app", "web", "tienda", "app"),
  categoria = c("ropa", "hogar", "ropa", "tech", "tech", "ropa", "hogar", "ropa", "tech", "ropa"),
  importe = c(59.9, 120, 35.5, 899, 249, NA, 15.75, 80, 1299, 42),
  unidades = c(1, 2, 1, 1, 1, 3, 2, 2, 1, 1),
  devuelto = c(FALSE, FALSE, TRUE, FALSE, FALSE, FALSE, FALSE, TRUE, FALSE, FALSE)
)`;
  RA_UNITS.push({
    id: 'ex2', kind: 'exam', icon: '🏆', tema: 'Temas 1–6', short: 'Simulacro final', title: 'Simulacro Examen Final', color: '#2d3436',
    desc: R`El examen final vale el **60 %** (mínimo un 5): parte escrita (5 puntos) y parte en ordenador con Proctorio (5 puntos). Este simulacro repasa todo el temario.`,
    cheat: [
      [R`str(df); summary(df); colSums(is.na(df))`, R`Primer vistazo a los datos.`],
      [R`df[cond, cols]; subset(df, cond, select = ...)`, R`Filtrar en base R.`],
      [R`df |> filter() |> group_by() |> summarise()`, R`Filtrar y resumir con dplyr.`],
      [R`f <- function(x, ...) { ... }`, R`Encapsular lógica en funciones.`],
      [R`ggplot(df, aes(x, y)) + geom_...()`, R`Gráficos con ggplot2.`],
    ],
    lessons: [
      {
        id: 'ex2-a', title: 'Parte escrita', icon: '📝', desc: R`Todo el temario sin ordenador.`,
        exercises: [
          { type: 'output', q: R`¿Qué muestra R?`, code: R`x <- c(a = 3, b = 7, c = 1)
names(x)[x == max(x)]`, answers: [R`[1] "b"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`m <- matrix(1:6, nrow = 3)
sum(m[m %% 2 == 0])`, answers: [R`[1] 12`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`f <- function(v, k = 2) {
  r <- 0
  for (x in v) if (x > k) r <- r + x
  r
}
f(c(1, 4, 2, 6), k = 3)`, answers: [R`[1] 10`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`l <- list(n = 1:4, t = c("x", "y"))
length(l) * length(l$n) + nchar(paste(l$t, collapse = ""))`, answers: [R`[1] 10`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`ifelse(c(12, 5, 9) %% 3 == 0, "múltiplo", "no")`, answers: [R`[1] "múltiplo" "no"       "múltiplo"`] },
          { type: 'output', q: R`¿Qué muestra R?`, code: R`v <- c(5, NA, 15, 10)
round(mean(v, na.rm = TRUE) / sd(v, na.rm = TRUE), 2)`, answers: [R`[1] 2`] },
          { type: 'output', q: R`¿Qué imprime?`, code: R`i <- 1
total <- 0
repeat {
  total <- total + i^2
  if (total > 20) break
  i <- i + 1
}
c(i, total)`, answers: [R`[1]  4 30`] },
          { type: 'mc', q: R`¿Qué hace «df |> group_by(canal) |> summarise(n = n())»?`, options: [R`Cuenta cuántas filas hay de cada canal`, R`Suma la columna canal`, R`Ordena por canal`, R`Elimina los canales repetidos del data frame original`], answer: 0 },
          { type: 'mc', q: R`¿Qué opción de chunk muestra el resultado de un gráfico pero oculta el código en el informe?`, options: [R`echo = FALSE`, R`eval = FALSE`, R`include = FALSE`, R`results = "hide"`], answer: 0, mono: true },
          { type: 'mc', q: R`Hay que leer «datos.csv» con separador «;» y decimal «,». ¿Qué instrucción es correcta?`, options: [R`read.csv("datos.csv", sep = ";", dec = ",")`, R`read.csv("datos.csv", dec = ";", sep = ",")`, R`read.table(datos.csv)`, R`write.csv("datos.csv", sep = ";")`], answer: 0, mono: true },
          { type: 'tf', q: R`Una correlación de −0.9 entre dos variables indica una relación lineal fuerte.`, answer: true, explain: R`El signo indica la dirección; el valor absoluto, la fuerza.` },
          { type: 'mc', q: R`¿Qué gráfico de ggplot2 es adecuado para ver la distribución de «importe» según «canal»?`, options: [R`ggplot(df, aes(x = canal, y = importe)) + geom_boxplot()`, R`ggplot(df, aes(x = importe)) + geom_bar()`, R`ggplot(df, aes(x = canal)) + geom_line()`, R`ggplot(df, aes(x = canal, y = importe)) + geom_histogram()`], answer: 0, mono: true },
        ],
      },
      {
        id: 'ex2-b', title: 'Parte en ordenador', icon: '💻', desc: R`Análisis completo como con Proctorio.`, packages: ['dplyr', 'ggplot2'],
        exercises: [
          { type: 'code', q: R`**Ej. 1.** Con «tienda» cargado: guarda en «n_na» los NA de «importe», en «tienda_ok» el data frame sin esa fila, y en «ingreso» la suma de importe × unidades de los pedidos **no devueltos** de «tienda_ok».`, setup: TIENDA, check: R`.eq(n_na, 1) && nrow(tienda_ok) == 9 && .eq(ingreso, sum(c(59.9*1, 120*2, 899, 249, 15.75*2, 1299, 42)))`, solution: R`n_na <- sum(is.na(tienda$importe))
tienda_ok <- tienda[!is.na(tienda$importe), ]
ingreso <- sum(tienda_ok$importe[!tienda_ok$devuelto] * tienda_ok$unidades[!tienda_ok$devuelto])`, hint: R`Filtra con «!is.na()» y después con «!devuelto».` },
          { type: 'code', q: R`**Ej. 2 (función).** Crea «gastos_envio(importe, canal)»: 0 si el importe ≥ 100; si no, 3.5 para "web", 2 para "app" y 0 para "tienda". Aplícala a cada fila de «tienda_ok» (con un for o con «mapply») y guarda los resultados en la columna «envio».`, setup: R`${TIENDA}
tienda_ok <- tienda[!is.na(tienda$importe), ]`, check: R`is.function(gastos_envio) && .eq(gastos_envio(150, "web"), 0) && .eq(gastos_envio(20, "app"), 2) && .eq(tienda_ok$envio, c(3.5, 0, 3.5, 0, 0, 2, 3.5, 0, 2))`, solution: R`gastos_envio <- function(importe, canal) {
  if (importe >= 100) {
    0
  } else if (canal == "web") {
    3.5
  } else if (canal == "app") {
    2
  } else {
    0
  }
}
tienda_ok$envio <- 0
for (i in 1:nrow(tienda_ok)) {
  tienda_ok$envio[i] <- gastos_envio(tienda_ok$importe[i], tienda_ok$canal[i])
}`, hint: R`Crea la columna a 0 y rellénala con un for por filas.` },
          { type: 'code', q: R`**Ej. 3 (dplyr).** Con «tienda» y dplyr: guarda en «resumen» por «categoria» (solo pedidos no devueltos y con importe no NA): «pedidos» (n), «ingreso» (suma de importe × unidades) y «ticket_medio» (media de importe), ordenado por ingreso descendente.`, setup: R`library(dplyr)
${TIENDA}`, check: R`identical(resumen$categoria, c("tech", "hogar", "ropa")) && .eq(resumen$pedidos, c(3, 2, 2)) && .eq(resumen$ingreso, c(899 + 249 + 1299, 240 + 31.5, 59.9 + 42))`, solution: R`resumen <- tienda |>
  filter(!devuelto, !is.na(importe)) |>
  group_by(categoria) |>
  summarise(pedidos = n(),
            ingreso = sum(importe * unidades),
            ticket_medio = mean(importe)) |>
  arrange(desc(ingreso))`, hint: R`filter(!devuelto, !is.na(importe)) → group_by → summarise → arrange(desc()).` },
          { type: 'code', q: R`**Ej. 4 (EDA).** Con «tienda» cargado: guarda en «freq_canal» la tabla de frecuencias de «canal», en «mediana» la mediana de importe (sin NA) y en «atipicos» los importes atípicos según «boxplot.stats».`, setup: TIENDA, check: R`.eq(as.vector(freq_canal), c(3, 3, 4)) && .eq(mediana, median(tienda$importe, na.rm = TRUE)) && .eq(atipicos, boxplot.stats(tienda$importe)$out)`, solution: R`freq_canal <- table(tienda$canal)
mediana <- median(tienda$importe, na.rm = TRUE)
atipicos <- boxplot.stats(tienda$importe)$out`, hint: R`«boxplot.stats(x)$out» ignora los NA.` },
          { type: 'code', q: R`**Ej. 5 (ggplot2).** Guarda en «p» un gráfico de barras con el **número de pedidos por canal** («geom_bar») de «tienda», con relleno según «categoria» y título "Pedidos por canal".`, setup: R`library(ggplot2)
${TIENDA}`, check: R`inherits(p, "ggplot") && inherits(p$layers[[1]]$geom, "GeomBar") && rlang::as_label(p$mapping$x) == "canal" && !is.null(p$mapping$fill) && identical(p$labels$title, "Pedidos por canal")`, solution: R`p <- ggplot(tienda, aes(x = canal, fill = categoria)) +
  geom_bar() +
  labs(title = "Pedidos por canal")
p`, hint: R`«geom_bar()» solo necesita x; el relleno va en «aes(fill = categoria)».` },
        ],
      },
    ],
  });
})();
