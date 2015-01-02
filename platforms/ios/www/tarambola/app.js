var app ={
        view:view,
        model:model,    
        
        initialize: function(){
            navigator.globalization.getPreferredLanguage( app.initLang, app.errorLang);
        },
        initLang: function(lang)
        {
           translate.initialize(lang.value);
           navigator.globalization.getCurrencySymbol( app.setCurrency, app.defaultCurrency);
        },
        setCurrency: function(res)
        {
            translate.currency=res.symbol;
            app.initApp();
        },
        defaultCurrency:function()
        {
            translate.currency="€";
            app.initApp();
        },
        errorLang: function()
        {
            translate.initialize("EN");
            app.initApp();
            
        },
        initApp: function()
        {
            model.initialize();
            $.event.special.tap.setup();
            document.addEventListener("home.end.animation", this.gotoReceber, false);
            this.view.initialize(model, new Controller());
            localStorage.setItem('content', $('#content'));
            var content = $('#content');
            this.view.setContent(content);
            this.view.gotoHome();  
        },
        gotoReceber: function()
        {
            view.gotoReceber();
        },
        currency: function(pattern)
        {
            alert('pattern: '  + pattern.pattern  + '\n' +
              'code: '     + pattern.code     + '\n' +
              'fraction: ' + pattern.fraction + '\n' +
              'rounding: ' + pattern.rounding + '\n' +
              'decimal: '  + pattern.decimal  + '\n' +
              'grouping: ' + pattern.grouping);
        },
        errorCurrency: function(){
             alert("error pattern");
        }
    };