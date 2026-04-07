-- 1. Tabla de Clientes: Guarda la configuración de marca (Contexto para la API)
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre_agencia VARCHAR(100) NOT NULL,
    email_contacto VARCHAR(100),
    brand_voice TEXT, -- Aquí guardas el tono de voz (JSON o Texto)
    hashtags_fijos TEXT,
    modelo_preferido ENUM('sonnet', 'haiku') DEFAULT 'sonnet',
    status ENUM('activo', 'suspendido') DEFAULT 'activo',
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tabla de Proyectos/Campañas: Organiza los posts por mes o evento
CREATE TABLE campañas (
    id_campaña INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    nombre_campaña VARCHAR(100),
    mes_referencia VARCHAR(20), -- Ej: "Octubre 2024"
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente) ON DELETE CASCADE
);

-- 3. Tabla de Posts: El corazón del sistema (Maneja versiones y estados)
CREATE TABLE posts (
    id_post INT AUTO_INCREMENT PRIMARY KEY,
    id_campaña INT,
    red_social ENUM('Instagram', 'LinkedIn', 'Facebook', 'Twitter', 'TikTok'),
    contenido_actual TEXT, -- La versión más reciente lista para publicar
    idea_original TEXT,    -- El prompt inicial que dio origen al post
    estado EN_REVISION ENUM('borrador', 'en_revision', 'aprobado', 'publicado') DEFAULT 'borrador',
    FOREIGN KEY (id_campaña) REFERENCES campañas(id_campaña) ON DELETE CASCADE
);

-- 4. Tabla de Versiones (Historial de Correcciones): Vital para no perder datos
CREATE TABLE post_versiones (
    id_version INT AUTO_INCREMENT PRIMARY KEY,
    id_post INT,
    contenido_anterior TEXT,
    instruccion_cambio TEXT, -- Lo que pidió el cliente para esta versión
    tokens_consumidos INT,   -- Control de gasto por cambio
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_post) REFERENCES posts(id_post) ON DELETE CASCADE
);

-- 5. Tabla de Auditoría de Tokens: Para saber cuánto te cuesta cada cliente
CREATE TABLE logs_consumo (
    id_log INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_post INT,
    modelo_usado VARCHAR(50),
    tokens_input INT,
    tokens_output INT,
    costo_estimado_usd DECIMAL(10, 6),
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);
