<?php

    header("Content-Type: application/json; charset=UTF-8");
    include "./db.php";

    $post_id=$_GET['post_id'];
    
    $sql = "SELECT * FROM comments WHERE post_id= $post_id";
    $result = mysqli_query($conn,$sql);
    $comments=array();
    while($row=$result->fetch_assoc()){
        $comments[]=$row;
    }

    echo json_encode($comments);
?>