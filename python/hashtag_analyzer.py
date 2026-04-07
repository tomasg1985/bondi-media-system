# ==================================================
# ANALIZADOR DE HASHTAGS
# ==================================================

import random
from collections import Counter

class HashtagAnalyzer:
    def __init__(self):
        self.hashtag_db = {
            'alto': {
                'branding': ['#Branding', '#MarcaPersonal', '#Identidad'],
                'marketing': ['#MarketingDigital', '#RedesSociales', '#Contenido'],
                'diseño': ['#DiseñoGrafico', '#UX', '#Creatividad'],
                'web': ['#DesarrolloWeb', '#WordPress', '#LandingPage']
            },
            'medio': {
                'branding': ['#Logodesign', '#Paletadecolores', '#Tipografia'],
                'marketing': ['#Copywriting', '#EmailMarketing', '#Funnels'],
                'diseño': ['#Illustrator', '#Photoshop', '#Figma'],
                'web': ['#HTML', '#CSS', '#JavaScript']
            },
            'bajo': {
                'branding': ['#Diseñador', '#Marca', '#Logotipo'],
                'marketing': ['#Publicidad', '#Ventas', '#Negocios'],
                'diseño': ['#Arte', '#Creativo', '#Inspiracion'],
                'web': ['#Programacion', '#Coding', '#Developer']
            }
        }
    
    def analyze_hashtags(self, hashtags):
        """Analiza calidad de hashtags"""
        if not hashtags:
            return {'score': 0, 'recommendations': []}
        
        analysis = []
        total_score = 0
        
        for tag in hashtags:
            tag_lower = tag.lower()
            score = random.randint(40, 100)  # Simulado
            level = 'Alto' if score > 70 else 'Medio' if score > 40 else 'Bajo'
            
            analysis.append({
                'tag': tag,
                'score': score,
                'level': level
            })
            total_score += score
        
        avg_score = total_score / len(hashtags)
        
        recommendations = []
        if avg_score < 50:
            recommendations.append("Usá hashtags más específicos de tu nicho")
        if avg_score < 70:
            recommendations.append("Combiná hashtags altos (500k+) con medios (50-500k)")
        
        return {
            'average_score': round(avg_score, 1),
            'analysis': analysis,
            'recommendations': recommendations
        }
    
    def suggest_hashtags(self, topic, count=10):
        """Sugiere hashtags basados en tema"""
        suggestions = []
        topic_lower = topic.lower()
        
        # Buscar en categorías
        for level, categories in self.hashtag_db.items():
            for category, tags in categories.items():
                if category in topic_lower or any(word in topic_lower for word in category.split()):
                    suggestions.extend(tags)
        
        # Si no encuentra, usar mezcla de todos
        if not suggestions:
            for categories in self.hashtag_db.values():
                for tags in categories.values():
                    suggestions.extend(tags)
        
        # Mezclar y tomar primeros 'count'
        random.shuffle(suggestions)
        return suggestions[:count]
    
    def get_mix_suggestion(self, topic):
        """Sugiere mezcla óptima de hashtags"""
        alto = self.suggest_hashtags(topic, 3)
        medio = self.suggest_hashtags(topic, 4)
        bajo = self.suggest_hashtags(topic, 3)
        
        return {
            'alto_engagement': alto[:3],
            'medio_engagement': medio[:4],
            'bajo_engagement': bajo[:3],
            'total': alto[:3] + medio[:4] + bajo[:3]
        }

hashtag_analyzer = HashtagAnalyzer()