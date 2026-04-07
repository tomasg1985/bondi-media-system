// ==================================================
// AI LEARNING ENGINE - MOTOR DE APRENDIZAJE CONTINUO
// ==================================================
// PEGÁ ACÁ TODO EL CÓDIGO DE LA RESPUESTA ANTERIOR

// ==================================================
// AI LEARNING ENGINE - MOTOR DE APRENDIZAJE CONTINUO
// ==================================================

console.log('🧠 Cargando motor de aprendizaje continuo...');

// ==================================================
// CLASE PRINCIPAL DEL MOTOR DE APRENDIZAJE
// ==================================================
class AILearningEngine {
    constructor() {
        this.version = '2.0';
        this.modelos = {
            hooks: new HookPredictor(),
            formatos: new FormatOptimizer(),
            hashtags: new HashtagAnalyzer(),
            tiempos: new TimePredictor(),
            audiencia: new AudienceAnalyzer()
        };
        
        this.metricasHistoricas = [];
        this.patronesExito = {};
        this.correlaciones = {};
        
        this.init();
    }
    
    init() {
        this.cargarModelos();
        this.analizarHistorial();
        this.calcularCorrelaciones();
        console.log('🧠 Motor de aprendizaje iniciado');
    }
    
    // ==============================================
    // ANÁLISIS HISTÓRICO
    // ==============================================
    analizarHistorial() {
        const contenidos = window.appData?.calendar || [];
        
        contenidos.forEach(c => {
            if (c.metrics) {
                this.metricasHistoricas.push({
                    id: c.id,
                    fecha: c.date,
                    tipo: c.type,
                    titulo: c.title,
                    objetivo: c.objective,
                    status: c.status,
                    hasAds: c.hasAds,
                    
                    // Métricas de rendimiento
                    metrics: {
                        reach: (c.metrics.instagram?.reach || 0) + (c.metrics.facebook?.reach || 0),
                        engagement: (c.metrics.instagram?.likes || 0) + (c.metrics.instagram?.comments || 0) +
                                   (c.metrics.facebook?.reactions || 0) + (c.metrics.facebook?.comments || 0),
                        dms: (c.metrics.instagram?.dms || 0) + (c.metrics.facebook?.messages || 0),
                        retention: c.metrics.videoMetrics?.retentionPercent || 0
                    },
                    
                    // Detalles del contenido
                    detalles: c.details || {}
                });
            }
        });
        
        // Identificar patrones de éxito
        this.identificarPatronesExito();
    }
    
    // ==============================================
    // IDENTIFICAR PATRONES DE ÉXITO
    // ==============================================
    identificarPatronesExito() {
        // Ordenar por alcance
        const topPerformers = [...this.metricasHistoricas]
            .sort((a, b) => b.metrics.reach - a.metrics.reach)
            .slice(0, 10);
        
        // Analizar qué tienen en común
        const patrones = {
            hooks: [],
            longitudes: [],
            horarios: [],
            formatos: [],
            temas: []
        };
        
        topPerformers.forEach(p => {
            // Extraer hook (primeros 50 caracteres)
            if (p.detalles?.script) {
                const hook = p.detalles.script.split('\n')[0] || '';
                patrones.hooks.push(hook);
            }
            
            // Longitud del título
            patrones.longitudes.push(p.titulo.length);
            
            // Horario
            const hora = parseInt(p.fecha?.split('T')[1]?.split(':')[0] || 20);
            patrones.horarios.push(hora);
            
            // Formato
            patrones.formatos.push(p.tipo);
        });
        
        this.patronesExito = {
            hooksMasUsados: this.frecuencia(patrones.hooks),
            longitudPromedio: this.promedio(patrones.longitudes),
            mejorHorario: this.moda(patrones.horarios),
            mejorFormato: this.moda(patrones.formatos),
            alcancePromedio: this.promedio(topPerformers.map(p => p.metrics.reach)),
            topPerformers: topPerformers.map(p => ({
                titulo: p.titulo,
                alcance: p.metrics.reach,
                fecha: p.fecha
            }))
        };
        
        console.log('✅ Patrones de éxito identificados:', this.patronesExito);
    }
    
    // ==============================================
    // CALCULAR CORRELACIONES
    // ==============================================
    calcularCorrelaciones() {
        // Correlación entre inversión y resultados
        const conAds = this.metricasHistoricas.filter(m => m.hasAds);
        const sinAds = this.metricasHistoricas.filter(m => !m.hasAds);
        
        const avgReachConAds = this.promedio(conAds.map(m => m.metrics.reach));
        const avgReachSinAds = this.promedio(sinAds.map(m => m.metrics.reach));
        
        this.correlaciones.ads = {
            factor: avgReachConAds / (avgReachSinAds || 1),
            recomendacion: avgReachConAds > avgReachSinAds * 1.3 
                ? 'La inversión en ads está siendo efectiva' 
                : 'Considerá revisar la estrategia de ads'
        };
        
        // Correlación entre tipo y rendimiento
        const porTipo = {};
        this.metricasHistoricas.forEach(m => {
            if (!porTipo[m.tipo]) porTipo[m.tipo] = [];
            porTipo[m.tipo].push(m.metrics.reach);
        });
        
        this.correlaciones.tipos = {};
        Object.entries(porTipo).forEach(([tipo, alcances]) => {
            this.correlaciones.tipos[tipo] = {
                promedio: this.promedio(alcances),
                cantidad: alcances.length
            };
        });
    }
    
    // ==============================================
    // PREDECIR RENDIMIENTO
    // ==============================================
    predecirRendimiento(contenido) {
        const prediccion = {
            alcanceEstimado: 0,
            engagementEstimado: 0,
            dmsEstimados: 0,
            confianza: 0,
            factores: []
        };
        
        // Factor 1: Historial del tipo de contenido
        if (this.correlaciones.tipos[contenido.tipo]) {
            const promedioTipo = this.correlaciones.tipos[contenido.tipo].promedio;
            prediccion.alcanceEstimado += promedioTipo * 0.4;
            prediccion.factores.push({
                nombre: 'Rendimiento histórico del formato',
                peso: 0.4,
                valor: promedioTipo
            });
        }
        
        // Factor 2: Patrones de éxito
        if (this.patronesExito.longitudPromedio) {
            const difLongitud = Math.abs((contenido.titulo?.length || 0) - this.patronesExito.longitudPromedio);
            const factorLongitud = Math.max(0, 1 - (difLongitud / 50));
            prediccion.alcanceEstimado += this.patronesExito.alcancePromedio * 0.2 * factorLongitud;
        }
        
        // Factor 3: ¿Tiene ads?
        if (contenido.hasAds && this.correlaciones.ads?.factor) {
            prediccion.alcanceEstimado *= this.correlaciones.ads.factor;
            prediccion.factores.push({
                nombre: 'Inversión en ads',
                peso: this.correlaciones.ads.factor,
                valor: this.correlaciones.ads.factor
            });
        }
        
        // Calcular confianza (basado en cantidad de datos)
        const totalDatos = this.metricasHistoricas.length;
        prediccion.confianza = Math.min(95, Math.round((totalDatos / 20) * 100));
        
        // Engagement y DMs (proporcionales al alcance)
        prediccion.engagementEstimado = Math.round(prediccion.alcanceEstimado * 0.05);
        prediccion.dmsEstimados = Math.round(prediccion.alcanceEstimado * 0.01);
        
        return prediccion;
    }
    
    // ==============================================
    // RECOMENDACIONES PERSONALIZADAS
    // ==============================================
    getRecomendacionesPersonalizadas() {
        const recomendaciones = [];
        
        // Recomendación basada en mejores horarios
        if (this.patronesExito.mejorHorario) {
            recomendaciones.push({
                tipo: 'horario',
                titulo: '⏰ Mejor momento para publicar',
                descripcion: `Basado en tu historial, el horario con mejor rendimiento es las ${this.patronesExito.mejorHorario}:00hs`,
                confianza: 85,
                accion: 'Programá tus próximas publicaciones en este horario'
            });
        }
        
        // Recomendación basada en formato
        if (this.patronesExito.mejorFormato) {
            const promedio = this.correlaciones.tipos[this.patronesExito.mejorFormato]?.promedio || 0;
            recomendaciones.push({
                tipo: 'formato',
                titulo: '🎯 Formato que mejor funciona',
                descripcion: `Tus ${this.patronesExito.mejorFormato}s tienen ${promedio.toLocaleString()} alcance promedio`,
                confianza: 80,
                accion: 'Aumentá la frecuencia de este formato'
            });
        }
        
        // Recomendación basada en hooks exitosos
        if (this.patronesExito.hooksMasUsados?.length > 0) {
            recomendaciones.push({
                tipo: 'hooks',
                titulo: '📝 Hooks que funcionan',
                descripcion: 'Estos son los hooks de tus mejores publicaciones:',
                ejemplos: this.patronesExito.hooksMasUsados.slice(0, 3),
                confianza: 75,
                accion: 'Usá estructuras similares en tus próximos reels'
            });
        }
        
        // Recomendación basada en día de la semana
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const mejorDia = this.analizarMejorDia();
        if (mejorDia) {
            recomendaciones.push({
                tipo: 'dia',
                titulo: '📅 Mejor día para publicar',
                descripcion: `Tus publicaciones de los ${dias[mejorDia.dia]} tienen mejor rendimiento`,
                confianza: 70,
                accion: `Priorizá los ${dias[mejorDia.dia]} para contenido importante`
            });
        }
        
        return recomendaciones;
    }
    
    // ==============================================
    // ANALIZAR MEJOR DÍA
    // ==============================================
    analizarMejorDia() {
        const dias = {};
        
        this.metricasHistoricas.forEach(m => {
            if (!m.fecha) return;
            const fecha = new Date(m.fecha);
            const dia = fecha.getDay();
            
            if (!dias[dia]) {
                dias[dia] = { alcance: 0, count: 0 };
            }
            
            dias[dia].alcance += m.metrics.reach;
            dias[dia].count++;
        });
        
        let mejorDia = null;
        let mejorPromedio = 0;
        
        Object.entries(dias).forEach(([dia, data]) => {
            const promedio = data.alcance / data.count;
            if (promedio > mejorPromedio) {
                mejorDia = { dia: parseInt(dia), promedio };
                mejorPromedio = promedio;
            }
        });
        
        return mejorDia;
    }
    
    // ==============================================
    // APRENDER DE NUEVO CONTENIDO
    // ==============================================
    aprenderDeContenido(contenido) {
        console.log('📚 Aprendiendo de nuevo contenido:', contenido.titulo);
        
        // Agregar a métricas históricas
        this.metricasHistoricas.push({
            id: contenido.id,
            fecha: contenido.date,
            tipo: contenido.type,
            titulo: contenido.title,
            objetivo: contenido.objective,
            hasAds: contenido.hasAds,
            metrics: {
                reach: (contenido.metrics?.instagram?.reach || 0) + (contenido.metrics?.facebook?.reach || 0),
                engagement: (contenido.metrics?.instagram?.likes || 0) + (contenido.metrics?.instagram?.comments || 0) +
                           (contenido.metrics?.facebook?.reactions || 0) + (contenido.metrics?.facebook?.comments || 0),
                dms: (contenido.metrics?.instagram?.dms || 0) + (contenido.metrics?.facebook?.messages || 0),
                retention: contenido.metrics?.videoMetrics?.retentionPercent || 0
            },
            detalles: contenido.details || {}
        });
        
        // Recalcular patrones
        this.identificarPatronesExito();
        this.calcularCorrelaciones();
        
        // Guardar modelo actualizado
        this.guardarModelos();
        
        console.log('✅ Modelo actualizado con nuevo aprendizaje');
    }
    
    // ==============================================
    // GUARDAR MODELOS EN LOCALSTORAGE
    // ==============================================
    guardarModelos() {
        const modelo = {
            version: this.version,
            fecha: new Date().toISOString(),
            patronesExito: this.patronesExito,
            correlaciones: this.correlaciones,
            metricasCount: this.metricasHistoricas.length
        };
        
        localStorage.setItem('ai-learning-model', JSON.stringify(modelo));
        console.log('💾 Modelo de IA guardado');
    }
    
    // ==============================================
    // CARGAR MODELOS GUARDADOS
    // ==============================================
    cargarModelos() {
        const saved = localStorage.getItem('ai-learning-model');
        if (saved) {
            try {
                const modelo = JSON.parse(saved);
                this.patronesExito = modelo.patronesExito || this.patronesExito;
                this.correlaciones = modelo.correlaciones || this.correlaciones;
                console.log('📂 Modelo de IA cargado desde localStorage');
            } catch (e) {
                console.warn('Error cargando modelo:', e);
            }
        }
    }
    
    // ==============================================
    // FUNCIONES AUXILIARES
    // ==============================================
    promedio(arr) {
        if (arr.length === 0) return 0;
        return arr.reduce((a, b) => a + b, 0) / arr.length;
    }
    
    moda(arr) {
        if (arr.length === 0) return null;
        const freq = {};
        arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
        return Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0];
    }
    
    frecuencia(arr) {
        const freq = {};
        arr.forEach(v => freq[v] = (freq[v] || 0) + 1);
        return Object.entries(freq)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([v]) => v.substring(0, 50));
    }
}

// ==================================================
// PREDICTOR DE HOOKS
// ==================================================
class HookPredictor {
    constructor() {
        this.hooksExitosos = [];
        this.palabrasClave = {};
    }
    
    analizarHooks(contenidos) {
        contenidos.forEach(c => {
            if (c.metrics?.videoMetrics?.retentionPercent > 60 && c.details?.script) {
                const hook = c.details.script.split('\n')[0];
                this.hooksExitosos.push({
                    texto: hook,
                    retencion: c.metrics.videoMetrics.retentionPercent,
                    palabras: hook.toLowerCase().split(' ')
                });
            }
        });
        
        // Analizar palabras frecuentes en hooks exitosos
        this.hooksExitosos.forEach(h => {
            h.palabras.forEach(p => {
                if (p.length > 3) {
                    this.palabrasClave[p] = (this.palabrasClave[p] || 0) + 1;
                }
            });
        });
    }
    
    generarHook(tema) {
        const palabrasClave = Object.entries(this.palabrasClave)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([p]) => p);
        
        const templates = [
            `¿Sabías que ${palabrasClave[0] || 'el 80%'} de las personas no sabe ${tema}?`,
            `Deja de hacer esto si quieres mejorar tu ${tema}`,
            `El secreto de ${tema} que nadie te cuenta`,
            `3 señales de que necesitas ${tema} YA`,
            `Lo que ${palabrasClave[1] || 'los expertos'} no te dicen sobre ${tema}`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }
}

// ==================================================
// OPTIMIZADOR DE FORMATOS
// ==================================================
class FormatOptimizer {
    constructor() {
        this.rendimientoPorFormato = {};
    }
    
    analizar(contenidos) {
        contenidos.forEach(c => {
            if (!c.metrics) return;
            
            if (!this.rendimientoPorFormato[c.type]) {
                this.rendimientoPorFormato[c.type] = {
                    alcance: 0,
                    engagement: 0,
                    count: 0
                };
            }
            
            const alcance = (c.metrics.instagram?.reach || 0) + (c.metrics.facebook?.reach || 0);
            const engagement = (c.metrics.instagram?.likes || 0) + (c.metrics.instagram?.comments || 0) +
                              (c.metrics.facebook?.reactions || 0) + (c.metrics.facebook?.comments || 0);
            
            this.rendimientoPorFormato[c.type].alcance += alcance;
            this.rendimientoPorFormato[c.type].engagement += engagement;
            this.rendimientoPorFormato[c.type].count++;
        });
    }
    
    getMejorFormato() {
        let mejor = null;
        let mejorPromedio = 0;
        
        Object.entries(this.rendimientoPorFormato).forEach(([tipo, data]) => {
            const promedio = data.alcance / data.count;
            if (promedio > mejorPromedio) {
                mejor = tipo;
                mejorPromedio = promedio;
            }
        });
        
        return mejor;
    }
}

// ==================================================
// ANALIZADOR DE HASHTAGS
// ==================================================
class HashtagAnalyzer {
    constructor() {
        this.hashtagsExitosos = {};
    }
    
    analizar(contenidos) {
        contenidos.forEach(c => {
            if (!c.metrics || !c.details?.hashtags) return;
            
            const hashtags = c.details.hashtags.match(/#[a-zA-Z0-9]+/g) || [];
            const alcance = (c.metrics.instagram?.reach || 0) + (c.metrics.facebook?.reach || 0);
            
            hashtags.forEach(tag => {
                if (!this.hashtagsExitosos[tag]) {
                    this.hashtagsExitosos[tag] = { alcance: 0, count: 0 };
                }
                this.hashtagsExitosos[tag].alcance += alcance;
                this.hashtagsExitosos[tag].count++;
            });
        });
    }
    
    getMejoresHashtags(limit = 10) {
        return Object.entries(this.hashtagsExitosos)
            .map(([tag, data]) => ({
                tag,
                promedio: data.alcance / data.count
            }))
            .sort((a, b) => b.promedio - a.promedio)
            .slice(0, limit)
            .map(item => item.tag);
    }
}

// ==================================================
// PREDICTOR DE TIEMPOS
// ==================================================
class TimePredictor {
    constructor() {
        this.horarios = {};
    }
    
    analizar(contenidos) {
        contenidos.forEach(c => {
            if (!c.metrics || !c.time) return;
            
            const hora = parseInt(c.time.split(':')[0]);
            const alcance = (c.metrics.instagram?.reach || 0) + (c.metrics.facebook?.reach || 0);
            
            if (!this.horarios[hora]) {
                this.horarios[hora] = { alcance: 0, count: 0 };
            }
            
            this.horarios[hora].alcance += alcance;
            this.horarios[hora].count++;
        });
    }
    
    getMejorHorario() {
        let mejorHora = 20;
        let mejorPromedio = 0;
        
        Object.entries(this.horarios).forEach(([hora, data]) => {
            const promedio = data.alcance / data.count;
            if (promedio > mejorPromedio) {
                mejorHora = parseInt(hora);
                mejorPromedio = promedio;
            }
        });
        
        return { hora: mejorHora, promedio: mejorPromedio };
    }
}

// ==================================================
// ANALIZADOR DE AUDIENCIA
// ==================================================
class AudienceAnalyzer {
    constructor() {
        this.horariosOptimos = {};
        this.diasOptimos = {};
    }
    
    analizar(contenidos) {
        contenidos.forEach(c => {
            if (!c.metrics || !c.date) return;
            
            const fecha = new Date(c.date);
            const dia = fecha.getDay();
            const hora = parseInt(c.time?.split(':')[0] || 20);
            
            const alcance = (c.metrics.instagram?.reach || 0) + (c.metrics.facebook?.reach || 0);
            
            if (!this.horariosOptimos[hora]) {
                this.horariosOptimos[hora] = { alcance: 0, count: 0 };
            }
            this.horariosOptimos[hora].alcance += alcance;
            this.horariosOptimos[hora].count++;
            
            if (!this.diasOptimos[dia]) {
                this.diasOptimos[dia] = { alcance: 0, count: 0 };
            }
            this.diasOptimos[dia].alcance += alcance;
            this.diasOptimos[dia].count++;
        });
    }
    
    getMejorHorario() {
        let mejorHora = 20;
        let mejorPromedio = 0;
        
        Object.entries(this.horariosOptimos).forEach(([hora, data]) => {
            const promedio = data.alcance / data.count;
            if (promedio > mejorPromedio) {
                mejorHora = parseInt(hora);
                mejorPromedio = promedio;
            }
        });
        
        return { hora: mejorHora, promedio: mejorPromedio };
    }
    
    getMejorDia() {
        const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        let mejorDia = 3;
        let mejorPromedio = 0;
        
        Object.entries(this.diasOptimos).forEach(([dia, data]) => {
            const promedio = data.alcance / data.count;
            if (promedio > mejorPromedio) {
                mejorDia = parseInt(dia);
                mejorPromedio = promedio;
            }
        });
        
        return { dia: mejorDia, promedio: mejorPromedio };
    }
}

// ==================================================
// EXPORTAR CLASE PRINCIPAL
// ==================================================
window.AILearningEngine = AILearningEngine;

console.log('✅ Motor de aprendizaje continuo cargado');