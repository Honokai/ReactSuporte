import Echo from "laravel-echo"

(<any>window).Pusher = require('pusher-js');

(<any>window).Echo = new Echo({
    broadcaster: 'pusher',
    key: '6673f5e00bb33e0a31c7',
    wsHost: window.location.hostname,
    wsPort: 6001,
    forceTLS: false,
    disableStats: true,
});