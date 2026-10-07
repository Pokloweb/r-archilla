// Traductor de errores: explica en español los mensajes de error y avisos más comunes de R.
(function () {
  const RULES = [
    [/object '([^']+)' not found/, (m) => `No existe ningún objeto llamado «${m[1]}». ¿Lo has creado antes de usarlo? Revisa mayúsculas/minúsculas, y si es un texto, ponlo entre comillas: «"${m[1]}"». Dentro de «df[...]» las columnas se escriben «df$${m[1]}».`],
    [/could not find function "([^"]+)"/, (m) => `La función «${m[1]}» no existe. Revisa cómo se escribe; si es de un paquete (dplyr, ggplot2…), cárgalo antes con «library()».`],
    [/unexpected end of input/, () => 'Al código le falta algo al final: casi siempre un paréntesis «)», una llave «}» o unas comillas sin cerrar.'],
    [/unexpected 'else'/, () => 'El «else» tiene que ir en la misma línea que la llave que cierra el «if»: «} else {».'],
    [/unexpected '\)'/, () => 'Sobra un paréntesis de cierre «)». Cuenta los paréntesis que abres y cierras.'],
    [/unexpected '\}'/, () => 'Sobra una llave de cierre «}», o falta la que abre el bloque.'],
    [/unexpected '='/, () => 'Hay un «=» donde R no lo espera. Para comparar se usa «==».'],
    [/unexpected (symbol|string constant|numeric constant)/, () => 'Hay dos cosas seguidas sin nada entre ellas: suele faltar una coma «,» entre argumentos, un operador (+, *, <-…) o cerrar un paréntesis antes.'],
    [/unexpected '([^']+)'/, (m) => `R no esperaba «${m[1]}» en ese punto: revisa la sintaxis justo antes (paréntesis, comas, llaves).`],
    [/non-numeric argument to binary operator/, () => 'Estás haciendo una operación matemática (+, -, *, /) con un texto. Comprueba con «class()» que los datos son números; para unir textos usa «paste()».'],
    [/non-numeric argument to mathematical function/, () => 'Una función matemática (sqrt, log, round…) ha recibido un texto. Convierte antes con «as.numeric()».'],
    [/undefined columns selected/, () => 'Estás pidiendo columnas que no existen. Si querías filtrar filas, te falta la coma: «df[condición, ]». Si no, revisa el nombre de la columna.'],
    [/subscript out of bounds/, () => 'Pides una posición que no existe (por ejemplo la fila 5 de una matriz de 3 filas, o un elemento de una lista que no está).'],
    [/incorrect number of dimensions/, () => 'Usas «[fila, columna]» sobre algo que no tiene dos dimensiones (por ejemplo un vector). En un vector se usa «v[i]».'],
    [/the condition has length > 1/, () => 'La condición del «if» tiene varios valores. «if» necesita un único TRUE/FALSE: dentro de un bucle usa «v[i]», o usa «ifelse()», «any()» o «all()».'],
    [/missing value where TRUE\/FALSE needed/, () => 'La condición del «if» o «while» vale NA. Comprueba si hay valores faltantes («is.na()») o una variable sin valor.'],
    [/argument is of length zero/, () => 'La condición del «if» está vacía (longitud 0): seguramente usas una columna o elemento que no existe.'],
    [/replacement has (\d+) rows?, data has (\d+)/, (m) => `La columna nueva tiene ${m[1]} valores pero el data frame tiene ${m[2]} filas: deben coincidir.`],
    [/arguments imply differing number of rows: ([\d, ]+)/, (m) => `Al crear el data frame, las columnas tienen distinta longitud (${m[1]}). Todas deben tener el mismo número de elementos.`],
    [/names do not match previous names/, () => 'En «rbind()» la fila nueva debe tener exactamente las mismas columnas (mismos nombres) que el data frame.'],
    [/dim\(X\) must have a positive length/, () => '«apply()» necesita una matriz o data frame. Para un vector usa «sapply()» o la función directamente.'],
    [/invalid 'type' \(character\) of argument/, () => 'Intentas sumar o calcular con un vector de texto. Comprueba el tipo con «class()».'],
    [/'x' must be numeric/, () => 'La función necesita números y le has dado otra cosa (texto o factor).'],
    [/argument "([^"]+)" is missing, with no default/, (m) => `Falta el argumento «${m[1]}» al llamar a la función.`],
    [/unused argument/, () => 'Has pasado un argumento que la función no acepta: revisa su nombre (por ejemplo «decreasing», «na.rm», «by») con «?función».'],
    [/NAs introduced by coercion/, () => 'Aviso: algunos valores no se han podido convertir a número y han quedado como NA (por ejemplo "hola" o "12,5" con coma decimal).'],
    [/longer object length is not a multiple of shorter object length/, () => 'Aviso: operas dos vectores de longitudes que no encajan; R ha reciclado el corto y el resultado probablemente no es el que buscas.'],
    [/number of columns of result is not a multiple of vector length/, () => 'Aviso: el vector que añades no tiene tantos elementos como columnas. R lo ha reciclado.'],
    [/argument is not numeric or logical: returning NA/, () => 'Aviso: has calculado una media (u otra medida) sobre algo que no es numérico, por eso sale NA.'],
    [/there is no package called '([^']+)'/, (m) => `El paquete «${m[1]}» no está instalado. En RStudio: «install.packages("${m[1]}")».`],
  ];

  // Devuelve un bloque HTML con las explicaciones de los errores/avisos encontrados, o ''.
  function explain(lines) {
    const msgs = [];
    const seen = new Set();
    const text = (lines || []).filter((l) => l.kind === 'error' || l.kind === 'warn').map((l) => l.text).join('\n');
    if (!text) return '';
    for (const [re, fn] of RULES) {
      const m = text.match(re);
      if (m && !seen.has(re)) { seen.add(re); msgs.push(fn(m)); }
      if (msgs.length >= 2) break;
    }
    if (!msgs.length) return '';
    return `<div class="err-help"><b>🩺 Qué significa:</b><ul>${msgs.map((t) => `<li>${UI.inline(t)}</li>`).join('')}</ul></div>`;
  }

  window.RErrors = { explain };
})();
