# ==================================================
# GENERADOR DE COPIES CON IA
# ==================================================

import random

class CopyGenerator:
    def __init__(self):
        self.hook_templates = [
            "¿Sabías que {valor} de las personas {accion}?",
            "Esto es lo que {experto} recomienda para {objetivo}",
            "El error que comete el {porcentaje}% al {accion}",
            "La verdad sobre {tema} que nadie te cuenta",
            "{numero} formas de {objetivo} sin {gasto}",
            "Deja de {accion} si quieres {resultado}",
            "Lo que {competencia} no quiere que sepas"
        ]
        
        self.body_templates = [
            "En este post te voy a contar {cantidad} cosas que {beneficio}:\n\n{lista}",
            "Después de {experiencia} años aprendí que {leccion}.\n\nAcá te comparto:",
            "La mayoría de las personas {error}, pero vos podés {solucion}.\n\nMirá:",
            "Si querés {objetivo}, tenés que {accion}.\n\nTe explico:"
        ]
        
        self.cta_templates = [
            "Escribí {keyword} para recibir la guía completa",
            "Guardá este post para tenerlo siempre a mano",
            "Compartí con alguien que necesite {tema}",
            "Contame en comentarios, ¿{pregunta}?",
            "Hacé clic en el link de mi bio para más info"
        ]
    
    def generate_reel_copy(self, topic, audience, cta_keyword):
        """Genera copy para reel"""
        hooks = [
            f"🚨 ¡Atención {audience}!",
            f"¿Sabías que el 80% de {audience} no sabe {topic}?",
            f"Dejá de hacer esto si querés {topic}"
        ]
        
        bodies = [
            f"En 60 segundos te explico:\n✅ Punto 1\n✅ Punto 2\n✅ Punto 3",
            f"La verdad sobre {topic} que nadie te cuenta. Mirá el video completo."
        ]
        
        ctas = [
            f"👉 Escribí {cta_keyword} para más info",
            f"💬 Contame, ¿ya sabías esto?"
        ]
        
        return f"{random.choice(hooks)}\n\n{random.choice(bodies)}\n\n{random.choice(ctas)}"
    
    def generate_carousel_copy(self, topic, slides, cta_keyword):
        """Genera copy para carrusel"""
        copy = f"📊 {topic.upper()}: GUÍA COMPLETA\n\n"
        
        for i in range(1, slides + 1):
            copy += f"📌 SLIDE {i}: Contenido del slide {i}\n"
        
        copy += f"\nGuardá este post para tenerlo siempre\n"
        copy += f"👉 Escribí {cta_keyword} y te ayudo"
        
        return copy
    
    def generate_stories_script(self, topic, stories_count):
        """Genera guión para stories"""
        script = ""
        stickers = ['encuesta', 'quiz', 'slider', 'preguntas', 'countdown']
        
        for i in range(1, stories_count + 1):
            sticker = random.choice(stickers)
            script += f"📱 HISTORIA {i}: {topic} - parte {i}\n"
            script += f"   Sticker sugerido: {sticker}\n\n"
        
        return script

copy_generator = CopyGenerator()