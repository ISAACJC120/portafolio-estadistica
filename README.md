# Portafolio Digital de Estadística

Portafolio académico de **Isaac Chávez**, estudiante de cuarto semestre de **Pedagogía de las Ciencias Experimentales, Informática**, en la **Universidad Central del Ecuador**, Facultad de Filosofía, Letras y Ciencias de la Educación. Asignatura: Estadística. Docente: **Mgtr. Diego Tipán**.

**Sitio:** https://isaacjc120.github.io/portafolio-estadistica/

Presentación académica, evidencias enlazadas a Notion, calculadora de media, mediana y moda, gráfico de frecuencias, hoja de vida, certificaciones y contacto. HTML, CSS y JavaScript puro; sin compilación, cuentas, bases de datos ni servicios de pago. El período académico y los documentos aún no proporcionados permanecen pendientes.

## Archivos

Para facilitar la edición y la carga desde el navegador, los archivos de esta versión están en la raíz, separados por responsabilidad:

```text
index.html             Estructura semántica y contenido académico
styles.css             Diseño adaptable, temas y estilos de impresión
datos.js               Archivo para editar enlaces y contenido variable
estadistica.js         Validación y funciones estadísticas puras
app.js                 Navegación, tarjetas, calculadora y gráficos
qrcode.min.js          Generador local de QR (tercero, licencia MIT)
LICENSE-qrcode.txt     Licencia del generador QR
favicon.svg            Icono original del sitio
README.md              Guía de edición y despliegue
.gitignore             Exclusiones de Git
.nojekyll              Publicación estática sin procesamiento Jekyll
```

Para imágenes o documentos puedes crear `recursos/imagenes/` y `recursos/documentos/`. Utiliza rutas relativas como `./recursos/documentos/certificado.pdf`, nombres sin espacios y coincidencia exacta de mayúsculas. No hay rutas absolutas dependientes del nombre del repositorio.

## Abrir y editar localmente

Con Git y Visual Studio Code instalados, abre una terminal en la carpeta donde quieras guardar el proyecto:

```powershell
git clone https://github.com/ISAACJC120/portafolio-estadistica.git
cd portafolio-estadistica
code .
```

`clone` crea la carpeta y descarga el historial; `cd` entra en ella; `code .` abre Visual Studio Code. Abre `index.html` directamente en el navegador. Si tienes Python, también puedes usar:

```powershell
python -m http.server 8000
```

Abre http://localhost:8000 y detén el servidor con Ctrl+C al terminar.

## Actualizar el contenido

Edita **datos.js** y conserva comillas, comas y corchetes. Una cadena vacía (`""`) significa que ese dato está pendiente. No hace falta editar el HTML para añadir evidencias o certificados.

### Período, hoja de vida y contacto

Completa `periodo`, `hojaDeVidaUrl` y `notionUrl` con tus datos reales. La hoja de vida acepta HTTPS o un PDF local con ruta `./recursos/...`. Cada contacto tiene `nombre` y `url`; para correo usa `mailto:tu-direccion-real`. Las URL web deben comenzar por `https://`. Los vínculos externos se abren con `noopener noreferrer`. No publiques información privada.

### Evidencias de Notion

1. Duplica la estructura del portafolio de Matemáticas y nombra la copia Estadística, conservando el original.
2. Organiza las páginas según las unidades y actividades reales.
3. En la página de Notion, usa Compartir → Publicar. Revisa qué subpáginas quedan públicas antes de confirmar.
4. Copia el enlace del sitio publicado, no uno privado del espacio de trabajo.
5. Comprueba el enlace en una ventana privada sin iniciar sesión.
6. Añade un objeto a `evidencias` en `datos.js`. Los nombres de unidad generan automáticamente el filtro.

Ejemplo de estructura **provisional**, para reemplazar con contenido real:

```js
evidencias: [
  {
    titulo: "Reemplazar por el título real",
    descripcion: "Reemplazar por una descripción breve",
    unidad: "Reemplazar por la unidad real",
    url: "",
    imagen: "",
    provisional: true
  }
]
```

Cuando incorpores una actividad real, elimina `provisional` o usa `false`. Añade más objetos separados por coma. El contenido de cada evidencia se actualiza en Notion; la tarjeta se actualiza en este archivo. Si cambia la URL pública, actualízala también aquí. No se utiliza la API de Notion ni claves privadas. Los enlaces vacíos no generan botones ficticios.

### Certificados y QR

Power BI permanece como `estado: "pendiente"`. Cuando recibas el certificado, completa su registro:

```js
{
  titulo: "Power BI",
  estado: "disponible",
  entidad: "",
  fecha: "",
  imagen: "",
  pdfUrl: "",
  verificacionUrl: ""
}
```

`imagen` y `pdfUrl` aceptan HTTPS o rutas `./recursos/...`. `verificacionUrl` debe ser una URL HTTPS oficial comprobada por ti. Con esa URL y estado disponible, el navegador genera un QR localmente, sin servicios externos. El enlace ofrece una alternativa accesible; un QR solo abre la URL y no demuestra autenticidad por sí mismo. Si la URL es demasiado larga para generar el QR, se conserva el botón. No se inventan entidad emisora, fechas ni códigos. Añade otros objetos para más certificados.

## Laboratorio estadístico

- Separa números con espacios, punto y coma o saltos de línea.
- Para decimales, usa punto o coma: `2,5; 3,5; 4`.
- `1,2` representa el decimal 1.2; usa `1; 2` para dos valores.
- No uses separadores de miles ni notación científica. Se aceptan negativos y cero.
- Límite educativo: 2000 datos, con valores absolutos de hasta 10¹².
- Media: suma compensada dividida entre la cantidad de datos.
- Mediana: valor central de la lista ordenada; para cantidad par, promedio de los dos centrales.
- Moda: todos los valores con frecuencia máxima. Si todos aparecen una sola vez, se muestra «Sin moda», incluido el caso de un único dato. Los empates con frecuencia mayor que uno muestran todas las modas.
- Resultados con hasta 6 decimales; etiquetas y tabla conservan los valores interpretados. JavaScript usa coma flotante: no es una herramienta de precisión arbitraria.
- Con más de 30 valores distintos, el gráfico presenta los 30 más frecuentes. La tabla conserva todos.
- Un error o una edición invalida los resultados anteriores.
- Los datos no se transmiten ni se almacenan. Solo se guarda la preferencia de tema.

Comprobaciones: `4; 6; 6; 8; 11` → media 7, mediana 6, moda 6. `1; 2; 3; 4` → media y mediana 2,5, sin moda. `1; 1; 2; 2` → media y mediana 1,5, modas 1 y 2.

## Git y publicación

### Actualizar este repositorio

Después de editar y comprobar el sitio:

```powershell
git status
git add index.html styles.css datos.js estadistica.js app.js qrcode.min.js LICENSE-qrcode.txt favicon.svg README.md .gitignore .nojekyll
git commit -m "Actualizar portafolio de Estadística"
git push origin main
```

`status` revisa cambios; `add` prepara los archivos; `commit` guarda una versión; `push` la sube. Para cambios de contenido basta `git add datos.js`. Añade también las rutas de cualquier documento nuevo. GitHub puede solicitar autenticación; no uses la contraseña de la cuenta como contraseña Git.

También puedes editar `datos.js` directamente en GitHub con el lápiz y guardar con **Commit changes**, sin reinstalar ni recompilar.

### Inicialización desde cero (referencia)

Solo para un proyecto y repositorio remoto **nuevos y vacíos**, no para ejecutar sobre este portafolio:

```powershell
mkdir portafolio-estadistica
cd portafolio-estadistica
code .
git init -b main
# Crear o copiar los archivos del sitio antes del siguiente paso.
git add .
git commit -m "Crear portafolio de Estadística"
git remote add origin https://github.com/ISAACJC120/portafolio-estadistica.git
git push -u origin main
```

El repositorio se crea en GitHub con **New repository**, nombre y visibilidad pública. La secuencia supone que no tiene otro README ni historial remoto. Para el repositorio actual usa `git clone`; no fuerces la subida ni sobrescribas el historial.

### GitHub Pages

1. Repositorio → **Settings → Pages**.
2. En **Build and deployment**, elige **Deploy from a branch**.
3. Selecciona **main** y **/(root)**; pulsa **Save**.
4. Espera **pages build and deployment** en **Actions**.
5. Abre https://isaacjc120.github.io/portafolio-estadistica/ y revisa estilos, navegación y calculadora.

Los commits posteriores en `main` actualizan Pages automáticamente. Si tarda en aparecer un cambio, revisa Actions y recarga sin caché. El repositorio de Matemáticas es independiente.

## Accesibilidad y mantenimiento

HTML semántico, foco visible, enlace para saltar al contenido, menú móvil con estado accesible, errores anunciados, resultados con región de estado, tablas alternativas a gráficos y respeto a movimiento reducido. Temas claro/oscuro, sin fuentes externas ni CDN. Comprueba el móvil y los enlaces públicos después de cada actualización.

Pendiente de contenido real: período académico, unidades y actividades, enlaces de Notion, hoja de vida y certificado definitivo de Power BI. Estos pendientes no impiden utilizar la página ni la calculadora.

## Documentación de referencia

- [Publicar páginas de Notion](https://www.notion.com/help/public-pages-and-web-publishing).
- [Configurar la fuente de GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Créditos

Diseño, icono y gráfico ilustrativo propios del proyecto. No se utiliza el logotipo de la universidad porque no se proporcionó el archivo oficial.

QRCode.js, David Shim, licencia MIT: https://github.com/davidshimjs/qrcodejs. Copia local del commit `04f46c6a0708418cb7b96fc563eacae0fbf77674`; licencia en `LICENSE-qrcode.txt`. Sin dependencias de pago ni seguimiento analítico.
