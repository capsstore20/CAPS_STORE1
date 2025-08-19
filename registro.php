<?php
$conexion = new mysqli("localhost", "root", "", "admin");
if ($conexion->connect_error) {
    die(json_encode(['success' => false, 'message' => 'Error de conexión: ' . $conexion->connect_error]));
}
$usuario = $_POST['usuario'] ?? '';
$correo = $_POST['correo'] ?? '';
$contrasena = $_POST['contrasena'] ?? '';
if ($usuario === '' || $correo === '' || $contrasena === '') {
    echo json_encode(['success' => false, 'message' => 'Todos los campos son obligatorios.']);
    exit;
}
$sql = "SELECT id FROM usuarios WHERE usuario = ? OR correo = ?";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("ss", $usuario, $correo);
$stmt->execute();
$stmt->store_result();
if ($stmt->num_rows > 0) {
    echo json_encode(['success' => false, 'message' => 'El usuario o correo ya existe.']);
    $stmt->close();
    $conexion->close();
    exit;
}
$stmt->close();
$sql = "INSERT INTO usuarios (usuario, correo, contrasena) VALUES (?, ?, ?)";
$stmt = $conexion->prepare($sql);
$stmt->bind_param("sss", $usuario, $correo, $contrasena);
if ($stmt->execute()) {
    echo json_encode(['success' => true, 'message' => 'Registro exitoso.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Error al registrar usuario.']);
}
$stmt->close();
$conexion->close();
?>