define(['durandal/system',
        'durandal/plugins/router',
        'services/logger',
        'config',
        'services/datacontext'],
    function (system, router, logger, config, datacontext) {

        var adminRoutes = ko.computed(function() {
            return router.allRoutes().filter(function(r) {
                return r.settings.admin;
            });
        });

        var shell = {
            activate: activate,
            adminRoutes: adminRoutes,
            goToAdmin: goToAdmin,
            router: router
        };
        
        return shell;

        //#region Internal Methods
        function activate() {
            return datacontext.primeData()
                .then(boot)
                .fail(failedInitialization);
        }

        function boot() {
            router.map(config.routes);
            log('My Tri Bike Fit Loaded!', null, false);
            return router.activate('home');
        }
        
        function goToAdmin(item) {
            router.navigateTo(item.hash);
        }

        function failedInitialization(error) {
            var msg = 'App initialization failed: ' + error.message;
            logger.logError(msg, error, system.getModuleId(shell), true);
        }
        
        function log(msg, data, showToast) {
            logger.log(msg, data, system.getModuleId(shell), showToast);
        }
        //#endregion
    });