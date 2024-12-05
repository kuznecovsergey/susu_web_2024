<?php
include('../db_connect.php');

$sql = "
select m.*,
       u.name units_name,
       p.name producers_name
  from main m
      join units u on u.id = m.unit_id 
      left join producers p on p.id = m.producer_id 
 order by m.name
";

$stmt = $pdo->prepare($sql);
echo get_json($stmt);
?>
