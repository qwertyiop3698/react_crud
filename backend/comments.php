<?php
    header("Content-Type: application/json; charset=UTF-8");
    
    include "db.php";
    $data= json_decode(file_get_contents("php://input"),true);

    if($data) {
        $post_id = $data['post_id'];
        $content = $data['content'];

        $sql = "INSERT INTO comments (post_id, content) VALUES ($post_id , '$content')";

        if($conn->query($sql) === TRUE){
            echo json_encode([
            "message" => "댓글이 등록 되었습니다.",
            "id" => $conn->insert_id 
            ]);
        }else{
            echo json_encode(["message" => "댓글 저장 실패 : " . $conn -> error]);
        }
    };
?>