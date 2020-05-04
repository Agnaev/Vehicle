// @ts-check
'use strict';

const { Router } = require('express'); 

const router = Router();

const cards = {
    nodejs: {
        name: 'Node js',
        image: '/images/nodejs.png',
        description: 'Server side application'
    },
    js: {
        name: 'js',
        image: '/images/js.png',
        description: 'Language'
    },
    bootstrap: {
        name: 'Bootstrap 4',
        image: '/images/bootstrap.png',
        description: 'Design'
    },
    express: {
        name: 'Express',
        image: '/images/express.jpeg',
        description: 'server'
    },
    mssql: {
        name: 'Microsoft sql server',
        image: '/images/mssql.jpg',
        description: 'Database'
    },
    jquery: {
        name: 'Jquery',
        image: '/images/jquery.png',
        description: 'JavaScript library'
    },
    chart: {
        name: 'Chart.js',
        image: '/images/chartjs.svg',
        description: 'Library for building charts.'
    },
    html: {
        name: 'HTML',
        image: '/images/html.png',
        description: 'Hyper text markup language'
    },
    npm: {
        name: 'Node package manager',
        image: '/images/npm.png',
        description: 'Node package manager'
    },
    nodemon: {
        name: 'nodemon',
        image: '/images/nodemon.png',
        description: 'npm package for autorestarting server after save file. Used for develop.'
    },
    kendo: {
        name: 'Kendo',
        image: '/images/kendo.png',
        description: '/images/kendo.png'
    },
    css: {
        name: 'css',
        image: '/images/css.png',
        description: 'Cascade style sheet'
    }
}

router.get('/', (req, res) => res.status(200).send(cards));

router.get('/:name', (req, res) => {
    const name = req.params && Object.keys(cards).includes(req.params.name) && req.params.name || 'js';
    res.send(cards[name]);
});

module.exports = router;
