(function (global) {
    var LoginViewModel,
        app = global.app = global.app || {};

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        UUID:"",
        username: "",
        userfullname: "",
        password: "",
        evepro: "",
        parpro: "",
        evetot: "",
        partot: "",
        
        onLoad: function () {
            var that = app.loginService.viewModel;
            
            if(localStorage.getItem("bdu-username") != undefined) {
               that.set("username", localStorage.getItem("bdu-username"));
            }
            
            if(localStorage.getItem("bdu-password") != undefined) {
               that.set("password", localStorage.getItem("bdu-password"));
            }
        },

        onLogin: function () {
            var that = this,
                dataSource,
                jsonUrlToLoad,
                authitem,
                username = that.get("username").trim(),
                password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Entrambi i campi sono richiesti!",
                    function () { }, "Login fallita", 'OK');

                return;
            }
            jsonUrlToLoad = "http://www.bandieraidegliuffizi.it/api/events/auth.php?u="+username+"&p="+CryptoJS.MD5(password);
            
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: jsonUrlToLoad,
                        dataType: "json"
                    }
                },
                schema: {
    				model: { id: "id_esi" }
                }
                
            });
            
            dataSource.fetch(function() {
  				authitem = dataSource.data()[0];
                
                if(authitem.auth) {
                    localStorage.setItem("bdu-username", username);
                    localStorage.setItem("bdu-password", password);
                    that.set("isLoggedIn", true);
					that.set("userfullname", authitem.name);
                    that.set("evepro", authitem.evepro);
                    that.set("parpro", authitem.parpro);
                    that.set("evetot", authitem.evetot);
                    that.set("partot", authitem.partot);
                    that.set("UIID", authitem.UIID);
            	}
                
			});
        },

        onLogout: function () {
            var that = this;
            
            if(localStorage.getItem("bdu-username") != undefined) {
               localStorage.removeItem("bdu-username");
            }
            
            if(localStorage.getItem("bdu-password") != undefined) {
               localStorage.removeItem("bdu-password");
            }

            that.clearForm();
            that.set("isLoggedIn", false);
        },

        clearForm: function () {
            var that = this;

            that.set("username", "");
            that.set("password", "");
        },

        checkEnter: function (e) {
            var that = this;

            if (e.keyCode == 13) {
                $(e.target).blur();
                that.onLogin();
            }
        }
    });

    app.loginService = {
        viewModel: new LoginViewModel()
    };
})(window);