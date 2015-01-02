var view = {
    _model:Object(),
    _controller:Object(),
    _content:Object(),
    _slider:new PageSlider($("#content")),
    _actPage:"",
    _previousPage:"",
    
    _home: home,
    _list: list,
    _allItem: allItem,
    _receber: receber,
    _pagar: pagar,
    _itemReceber: itemReceber,
    _itemPagar: itemPagar,
    _addReceber: insertReceber,
    _addPagar: insertPagar,
    
    initialize: function(model, controller){

        this._model = model;
        this._controller = controller; 
        
        //********* EVENTS ***********
        //document.addEventListener("model.ready", this.gotoHome, false);
        document.addEventListener("home.receber.btn", this.gotoReceber, false);
        document.addEventListener("home.pagar.btn", this.gotoPagar, false);
        document.addEventListener("home.list.btn", this.gotoListAll, false);
        document.addEventListener("model.receber.ready", view.gotoReceberReady, false);
        document.addEventListener("model.pagar.ready", view.gotoPagarReady, false);
        document.addEventListener("model.list.ready", view.gotoListAllReady, false);
        document.addEventListener("model.goto.item", view.gotoReceberItem, false);
        document.addEventListener("model.all.goto.item", view.gotoAllItem, false);
        document.addEventListener("model.pagar.goto.item", view.gotoPagarItem, false);
        document.addEventListener("model.receberitem.ready", view.gotoReceberItemReady, false);
        document.addEventListener("model.pagaritem.ready", view.gotoPagarItemReady, false);
        document.addEventListener("model.allitem.ready", view.gotoAllItemReady, false);
        document.addEventListener("receber.add.btn", view.gotoAddReceberReady, false);
        document.addEventListener("pagar.add.btn", view.gotoAddPagarReady, false);
        //$('.aBack').click(function(){view.goBack();});
        $('.aBack').on('tap', function(){view.goBack();});
        //$('#topBtn').click(function(){view.searchDelete(); return(false);});
        $('#topBtn').click('tap', function(){view.searchDelete(); return(false);});
        
        //******* TOUCH FX
        $('.aSearch').on('touchstart', function(e){$(this).addClass('tapped');});
        $('.aSearch').on('touchend', function(e){$(this).removeClass('tapped');});
        $('.aBack').on('touchstart', function(e){$(this).addClass('tapped');});
        $('.aBack').on('touchend', function(e){$(this).removeClass('tapped');});
       // $(window).on('hashchange', view.route); 
    },
    route: function(){
        var hash = window.location.hash;
        if(hash == "#item_receber")
            alert("item");
    },
    changePage: function(screen){
        // $('#content').html(screen);
       this._slider.slidePageFrom($(screen), 'right');
       if(screen!=view._home)
           view.showBackBtn();
       else
           view.hideBackBtn();
       
       if(view._actPage == view._itemReceber || view._actPage == view._itemPagar || view._actPage == view._allItem)
           view.showDelete();
       else if(view._actPage == view._addPagar || view._actPage == view._addReceber)
           view.hideSearch();
       else
           view.showSearch();
       
    },
    setContent: function(content)
    {
        this._content = content;
    },
    gotoHome: function()
    {
        view._previousPage = view._home;
        view._actPage = view._home;
        var screen = view._home.getHtml(model);
        this.changePage(screen);
        this._home.setEvents();
        view.hideBackBtn();
    },   
    //****************** LIST *******************//
    gotoListAll: function()
    {
        model.getAllDebts();
    },
    gotoListAllReady: function()
    {
        view._previousPage = view._actPage;
        view._actPage = view._list;
        view.changePage(view._list.getHtml(model));
        view._list.setEvents();
    },
    gotoAllItem: function(){
        model.prepareModelItemAll();
    },       
    gotoAllItemReady: function(){
        view._previousPage = view._actPage;
        view._actPage = view._allItem;
        view.changePage(view._allItem.getHtml(model));
        view._allItem   .setEvents();
    },
    //****************** @LIST *******************//
    //****************** RECEBER *******************//
    gotoReceber: function()
    {
        model.getReceberNaoLiquidadas();
    },
    gotoReceberReady: function()
    {
        view._previousPage = view._actPage;
        view._actPage = view._receber;
        view.changePage(receber.getHtml(model));
        receber.setEvents();
    },
    gotoReceberItem: function(){
        model.prepareModelItemReceber();
    },
    gotoReceberItemReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._itemReceber;
        view.changePage(view._itemReceber.getHtml(model));
        view._itemReceber.setEvents();
    },
    gotoAddReceberReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._addReceber;
        view.changePage(view._addReceber.getHtml(model));
        view._addReceber.setEvents();
    },
    //****************** @RECEBER *******************//
    //****************** PAGAR *******************//
    gotoPagar: function()
    {
        model.getPagarNaoLiquidadas();
    },
    gotoPagarReady: function()
    {
        view._previousPage = view._actPage;
        view._actPage = view._pagar;
        view.changePage(pagar.getHtml(model));
        pagar.setEvents();
    },
    gotoPagarItem: function(){
        model.prepareModelItemPagar();
    },
    gotoPagarItemReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._itemPagar;
        view.changePage(view._itemPagar.getHtml(model));
        view._itemPagar.setEvents();
    },
    gotoAddPagarReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._addPagar;
        view.changePage(view._addPagar.getHtml(model));
        view._addPagar.setEvents();
    },
    //****************** @PAGAR *******************//
    goBack: function()
    {   
        document.activeElement.blur();
        if(view._actPage==view._receber)
        {
            view._slider.slidePageFrom($(view._home.getHtml(model)), "left");
            view._home.setEvents();
            view._actPage=view._home;
            view.hideBackBtn();
            
        }
        else if(view._actPage==view._pagar)
        {
           view._slider.slidePageFrom($(view._home.getHtml(model)), "left");
           view._home.setEvents();     
           view._actPage = view._home;
           view.hideBackBtn();
        }
        else if(view._actPage==view._list)
        {
            view._slider.slidePageFrom($(view._home.getHtml(model)), "left");
            view._home.setEvents();
            view._actPage=view._home;
            view.hideBackBtn();
        }
         else if(view._actPage==view._allItem)
        {
            view._slider.slidePageFrom($(view._list.getHtml(model)), "left");
            view._list.setEvents();
            view._actPage=view._list;
            view.showSearch();
        }
        else if(view._actPage==view._itemReceber)
        {
           view._slider.slidePageFrom($(view._receber.getHtml(model)), "left");
           view._receber.setEvents();     
           view._actPage = view._receber;
           view.showSearch();
        }
        else if(view._actPage==view._addReceber)
        {
           view._slider.slidePageFrom($(view._receber.getHtml(model)), "left");
           view._receber.setEvents();     
           view._actPage = view._receber;
           view.showSearch();
        }
        else if(view._actPage==view._addPagar)
        {
           view._slider.slidePageFrom($(view._pagar.getHtml(model)), "left");
           view._pagar.setEvents();     
           view._actPage = view._pagar;
           view.showSearch();
        }
         else if(view._actPage==view._itemPagar)
        {
           view._slider.slidePageFrom($(view._pagar.getHtml(model)), "left");
           view._pagar.setEvents();     
           view._actPage = view._pagar;
           view.showSearch();
        }
        return(0);
    },
    searchDelete: function(){
        if(view._actPage==view._itemReceber)
            itemReceber.triggerDelete();
        else if(view._actPage==view._addReceber)
            alert("Nada!");
        else if(view._actPage==view._itemPagar)
            itemPagar.triggerDelete();
        else if(view._actPage==view._itemPagar)
            allItem.triggerDelete();
        else if(view._actPage==view._addPagar)
            alert("Nada!");
        else
        {
            view._receber.showPesquisa();
        }
    },
    hideBackBtn: function(){
        $('.aBack').hide(0);
        $('#topBtn').hide(0);
    },
    showBackBtn:function(){
        $('.aBack').show();
        $('#topBtn').show();
    },
    showSearch:function(){
        $('#topBtn').show();
        $('#topBtn').removeClass('aTrash');
        $('#topBtn').addClass('aSearch');
    },
    showDelete:function(){
        $('#topBtn').removeClass('aSearch');
        $('#topBtn').addClass('aTrash');
    },
    hideSearch:function(){
        $('#topBtn').hide(0);
    }
};