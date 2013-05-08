define(['durandal/system', 'services/model', 'config', 'services/logger'],
    function (system, model, config, logger) {
                
        var getManufacturers = function (manufacturerObservable) {
           manufacturerObservable = ko.observableArray([
					{ name: "ManufacturerA", manufacturerID: "A" },
					{ name: "ManufacturerB", manufacturerID: "B" },
					{ name: "ManufacturerC", manufacturerID: "C" } ]);
        };
        
        var getBikeModels = function (bikeModelsObservable, manufacturerId) {
            
        };

        var getBikeModelsWithSizes = function (bikeModelsObservable, manufacturerId) {
            
        };
        
        var getBikeSizes = function (bikeSizesObservable, modelId) {
            
        };
        
        var cancelChanges = function () {
            
        };

        var saveChanges = function () {
            
        };

        var hasChanges = ko.observable(false);

        var primeData = function () {
            var promise = Q.all([getManufacturers()]);

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
            if(resource == 'Manufacturers'){
            	return ko.observableArray([
					{ name: "ManufacturerA", manufacturerID: "A" },
					{ name: "ManufacturerB", manufacturerID: "B" },
					{ name: "ManufacturerC", manufacturerID: "C" } ]);
            }
        }
        
        function queryFailed(error) {
            var msg = 'Error retreiving data. ' + error.message;
            logger.logError(msg, error, system.getModuleId(datacontext), true);
        }

        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(datacontext), showToast);
        }
        //#endregion
});
