// Este archivo simula una base de datos de artículos para el blog.
// El 'content' es un string de HTML.

export const blogPosts = [
  {
    id: 1,
    slug: 'guia-compresion-pdf-sin-perder-calidad',
    title: 'Guía Definitiva: Cómo Comprimir un PDF sin Perder Calidad',
    excerpt: 'Analizamos las diferencias entre compresión Lossless y Lossy, el impacto del DPI y cómo reducir el tamaño de tus archivos de forma profesional.',
    category: 'Tutoriales',
    date: '4 de Noviembre, 2025',
    author: 'Equipo PDFPulse',
    bannerImage: 'https://placehold.co/1200x600/1E1E1E/00F0FF?text=Compresion+PDF',
    content: `
      <p class="text-lg text-gray-300 mb-6">En el mundo digital, el tamaño del archivo importa. Ya sea para enviar un CV por correo, subir un informe a un portal web o simplemente para archivar documentos, un PDF pesado es un obstáculo. Pero el miedo es siempre el mismo: ¿si lo comprimo, se verá borroso?</p>
      <p class="text-gray-300 mb-6">La respuesta corta es: <strong>no, si lo haces bien.</strong> Esta guía desglosa la ciencia detrás de la compresión para que tomes decisiones informadas.</p>
      
      <h2 class="text-3xl font-bold text-white mt-10 mb-4">El Dilema: Lossy vs. Lossless</h2>
      <p class="text-gray-300 mb-6">No toda la compresión es igual. El tipo de compresión determina cuánta calidad se pierde (o no se pierde) en el proceso.</p>
      <ul class="list-disc list-inside text-gray-300 mb-6 pl-4 space-y-2">
        <li><strong>Compresión <span class="tooltip-wrapper">Lossless (Sin Pérdida)<span class="tooltip-text">Un algoritmo que reduce el tamaño del archivo sin descartar ningún dato. La calidad es 100% idéntica a la original.</span></span>:</strong> Piensa en esto como un archivo ZIP. El algoritmo busca patrones repetitivos en los datos (especialmente en texto e imágenes vectoriales) y los almacena de forma más eficiente. Al abrir el archivo, se reconstruye perfectamente. <strong>No hay pérdida de calidad.</strong></li>
        <li><strong>Compresión <span class="tooltip-wrapper">Lossy (Con Pérdida)<span class="tooltip-text">Un algoritmo que elimina permanentemente datos "innecesarios" (que el ojo humano apenas nota) para reducir drásticamente el tamaño.</span></span>:</strong> Este método se aplica casi exclusivamente a las imágenes dentro de tu PDF. Elimina información que el ojo humano no detecta fácilmente. Es la técnica más efectiva para reducciones drásticas de tamaño.</li>
      </ul>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">El Verdadero Culpable del Peso: Las Imágenes y el DPI</h2>
      <p class="text-gray-300 mb-6">El texto en un PDF casi no pesa nada. El peso real proviene de las imágenes incrustadas. Aquí es donde entra en juego el <span class="tooltip-wrapper">DPI (Puntos Por Pulgada)<span class="tooltip-text">"Dots Per Inch" o Puntos Por Pulgada. Mide la resolución de una imagen. Más DPI = más calidad y más peso.</span></span>.</p>
      <ul class="list-disc list-inside text-gray-300 mb-6 pl-4 space-y-2">
        <li><strong>300 DPI:</strong> Es la calidad de impresión estándar. Es excelente para un libro, pero totalmente innecesaria para un documento que solo se verá en pantalla.</li>
        <li><strong>150 DPI:</strong> Es el punto dulce para la web. Ofrece una gran nitidez en monitores y reduce el tamaño significativamente.</li>
        <li><strong>72 DPI:</strong> Es la resolución clásica de pantalla. La calidad es notablemente más baja, pero el tamaño del archivo es mínimo.</li>
      </ul>
      <p class="text-gray-300 mb-6">Una buena herramienta de compresión (como las que usan tokens en PDFPulse) analiza tus imágenes y las reduce a un DPI razonable (ej. 150 DPI) usando compresión <i>Lossy</i>, mientras aplica compresión <i>Lossless</i> al texto y los vectores.</p>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">¿Qué más se optimiza?</h2>
      <p class="text-gray-300 mb-6">Una compresión avanzada también elimina datos "basura" que se acumulan en el archivo, tales como:</p>
      <ul class="list-disc list-inside text-gray-300 mb-6 pl-4 space-y-2">
        <li><strong>Metadatos duplicados:</strong> Información oculta sobre la creación del archivo.</li>
        <li><strong>Fuentes incrustadas (Subsetting):</strong> Si tu PDF usa una fuente especial, puede incrustar la fuente completa (2MB). Un compresor inteligente solo guarda los caracteres que SÍ usaste (ej. "H, o, l, a"), reduciendo el peso a solo unos pocos KB.</li>
        <li><strong>Objetos invisibles:</strong> Restos de imágenes o textos eliminados que siguen ocultos en el archivo.</li>
      </ul>

      <div class="border-l-4 border-neon/50 bg-white/5 p-6 rounded-lg mt-8">
        <strong class="text-neon text-lg">Conclusión:</strong> Para la mayoría de los usuarios, una compresión estándar que baje las imágenes a 150 DPI es la opción perfecta. Logra el mejor balance entre tamaño y calidad.
      </div>

      <div class="mt-12 border-t border-neon/20 pt-6">
        <h3 class="text-xl font-bold text-gray-300 mb-2">Referencias Reales</h3>
        <ul class="list-decimal list-inside text-gray-400 text-sm space-y-1">
          <li>Adobe Inc. (2023). <a href="https://helpx.adobe.com/acrobat/using/optimizing-pdfs.html" target="_blank" rel="noopener noreferrer" class="hover:underline">"Optimizing PDFs"</a>. Ayuda de Adobe Acrobat.</li>
          <li>Prepressure. (2024). <a href="https://www.prepressure.com/pdf/basics/font-subsetting" target="_blank" rel="noopener noreferrer" class="hover:underline">"Font Subsetting"</a>.</li>
        </ul>
      </div>
    `
  },
  {
    id: 2,
    slug: '5-razones-unir-pdfs-productividad',
    title: '5 Razones para Unir tus PDFs y Organizar tu Vida Digital',
    excerpt: '¿Tienes 10 archivos separados para un solo proyecto? Unirlos no solo es más ordenado, es más profesional y eficiente. Te decimos por qué.',
    category: 'Productividad',
    date: '1 de Noviembre, 2025',
    author: 'Luis Batista',
    bannerImage: 'https://placehold.co/1200x600/1E1E1E/00F0FF?text=Productividad+PDF',
    content: `
      <p class="text-lg text-gray-300 mb-6">Vivimos en una era de desorden digital. Si tu carpeta de "Proyecto Final" se ve así: <i>"portada.pdf", "intro.pdf", "cuerpo.pdf", "anexos_v1.pdf", "anexos_v2.pdf"</i>... estás perdiendo un tiempo valioso.</p>
      <p class="text-gray-300 mb-6">La función de "Unir PDF" parece simple, pero es una de las herramientas de productividad más infravaloradas. Aquí te damos 5 razones por las que deberías convertirla en parte de tu flujo de trabajo diario.</p>
      
      <h2 class="text-3xl font-bold text-white mt-10 mb-4">1. Profesionalismo y Presentación</h2>
      <p class="text-gray-300 mb-6">Imagina que eres un cliente. ¿Qué prefieres recibir? ¿Un archivo .zip con 12 documentos desordenados o un solo PDF pulido, paginado y coherente llamado <i>"Propuesta_Completa.pdf"</i>?</p>
      <p class="text-gray-300 mb-6">Enviar un solo archivo demuestra organización, respeto por el tiempo del receptor y control sobre tu trabajo. Es la diferencia entre parecer un aficionado y un profesional.</p>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">2. Búsqueda y Navegación Centralizada</h2>
      <p class="text-gray-300 mb-6">Necesitas encontrar un dato específico. En lugar de abrir 12 archivos y usar "Ctrl+F" (o "Cmd+F") en cada uno, abres un solo documento maestro y realizas una sola búsqueda. Lo que te tomaba 5 minutos ahora te toma 10 segundos.</p>
      <p class="text-gray-300 mb-6">Además, un PDF unido puede tener marcadores (bookmarks) y una tabla de contenido interna, permitiendo al lector navegar por tu documento de 100 páginas con un solo clic.</p>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">3. Impresión y Archivado sin Errores</h2>
      <p class="text-gray-300 mb-6">Este es un clásico del terror de oficina: imprimir 10 archivos, uno por uno, solo para descubrir que la impresora se atascó en el séptimo y ahora no sabes por dónde continuar. Al unir los archivos, envías un solo trabajo de impresión. Simple.</p>
      <p class="text-gray-300 mb-6">Lo mismo aplica para el archivado. Es infinitamente más fácil gestionar "Facturas_2025.pdf" que una carpeta con "Factura_Enero.pdf", "Factura_Febrero.pdf", etc.</p>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">4. Control de Versiones Racional</h2>
      <p class="text-gray-300 mb-6">Cuando tu proyecto está dividido, las revisiones son una pesadilla. ¿El cliente te mandó "cuerpo_v2.pdf"? Ahora tienes que recordar reemplazar el archivo "cuerpo.pdf" antiguo, pero mantener "intro.pdf" y "anexos.pdf".</p>
      <p class="text-gray-300 mb-6">Con un archivo maestro, el control de versiones es limpio: <i>"Propuesta_v1.pdf"</i>, <i>"Propuesta_v2.pdf"</i>. Sabes exactamente cuál es la versión más reciente y completa.</p>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">5. Seguridad y Portabilidad</h2>
      <p class="text-gray-300 mb-6">Es más fácil aplicar configuraciones de seguridad (como una contraseña o deshabilitar la impresión) a un solo archivo que a doce. Además, compartir un solo archivo reduce la probabilidad de que te olvides de adjuntar uno de los 12.</p>
      
      <div class="border-l-4 border-neon/50 bg-white/5 p-6 rounded-lg mt-8">
        <strong class="text-neon text-lg">El Flujo de Trabajo Ideal:</strong> Usa herramientas como "Unir PDF", luego "Numerar Páginas" y finalmente "Comprimir PDF" para obtener un archivo maestro, ordenado, profesional y ligero.
      </div>

      <div class="mt-12 border-t border-neon/20 pt-6">
        <h3 class="text-xl font-bold text-gray-300 mb-2">Referencias Reales</h3>
        <ul class="list-decimal list-inside text-gray-400 text-sm space-y-1">
          <li>Universidad de Washington. (2023). <a href="https://guides.lib.uw.edu/research/file-management" target="_blank" rel="noopener noreferrer" class="hover:underline">"File Naming & Management"</a>. UW Libraries.</li>
          <li>Universidad de Harvard. (2024). <a href="https://library.harvard.edu/services-tools/data-management-services/file-naming-conventions" target="_blank" rel="noopener noreferrer" class="hover:underline">"File Naming Conventions"</a>. Harvard Library.</li>
        </ul>
      </div>
    `
  },
  {
    id: 3,
    slug: 'seguridad-pdf-online-cliente-servidor',
    title: '¿Es Seguro Editar PDFs Online? Cliente vs. Servidor',
    excerpt: '¿A dónde van tus archivos cuando los subes a una web? Analizamos los dos tipos de herramientas y cuál es la más segura para tus documentos.',
    category: 'Seguridad',
    date: '28 de Octubre, 2025',
    author: 'Equipo PDFPulse',
    bannerImage: 'https://placehold.co/1200x600/1E1E1E/00F0FF?text=Seguridad+Online',
    content: `
      <p class="text-lg text-gray-300 mb-6">Necesitas editar un contrato, rotar un informe financiero o comprimir un documento de identidad. La forma más rápida es usar una herramienta online, pero esto implica subir un archivo potencialmente sensible a un servidor desconocido.</p>
      <p class="text-gray-300 mb-6">La seguridad de tus archivos depende de un factor clave que la mayoría de los usuarios desconoce: dónde se procesa el archivo. Esto se divide en dos categorías: procesamiento del lado del servidor y del lado del cliente.</p>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">Procesamiento del Lado del Servidor (El Modelo Tradicional)</h2>
      <p class="text-gray-300 mb-6">Este es el funcionamiento de la mayoría de las herramientas web (incluidas las herramientas de pago de PDFPulse que requieren tokens):</p>
      <ol class="list-decimal list-inside text-gray-300 mb-6 pl-4 space-y-2">
        <li>Tú seleccionas tu archivo (ej. <i>"mi_contrato.pdf"</i>).</li>
        <li>El archivo se <strong>sube</strong> a través de internet al servidor de la empresa.</li>
        <li>El servidor (una computadora potente en la nube) realiza la tarea (ej. comprime el archivo).</li>
        <li>El servidor te ofrece un enlace para descargar el archivo resultante.</li>
      </ol>
      <p class="text-gray-300 mb-6"><strong class="text-neon">¿Es seguro?</strong> Depende de la empresa. En PDFPulse, usamos cifrado <span class="tooltip-wrapper">SSL/TLS<span class="tooltip-text">El protocolo de seguridad (el "candado") que cifra la conexión entre tu navegador y nuestro servidor, impidiendo que te espíen.</span></span> para todas las subidas y bajadas. Además, nuestra política es estricta: tus archivos <strong class="text-neon">se eliminan automáticamente</strong> de nuestros servidores después de un corto período (ej. 1 hora). Nunca los leemos ni los compartimos.</p>
      <p class="text-gray-300 mb-6">El riesgo existe si usas sitios que no tienen una política de privacidad clara o que no usan HTTPS (el candado).</p>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">Procesamiento del Lado del Cliente (La Máxima Seguridad)</h2>
      <p class="text-gray-300 mb-6">Este es el futuro de las herramientas web, y es como funcionan la mayoría de las herramientas <strong class="text-neon">gratuitas</strong> de PDFPulse.</p>
      <ol class="list-decimal list-inside text-gray-300 mb-6 pl-4 space-y-2">
        <li>Tú seleccionas tu archivo (ej. <i>"mi_informe_secreto.pdf"</i>).</li>
        <li>La página web carga una aplicación <span class="tooltip-wrapper">JavaScript<span class="tooltip-text">El lenguaje de programación que se ejecuta dentro de tu propio navegador (Chrome, Firefox, etc.).</span></span> en tu navegador.</li>
        <li>Esa aplicación procesa tu archivo (ej. lo rota o divide) <strong>dentro de tu propia computadora</strong>.</li>
        <li>Tú descargas el archivo resultante directamente desde tu computadora.</li>
      </ol>
      <p class="text-gray-300 mb-6">El resultado es una velocidad instantánea y una privacidad absoluta, porque <strong class="text-neon">tu archivo nunca abandona tu dispositivo.</strong> Nunca se sube a internet.</p>

      <h2 class="text-3xl font-bold text-white mt-10 mb-4">¿Cuándo usar cada uno?</h2>
      <div class="border-l-4 border-neon/50 bg-white/5 p-6 rounded-lg mt-8">
        <ul class="list-disc list-inside text-gray-300 space-y-2">
          <li><strong>Usa herramientas del Lado del Cliente (Gratis en PDFPulse):</strong> Para tareas simples y cuando la privacidad es tu máxima prioridad (ej. Rotar, Dividir, Unir, Numerar Páginas).</li>
          <li><strong>Usa herramientas del Lado del Servidor (Tokens en PDFPulse):</strong> Para tareas complejas que tu navegador no puede hacer (ej. Comprimir con algoritmos avanzados, convertir Word a PDF) y asegúrate de hacerlo en un sitio de confianza (¡como el nuestro!) que garantice el cifrado y la eliminación de archivos.</li>
        </ul>
      </div>

      <div class="mt-12 border-t border-neon/20 pt-6">
        <h3 class="text-xl font-bold text-gray-300 mb-2">Referencias Reales</h3>
        <ul class="list-decimal list-inside text-gray-400 text-sm space-y-1">
          <li>OWASP. (2024). <a href="https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html" target="_blank" rel="noopener noreferrer" class="hover:underline">"File Upload Cheat Sheet"</a>. Open Web Application Security Project.</li>
          <li>Mozilla Developer Network (MDN). (2024). <a href="https://developer.mozilla.org/en-US/docs/Learn/Server-side/First_steps/Client-side_and_server-side" target="_blank" rel="noopener noreferrer" class="hover:underline">"Client-side vs. server-side"</a>.</li>
        </ul>
      </div>
    `
  }
];