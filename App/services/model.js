define(['config'], function (config) {
    
    var entityNames = {
        manufacturer: 'Manufacturer'
    };
    
    var model = {
        configureMetadataStore: configureMetadataStore,
        createNullos: createNullos,
        entityNames: entityNames
    };

    return model;

    //#region Internal Methods
    function configureMetadataStore(metadataStore) {
        metadataStore.registerEntityTypeCtor(
            'Manufacturer', null, manufacturerInitializer);
        metadataStore.registerEntityTypeCtor(
            'BikeModel', null, bikeModelInitializer);
        metadataStore.registerEntityTypeCtor(
            'BikeSize', null, bikeSizeInitializer);
    }

    function createNullos(manager) {
        var unchanged = breeze.EntityState.Unchanged;

        createNullo(entityNames.manufacturer);

        function createNullo(entityName, values) {
            var initialValues = values
                || { name: ' Select a ' + entityName };
            return manager.createEntity(entityName, initialValues, unchanged);
        }

    }
    
    function manufacturerInitializer(manufacturer) {
        //Add computed observables here
    }

    function bikeModelInitializer(bikeModel) {
        bikeModel.sizes = ko.observableArray();
    }

    function bikeSizeInitializer(bikeSize) {

        
    }

    //#endregion
});