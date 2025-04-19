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
    header('Location: ../signup.html?error=db_connection');
    exit;
}

// Check if the form was submitted
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $first_name = $_POST['first_name'] ?? '';
    $last_name = $_POST['last_name'] ?? '';
    $email = $_POST['email'] ?? '';
    $password = $_POST['password'] ?? '';
    $confirm_password = $_POST['confirm_password'] ?? '';
    $terms = isset($_POST['terms']);
    
    // Validate form data
    if (empty($first_name) || empty($last_name) || empty($email) || empty($password) || empty($confirm_password)) {
        header('Location: ../signup.html?error=missing_fields');
        exit;
    }
    
    if ($password !== $confirm_password) {
        header('Location: ../signup.html?error=passwords_mismatch');
        exit;
    }
    
    if (!$terms) {
        header('Location: ../signup.html?error=terms_not_accepted');
        exit;
    }
    
    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        header('Location: ../signup.html?error=invalid_email');
        exit;
    }
    
    // Validate password strength
    if (strlen($password) < 8) {
        header('Location: ../signup.html?error=weak_password');
        exit;
    }
    
    try {
        // Check if the email already exists
        $stmt = $pdo->prepare('SELECT COUNT(*) FROM users WHERE email = ?');
        $stmt->execute([$email]);
        $count = $stmt->fetchColumn();
        
        if ($count > 0) {
            // Email already exists
            header('Location: ../signup.html?error=email_exists');
            exit;
        }
        
        // Hash the password
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        
        // Insert the new user
        $stmt = $pdo->prepare('INSERT INTO users (first_name, last_name, email, password, created_at) VALUES (?, ?, ?, ?, NOW())');
        $stmt->execute([$first_name, $last_name, $email, $hashed_password]);
        
        // Get the inserted user ID
        $user_id = $pdo->lastInsertId();
        
        // Create a portfolio record for the new user
        $stmt = $pdo->prepare('INSERT INTO portfolios (user_id, created_at) VALUES (?, NOW())');
        $stmt->execute([$user_id]);
        
        // Login the user
        $_SESSION['user_id'] = $user_id;
        $_SESSION['user_email'] = $email;
        $_SESSION['user_first_name'] = $first_name;
        $_SESSION['user_last_name'] = $last_name;
        
        // Redirect to the dashboard
        header('Location: ../landing.html');
        exit;
    } catch (PDOException $e) {
        // For a real application, you should log this error
        // For demo purposes, we'll just redirect with an error message
        header('Location: ../signup.html?error=server_error');
        exit;
    }
} else {
    // If not a POST request, redirect to the signup page
    header('Location: ../signup.html');
    exit;
}