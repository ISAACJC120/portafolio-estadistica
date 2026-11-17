(function () {
  "use strict";
  const $ = id => document.getElementById(id);
  const datos = window.PORTAFOLIO || {};
  const numero = n => new Intl.NumberFormat("es-EC", { maximumFractionDigits: 6 }).format(n);
  const exacto = n => String(n).replace(".", ",");
  function elemento(tag, clase, texto) {
    const nodo = document.createElement(tag);
    if (clase) nodo.className = clase;
    if (texto !== undefined) nodo.textContent = texto;
    return nodo;
  }
  // Solo URL web seguras; los recursos opcionales también pueden ser relativos.
  function urlValida(valor, local = false, correo = false) {
    if (typeof valor !== "string" || !valor.trim()) return null;
    try {
      const limpia = valor.trim();
      if (local && /^\.\/[\w\-/ .%]+$/u.test(limpia) && !limpia.includes("..")) return limpia;
      const url = new URL(limpia);
      if (url.protocol === "https:" || (correo && url.protocol === "mailto:" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(url.pathname))) return url.href;
    } catch { /* Una URL inválida se mantiene como pendiente. */ }
    return null;
  }
  function enlace(texto, url, clase = "text-link", local = false, correo = false) {
    const href = urlValida(url, local, correo);
    if (!href) return null;
    const a = elemento("a", clase, texto); a.href = href;
    if (!href.startsWith("mailto:")) { a.target = "_blank"; a.rel = "noopener noreferrer"; }
    return a;
  }
  function imagen(src, alt, clase) {
    const url = urlValida(src, true); if (!url) return null;
    const img = elemento("img", clase);
    img.src = url; img.alt = alt; img.loading = "lazy"; img.decoding = "async";
    img.addEventListener("error", () => img.remove(), { once: true }); return img;
  }
  document.documentElement.classList.add("js-ready");
  $("year").textContent = String(new Date().getFullYear());
  if (datos.periodo) $("periodo").textContent = `Período académico · ${datos.periodo}`;
  const tema = $("theme-toggle");
  function aplicarTema(oscuro) {
    document.documentElement.dataset.theme = oscuro ? "dark" : "light";
    tema.setAttribute("aria-label", oscuro ? "Activar modo claro" : "Activar modo oscuro");
    tema.title = oscuro ? "Activar modo claro" : "Activar modo oscuro";
  }
  let preferencia;
  try { preferencia = localStorage.getItem("ic-estadistica-tema"); } catch { /* Almacenamiento bloqueado. */ }
  aplicarTema(preferencia ? preferencia === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches);
  tema.addEventListener("click", () => {
    const oscuro = document.documentElement.dataset.theme !== "dark"; aplicarTema(oscuro);
    try { localStorage.setItem("ic-estadistica-tema", oscuro ? "dark" : "light"); } catch { /* El tema sigue funcionando. */ }
  });
  const menu = $("menu-toggle"), nav = $("nav");
  function cerrarMenu() { menu.setAttribute("aria-expanded", "false"); nav.classList.remove("is-open"); }
  menu.addEventListener("click", () => { const abrir = menu.getAttribute("aria-expanded") !== "true"; menu.setAttribute("aria-expanded", String(abrir)); nav.classList.toggle("is-open", abrir); });
  nav.addEventListener("click", e => { if (e.target.closest("a")) cerrarMenu(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && menu.getAttribute("aria-expanded") === "true") { cerrarMenu(); menu.focus(); } });
  const evidencias = Array.isArray(datos.evidencias) ? datos.evidencias : [];
  const filtro = $("unit-filter");
  [...new Set(evidencias.map(e => e.unidad || "Sin unidad"))].forEach(unidad => { const option = elemento("option", "", unidad); option.value = unidad; filtro.append(option); });
  $("evidence-toolbar").hidden = evidencias.length === 0;
  function mostrarEvidencias() {
    const lista = evidencias.filter(e => !filtro.value || (e.unidad || "Sin unidad") === filtro.value);
    $("evidence-grid").replaceChildren(); $("evidence-empty").hidden = evidencias.length > 0;
    $("evidence-count").textContent = `${lista.length} ${lista.length === 1 ? "evidencia" : "evidencias"}`;
    lista.forEach(e => {
      const card = elemento("article", "evidence-card"), img = imagen(e.imagen, e.titulo || "Evidencia académica", "");
      if (img) card.append(img);
      const body = elemento("div", "evidence-content");
      body.append(elemento("span", "micro", e.unidad || "Sin unidad"), elemento("h3", "", e.titulo || "Título pendiente"), elemento("p", "", e.descripcion || "Descripción pendiente."));
      if (e.provisional) body.append(elemento("span", "badge", "Ejemplo provisional"));
      body.append(enlace("Ver evidencia en Notion ↗", e.url) || elemento("span", "badge", "Enlace pendiente"));
      card.append(body); $("evidence-grid").append(card);
    });
  }
  filtro.addEventListener("change", mostrarEvidencias); mostrarEvidencias();
  const notion = urlValida(datos.notionUrl);
  if (notion) { const a = $("notion-link"); a.href = notion; a.target = "_blank"; a.rel = "noopener noreferrer"; a.hidden = false; }
  const cv = enlace("Abrir hoja de vida ↗", datos.hojaDeVidaUrl, "button primary", true);
  if (cv) $("cv-action").replaceChildren(cv);
  const certificados = Array.isArray(datos.certificaciones) ? datos.certificaciones : [];
  $("cert-grid").replaceChildren();
  certificados.forEach(c => {
    const card = elemento("article", "cert-card"), icon = elemento("span", "cert-icon", "▥"); icon.setAttribute("aria-hidden", "true");
    const body = elemento("div", "cert-content"), pendiente = c.estado !== "disponible";
    body.append(elemento("span", "badge", pendiente ? "Pendiente de incorporar" : "Certificado disponible"), elemento("h3", "", c.titulo || "Certificación"));
    if (pendiente) body.append(elemento("p", "", "El certificado definitivo aún no está disponible. Se incorporará aquí cuando se reciba."));
    if (c.entidad) body.append(elemento("p", "", c.entidad));
    if (c.fecha) body.append(elemento("p", "", `Fecha: ${c.fecha}`));
    if (!pendiente) {
      const img = imagen(c.imagen, `Certificado de ${c.titulo || "formación complementaria"}`, "cert-image"); if (img) body.append(img);
      const actions = elemento("div", "cert-actions"), pdf = enlace("Abrir certificado PDF ↗", c.pdfUrl, "", true), verificar = enlace("Verificar certificado ↗", c.verificacionUrl, "");
      if (pdf) actions.append(pdf); if (verificar) actions.append(verificar); body.append(actions);
      // Generación local de QR; nunca se envía la URL a un servicio externo.
      if (verificar && window.QRCode) {
        const figure = elemento("figure", "qr-wrap"), qr = elemento("div", "qr-code");
        qr.setAttribute("role", "img"); qr.setAttribute("aria-label", `QR de verificación de ${c.titulo}`);
        figure.append(qr, elemento("figcaption", "", "Escanea para abrir el enlace de verificación. También puedes usar el botón anterior.")); body.append(figure);
        try { new QRCode(qr, { text: verificar.href, width: 144, height: 144, colorDark: "#101d32", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M }); }
        catch { figure.remove(); body.append(elemento("p", "", "Utiliza el enlace de verificación para consultar este certificado.")); }
      }
    }
    card.append(icon, body); $("cert-grid").append(card);
  });
  if (!certificados.length) $("cert-grid").append(elemento("p", "", "Certificaciones pendientes de incorporar."));
  $("contact-links").replaceChildren();
  (Array.isArray(datos.contactos) ? datos.contactos : []).forEach(c => { const a = enlace(`${c.nombre || "Perfil"} ↗`, c.url, "contact-link", false, true); if (a) $("contact-links").append(a); });
  if (!$("contact-links").children.length) $("contact-links").append(elemento("p", "", "Perfiles de contacto pendientes de incorporar."));
  const input = $("data-input"), error = $("data-error");
  let resultadosVigentes = false;
  function limpiarResultados(mensaje) {
    ["mean", "median", "mode", "count", "minimum", "maximum", "range"].forEach(id => { $(id).textContent = "—"; });
    $("distribution").hidden = true; $("frequency-chart").replaceChildren(); $("frequency-table").replaceChildren();
    $("results-status").textContent = mensaje; resultadosVigentes = false;
  }
  function ocultarError() { error.hidden = true; error.textContent = ""; input.removeAttribute("aria-invalid"); }
  function dibujarFrecuencias(s) {
    const { frecuencias, n } = s, chart = $("frequency-chart"), tbody = $("frequency-table"); chart.replaceChildren(); tbody.replaceChildren();
    const muchas = frecuencias.length > 30;
    const visibles = muchas ? [...frecuencias].sort((a, b) => b.cantidad - a.cantidad || a.valor - b.valor).slice(0, 30) : frecuencias;
    $("chart-note").textContent = muchas ? `Se muestran los 30 valores más frecuentes de ${frecuencias.length} valores distintos. La tabla incluye todos los datos.` : "Cada barra indica cuántas veces aparece un valor. La tabla muestra los valores exactos.";
    visibles.forEach(f => {
      const row = elemento("div", "bar-row"), track = elemento("div", "bar-track"), fill = elemento("div", "bar-fill"); fill.style.width = `${100 * f.cantidad / s.maximaFrecuencia}%`;
      track.append(fill); row.append(elemento("span", "bar-label", exacto(f.valor)), track, elemento("span", "bar-count", String(f.cantidad))); chart.append(row);
    });
    const fragment = document.createDocumentFragment();
    frecuencias.forEach(f => { const row = elemento("tr"); row.append(elemento("td", "", exacto(f.valor)), elemento("td", "", String(f.cantidad)), elemento("td", "", `${numero(100 * f.cantidad / n)} %`)); fragment.append(row); }); tbody.append(fragment);
    const media = `Media: ${numero(s.suma)} ÷ ${n} = ${numero(s.media)}.`;
    const mediana = n % 2 ? ` Mediana: el dato en la posición ${(n + 1) / 2} de la lista ordenada es ${exacto(s.mediana)}.` : ` Mediana: promedio de los datos en las posiciones ${n / 2} y ${n / 2 + 1}, es decir, (${exacto(s.ordenados[n / 2 - 1])} + ${exacto(s.ordenados[n / 2])}) ÷ 2 = ${numero(s.mediana)}.`;
    const moda = s.modas.length ? ` La frecuencia más alta es ${s.maximaFrecuencia}; ${s.modas.length === 1 ? "hay una moda" : `hay ${s.modas.length} modas`}.` : " Sin moda: ningún valor se repite.";
    $("calculation-explanation").textContent = media + mediana + moda; $("distribution").hidden = false;
  }
  function calcular(esEjemplo = false) {
    ocultarError();
    try {
      const s = Estadistica.resumir(Estadistica.parsear(input.value));
      $("mean").textContent = numero(s.media); $("median").textContent = numero(s.mediana); $("mode").textContent = s.modas.length ? s.modas.map(exacto).join(" · ") : "Sin moda";
      $("count").textContent = String(s.n); $("minimum").textContent = numero(s.minimo); $("maximum").textContent = numero(s.maximo); $("range").textContent = numero(s.rango);
      $("results-status").textContent = `${esEjemplo ? "Ejemplo didáctico · " : ""}${s.n} ${s.n === 1 ? "dato analizado" : "datos analizados"}. ${s.modas.length > 1 ? "Distribución multimodal." : "Resultados actualizados."}`;
      dibujarFrecuencias(s); resultadosVigentes = true;
    } catch (e) { limpiarResultados("Revisa los datos para obtener resultados."); error.textContent = e.message; error.hidden = false; input.setAttribute("aria-invalid", "true"); input.focus(); }
  }
  $("stats-form").addEventListener("submit", e => { e.preventDefault(); calcular(); });
  $("load-example").addEventListener("click", () => { input.value = "4; 6; 6; 8; 11"; calcular(true); });
  $("clear-data").addEventListener("click", () => { input.value = ""; ocultarError(); limpiarResultados("Introduce números o carga un ejemplo para comenzar."); input.focus(); });
  input.addEventListener("input", () => { ocultarError(); if (resultadosVigentes) limpiarResultados("Los datos cambiaron. Pulsa Calcular para actualizar los resultados."); });
})();
