<?php

    header("Content-Type: application/json; charset=UTF-8");

    include 'db.php';

    $data = json_decode(file_get_contents("php://input"), true);

    if ($data) {
        $id = $data['id'];
        $title = $data['title'];
        $content = $data['content'];

        $sql = "UPDATE posts SET title='$title' , content='$content' WHERE id=$id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "글 수정 완료"]);
        } else {
            echo json_encode(["message" => "에러 : " . $conn->error]);
        }
    };
?>