<?php

    header("Content-Type: application/json; charset=UTF-8");

    include 'db.php';
    $uploadedNames = [];
    
    if (isset($_POST['title'])) {
        $title = $_POST['title'];
        $content = $_POST['content'];
        $imageName = ""; 
    
    if (isset($_FILES['image']) && $_FILES['image']['error'][0] === UPLOAD_ERR_OK) {
        for($i=0;$i<count($_FILES['image']['name']);$i++){
            $currentFile = $_FILES['image']['name'][$i];
            $targetFile = __DIR__ . "/uploads/" . $currentFile;
            if(move_uploaded_file($_FILES['image']['tmp_name'][$i],$targetFile)){
                if($imageName === ""){
                    $imageName = $currentFile;
                }else{
                    $imageName .="," . $currentFile;
                }
            }
        }
    }

    $sql = "INSERT INTO posts (title, content, image_path) VALUES ('$title', '$content', '$imageName')";

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["message" => "성공적으로 저장되었습니다!"]);
    } else {
        echo json_encode(["message" => "DB 에러: " . $conn->error]);
    }
}
?>