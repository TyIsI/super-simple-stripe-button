<?php

/**
 * Super Simple Stripe Button.
 *
 * @package           super-simple-stripe-button
 *
 * @author            Ty Eggen
 * @copyright         2025 Ty Eggen
 * @license           MIT license
 *
 * @wordpress-plugin
 * Plugin Name:       Super Simple Stripe Button
 * Plugin URI:        https://github.com/tyisi/super-simple-stripe-button/
 * Description:       A super simple Stripe button plugin
 * Version:           2.0.2
 * Requires at least: 5.2
 * Requires PHP:      7.2
 * Author:            Ty Eggen
 * Author URI:        https://github.com/TyIsI/
 * License:           MIT license
 * License URI:       https://github.com/TyIsI/super-simple-stripe-button/blob/trunk/LICENSE
 * Text Domain:       super-simple-stripe-button
 */
define('SUPER_SIMPLE_STRIPE_BUTTON', true);

require_once 'config.php';

require_once 'functions.php';

if (!defined('ABSPATH')) {
    echo 'Hi there!  I\'m just a plugin, not much I can do when called directly.';
    exit();
}

add_shortcode('s3b-button', 's3bButton');
add_action('wp_enqueue_scripts', 's3bEnqueueScripts');
