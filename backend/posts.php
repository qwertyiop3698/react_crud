<?php
    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json; charset=UTF-8");
    include "db.php";

    $sql = "SELECT * FROM posts ORDER BY id DESC";
    $result = mysqli_query($conn,$sql);
    $data = array();
    while($row=mysqli_fetch_assoc($result)){
        $data[]=$row;
    }

    echo json_encode($data);
?>