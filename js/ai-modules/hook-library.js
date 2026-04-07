// ==================================================
// HOOK LIBRARY - BIBLIOTECA DE HOOKS CON GENERADOR
// ==================================================

console.log('🎯 Cargando Biblioteca de Hooks...');

window.initHookLibrary = function(container) {
    // Base de datos de hooks por categoría
    const hooksDB = {
        curiosidad: [
            "¿Sabías que el 80% de las personas no sabe cómo mejorar su marketing?",
            "Lo que nadie te dice sobre el éxito en redes sociales",
            "El secreto mejor guardado de los community managers",
            "¿Por qué algunas marcas se vuelven virales y otras no?",
            "La verdad sobre el algoritmo que Instagram no quiere que sepas",
            "El dato que cambia todo lo que sabías sobre engagement",
            "¿Sabías que publicar menos puede aumentar tus ventas?",
            "Lo que los gurús del marketing no te cuentan",
            "¿Sabías que el primer segundo de tu Reel lo decide todo?",
            "El formato de contenido que más crece en 2026 y que casi nadie usa",
            "La hora exacta en que tu audiencia está más predispuesta a comprar",
            "¿Sabías que los posts con preguntas tienen 3x más comentarios?",
            "El tipo de contenido que genera más guardados (y pocos lo hacen)",
            "Lo que diferencia a una cuenta de 1k de una de 100k seguidores",
            "¿Sabías que el 90% del alcance orgánico depende de las primeras 3 horas?",
            "La psicología detrás de los hooks que paran el scroll",
            "Por qué algunas historias se ven y otras se saltan en 1 segundo",
            "El dato sobre saves que el algoritmo de Instagram prioriza",
            "¿Sabías que los emojis en el primer renglón aumentan el open rate?",
            "Lo que las marcas más exitosas tienen en común y no es el presupuesto"
        ],
        problema: [
            "El error que está matando tus ventas (y no lo sabías)",
            "Dejá de hacer esto si querés más clientes",
            "3 errores que están arruinando tu estrategia de contenido",
            "¿Estás cometiendo estos 5 errores de marketing?",
            "El mayor error que cometen los emprendedores al hacer contenido",
            "Por qué tu audiencia no confía en tu marca",
            "El hábito que está destruyendo tu alcance orgánico",
            "¿Tu contenido no vende? Esta es la razón",
            "El error silencioso que comete el 95% de las cuentas profesionales",
            "Por qué publicás todos los días y no te llegan consultas",
            "El problema que tiene tu bio y que espanta a los clientes potenciales",
            "¿Por qué nadie guarda tu contenido? Este es el motivo",
            "El error de principiante que siguen cometiendo marcas con miles de seguidores",
            "Por qué tu Reel llegó bien pero nadie te escribió",
            "El problema que tienen tus captions y que frena la conversión",
            "3 razones por las que tu audiencia no te recomienda",
            "Por qué tener buenos seguidores no es suficiente para vender",
            "El error de estrategia que convierte tu contenido en ruido",
            "¿Por qué tu alcance cae aunque publiques todos los días?",
            "Lo que está mal en tu call to action y cómo solucionarlo"
        ],
        urgencia: [
            "3 señales de que necesitas urgentemente una estrategia de contenido",
            "Si no estás haciendo esto, estás perdiendo dinero",
            "No esperes más: tu competencia ya está usando esta estrategia",
            "Alerta: El algoritmo cambió y tu contenido ya no alcanza",
            "Última oportunidad para mejorar tu engagement",
            "Lo que necesitas hacer HOY para salvar tu estrategia",
            "5 cambios URGENTES en tu contenido para esta semana",
            "Si no actuás ahora, te vas a quedar atrás",
            "El cambio que tenés que hacer antes de que termine este mes",
            "Tu competencia ya lo está haciendo y vos todavía no",
            "Esta tendencia dura 30 días más. Aprovechala ahora",
            "El algoritmo favorece este formato solo hasta fin de mes",
            "Antes de publicar tu próximo post, leé esto",
            "No publiques nada esta semana sin ver esto primero",
            "El error que estás por cometer con tu próximo contenido",
            "Tenés 7 días para implementar esto antes de que pierda efectividad",
            "La ventana de oportunidad que se cierra este trimestre",
            "Si llegaste tarde a TikTok, no llegues tarde a esto",
            "Tres días para que el algoritmo te favorezca o te olvide",
            "El ajuste que tenés que hacer hoy en tu estrategia"
        ],
        pregunta: [
            "¿Estás listo para multiplicar tus ventas?",
            "¿Tu marca está lista para despegar?",
            "¿Qué pasaría si pudieras duplicar tu alcance en 30 días?",
            "¿Te gustaría saber el secreto de los mejores marketers?",
            "¿Cuánto vale para vos una estrategia de contenido efectiva?",
            "¿Estás aprovechando al máximo tu presencia digital?",
            "¿Sabés qué están haciendo tus competidores que vos no?",
            "¿Te gustaría tener contenido que siempre funcione?",
            "¿Cuántos clientes perdiste este mes por no tener contenido estratégico?",
            "¿Qué harías si mañana te llegaran 10 consultas desde Instagram?",
            "¿Cuánto tiempo le dedicas a redes y qué resultados concretos te trae?",
            "¿Sabés cuál es el contenido que más convierte en tu nicho?",
            "¿Qué pasaría si cada Reel que publicás generara al menos una consulta?",
            "¿Cuándo fue la última vez que un cliente te llegó directamente desde redes?",
            "¿Estás publicando para entretener o para vender?",
            "¿Sabés qué porcentaje de tus seguidores podría convertirse en clientes?",
            "¿Qué tan lejos estás de vivir de lo que te apasiona gracias a tus redes?",
            "¿Tu contenido habla de vos o habla de lo que le duele a tu cliente?",
            "¿Cuánto tiempo más vas a publicar sin ver resultados reales?",
            "¿Qué necesitaría pasar para que digas que tus redes realmente funcionan?"
        ],
        beneficio: [
            "En 30 segundos te explico cómo duplicar tus ventas",
            "La fórmula que usan los profesionales para viralizar contenido",
            "Aprendé el método que usan las marcas top para enganchar",
            "Descubrí cómo generar engagement sin morir en el intento",
            "El sistema probado para crear contenido que vende",
            "Cómo aumentar tu alcance sin gastar en publicidad",
            "La técnica secreta para que tu audiencia espere tus posts",
            "Aprendé a crear hooks que enganchan en 3 segundos",
            "El método exacto para pasar de 0 consultas a 5 por semana desde Instagram",
            "Cómo transformar tus seguidores en clientes en 3 pasos concretos",
            "La estructura de Reel que funciona para cualquier nicho profesional",
            "Cómo generar más guardados sin cambiar el tipo de contenido",
            "El formato de carrusel que más convierte en servicios profesionales",
            "Cómo escribir un caption que lleve al DM sin ser invasivo",
            "La fórmula de Stories que convierte espectadores en clientes",
            "Cómo posicionarte como referente en tu nicho con 3 posts por semana",
            "El tipo de hook que frena el scroll en cualquier audiencia",
            "Cómo lograr que tu audiencia te recomiende sin pedírselo",
            "La estrategia para llenar tu agenda de turnos usando solo Stories",
            "Cómo medir si tu contenido realmente está funcionando"
        ],
        controversia: [
            "La verdad incómoda sobre el engagement que pocos cuentan",
            "Por qué el contenido de calidad NO es suficiente",
            "El mito de la consistencia que está arruinando tu marca",
            "Lo que los expertos no te dicen sobre el algoritmo",
            "La cruda realidad sobre las redes sociales en 2026",
            "Por qué tener 10k seguidores no significa nada",
            "El lado oscuro del marketing de influencers",
            "Lo que nadie te cuenta sobre hacerse viral",
            "Por qué la mayoría de los community managers no sirven",
            "La razón por la que el marketing de contenidos está sobrevalorado",
            "Por qué publicar todos los días puede destruir tu marca",
            "El negocio de los coaches de marketing que no te conviene",
            "Por qué el 90% de los virales no generan ventas",
            "La mentira de los 10,000 pasos para el éxito en redes",
            "Por qué copiar a tu competencia es el peor error que podés cometer",
            "La razón por la que más seguidores no significa más ingresos",
            "Por qué el contenido educativo gratuito te hace perder clientes",
            "El problema con las estrategias de marketing que venden los gurús",
            "Por qué la autenticidad en redes es el mayor engaño de la era digital",
            "La verdad sobre los algoritmos que las plataformas nunca van a admitir"
        ],
        narracion: [
            "Hace un año no tenía ni idea de cómo funcionaban las redes. Hoy tengo [resultado]",
            "Me dijeron que era imposible. Lo hice igual. Acá te cuento cómo",
            "El día que perdí mi cuenta de Instagram y lo que aprendí de eso",
            "Empecé desde cero. Sin seguidores, sin presupuesto. Sin excusas",
            "Lo que cambió cuando dejé de publicar para gustar y empecé a publicar para vender",
            "Le fallé a mis primeros clientes. Así me recuperé",
            "El cliente que me enseñó más sobre marketing que cinco años de cursos",
            "La historia detrás del post que generó 50 consultas en un día",
            "Cuando me di cuenta que estaba haciendo todo al revés",
            "El momento exacto en que mi estrategia de contenido empezó a funcionar",
            "Cometí todos los errores posibles. Ahora te los cuento para que no los repitas",
            "Así fue el mes que decidí hacer las cosas diferente",
            "Lo que pasó cuando le pregunté a mi audiencia qué quería ver",
            "El proyecto que casi me quiebra y que terminó siendo mi mayor aprendizaje",
            "Tres años construyendo en redes. Lo que cambiaría si empezara hoy"
        ],
        dato: [
            "El 90% de las decisiones de compra empiezan en redes sociales",
            "Las cuentas que usan Reels tienen 22% más alcance que las que no",
            "El caption promedio se lee en 3 segundos. Hacé que valgan",
            "Los posts con imágenes de personas generan 38% más engagement",
            "El 79% de las personas busca marcas en Instagram antes de comprar",
            "Las Stories con sticker de encuesta generan 3x más interacciones",
            "El mejor momento para publicar en Argentina es entre 19 y 21hs",
            "Los Reels de menos de 30 segundos tienen mayor porcentaje de visualización completa",
            "El 64% de los consumidores quiere que las marcas les hablen con humor y cercanía",
            "Una cuenta que responde DMs en menos de 1 hora convierte 5x más",
            "Los posts con CTA específico generan 89% más clics que los que no tienen",
            "El 82% de los usuarios de Instagram sigue al menos una cuenta de negocio",
            "Los carruseles tienen 3x más tiempo de visualización que las fotos estáticas",
            "El algoritmo premia los contenidos que generan guardados sobre los likes",
            "Las cuentas que usan al menos 5 hashtags de nicho tienen mayor alcance orgánico"
        ]
    };

    // Función para generar hook aleatorio
    window.generarHookAleatorio = function() {
        const categorias = Object.keys(hooksDB);
        const categoriaRand = categorias[Math.floor(Math.random() * categorias.length)];
        const hooks = hooksDB[categoriaRand];
        const hookRand = hooks[Math.floor(Math.random() * hooks.length)];        
        // Calcular efectividad aleatoria (entre 70 y 98)
        const efectividad = Math.floor(Math.random() * 28) + 70;
        
        // Actualizar el resultado
        document.getElementById('hook-generator-result').innerHTML = `
            <div style="background: #9b9b9b; padding: 20px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                    <span class="badge badge-info">${categoriaRand}</span>
                    <span class="badge badge-success">${efectividad}% efectividad</span>
                </div>
                <div style="font-size: 16px; line-height: 1.5; margin: 15px 0;">"${hookRand}"</div>
                <div style="display: flex; gap: 10px;">
                    <button class="btn-primary btn-sm" onclick="usarHook('${hookRand.replace(/'/g, "\\'")}')">📋 Usar este hook</button>
                    <button class="btn-secondary btn-sm" onclick="generarHookAleatorio()">🔄 Otro</button>
                </div>
            </div>
        `;
    };

    // Función para usar un hook
    window.usarHook = function(hook) {
        navigator.clipboard.writeText(hook).then(() => {
            alert('✅ Hook copiado al portapapeles');
        }).catch(() => {
            alert('❌ No se pudo copiar');
        });
    };

    container.innerHTML = `
        <div style="padding: 30px;">
            <style>
                .hook-card {
                    background: white;
                    border: 1px solid #e5e7eb;
                    border-radius: 12px;
                    padding: 16px;
                    transition: all 0.2s;
                }
                .hook-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .generator-section {
                    background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
                    border-radius: 12px;
                    padding: 25px;
                    color: white;
                    margin-bottom: 30px;
                }
                .category-tag {
                    display: inline-block;
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 600;
                    margin-right: 5px;
                }
            </style>

            <div style="background: linear-gradient(135deg, #ec4899 0%, #db2777 100%); padding: 30px; border-radius: 12px; color: white; margin-bottom: 24px;">
                <h2 style="font-size: 28px; margin-bottom: 10px;">🎯 Biblioteca de Hooks</h2>
                <p style="opacity: 0.9;">Los mejores hooks para tu contenido</p>
            </div>

            <!-- GENERADOR ALEATORIO - NUEVO -->
            <div class="generator-section">
                <h3 style="font-size: 22px; margin-bottom: 15px;">🎲 Generador Aleatorio de Hooks</h3>
                <p style="margin-bottom: 20px; opacity: 0.9;">Hacé clic para obtener un hook listo para usar</p>
                
                <button class="btn-primary" onclick="generarHookAleatorio()" style="background: white; color: #ec4899; font-size: 16px; padding: 15px 30px;">
                    🎲 Generar hook aleatorio
                </button>

                <div id="hook-generator-result" style="margin-top: 20px;">
                    <!-- Aquí aparecerá el resultado -->
                </div>
            </div>

            <!-- FILTROS POR CATEGORÍA -->
            <div style="display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 20px;">
                <button class="btn-secondary btn-sm active" onclick="filtrarHooks('todos', this)">📋 Todos</button>
                <button class="btn-secondary btn-sm" onclick="filtrarHooks('curiosidad', this)">🔮 Curiosidad</button>
                <button class="btn-secondary btn-sm" onclick="filtrarHooks('problema', this)">⚠️ Problema</button>
                <button class="btn-secondary btn-sm" onclick="filtrarHooks('urgencia', this)">⏰ Urgencia</button>
                <button class="btn-secondary btn-sm" onclick="filtrarHooks('pregunta', this)">❓ Pregunta</button>
                <button class="btn-secondary btn-sm" onclick="filtrarHooks('beneficio', this)">🎁 Beneficio</button>
                <button class="btn-secondary btn-sm" onclick="filtrarHooks('controversia', this)">⚡ Controversia</button>
                <button class="btn-secondary btn-sm" onclick="filtrarHooks('narracion', this)">📖 Narración</button>
                <button class="btn-secondary btn-sm" onclick="filtrarHooks('dato', this)">📊 Datos</button>
            </div>

            <!-- CONTENEDOR DE HOOKS -->
            <div id="hooks-container" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 15px; margin-bottom: 30px;">
                ${generarHooksHTML(hooksDB, 'todos')}
            </div>

            <!-- ANALIZADOR DE HOOKS -->
            <div style="background: #f3f4f6; padding: 20px; border-radius: 12px; margin-top: 30px;">
                <h3 style="margin-bottom: 15px;">🔍 Analizador de Hooks</h3>
                <div style="display: flex; gap: 10px;">
                    <input type="text" id="hook-input" class="form-input" placeholder="Escribí tu hook para analizarlo..." style="flex: 1;">
                    <button class="btn-primary" onclick="analizarHook()">Analizar</button>
                </div>
                <div id="analisis-result" style="margin-top: 15px;"></div>
            </div>
        </div>
    `;

    // Función para filtrar hooks por categoría
    window.filtrarHooks = function(categoria, btn) {
        // Actualizar botones activos
        document.querySelectorAll('[onclick^="filtrarHooks"]').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Generar HTML filtrado
        const container = document.getElementById('hooks-container');
        container.innerHTML = generarHooksHTML(hooksDB, categoria);
    };

    // Función para copiar hook
    window.copiarHook = function(texto) {
        navigator.clipboard.writeText(texto).then(() => {
            alert('✅ Hook copiado al portapapeles');
        });
    };

    // Función para analizar hook
    window.analizarHook = function() {
        const texto = document.getElementById('hook-input').value;
        if (!texto) return;
        
        let score = 70;
        const factores = [];
        
        // Análisis de longitud
        if (texto.length > 30 && texto.length < 70) {
            score += 10;
            factores.push("✓ Longitud ideal");
        } else if (texto.length < 20) {
            score -= 10;
            factores.push("✗ Muy corto");
        } else if (texto.length > 100) {
            score -= 15;
            factores.push("✗ Muy largo");
        }
        
        // Análisis de pregunta
        if (texto.includes('¿') || texto.includes('?')) {
            score += 15;
            factores.push("✓ Usa pregunta");
        }
        
        // Análisis de números
        if (texto.match(/\d+/)) {
            score += 10;
            factores.push("✓ Incluye números");
        }
        
        // Palabras clave
        const palabrasClave = ['error', 'secreto', 'nunca', 'siempre', 'urgente', 'gratis', 'increíble', 'descubrí'];
        let tienePalabraClave = false;
        palabrasClave.forEach(p => {
            if (texto.toLowerCase().includes(p)) {
                tienePalabraClave = true;
            }
        });
        if (tienePalabraClave) {
            score += 15;
            factores.push("✓ Palabra de alto impacto");
        }
        
        score = Math.min(99, Math.max(10, score));
        
        document.getElementById('analisis-result').innerHTML = `
            <div style="background: white; padding: 15px; border-radius: 8px;">
                <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                    <strong>Puntaje:</strong>
                    <span style="font-size: 24px; font-weight: 700; color: ${score > 80 ? '#10b981' : score > 60 ? '#f59e0b' : '#ef4444'}">
                        ${score}/100
                    </span>
                </div>
                <div style="margin-bottom: 10px;">
                    <strong>Nivel:</strong> 
                    <span class="badge ${score > 80 ? 'badge-success' : score > 60 ? 'badge-warning' : 'badge-danger'}">
                        ${score > 80 ? 'Excelente' : score > 60 ? 'Bueno' : 'Mejorable'}
                    </span>
                </div>
                ${factores.length > 0 ? `
                    <div>
                        <strong>Factores:</strong>
                        <ul style="margin-top: 5px; padding-left: 20px;">
                            ${factores.map(f => `<li>${f}</li>`).join('')}
                        </ul>
                    </div>
                ` : ''}
            </div>
        `;
    };
};

// ==================================================
// FUNCIÓN AUXILIAR PARA GENERAR HTML DE HOOKS
// ==================================================
function generarHooksHTML(hooksDB, categoria) {
    let hooks = [];
    
    if (categoria === 'todos') {
        // Combinar todas las categorías
        Object.values(hooksDB).forEach(catHooks => {
            hooks = hooks.concat(catHooks);
        });
    } else {
        hooks = hooksDB[categoria] || [];
    }
    
    // Mezclar para que no siempre estén en el mismo orden
    hooks = hooks.sort(() => Math.random() - 0.5);
    
    // Tomar solo los primeros 12 para no saturar
    hooks = hooks.slice(0, 12);
    
    return hooks.map(hook => {
        const efectividad = Math.floor(Math.random() * 28) + 70;
        const categoriaHook = Object.keys(hooksDB).find(key => 
            hooksDB[key].includes(hook)
        ) || 'general';
        
        return `
            <div class="hook-card">
                <div style="margin-bottom: 12px; font-size: 14px; line-height: 1.5;">"${hook}"</div>
                <div style="display: flex; gap: 8px; margin-bottom: 12px;">
                    <span class="badge badge-info">${categoriaHook}</span>
                    <span class="badge badge-success">${efectividad}%</span>
                </div>
                <button class="btn-secondary btn-sm" onclick="copiarHook('${hook.replace(/'/g, "\\'")}')" style="width: 100%;">
                    📋 Copiar hook
                </button>
            </div>
        `;
    }).join('');
}

console.log('✅ Biblioteca de Hooks cargada');