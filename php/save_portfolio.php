<?php
// Start the session
session_start();

// Check if the user is logged in
if (!isset($_SESSION['user_id'])) {
    // Return error response
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

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
    // Return error response
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Database connection error']);
    exit;
}

// Check if the request is a POST request
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get JSON data
    $json = file_get_contents('php://input');
    $data = json_decode($json, true);
    
    if (!$data) {
        // Invalid JSON
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Invalid data format']);
        exit;
    }
    
    $user_id = $_SESSION['user_id'];
    
    try {
        // Begin a transaction
        $pdo->beginTransaction();
        
        // Check if portfolio exists for the user
        $stmt = $pdo->prepare('SELECT id FROM portfolios WHERE user_id = ?');
        $stmt->execute([$user_id]);
        $portfolio = $stmt->fetch();
        
        if (!$portfolio) {
            // Create a new portfolio
            $stmt = $pdo->prepare('INSERT INTO portfolios (user_id, created_at) VALUES (?, NOW())');
            $stmt->execute([$user_id]);
            $portfolio_id = $pdo->lastInsertId();
        } else {
            $portfolio_id = $portfolio['id'];
        }
        
        // Update education
        if (isset($data['education'])) {
            // Delete existing education entries
            $stmt = $pdo->prepare('DELETE FROM education WHERE portfolio_id = ?');
            $stmt->execute([$portfolio_id]);
            
            // Insert new education entries
            $stmt = $pdo->prepare('INSERT INTO education (portfolio_id, school, college, degree, graduation_year) VALUES (?, ?, ?, ?, ?)');
            $stmt->execute([
                $portfolio_id,
                $data['education']['school'] ?? null,
                $data['education']['college'] ?? null,
                $data['education']['degree'] ?? null,
                $data['education']['graduation'] ?? null
            ]);
        }
        
        // Update portfolio links
        if (isset($data['portfolio'])) {
            // Update the portfolio record
            $stmt = $pdo->prepare('UPDATE portfolios SET portfolio_link = ?, linkedin = ?, github = ? WHERE id = ?');
            $stmt->execute([
                $data['portfolio']['portfolio-link'] ?? null,
                $data['portfolio']['linkedin'] ?? null,
                $data['portfolio']['github'] ?? null,
                $portfolio_id
            ]);
        }
        
        // Update projects
        if (isset($data['projects'])) {
            // Delete existing projects
            $stmt = $pdo->prepare('DELETE FROM projects WHERE portfolio_id = ?');
            $stmt->execute([$portfolio_id]);
            
            // Insert new projects
            $projectStmt = $pdo->prepare('INSERT INTO projects (portfolio_id, name, link, description) VALUES (?, ?, ?, ?)');
            
            // Extract projects from the data
            for ($i = 1; $i <= 5; $i++) {
                $nameKey = "project{$i}-name";
                $linkKey = "project{$i}-link";
                $descKey = "project{$i}-desc";
                
                if (isset($data['projects'][$nameKey]) && !empty($data['projects'][$nameKey])) {
                    $projectStmt->execute([
                        $portfolio_id,
                        $data['projects'][$nameKey],
                        $data['projects'][$linkKey] ?? null,
                        $data['projects'][$descKey] ?? null
                    ]);
                }
            }
        }
        
        // Update LeetCode profile
        if (isset($data['leetcode'])) {
            // Delete existing LeetCode entries
            $stmt = $pdo->prepare('DELETE FROM leetcode WHERE portfolio_id = ?');
            $stmt->execute([$portfolio_id]);
            
            // Insert new LeetCode entry
            $stmt = $pdo->prepare('INSERT INTO leetcode (portfolio_id, profile_link, problems_solved) VALUES (?, ?, ?)');
            $stmt->execute([
                $portfolio_id,
                $data['leetcode']['leetcode-profile'] ?? null,
                $data['leetcode']['problems-solved'] ?? null
            ]);
        }
        
        // Update selected template
        if (isset($data['template'])) {
            $stmt = $pdo->prepare('UPDATE portfolios SET template = ? WHERE id = ?');
            $stmt->execute([$data['template'], $portfolio_id]);
        }
        
        // Commit the transaction
        $pdo->commit();
        
        // Return success response
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'message' => 'Portfolio saved successfully']);
        exit;
    } catch (PDOException $e) {
        // Rollback the transaction
        $pdo->rollBack();
        
        // Return error response
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'Error saving portfolio']);
        exit;
    }
} else {
    // Not a POST request
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
    exit;
}