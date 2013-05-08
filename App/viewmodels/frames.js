define(['services/logger',
        "services/datacontext"],
    function (logger, datacontext) {
    var manufacturers = ko.observableArray();

    var frame1 = createFrame('Frame 1', 'bike1', 'orange'); 
    var frame2 = createFrame('Frame 2', 'bike2', 'green'); 
    var frame3 = createFrame('Frame 3', 'bike3', 'purple'); 

    var vm = {
        activate: activate,
        frame1: frame1,
        frame2: frame2,
        frame3: frame3,
        manufacturers: manufacturers,
        title: 'Frames'
    };

    return vm;

    //#region Internal Methods
    function activate() {
        //manufacturers(datacontext.lookups.manufacturers);
        var promise = Q.all([datacontext.getManufacturers(manufacturers)]).then(logger.log('Frames View Activated', null, 'frames', false));
        //return datacontext.getManufacturers(manufacturers);
        return promise;
    }
        
    function createFrame(name, canvasName, color) {
        var manufacturer = ko.observable();
        manufacturer.subscribe(function (newValue) {
            datacontext.getBikeModels(models, newValue.manufacturerID());
        });
        
        var models = ko.observableArray();
        var model = ko.observable();
        model.subscribe(function (newValue) {
            datacontext.getBikeSizes(sizes, newValue.bikeModelID());
            size(sizes()[0]);
        });

        var sizes = ko.observableArray();
        var size = ko.observable();
        size.subscribe(function(newValue) {
            drawFrame(newValue);
        });

        var output = {
            name : name,
            manufacturer: manufacturer,
            models: models,
            model: model,
            sizes: sizes,
            size: size
        };
        return output;
        
        function drawFrame(localSize) {
            var drawingCanvas = document.getElementById(canvasName);
            if (drawingCanvas.getContext) {
                var ctx = drawingCanvas.getContext('2d');
                // clear
                ctx.clearRect(0, 0, drawingCanvas.width, drawingCanvas.height);
                // Create the rear wheel
                ctx.beginPath();
                ctx.arc(localSize.rearWheelXloc(), localSize.rearWheelYloc(), localSize.wheelRadius(), 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.strokeStyle = color;
                ctx.stroke();
                // create front wheel
                ctx.beginPath();
                ctx.arc(localSize.frontWheelXloc(), localSize.frontWheelYloc(), localSize.wheelRadius(), 0, Math.PI * 2, true);
                ctx.closePath();
                ctx.strokeStyle = color;
                ctx.stroke();
                // create rear chainstay
                ctx.beginPath();
                ctx.moveTo(localSize.rearWheelXloc(), localSize.rearWheelYloc());
                ctx.lineTo(localSize.bbXloc(), localSize.bbYloc());
                ctx.strokeStyle = color;
                ctx.stroke();
                // create seat tube
                ctx.beginPath();
                ctx.moveTo(localSize.seatTubeXloc(), localSize.seatTubeYloc());
                ctx.lineTo(localSize.bbXloc(), localSize.bbYloc());
                ctx.strokeStyle = color;
                ctx.stroke();
                // create seat stay
                ctx.beginPath();
                ctx.moveTo(localSize.seatTubeXloc(), localSize.seatTubeYloc());
                ctx.lineTo(localSize.rearWheelXloc(), localSize.rearWheelYloc());
                ctx.strokeStyle = color;
                ctx.stroke();
                // create downtube
                ctx.beginPath();
                ctx.moveTo(localSize.bbXloc(), localSize.bbYloc());
                ctx.lineTo(localSize.headTubeBottomXloc(), localSize.headTubeBottomYloc());
                ctx.strokeStyle = color;
                ctx.stroke();
                // create toptube
                ctx.beginPath();
                ctx.moveTo(localSize.seatTubeXloc(), localSize.seatTubeYloc());
                ctx.lineTo(localSize.headTubeTopXloc(), localSize.headTubeTopYloc());
                ctx.strokeStyle = color;
                ctx.stroke();
                // create headtube
                ctx.beginPath();
                ctx.moveTo(localSize.headTubeTopXloc(), localSize.headTubeTopYloc());
                ctx.lineTo(localSize.headTubeBottomXloc(), localSize.headTubeBottomYloc());
                ctx.strokeStyle = color;
                ctx.stroke();
                // create fork
                ctx.beginPath();
                ctx.moveTo(localSize.frontWheelXloc(), localSize.frontWheelYloc());
                ctx.lineTo(localSize.headTubeBottomXloc(), localSize.headTubeBottomYloc());
                ctx.strokeStyle = color;
                ctx.stroke();
            }
        }
    }
    //#endregion
});