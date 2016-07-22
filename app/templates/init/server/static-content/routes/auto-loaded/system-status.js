var addRoutes = function(app) {

    // Home Page //
    app.get('/', function (req, res, next) {
        res.writeHead(200, {'Content-Type': 'text/plain'});
        res.write('All Systems Go @ ' + new Date().toString());
        res.end();
    });

    return app;
};

module.exports = addRoutes;
