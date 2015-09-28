(function (global) {
    var EventInsertViewModel,
        app = global.app;
    
    if(!app.eventsService) {
        app.eventsService = {
            viewModel: new global.EventViewModel()
        };
    }

    EventInsertViewModel = kendo.data.ObservableObject.extend({
        event_id: false,
        item: false,
        dataSource: app.eventsService.viewModel.eventDataSource,
        blank: {
            id_esi: 0,
            altri: null,
            b_blu: null,
            b_rossi: null,
            conclusa: null,
            data_db: null,
            descr: "",
            email: null,
            gg_durata: 1,
            luogo: "",
            mezzo: "",
            nazione: "It",
            note: null,
            ora_conv: null,
            ora_esib: null,
            prov: "",
            referente: null,
            rendita: null,
            ritrovo: "",
            tamburi: null,
            tel: null,
            id_tip: "1",
            expired: false,
            subscribed: false,
            data_e: false
        },
        
        setValue: function(params) {
        	var that = this;
            
            if(params && params.eventid) {
                that.set("event_id", params.eventid);

                var dataItem = that.dataSource.get(that.event_id);
                dataItem.expiredtxt = dataItem.expired ? "SCADUTO" : "IN PROGRAMMA";
                dataItem.expiredcss = dataItem.expired ? "#ff0000" : "#00ff00";
                dataItem.subenabled = !dataItem.expired;
                dataItem.maptext = 'geo:0,0?q=' + dataItem.ritrovo.split(" ").join("+");

                that.set("item", dataItem);
            } else {
                that.set("item", that.get("blank"));
            }
        },
        
        cancel: function(params) {
            var that = app.eventInsertService.viewModel;
            that.set("item", that.get("blank"));
        },
        
        submit: function(params) {
            var that = app.eventInsertService.viewModel,
                dataSource,
                jsonUrlToLoad;
            
            var user = app.loginService.viewModel.username;
            var psw = app.loginService.viewModel.password_tomd5;
            jsonUrlToLoad = "http://www.bandieraidegliuffizi.it/api/exhibits/post.php?u="+user+"&g="+psw;
            
            if(!app.eventInsertService.viewModel.validator.validate())
                alert('Alcuni campi non sono validi si prega di verificare');
            else {
                var item = that.get('item');
                
                if(item.id_esi > 0) {
                    $.ajax({
                    	type: "POST",
                        url: jsonUrlToLoad,
                        data: { "data": JSON.stringify(item) },
                        success: function(e) {
                            that.dataSource.read();
                            app.navigate("views/events.html");
                        },
                        dataType: 'json'  
                    });
                } else {
                    $.ajax({
                    	type: "POST",
                        url: jsonUrlToLoad,
                        data: { "data": JSON.stringify(item) },
                        success: function(e) {
                            that.dataSource.read();
                            app.navigate("views/events.html");
                        },
                        dataType: 'json'  
                    });
                }
            }
        }
   });

    app.eventInsertService = {
        viewModel: new EventInsertViewModel()
    };
    
    app.insertEventSet = function(args) {
        app.eventInsertService.viewModel.setValue(args.view.params);
    }
    
    app.eventInsertService.viewModel.validator = $("#eventForm").kendoValidator().data("kendoValidator");
})(window);