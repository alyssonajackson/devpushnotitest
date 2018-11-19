self.addEventListener('push', function (event) {
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    const sendNotification = (subject, message, icon) => {
        // you could refresh a notification badge here with postMessage API
        console.log(icon);
        return self.registration.showNotification(subject, {
            body: message,
            icon: icon
        });
    };

    if (event.data.json()) {
        console.log(event.data.json());
        event.waitUntil(sendNotification(
            event.data.json().subject,
            event.data.json().message,
            event.data.json().icon,
        ));
    }
});
