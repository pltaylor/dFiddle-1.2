define(['services/logger',
        "services/datacontext"],
    function (logger, datacontext) {
        var manufacturers = ko.observableArray();
        var manufacturer = ko.observable();
        var isSaving = ko.observable(false);
        var modelsWithSizes = ko.observableArray();

        manufacturer.subscribe(function (newValue) {
            datacontext.getBikeModelsWithSizes(modelsWithSizes, newValue.manufacturerID());
        });

        var hasChanges = ko.computed(function () {
            return datacontext.hasChanges();
        });

        var cancel = function () {
            datacontext.cancelChanges();
        };

        var canSave = ko.computed(function () {
            return hasChanges() && !isSaving();
        });

        var save = function () {
            isSaving(true);
            return datacontext.saveChanges().fin(complete);

            function complete() {
                isSaving(false);
            }
        };

        var canDeactivate = function () {
            if (hasChanges()) {
                var title = 'Do you want to leave ?';
                var msg = 'Navigate away and cancel your changes?';
                var checkAnswer = function (selectedOption) {
                    if (selectedOption === 'Yes') {
                        cancel();
                    }
                    return selectedOption;
                };
                return app.showMessage(title, msg, ['Yes', 'No'])
                    .then(checkAnswer);

            }
            return true;
        };

        var vm = {
            activate: activate,
            cancel: cancel,
            canDeactivate: canDeactivate,
            canSave: canSave,
            hasChanges: hasChanges,
            manu: manufacturer,
            manufacturers: manufacturers,
            modelsWithSizes: modelsWithSizes,
            save: save
        };

        return vm;

        //#region Internal Methods
        //function activate() {
        //    manufacturers(datacontext.lookups.manufacturers),
        //    //var promise = Q.all([datacontext.getManufacturers(manufacturers)]);
        //    logger.log('Frames Admin View Activated', null, 'frames', false);
        //    return promise;
        //}

        function activate() {
            var manufacturesPromise = datacontext.lookups.manufacturers();
            logger.log('Frames View Activated', null, 'frames', false);

            return $.when(manufacturesPromise).then(function (results) {
                manufacturers(results);
            });
        }

        //#endregion
    });