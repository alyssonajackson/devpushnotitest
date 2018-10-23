/*
*
*  Push Notifications codelab
*  Copyright 2015 Google Inc. All rights reserved.
*
*  Licensed under the Apache License, Version 2.0 (the "License");
*  you may not use this file except in compliance with the License.
*  You may obtain a copy of the License at
*
*      https://www.apache.org/licenses/LICENSE-2.0
*
*  Unless required by applicable law or agreed to in writing, software
*  distributed under the License is distributed on an "AS IS" BASIS,
*  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*  See the License for the specific language governing permissions and
*  limitations under the License
*
*/

/* eslint-env browser, es6 */

'use strict';

//const APIURL = 'https://testpushchromentfy.free.beeceptor.com';
const APIURL = 'https://api.myjson.com/bins/e65os';

//const applicationServerPublicKey = 'BHdd2PwLOsYaDQQOmqw_8KIIYOQYECWN' +
  //'lat0K8GScnytjV88e6Xifn0GMz7MbScAkxf_kVJhnp-0NrB_P4u6WHw';

const applicationServerPublicKey = 'BOiNz4YUA-uxeEABNYgs_o7uhVzxCm1M6KwPhvBIzC_qj2DxK-BwgaxKh9G34kVvcO4l-3BLT6_BYvoMQt8jg0s';

const pushButton = document.querySelector('.js-push-btn');

let isSubscribed = false;
let swRegistration = null;

function urlB64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

function updateBtn() {
  if (Notification.permission === 'denied') {
    pushButton.textContent = 'Push Messaging Blocked.';
    pushButton.disabled = true;
    updateSubscriptionOnServer(null);
    return;
  }

  if (isSubscribed) {
    pushButton.textContent = 'Disable Push Messaging';
  } else {
    pushButton.textContent = 'Enable Push Messaging';
  }

  pushButton.disabled = false;
}

function update_json_data(data){
      $.getJSON(APIURL, function(resp){

          if(typeof(resp) == 'object'){
              var ts = new Date().getTime();
              resp[ts] = data;

              resp = JSON.stringify(resp);
          }

          if(resp == undefined || resp == null || resp == '') return false;

          $.ajax({
              //url: 'https://webhook.site/097a572e-1a94-49b8-9816-6c9d008e679c',
              //url: 'https://api.myjson.com/bins/e65os',
              url: APIURL,
              //contentType: "application/json; charset=utf-8",
              contentType: "application/json",
              type: 'PUT',
              //crossDomain: true,
              dataType: 'json',
              data: resp
          });

      });
}

function updateSubscriptionOnServer(subscription) {
  // TODO: Send subscription to application server

  if(subscription == null){
      var emptydata = {};
      emptydata.values = '';
      emptydata = JSON.stringify(emptydata);
      update_json_data(emptydata);
  }
  
  var jsondata = subscription;

  if(jsondata == undefined || jsondata == null || jsondata == ''){
      jsondata = false;
  }

  console.log(jsondata);

  if(jsondata != false){

      jsondata = JSON.stringify(jsondata);

      console.log('try ajax');

      console.log(jsondata);
      update_json_data(jsondata);
  }else{
  }

  const subscriptionJson = document.querySelector('.js-subscription-json');
  const subscriptionDetails =
    document.querySelector('.js-subscription-details');

  if (subscription) {
    subscriptionJson.textContent = JSON.stringify(subscription);
    subscriptionDetails.classList.remove('is-invisible');
  } else {
    subscriptionDetails.classList.add('is-invisible');
  }
}

function subscribeUser() {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: applicationServerKey
  })
  .then(function(subscription) {
    console.log('User is subscribed.');

    updateSubscriptionOnServer(subscription);

    isSubscribed = true;

    updateBtn();
  })
  .catch(function(err) {
    console.log('Failed to subscribe the user: ', err);
    updateBtn();
  });
}

function unsubscribeUser() {
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    if (subscription) {
      return subscription.unsubscribe();
    }
  })
  .catch(function(error) {
    console.log('Error unsubscribing', error);
  })
  .then(function() {
    updateSubscriptionOnServer(null);

    console.log('User is unsubscribed.');
    isSubscribed = false;

    updateBtn();
  });
}

function initializeUI() {
  pushButton.addEventListener('click', function() {
    pushButton.disabled = true;
    if (isSubscribed) {
      unsubscribeUser();
    } else {
      subscribeUser();
    }
  });

  // Set the initial subscription value
  swRegistration.pushManager.getSubscription()
  .then(function(subscription) {
    isSubscribed = !(subscription === null);

    updateSubscriptionOnServer(subscription);

    if (isSubscribed) {
      console.log('User IS subscribed.');
    } else {
      console.log('User is NOT subscribed.');
    }

    updateBtn();
  });
}

if ('serviceWorker' in navigator && 'PushManager' in window) {
  console.log('Service Worker and Push is supported');

  navigator.serviceWorker.register('sw.js')
  .then(function(swReg) {
    console.log('Service Worker is registered', swReg);

    swRegistration = swReg;
    initializeUI();
  })
  .catch(function(error) {
    console.error('Service Worker Error', error);
  });
} else {
  console.warn('Push messaging is not supported');
  pushButton.textContent = 'Push Not Supported';
}
