<?php

function s3bButton($atts)
{
    $atts = shortcode_atts(
        [
            'subscription' => true,
            'mode' => 'subscription',
            'price' => '75',
            'period' => 'month',
            'price_id' => '',
            'quantity' => 1,
            'currency_prefix' => '$',
        ],
        $atts
    );

    $button_elements = [];
    $button_elements[] =
        '<button class="s3b-button s3b-button-custom" data-price-id="%s" data-quantity="%d" data-mode="%s">';
    $button_elements[] =
        'Pay with <img class="s3b-logo" src="' .
        plugin_dir_url(__FILE__) .
        'assets/Stripe-wordmark-white.svg' .
        '" /><br />';
    $button_elements[] = '%s%d per %s';
    $button_elements[] = '</button>';

    $button_args = [];
    $button_args[] = $atts['price_id'];
    $button_args[] = $atts['quantity'];
    $button_args[] = $atts['mode'];
    $button_args[] = $atts['currency_prefix'];
    $button_args[] = number_format($atts['price'], 2);
    $button_args[] = $atts['period'];
    return sprintf(join(' ', $button_elements), ...$button_args);
}

function s3bCreateCheckoutSession($body)
{
    return \Stripe\Checkout\Session::create([
        'success_url' => S3B_URL_SUCCESS . '?session_id={CHECKOUT_SESSION_ID}',
        'cancel_url' => S3B_URL_CANCELED,
        'payment_method_types' => ['card'],
        'mode' => isset($body->mode) ? $body->mode : 'payment',
        'line_items' => [
            [
                'price' => $body->priceId,
                'quantity' => isset($body->quantity) ? $body->quantity : 1,
            ],
        ],
    ]);
}

function s3bGetCheckoutSession()
{
    $id = $_GET['sessionId'];

    return \Stripe\Checkout\Session::retrieve($id);
}

function s3bGetStripeKey()
{
    return S3B_PUBLISHABLE_KEY;
}

function s3bEnqueueScripts()
{
    wp_enqueue_script(
        's3b-js',
        plugin_dir_url(__FILE__) . 'assets/super-simple-stripe-button.min.js'
    );
    wp_localize_script('s3b-js', 'S3B', ['siteurl' => get_option('siteurl')]);
    wp_enqueue_script('stripe-js', 'https://js.stripe.com/v3/');
    wp_enqueue_script(
        'jquery',
        'https://code.jquery.com/jquery-3.7.1.slim.min.js'
    );
    wp_enqueue_style(
        's3b-css',
        plugin_dir_url(__FILE__) . 'assets/super-simple-stripe-button.css'
    );
}
