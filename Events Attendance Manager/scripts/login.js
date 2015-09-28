(function (global) {
    var LoginViewModel,
        app = global.app;

    LoginViewModel = kendo.data.ObservableObject.extend({
        isLoggedIn: false,
        isAdmin: false,
        UUID:"",
        username: "",
        userfullname: "",
        password: "",
        password_tomd5: "",
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
                password_tomd5,
                username = that.get("username").trim(),
                password = that.get("password").trim();

            if (username === "" || password === "") {
                navigator.notification.alert("Entrambi i campi sono richiesti!",
                    function () { }, "Login fallita", 'OK');

                return;
            }
            
            password_tomd5 = CryptoJS.MD5(password + Math.floor(new Date(new Date().setHours(0,0,0,0)).getTime()/1000));
            jsonUrlToLoad = "http://www.bandieraidegliuffizi.it/api/users/auth.php?u="+username+"&p="+password_tomd5;
            
            dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: jsonUrlToLoad,
                        dataType: "json"
                    }
                }
            });
            
            dataSource.fetch(function() {
  				authitem = dataSource.data()[0];
                
                if(authitem.auth) {
                    localStorage.setItem("bdu-username", username);
                    localStorage.setItem("bdu-password", password);
                    that.set("isLoggedIn", true);
                    that.set("password_tomd5", password_tomd5);
					that.set("userfullname", authitem.name);
                    that.set("evepro", authitem.evepro);
                    that.set("parpro", authitem.parpro);
                    that.set("evetot",authitem.evetot);
                    that.set("partot", authitem.partot);
                    that.set("UIID", authitem.UIID);
                    
                    $('#hide-menu').css("display","table");
                    
                    if(authitem.admin) {
						$(".hiding-button").css("display","table-cell");
                        that.set("isAdmin", true);
                    }

            	} else {
                    navigator.notification.alert("Le credenziali inserite non sono corrette!",
                    	function () { }, "Login fallita", 'OK');

                	return;
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
            
            $('#hide-menu').css("display","none");
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