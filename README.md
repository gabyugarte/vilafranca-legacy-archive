# 🏛️ Museo Digital del Barrio Vilafranca

> Archivo histórico digital para preservar, organizar y compartir la historia del Barrio Vilafranca.

El **Museo Digital del Barrio Vilafranca** es una aplicación web creada para conservar la memoria histórica de una comunidad y facilitar el acceso a fotografías, documentos, acontecimientos, organizaciones y testimonios que forman parte de su historia.

El proyecto combina **desarrollo web, gestión de datos, almacenamiento multimedia y participación comunitaria** en una plataforma diseñada para crecer con el tiempo.

La web busca resolver una necesidad concreta: transformar recuerdos, fotografías y documentos históricos que estaban dispersos en diferentes formatos en un **archivo digital organizado, accesible y participativo**.

> **La web conserva nuestra historia. Las redes muestran nuestra vida actual.**

---

## ✨ Características principales

### 📖 Historia del Barrio

La sección de Historia organiza la trayectoria del Barrio Vilafranca mediante capítulos históricos.

Cada capítulo puede contener diferentes tipos de bloques:

* Texto
* Imágenes individuales
* Galerías de fotografías
* Documentos
* Vídeos
* Información contextual

Los capítulos se gestionan dinámicamente desde la base de datos, por lo que es posible añadir nuevos capítulos sin tener que crear manualmente una nueva página en el código.

### 🖼️ Galería histórica

La galería permite consultar fotografías históricas del barrio.

Incluye:

* Fotografías aprobadas por el administrador
* Títulos
* Descripciones
* Fechas
* Categorías
* Organización relacionada
* Visualización ampliada
* Navegación entre fotografías
* Diseño responsive

Una misma fotografía puede estar relacionada con **más de una organización**, mediante una relación muchos-a-muchos.

### 👥 Organizaciones

El proyecto incluye un espacio dedicado a las organizaciones del barrio.

Actualmente contempla:

* Sociedad de Socorro
* Primaria
* Hombres Jóvenes
* Mujeres Jóvenes
* Escuela Dominical
* Cuórum de Élderes

Las páginas de organizaciones están planteadas como un archivo histórico e informativo, no como un directorio de liderazgo actual.

Cada organización puede incluir:

* Nombre
* Descripción
* Historia
* Imagen representativa
* Galería fotográfica relacionada

### 👔 Historia de los obispos

La sección de obispos permite conservar información histórica de quienes han servido como obispos del barrio.

El sistema permite registrar diferentes periodos de servicio de los consejeros, incluyendo:

* Primer consejero
* Segundo consejero
* Fecha de inicio
* Fecha de finalización
* Orden de los periodos

Esto permite representar cambios en los equipos de liderazgo sin perder la información histórica anterior.

### 📤 Participación de la comunidad

Una de las características principales del Museo es que **la comunidad puede contribuir a preservar su propia historia**.

Los miembros pueden aportar:

* Fotografías
* Recuerdos
* Documentos
* Información histórica
* Acontecimientos
* Material relacionado con el barrio

Las aportaciones pasan por un proceso de revisión antes de aparecer públicamente en el archivo.

De esta manera se busca mantener un equilibrio entre **participación comunitaria y calidad del archivo histórico**.

---

# 🧭 ¿Cómo utilizar el Museo?

## 1. Explorar la historia

Desde la sección **Historia**, el visitante puede acceder a los diferentes capítulos del archivo.

Cada capítulo presenta la información en bloques organizados cronológicamente y puede incluir fotografías, documentos y otros recursos.

Los capítulos pueden actualizarse y ampliarse desde el panel de administración.

---

## 2. Consultar fotografías

Desde **Galería** se pueden explorar las fotografías históricas disponibles.

Las imágenes pueden estar clasificadas por diferentes categorías, como:

* Hitos
* Liderazgo
* Sociedad de Socorro
* Primaria
* Hombres Jóvenes
* Mujeres Jóvenes
* Escuela Dominical
* Cuórum de Élderes
* Servicio
* Actividades
* General

Al seleccionar una fotografía se abre una vista ampliada con navegación entre imágenes.

---

## 3. Conocer las organizaciones

Desde **Organizaciones**, el visitante puede acceder a la información histórica de cada organización.

Las fotografías asociadas a una organización aparecen dentro de su propia página.

Una fotografía puede pertenecer simultáneamente a varias organizaciones cuando el acontecimiento representado corresponde a más de una.

---

## 4. Conocer la historia de los obispos

La sección **Obispos** permite consultar la sucesión histórica de los obispos del Barrio Vilafranca y los periodos registrados de sus consejeros.

La información se presenta de forma histórica, evitando convertir la sección en un directorio de liderazgo actual.

---

# 📸 ¿Cómo participar?

El Museo está pensado como un proyecto colaborativo.

Si tienes fotografías antiguas, documentos o recuerdos relacionados con el Barrio Vilafranca, puedes contribuir al archivo mediante la sección:

**Aportar a la historia**

Las aportaciones pueden incluir información como:

* Qué ocurrió
* Cuándo ocurrió
* Quiénes aparecen
* Dónde se realizó
* Qué organización estaba involucrada
* Cualquier otro contexto que ayude a conservar correctamente el recuerdo

El material enviado puede ser revisado antes de incorporarse al archivo público.

El objetivo no es solamente almacenar fotografías, sino **conservar el contexto que permite entenderlas dentro de la historia del barrio**.

---

# 🔐 Panel de administración

El proyecto incluye un área privada de administración para gestionar el contenido del Museo.

Desde el panel se pueden gestionar diferentes elementos del archivo.

### Historia

Los administradores pueden:

* Crear capítulos
* Editar capítulos
* Eliminar capítulos
* Cambiar el orden de los capítulos
* Añadir bloques
* Editar bloques
* Eliminar bloques
* Cambiar el orden de los bloques mediante drag & drop
* Subir imágenes
* Crear galerías
* Añadir descripciones
* Añadir documentos
* Gestionar contenido multimedia

### Orden de los bloques

Los bloques de cada capítulo pueden reorganizarse visualmente mediante **drag & drop**.

El nuevo orden se guarda automáticamente en Supabase, por lo que permanece después de cerrar y volver a abrir el panel.

Esto permite construir capítulos históricos de forma mucho más flexible sin depender de modificar directamente el código.

### Fotografías

El administrador puede revisar y gestionar las fotografías enviadas por los usuarios.

Las fotografías pueden tener:

* Título
* Descripción
* Fecha
* Año
* Categoría
* Estado de aprobación
* Organización u organizaciones relacionadas

---

# 🏗️ Arquitectura del proyecto

El proyecto está construido como una aplicación web moderna utilizando React y TypeScript.

La estructura de rutas está organizada de forma modular:

```text
src/
├── components/
│   ├── history-chapter.tsx
│   ├── history-gallery.tsx
│   ├── history-admin.tsx
│   ├── history-blocks-editor.tsx
│   ├── history-modal.tsx
│   ├── history-image.tsx
│   ├── bishops-admin.tsx
│   ├── site-header.tsx
│   └── site-footer.tsx
│
├── routes/
│   ├── index.tsx
│   ├── historia/
│   │   ├── index.tsx
│   │   ├── route.tsx
│   │   └── capitulo/
│   │       └── $chapterId.tsx
│   │
│   ├── obispos.tsx
│   ├── galeria.tsx
│   │
│   ├── organizaciones/
│   │   ├── index.tsx
│   │   ├── route.tsx
│   │   └── $slug.tsx
│   │
│   └── _authenticated/
│       ├── admin.tsx
│       └── aportar.tsx
│
├── data/
├── integrations/
└── lib/
```

---

# 🗄️ Base de datos

El proyecto utiliza **Supabase / PostgreSQL** como backend.

Entre las estructuras principales se encuentran:

### Historia

```text
history_chapters
history_blocks
```

Los capítulos contienen los bloques que forman cada historia.

Los bloques pueden representar diferentes tipos de contenido:

```text
text
image
gallery
document
video
```

---

### Fotografías

```text
gallery_photos
```

Almacena la información de las fotografías del archivo.

Incluye información como:

* título
* descripción
* URL
* fecha
* año
* categoría
* estado
* usuario que realizó la aportación

---

### Relación fotografías ↔ organizaciones

```text
gallery_photo_organizations
```

Se utiliza una relación **muchos-a-muchos**.

Esto permite que una fotografía pueda estar relacionada con varias organizaciones.

Por ejemplo:

```text
Fotografía
   ↓
Sociedad de Socorro
   +
Primaria
```

sin tener que duplicar físicamente la fotografía.

---

### Organizaciones

```text
organizations
```

Contiene la información histórica de las diferentes organizaciones del barrio.

---

### Obispos

```text
bishops
bishop_counselor_periods
```

La tabla de periodos de consejeros permite conservar diferentes equipos de consejeros a lo largo del tiempo.

---

### Documentos históricos

```text
historical_documents
```

Permite almacenar documentos relacionados con la historia del barrio y mantenerlos vinculados con determinadas entidades cuando sea necesario.

---

# 🛠️ Tecnologías utilizadas

## Frontend

* **React**
* **TypeScript**
* **TanStack Router**
* **TanStack Start**
* **Tailwind CSS**
* **Lucide React**

La aplicación utiliza componentes reutilizables y rutas dinámicas para evitar duplicación de código.

---

## Backend y datos

* **Supabase**
* **PostgreSQL**
* Supabase Storage
* Server Functions
* Relaciones entre tablas
* Consultas tipadas

Supabase se utiliza para:

* Base de datos
* Autenticación
* Almacenamiento de imágenes
* Gestión de contenido
* Datos históricos
* Fotografías
* Organizaciones
* Información de obispos

---

## Desarrollo y control de versiones

* **Git**
* **GitHub**
* **Visual Studio Code**
* **Node.js / npm**

El proyecto utiliza Git para mantener un historial de cambios y GitHub como repositorio principal.

---

## Deploy

La aplicación está desplegada mediante:

**Vercel**

El repositorio de GitHub está conectado al proyecto de Vercel, permitiendo desplegar los cambios realizados en la rama principal.

---

# 🤖 Uso de inteligencia artificial

La inteligencia artificial se utilizó como herramienta de apoyo durante diferentes etapas del proyecto.

Se empleó para:

* Explorar soluciones técnicas
* Diseñar estructuras de componentes
* Resolver errores
* Analizar problemas de arquitectura
* Generar y revisar código
* Mejorar consultas a Supabase
* Diseñar funcionalidades
* Revisar experiencia de usuario
* Documentar el proyecto

La implementación, pruebas, decisiones de arquitectura, configuración y validación del proyecto fueron realizadas de forma iterativa durante el desarrollo.

El objetivo del uso de IA fue **acelerar el proceso de aprendizaje y desarrollo**, manteniendo el control humano sobre las decisiones y el resultado final.

---

# 🧩 Desarrollo iterativo

El Museo no fue construido como una aplicación estática desde el principio.

Se desarrolló progresivamente, incorporando funcionalidades a medida que aparecían nuevas necesidades.

Algunos ejemplos:

### Sistema histórico dinámico

Inicialmente la historia podía estar representada mediante contenido más rígido.

Posteriormente se desarrolló un sistema basado en capítulos y bloques dinámicos para permitir:

```text
Capítulo
 ├── Texto
 ├── Imagen
 ├── Galería
 ├── Documento
 └── Vídeo
```

Esto permitió convertir la historia en un sistema de contenido extensible.

### Galerías reutilizables

El componente de galería fue diseñado para poder utilizarse tanto en:

* capítulos históricos
* organizaciones
* galería general

manteniendo una experiencia visual consistente.

### Drag & Drop

Se añadió la posibilidad de reorganizar visualmente los bloques históricos mediante arrastrar y soltar.

El nuevo orden se persiste en la base de datos.

### Contenido relacionado

Se implementó una relación muchos-a-muchos entre fotografías y organizaciones para evitar duplicación y permitir una clasificación más flexible.

---

# 📱 Diseño responsive

El Museo está diseñado para funcionar en:

* 📱 móviles
* 📲 tablets
* 💻 ordenadores

Los componentes se adaptan a diferentes tamaños de pantalla mediante Tailwind CSS.

La experiencia de navegación y las galerías han sido especialmente revisadas para dispositivos móviles.

---

# 🎨 Identidad visual

La identidad visual utiliza principalmente:

```text
Navy      #0A1659
Blue      #377FCC
White     #FFFFFF
```

La interfaz busca transmitir:

* Historia
* Comunidad
* Serenidad
* Confianza
* Cercanía
* Modernidad

manteniendo una estética relacionada con el carácter histórico y comunitario del proyecto.

---

# 🔒 Privacidad y seguridad

El proyecto incorpora diferentes mecanismos para separar el contenido público del área de administración.

Las aportaciones de usuarios pueden permanecer en estado pendiente hasta que sean revisadas.

El contenido histórico publicado se diferencia del contenido que todavía está en proceso de revisión.

La autenticación y las operaciones sensibles se gestionan mediante Supabase y rutas protegidas.

---

# 🌱 Próximas mejoras

El proyecto continúa siendo ampliable.

Entre las mejoras previstas se encuentra:

### 🌍 Sistema bilingüe

Añadir soporte para:

* 🇪🇸 Castellano
* 🟡🔴 Català

La primera fase prevista será traducir la interfaz de navegación y los elementos principales del sitio.

Posteriormente se podrá estudiar la traducción del contenido histórico almacenado en Supabase.

### 🔎 Búsqueda histórica

Implementar una búsqueda que permita localizar:

* personas
* acontecimientos
* años
* organizaciones
* fotografías
* capítulos

### 🗂️ Más contenido histórico

Continuar incorporando fotografías, documentos y recuerdos aportados por la comunidad.

### 🎥 Contenido multimedia

Ampliar el soporte para vídeos y otros recursos audiovisuales históricos.

---

# 📚 Objetivo del proyecto

El Museo Digital del Barrio Vilafranca nace con una idea sencilla:

> **La historia de una comunidad no está solamente en los grandes acontecimientos, sino también en las fotografías, las personas y los pequeños recuerdos que se conservan a lo largo del tiempo.**

Digitalizar este material permite:

* conservarlo
* organizarlo
* compartirlo
* facilitar su consulta
* evitar que se pierda con el paso de las generaciones

El proyecto convierte un conjunto de recuerdos y documentos dispersos en un **archivo digital vivo y participativo**.

---

# 👩‍💻 Proyecto y desarrollo

**Proyecto:** Museo Digital del Barrio Vilafranca

**Desarrollo y diseño:** Gabriela Ugarte Maco

**Repositorio:** GitHub

**Deploy:** Vercel

**Backend:** Supabase

Este proyecto forma parte de mi portfolio de desarrollo web y representa un proyecto real desarrollado para resolver una necesidad concreta de una comunidad.

El proyecto comenzó como un prototipo y posteriormente fue desarrollado, personalizado y ampliado mediante código, incorporando arquitectura dinámica, base de datos, autenticación, gestión de contenido, almacenamiento multimedia y funcionalidades administrativas.

---

# 📄 Licencia

Este proyecto es un archivo histórico creado para una comunidad específica.

El código puede servir como referencia técnica o educativa, pero el contenido histórico, fotografías, documentos y material aportado por los miembros de la comunidad pueden estar sujetos a derechos de autor, privacidad o autorización de uso.

Antes de reutilizar cualquier contenido histórico o multimedia, debe solicitarse la correspondiente autorización.

---

## ❤️ Una historia que continúa

El Museo Digital no pretende ser un archivo cerrado.

Cada fotografía, documento, recuerdo y testimonio puede ayudar a completar una parte de la historia que todavía falta por contar.

**La historia continúa. Y ahora también puede conservarse digitalmente.**
