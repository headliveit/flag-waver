(function (global) {
    var app = global.app;
	
    if(!app.eventsService) {
        app.eventsService = {
            viewModel: new global.EventViewModel()
        };
    }
})(window);