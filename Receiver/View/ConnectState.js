export default class ConnectStatus{
    constructor(){
        this.connect_btn = document.querySelector('#connect_to_server');
        this.disconnect_btn = document.querySelector('#close_connection');
        this.container = document.querySelector('div#connection_status');
        this.disconnect();
    }
    connect() {
        this.connect_btn.disabled = true;
        this.disconnect_btn.disabled = false;
        this.container.textContent = 'ONLINE';
    }
    disconnect(){
        this.connect_btn.disabled = false;
        this.disconnect_btn.disabled = true;
        this.container.textContent = 'OFFLINE';
    }
}