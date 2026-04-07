import pandas as pd
import numpy as np
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler

class Analytics:
    def analyze_performance(self, data):
        df = pd.DataFrame(data['metrics'])
        
        results = {
            'summary': self._generate_summary(df),
            'trends': self._analyze_trends(df),
            'best_time': self._best_posting_time(df)
        }
        return results
    
    def _generate_summary(self, df):
        return {
            'total_reach': int(df['reach'].sum()),
            'avg_reach': float(df['reach'].mean()),
            'total_engagement': int(df['engagement'].sum()),
            'avg_engagement': float(df['engagement'].mean())
        }
    
    def _analyze_trends(self, df):
        if len(df) < 2:
            return {'trend': 'stable'}
        
        x = np.arange(len(df))
        z = np.polyfit(x, df['reach'], 1)
        trend = 'up' if z[0] > 0 else 'down'
        
        return {'trend': trend, 'slope': float(z[0])}
    
    def _best_posting_time(self, df):
        if 'hour' not in df.columns:
            return {'best_hour': 20}
        
        hour_perf = df.groupby('hour')['reach'].mean()
        best_hour = int(hour_perf.idxmax()) if not hour_perf.empty else 20
        
        return {'best_hour': best_hour}
    
    def generate_recommendations(self, data):
        df = pd.DataFrame(data['metrics'])
        recommendations = []
        
        if 'retention' in df.columns:
            avg_retention = df['retention'].mean()
            if avg_retention < 40:
                recommendations.append({
                    'type': 'retention',
                    'message': '⚠️ Retención crítica. Mejora hooks'
                })
        
        return recommendations
    
    def calculate_roi(self, data):
        df = pd.DataFrame(data['metrics'])
        investment = data.get('investment', 0)
        
        if investment == 0:
            return {'roi': 0}
        
        value = df['reach'].sum() * 0.1
        roi = ((value - investment) / investment) * 100
        
        return {'roi': round(roi, 2)}