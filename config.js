module.exports = {
    db_config: {
        user: 'sa',
        password: 'P@ssw0rd',
        server: 'DESKTOP-GDG6PM0',
        database: 'VehicleMetrics',
        options: {
            enableArithAbort: true
        }
    },
    host: '192.168.0.13',
    port: 80,
    web_socket: {
        host: '192.168.0.16',
        port: 3000
    },
    
    logger: console.log,

    writeToDatabase: true,
    countWriteToDb: 10,
    isHttps: false
};