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
                dataItem.maptext = 'geo:0,0?q=' + dataItem.ritrovo.split(" ").join("+");
                dataItem.editlink = 'views/event-insert.html?eventid='+dataItem.id_esi;
                
                that.set("item", dataItem);
            });
        },
        
        changeSubscription: function(e) {
            var eventUIID = app.eventsSingleService.viewModel.event_id,
            userUIID = app.loginService.viewModel.UIID,
            jsonUrlToLoad = "http://www.bandieraidegliuffizi.it/api/exhibits/put.php?u="+userUIID+"&e="+eventUIID+"&a="+e.checked,
            dataSource,
            item;
            
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: jsonUrlToLoad,
                        dataType: "json"
                    }
                }
            });
            
            dataSource.fetch(function() {
  				item = dataSource.data()[0];
                if(!item.success) {
                	navigator.notification.alert("Si sono verificati degli errori prova più tardi!",
                    	function () { }, "Disponibilità fallita", 'OK');

                	return;
            	}
                if(e.checked)
                	app.loginService.viewModel.set("parpro", app.loginService.viewModel.get("parpro")+1);
                else
                    app.loginService.viewModel.set("parpro", app.loginService.viewModel.get("parpro")-1);
                
            })   
        }
        
    });

    app.eventsSingleService = {
        viewModel: new EventSingleViewModel()
    };
    
    app.singleEventSetValue = function(args) {
        app.eventsSingleService.viewModel.setValue(args.view.params);
    }
})(window);