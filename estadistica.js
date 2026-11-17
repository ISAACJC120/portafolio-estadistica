/* Funciones puras: no dependen del navegador ni envían información a un servidor. */
(function (root) {
  "use strict";
  const MAX_DATOS = 2000;
  function parsear(texto) {
    const limpio = texto.trim();
    if (!limpio) throw new Error("Introduce al menos un número para calcular.");
    // Separación inequívoca: espacios, punto y coma o saltos de línea.
    // El punto o la coma se aceptan como separador decimal, nunca de miles.
    const partes = limpio.split(/[\s;]+/u);
    if (partes.length > MAX_DATOS) throw new Error("Utiliza como máximo 2000 datos por cálculo.");
    return partes.map((parte, indice) => {
      if (!/^[+-]?(?:\d+(?:[.,]\d+)?|[.,]\d+)$/.test(parte)) {
        throw new Error(`Revisa el dato ${indice + 1}: «${parte.slice(0, 24)}». Separa los números con espacios o punto y coma.`);
      }
      const valor = Number(parte.replace(",", "."));
      if (!Number.isFinite(valor) || Math.abs(valor) > 1e12) throw new Error("Cada número debe estar entre −1 000 000 000 000 y 1 000 000 000 000.");
      return Object.is(valor, -0) ? 0 : valor;
    });
  }
  function resumir(valores) {
    if (!Array.isArray(valores) || !valores.length || valores.length > MAX_DATOS || valores.some(n => typeof n !== "number" || !Number.isFinite(n) || Math.abs(n) > 1e12)) {
      throw new Error("La lista debe contener de 1 a 2000 números finitos dentro del rango permitido.");
    }
    const ordenados = [...valores].sort((a, b) => a - b);
    const n = ordenados.length;
    let suma = 0, correccion = 0;
    // Suma compensada para reducir el error de redondeo de coma flotante.
    for (const numero of ordenados) {
      const t = suma + numero;
      correccion += Math.abs(suma) >= Math.abs(numero) ? (suma - t) + numero : (numero - t) + suma;
      suma = t;
    }
    suma += correccion;
    const frecuencia = new Map();
    for (const numero of ordenados) frecuencia.set(numero, (frecuencia.get(numero) || 0) + 1);
    const frecuencias = [...frecuencia].map(([valor, cantidad]) => ({ valor, cantidad }));
    const maximaFrecuencia = Math.max(...frecuencia.values());
    const modas = maximaFrecuencia === 1 ? [] : frecuencias.filter(f => f.cantidad === maximaFrecuencia).map(f => f.valor);
    return { n, suma, media: suma / n, mediana: n % 2 ? ordenados[(n - 1) / 2] : (ordenados[n / 2 - 1] + ordenados[n / 2]) / 2,
      modas, maximaFrecuencia, minimo: ordenados[0], maximo: ordenados[n - 1], rango: ordenados[n - 1] - ordenados[0], frecuencias, ordenados };
  }
  root.Estadistica = { parsear, resumir, MAX_DATOS };
  if (typeof module !== "undefined" && module.exports) module.exports = root.Estadistica;
})(typeof window !== "undefined" ? window : globalThis);
