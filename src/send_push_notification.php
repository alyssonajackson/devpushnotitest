<?php

#register_shutdown_function(function() { if($err = error_get_last()) { var_dump($err); }});

require __DIR__ . '/../vendor/autoload.php';
use Minishlink\WebPush\WebPush;

// here I'll get the subscription endpoint in the POST parameters
// but in reality, you'll get this information in your database
// because you already stored it (cf. push_subscription.php)
$inputdata = json_decode(file_get_contents('php://input'), true);

$subscription = [];

function get_value($var, $k){
    if(is_array($var))
        return isset($var[$k]) ? $var[$k] : '';
    elseif(is_object($var))
        return isset($var->$k) ? $var->$k : '';
    return '';
}

$subscription['endpoint'] = get_value($inputdata, 'endpoint');
$subscription['key'] = get_value($inputdata, 'key');
$subscription['token'] = get_value($inputdata, 'token');

$auth = array(
    'VAPID' => array(
        'subject' => 'https://github.com/Minishlink/web-push-php-example/',
        'publicKey' => 'BFZr2av0/OQazm4rxCUx2hmMNx/neS4mPXqQovxxrqIfIrISfLfbl1Pwlm2rfyx/IJs7qQm8sT20RWJBFdlXJT4',
        'privateKey' => 'ZGogr9mGc1sUdAXzxmF9YlvAC6dqGRs8G9aSqAsDbVc', // in the real world, this would be in a secret file
    ),
);

$webPush = new WebPush($auth);

$postdata = [
    'subject' => get_value($inputdata, 'subject'),
    'message' => get_value($inputdata, 'message'),
    'icon' => get_value($inputdata, 'icon'),
];

$postdata = json_encode($postdata);

$res = $webPush->sendNotification(
    $subscription['endpoint'],
    $postdata,
    $subscription['key'],
    $subscription['token'],
    true
);

// handle eventual errors here, and remove the subscription from your server if it is expired
