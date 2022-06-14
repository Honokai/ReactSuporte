import Echo from 'laravel-echo'

window.Pusher = require('pusher-js');

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: '6673f5e00bb33e0a31c7',
    wsHost: '127.0.0.1',
    wsPort: 6001,
    forceTLS: false,
    disableStats: false,
});

window.Echo.channel('comum').listen('.ChamadoRespondido', (e) => {
    if(Notification.permission == 'default') {
        Notification.requestPermission().then(permissao => {
            permissao == 'granted' ? new Notification(e.data) : ""
            console.log(permissao)
        })
    } else if(Notification.permission == 'granted') {
        new Notification(e.data)
    }
}).listen('.t', (e) => {
    if(Notification.permission == 'default') {
        Notification.requestPermission().then(permissao => {
            permissao == 'granted' ? new Notification(e.data) : ""
            console.log(permissao)
        })
    } else if(Notification.permission == 'granted') {
        new Notification(e.data)
    }
})