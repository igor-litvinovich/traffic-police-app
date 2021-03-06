'use strict';
module.exports = (DriverService, promiseHandler) => {
    const BaseController = require('./base');

    Object.setPrototypeOf(DriverController.prototype, BaseController.prototype);

    function DriverController(DriverService, promiseHandler) {
        BaseController.call(this, DriverService, promiseHandler);

        this.routes['/'] = [{method: 'get', cb: readAll},
            {method: 'post', cb: create},
            {method: 'put', cb: update},
            {method: 'delete', cb: deleteDriver}];


        this.registerRoutes();
        return this.router;

        function update(req, res) {

            DriverService.update(req).then((result) => {
                res.json(result)
            }).catch((err) => res.send({error: err.message}));
        }

        function deleteDriver(req,res) {
            let keys = Object.keys(req.query.data);
            let key = Number.parseInt(keys[0]);
            promiseHandler(res,
                DriverService.delete(req.query.data[key].id)
            );
        }

        function create(req, res) {
            DriverService.create(req.body).then((result) => {
                res.status(201).json(result)
            }).catch((err) => res.send({error: err.message}))
        }

        function readAll(req, res) {
            DriverService.readChunk(req.query)
                .then((result) => {
                    res.json(result);
                })
                .catch((err) => res.send({error: err.message}));
        }
    }

    return new DriverController(DriverService, promiseHandler);
};