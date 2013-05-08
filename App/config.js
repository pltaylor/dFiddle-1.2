define(function() {

    var remoteServiceName = 'breeze/breeze';

    function xOffset(input) {
        return input + 250;
    }
    
    function yOffset(input) {
        return (295 - input);
    }
    
    var scalingFactor = .22;
    
    var routes = [{
        url: 'home',
        moduleId: 'viewmodels/home',
        name: 'Home',
        visible: true,
        caption: '<i class="icon-home"></i> Home'
    }, {
        url: 'frames',
        moduleId: 'viewmodels/frames',
        name: 'Frames',
        visible: true,
        caption: 'Frames'
    }, {
        url: 'frameAdmin',
        moduleId: 'viewmodels/frameAdmin',
        name: 'Frame Admin',
        visible: false,
        caption: '<i class="icon-plus"></i> Frame Admin',
        settings: { admin: true }
    }];

    return {
        remoteServiceName: remoteServiceName,
        routes: routes,
        scalingFactor: scalingFactor,
        xOffset: xOffset,
        yOffset: yOffset
    };
})