// ==================================================
// PROSPECTING.JS — Módulo de Captación de Clientes
// Secciones: Mensajes DM | Hashtags | Tracker
// ==================================================

console.log('🎯 Cargando prospecting.js...');

// ── DATOS: NICHOS ───────────────────────────────────────────────
var NICHOS = {
    nutricionistas: {
        label: 'Nutricionistas', icon: '🥗', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0',
        platforms: ['Instagram', 'Facebook', 'TikTok'],
        hashtags: {
            instagram: ['#nutricionista','#nutricion','#nutricionistabuenosaires','#dietista','#alimentacionsaludable','#nutricionistaargentina','#consultoriodenutricion','#nutricionistasba','#dietasaludable','#bajardepeso','#habitossaludables','#comidasaludable','#nutricionholistica','#nutricionfuncional','#bienestarbuenosaires','#saludhoy','#coachnutricional','#vidasaludable','#alimentacionconsciente','#nutricionintegrativa','#pesoidealbuenosaires','#alimentacionequilibrada','#nutricionybienestar','#planeamientonutricional','#comidasana'],
            facebook: ['Nutricionistas Buenos Aires','Alimentación Saludable Argentina','Nutrición y Bienestar BA','Dietistas Argentina','Hábitos Saludables Argentina'],
            tiktok: ['#nutricionista','#alimentacionsaludable','#dietatiktok','#habitossaludables','#nutricion','#comersano','#pesoidelal','#nutricionistatiktok','#saludable','#bajardepeso']
        },
        mensajes: [
            { label: 'Dolor directo', texto: 'Hola [nombre], vi tu perfil y noté algo: publicás contenido de valor pero no se traduce en consultas directas.\n\nTrabajo con nutricionistas en Buenos Aires ayudándolas a que cada publicación tenga un objetivo claro — no solo educar, sino que la persona que la vea quiera consultarte.\n\n¿Tenés 15 minutos esta semana para que te muestre cómo lo hacemos?' },
            { label: 'Resultado específico', texto: 'Hola [nombre], trabajo con nutricionistas independientes en Buenos Aires y lo que más escucho es: "publico seguido pero no me llegan pacientes nuevos por redes".\n\nDesarrollé un sistema para que eso cambie — cada publicación con métricas reales y un propósito concreto.\n\n¿Te resuena? Con gusto te cuento en 15 minutos cómo funciona.' },
            { label: 'Curiosidad + brevedad', texto: 'Hola [nombre], una pregunta rápida: ¿tu contenido de Instagram te está trayendo pacientes nuevos o solo engagement?\n\nTrabajo con profesionales de nutrición en BA ayudándolas a que las dos cosas pasen al mismo tiempo.\n\n¿Charlamos 15 minutos esta semana?' },
            { label: 'Diferenciación de agencia', texto: 'Hola [nombre], no soy una agencia masiva ni te voy a vender un paquete genérico.\n\nTrabajo con nutricionistas independientes en Buenos Aires con un sistema propio — contenido con estrategia, métricas reales y seguimiento personalizado.\n\nVi tu perfil y creo que hay una oportunidad clara para que tu contenido empiece a generar consultas. ¿Hablamos 15 minutos?' },
            { label: 'Validación + pregunta', texto: 'Hola [nombre], tu contenido tiene muy buena base — se nota que sabés del tema y que conectás con tu audiencia.\n\nLo que falta es que eso se convierta en pacientes reales. Trabajo con nutricionistas en BA exactamente en eso.\n\n¿Te gustaría ver cómo funciona? Te muestro el sistema en 15 minutos, sin compromiso.' },
            { label: 'Competencia saturada', texto: 'Hola [nombre], hay cientos de nutricionistas publicando en Instagram BA. Las que realmente se diferencian no son las que más publican — son las que tienen una estrategia clara detrás de cada pieza.\n\nEso es exactamente lo que construyo con mis clientes.\n\n¿Te interesa ver cómo funciona? Sin compromiso.' },
            { label: 'Números concretos', texto: 'Hola [nombre], ¿sabés cuántas personas vieron tu contenido este mes y cuántas terminaron siendo pacientes?\n\nEsa brecha entre alcance y consulta es exactamente el problema que resuelvo con nutricionistas en BA.\n\n¿Hablamos rápido esta semana?' },
            { label: 'Hooks y primeras líneas', texto: 'Hola [nombre], lo que más frena a las nutricionistas en redes no es la falta de conocimiento — es que el contenido no tiene el gancho inicial que hace que la gente pare de scrollear.\n\nEso es lo primero que trabajamos. ¿Te cuento cómo en 15 minutos?' },
            { label: 'TikTok approach', texto: 'Hola [nombre], vi tu perfil y el contenido que compartís tiene mucho potencial para TikTok donde hay una audiencia enorme buscando exactamente lo que enseñás.\n\nTrabajo con nutricionistas para que ese contenido llegue a más personas y se traduzca en consultas reales.\n\n¿Charlamos esta semana?' },
            { label: 'Valor percibido', texto: 'Hola [nombre], notei que das mucho valor gratis en tus publicaciones — eso es excelente para construir autoridad.\n\nEl siguiente paso es que esa autoridad se convierta en pacientes. Trabajo con nutricionistas en BA específicamente en eso.\n\n¿Te muestro cómo en 15 minutos?' }
        ]
    },
    psicologos: {
        label: 'Psicólogos', icon: '🧠', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE',
        platforms: ['Instagram', 'Facebook', 'LinkedIn', 'TikTok'],
        hashtags: {
            instagram: ['#psicologo','#psicologia','#psicologosbuenosaires','#saludmental','#terapia','#psicoterapia','#psicologoargentino','#saludmentalargentina','#bienestaremocional','#psicologiaclinica','#terapiaonline','#ansiedadbuenosaires','#psicologoinfantil','#desarrollopersonal','#mindfulness','#emocionessanas','#consejospsi','#psicoeducacion','#vidaemocional','#psicologiapositiva','#autoconocimiento','#saludmentalba','#terapeutabuenosaires','#bienestarpsi','#psiquiatriaba'],
            facebook: ['Psicólogos Buenos Aires','Salud Mental Argentina','Psicología Clínica BA','Terapia Online Argentina','Bienestar Emocional BA'],
            linkedin: ['psicología clínica','salud mental profesional','bienestar organizacional','psicólogo Argentina','mindfulness empresarial','coaching psicológico'],
            tiktok: ['#psicologo','#saludmental','#terapia','#ansiedadtiktok','#bienestaremocional','#psicologiatiktok','#autoestima','#mindfulness','#saludmentalimporta','#psicologiapractica']
        },
        mensajes: [
            { label: 'Contenido educativo sin conversión', texto: 'Hola [nombre], seguí tu perfil un tiempo y noto que tu contenido es genuinamente valioso — pero queda ahí, en lo educativo.\n\nTrabajo con psicólogos en Buenos Aires ayudándolos a que ese mismo contenido empiece a generar consultas de personas que realmente necesitan su acompañamiento.\n\n¿Tenés 15 minutos para que te cuente cómo lo hacemos?' },
            { label: 'Diferenciación profesional', texto: 'Hola [nombre], trabajo con profesionales de salud mental en Buenos Aires que quieren posicionarse en redes sin perder la seriedad de su ejercicio.\n\nEl sistema que uso es diferente a una agencia genérica — estrategia de contenido con métricas reales, pensada para profesionales.\n\n¿Hablamos 15 minutos esta semana?' },
            { label: 'Directo al resultado', texto: 'Hola [nombre], una pregunta directa: ¿cuántos pacientes nuevos te llegaron por Instagram el último mes?\n\nTrabajo con psicólogos en BA para que esa respuesta cambie. Contenido con estrategia, seguimiento y métricas reales.\n\n¿Charlamos 15 minutos?' },
            { label: 'Post pandemia', texto: 'Hola [nombre], la demanda de salud mental en Argentina nunca fue tan alta como ahora.\n\nEl problema es que muchos psicólogos con excelente formación no tienen la visibilidad que merecen en redes.\n\nEs justo ahí donde trabajo. ¿Te cuento cómo en una charla de 15 minutos?' },
            { label: 'LinkedIn approach', texto: 'Hola [nombre], vi tu perfil de LinkedIn y el enfoque que tenés en [especialidad] tiene mucho potencial para atraer pacientes y derivaciones profesionales.\n\nTrabajo con psicólogos para posicionarse tanto a nivel clínico como corporativo en redes.\n\n¿Hablamos esta semana?' },
            { label: 'Ansiedad y nicho', texto: 'Hola [nombre], noto que te especializás en ansiedad — ese nicho tiene una demanda enorme en redes y muy poca oferta de contenido realmente útil.\n\nTrabajo con psicólogos para que esa especialización se traduzca en consultas concretas.\n\n¿Me contás más sobre tu práctica? Me interesa ver si podemos trabajar juntos.' },
            { label: 'Autoridad sin tiempo', texto: 'Hola [nombre], sé que el tiempo que le dedicás a redes es limitado entre consultas y supervisiones.\n\nPor eso trabajo con un sistema que genera contenido estratégico sin que vos tengas que estar encima de cada publicación.\n\n¿15 minutos para mostrarte cómo funciona?' },
            { label: 'TikTok y salud mental', texto: 'Hola [nombre], TikTok se convirtió en el lugar donde más personas buscan información sobre salud mental — y hay muy pocos psicólogos con contenido de calidad allá.\n\nEso es una oportunidad enorme para alguien como vos.\n\n¿Hablamos de cómo aprovecharlo?' }
        ]
    },
    personaltrainers: {
        label: 'Personal Trainers', icon: '💪', color: '#F97316', bg: '#FFF7ED', border: '#FED7AA',
        platforms: ['Instagram', 'TikTok', 'YouTube'],
        hashtags: {
            instagram: ['#personaltrainer','#personaltrainerbuenosaires','#entrenamientopersonalizado','#coachdeportivo','#fitnessbuenosaires','#entrenamientoonline','#personaltrainerargentina','#fitness','#gymba','#musculacion','#entrenamientofuncional','#vidaactiva','#ejercicioencasa','#transformacionfisica','#healthcoach','#fitlife','#entrenadorpersonal','#bodybuilding','#crossfit','#fitnessmotivacion','#fitmom','#rutinasejercicio','#pesoidealbuenosaires','#calistenia','#fuerza'],
            tiktok: ['#personaltrainer','#fitness','#gym','#entrenamiento','#ejercicio','#transformacion','#rutinadeejercicio','#fitnesstiktok','#gymtok','#entrenamientofuncional','#fuerza','#cardio','#motivacionfitness','#bodybuilding','#fitnessmotivation'],
            youtube: ['Personal trainer Buenos Aires','Entrenamiento en casa Argentina','Rutinas fitness Argentina']
        },
        mensajes: [
            { label: 'Métricas como diferencial', texto: 'Hola [nombre], vi tu perfil y se nota que sabés entrenar — tu contenido es bueno.\n\nLo que muy pocos trainers hacen es medir qué publicaciones generan clientes nuevos y cuáles solo likes. Trabajo exactamente en eso con PTs en Buenos Aires.\n\n¿Te copa ver cómo funciona? Te muestro en 15 minutos.' },
            { label: 'Escalar clientes online', texto: 'Hola [nombre], trabajás duro generando contenido y sé que convertirlo en clientes online es otra historia.\n\nDesarrollé un sistema para personal trainers en BA que conecta el contenido con resultados medibles — más consultas, menos tiempo perdido.\n\n¿Hablamos rápido esta semana?' },
            { label: 'Directo y corto', texto: 'Hola [nombre], ¿tu contenido de IG te trae clientes nuevos o solo seguidores?\n\nTrabajo con personal trainers en BA para que las dos cosas pasen. Sistema propio, métricas reales.\n\n¿15 minutos esta semana?' },
            { label: 'Saturación del nicho', texto: 'Hola [nombre], hay miles de PTs subiendo rutinas en Instagram. Los que realmente consiguen clientes son los que tienen una estrategia detrás de cada publicación — no solo contenido aleatorio.\n\nEso es lo que construyo con trainers en BA.\n\n¿Te interesa?' },
            { label: 'TikTok virality', texto: 'Hola [nombre], TikTok es hoy el mejor canal para trainers — el algoritmo empuja el contenido de fitness más que cualquier otra categoría.\n\nTrabajo con PTs para que ese alcance se convierta en clientes reales, no solo vistas.\n\n¿Hablamos esta semana?' },
            { label: 'Transformaciones reales', texto: 'Hola [nombre], vi algunas de tus transformaciones y son el tipo de contenido que más convierte en clientes.\n\nEl problema es que sin la estrategia correcta, esas fotos pasan desapercibidas. Trabajo con trainers en BA para que ese contenido llegue a quien tiene que llegar.\n\n¿Te cuento cómo en 15 minutos?' },
            { label: 'Clientes online', texto: 'Hola [nombre], el entrenamiento online creció enormemente y hay una demanda real de personas que buscan PTs para sesiones remotas.\n\nTrabajo con trainers para posicionarse en ese mercado con contenido que atrae a ese perfil de cliente.\n\n¿Charlamos rápido esta semana?' }
        ]
    },
    estetica: {
        label: 'Centros de Estética', icon: '✨', color: '#EC4899', bg: '#FDF2F8', border: '#FBCFE8',
        platforms: ['Instagram', 'Facebook', 'TikTok'],
        hashtags: {
            instagram: ['#estetica','#centrodestetica','#esteticabuenosaires','#esteticaargentina','#belleza','#tratamientosfaciales','#depilacion','#cuidadodelapiel','#skincareba','#mesoterapia','#tratamientoscorporales','#cosmetologa','#spa','#peeling','#esteticaprofesional','#bellezanatural','#hidratacion','#antienvejecimiento','#radiofrecuencia','#dermapen','#botox','#hiluronique','#bodypositive','#skincareroutine','#tratamientosbelleza'],
            facebook: ['Centros de Estética Buenos Aires','Estética y Belleza BA','Tratamientos Faciales Argentina','Spa Buenos Aires','Skin Care Argentina'],
            tiktok: ['#estetica','#skincare','#belleza','#cuidadodelapiel','#tratamientosfaciales','#esteticatiktok','#skincareroutine','#bellezanatural','#antienvejecimiento','#glowtiktok']
        },
        mensajes: [
            { label: 'Turnos desde redes', texto: 'Hola [nombre], vi tu centro y el trabajo que hacen es excelente.\n\nLo que noto es que las redes podrían estar trayendo muchos más turnos de los que traen ahora — con una estrategia que dirija a la acción concreta de reservar.\n\nTrabajo con centros de estética en BA exactamente en eso. ¿Charlamos 15 minutos?' },
            { label: 'Diferenciarse en el rubro', texto: 'Hola [nombre], el rubro de estética en Instagram está saturado de contenido genérico.\n\nLo que hace que un centro se destaque y llene su agenda es una estrategia clara — contenido con propósito, no solo fotos de resultados.\n\nTrabajo con centros en Buenos Aires en eso. ¿Te interesa ver cómo lo hacemos?' },
            { label: 'Antes y después que convierte', texto: 'Hola [nombre], los "antes y después" son el contenido que más convierte en estética — pero hay una forma correcta de presentarlos para que generen turnos y no solo likes.\n\nEso es exactamente lo que trabajamos con mis clientes de estética en BA.\n\n¿Te cuento más?' },
            { label: 'TikTok beauty', texto: 'Hola [nombre], TikTok se convirtió en el buscador de tendencias de belleza número 1. Las personas buscan tratamientos, precios y resultados directamente ahí antes de llamar.\n\nTrabajo con centros de estética para tener presencia en ese canal y convertirla en turnos reales.\n\n¿Hablamos?' },
            { label: 'Agenda vacía a llena', texto: 'Hola [nombre], el principal problema que me cuentan los centros de estética no es la calidad del servicio — es que la agenda no está llena todo el tiempo.\n\nTrabajo específicamente en eso: contenido que genera reservas constantes, no solo temporadas.\n\n¿15 minutos esta semana?' },
            { label: 'Temporada alta', texto: 'Hola [nombre], con las vacaciones/el verano/la primavera que se acerca, es el mejor momento para posicionar el centro antes de que la demanda explote.\n\nTrabajo con centros de estética en BA para que lleguen a esos meses con agenda llena.\n\n¿Hablamos esta semana?' }
        ]
    },
    clinicas: {
        label: 'Clínicas Médicas', icon: '🏥', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE',
        platforms: ['Instagram', 'Facebook', 'LinkedIn'],
        hashtags: {
            instagram: ['#clinica','#clinicamedicabuenosaires','#medicobuenosaires','#saludbuenosaires','#medicinaestetica','#salud','#medicinaintegrada','#clinicaprivada','#saludybienestar','#medicoargentino','#clinicaargentina','#dermatologo','#ginecologoba','#medicinafuncional','#saludintegrativa','#medicinadeportiva','#consultoriomedico','#clinicafamiliar','#medicostiktok','#saludba'],
            facebook: ['Clínicas Buenos Aires','Médicos Buenos Aires','Salud Argentina','Medicina Estética BA','Clínicas Privadas Argentina'],
            linkedin: ['medicina privada Argentina','clínica Buenos Aires','salud corporativa','medicina ocupacional Argentina','consultorios médicos BA']
        },
        mensajes: [
            { label: 'Pacientes desde redes', texto: 'Hola [nombre], vi el perfil de su clínica y el nivel profesional que manejan es muy bueno.\n\nLo que falta para cerrar el círculo es que ese contenido empiece a generar turnos de pacientes nuevos — no solo autoridad.\n\nTrabajo con clínicas en Buenos Aires en eso. ¿Tienen 15 minutos para que les cuente cómo lo hacemos?' },
            { label: 'Posicionamiento médico', texto: 'Hola [nombre], trabajo con clínicas y consultorios médicos en BA que quieren posicionarse en redes de forma seria y profesional.\n\nNada de contenido genérico — estrategia pensada para el sector salud, con métricas reales y seguimiento personalizado.\n\n¿Charlamos esta semana?' },
            { label: 'LinkedIn médico', texto: 'Hola [nombre], vi su perfil de LinkedIn y hay una oportunidad muy clara de posicionarse como referente en [especialidad] tanto para pacientes particulares como para derivaciones de obra social.\n\nEso requiere una estrategia específica — distinta a la de Instagram.\n\n¿Hablamos?' },
            { label: 'Confianza y autoridad', texto: 'Hola [nombre], en medicina la confianza es todo. El contenido en redes es hoy el primer filtro que los pacientes usan antes de elegir un profesional.\n\nTrabajo con clínicas en BA para que ese primer contacto genere la confianza necesaria para concretar el turno.\n\n¿15 minutos esta semana?' }
        ]
    },
    abogados: {
        label: 'Abogados / Estudios', icon: '⚖️', color: '#6366F1', bg: '#EEF2FF', border: '#C7D2FE',
        platforms: ['Instagram', 'LinkedIn', 'Facebook'],
        hashtags: {
            instagram: ['#abogado','#abogadobuenosaires','#estudiojuridico','#derechoargentino','#abogadoargentino','#asesorajuridica','#derechofamiliar','#derechocivil','#derecholaboral','#divorciobuenosaires','#derechopenal','#asesoramientojuridico','#abogadaconsultora','#legalbuenosaires','#justicia','#derechocomercial','#sucesionesbuenosaires','#derechocontractual','#abogadalegalba','#consultoriajuridica'],
            linkedin: ['abogado Buenos Aires','estudio jurídico Argentina','derecho comercial BA','asesoría legal empresas','derecho laboral Argentina','compliance legal'],
            facebook: ['Abogados Buenos Aires','Asesoría Jurídica Argentina','Estudio Jurídico BA','Derecho Familiar Argentina']
        },
        mensajes: [
            { label: 'Autoridad digital', texto: 'Hola [nombre], vi tu perfil y la especialización que tenés en [área] es exactamente el tipo de expertise que la gente busca en redes antes de contratar un abogado.\n\nEl problema es que sin la estrategia correcta, ese expertise queda invisible.\n\nTrabajo con abogados en BA para que eso cambie. ¿Hablamos?' },
            { label: 'Consultas desde LinkedIn', texto: 'Hola [nombre], LinkedIn es hoy el canal más subutilizado por abogados en Argentina — y el que más potencial tiene para conseguir clientes corporativos y empresariales.\n\nTrabajo con estudios jurídicos para posicionarse en ese canal de forma estratégica.\n\n¿Te interesa ver cómo lo hacemos?' },
            { label: 'Educación que convierte', texto: 'Hola [nombre], el contenido educativo en redes funciona muy bien para abogados — pero hay que saber presentarlo para que genere consultas y no solo seguidores.\n\nEso es exactamente lo que trabajo con mis clientes del sector legal en BA.\n\n¿Charlamos 15 minutos?' },
            { label: 'Nicho específico', texto: 'Hola [nombre], noto que te especializás en [nicho legal] — esa especificidad es un diferencial enorme que muy pocos saben comunicar bien en redes.\n\nTrabajo con abogados para que esa especialización se traduzca en más consultas.\n\n¿Hablamos esta semana?' },
            { label: 'Instagram approach', texto: 'Hola [nombre], cada vez más personas usan Instagram para buscar un abogado de confianza antes de llamar.\n\nTu perfil tiene buena presencia pero hay ajustes clave que harían que más de esas búsquedas terminen en consultas tuyas.\n\nTrabajo en eso con estudios en BA. ¿Charlamos?' }
        ]
    },
    contadores: {
        label: 'Contadores / Estudios Contables', icon: '📊', color: '#0EA5E9', bg: '#F0F9FF', border: '#BAE6FD',
        platforms: ['Instagram', 'LinkedIn', 'Facebook'],
        hashtags: {
            instagram: ['#contador','#contadorbuenosaires','#estudiocontable','#contabilidadargentina','#contadorargentino','#asesoriacontable','#impuestosargentina','#monotoribistas','#pymes','#afip','#contabilidadpyme','#asesoriafiscal','#contadorpublico','#contabilidadba','#iva','#balanceanual','#sueldosargentina','#autonomos','#contadoria','#impuestosba'],
            linkedin: ['contador público Buenos Aires','estudio contable Argentina','asesoría impositiva','pymes Argentina','compliance fiscal','contabilidad empresarial BA'],
            facebook: ['Contadores Buenos Aires','Asesoría Contable Argentina','Estudio Contable BA','AFIP y Contabilidad Argentina']
        },
        mensajes: [
            { label: 'Pymes que necesitan ayuda', texto: 'Hola [nombre], trabajo con contadores en BA ayudándolos a atraer pymes y autónomos a través de redes — que es donde hoy buscan asesoramiento contable antes de llamar.\n\n¿Tenés presencia activa en Instagram o LinkedIn? ¿Hablamos rápido esta semana?' },
            { label: 'LinkedIn B2B', texto: 'Hola [nombre], LinkedIn es el canal ideal para estudios contables — hay miles de dueños de pymes ahí buscando asesoramiento confiable.\n\nTrabajo con contadores para generar ese flujo de consultas desde LinkedIn con contenido estratégico.\n\n¿Te interesa?' },
            { label: 'Monotributo y autónomos', texto: 'Hola [nombre], el nicho de monotributistas y autónomos en Argentina es enorme y está buscando constantemente asesoramiento en redes.\n\nTrabajo con contadores para posicionarse como la referencia de ese público en Instagram y LinkedIn.\n\n¿Charlamos 15 minutos?' },
            { label: 'Temporada impositiva', texto: 'Hola [nombre], con el vencimiento de [período impositivo] que se acerca, es el momento perfecto para estar visible en redes y captar clientes que necesitan ayuda urgente.\n\nTrabajo con estudios contables para aprovechar esas temporadas con estrategia.\n\n¿Hablamos esta semana?' }
        ]
    },
    odontologos: {
        label: 'Odontólogos', icon: '🦷', color: '#06B6D4', bg: '#ECFEFF', border: '#A5F3FC',
        platforms: ['Instagram', 'Facebook', 'TikTok'],
        hashtags: {
            instagram: ['#odontologo','#odontologobuenosaires','#dentistabuenosaires','#odontologiaargentina','#odontologiaestetica','#blanqueamiento','#ortodoncia','#implantesba','#sonrisabuenosaires','#esteticadental','#dentistaba','#odontologiageneral','#carillasba','#veneers','#ortodoncia invisible','#clinicadental','#salud oral','#dentistaargentino','#bracketsba','#sonrisaperfecta'],
            facebook: ['Odontólogos Buenos Aires','Estética Dental Argentina','Ortodoncia Buenos Aires','Clínica Dental BA'],
            tiktok: ['#odontologo','#blanqueamiento','#ortodoncia','#esteticadental','#dentista','#sonrisa','#veneers','#dientesba','#odontologiatiktok','#salud oral']
        },
        mensajes: [
            { label: 'Estética dental que vende', texto: 'Hola [nombre], la odontología estética es una de las categorías que más convierte desde redes cuando se muestra correctamente.\n\nTrabajo con odontólogos en BA para que sus casos de blanqueamiento, carillas y ortodoncia atraigan exactamente el tipo de paciente que buscan.\n\n¿Hablamos 15 minutos?' },
            { label: 'Antes y después dental', texto: 'Hola [nombre], vi algunos de tus casos y los resultados que lográs son exactamente el tipo de contenido que convierte en pacientes nuevos — si se presenta con la estrategia correcta.\n\nTrabajo con odontólogos en BA para que eso pase. ¿Te cuento cómo en 15 minutos?' },
            { label: 'TikTok dental', texto: 'Hola [nombre], los videos de transformaciones dentales son virales en TikTok — hay odontólogos con millones de vistas que convierten en consultas reales.\n\nTrabajo para que eso pase con profesionales en Buenos Aires. ¿Hablamos?' },
            { label: 'Turno desde Instagram', texto: 'Hola [nombre], ¿cuántos de los que siguen tu perfil terminan pidiendo turno?\n\nEsa conversión es exactamente lo que trabajo con odontólogos en BA — el camino del seguidor al paciente.\n\n¿15 minutos esta semana?' },
            { label: 'Diferenciación visual', texto: 'Hola [nombre], en odontología el visual es todo — pero publicar fotos de dientes no alcanza.\n\nHay una forma de mostrar el trabajo que genera confianza inmediata y lleva al turno.\n\nTrabajo con odontólogos en BA en eso. ¿Hablamos?' }
        ]
    },
    arquitectos: {
        label: 'Arquitectos / Diseñadores', icon: '🏗️', color: '#78716C', bg: '#F5F5F4', border: '#D6D3D1',
        platforms: ['Instagram', 'LinkedIn', 'Pinterest'],
        hashtags: {
            instagram: ['#arquitecto','#arquitectura','#arquitectobuenosaires','#diseñodeinteriores','#interiordesign','#arquitecturaargentina','#diseñointerior','#casasmodernas','#arquitecturaminimalista','#decoracion','#remodelacion','#construccion','#diseñoindustrial','#interiorismo','#homedecor','#decoracionba','#arquitecturacontemporanea','#diseñoresidencial','#renovacion','#casasba'],
            linkedin: ['arquitecto Buenos Aires','diseño de interiores Argentina','construcción sustentable','arquitectura comercial BA','diseño corporativo Argentina'],
            facebook: ['Arquitectos Buenos Aires','Diseño de Interiores Argentina','Construcción BA','Arquitectura Argentina']
        },
        mensajes: [
            { label: 'Portfolio que atrae clientes', texto: 'Hola [nombre], vi tu trabajo y el nivel de diseño que tenés es excelente — pero Instagram no te está haciendo justicia.\n\nTrabajo con arquitectos y diseñadores en BA para que el portfolio en redes genere consultas de proyectos del tipo que querés tomar.\n\n¿Hablamos 15 minutos?' },
            { label: 'Proyectos ideales', texto: 'Hola [nombre], una de las cosas que trabajo con arquitectos es que el contenido atraiga el tipo de proyecto que más les interesa — no cualquier proyecto.\n\nEso requiere una estrategia específica de posicionamiento en redes.\n\n¿Te interesa verlo en 15 minutos?' },
            { label: 'LinkedIn y corporativo', texto: 'Hola [nombre], hay una demanda enorme de arquitectos para proyectos corporativos y comerciales que se mueve por LinkedIn — y muy pocos estudios están posicionados ahí.\n\nTrabajo específicamente en eso. ¿Hablamos?' },
            { label: 'Remodelaciones y reformas', texto: 'Hola [nombre], las remodelaciones son hoy el servicio con más demanda en Instagram BA — las personas buscan profesionales antes de contratar.\n\nTrabajo con arquitectos para que ese search termine en tu perfil y en una consulta.\n\n¿Charlamos esta semana?' }
        ]
    },
    coaches: {
        label: 'Coaches / Consultores', icon: '🎯', color: '#F59E0B', bg: '#FFFBEB', border: '#FDE68A',
        platforms: ['Instagram', 'LinkedIn', 'TikTok', 'YouTube'],
        hashtags: {
            instagram: ['#coach','#coachbuenosaires','#coaching','#desarrollopersonal','#coachargentina','#mentoringbusiness','#emprendimiento','#liderazgo','#coachingonline','#coachingpersonal','#transformacion','#exito','#motivacion','#coachempresarial','#mentoringba','#coachprofesional','#negociosonline','#emprendedorba','#mindsetemprendedor','#coachdenegocios'],
            linkedin: ['coach ejecutivo Argentina','consultoría empresarial BA','liderazgo organizacional','desarrollo de equipos Argentina','business coach Buenos Aires','consultoría estratégica'],
            tiktok: ['#coach','#coaching','#desarrollopersonal','#motivacion','#liderazgo','#emprendedor','#exito','#mentalidad','#coaching tiktok','#coachba'],
            youtube: ['Coach Buenos Aires','Desarrollo personal Argentina','Coaching empresarial','Emprendimiento Argentina']
        },
        mensajes: [
            { label: 'Autoridad de nicho', texto: 'Hola [nombre], el mercado de coaching en Argentina es enorme pero está muy fragmentado — los coaches que tienen éxito son los que se posicionan en un nicho específico y son reconocidos como la referencia.\n\nTrabajo con coaches en BA para que eso pase. ¿Hablamos 15 minutos?' },
            { label: 'Embudos de contenido', texto: 'Hola [nombre], el contenido de coaching funciona diferente al de otros rubros — necesita construir confianza antes de vender.\n\nEso requiere una secuencia estratégica de publicaciones que yo armo y mido con mis clientes.\n\n¿Te interesa verlo en 15 minutos?' },
            { label: 'LinkedIn ejecutivo', texto: 'Hola [nombre], los coaches ejecutivos y de negocios tienen en LinkedIn su mejor canal — pero requiere un enfoque muy específico para convertir.\n\nTrabajo con consultores y coaches para posicionarse en ese canal y generar consultas de alta calidad.\n\n¿Hablamos esta semana?' },
            { label: 'TikTok para coaches', texto: 'Hola [nombre], TikTok está explotando en el nicho de desarrollo personal — hay coaches con millones de seguidores que convirtieron eso en negocios de 6 cifras.\n\nTrabajo con coaches en BA para aprovechar ese canal con contenido estratégico.\n\n¿Charlamos?' },
            { label: 'Webinars y lanzamientos', texto: 'Hola [nombre], vi que hacés contenido pero noto que no tiene una estructura que lleve hacia tus programas o servicios.\n\nTrabajo con coaches para que el contenido de redes sea parte de un embudo que genera ventas reales.\n\n¿15 minutos esta semana?' }
        ]
    },
    restaurantes: {
        label: 'Restaurantes / Gastronomía', icon: '🍽️', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA',
        platforms: ['Instagram', 'TikTok', 'Facebook'],
        hashtags: {
            instagram: ['#restaurante','#restaurantebuenosaires','#gastronomia','#foodblogger','#comidaargentina','#gastronomiaba','#foodies','#restauranteargentina','#cocinachef','#menudeldia','#foodie','#gastronomiabuenosaires','#restauranteba','#chefargentino','#comidacasera','#brunch','#desayunoba','#almuerzo','#cena','#takeaway','#deliverybuenosaires','#comida','#pasta','#sushi','#pizza'],
            facebook: ['Restaurantes Buenos Aires','Gastronomía Argentina','Foodie BA','Buenos Aires Foodie','Cocina Argentina'],
            tiktok: ['#restaurante','#foodtiktok','#gastronomia','#comida','#chef','#recipe','#food','#cooking','#foodie','#yummy','#gastronomiatiktok','#restauranteBA']
        },
        mensajes: [
            { label: 'Más reservas desde IG', texto: 'Hola [nombre], vi el restaurante y el tipo de platos que tienen es exactamente lo que la gente busca en Instagram antes de reservar.\n\nEl problema es que sin la presentación correcta, ese contenido no se convierte en mesas llenas.\n\nTrabajo con restaurantes en BA en eso. ¿Hablamos 15 minutos?' },
            { label: 'TikTok viral', texto: 'Hola [nombre], en TikTok hay restaurantes que llenaron semanas enteras de reservas con un solo video viral.\n\nTrabajo con restaurantes en BA para generar ese tipo de contenido de forma sistemática — no por suerte.\n\n¿Te interesa ver cómo lo hacemos?' },
            { label: 'Delivery y alcance', texto: 'Hola [nombre], el delivery en Buenos Aires es uno de los mercados más competitivos y las redes son el principal canal para diferenciarse.\n\nTrabajo con restaurantes para que su contenido los posicione por encima de los competidores en la zona.\n\n¿Charlamos esta semana?' },
            { label: 'Fotos que generan hambre', texto: 'Hola [nombre], hay una gran diferencia entre una foto de comida que se ve bien y una que hace que la persona quiera ir ya mismo.\n\nEso no es solo fotografía — es estrategia. Trabajo con restaurantes en BA en eso.\n\n¿15 minutos esta semana?' }
        ]
    },
    inmobiliarias: {
        label: 'Inmobiliarias / Brokers', icon: '🏠', color: '#0D9488', bg: '#F0FDFA', border: '#99F6E4',
        platforms: ['Instagram', 'Facebook', 'LinkedIn', 'TikTok'],
        hashtags: {
            instagram: ['#inmobiliaria','#inmobiliariabuenosaires','#propiedades','#inmuebles','#realestateargentina','#alquiler','#ventadepropiedades','#brokerinmobiliario','#casasbuenosaires','#departamentosba','#inmobiliariaargentina','#buyingahome','#realestate','#propiedadesba','#alquileres','#ventasdepartamentos','#casasba','#propiedadesargentina','#inmobiliariaba','#inversiones'],
            facebook: ['Inmobiliarias Buenos Aires','Propiedades Argentina','Alquileres BA','Real Estate Argentina','Brokers Inmobiliarios BA'],
            linkedin: ['inmobiliaria Buenos Aires','real estate Argentina','inversiones inmobiliarias','propiedades comerciales BA','broker inmobiliario'],
            tiktok: ['#inmobiliaria','#propiedades','#realestate','#casasbonitas','#departamento','#alquiler','#inversion','#realestatetiktok','#propiedadesba','#casas']
        },
        mensajes: [
            { label: 'Propiedades que se venden solas', texto: 'Hola [nombre], en el mercado inmobiliario actual, las propiedades que se venden rápido son las que tienen la exposición correcta en redes — no solo en portales.\n\nTrabajo con inmobiliarias y brokers en BA para eso.\n\n¿Hablamos 15 minutos?' },
            { label: 'TikTok inmobiliario', texto: 'Hola [nombre], los recorridos de propiedades en TikTok son uno de los contenidos con más alcance orgánico — hay brokers que consiguen leads diarios desde ahí.\n\nTrabajo con inmobiliarias en BA para implementar eso de forma estratégica.\n\n¿Te interesa?' },
            { label: 'LinkedIn para inversores', texto: 'Hola [nombre], LinkedIn es el mejor canal para llegar a inversores y compradores de propiedades de alto valor.\n\nTrabajo con brokers en BA para posicionarse en ese perfil de comprador.\n\n¿Hablamos esta semana?' },
            { label: 'Diferenciación de zona', texto: 'Hola [nombre], hay muchas inmobiliarias en Buenos Aires pero pocas que son reconocidas como la referencia de una zona específica.\n\nEso se construye con contenido estratégico en redes. Trabajo en eso con inmobiliarias en BA.\n\n¿15 minutos?' }
        ]
    },
    educacion: {
        label: 'Educación / Academias', icon: '📚', color: '#7C3AED', bg: '#F5F3FF', border: '#DDD6FE',
        platforms: ['Instagram', 'LinkedIn', 'TikTok', 'YouTube'],
        hashtags: {
            instagram: ['#academia','#cursoonline','#educacion','#aprendizaje','#capacitacion','#cursosba','#educacionargentina','#formacionprofesional','#coachingba','#talleres','#workshopba','#certificacion','#elearning','#educaciononline','#capacitacionprofesional','#cursos','#masterclass','#diplomatura','#programacion','#marketingdigital'],
            linkedin: ['academia online Argentina','cursos profesionales BA','educación corporativa','capacitación empresarial','e-learning Argentina','formación continua'],
            tiktok: ['#aprender','#educacion','#estudiar','#curso','#aprendizaje','#educaciontiktok','#tips','#conocimiento','#growth','#skillstiktok'],
            youtube: ['Cursos online Argentina','Academia Buenos Aires','Educación profesional','Capacitación online BA']
        },
        mensajes: [
            { label: 'Alumnos desde redes', texto: 'Hola [nombre], vi tu academia y el nivel de los programas que ofrecen es muy bueno.\n\nLo que noto es que las redes no están generando el flujo de inscriptos que podrían — con la estrategia correcta ese número puede cambiar bastante.\n\nTrabajo con academias y cursos en BA en eso. ¿Hablamos?' },
            { label: 'LinkedIn para B2B', texto: 'Hola [nombre], si tu academia ofrece capacitación profesional o corporativa, LinkedIn es el canal más subutilizado que tenés.\n\nTrabajo con instituciones educativas para posicionarse en ese canal y conseguir tanto inscriptos individuales como contratos corporativos.\n\n¿15 minutos esta semana?' },
            { label: 'TikTok educativo', texto: 'Hola [nombre], el contenido educativo en TikTok tiene un alcance orgánico brutal — los mejores canales educativos del mundo están ahí.\n\nTrabajo con academias para aprovechar ese canal y convertir el alcance en inscriptos reales.\n\n¿Hablamos?' }
        ]
    }
};






// ── RENDER HELPERS ────────────────────────────────────────────────
function card(title, subtitle, content, accentColor) {
    accentColor = accentColor || '#F97316';
    return '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;overflow:hidden;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="padding:14px 18px 12px;border-bottom:1px solid #F3F4F6;background:#FAFAFA;display:flex;align-items:center;justify-content:space-between;">'
        + '<div><div style="font-size:13px;font-weight:700;color:#0D1117;">' + title + '</div>'
        + (subtitle ? '<div style="font-size:11px;color:#9CA3AF;margin-top:2px;">' + subtitle + '</div>' : '')
        + '</div></div>'
        + '<div style="padding:16px 18px;">' + content + '</div>'
        + '</div>';
}

function badge(text, color, bg, border) {
    return '<span style="font-size:10px;font-weight:700;padding:3px 9px;border-radius:999px;background:' + bg + ';color:' + color + ';border:1px solid ' + border + ';">' + text + '</span>';
}

function nichoSelector(id, onchange) {
    var opts = Object.keys(NICHOS).map(function(k) {
        return '<option value="' + k + '">' + NICHOS[k].icon + ' ' + NICHOS[k].label + '</option>';
    }).join('');
    return '<div style="display:flex;align-items:center;gap:10px;margin-bottom:16px;">'
        + '<label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6B7280;flex-shrink:0;">Nicho</label>'
        + '<select id="' + id + '" onchange="' + onchange + '" class="form-select" style="flex:1;max-width:260px;">'
        + opts
        + '</select></div>';
}

// ════════════════════════════════════════════════════════════════
// SECCIÓN 1: MENSAJES DM
// ════════════════════════════════════════════════════════════════
function renderMessagesSection() {
    var container = document.getElementById('prosp-messages');
    if (!container) return;

    var nicho = document.getElementById('msg-nicho-sel') ? document.getElementById('msg-nicho-sel').value : 'nutricionistas';
    var n = NICHOS[nicho];
    if (!n) return;

    var msgIdx = parseInt(localStorage.getItem('bondi-prosp-msg-idx-' + nicho) || '0');
    var msg = n.mensajes[msgIdx] || n.mensajes[0];
    var total = n.mensajes.length;

    var platformBadges = n.platforms.map(function(p) {
        return badge(p, '#1E40AF', '#EFF6FF', '#BFDBFE');
    }).join(' ');

    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div><h2 style="font-size:18px;font-weight:700;color:#0D1117;">Mensajes DM</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Mensajes listos para copiar y enviar por nicho</p></div>'
        + '</div>'

        // Selector de nicho
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px;margin-bottom:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap;">'
        + Object.keys(NICHOS).map(function(k) {
            var nn = NICHOS[k];
            var active = k === nicho;
            return '<button onclick="selectNichoMsg(\'' + k + '\')" style="display:flex;align-items:center;gap:6px;padding:7px 14px;border-radius:999px;border:1.5px solid '
                + (active ? nn.color : '#E5E7EB') + ';background:' + (active ? nn.bg : '#fff') + ';cursor:pointer;font-size:12px;font-weight:' + (active ? '700' : '500') + ';color:' + (active ? nn.color : '#6B7280') + ';transition:all .14s;font-family:Inter,sans-serif;">'
                + '<span>' + nn.icon + '</span><span>' + nn.label + '</span>'
                + '</button>';
        }).join('')
        + '</div>'
        + '<input type="hidden" id="msg-nicho-sel" value="' + nicho + '">'
        + '</div>'

        // Panel del mensaje
        + '<div style="display:grid;grid-template-columns:1fr 340px;gap:16px;">'

        // Izquierda: mensaje activo
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
        + '<div style="display:flex;align-items:center;gap:8px;">'
        + '<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;">Variante activa</span>'
        + badge(msg.label, n.color, n.bg, n.border)
        + '</div>'
        + '<span style="font-size:11px;color:#9CA3AF;">' + (msgIdx + 1) + ' de ' + total + '</span>'
        + '</div>'

        // Textarea del mensaje
        + '<textarea id="active-msg-text" style="width:100%;min-height:180px;padding:12px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;font-family:Inter,sans-serif;line-height:1.6;resize:vertical;background:#FAFAFA;" readonly>'
        + msg.texto
        + '</textarea>'

        // Acciones
        + '<div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap;">'
        + '<button class="btn-primary" onclick="copyActiveMsg()" style="display:flex;align-items:center;gap:6px;">'
        + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
        + 'Copiar mensaje</button>'
        + '<button class="btn-secondary" onclick="prevMsg(\'' + nicho + '\')" style="display:flex;align-items:center;gap:4px;">'
        + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>'
        + 'Anterior</button>'
        + '<button class="btn-secondary" onclick="nextMsg(\'' + nicho + '\')" style="display:flex;align-items:center;gap:4px;">'
        + 'Siguiente'
        + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>'
        + '</button>'
        + '<button class="btn-secondary" onclick="shuffleMsg(\'' + nicho + '\')" style="display:flex;align-items:center;gap:4px;">'
        + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/></svg>'
        + 'Aleatorio</button>'
        + '</div>'
        + '</div>'

        // Derecha: lista de variantes
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:12px;">Todas las variantes</div>'
        + n.mensajes.map(function(m, i) {
            var active = i === msgIdx;
            return '<div onclick="selectMsgVariant(\'' + nicho + '\',' + i + ')" style="padding:9px 12px;border-radius:9px;border:1.5px solid '
                + (active ? n.color : '#E5E7EB') + ';background:' + (active ? n.bg : '#fff') + ';cursor:pointer;margin-bottom:6px;transition:all .14s;">'
                + '<div style="font-size:12px;font-weight:' + (active ? '700' : '500') + ';color:' + (active ? n.color : '#374151') + ';">' + (i+1) + '. ' + m.label + '</div>'
                + '<div style="font-size:11px;color:#9CA3AF;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">' + m.texto.substring(0, 55) + '...</div>'
                + '</div>';
        }).join('')
        + '<div style="margin-top:12px;padding-top:12px;border-top:1px solid #F3F4F6;">'
        + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:6px;">Plataformas</div>'
        + '<div style="display:flex;gap:5px;flex-wrap:wrap;">' + platformBadges + '</div>'
        + '</div>'
        + '</div>'

        + '</div>'; // end grid
}

window.selectNichoMsg = function(nicho) {
    var inp = document.getElementById('msg-nicho-sel');
    if (inp) inp.value = nicho;
    renderMessagesSection();
};

window.selectMsgVariant = function(nicho, idx) {
    localStorage.setItem('bondi-prosp-msg-idx-' + nicho, idx);
    renderMessagesSection();
};

window.prevMsg = function(nicho) {
    var n = NICHOS[nicho];
    if (!n) return;
    var idx = parseInt(localStorage.getItem('bondi-prosp-msg-idx-' + nicho) || '0');
    idx = (idx - 1 + n.mensajes.length) % n.mensajes.length;
    localStorage.setItem('bondi-prosp-msg-idx-' + nicho, idx);
    renderMessagesSection();
};

window.nextMsg = function(nicho) {
    var n = NICHOS[nicho];
    if (!n) return;
    var idx = parseInt(localStorage.getItem('bondi-prosp-msg-idx-' + nicho) || '0');
    idx = (idx + 1) % n.mensajes.length;
    localStorage.setItem('bondi-prosp-msg-idx-' + nicho, idx);
    renderMessagesSection();
};

window.shuffleMsg = function(nicho) {
    var n = NICHOS[nicho];
    if (!n) return;
    var idx = Math.floor(Math.random() * n.mensajes.length);
    localStorage.setItem('bondi-prosp-msg-idx-' + nicho, idx);
    renderMessagesSection();
};

window.copyActiveMsg = function() {
    var ta = document.getElementById('active-msg-text');
    if (!ta) return;
    navigator.clipboard.writeText(ta.value).then(function() {
        if (typeof showSuccess === 'function') showSuccess('Mensaje copiado al portapapeles');
    });
};

// ════════════════════════════════════════════════════════════════
// SECCIÓN 2: HASHTAGS
// ════════════════════════════════════════════════════════════════
function renderHashtagsSection() {
    var container = document.getElementById('prosp-hashtags');
    if (!container) return;

    var nicho = document.getElementById('ht-nicho-sel') ? document.getElementById('ht-nicho-sel').value : 'nutricionistas';
    var plat  = document.getElementById('ht-plat-sel')  ? document.getElementById('ht-plat-sel').value  : 'instagram';
    var n = NICHOS[nicho];
    if (!n) return;

    var platKey = plat.toLowerCase();
    var tags = (n.hashtags[platKey] || []);
    var platOpts = n.platforms.map(function(p) {
        var key = p.toLowerCase();
        var active = key === platKey;
        return '<option value="' + key + '"' + (active ? ' selected' : '') + '>' + p + '</option>';
    }).join('');

    container.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div><h2 style="font-size:18px;font-weight:700;color:#0D1117;">Hashtags por Nicho</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Para buscar prospectos en cada plataforma</p></div>'
        + '</div>'

        // Filtros
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 18px;margin-bottom:16px;display:flex;align-items:center;gap:16px;flex-wrap:wrap;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="display:flex;align-items:center;gap:8px;">'
        + '<label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6B7280;">Nicho</label>'
        + '<select id="ht-nicho-sel" onchange="renderHashtagsSection()" class="form-select" style="min-width:180px;">'
        + Object.keys(NICHOS).map(function(k) {
            return '<option value="' + k + '"' + (k === nicho ? ' selected' : '') + '>' + NICHOS[k].icon + ' ' + NICHOS[k].label + '</option>';
        }).join('')
        + '</select></div>'
        + '<div style="display:flex;align-items:center;gap:8px;">'
        + '<label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6B7280;">Plataforma</label>'
        + '<select id="ht-plat-sel" onchange="renderHashtagsSection()" class="form-select" style="min-width:140px;">'
        + platOpts
        + '</select></div>'
        + '<button class="btn-secondary" onclick="copyAllHashtags()" style="margin-left:auto;display:flex;align-items:center;gap:6px;">'
        + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>'
        + 'Copiar todos</button>'
        + '</div>'

        // Grid de hashtags
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">'
        + '<span style="font-size:12px;font-weight:600;color:#374151;">' + tags.length + ' hashtags para ' + n.label + ' en ' + plat + '</span>'
        + '</div>'
        + '<div id="hashtag-grid" style="display:flex;flex-wrap:wrap;gap:7px;">'
        + tags.map(function(t) {
            return '<button onclick="copyOneHashtag(this,\'' + t.replace(/'/g, "\\'") + '\')" title="Clic para copiar" style="padding:5px 12px;border-radius:999px;border:1.5px solid ' + n.border + ';background:' + n.bg + ';color:' + n.color + ';font-size:12px;font-weight:600;cursor:pointer;font-family:Inter,sans-serif;transition:all .14s;">'
                + t + '</button>';
        }).join('')
        + '</div>'
        + '<div style="margin-top:16px;padding-top:14px;border-top:1px solid #F3F4F6;">'
        + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:8px;">Cómo usarlos</div>'
        + '<div style="font-size:12px;color:#6B7280;line-height:1.6;">'
        + 'Buscá el hashtag en Instagram → filtrá por "Cuentas" → seleccioná perfiles con 500–5000 seguidores y publicaciones recientes. Son tus mejores prospectos.'
        + '</div></div>'
        + '</div>';
}

window.copyOneHashtag = function(btn, tag) {
    navigator.clipboard.writeText(tag).then(function() {
        var orig = btn.style.background;
        btn.style.background = '#D1FAE5';
        btn.style.borderColor = '#A7F3D0';
        btn.style.color = '#065F46';
        setTimeout(function() {
            btn.style.background = orig;
            btn.style.borderColor = '';
            btn.style.color = '';
        }, 1200);
    });
};

window.copyAllHashtags = function() {
    var nicho = document.getElementById('ht-nicho-sel')?.value || 'nutricionistas';
    var plat  = document.getElementById('ht-plat-sel')?.value  || 'instagram';
    var n = NICHOS[nicho];
    if (!n) return;
    var tags = (n.hashtags[plat] || []).join(' ');
    navigator.clipboard.writeText(tags).then(function() {
        if (typeof showSuccess === 'function') showSuccess('Todos los hashtags copiados');
    });
};

// Exponer para re-render desde select
window.renderHashtagsSection = renderHashtagsSection;


// ════════════════════════════════════════════════════════════════
// SECCIÓN 3: RESPUESTAS DM
// ════════════════════════════════════════════════════════════════
var RESPUESTAS = {
    precio: {
        label: 'Pregunta por el precio', icon: '💰', color: '#92400E', bg: '#FEF3C7', border: '#FDE68A',
        items: [
            { label: 'Redirigir a reunión', texto: 'Los valores dependen de lo que necesitás específicamente — hay distintas opciones. Lo más práctico es que charlemos 15 minutos y te cuento exactamente qué incluye y cuánto sale según tu situación. ¿Cuándo podés?' },
            { label: 'Rango general', texto: 'Los servicios arrancan desde $[precio_base] por mes, dependiendo del volumen de contenido y las plataformas. ¿Tenés 15 minutos para que te arme algo personalizado?' },
            { label: 'Valor primero', texto: 'Antes de hablar de precio, dejame entender qué necesitás — hay diferencias grandes según el punto en el que estés. ¿Hablamos rápido esta semana?' },
            { label: 'Comparar inversión', texto: 'Te entiendo, el presupuesto siempre es una variable. Lo que trabajo con mis clientes es que el sistema se pague solo en los primeros meses con los turnos/clientes que genera. ¿Hablamos de los números específicos en una charla rápida?' },
            { label: 'Transparencia total', texto: 'Con gusto te cuento. Trabajo con planes desde $[X] hasta $[Y] dependiendo de lo que necesitás. En 15 minutos te explico qué incluye cada uno y cuál tiene más sentido para vos. ¿Cuándo te queda bien?' }
        ]
    },
    interesada: {
        label: 'Muestra interés', icon: '✅', color: '#065F46', bg: '#D1FAE5', border: '#A7F3D0',
        items: [
            { label: 'Agendar directa', texto: '¡Genial [nombre]! Te propongo esta semana: ¿te queda bien el [día] a las [hora]? Son 15 minutos por videollamada, te muestro cómo funciona el sistema con ejemplos del nicho.' },
            { label: 'Confirmar interés', texto: 'Me alegra que resuene. Para mostrarte bien cómo funciona, ¿me contás un poco tu situación actual? ¿Cuánto publicás por semana y qué plataformas usás más?' },
            { label: 'Enviar link Calendly', texto: 'Perfecto [nombre]. Dejame compartirte mi link para que elijas el horario que mejor te quede: [link_calendly] — son 15 minutos sin compromiso.' },
            { label: 'Profundizar el interés', texto: '¡Qué bueno! Contame, ¿qué fue lo que más te resonó del mensaje? Así me aseguro de mostrarte exactamente lo que necesitás cuando nos juntemos.' },
            { label: 'Urgencia suave', texto: 'Me alegra que te interese. Esta semana tengo lugar para una charla de 15 minutos — después el calendario se llena bastante. ¿Te conviene mañana o pasado?' }
        ]
    },
    notengo_tiempo: {
        label: 'No tengo tiempo ahora', icon: '⏰', color: '#1E40AF', bg: '#DBEAFE', border: '#BFDBFE',
        items: [
            { label: 'Sin presión', texto: 'Tranquila, sin apuro. ¿Cuándo sería un buen momento para retomar? Te escribo.' },
            { label: 'Proponer algo corto', texto: 'Entiendo, son épocas complicadas. ¿Te parece si te mando un voice note de 2 minutos mostrándote cómo funciona? Así lo ves cuando puedas sin necesidad de coordinar horarios.' },
            { label: 'Seguimiento en X días', texto: 'Sin problema [nombre]. ¿Cuándo arrancaría a mejorar un poco el ritmo? Te escribo para esa fecha y arrancamos con calma.' },
            { label: 'Asincrónico', texto: 'Perfecto, lo entiendo totalmente. ¿Te mando un PDF o video corto de 2-3 minutos para que lo veas cuando tengas un rato? Sin necesidad de coordinar horarios.' },
            { label: 'Fijar fecha futura', texto: '¡Claro que sí! ¿Cuándo creés que se te acomoda un poco más? Si querés lo agendamos directamente para [fecha sugerida] y listo.' }
        ]
    },
    mas_info: {
        label: 'Pide más información', icon: '📋', color: '#5B21B6', bg: '#EDE9FE', border: '#DDD6FE',
        items: [
            { label: 'Respuesta concreta', texto: 'Claro. En resumen: diseño la estrategia de contenido del mes, creo las piezas o las coordino con tu equipo, mido los resultados y ajusto. Todo con un sistema propio que muestra métricas reales — no solo likes. ¿Charlamos 15 minutos para que te cuente con tu caso específico?' },
            { label: 'Enviar ejemplo', texto: 'Te cuento: trabajo con profesionales como vos para que su contenido genere consultas reales, no solo alcance. Puedo mostrarte un ejemplo de cómo trabajamos con otra [nicho] en Buenos Aires. ¿Te interesa?' },
            { label: 'Redirigir a reunión', texto: 'La mejor forma de explicarlo es mostrándotelo — en 15 minutos te queda mucho más claro que cualquier texto. ¿Cuándo podés esta semana?' },
            { label: 'Las 3 cosas clave', texto: 'Resumen rápido de lo que hago:\n\n1. Calendario de contenido mensual adaptado a tu nicho\n2. Seguimiento de métricas para saber qué funciona\n3. Ajuste mensual basado en los resultados\n\nTodo con un sistema propio. ¿Hablamos de los detalles esta semana?' },
            { label: 'Story corta', texto: 'Te cuento rápido: empecé trabajando con [tipo de cliente] que publicaban mucho pero sin resultados. Hoy tienen un sistema claro: contenido con propósito + métricas reales. La diferencia es enorme. ¿Hablamos de aplicarlo en tu caso?' }
        ]
    },
    ya_tengo: {
        label: 'Ya tiene alguien', icon: '🤝', color: '#6B7280', bg: '#F3F4F6', border: '#E5E7EB',
        items: [
            { label: 'Diferenciarse', texto: 'Buenísimo que ya estés trabajando con alguien. Lo que hacemos es bastante diferente a la mayoría — sistema propio con métricas reales y enfoque específico en tu nicho. ¿Te gustaría ver cómo lo hacemos para comparar?' },
            { label: 'Dejar la puerta abierta', texto: 'Genial, me alegra. Si en algún momento querés una segunda opinión o cambiar de enfoque, avisame. Suerte con el contenido.' },
            { label: 'Pregunta de curiosidad', texto: '¡Excelente! ¿Qué resultados están viendo? Me interesa saber qué funciona bien en tu rubro — así también aprendo.' },
            { label: 'Complementar, no reemplazar', texto: 'Perfecto. No necesariamente tendría que ser un reemplazo — a veces trabajamos en paralelo para áreas específicas. Si alguna vez querés sumar una perspectiva diferente, acá estoy.' }
        ]
    },
    no_responde: {
        label: 'No respondió (seguimiento)', icon: '🔁', color: '#92400E', bg: '#FFF7ED', border: '#FED7AA',
        items: [
            { label: 'Seguimiento suave (día 3)', texto: 'Hola [nombre], quería saber si te llegó mi mensaje anterior. ¿Lo viste?' },
            { label: 'Voice note (día 5)', texto: 'Hola [nombre], sé que los mensajes de texto se pierden fácil. ¿Te parece si te mando un voice note de 2 minutos mostrándote cómo funciona? Sin compromiso.' },
            { label: 'Cierre definitivo (día 10)', texto: 'Hola [nombre], último mensaje de mi parte para no saturarte. Si en algún momento querés ver cómo trabajamos, acá estoy. ¡Mucho éxito con el contenido!' },
            { label: 'Reenganche con novedad', texto: 'Hola [nombre], te escribo de vuelta porque acabo de terminar un proyecto con una [nicho similar] en BA con resultados muy buenos y pensé en vos. Si te interesa verlo, con gusto te cuento.' },
            { label: 'Cambio de canal', texto: 'Hola [nombre], vi que sos más activa en [otra red]. ¿Te mando el mensaje por ahí? Quiero asegurarme de que te llegue.' }
        ]
    },
    quiero_hacerlo_solo: {
        label: 'Lo quiere hacer solo/a', icon: '🙋', color: '#0369A1', bg: '#F0F9FF', border: '#BAE6FD',
        items: [
            { label: 'Respetar y agregar valor', texto: 'Completamente válido. Lo que sí puedo dejarte es una guía gratuita con las 5 métricas clave que tenés que mirar si vas a manejarlo vos misma. ¿La quiero?' },
            { label: 'Proponer auditoría', texto: 'Perfecto. Si en algún momento querés una revisión externa de cómo está funcionando tu contenido, ofrezco una auditoría rápida. Sin compromiso. ¿Te interesa?' },
            { label: 'Semilla de duda', texto: '¡Buenísimo! ¿Estás midiendo actualmente qué publicaciones generan más consultas? Esa es la parte donde más trabajo suelo hacer — y la que más cambia los resultados.' }
        ]
    },
    objecion_precio_alto: {
        label: 'Le parece caro', icon: '💸', color: '#991B1B', bg: '#FEF2F2', border: '#FECACA',
        items: [
            { label: 'ROI directo', texto: 'Entiendo perfectamente. La pregunta que me gusta hacerme con mis clientes es: ¿cuánto vale para vos conseguir un paciente/cliente nuevo? Si el servicio te trae 2-3 por mes, el número empieza a verse diferente. ¿Hablamos de los números concretos?' },
            { label: 'Plan escalonado', texto: 'Te entiendo. Por eso tengo opciones para distintos momentos — hay planes de entrada que permiten arrancar con lo básico y escalar cuando se vean resultados. ¿Hablamos de qué opción tiene sentido para vos ahora?' },
            { label: 'Comparación de alternativas', texto: 'Es una inversión, sin duda. Lo que comparo con mis clientes es el costo de seguir publicando sin resultados vs. tener un sistema que funciona. ¿Cuánto tiempo llevás publicando sin ver el retorno que esperabas?' }
        ]
    }
};

function renderResponsesSection() {
    var c = document.getElementById('prosp-responses');
    if (!c) return;
    var activeType = window._respActiveType || 'precio';
    var activeIdx  = parseInt(window._respActiveIdx  || '0');
    var rt = RESPUESTAS[activeType];

    c.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div><h2 style="font-size:18px;font-weight:700;color:#0D1117;">Respuestas DM</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Respuestas preparadas para cada reacción del prospecto</p></div>'
        + '</div>'
        // Tipo selector
        + '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:16px;">'
        + Object.keys(RESPUESTAS).map(function(k) {
            var r = RESPUESTAS[k];
            var a = k === activeType;
            return '<button data-resptype="' + k + '" class="resp-type-btn" style="display:flex;align-items:center;gap:5px;padding:6px 12px;border-radius:999px;border:1.5px solid '
                + (a ? r.color : '#E5E7EB') + ';background:' + (a ? r.bg : '#fff') + ';color:' + (a ? r.color : '#6B7280') + ';font-size:12px;font-weight:' + (a ? '700' : '500') + ';cursor:pointer;font-family:Inter,sans-serif;transition:all .14s;">'
                + '<span>' + r.icon + '</span><span>' + r.label + '</span></button>';
        }).join('')
        + '</div>'
        // Panel
        + '<div style="display:grid;grid-template-columns:1fr 280px;gap:14px;">'
        // Izquierda: respuesta activa
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">'
        + '<span style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;">' + rt.label + '</span>'
        + '<span style="font-size:11px;color:#9CA3AF;">' + (activeIdx+1) + ' de ' + rt.items.length + '</span>'
        + '</div>'
        + '<textarea id="active-resp-text" style="width:100%;min-height:160px;padding:12px 14px;border:1.5px solid #E5E7EB;border-radius:10px;font-size:13px;color:#374151;font-family:Inter,sans-serif;line-height:1.6;resize:vertical;background:#FAFAFA;" readonly>'
        + rt.items[activeIdx].texto + '</textarea>'
        + '<div style="display:flex;gap:8px;margin-top:12px;">'
        + '<button class="btn-primary" onclick="copyActiveResp()" style="display:flex;align-items:center;gap:6px;"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>Copiar</button>'
        + '</div>'
        + '</div>'
        // Derecha: variantes
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:14px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:10px;">Variantes</div>'
        + rt.items.map(function(item, i) {
            var a = i === activeIdx;
            return '<div data-respvariant="' + activeType + ',' + i + '" style="padding:9px 12px;border-radius:9px;border:1.5px solid '
                + (a ? rt.color : '#E5E7EB') + ';background:' + (a ? rt.bg : '#fff') + ';cursor:pointer;margin-bottom:6px;transition:all .14s;">'
                + '<div style="font-size:12px;font-weight:' + (a ? '700' : '500') + ';color:' + (a ? rt.color : '#374151') + ';">' + item.label + '</div>'
                + '</div>';
        }).join('')
        + '</div>'
        + '</div>';

    // Delegated listener for resp type buttons
    var cont = document.getElementById('prosp-responses');
    if (cont && !cont._respBound) {
        cont._respBound = true;
        cont.addEventListener('click', function(e) {
            var btn = e.target.closest('[data-resptype]');
            if (btn) { window._respActiveType = btn.getAttribute('data-resptype'); window._respActiveIdx = 0; renderResponsesSection(); }
            var vbtn = e.target.closest('[data-respvariant]');
            if (vbtn) { var d = vbtn.getAttribute('data-respvariant').split(','); window._respActiveType = d[0]; window._respActiveIdx = parseInt(d[1]); renderResponsesSection(); }
        });
    }
}

window.selectRespType = function(t) { window._respActiveType = t; window._respActiveIdx = 0; renderResponsesSection(); };
window.selectRespVariant = function(t, i) { window._respActiveType = t; window._respActiveIdx = i; renderResponsesSection(); };
window.copyActiveResp = function() {
    var ta = document.getElementById('active-resp-text');
    if (!ta) return;
    navigator.clipboard.writeText(ta.value).then(function() {
        if (typeof showSuccess === 'function') showSuccess('Respuesta copiada');
    });
};

// ════════════════════════════════════════════════════════════════
// SECCIÓN 4: GUIÓN DE REUNIÓN
// ════════════════════════════════════════════════════════════════
var GUION = [
    {
        fase: 'Apertura', tiempo: '0-2 min', color: '#3B82F6', bg: '#EFF6FF', border: '#BFDBFE',
        objetivo: 'Generar rapport y definir el tiempo',
        preguntas: [
            '¿Pudiste ver bien mi mensaje o querés que te cuente de qué se trata?',
            '¿Tenés los 15 minutos que acordamos?',
            'Perfecto. Te cuento rápido cómo lo hacemos y después vemos si tiene sentido para vos.'
        ]
    },
    {
        fase: 'Diagnóstico', tiempo: '2-7 min', color: '#F97316', bg: '#FFF7ED', border: '#FED7AA',
        objetivo: 'Entender su situación real antes de presentar',
        preguntas: [
            '¿Cuánto publicás por semana actualmente?',
            '¿Qué plataformas usás más — Instagram, Facebook?',
            '¿Estás midiendo algo? ¿Sabés cuántas consultas te llegaron por redes el último mes?',
            '¿Tenés alguien que te ayude con el contenido o lo hacés todo vos?',
            '¿Cuál sería el resultado ideal para vos — más pacientes, más autoridad, las dos?'
        ]
    },
    {
        fase: 'Presentación', tiempo: '7-11 min', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0',
        objetivo: 'Mostrar el sistema adaptado a lo que dijo antes',
        preguntas: [
            'Basado en lo que me contás, lo que necesitás es [X]. Así es como lo trabajamos:',
            'Primero definimos el calendario del mes — qué publicar, cuándo y con qué objetivo.',
            'Después medimos todo — alcance, consultas generadas, qué funcionó y qué no.',
            'Y ajustamos cada mes basado en los datos reales de tu cuenta.',
            '¿Esto tiene sentido con lo que me contaste que necesitás?'
        ]
    },
    {
        fase: 'Objeciones', tiempo: '11-13 min', color: '#8B5CF6', bg: '#F5F3FF', border: '#DDD6FE',
        objetivo: 'Manejar dudas sin presionar',
        preguntas: [
            '[PRECIO] Los valores dependen del servicio — ¿qué presupuesto tenés en mente para esto?',
            '[TIEMPO] Entiendo. ¿Cuándo sería un buen momento para arrancar — el mes que viene?',
            '[LO PIENSO] Perfecto, ¿qué es lo que necesitarías saber para tomar la decisión?',
            '[YA TENGO] ¿Qué resultado estás obteniendo actualmente con lo que tenés?'
        ]
    },
    {
        fase: 'Cierre', tiempo: '13-15 min', color: '#0C1220', bg: '#F1F5F9', border: '#E2E8F0',
        objetivo: 'Definir el siguiente paso concreto',
        preguntas: [
            '¿Qué te parece si arrancamos con [mes que viene]?',
            'El siguiente paso sería enviarte una propuesta esta semana. ¿Te parece bien?',
            'Para arrancar necesito [X]. ¿Podemos coordinar eso para [fecha]?',
            '¿Tenés alguna pregunta antes de que te mande la propuesta?'
        ]
    }
];

function renderGuideSection() {
    var c = document.getElementById('prosp-guide');
    if (!c) return;
    var activeNicho = document.getElementById('guide-nicho-sel') ? document.getElementById('guide-nicho-sel').value : 'nutricionistas';
    var nn = NICHOS[activeNicho] || {};
    var nichoOpts = Object.keys(NICHOS).map(function(k) {
        return '<option value="' + k + '"' + (k === activeNicho ? ' selected' : '') + '>' + NICHOS[k].icon + ' ' + NICHOS[k].label + '</option>';
    }).join('');

    c.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div><h2 style="font-size:18px;font-weight:700;color:#0D1117;">Guión de reunión</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Script para la charla de 15 minutos con el prospecto</p></div>'
        + '<div style="display:flex;align-items:center;gap:8px;">'
        + '<label style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#6B7280;">Nicho</label>'
        + '<select id="guide-nicho-sel" onchange="renderGuideSection()" class="form-select" style="width:180px;">' + nichoOpts + '</select>'
        + '</div></div>'
        // Timeline
        + '<div style="display:flex;flex-direction:column;gap:10px;">'
        + GUION.map(function(fase, fi) {
            return '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;overflow:hidden;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
                + '<div style="display:flex;align-items:center;gap:12px;padding:14px 18px;border-bottom:1px solid #F3F4F6;background:#FAFAFA;cursor:pointer;" onclick="toggleGuide(' + fi + ')">'
                + '<div style="width:8px;height:8px;border-radius:50%;background:' + fase.color + ';flex-shrink:0;"></div>'
                + '<span style="font-size:13px;font-weight:700;color:#0D1117;">' + fase.fase + '</span>'
                + '<span style="font-size:11px;font-weight:600;padding:2px 9px;border-radius:999px;background:' + fase.bg + ';color:' + fase.color + ';border:1px solid ' + fase.border + ';">' + fase.tiempo + '</span>'
                + '<span style="font-size:12px;color:#9CA3AF;margin-left:4px;">' + fase.objetivo + '</span>'
                + '<span style="margin-left:auto;font-size:13px;color:#9CA3AF;" id="guide-chevron-' + fi + '">▼</span>'
                + '</div>'
                + '<div id="guide-phase-' + fi + '" style="padding:14px 18px;display:' + (fi === 0 ? 'block' : 'none') + ';">'
                + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:10px;">Frases y preguntas</div>'
                + fase.preguntas.map(function(p, pi) {
                    return '<div style="display:flex;align-items:flex-start;gap:10px;padding:8px 0;border-bottom:1px solid #F8FAFC;">'
                        + '<div style="width:5px;height:5px;border-radius:50%;background:' + fase.color + ';flex-shrink:0;margin-top:6px;"></div>'
                        + '<div style="font-size:13px;color:#374151;line-height:1.5;flex:1;">' + p + '</div>'
                        + '<button data-phrase="' + pi + '_' + fi + '" class="guide-copy-btn" data-text="' + p.replace(/"/g, '&quot;') + '" title="Copiar" style="background:none;border:1.5px solid #E5E7EB;border-radius:6px;padding:3px 7px;cursor:pointer;font-size:10px;color:#9CA3AF;flex-shrink:0;font-family:Inter,sans-serif;transition:all .12s;">copiar</button>'
                        + '</div>';
                }).join('')
                + '</div>'
                + '</div>';
        }).join('')
        + '</div>';
}

// Delegated listener for guide copy buttons
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.guide-copy-btn');
    if (!btn) return;
    var text = btn.getAttribute('data-text');
    navigator.clipboard.writeText(text).then(function() {
        btn.textContent = '✓';
        setTimeout(function(){ btn.textContent = 'copiar'; }, 1200);
    });
});

window.toggleGuide = function(fi) {
    var el = document.getElementById('guide-phase-' + fi);
    var ch = document.getElementById('guide-chevron-' + fi);
    if (!el) return;
    var open = el.style.display !== 'none';
    el.style.display = open ? 'none' : 'block';
    if (ch) ch.textContent = open ? '▼' : '▲';
};
window.copyGuidePhrase = function(btn) {
    var text = btn.getAttribute('data-text');
    navigator.clipboard.writeText(text).then(function() {
        btn.textContent = '✓';
        setTimeout(function(){ btn.textContent = 'copiar'; }, 1200);
    });
};

// ════════════════════════════════════════════════════════════════
// SECCIÓN 5: CALIFICAR PROSPECTO
// ════════════════════════════════════════════════════════════════
var QUALIFY_CHECKS = {
    positivo: {
        label: 'Señales positivas', color: '#10B981', bg: '#ECFDF5', border: '#A7F3D0',
        items: [
            'Publica al menos 2-3 veces por semana',
            'Tiene foto de perfil profesional',
            'Tiene entre 300 y 10.000 seguidores',
            'Responde comentarios en sus publicaciones',
            'El contenido es propio (no solo reposts)',
            'Tiene info de contacto en la bio (teléfono, link, email)',
            'La cuenta tiene al menos 3 meses de antigüedad',
            'El engagement supera el 2% (likes + comments / seguidores)'
        ]
    },
    negativo: {
        label: 'Señales negativas', color: '#EF4444', bg: '#FEF2F2', border: '#FECACA',
        items: [
            'No tiene foto de perfil o es un logo genérico',
            'Publica menos de 1 vez por semana',
            'La mayoría del contenido son reposts o shares',
            'No responde comentarios (engagement nulo)',
            'Bio vacía sin datos de contacto',
            'Cuenta de menos de 3 meses',
            'Últimas publicaciones tienen fecha de hace más de 2 semanas',
            'El perfil parece inactivo o abandonado'
        ]
    }
};

function renderQualifySection() {
    var c = document.getElementById('prosp-qualify');
    if (!c) return;

    var stateKey = 'bondi-qualify-checks';
    var checked = {};
    try { checked = JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch(e) {}

    c.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div><h2 style="font-size:18px;font-weight:700;color:#0D1117;">Calificar prospecto</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Antes de escribirle — ¿vale la pena este perfil?</p></div>'
        + '<button class="btn-secondary" onclick="resetQualify()" style="font-size:12px;display:flex;align-items:center;gap:5px;">'
        + '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>Reiniciar</button>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;margin-bottom:14px;">'
        + Object.keys(QUALIFY_CHECKS).map(function(k) {
            var q = QUALIFY_CHECKS[k];
            var checkedCount = q.items.filter(function(item,i){ return checked[k+i]; }).length;
            return '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px 18px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
                + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">'
                + '<span style="font-size:13px;font-weight:700;color:#0D1117;">' + q.label + '</span>'
                + '<span style="font-size:11px;font-weight:700;padding:2px 9px;border-radius:999px;background:' + q.bg + ';color:' + q.color + ';border:1px solid ' + q.border + ';">' + checkedCount + ' / ' + q.items.length + '</span>'
                + '</div>'
                + q.items.map(function(item, i) {
                    var chk = checked[k+i] ? 'checked' : '';
                    return '<label style="display:flex;align-items:flex-start;gap:10px;padding:6px 0;cursor:pointer;border-bottom:1px solid #F8FAFC;">'
                        + '<input type="checkbox" ' + chk + ' data-qtype="' + k + '" data-qidx="' + i + '" class="qualify-chk" style="margin-top:2px;accent-color:' + q.color + ';flex-shrink:0;">'
                        + '<span style="font-size:12px;color:#374151;line-height:1.4;">' + item + '</span>'
                        + '</label>';
                }).join('')
                + '</div>';
        }).join('')
        + '</div>'
        // Delegated listener for checkboxes
    var qc = document.getElementById('prosp-qualify');
    if (qc && !qc._qualBound) {
        qc._qualBound = true;
        qc.addEventListener('change', function(e) {
            var inp = e.target.closest('.qualify-chk');
            if (inp) window.toggleQualify(inp.getAttribute('data-qtype'), inp.getAttribute('data-qidx'), inp.checked);
        });
    }

    // Score
        + (function() {
            var pos = QUALIFY_CHECKS.positivo.items.filter(function(item,i){ return checked['positivo'+i]; }).length;
            var neg = QUALIFY_CHECKS.negativo.items.filter(function(item,i){ return checked['negativo'+i]; }).length;
            var score = pos - (neg * 1.5);
            var verdict, vcolor, vbg;
            if (neg >= 3 || score < 0) { verdict='Descartar — no vale la pena'; vcolor='#991B1B'; vbg='#FEF2F2'; }
            else if (pos >= 5 && neg === 0) { verdict='Excelente prospecto — escribile hoy'; vcolor='#065F46'; vbg='#ECFDF5'; }
            else if (pos >= 3) { verdict='Buen prospecto — escribile esta semana'; vcolor='#92400E'; vbg='#FEF3C7'; }
            else { verdict='Completá el checklist para ver el resultado'; vcolor='#374151'; vbg='#F3F4F6'; }
            return '<div style="background:' + vbg + ';border-radius:12px;padding:14px 18px;text-align:center;font-size:14px;font-weight:700;color:' + vcolor + ';">' + verdict + '</div>';
        })();
}

window.toggleQualify = function(type, i, val) {
    var stateKey = 'bondi-qualify-checks';
    var checked = {};
    try { checked = JSON.parse(localStorage.getItem(stateKey) || '{}'); } catch(e) {}
    checked[type+i] = val;
    localStorage.setItem(stateKey, JSON.stringify(checked));
    renderQualifySection();
};
window.resetQualify = function() {
    localStorage.removeItem('bondi-qualify-checks');
    renderQualifySection();
};

// ════════════════════════════════════════════════════════════════
// SECCIÓN 6: LÍMITES DIARIOS
// ════════════════════════════════════════════════════════════════
var LIMITS_KEY = 'bondi-prosp-limits';
var LIMITS_DEF = { Instagram: { limit: 40, color: '#E1306C' }, Facebook: { limit: 50, color: '#1877F2' }, LinkedIn: { limit: 25, color: '#0A66C2' }, TikTok: { limit: 30, color: '#010101' } };

function getLimitsData() {
    try {
        var d = JSON.parse(localStorage.getItem(LIMITS_KEY) || '{}');
        var today = new Date().toDateString();
        if (d.date !== today) { d = { date: today, counts: {} }; saveLimitsData(d); }
        return d;
    } catch(e) { return { date: new Date().toDateString(), counts: {} }; }
}
function saveLimitsData(d) { localStorage.setItem(LIMITS_KEY, JSON.stringify(d)); }

function renderLimitsSection() {
    var c = document.getElementById('prosp-limits');
    if (!c) return;
    var d = getLimitsData();

    c.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div><h2 style="font-size:18px;font-weight:700;color:#0D1117;">Límites diarios</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Control de envíos para no quemar la cuenta — se reinicia a medianoche</p></div>'
        + '<button class="btn-secondary" onclick="resetLimits()" style="font-size:12px;">Reiniciar contadores</button>'
        + '</div>'
        + '<div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px;">'
        + Object.keys(LIMITS_DEF).map(function(plat) {
            var cfg = LIMITS_DEF[plat];
            var count = d.counts[plat] || 0;
            var pct = Math.min(100, Math.round((count / cfg.limit) * 100));
            var warn = pct >= 80;
            var full = count >= cfg.limit;
            var barColor = full ? '#EF4444' : warn ? '#F59E0B' : cfg.color;
            return '<div style="background:#fff;border:1px solid ' + (warn ? (full ? '#FECACA' : '#FDE68A') : '#E5E7EB') + ';border-radius:14px;padding:16px 18px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
                + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px;">'
                + '<span style="font-size:13px;font-weight:700;color:#0D1117;">' + plat + '</span>'
                + (full ? '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:#FEF2F2;color:#991B1B;border:1px solid #FECACA;">LÍMITE ALCANZADO</span>'
                       : warn ? '<span style="font-size:10px;font-weight:700;padding:2px 8px;border-radius:999px;background:#FFFBEB;color:#92400E;border:1px solid #FDE68A;">Casi en el límite</span>' : '')
                + '</div>'
                + '<div style="display:flex;align-items:baseline;gap:4px;margin-bottom:8px;">'
                + '<span style="font-size:32px;font-weight:700;color:#0D1117;letter-spacing:-.5px;">' + count + '</span>'
                + '<span style="font-size:14px;color:#9CA3AF;">/ ' + cfg.limit + '</span>'
                + '</div>'
                + '<div style="background:#F3F4F6;border-radius:999px;height:6px;overflow:hidden;margin-bottom:12px;">'
                + '<div style="height:100%;border-radius:999px;background:' + barColor + ';width:' + pct + '%;transition:width .3s;"></div>'
                + '</div>'
                + '<button data-limitplat="' + plat + '" ' + (full ? 'disabled style="opacity:.4;cursor:not-allowed;"' : '') + ' class="btn-secondary btn-sm limit-add-btn" style="width:100%;justify-content:center;">+ Registrar envío</button>'
                + '</div>';
        }).join('')
        + '</div>'
        + '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:12px;padding:14px 18px;margin-top:14px;">'
        + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:6px;">Límites recomendados</div>'
        + '<div style="font-size:12px;color:#6B7280;line-height:1.6;">Instagram: 30-40 DMs/día · Facebook: hasta 50 · LinkedIn: 20-25 · TikTok: 20-30. Superar estos valores puede generar restricciones temporales en la cuenta.</div>'
        + '</div>';
}

window.addLimitCount = function(plat) {
    var d = getLimitsData();
    d.counts[plat] = (d.counts[plat] || 0) + 1;
    saveLimitsData(d);
    renderLimitsSection();
    // Update badge
    var anyWarn = Object.keys(LIMITS_DEF).some(function(p) {
        return (d.counts[p] || 0) >= LIMITS_DEF[p].limit * 0.8;
    });
    var badge = document.getElementById('limits-badge');
    if (badge) { badge.style.display = anyWarn ? 'inline' : 'none'; }
};
window.resetLimits = function() { saveLimitsData({ date: new Date().toDateString(), counts: {} }); renderLimitsSection(); };

// ════════════════════════════════════════════════════════════════
// SECCIÓN 7: HORARIOS ÓPTIMOS
// ════════════════════════════════════════════════════════════════
var HORARIOS = {
    nutricionistas:   { best:['Lunes 8-9h','Martes 12-13h','Miércoles 19-21h','Jueves 8-9h'], nota:'Revisan el celular antes de los turnos y en el mediodía entre consultas. Evitá sábados y domingos.', plat:'Instagram / TikTok' },
    psicologos:       { best:['Lunes 9-10h','Martes 19-20h','Jueves 12-13h','Viernes 8-9h'], nota:'Tienen bloques de consultas. Los mejores momentos son antes de la primera o entre sesiones al mediodía.', plat:'Instagram / LinkedIn' },
    personaltrainers: { best:['Lunes 6-8h','Miércoles 12-13h','Jueves 20-21h','Sábado 8-10h'], nota:'Activos muy temprano y en pausas del mediodía. Los fines de semana también son buenos.', plat:'Instagram / TikTok' },
    estetica:         { best:['Lunes 10-11h','Martes 14-15h','Miércoles 19-20h','Viernes 10-11h'], nota:'Momentos tranquilos a media mañana y entre tratamientos al mediodía.', plat:'Instagram / Facebook' },
    clinicas:         { best:['Lunes 9-10h','Martes 13-14h','Jueves 9-10h','Viernes 8-9h'], nota:'Más disponibilidad a primera hora y al mediodía. Evitá días de alta cirugía.', plat:'Instagram / LinkedIn' },
    abogados:         { best:['Martes 9-10h','Miércoles 12-13h','Jueves 15-16h','Viernes 9-10h'], nota:'Revisan LinkedIn y mails entre reuniones. Evitá lunes (arranque de semana) y viernes tarde.', plat:'LinkedIn / Instagram' },
    contadores:       { best:['Martes 8-9h','Miércoles 12-13h','Jueves 9-10h','Lunes 10-11h'], nota:'Muy activos digitalmente. Picos en vencimientos impositivos — aprovechalos para contenido de valor.', plat:'LinkedIn / Instagram' },
    odontologos:      { best:['Lunes 9-10h','Martes 19-20h','Miércoles 12-13h','Sábado 9-10h'], nota:'Atienden mañana y tarde. Pausa del mediodía y noche del martes son los mejores momentos.', plat:'Instagram / TikTok' },
    arquitectos:      { best:['Martes 10-11h','Miércoles 14-15h','Jueves 10-11h','Viernes 9-10h'], nota:'Profesionales creativos muy activos en Instagram. LinkedIn para proyectos corporativos.', plat:'Instagram / LinkedIn' },
    coaches:          { best:['Lunes 7-8h','Martes 19-21h','Miércoles 7-8h','Jueves 20-21h'], nota:'Audiencia de desarrollo personal activa temprano y en la noche. TikTok tiene buen alcance orgánico.', plat:'Instagram / TikTok / LinkedIn' },
    restaurantes:     { best:['Miércoles 11-12h','Jueves 19-20h','Viernes 12-13h','Sábado 10-11h'], nota:'Publicar antes del almuerzo y cena para generar hambre estratégica. El jueves es el mejor día para fin de semana.', plat:'Instagram / TikTok' },
    inmobiliarias:    { best:['Martes 9-10h','Miércoles 11-12h','Jueves 10-11h','Sábado 10-11h'], nota:'Los sábados los compradores están activos buscando propiedades. Entre semana, mañana temprano.', plat:'Instagram / Facebook / TikTok' },
    educacion:        { best:['Lunes 8-9h','Martes 19-20h','Miércoles 12-13h','Domingo 20-21h'], nota:'El domingo a la noche y lunes a la mañana son picos — la gente piensa en capacitarse al inicio de semana.', plat:'Instagram / LinkedIn / YouTube' }
}
var DIAS = ['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
var HEAT = {
    nutricionistas:   [[0,0,0,0,0,0,0],[2,3,2,1,2,3,1],[1,2,3,2,1,2,1],[1,3,2,2,2,2,0],[2,3,2,2,2,3,1],[1,2,2,1,1,2,1],[0,0,0,0,0,0,0],[1,2,1,1,1,2,0]],
    psicologos:       [[0,0,0,0,0,0,0],[1,3,2,1,2,3,1],[0,2,3,2,1,2,0],[1,3,2,2,2,2,0],[2,3,2,2,3,3,1],[1,2,2,1,1,3,1],[0,0,0,0,0,0,0],[1,3,1,1,1,2,0]],
    personaltrainers: [[3,3,2,1,1,2,3],[2,2,1,1,1,2,2],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,2,1,1,1,1,2],[0,0,0,0,0,0,0],[2,3,1,1,2,2,1]],
    estetica:         [[0,0,0,0,0,0,0],[1,2,3,2,1,2,1],[1,2,3,2,1,2,1],[0,2,2,2,1,2,0],[1,2,2,2,2,3,1],[1,2,2,1,1,2,1],[0,0,0,0,0,0,0],[1,2,1,1,1,2,0]],
    clinicas:         [[0,0,0,0,0,0,0],[1,3,2,1,2,3,1],[1,2,3,2,1,2,0],[0,3,2,2,2,2,0],[2,3,2,2,3,3,1],[1,2,2,1,1,3,1],[0,0,0,0,0,0,0],[0,1,1,1,1,1,0]],
    abogados:         [[0,0,0,0,0,0,0],[0,2,2,1,2,2,0],[1,2,3,2,2,3,1],[0,2,3,3,2,3,0],[1,2,2,2,2,2,0],[1,3,2,2,3,2,0],[0,1,1,1,1,1,0],[0,1,0,0,0,1,0]],
    contadores:       [[0,0,0,0,0,0,0],[1,3,2,1,3,3,1],[1,2,3,2,2,3,0],[0,3,3,3,2,2,0],[1,2,2,2,2,2,0],[1,3,2,2,3,2,0],[0,1,0,0,0,1,0],[0,0,0,0,0,0,0]],
    odontologos:      [[0,0,0,0,0,0,0],[1,2,2,1,2,3,2],[1,2,3,2,1,2,1],[0,2,2,2,1,2,1],[1,2,2,2,2,3,1],[1,2,1,1,1,2,0],[0,0,0,0,0,0,0],[1,3,1,1,1,2,0]],
    arquitectos:      [[0,0,0,0,0,0,0],[0,1,1,1,1,1,0],[1,2,3,2,2,3,1],[0,2,2,3,2,3,1],[1,2,3,2,2,2,0],[1,3,2,2,3,2,0],[0,1,0,0,0,1,0],[0,1,0,0,0,1,0]],
    coaches:          [[2,3,2,1,2,2,1],[1,2,1,1,1,2,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,0],[2,3,2,1,2,3,2]],
    restaurantes:     [[0,0,0,0,0,0,0],[0,0,0,0,0,0,0],[0,1,1,1,1,1,1],[1,2,3,3,2,3,2],[1,2,1,1,1,2,1],[0,1,1,1,1,1,1],[1,2,2,2,2,2,2],[1,2,3,3,2,3,3]],
    inmobiliarias:    [[0,1,1,1,1,1,2],[0,2,2,1,2,3,2],[1,2,3,2,2,3,2],[1,3,2,2,2,2,1],[1,2,2,2,2,2,1],[1,2,2,1,1,2,1],[0,1,0,0,0,1,0],[0,1,1,1,1,1,0]],
    educacion:        [[0,1,1,1,1,1,2],[1,2,2,1,2,2,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,1],[1,1,1,1,1,1,0],[2,3,2,1,2,2,3]]
}
var HOURS = ['6h','8h','10h','12h','14h','16h','18h','20h'];

function renderScheduleSection() {
    var c = document.getElementById('prosp-schedule');
    if (!c) return;
    var nicho = document.getElementById('sched-nicho-sel') ? document.getElementById('sched-nicho-sel').value : 'nutricionistas';
    var h = HORARIOS[nicho] || HORARIOS.nutricionistas;
    var heat = HEAT[nicho] || HEAT.nutricionistas;
    var nichoOpts = Object.keys(NICHOS).filter(function(k){ return HORARIOS[k]; }).map(function(k) {
        return '<option value="' + k + '"' + (k===nicho?' selected':'') + '>' + NICHOS[k].icon + ' ' + NICHOS[k].label + '</option>';
    }).join('');

    var heatColors = ['#F3F4F6','#FEF3C7','#FED7AA','#F97316'];

    c.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div><h2 style="font-size:18px;font-weight:700;color:#0D1117;">Horarios óptimos</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Cuándo enviar DMs según el perfil del prospecto</p></div>'
        + '<div style="display:flex;align-items:center;gap:8px;">'
        + '<select id="sched-nicho-sel" onchange="renderScheduleSection()" class="form-select" style="width:180px;">' + nichoOpts + '</select>'
        + '</div></div>'
        + '<div style="display:grid;grid-template-columns:1fr 300px;gap:14px;">'
        // Heatmap
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:18px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="font-size:12px;font-weight:600;color:#374151;margin-bottom:14px;">Mapa de calor — Buenos Aires</div>'
        + '<div style="overflow-x:auto;">'
        + '<table style="border-collapse:separate;border-spacing:3px;width:100%;">'
        + '<thead><tr><th style="font-size:10px;color:#9CA3AF;font-weight:600;padding:2px 4px;text-align:left;">Hora</th>'
        + DIAS.map(function(d){ return '<th style="font-size:10px;color:#9CA3AF;font-weight:600;padding:2px 6px;text-align:center;">' + d + '</th>'; }).join('')
        + '</tr></thead><tbody>'
        + HOURS.map(function(hr, hi) {
            return '<tr><td style="font-size:11px;color:#6B7280;padding:3px 4px;white-space:nowrap;">' + hr + '</td>'
                + heat[hi].map(function(v) {
                    return '<td style="width:32px;height:28px;background:' + heatColors[v] + ';border-radius:4px;"></td>';
                }).join('')
                + '</tr>';
        }).join('')
        + '</tbody></table>'
        + '</div>'
        + '<div style="display:flex;gap:10px;align-items:center;margin-top:12px;">'
        + ['Sin datos','Bajo','Medio','Óptimo'].map(function(l,i) {
            return '<div style="display:flex;align-items:center;gap:4px;"><div style="width:12px;height:12px;border-radius:3px;background:' + heatColors[i] + ';"></div><span style="font-size:10px;color:#6B7280;">' + l + '</span></div>';
        }).join('')
        + '</div></div>'
        // Info card
        + '<div style="display:flex;flex-direction:column;gap:10px;">'
        + '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:14px;padding:16px;box-shadow:0 1px 4px rgba(0,0,0,.06);">'
        + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:10px;">Mejores momentos</div>'
        + h.best.map(function(b) {
            return '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #F8FAFC;">'
                + '<div style="width:6px;height:6px;border-radius:50%;background:#10B981;flex-shrink:0;"></div>'
                + '<span style="font-size:13px;color:#374151;">' + b + '</span>'
                + '</div>';
        }).join('')
        + '<div style="margin-top:10px;padding-top:10px;border-top:1px solid #F3F4F6;font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;margin-bottom:6px;">Plataforma recomendada</div>'
        + '<span style="font-size:13px;color:#374151;">' + h.plat + '</span>'
        + '</div>'
        + '<div style="background:#FFFBEB;border:1px solid #FDE68A;border-radius:12px;padding:14px 16px;">'
        + '<div style="font-size:11px;font-weight:700;color:#92400E;margin-bottom:5px;">💡 Consejo</div>'
        + '<div style="font-size:12px;color:#78350F;line-height:1.5;">' + h.nota + '</div>'
        + '</div>'
        + '</div>'
        + '</div>';
}

// ════════════════════════════════════════════════════════════════
// SECCIÓN 8: EDITOR DE NICHOS
// ════════════════════════════════════════════════════════════════
var CUSTOM_NICHOS_KEY = 'bondi-custom-nichos';

function getCustomNichos() {
    try { return JSON.parse(localStorage.getItem(CUSTOM_NICHOS_KEY) || '{}'); } catch(e) { return {}; }
}
function saveCustomNichos(d) { localStorage.setItem(CUSTOM_NICHOS_KEY, JSON.stringify(d)); }

function renderNichosEditor() {
    var c = document.getElementById('prosp-nichos');
    if (!c) return;
    var custom = getCustomNichos();
    var allNichos = Object.assign({}, NICHOS, custom);

    c.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:20px;">'
        + '<div><h2 style="font-size:18px;font-weight:700;color:#0D1117;">Editor de nichos</h2>'
        + '<p style="font-size:13px;color:#9CA3AF;margin-top:3px;">Creá nichos personalizados con sus mensajes y hashtags</p></div>'
        + '<button class="btn-primary" onclick="openAddNichoModal()" style="display:flex;align-items:center;gap:6px;">'
        + '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>'
        + 'Nuevo nicho</button>'
        + '</div>'
        + '<div style="display:flex;flex-direction:column;gap:10px;">'
        // Nichos base
        + '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;padding:4px 0;">Nichos base</div>'
        + Object.keys(NICHOS).map(function(k) {
            var n = NICHOS[k];
            return '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,.05);">'
                + '<div style="width:36px;height:36px;border-radius:10px;background:' + n.bg + ';border:1px solid ' + n.border + ';display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">' + n.icon + '</div>'
                + '<div style="flex:1;">'
                + '<div style="font-size:13px;font-weight:600;color:#0D1117;">' + n.label + '</div>'
                + '<div style="font-size:11px;color:#9CA3AF;margin-top:2px;">' + n.mensajes.length + ' mensajes · ' + Object.keys(n.hashtags).join(', ') + '</div>'
                + '</div>'
                + '<span style="font-size:10px;font-weight:600;padding:2px 9px;border-radius:999px;background:#F3F4F6;color:#6B7280;">Base</span>'
                + '</div>';
        }).join('')
        // Nichos custom
        + (Object.keys(custom).length > 0 ?
            '<div style="font-size:11px;font-weight:700;text-transform:uppercase;letter-spacing:.5px;color:#9CA3AF;padding:8px 0 4px;">Nichos personalizados</div>'
            + Object.keys(custom).map(function(k) {
                var n = custom[k];
                return '<div style="background:#fff;border:1px solid #E5E7EB;border-radius:12px;padding:14px 16px;display:flex;align-items:center;gap:12px;box-shadow:0 1px 3px rgba(0,0,0,.05);">'
                    + '<div style="width:36px;height:36px;border-radius:10px;background:' + (n.bg||'#F3F4F6') + ';border:1px solid ' + (n.border||'#E5E7EB') + ';display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0;">' + (n.icon||'📌') + '</div>'
                    + '<div style="flex:1;">'
                    + '<div style="font-size:13px;font-weight:600;color:#0D1117;">' + n.label + '</div>'
                    + '<div style="font-size:11px;color:#9CA3AF;margin-top:2px;">' + (n.mensajes||[]).length + ' mensajes</div>'
                    + '</div>'
                    + '<button data-delnicho="' + k + '" class="btn-secondary btn-sm del-nicho-btn" style="color:#EF4444;border-color:#FECACA;font-size:11px;">Eliminar</button>'
                    + '</div>';
            }).join('')
            : '<div style="background:#F8FAFC;border:1px solid #E5E7EB;border-radius:12px;padding:20px;text-align:center;font-size:13px;color:#9CA3AF;">Aún no creaste nichos personalizados</div>'
        )
        + '</div>';
}

// Delegated listener for delete nicho buttons
document.addEventListener('click', function(e) {
    var btn = e.target.closest('.del-nicho-btn');
    if (btn) window.deleteCustomNicho(btn.getAttribute('data-delnicho'));
    var lb = e.target.closest('.limit-add-btn');
    if (lb) window.addLimitCount(lb.getAttribute('data-limitplat'));
});

window.openAddNichoModal = function() {
    var existing = document.getElementById('add-nicho-modal');
    if (existing) { existing.classList.add('active'); return; }
    var modal = document.createElement('div');
    modal.id = 'add-nicho-modal';
    modal.className = 'modal';
    modal.style.zIndex = '9999';
    var box = document.createElement('div');
    box.className = 'modal-content';
    box.style.maxWidth = '520px';
    // Build via DOM to avoid quote nesting
    var hdr = document.createElement('div'); hdr.className = 'modal-header';
    var htitle = document.createElement('span'); htitle.className = 'modal-title'; htitle.textContent = 'Nuevo nicho personalizado';
    var hclose = document.createElement('button'); hclose.className = 'modal-close'; hclose.textContent = '×';
    hclose.addEventListener('click', function(){ closeModal('add-nicho-modal'); });
    hdr.appendChild(htitle); hdr.appendChild(hclose);

    var body = document.createElement('div');
    body.style.cssText = 'padding:18px 20px;display:flex;flex-direction:column;gap:12px;';
    body.innerHTML = '<div class="form-group"><label class="form-label">Nombre del nicho</label>'
        + '<input class="form-input" id="nn-label" placeholder="Ej: Odontólogos"></div>'
        + '<div class="form-row">'
        + '<div class="form-group"><label class="form-label">Ícono (emoji)</label>'
        + '<input class="form-input" id="nn-icon" placeholder="🦷" style="font-size:20px;text-align:center;" maxlength="2"></div>'
        + '<div class="form-group"><label class="form-label">Color de acento</label>'
        + '<input type="color" id="nn-color" value="#3B82F6" style="width:100%;height:40px;border:1.5px solid #E5E7EB;border-radius:8px;cursor:pointer;padding:2px;"></div>'
        + '</div>'
        + '<div class="form-group"><label class="form-label">Mensaje principal</label>'
        + '<textarea class="form-input" id="nn-mensaje" rows="4" placeholder="Hola [nombre], vi tu perfil de..."></textarea></div>'
        + '<div class="form-group"><label class="form-label">Plataformas (separadas por coma)</label>'
        + '<input class="form-input" id="nn-platforms" placeholder="Instagram, TikTok, LinkedIn, Facebook"></div>'
        + '<div class="form-group"><label class="form-label">Hashtags para Instagram (uno por línea)</label>'
        + '<textarea class="form-input" id="nn-hashtags" rows="3" placeholder="#hashtag1"></textarea></div>'
        + '<div class="form-group"><label class="form-label">Hashtags para TikTok (uno por línea)</label>'
        + '<textarea class="form-input" id="nn-hashtags-tiktok" rows="2" placeholder="#hashtag1"></textarea></div>';

    var footer = document.createElement('div'); footer.className = 'modal-actions';
    var btnSave = document.createElement('button'); btnSave.className = 'btn-success'; btnSave.textContent = 'Guardar nicho';
    btnSave.addEventListener('click', window.saveCustomNichoForm);
    var btnCancel = document.createElement('button'); btnCancel.className = 'btn-secondary'; btnCancel.textContent = 'Cancelar';
    btnCancel.addEventListener('click', function(){ closeModal('add-nicho-modal'); });
    footer.appendChild(btnSave); footer.appendChild(btnCancel);

    box.appendChild(hdr); box.appendChild(body); box.appendChild(footer);
    modal.appendChild(box);
    modal.addEventListener('click', function(e){ if(e.target===modal) closeModal('add-nicho-modal'); });
    document.body.appendChild(modal);
    modal.classList.add('active');
};

window.saveCustomNichoForm = function() {
    var label = document.getElementById('nn-label')?.value?.trim();
    if (!label) { alert('El nombre es obligatorio'); return; }
    var color = document.getElementById('nn-color')?.value || '#3B82F6';
    var r = parseInt(color.slice(1,3),16), g = parseInt(color.slice(3,5),16), b = parseInt(color.slice(5,7),16);
    var bg = 'rgba(' + r + ',' + g + ',' + b + ',.1)';
    var border = 'rgba(' + r + ',' + g + ',' + b + ',.3)';
    var tags = (document.getElementById('nn-hashtags')?.value || '').split('\n').filter(function(t){ return t.trim(); });
    var tagsTiktok = (document.getElementById('nn-hashtags-tiktok')?.value || '').split('\n').filter(function(t){ return t.trim(); });
    var platformsRaw = document.getElementById('nn-platforms')?.value || 'Instagram';
    var platforms = platformsRaw.split(',').map(function(p){ return p.trim(); }).filter(Boolean);
    var msg = document.getElementById('nn-mensaje')?.value?.trim() || '';
    var custom = getCustomNichos();
    var key = 'custom_' + Date.now();
    var hashtags = { instagram: tags };
    if (tagsTiktok.length) hashtags.tiktok = tagsTiktok;
    custom[key] = {
        label: label,
        icon:  document.getElementById('nn-icon')?.value || '📌',
        color: color, bg: bg, border: border,
        platforms: platforms,
        hashtags: hashtags,
        mensajes: msg ? [{ label: 'Principal', texto: msg }] : []
    };
    saveCustomNichos(custom);
    // Merge into NICHOS so it appears in other sections
    NICHOS[key] = custom[key];
    closeModal('add-nicho-modal');
    renderNichosEditor();
    if (typeof showSuccess === 'function') showSuccess('Nicho "' + label + '" creado correctamente');
};

window.deleteCustomNicho = function(key) {
    if (!confirm('¿Eliminar este nicho personalizado?')) return;
    var custom = getCustomNichos();
    delete custom[key];
    delete NICHOS[key];
    saveCustomNichos(custom);
    renderNichosEditor();
};

// ════════════════════════════════════════════════════════════════
// INICIALIZACIÓN POR SECCIÓN
// ════════════════════════════════════════════════════════════════
var _prospInitDone = {};
var _allSections = ['prosp-messages','prosp-hashtags','prosp-responses','prosp-guide','prosp-qualify','prosp-limits','prosp-schedule','prosp-nichos'];

window.initProspectingSection = function(section) {
    // Solo bloquear re-render en secciones con estado interactivo
    var noRerender = ['prosp-qualify', 'prosp-limits'];
    if (noRerender.includes(section) && _prospInitDone[section]) return;
    _prospInitDone[section] = true;
    try {
        if (section === 'prosp-messages')   renderMessagesSection();
        if (section === 'prosp-hashtags')   renderHashtagsSection();
        if (section === 'prosp-responses')  renderResponsesSection();
        if (section === 'prosp-guide')      renderGuideSection();
        if (section === 'prosp-qualify')    renderQualifySection();
        if (section === 'prosp-limits')     renderLimitsSection();
        if (section === 'prosp-schedule')   renderScheduleSection();
        if (section === 'prosp-nichos')     renderNichosEditor();
    } catch(e) {
        console.error('Error en sección ' + section + ':', e);
        _prospInitDone[section] = false; // permitir re-intento
    }
};

// Hook en navegación
var _origNavigateTo = window.navigateTo;
window.navigateTo = function(section) {
    if (typeof _origNavigateTo === 'function') _origNavigateTo(section);
    if (_allSections.includes(section)) {
        setTimeout(function() { window.initProspectingSection(section); }, 50);
    }
};

// Cargar nichos custom al arrancar
(function() {
    var custom = getCustomNichos();
    Object.keys(custom).forEach(function(k) { NICHOS[k] = custom[k]; });
    // Init limits badge
    var d = getLimitsData();
    var anyWarn = Object.keys(LIMITS_DEF).some(function(p) {
        return (d.counts[p] || 0) >= LIMITS_DEF[p].limit * 0.8;
    });
    document.addEventListener('DOMContentLoaded', function() {
        var badge = document.getElementById('limits-badge');
        if (badge) badge.style.display = anyWarn ? 'inline' : 'none';
    });
})();

console.log('✅ prospecting.js cargado');