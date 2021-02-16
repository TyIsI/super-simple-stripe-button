<?php

if (!defined('SUPER_SIMPLE_STRIPE_BUTTON')) {
    echo "SUPER_SIMPLE_STRIPE_BUTTON is not defined";
    exit();
}

define('S3B_PUBLISHABLE_KEY', 'pk_test_...');

define('S3B_SECRET_KEY', 'sk_test_...');

define('S3B_URL_SUCCESS', 'http://localhost:8000/payment-confirmation/');
define('S3B_URL_FAILED', 'http://localhost:8000/payment-failed/');
define('S3B_URL_CANCELED', 'http://localhost:8000/payment-canceled/');
