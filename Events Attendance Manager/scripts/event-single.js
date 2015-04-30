(function (global) {
    var EventSingleViewModel,
        app = global.app = global.app || {};

    EventSingleViewModel = kendo.data.ObservableObject.extend({
        event_id: false,
        item: false,
        
        setValue: function(params) {
        	var that = this;
            that.set("event_id", params.eventid);
            
            var dataSource = app.eventsService.viewModel.eventDataSource;
            
            dataSource.fetch(function() {
              	var dataItem = dataSource.get(that.event_id);
                dataItem.expiredtxt = dataItem.expired ? "SCADUTO" : "IN PROGRAMMA";
                dataItem.expiredcss = dataItem.expired ? "#ff0000" : "#00ff00";
                dataItem.subenabled = !dataItem.expired;
                dataItem.sbandieratori = dataItem.b_rossi + dataItem.b_blu;
                
                that.set("item", dataItem);
            });
        },
        
        changeSubscription: function(e) {
            console.log(e.checked);
        }
        
    });

    app.eventsSingleService = {
        viewModel: new EventSingleViewModel()
    };
    
    app.singleEventSetValue = function(args) {
        app.eventsSingleService.viewModel.setValue(args.view.params);
    }
})(window);