(function (global) {
    var EventViewModel,
        app = global.app = global.app || {};

    EventViewModel = kendo.data.ObservableObject.extend({
        eventDataSource: null,

        init: function () {
            var that = this,
                dataSource,
                jsonUrlToLoad;

            kendo.data.ObservableObject.fn.init.apply(that, []);
            
            var user = app.loginService.viewModel.username;
            var psw = app.loginService.viewModel.password_tomd5;
            jsonUrlToLoad = "http://www.bandieraidegliuffizi.it/api/exhibits/";

            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: jsonUrlToLoad+"get.php?u="+user+"&g="+psw,
                        dataType: "json"
                    }
                },
                schema: {
                    model: { id: "id_esi" }
                },
                pageSize: 30
            });
            
            that.set("eventDataSource", dataSource);
        },
        
        filterlist: function(e) {
            if(e.checked) {
                app.eventsService.viewModel.eventDataSource.filter({
                    field: "subscribed",
                    operator: "eq",
                    value: true
                });
            } else {
                app.eventsService.viewModel.eventDataSource.filter({});
            }
        }
    });

    app.eventsService = {
        viewModel: new EventViewModel()
    };
})(window);