<?php
$txt = null;
$name = $_POST['name'];
$tel = $_POST['tel'];
$email = $_POST['email'];
$comment = $_POST['comment'];

$token = "6516410091:AAHJBsEdu8P5cDAZJ7Ud5Ruh-i54kugoptM";
$chat_id = "-1002134144417";
$arr = array(
  'ФИО: ' => $name,
  'Email' => $email,
  'Телефон: ' => $tel,
  'Комментарий: ' => $comment,
);

foreach($arr as $key => $value) {
  $txt .= "<b>".$key."</b> ".$value."%0A";
};

$sendToTelegram = fopen("https://api.telegram.org/bot{$token}/sendMessage?chat_id={$chat_id}&parse_mode=html&text={$txt}","r");


?>