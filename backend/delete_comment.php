<?php
header("Content-Type: application/json; charset=UTF-8");
    include "./db.php";

    $data = json_decode(file_get_contents("php://input"), true);

    if ($data) {
        if(!isset($data['id'])){
            echo json_encode(["message" => "ID가 없습니다."]); exit;
        }
        $id = $data['id'];

        $sql = "DELETE FROM comments WHERE id = $id";

        if ($conn->query($sql) === TRUE) {
            echo json_encode(["message" => "댓글 삭제 완료"]);
        } else {
            echo json_encode(["message" => "삭제 실패 : " . $conn->error]);
        }
    };

?>