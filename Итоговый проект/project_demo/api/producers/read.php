<?php
include('../db_connect.php');

$sql = "
select id,
       name
  from producers
 order by name
";

$stmt = $pdo->prepare($sql);
echo get_json($stmt);
?>
