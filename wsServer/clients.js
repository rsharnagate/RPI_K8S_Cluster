class Clients {
    constructor() {
        this.clientList = {};
        this.saveClient = this.saveClient.bind(this);
    }

    saveClient(ip, client) {
        if (this.clientList[ip] == undefined) {
            this.clientList[ip] = client;
        }        
    }

    removeClient(ip) {
        if (this.clientList[ip] != undefined) {
            delete this.clientList[ip];
        }
    }
}

module.exports = Clients;