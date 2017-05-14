'use strict';
module.exports = (countryRepository, errors) => {
    const BaseService = require('./base');
    const config = require('../config.json');

    Object.setPrototypeOf(CountryService.prototype, BaseService.prototype);

    function CountryService(countryRepository, errors) {
        BaseService.call(this, countryRepository, errors);

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
                countryRepository.findAndCountAll({
                        limit: limit,
                        offset: offset,
                        order: [[orderColumn, options.order[0].dir.toUpperCase()]],
                        raw: true,
                        where: {
                            $or: [
                                {
                                    COUNTRY_NAME: {
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
                });
            });
        }

        function create(req) {
            let data = req.data[0];
            return new Promise((resolve, reject) => {
                let entity = {

                    COUNTRY_NAME: data.COUNTRY_NAME
                };

                self.baseCreate(entity)
                    .then((result) => {
                        resolve({"data": result})
                    });
            });
        }

        function update(req) {
            let keys = Object.keys(req.body.data);
            let key = Number.parseInt(keys[0]);
            let data = req.body.data[key];

            return self.baseUpdate(req.params.id || data.id, data);
        }


    }

    return new CountryService(countryRepository, errors);
};