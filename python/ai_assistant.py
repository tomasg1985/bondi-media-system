# ==================================================
# ASISTENTE IA - ANÁLISIS Y SUGERENCIAS
# ==================================================

import json
import numpy as np
from datetime import datetime, timedelta
from textblob import TextBlob
import random

class AIAssistant:
    def __init__(self):
        self.templates = {
            'hook': [
                "¿Sabías que {valor}?",
                "Nadie te dice esto sobre {tema}",
                "Esto es lo que {competencia} no quiere que sepas",
                "El secreto de {tema} que pocos conocen",
                "{numero} señales de que necesitas {accion}",
                "Deja de hacer esto si quieres {objetivo}"
            ],
            'cta': [
                "Escribí {keyword} para saber más",
                "Guardá este post para después",
                "Compartí con alguien que necesite {tema}",
                "Contame en comentarios, ¿{pregunta}?",
                "Hacé clic en el link de mi bio"
            ],
            'tips': [
                "Los mejores horarios son {horarios}",
                "Usá {cantidad} hashtags relevantes",
                "Incluí {elemento} en tus primeros 3 segundos",
                "Probá con {formato} para más engagement"
            ]
        }
        
        self.hashtag_suggestions = {
            'branding': ['#Branding', '#Marca', '#Identidad', '#Posicionamiento', '#Diseño'],
            'marketing': ['#Marketing', '#MarketingDigital', '#RedesSociales', '#Contenido', '#Estrategia'],
            'web': ['#DiseñoWeb', '#DesarrolloWeb', '#UX', '#LandingPage', '#Conversión'],
            'negocios': ['#Emprendimiento', '#Negocios', '#PyMEs', '#Crecimiento', '#Ventas']
        }
        
    def analyze_content(self, content_data):
        """Analiza contenido existente y genera sugerencias"""
        suggestions = []
        
        # Analizar rendimiento
        if content_data.get('metrics'):
            metrics = content_data['metrics']
            
            # Sugerencia basada en engagement
            if metrics.get('engagement', 0) < 50:
                suggestions.append({
                    'type': 'engagement',
                    'title': '📈 Mejorar engagement',
                    'suggestion': 'Probá con preguntas en el copy o stickers interactivos',
                    'confidence': 0.85
                })
            
            # Sugerencia basada en alcance
            if metrics.get('reach', 0) < 1000:
                suggestions.append({
                    'type': 'reach',
                    'title': '🎯 Aumentar alcance',
                    'suggestion': 'Usá hashtags más específicos y publicá en horarios pico',
                    'confidence': 0.75
                })
        
        # Analizar copy
        if content_data.get('copy'):
            blob = TextBlob(content_data['copy'])
            sentiment = blob.sentiment.polarity
            
            if sentiment < 0.1:
                suggestions.append({
                    'type': 'sentiment',
                    'title': '😊 Tono más positivo',
                    'suggestion': 'Agregá un tono más entusiasta o motivador',
                    'confidence': 0.9
                })
        
        return suggestions
    
    def generate_hook(self, topic, audience, goal):
        """Genera hooks atractivos"""
        templates = [
            f"¿Sabías que el 80% de {audience} no sabe {topic}?",
            f"Deja de hacer esto si quieres {goal}",
            f"El secreto de {topic} que nadie te cuenta",
            f"3 señales de que necesitas {topic} YA",
            f"Lo que {audience} debería saber sobre {topic}"
        ]
        return random.choice(templates)
    
    def generate_copy(self, content_type, topic, cta_keyword):
        """Genera copies completos"""
        copies = {
            'reel': f"🎬 {self.generate_hook(topic, 'tu audiencia', 'más alcance')}\n\n" +
                    f"En este reel te cuento:\n" +
                    f"✅ Primer punto clave\n" +
                    f"✅ Segundo punto importante\n" +
                    f"✅ Tercer punto que no sabías\n\n" +
                    f"Mirá hasta el final y descubrí cómo {topic}\n\n" +
                    f"👉 Escribí {cta_keyword} para más info",
            
            'carousel': f"📊 {topic.upper()}: GUÍA COMPLETA\n\n" +
                        f"Slide 1: Introducción\n" +
                        f"Slide 2: Punto 1\n" +
                        f"Slide 3: Punto 2\n" +
                        f"Slide 4: Punto 3\n" +
                        f"Slide 5: Conclusión\n\n" +
                        f"Guardá este post para tenerlo siempre\n" +
                        f"#{topic.replace(' ', '')} #Guía",
            
            'stories': f"📱 Historia 1: ¿{topic}?\n" +
                       f"📱 Historia 2: Encuesta: ¿Lo sabías?\n" +
                       f"📱 Historia 3: Dato importante\n" +
                       f"📱 Historia 4: Pregunta final\n" +
                       f"📱 Historia 5: Link en bio"
        }
        return copies.get(content_type, copies['reel'])
    
    def suggest_hashtags(self, topic, count=5):
        """Sugiere hashtags relevantes"""
        hashtags = []
        topic_lower = topic.lower()
        
        # Buscar hashtags relacionados
        for key, tags in self.hashtag_suggestions.items():
            if key in topic_lower or any(word in topic_lower for word in key.split()):
                hashtags.extend(tags)
        
        # Si no encuentra, usar genéricos
        if not hashtags:
            hashtags = ['#MarketingDigital', '#RedesSociales', '#Contenido', '#Tips', '#Estrategia']
        
        # Mezclar y limitar
        random.shuffle(hashtags)
        return hashtags[:count]
    
    def analyze_sentiment(self, text):
        """Analiza sentimiento de un texto"""
        blob = TextBlob(text)
        sentiment = blob.sentiment.polarity
        
        if sentiment > 0.3:
            return {'sentiment': 'positivo', 'score': sentiment}
        elif sentiment < -0.3:
            return {'sentiment': 'negativo', 'score': sentiment}
        else:
            return {'sentiment': 'neutral', 'score': sentiment}
    
    def get_best_posting_time(self, historical_data):
        """Analiza mejores horarios basado en histórico"""
        if not historical_data:
            return {'hour': 20, 'day': 'Miércoles', 'confidence': 0.5}
        
        hours = []
        for data in historical_data:
            if data.get('time'):
                hour = int(data['time'].split(':')[0])
                hours.append(hour)
        
        if hours:
            best_hour = max(set(hours), key=hours.count)
            confidence = min(0.9, len(hours) / 20)
            return {'hour': best_hour, 'day': 'Variable', 'confidence': confidence}
        
        return {'hour': 20, 'day': 'Miércoles', 'confidence': 0.5}

# Instancia global
ai_assistant = AIAssistant()