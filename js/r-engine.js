// Motor R de R Archilla: R real (webR, R compilado a WebAssembly) dentro del navegador.
// Expone window.REngine con: ready (promesa), status, run(), grade(), install(), consola persistente.

const WEBR_URL = 'https://webr.r-wasm.org/v0.6.0/webr.mjs';

// Marcas de línea en la salida: \x01 eco del comando, \x02 error, \x03 aviso/mensaje.
const R_HELPERS = String.raw`
.ra_mark <- function(mark, txt) {
  lines <- strsplit(txt, "\n", fixed = TRUE)[[1]]
  if (length(lines) == 0) lines <- ""
  cat(paste0(mark, lines, "\n"), sep = "")
}
.ra_run <- function(code, env, echo = TRUE) {
  exprs <- tryCatch(parse(text = code, keep.source = TRUE), error = function(e) e)
  if (inherits(exprs, "error")) {
    .ra_mark("\x02", paste0("Error: ", conditionMessage(exprs)))
    return(invisible(FALSE))
  }
  srcs <- attr(exprs, "srcref")
  for (i in seq_along(exprs)) {
    if (echo) {
      src <- if (!is.null(srcs)) as.character(srcs[[i]]) else deparse(exprs[[i]])
      cat(paste0("\x01", c("> ", rep("+ ", length(src) - 1)), src, "\n"), sep = "")
    }
    ok <- tryCatch({
      withCallingHandlers({
        res <- withVisible(eval(exprs[[i]], envir = env))
        if (res$visible) print(res$value)
        TRUE
      }, warning = function(w) {
        .ra_mark("\x03", paste0("Warning message:\n", conditionMessage(w)))
        invokeRestart("muffleWarning")
      }, message = function(m) {
        .ra_mark("\x03", sub("\n$", "", conditionMessage(m)))
        invokeRestart("muffleMessage")
      })
    }, error = function(e) {
      call <- conditionCall(e)
      msg <- conditionMessage(e)
      if (!is.null(call) && !identical(deparse(call)[1], "eval(exprs[[i]], envir = env)")) {
        .ra_mark("\x02", paste0("Error in ", deparse(call)[1], " : ", msg))
      } else {
        .ra_mark("\x02", paste0("Error: ", msg))
      }
      FALSE
    })
    if (!isTRUE(ok)) return(invisible(FALSE))
  }
  invisible(TRUE)
}
.ra_new_env <- function() new.env(parent = globalenv())
.ra_env_summary <- function(env) {
  nms <- sort(ls(env))
  vapply(nms, function(n) {
    v <- get(n, envir = env)
    d <- tryCatch(
      trimws(paste(utils::capture.output(utils::str(v, give.attr = FALSE, vec.len = 3))[1], collapse = "")),
      error = function(e) class(v)[1])
    paste0(n, "\t", class(v)[1], "\t", d)
  }, character(1), USE.NAMES = FALSE)
}
.eq <- function(a, b) {
  flat <- function(x) if (is.array(x) || is.factor(x)) as.vector(x) else x
  isTRUE(all.equal(flat(a), flat(b), check.attributes = FALSE))
}
.ra_setup_run <- function(code, env) invisible(utils::capture.output(.ra_run(code, env, echo = FALSE)))
.ra_check <- function(check, env) {
  tryCatch(isTRUE(eval(parse(text = check), envir = env)), error = function(e) FALSE)
}
.ra_console <- .ra_new_env()

# ---- Trazador paso a paso: instrumenta los bucles y guarda el valor de las variables en cada vuelta ----
.ra_js <- function(s) {
  s <- gsub("\\", "\\\\", s, fixed = TRUE)
  s <- gsub('"', '\\"', s, fixed = TRUE)
  s <- gsub("\n", "\\n", s, fixed = TRUE)
  s <- gsub("\t", "\\t", s, fixed = TRUE)
  paste0('"', s, '"')
}
.ra_fmt <- function(x) {
  if (is.null(x)) return("NULL")
  if (is.function(x)) return("<función>")
  if (is.data.frame(x)) return(sprintf("data.frame %d×%d", nrow(x), ncol(x)))
  if (is.matrix(x)) return(sprintf("matriz %d×%d", nrow(x), ncol(x)))
  if (is.list(x)) return(sprintf("lista (%d)", length(x)))
  if (is.factor(x)) x <- as.character(x)
  if (is.atomic(x)) {
    if (length(x) == 0) return(paste0(class(x)[1], "(0)"))
    shown <- if (is.character(x)) ifelse(is.na(x), "NA", paste0('"', x, '"')) else format(x, digits = 6, trim = TRUE)
    if (length(x) > 8) shown <- c(shown[1:8], paste0("… (", length(x), ")"))
    return(paste(shown, collapse = " "))
  }
  class(x)[1]
}
.ra_trace <- function(code, setup = "") {
  env <- .ra_new_env()
  .ra_setup_run(setup, env)
  base_vars <- ls(env)
  rows <- character()
  buf <- character()
  tc <- textConnection("buf", "w", local = TRUE)
  seen <- 0L
  take_out <- function() {
    lines <- textConnectionValue(tc)
    new <- if (length(lines) > seen) lines[(seen + 1L):length(lines)] else character()
    seen <<- length(lines)
    new
  }
  env$.ra_tick <- function(label) {
    vars <- setdiff(ls(env), base_vars)
    vals <- vapply(vars, function(v) .ra_fmt(get(v, envir = env)), character(1))
    o <- take_out()
    rows[length(rows) + 1L] <<- paste0("{\"l\":", .ra_js(label), ",\"v\":{",
      paste0(.ra_js(vars), ":", .ra_js(vals), collapse = ","), "},\"o\":", .ra_js(paste(o, collapse = "\n")), "}")
    if (length(rows) >= 300) stop("Hay demasiadas vueltas para mostrarlas (máximo 300).", call. = FALSE)
  }
  tick <- function(label) call(".ra_tick", label)
  short <- function(e) { s <- paste(deparse(e, width.cutoff = 60L), collapse = " "); if (nchar(s) > 28) paste0(substr(s, 1, 27), "…") else s }
  ins <- function(e, label = NULL) {
    if (!is.call(e)) return(e)
    f <- e[[1]]
    if (identical(f, as.name("next")) || identical(f, as.name("break"))) {
      return(if (is.null(label)) e else call("{", tick(label), e))
    }
    if (identical(f, as.name("function"))) return(e)
    if (identical(f, as.name("for"))) {
      lab <- paste0("for (", deparse(e[[2]]), " in ", short(e[[3]]), ")")
      e[[4]] <- call("{", ins(e[[4]], lab), tick(lab))
      return(e)
    }
    if (identical(f, as.name("while"))) {
      lab <- paste0("while (", short(e[[2]]), ")")
      e[[3]] <- call("{", ins(e[[3]], lab), tick(lab))
      return(e)
    }
    if (identical(f, as.name("repeat"))) {
      e[[2]] <- call("{", ins(e[[2]], "repeat"), tick("repeat"))
      return(e)
    }
    if (length(e) > 1) for (i in 2:length(e)) {
      if (is.symbol(e[[i]]) || is.null(e[[i]]) || !is.call(e[[i]])) next
      e[[i]] <- ins(e[[i]], label)
    }
    e
  }
  err <- ""
  sink(tc)
  tryCatch({
    exprs <- parse(text = code, keep.source = FALSE)
    for (ex in exprs) {
      r <- withVisible(eval(ins(ex), envir = env))
      if (r$visible) print(r$value)
    }
  }, error = function(e) err <<- conditionMessage(e),
     finally = { sink(); })
  rest <- take_out()
  close(tc)
  paste0("{\"rows\":[", paste(rows, collapse = ","), "],\"out\":", .ra_js(paste(c(buf), collapse = "\n")),
         ",\"err\":", .ra_js(err), "}")
}
`;

const listeners = new Set();
let webR = null;
let shelter = null;
let queue = Promise.resolve();
const installed = new Set();

const REngine = {
  status: 'loading', // loading | ready | error
  error: null,
  onStatus(fn) { listeners.add(fn); fn(this.status); return () => listeners.delete(fn); },
};

function setStatus(s, err) {
  REngine.status = s;
  REngine.error = err || null;
  listeners.forEach((fn) => { try { fn(s); } catch (e) { console.error(e); } });
}

// Serializa las llamadas: webR ejecuta una cosa a la vez.
function enqueue(fn) {
  const p = queue.then(fn, fn);
  queue = p.catch(() => {});
  return p;
}

async function init() {
  const timeout = new Promise((_, rej) => setTimeout(() => rej(new Error('Tiempo de carga agotado (¿sin internet?)')), 60000));
  const load = (async () => {
    const { WebR } = await import(WEBR_URL);
    webR = new WebR();
    await webR.init();
    shelter = await new webR.Shelter();
    await webR.evalRVoid(R_HELPERS);
  })();
  await Promise.race([load, timeout]);
}

REngine.ready = init().then(
  () => { setStatus('ready'); return true; },
  (e) => { console.error('webR', e); setStatus('error', e); return false; }
);

function parseOutput(output) {
  const lines = [];
  for (const o of output) {
    if (o.type !== 'stdout' && o.type !== 'stderr') continue;
    const raw = String(o.data);
    let kind = o.type === 'stderr' ? 'warn' : 'out';
    let text = raw;
    if (raw.startsWith('\x01')) { kind = 'echo'; text = raw.slice(1); }
    else if (raw.startsWith('\x02')) { kind = 'error'; text = raw.slice(1); }
    else if (raw.startsWith('\x03')) { kind = 'warn'; text = raw.slice(1); }
    lines.push({ kind, text });
  }
  return lines;
}

async function capture(code, graphics) {
  const opts = { withAutoprint: false, captureStreams: true, captureConditions: false };
  if (graphics) opts.captureGraphics = { width: 560, height: 380 };
  const res = await shelter.captureR(code, opts);
  let value = null;
  try { value = await res.result.toJs(); } catch (e) { value = null; }
  return { lines: parseOutput(res.output), images: res.images || [], value };
}

async function envSummary(envName) {
  const obj = await webR.evalR(`.ra_env_summary(${envName})`);
  const arr = await obj.toArray();
  return arr.map((s) => {
    const [name, cls, desc] = String(s).split('\t');
    return { name, cls, desc };
  });
}

async function bind(name, value) {
  await webR.objs.globalEnv.bind(name, value);
}

// Ejecuta código en un entorno nuevo (ejemplos de teoría).
REngine.run = (code, { setup = '', echo = true } = {}) => enqueue(async () => {
  if (!(await REngine.ready)) throw new Error('R no disponible');
  try {
    await bind('.ra_code', code);
    await bind('.ra_setup', setup);
    const out = await capture(
      `.ra_cur <- .ra_new_env(); .ra_setup_run(.ra_setup, .ra_cur); .ra_run(.ra_code, .ra_cur, echo = ${echo ? 'TRUE' : 'FALSE'})`,
      true
    );
    return out;
  } finally { shelter.purge(); }
});

// Corrige un ejercicio: ejecuta setup + código del alumno y evalúa la comprobación en R.
REngine.grade = (code, { setup = '', check = 'TRUE' } = {}) => enqueue(async () => {
  if (!(await REngine.ready)) throw new Error('R no disponible');
  try {
    await bind('.ra_code', code);
    await bind('.ra_setup', setup);
    await bind('.ra_chk', check);
    const out = await capture(
      `.ra_cur <- .ra_new_env(); .ra_setup_run(.ra_setup, .ra_cur); .ra_run(.ra_code, .ra_cur)`,
      true
    );
    const ranOk = out.value && out.value.values ? !!out.value.values[0] : !!out.value;
    const passed = ranOk && (await webR.evalRBoolean('.ra_check(.ra_chk, .ra_cur)'));
    const env = await envSummary('.ra_cur');
    return { ...out, ranOk, passed, env };
  } finally { shelter.purge(); }
});

// Trazador: devuelve { rows: [{ l, v: {var: valor}, o }], out, err } con una fila por vuelta de bucle.
REngine.trace = (code, { setup = '' } = {}) => enqueue(async () => {
  if (!(await REngine.ready)) throw new Error('R no disponible');
  try {
    await bind('.ra_code', code);
    await bind('.ra_setup', setup);
    const json = await webR.evalRString('.ra_trace(.ra_code, .ra_setup)');
    return JSON.parse(json);
  } finally { shelter.purge(); }
});

// Consola persistente (pantalla "Consola R").
REngine.console = (code) => enqueue(async () => {
  if (!(await REngine.ready)) throw new Error('R no disponible');
  try {
    await bind('.ra_code', code);
    const out = await capture('.ra_run(.ra_code, .ra_console)', true);
    const env = await envSummary('.ra_console');
    return { ...out, env };
  } finally { shelter.purge(); }
});

REngine.consoleEnv = () => enqueue(async () => {
  if (!(await REngine.ready)) return [];
  return envSummary('.ra_console');
});

REngine.resetConsole = () => enqueue(async () => {
  if (!(await REngine.ready)) return;
  await webR.evalRVoid('.ra_console <- .ra_new_env()');
});

// Instala paquetes (dplyr, ggplot2...) desde el repositorio de webR, una sola vez.
REngine.install = (pkgs) => enqueue(async () => {
  if (!(await REngine.ready)) return false;
  const missing = pkgs.filter((p) => !installed.has(p));
  if (!missing.length) return true;
  const list = missing.map((p) => JSON.stringify(p)).join(', ');
  await webR.evalRVoid(`webr::install(c(${list}), quiet = TRUE)`);
  missing.forEach((p) => installed.add(p));
  return true;
});

window.REngine = REngine;
window.dispatchEvent(new Event('rengine'));
