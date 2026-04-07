import mysql.connector
import os
import re

def cargar_plantillas():
    """
    Carga las plantillas desde plantilla_prompts.txt
    """
    ruta_plantilla = os.path.join(os.path.dirname(__file__), '..', 'plantilla_prompts.txt')
    plantillas = {}

    try:
        with open(ruta_plantilla, 'r', encoding='utf-8') as f:
            contenido = f.read()

        # Extraer secciones entre [PLANTILLA_...] y [/PLANTILLA_...]
        patron = r'\[PLANTILLA_([^\]]+)\](.*?)\[/PLANTILLA_\1\]'
        matches = re.findall(patron, contenido, re.DOTALL)

        for nombre, plantilla in matches:
            plantillas[nombre.lower()] = plantilla.strip()

        return plantillas
    except FileNotFoundError:
        print("Advertencia: plantilla_prompts.txt no encontrado")
        return {}

def obtener_prompt_personalizado(id_cliente, tema_post, tipo_accion="generacion"):
    """
    Extrae datos del cliente y rellena la plantilla automáticamente.
    tipo_accion: 'generacion' (Sonnet) o 'correccion' (Haiku)
    """
    # 1. Conexión a tu DB de Hostinger/WNPower
    db = mysql.connector.connect(
        host="localhost",
        user="tu_usuario",
        password="tu_password",
        database="tu_db"
    )
    cursor = db.cursor(dictionary=True)

    # 2. Traer la "Brand Voice" y datos del cliente
    cursor.execute("SELECT nombre_agencia, brand_voice, hashtags_fijos FROM clientes WHERE id_cliente = %s", (id_cliente,))
    cliente = cursor.fetchone()

    if not cliente:
        return "Error: Cliente no encontrado"

    # 3. Cargar plantillas
    plantillas = cargar_plantillas()

    # 4. Lógica de Autocompletado según la acción
    if tipo_accion == "generacion":
        plantilla_base = plantillas.get('plantilla_generacion_post', '')
        if plantilla_base:
            prompt_final = plantilla_base.format(
                NOMBRE_AGENCIA=cliente['nombre_agencia'],
                BRAND_VOICE=cliente['brand_voice'],
                AUDIENCIA="emprendedores",  # Esto podría venir de DB
                LIMITE_PALABRAS=150,
                TEMA_POST=tema_post,
                PLATAFORMA="Instagram",
                TONO_VOICE="Profesional pero cercano",
                HASHTAGS_FIJOS=cliente['hashtags_fijos']
            )
        else:
            # Fallback al prompt original
            prompt_final = f"""
            Actúa como el Social Media Manager de {cliente['nombre_agencia']}.
            CONTEXTO DE MARCA: {cliente['brand_voice']}

            TAREA: Genera un post sobre: {tema_post}.
            REQUISITOS:
            1. Hook potente.
            2. Cuerpo con valor.
            3. CTA claro.
            4. Incluir estos hashtags fijos: {cliente['hashtags_fijos']}

            Responde solo con el texto del post listo para publicar.
            """
    else:
        # Para correcciones (ahorro de tokens con Haiku)
        plantilla_correccion = plantillas.get('plantilla_correccion', '')
        if plantilla_correccion:
            prompt_final = plantilla_correccion.format(
                NOMBRE_AGENCIA=cliente['nombre_agencia'],
                TEXTO_ORIGINAL=tema_post,  # En corrección, tema_post sería el texto original
                INSTRUCCION_CLIENTE="corrección solicitada",  # Esto vendría del parámetro
                BRAND_VOICE=cliente['brand_voice']
            )
        else:
            prompt_final = f"Como editor de {cliente['nombre_agencia']}, ajusta el post anterior. Pedido: {tema_post}. Mantén el estilo: {cliente['brand_voice']}"

    cursor.close()
    db.close()

    return prompt_final

def generar_prompt_hook(id_cliente, tema, audiencia, objetivo):
    """
    Genera prompt para hooks usando plantilla
    """
    plantillas = cargar_plantillas()
    plantilla_hook = plantillas.get('plantilla_hook_generico', '')

    if plantilla_hook:
        return plantilla_hook.format(
            TEMA=tema,
            AUDIENCIA=audiencia,
            OBJETIVO_MARKETING=objetivo
        )
    else:
        return f"Genera 3 hooks atractivos para un post sobre '{tema}' dirigido a {audiencia}."

def generar_prompt_hashtags(id_cliente, tema_post, plataforma):
    """
    Genera prompt para sugerencias de hashtags
    """
    # Obtener hashtags fijos del cliente
    db = mysql.connector.connect(
        host="localhost",
        user="tu_usuario",
        password="tu_password",
        database="tu_db"
    )
    cursor = db.cursor(dictionary=True)
    cursor.execute("SELECT hashtags_fijos FROM clientes WHERE id_cliente = %s", (id_cliente,))
    cliente = cursor.fetchone()
    cursor.close()
    db.close()

    hashtags_fijos = cliente['hashtags_fijos'] if cliente else ""

    plantillas = cargar_plantillas()
    plantilla_hashtags = plantillas.get('plantilla_hashtags', '')

    if plantilla_hashtags:
        return plantilla_hashtags.format(
            TEMA_POST=tema_post,
            PLATAFORMA=plataforma,
            HASHTAGS_FIJOS=hashtags_fijos
        )
    else:
        return f"Sugiere hashtags para un post sobre '{tema_post}' en {plataforma}."
