<?php
include('../db_connect.php');

$sql = "
select id,
       name
  from units
 order by name
";

$stmt = $pdo->prepare($sql);
echo get_json($stmt);
?>
