const main = require('./main_routes');
const metrics_types = require('./metrics_router');
const metrics_values = require('./metrics_values');

module.exports = {
    main,
    types: metrics_types,
    values: metrics_values
}