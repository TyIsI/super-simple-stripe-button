<?php

if (!defined('ABSPATH')) {
    define('SUPER_SIMPLE_STRIPE_BUTTON', true);
    
    require_once 'common.php';
    
    require_once 'functions.php';
    
    header('Content-Type: application/json');
    
    if (!defined('S3B_PUBLISHABLE_KEY')||!defined('S3B_SECRET_KEY')) {
        http_response_code(500);
        echo json_encode([ 'result' => 'ERROR', 'message' => 'Internal server error.' ]);
        exit;
    }
    
    \Stripe\Stripe::setApiKey(S3B_SECRET_KEY);
    
    if ($_SERVER['REQUEST_METHOD'] == 'POST') {
        $input = file_get_contents('php://input');
        $body = json_decode($input);
    }
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        http_response_code(400);
        echo json_encode([ 'result' => 'ERROR', 'message' => 'Invalid request.' ]);
        exit;
    }
    
    $cmd =  substr($_SERVER['PATH_INFO'], 1);
    
    $result = array(
        "result" => "ERROR",
        "message" => "Unknown error"
    );
    
    switch ($cmd) {
        case "create-checkout-session":
            $result['data'] = s3b_create_checkout_session($body);
            $result['result'] = 'OK';
            $result['message'] = 'Success';
            break;
        case "get-checkout-session":
            $result['data'] = s3b_get_checkout_session();
            $result['result'] = 'OK';
            $result['message'] = 'Success';
            break;
        case "get-stripe-key":
            $result['data'] = s3b_get_stripe_key();
            $result['result'] = 'OK';
            $result['message'] = 'Success';
            break;
        default:
            $result['message'] = "Unknown cmd";
            break;
    }
                
    echo json_encode($result);
}
