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
    ip: '192.168.0.11',
    port: 80,
    web_socket_port: 3000,
    
    logger: console.log,

    writeToDatabase: false,
    countWriteToDb: 10,
    isHttps: false
};