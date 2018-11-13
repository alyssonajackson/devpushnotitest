<?php

#register_shutdown_function(function() { if($err = error_get_last()) { var_dump($err); }});

require __DIR__ . '/../vendor/autoload.php';
use Minishlink\WebPush\WebPush;

// here I'll get the subscription endpoint in the POST parameters
// but in reality, you'll get this information in your database
// because you already stored it (cf. push_subscription.php)
$subscription = json_decode(file_get_contents('php://input'), true);

$auth = array(
    'VAPID' => array(
        'subject' => 'https://github.com/Minishlink/web-push-php-example/',
        'publicKey' => 'BFZr2av0/OQazm4rxCUx2hmMNx/neS4mPXqQovxxrqIfIrISfLfbl1Pwlm2rfyx/IJs7qQm8sT20RWJBFdlXJT4',
        'privateKey' => 'ZGogr9mGc1sUdAXzxmF9YlvAC6dqGRs8G9aSqAsDbVc', // in the real world, this would be in a secret file
    ),
);

$webPush = new WebPush($auth);

$res = $webPush->sendNotification(
    $subscription['endpoint'],
    "Hello!",
    $subscription['key'],
    $subscription['token'],
    true
);

// handle eventual errors here, and remove the subscription from your server if it is expired
