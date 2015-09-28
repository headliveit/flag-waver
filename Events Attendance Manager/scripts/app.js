(function (global) {
    	global.app = new kendo.mobile.Application(document.body, {
        
            // you can change the default transition (slide, zoom or fade)
            transition: 'slide',
        
            // comment out the following line to get a UI which matches the look
            // and feel of the operating system
            skin: 'flat',

            // the application needs to know which view to load first
            initial: 'views/login.html'
      });
    
    document.addEventListener('deviceready', function () {  
        navigator.splashscreen.hide();
    }, false);
    
}(window));