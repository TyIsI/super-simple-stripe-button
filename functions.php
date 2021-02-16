<?php

function s3b_button($atts)
{
    $atts = shortcode_atts(
        array(
            'subscription' => true,
            'mode' => 'payment',
            'price' => '75',
            'period' => 'month',
            'price_id' => '',
            'quantity' => 1,
            'currency_prefix' => '$'
        ),
        $atts
    );

    $button_elements = array();
    $button_elements[] = "<button class=\"s3b-button s3b-button-custom\" data-price-id=\"%s\" data-quantity=\"%d\" data-mode=\"%s\">";
    $button_elements[] = "<img class=\"s3b-logo\" src=\"" . plugin_dir_url(__FILE__)."assets/Stripe-wordmark-white.svg" . "\" /><br />";
    $button_elements[] = "%s%d per %s";
    $button_elements[] = "</button>";
    
    $button_args = array();
    $button_args[] = $atts['price_id'];
    $button_args[] = $atts['quantity'];
    $button_args[] = $atts['mode'];
    $button_args[] = $atts['currency_prefix'];
    $button_args[] = number_format($atts['price'], 2);
    $button_args[] = $atts['period'];
    return sprintf(join(" ", $button_elements), ...$button_args);
}

function s3b_create_checkout_session($body)
{
    $checkout_session = \Stripe\Checkout\Session::create([
        'success_url' => S3B_URL_SUCCESS . '?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => S3B_URL_CANCELED,
        'payment_method_types' => ['card'],
        'mode' => isset($body->mode) ? $body->mode : 'payment',
        'line_items' => [[
            'price' => $body->priceId,
            'quantity' => isset($body->quantity) ? $body->quantity : 1,
            ]]
        ]);
            
    return $checkout_session;
}

function s3b_get_checkout_session()
{
    $id = $_GET['sessionId'];
    $checkout_session = \Stripe\Checkout\Session::retrieve($id);
    
    return $checkout_session;
}

function s3b_get_stripe_key()
{
    return S3B_PUBLISHABLE_KEY;
}

function s3b_enqueue_scripts()
{
    wp_enqueue_script('s3b-js', plugin_dir_url(__FILE__).'assets/super-simple-stripe-button.js');
    wp_localize_script('s3b-js', 'S3B', array( 'siteurl' => get_option('siteurl') ));
    wp_enqueue_script('stripe-js', 'https://js.stripe.com/v3/');
    wp_enqueue_script('jquery');
    wp_enqueue_style('s3b-css', plugin_dir_url(__FILE__).'assets/super-simple-stripe-button.css');
}
