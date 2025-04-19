<?php
// Start the session
session_start();

// Database connection
$host = 'localhost';
$db = 'propile_db';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (PDOException $e) {
    // For a real application, you should log this error
    // For demo purposes, we'll just redirect with an error message
    header('Location: ../login.html?error=db_connection');
    exit;
}

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $remember = isset($_POST['remember']);
    
    // Validate form data
    if (empty($email) || empty($password)) {
        header('Location: ../login.html?error=missing_fields');
        exit;
    }
    
    try {
        // Check if the user exists
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $user = $stmt->fetch();
        
        if (!$user) {
            // User not found
            header('Location: ../login.html?error=invalid_credentials');
            exit;
        }
        
        // Verify password
        if (!password_verify($password, $user['password'])) {
            // Incorrect password
            header('Location: ../login.html?error=invalid_credentials');
            exit;
        }
        
        // Login successful
        // Store user data in session
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['user_email'] = $user['email'];
        $_SESSION['user_first_name'] = $user['first_name'];
        $_SESSION['user_last_name'] = $user['last_name'];
        
        // If remember me is checked, set a cookie
        if ($remember) {
            // Generate a secure remember me token
            $token = bin2hex(random_bytes(32));
            $expires = time() + (30 * 24 * 60 * 60); // 30 days
            
            // Store the token in the database
            $stmt = $pdo->prepare('UPDATE users SET remember_token = ?, token_expires = ? WHERE id = ?');
            $stmt->execute([$token, date('Y-m-d H:i:s', $expires), $user['id']]);
            
            // Set the cookie
            setcookie('remember_me', $token, $expires, '/', '', true, true);
        }
        
        // Redirect to the dashboard
        header('Location: ../landing.html');
        exit;
    } catch (PDOException $e) {
        // For a real application, you should log this error
        // For demo purposes, we'll just redirect with an error message
        header('Location: ../login.html?error=server_error');
        exit;
    }
} else {
    // If not a POST request, redirect to the login page
    header('Location: ../login.html');
    exit;
}