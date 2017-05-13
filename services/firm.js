'use strict';
module.exports = (firmRepository, errors) => {
    const BaseService = require('./base');
    const config = require('../config.json');

    Object.setPrototypeOf(FirmService.prototype, BaseService.prototype);

    function FirmService(firmRepository, errors) {
        BaseService.call(this, firmRepository, errors);

        let self = this;

        self.create = create;
        self.update = update;
        self.readChunk = readChunk;

        function readChunk(options) {
            return new Promise((resolve, reject) => {
                options = Object.assign({}, config.defaults.readChunk, options);

                var limit = Number(options.length);
                var offset = Number(options.start);
                var searchKey = '%' + options.search.value + '%';
                var orderColumnNumber = Number(options.order[0].column);
                if (options.columns)
                    var orderColumn = options.columns[orderColumnNumber].data;
                else
                    var orderColumn = "id";
                return firmRepository.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [[orderColumn, options.order[0].dir.toUpperCase()]],
                        raw: true,
                        where: {
                            $or: [
                                {
                                    FIRM_NAME: {
                                        $like: searchKey
                                    }
                                }

                            ]
                        }
                    }
                ).then((result) => {
                    if (options.search.value.length > 0)
                        resolve({
                            "data": result.rows,
                            "options": [],
                            "files": [],
                            "draw": options.draw,
                            "recordsTotal": result.count,
                            "recordsFiltered": result.rows.length
                        });
                    else
                        resolve({
                            "data": result.rows,
                            "options": [],
                            "files": [],
                            "draw": options.draw,
                            "recordsTotal": result.count,
                            "recordsFiltered": result.count
                        });
                })
            });
        }

        function create(req) {
            let data = req.data[0];
            let entity = {
                FIRM_NAME: data.FIRM_NAME
            };

            return self.baseCreate(entity)
                .then((result) => ({"data": result}));
        }

        function update(req) {
            let keys = Object.keys(req.data);
            let key = Number.parseInt(keys[0]);
            let data = req.data[key];
            let entity = {
                FIRM_NAME: data.FIRM_NAME
            };

            return self.baseUpdate(data.id, entity);
        }


    }

    return new FirmService(firmRepository, errors);
};