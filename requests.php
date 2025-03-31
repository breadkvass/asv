<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// Ручной парсинг .env
$envPath = __DIR__ . '/.env';
if (!file_exists($envPath)) {
    http_response_code(500);
    die(json_encode(['error' => 'Configuration file not found']));
}

$envVars = parse_ini_file($envPath);
$requiredVars = ['TELEGRAM_BOT_TOKEN', 'TELEGRAM_CHAT_ID'];

foreach ($requiredVars as $var) {
    if (empty($envVars[$var])) {
        http_response_code(500);
        die(json_encode(['error' => "Missing required config: $var"]));
    }
}

// Получаем данные из формы
$data = json_decode(file_get_contents('php://input'), true);

// Валидация данных
if (empty($data['name']) || empty($data['tel'])) {
    http_response_code(400);
    die(json_encode(['error' => 'Пожалуйста, заполните обязательные поля']));
}

// Формируем сообщение для Telegram
$message = "📌 *Новая заявка с сайта ASV*\n\n"
    . "👤 *ФИО:* " . htmlspecialchars($data['name']) . "\n"
    . "📞 *Телефон:* " . htmlspecialchars($data['tel']) . "\n";

if (!empty($data['email'])) {
    $message .= "📧 *Email:* " . htmlspecialchars($data['email']) . "\n";
}

if (!empty($data['comment'])) {
    $message .= "📝 *Комментарий:*\n" . htmlspecialchars($data['comment']) . "\n";
}

// Отправка в Telegram
$telegramUrl = "https://api.telegram.org/bot{$envVars['TELEGRAM_BOT_TOKEN']}/sendMessage";
$postData = [
    'chat_id' => $envVars['TELEGRAM_CHAT_ID'],
    'text' => $message,
    'parse_mode' => 'Markdown',
    'disable_web_page_preview' => true
];

$ch = curl_init();
curl_setopt($ch, CURLOPT_URL, $telegramUrl);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$response = curl_exec($ch);
$httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpCode !== 200) {
    $error = json_decode($response, true)['description'] ?? 'Unknown error';
    http_response_code(500);
    die(json_encode(['error' => "Telegram API error: $error"]));
}

echo json_encode(['success' => true]);