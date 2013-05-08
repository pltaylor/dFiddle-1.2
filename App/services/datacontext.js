define(['durandal/system', 'services/model', 'config', 'services/logger'],
    function (system, model, config, logger) {
        var entityQuery = breeze.EntityQuery,
            manager = configureBreezeManager();
        
        var getManufacturers = function (manufacturerObservable) {
            var query = entityQuery.from('Manufacturers')
                .orderBy('name');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                if (manufacturerObservable) {
                    manufacturerObservable(data.results);
                }
                log('Retrieved [Manufacturer] from remote data source',
                    data, false);
            }
        };
        
        var getBikeModels = function (bikeModelsObservable, manufacturerId) {
            var query = entityQuery.from('BikeModels').where('manufactuerID', '==', manufacturerId)
                .orderBy('name');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                if (bikeModelsObservable) {
                    bikeModelsObservable(data.results);
                }
                log('Retrieved [Bike Models] from remote data source',
                    data, false);
            }
        };

        var getBikeModelsWithSizes = function (bikeModelsObservable, manufacturerId) {
            var query = entityQuery.from('BikeModels').where('manufactuerID', '==', manufacturerId)
                .orderBy('name');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                if (bikeModelsObservable) {
                    for (var i = 0; i < data.results.length; i++) {
                        datacontext.getBikeSizes(data.results[i].sizes, data.results[i].bikeModelID());
                    }
                    bikeModelsObservable(data.results);
                }
                log('Retrieved [Bike Models With Sizes] from remote data source',
                    data, false);
            }
        };
        
        var getBikeSizes = function (bikeSizesObservable, modelId) {
            var query = entityQuery.from('BikeSizes').where('bikeModelID', '==', modelId)
                .orderBy('size');

            return manager.executeQuery(query)
                .then(querySucceeded)
                .fail(queryFailed);

            function querySucceeded(data) {
                if (bikeSizesObservable) {
                    bikeSizesObservable(data.results);
                }
                log('Retrieved [Bike Sizes] from remote data source',
                    data, false);
            }
        };
        
        var cancelChanges = function () {
            manager.rejectChanges();
            log('Canceled changes', null, true);
        };

        var saveChanges = function () {
            return manager.saveChanges()
                .then(saveSucceeded)
                .fail(saveFailed);

            function saveSucceeded(saveResult) {
                log('Saved data successfully', saveResult, true);
            }

            function saveFailed(error) {
                var msg = 'Save failed: ' + error.message;
                logError(msg, error);
                error.message = msg;
                throw error;
            }
        };

        var hasChanges = ko.observable(false);

        manager.hasChangesChanged.subscribe(function (eventArgs) {
            hasChanges(eventArgs.hasChanges);
        });
        var primeData = function () {
            var promise = Q.all([getManufacturers()])
                .then(processLookups);

            return promise.then(success);
            
            function success() {
                datacontext.lookups = {
                    manufacturers: function ()
                    { return getLocal('Manufacturers', 'name', true); }
                };
            }
            
        };

        var datacontext = {
            getManufacturers: getManufacturers,
            getBikeModels: getBikeModels,
            getBikeModelsWithSizes: getBikeModelsWithSizes,
            getBikeSizes: getBikeSizes,
            hasChanges: hasChanges,
            primeData: primeData,
            cancelChanges: cancelChanges,
            saveChanges: saveChanges
        };

        return datacontext;

        //#region Internal methods        
        function getLocal(resource, ordering, includeNullos) {
            var query = entityQuery.from(resource)
                .orderBy(ordering);
            if (!includeNullos) {
                query = query.where('id', '!=', 0);
            }
            return manager.executeQueryLocally(query);
        }
        
        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }

        function configureBreezeManager() {
            breeze.NamingConvention.camelCase.setAsDefault();
            var mgr = new breeze.EntityManager(config.remoteServiceName);
            model.configureMetadataStore(mgr.metadataStore);
            return mgr;
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }
        
        function processLookups() {
            model.createNullos(manager);
        }
        //#endregion
});