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

// Get the user ID from the session
$user_id = $_SESSION['user_id'];

try {
    // Get portfolio data
    $stmt = $pdo->prepare('
        SELECT 
            p.id AS portfolio_id,
            p.portfolio_link,
            p.linkedin,
            p.github,
            p.template,
            e.school,
            e.college,
            e.degree,
            e.graduation_year,
            l.profile_link AS leetcode_profile,
            l.problems_solved
        FROM 
            portfolios p
        LEFT JOIN 
            education e ON p.id = e.portfolio_id
        LEFT JOIN 
            leetcode l ON p.id = l.portfolio_id
        WHERE 
            p.user_id = ?
    ');
    $stmt->execute([$user_id]);
    $portfolio = $stmt->fetch();
    
    if (!$portfolio) {
        // No portfolio found
        header('Content-Type: application/json');
        echo json_encode(['success' => false, 'message' => 'No portfolio found']);
        exit;
    }
    
    // Get projects
    $stmt = $pdo->prepare('SELECT id, name, link, description FROM projects WHERE portfolio_id = ?');
    $stmt->execute([$portfolio['portfolio_id']]);
    $projects = $stmt->fetchAll();
    
    // Format the data
    $result = [
        'success' => true,
        'portfolio' => [
            'education' => [
                'school' => $portfolio['school'],
                'college' => $portfolio['college'],
                'degree' => $portfolio['degree'],
                'graduation' => $portfolio['graduation_year']
            ],
            'portfolio' => [
                'portfolio-link' => $portfolio['portfolio_link'],
                'linkedin' => $portfolio['linkedin'],
                'github' => $portfolio['github']
            ],
            'leetcode' => [
                'leetcode-profile' => $portfolio['leetcode_profile'],
                'problems-solved' => $portfolio['problems_solved']
            ],
            'template' => $portfolio['template'] ?? 'modern',
            'projects' => []
        ]
    ];
    
    // Format projects
    foreach ($projects as $index => $project) {
        $projectNum = $index + 1;
        $result['portfolio']['projects']["project{$projectNum}-name"] = $project['name'];
        $result['portfolio']['projects']["project{$projectNum}-link"] = $project['link'];
        $result['portfolio']['projects']["project{$projectNum}-desc"] = $project['description'];
    }
    
    // Return success response
    header('Content-Type: application/json');
    echo json_encode($result);
    exit;
} catch (PDOException $e) {
    // Return error response
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Error retrieving portfolio']);
    exit;
}