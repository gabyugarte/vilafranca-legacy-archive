# Museo Digital del Barrio Vilafranca

Museo Digital del Barrio Vilafranca es una aplicación web creada para preservar, organizar y compartir la historia del Barrio Vilafranca.

El proyecto funciona como un archivo histórico digital donde se pueden consultar diferentes capítulos de la historia del barrio, incluyendo textos, fotografías, documentos, vídeos y otros contenidos históricos.

La aplicación también incorpora un sistema de administración que permite gestionar capítulos, ordenar el contenido, añadir diferentes tipos de bloques históricos y administrar la información de los obispos y sus períodos de servicio.

## 🚀 Tecnologías utilizadas

* **Next.js / React** — desarrollo de la interfaz y arquitectura de la aplicación.
* **TypeScript** — tipado y desarrollo más seguro y mantenible.
* **TanStack Start / TanStack Router** — gestión de rutas y estructura de la aplicación.
* **Supabase** — base de datos PostgreSQL, consultas y gestión de datos.
* **Tailwind CSS** — diseño y estilos de la interfaz.
* **Lucide React** — iconos de la aplicación.
* **Git / GitHub** — control de versiones y gestión del código fuente.
* **Vercel** — despliegue y publicación de la aplicación.
* **Lovable** — utilizado como punto de partida para el prototipo inicial del proyecto, que posteriormente fue desarrollado, adaptado y ampliado mediante código.

## 🗄️ Base de datos

La aplicación utiliza **Supabase con PostgreSQL** para almacenar y gestionar la información histórica.

Entre las principales estructuras de datos se encuentran:

* Capítulos históricos.
* Bloques de contenido.
* Galerías de fotografías.
* Información de los obispos.
* Períodos de servicio de los obispos.
* Períodos de servicio de sus consejeros.
* Contenido multimedia asociado al archivo histórico.

La estructura permite ampliar el museo añadiendo nuevos capítulos y contenidos sin necesidad de crear manualmente nuevas páginas para cada capítulo.

## 🏛️ Sistema de historia digital

La sección histórica utiliza una estructura dinámica basada en capítulos.

Cada capítulo puede contener diferentes tipos de contenido, como:

* Texto histórico.
* Fotografías.
* Galerías.
* Documentos.
* Vídeos.
* Citas.
* Descripciones y material complementario.

El sistema está diseñado para que el contenido histórico pueda crecer progresivamente manteniendo una estructura organizada.

## 👤 Panel de administración

El proyecto incorpora un área privada de administración para gestionar el contenido histórico.

Desde el panel es posible:

* Crear capítulos.
* Editar capítulos.
* Reordenar capítulos.
* Eliminar capítulos.
* Añadir y editar bloques de contenido.
* Gestionar galerías de imágenes.
* Gestionar información de los obispos.
* Registrar diferentes períodos de servicio.
* Registrar los períodos de los consejeros.
* Previsualizar el contenido antes de publicarlo.

## 📸 Archivo fotográfico

Las galerías permiten organizar fotografías históricas dentro de cada capítulo.

Las imágenes pueden visualizarse en formato de galería y abrirse individualmente mediante un visor con navegación entre fotografías.

## 🔗 Arquitectura del proyecto

El sitio utiliza rutas dinámicas para los capítulos históricos.

Por ejemplo:

`/historia`

muestra el listado de capítulos, mientras que:

`/historia/capitulo/[chapterId]`

permite acceder dinámicamente al contenido de cada capítulo.

Esto permite añadir nuevos capítulos desde el sistema de administración sin tener que crear una nueva ruta manualmente.

## 🌐 Despliegue

El proyecto utiliza **GitHub** como repositorio principal y **Vercel** para el despliegue de la aplicación.

Los cambios realizados en la rama principal pueden integrarse con el entorno de producción mediante el flujo de desarrollo basado en Git.

## 🤖 Uso de herramientas de IA

El proyecto comenzó utilizando **Lovable como herramienta de prototipado y punto de partida**.

A partir de esa base, el proyecto fue progresivamente desarrollado y personalizado mediante código, incorporando nuevas funcionalidades, modificaciones de arquitectura, integración con Supabase, sistema de administración, gestión histórica y mejoras de interfaz.

La IA se utilizó como herramienta de apoyo dentro del proceso de desarrollo, mientras que la implementación, adaptación, depuración y evolución del proyecto se realizaron sobre el código del repositorio.

## 🎯 Objetivo

El objetivo del Museo Digital del Barrio Vilafranca es conservar la memoria histórica del barrio y facilitar el acceso a fotografías, documentos y testimonios que forman parte de su historia.

> **La web conserva nuestra historia. Las redes muestran nuestra vida actual.**
