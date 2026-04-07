#!/bin/bash

# --- Script de Instalación Automática para Agencia CMS ---

echo "🚀 Iniciando configuración del entorno..."

# 1. Crear entorno virtual si no existe
if [ ! -d "venv" ]; then
    echo "📦 Creando entorno virtual (venv)..."
    python3 -m venv venv
fi

# 2. Activar entorno virtual
source venv/bin/activate

# 3. Actualizar pip e instalar dependencias
echo "📥 Instalando librerías desde requirements.txt..."
pip install --upgrade pip
pip install -r requirements.txt

# 4. Verificar archivo .env
if [ ! -f ".env" ]; then
    echo "⚠️ ADVERTENCIA: No se encontró el archivo .env"
    echo "Creando una plantilla de .env para que la completes..."
    echo "ANTHROPIC_API_KEY=tu_clave_aqui" > .env
    echo "DB_HOST=localhost" >> .env
    echo "DB_NAME=nombre_db" >> .env
    echo "DB_USER=usuario_db" >> .env
    echo "DB_PASS=password_db" >> .env
else
    echo "✅ Archivo .env detectado correctamente."
fi

echo "-----------------------------------------------"
echo "✅ ¡Configuración completada con éxito!"
echo "Para arrancar el servidor usa: python server.py"
echo "-----------------------------------------------"
