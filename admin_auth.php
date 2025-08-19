<?php
// admin_auth.php
session_start();
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$usuario = $_POST['usuario'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';

// Cambia estos valores por los de tu admin real
$admin_user = 'JOSE';
$admin_pass = '2005';

if ($usuario === $admin_user && $contrasena === $admin_pass) {
    $_SESSION['usuario'] = $usuario;
    $_SESSION['rol'] = 'admin';
    echo json_encode(['success' => true, 'message' => 'Login exitoso']);
} else {
    echo json_encode(['success' => false, 'message' => 'Usuario o contraseña incorrectos']);
}
?>
