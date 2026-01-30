<?php
$host = "localhost";
$user = "toma2025";
$pass = "PUNX4fSx!H6d3c";
$db_name = "toma2025";

$conn = new mysqli($host, $user, $pass, $db_name);

if (!$conn) {
    die("연결 실패: " . mysqli_connect_error());
}

mysqli_set_charset($conn, "utf8mb4");
?>