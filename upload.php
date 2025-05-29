<?php
header('Content-Type: application/json');
$dir = __DIR__.'/uploads/';
if (!is_dir($dir)) mkdir($dir,0755);

// make sure files were sent
if (empty($_FILES['images'])) {
  echo json_encode(['success'=>false,'error'=>'No files received']);
  exit;
}

foreach ($_FILES['images']['tmp_name'] as $i => $tmp) {
  $name   = basename($_FILES['images']['name'][$i]);
  $target = "$dir/$name";
  if (!move_uploaded_file($tmp, $target)) {
    echo json_encode(['success'=>false,'error'=>"Failed to move $name"]);
    exit;
  }
}

echo json_encode(['success'=>true]);
