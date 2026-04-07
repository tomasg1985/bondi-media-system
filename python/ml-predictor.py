import numpy as np
from sklearn.ensemble import RandomForestRegressor

class Predictor:
    def predict_next_performance(self, data):
        df = pd.DataFrame(data['metrics'])
        
        if len(df) < 3:
            return {'error': 'Se necesitan más datos'}
        
        X = np.arange(len(df)).reshape(-1, 1)
        y = df['reach'].values
        
        model = RandomForestRegressor(n_estimators=10)
        model.fit(X, y)
        
        next_day = np.array([[len(df)]])