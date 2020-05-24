const fs = require('fs');

const files = `..\\experiment_1\\`;

const list = fs.readdirSync(files).map(file => {
    const data = fs.readFileSync(files + file, {
        encoding: 'utf8'
    });
    const arr = data.split(',');
    return {
        file: parseInt(file),
        value: arr.reduce((a, b) => +a + +b, 0) / arr.length,
        length: arr.length
    }
});

console.log(list);
