<?php
include('../db_connect.php');

$entity_body = file_get_contents('php://input');
$post_data = json_decode($entity_body, true);

if(!$post_data) {
    $result_data = [
        "error" => 1,
        "errorMsg" => "Не переданы входные параметры."
    ];
    echo json_encode($result_data, JSON_UNESCAPED_UNICODE);
    die();
}

// Место для валидации 

if (array_key_exists('id', $post_data)) { // Изменить
    $sql = "update main set
            unit_id = :unit_id,
            producer_id = :producer_id,
            name = :name,
            num = :num,
            date_create = :date_create
         where id = :id;
    ";
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':id', $post_data['id']);
} else { // Добавить
    $sql = "insert into main 
        (unit_id,   producer_id, name,  num, date_create) VALUES
        (:unit_id,   :producer_id, :name,  :num, :date_create); 
    ";
    $stmt = $pdo->prepare($sql);
}

if ($post_data['unit_id'] === "") $post_data['unit_id'] = null;
if ($post_data['producer_id'] === "") $post_data['producer_id'] = null;
if ($post_data['name'] === "") $post_data['name'] = null;
if ($post_data['num'] === "") $post_data['num'] = null;
if ($post_data['date_create'] === "") $post_data['date_create'] = null;

$stmt->bindParam(':unit_id', $post_data['unit_id']);
$stmt->bindParam(':producer_id', $post_data['producer_id']);
$stmt->bindParam(':name', $post_data['name']);
$stmt->bindParam(':num', $post_data['num']);
$stmt->bindParam(':date_create', $post_data['date_create']);
echo get_json($stmt);
?>
