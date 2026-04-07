# 📦 Bondi Media System

**Sistema de gestión de contenido para redes sociales — Fase BETA**

Este repositorio contiene el backend, frontend y documentación del **sistema estratégico de gestión de contenido** desarrollado para Bondi Media.  
Su propósito es estructurar la planificación, ejecución y medición de contenido con un enfoque estratégico, repetible y medible, y no solo replicar publicaciones sin criterio.

---

## 🧠 Objetivo del proyecto

Bondi Media System nace para resolver un problema claro:

> Publicar contenido sin estrategia no genera resultados reales.

Este sistema fue diseñado para:
- Planificar contenido con objetivos definidos
- Asociar cada pieza con métricas que importan
- Automatizar workflows de publicación y medición
- Proveer una interfaz para gestionar publicaciones, datos y métricas

No es una herramienta de publicación automática, sino un **framework estratégico completo**.

---

## 🧱 Estructura del repositorio

📁 bondi-media-system
├── 📁 assets/ # Imágenes y recursos estáticos
├── 📁 docs/ # Documentación del sistema
├── 📁 backups/ # Respaldos del sistema
├── 📁 css/ # Estilos globales
├── 📁 js/ # Scripts de interfaz
├── 📁 json/ # Datos de ejemplo / configuraciones
├── 📁 python/ # Scripts y lógica de servidor
├── 📁 .env # Variables de entorno (no versionado)
├── 📁 bondi_db.sql # Estructura de la base de datos
├── 📁 client-portal.html # Interfaz cliente
├── 📁 dashboard.html # Interfaz de administración
├── 📁 login.html # Pantalla de acceso
├── 📁 register.html # Registro
├── 📁 plantilla_prompts.txt # Prompts predefinidos
└── 📁 info.txt # Instrucciones internas


---

## 🛠️ Componentes principales

### 🔐 Autenticación
- `login.html` / `register.html`  
  Sistema de acceso para usuarios y administradores.

### 📊 Dashboards
- `dashboard.html`  
  Panel principal para planificar y medir contenido.

- `client-portal.html`  
  Interfaz para que clientes visualicen métricas y avances.

---

## 📦 Backend

El directorio `python/` contiene:

- Lógica del servidor
- Endpoints utilizados para servir dashboards y gestionar datos
- Integraciones internas

También se incluye `bondi_db.sql`, la estructura de base de datos (tablas, relaciones, datos base).

---

## 📋 Plantillas y prompts

- `plantilla_prompts.txt` contiene prompts preconfigurados para automatizar tareas de edición y generación de texto (ej. con modelo Claude o GPT).
- `info.txt` contiene reglas internas sobre prompts y procesos de corrección automatizada.

> Ejemplo de prompt interno:
> “Actúa como editor de contenido… Mantén la estructura original y modifica únicamente lo necesario.” :contentReference[oaicite:1]{index=1}

---

## 🎯 Principios estratégicos del sistema

Bondi Media System no solo gestiona publicaciones:  
Está diseñado para que el contenido:

- Sea **medible**
- Tenga **objetivos claros**
- Funcione con métricas que valen (guardados, DMs, respuestas)
- Esté asociado a un plan mensual
- Se vincule a métricas reales de negocio

---

## 📈 Flujo de trabajo (high-level)

1. **Brief estratégico** → objetivos, públicos y tono  
2. **Planificación mensual** → calendario editorial  
3. **Producción de contenido** (copy, guiones, prompts)  
4. **Publicación optimizada**
5. **Medición de resultados**
6. **Iteración y ajuste**

Este flujo convierte el contenido en **proceso repetible y escalable**.

---

## 📁 Cómo usar este repositorio

1. Clonar el proyecto
   ```bash
   git clone https://github.com/tomasg1985/bondi-media-system.git

   Instalar dependencias (según requirements.txt)
Configurar variables de entorno en .env
Inicializar base de datos con bondi_db.sql
Correr servidor y acceder a panel de administración
📂 ¿Qué hay en la carpeta docs/?

Contiene documentación técnica, diagramas de flujo y manuales de uso de cada módulo del sistema.

🚀 Contribuciones

Este sistema está en fase Beta y sigue evolucionando.
Si querés contribuir, sugerir mejoras o reportar bugs, usá la sección Issues en GitHub o contacta al equipo de desarrollo.

🧾 Licencia

Este repositorio es parte de los productos internos de Bondi Media y puede estar sujeto a restricciones. Consultar con el equipo de desarrollo antes de redistribuir.

📌 Contacto

📍 Bondi Media — Estrategias que generan clientes
📸 Instagram: @elbondi_media

---

Si querés, también puedo:

👉 Generarte un **GitHub Pages README visual** con gráficos  
👉 Armar un **Diagrama de flujo del sistema** para subir al repositorio  
👉 Documentar cada archivo para que otros puedan desarrollarlo fácilmente

Sólo pedímelo.
