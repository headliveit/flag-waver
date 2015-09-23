(function (global) {
    var EventInsertViewModel,
        app = global.app = global.app || {};

    EventInsertViewModel = kendo.data.ObservableObject.extend({
        event_id: false,
        item: false,
        dataSource: app.eventsService.viewModel.eventDataSource,
        blank: {
            id_esi: 0,
            altri: "",
            b_blu: "",
            b_rossi: "",
            data_db: new Date,
            descr: "",
            email: "",
            gg_durata: 1,
            luogo: "",
            mezzo: "Proprio",
            nazione: "It",
            note: "",
            ora_conv: "",
            ora_esib: "",
            prov: "",
            referente: "",
            rendita: "",
            ritrovo: "",
            tamburi: "",
            tel: "",
            id_tip: "1",
            expired: false,
            subscribed: false,
            data_e: false
        },
        
        setValue: function(params) {
        	var that = this;
            
            if(params && params.eventid) {
                that.set("event_id", params.eventid);

                that.dataSource.fetch(function() {
                    var dataItem = that.dataSource.get(that.event_id);
                    dataItem.expiredtxt = dataItem.expired ? "SCADUTO" : "IN PROGRAMMA";
                    dataItem.expiredcss = dataItem.expired ? "#ff0000" : "#00ff00";
                    dataItem.subenabled = !dataItem.expired;
                    dataItem.maptext = 'geo:0,0?q=' + dataItem.ritrovo.split(" ").join("+");
                    
                    that.set("item", dataItem);
                });
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
                        },
                        dataType: 'json'  
                    });
                } else {
                    /*taSource = new kendo.data.DataSource({
                        transport: {
                            read: {
                                url: jsonUrlToLoad,
                                type: "POST", 
                                dataType: "json"
                            },
                            parameterMap: function() {    
                                    return { 
                                        "data": JSON.stringify(item)
                                    };     
                            }
                        }
                    }).read();*/
                    
                    $.ajax({
                    	type: "POST",
                        url: jsonUrlToLoad,
                        data: { "data": JSON.stringify(item) },
                        success: function(e) {
                            that.dataSource.add(e[0]);
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