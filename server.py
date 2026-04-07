import os
import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# 1. Cargar variables de entorno del archivo .env
load_dotenv()

# 2. Configuración de Seguridad: Validar que las claves existan
API_KEY = os.getenv('ANTHROPIC_API_KEY')
DB_PASS = os.getenv('DB_PASS')

if not API_KEY:
    raise ValueError("❌ ERROR: No se encontró ANTHROPIC_API_KEY en el archivo .env")

# 3. Inicializar Flask
app = Flask(__name__)
CORS(app)

# Configuración de Logs para el hosting
logging.basicConfig(level=logging.INFO)

# 4. Importar tu lógica (Ajustado según tu estructura de carpetas)
try:
    from python.ai_assistant import ai_assistant
    from python.copy_generator import copy_generator
    from python.hashtag_analyzer import hashtag_analyzer
except ImportError as e:
    logging.error(f"❌ Error de importación: {e}")

# ==================================================
# ENDPOINTS DEL SISTEMA (Integrados con .env)
# ==================================================

@app.route('/api/ai/generate-copy', methods=['POST'])
def generate_copy():
    try:
        data = request.json
        if not data:
            return jsonify({'error': 'Datos no proporcionados'}), 400

        # Aquí tu lógica usa la API_KEY cargada desde el .env automáticamente
        copy = copy_generator.generate_reel_copy(
            topic=data.get('topic', 'marketing'),
            audience=data.get('audience', 'emprendedores'),
            cta=data.get('cta', 'INFO')
        )
        
        return jsonify({'status': 'success', 'copy': copy})

    except Exception as e:
        logging.error(f"Error en generate-copy: {str(e)}")
        return jsonify({'error': 'Error interno en la generación'}), 500

@app.route('/api/ai/generate-hook', methods=['POST'])
def generate_hook():
    data = request.json
    hook = ai_assistant.generate_hook(
        data.get('topic', 'marketing'),
        data.get('audience', 'emprendedores'),
        data.get('goal', 'más clientes')
    )
    return jsonify({'hook': hook})

# Endpoint de prueba técnica para verificar que el .env funciona
@app.route('/api/system/check-env', methods=['GET'])
def check_env():
    return jsonify({
        'api_key_loaded': bool(API_KEY),
        'db_pass_loaded': bool(DB_PASS),
        'status': 'System Secure'
    })

# ==================================================
# EJECUCIÓN (Configuración para Hosting)
# ==================================================
if __name__ == '__main__':
    # Usamos puerto dinámico para Hostinger/WNPower
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port, debug=False)
