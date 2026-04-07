<?php
// 1. Configuración de conexión a Base de Datos (Hostinger/WNPower)
$db_host = 'localhost';
$db_name = 'u123456789_agencia';
$db_user = 'u123456789_admin';
$db_pass = 'TuPasswordSegura';

$conn = new mysqli($db_host, $db_user, $db_pass, $db_name);

// 2. Función para llamar a Claude
function llamarClaude($prompt_sistema, $mensaje_usuario, $modelo = "claude-3-5-sonnet-20240620") {
    $api_key = 'TU_API_KEY_DE_ANTHROPIC';
    
    $data = [
        "model" => $modelo,
        "max_tokens" => 1024,
        "system" => $prompt_sistema, // Aquí enviamos el JSON del Prompt Maestro
        "messages" => [
            ["role" => "user", "content" => $mensaje_usuario]
        ]
    ];

    $ch = curl_init('https://anthropic.com');
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_HTTPHEADER, [
        'x-api-key: ' . $api_key,
        'anthropic-version: 2023-06-01',
        'Content-Type: application/json'
    ]);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

    $response = curl_exec($ch);
    return json_decode($response, true);
}

// 3. Lógica de Negocio: Generar Post y Guardar en SQL
$id_cliente = 1; // ID del cliente en tu DB
$tema_post = "Beneficios de la IA en el marketing";

// Traemos el Manual de Marca del cliente desde la DB
$res = $conn->query("SELECT brand_voice FROM clientes WHERE id_cliente = $id_cliente");
$cliente = $res->fetch_assoc();

// Llamada a la API
$resultado = llamarClaude($cliente['brand_voice'], "Genera un post sobre: $tema_post");

if (isset($resultado['content'][0]['text'])) {
    $texto_final = $conn->real_escape_string($resultado['content'][0]['text']);
    $tokens_in = $resultado['usage']['input_tokens'];
    $tokens_out = $resultado['usage']['output_tokens'];

    // Guardamos el post
    $conn->query("INSERT INTO posts (id_campaña, red_social, contenido_actual, idea_original) 
                  VALUES (1, 'Instagram', '$texto_final', '$tema_post')");
    
    // Guardamos el log de consumo para auditoría
    $conn->query("INSERT INTO logs_consumo (id_cliente, modelo_usado, tokens_input, tokens_output) 
                  VALUES ($id_cliente, 'claude-3-5-sonnet', $tokens_in, $tokens_out)");

    echo "Post generado y guardado con éxito.";
} else {
    echo "Error en la API: " . ($resultado['error']['message'] ?? 'Desconocido');
}
?>
