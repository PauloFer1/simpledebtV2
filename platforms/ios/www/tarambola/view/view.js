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
    _recebergroup: recebergroup,
    _pagargroup: pagargroup,
    _pagar: pagar,
    _itemReceber: itemReceber,
    _itemPagar: itemPagar,
    _addReceber: insertReceber,
    _addPagar: insertPagar,
    _contactList: contactList,
    _historicList: historicList,
    _historicItem: historicItem,
    
    initialize: function(model, controller){

        this._model = model;
        this._controller = controller; 
        
        model.checkTable();
        
        //********* EVENTS ***********
        //document.addEventListener("model.ready", this.gotoHome, false);
        document.addEventListener("home.receber.btn", this.gotoReceberGroup, false);
        document.addEventListener("home.pagar.btn", this.gotoPagarGroup, false);
        document.addEventListener("home.list.btn", this.gotoListAll, false);
        document.addEventListener("historic.list.btn", this.gotoHistoricList, false);
        document.addEventListener("model.historic.ready", this.gotoHistoricListReady, false);
        document.addEventListener("model.receber.ready", view.gotoReceberReady, false);
        document.addEventListener("model.recebergroup.ready", view.gotoReceberReadyGroup, false);
        document.addEventListener("model.pagargroup.ready", view.gotoPagarReadyGroup, false);
        document.addEventListener("model.pagar.ready", view.gotoPagarReady, false);
        document.addEventListener("model.list.ready", view.gotoListAllReady, false);
        document.addEventListener("model.goto.item", view.gotoReceberItem, false);
        document.addEventListener("model.goto.name", view.gotoReceberName, false);
        document.addEventListener("model.goto.pagarname", view.gotoPagarName, false);
        document.addEventListener("model.all.goto.item", view.gotoAllItem, false);
        document.addEventListener("model.pagar.goto.item", view.gotoPagarItem, false);
        document.addEventListener("model.receberitem.ready", view.gotoReceberItemReady, false);
        document.addEventListener("model.recebername.ready", view.gotoReceberNameReady, false);
        document.addEventListener("model.pagarname.ready", view.gotoPagarNameReady, false);
        document.addEventListener("model.pagaritem.ready", view.gotoPagarItemReady, false);
        document.addEventListener("model.allitem.ready", view.gotoAllItemReady, false);
        document.addEventListener("receber.add.btn", view.gotoAddReceberReady, false);
        document.addEventListener("receber.addName.btn", view.gotoAddReceberNameReady, false);
        document.addEventListener("pagar.addName.btn", view.gotoAddPagarNameReady, false);
        document.addEventListener("pagar.add.btn", view.gotoAddPagarReady, false);
        document.addEventListener("receber.contact.list", view.gotoContactListReady, false);
        document.addEventListener("pagar.contact.list", view.gotoContactListReady, false);
        document.addEventListener("receber.contact.choose", view.gotoBackContact, false);
        document.addEventListener("pagar.contact.choose", view.gotoBackContact, false);
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
        if(window.localStorage.getItem("direction")=="left")
        {
            this._slider.slidePageFrom($(screen), 'left');
            window.localStorage.setItem("direction", "right");
        }
        else
            this._slider.slidePageFrom($(screen), 'right');
       if(screen!=view._home)
           view.showBackBtn();
       else
           view.hideBackBtn();
       
       if(view._actPage == view._itemReceber || view._actPage == view._itemPagar || view._actPage == view._allItem)
           view.showDelete();
       else if(view._actPage == view._addPagar || view._actPage == view._addReceber || view._actPage == view._contactList)
           view.hideSearch();
       else
           view.showSearch();
     //  $('body').css({top: "0px"});
       
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
        window.localStorage.setItem("direction", "right");
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
        window.localStorage.setItem("direction", "right");
        model.prepareModelItemAll();
    },       
    gotoAllItemReady: function(){
        view._previousPage = view._actPage;
        view._actPage = view._allItem;
        view.changePage(view._allItem.getHtml(model));
        view._allItem.setEvents();
    },
    //****************** HistoricLIST *******************//
    gotoHistoricList: function()
    {
        window.localStorage.setItem("direction", "right");
        model.getHistoricReceberByUser(window.localStorage.getItem("name"));
    },
    gotoHistoricListReady: function()
    {
        view._previousPage = view._actPage;
        view._actPage = view._historicList;
        view.changePage(view._historicList.getHtml(model));
        view._historicList.setEvents();
    },
    gotoHistoricItem: function(){
        window.localStorage.setItem("direction", "right");
        model.prepareModelItemAll();
    },       
    gotoHistoricItemReady: function(){
        view._previousPage = view._actPage;
        view._actPage = view._allItem;
        view.changePage(view._allItem.getHtml(model));
        view._allItem   .setEvents();
    },
    //****************** @HistoricLIST *******************//
    //****************** RECEBER *******************//
    gotoReceber: function(direction)
    {
        window.localStorage.setItem("direction", direction);
        model.getReceberNaoLiquidadas();
    },
    gotoReceberGroup: function(dir)
    {
        var direction ="right";
        if(dir=="left")
            direction="left";
        //model.getReceberNaoLiquidadasGroup();
        window.localStorage.setItem("direction", direction);
        var estado = window.localStorage.getItem("estado");
        if(estado==1)
            model.getReceberNaoLiquidadasGroup();
        else if(estado==2)
            model.getReceberLiquidadasGroup();
        else if(estado==0)
            model.getReceberAllGroup();
    },
    gotoReceberReady: function()
    {
        view._previousPage = view._actPage;
        view._actPage = view._receber;
        view.changePage(receber.getHtml(model));
        receber.setEvents();
    },
    gotoReceberReadyGroup: function()
    {
        view._previousPage = view._actPage;
        view._actPage = view._recebergroup;
        view.changePage(recebergroup.getHtml(model));
        recebergroup.setEvents();
    },
    gotoReceberItem: function(){
        window.localStorage.setItem("direction", "right");
        model.prepareModelItemReceber();
    },
    gotoReceberName: function(){
        window.localStorage.setItem("direction", "right");
       // model.prepareModelNameReceber();
       var estado = window.localStorage.getItem("estado");
       if(estado==1)
            model.getReceberNaoLiquidadasName();
       else if(estado==2)
           model.getReceberLiquidadasName();
       else if(estado==0)
           model.getNameReceberQuery();
    },
    gotoReceberItemReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._itemReceber;
        view.changePage(view._itemReceber.getHtml(model));
        view._itemReceber.setEvents();
    },
     gotoReceberNameReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._receber;
        view.changePage(view._receber.getHtml(model));
        view._receber.setEvents();
    },
    gotoAddReceberReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._addReceber;
        view._addReceber._hasName=false;
        view.changePage(view._addReceber.getHtml(model));
        view._addReceber.setEvents();
        view._addReceber.cleanStorage();
    },
    gotoAddReceberNameReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._addReceber;
        view._addReceber._hasName=true;
        view.changePage(view._addReceber.getHtml(model));
        view._addReceber.setEvents();
        view._addReceber.cleanStorage();
    },
    //******CONTACT LIST *******//
    gotoContactListReady: function(){
      view._previousPage = this._actPage;
      view._actPage = view._contactList;
      view.changePage(view._contactList.getHtml(model));
      view._contactList.setEvents();
    },
    gotoBackContact: function(){
      view._previousPage = this._actPage;
      if(window.localStorage.getItem("actpage")=="addreceber")
        view._actPage = view._addReceber;
      else if(window.localStorage.getItem("actpage")=="itemreceber")
        view._actPage = view._itemReceber;
      else if(window.localStorage.getItem("actpage")=="addpagar")
          view._actPage = view._addPagar;
      else if(window.localStorage.getItem("actpage")=="itempagar")
          view._actPage = view._itemPagar;
      view.changePage(view._actPage.getHtml(model));
      view._actPage.setStorage();
      view._actPage.setEvents();
    },
    //****************** @RECEBER *******************//
    //****************** PAGAR *******************//
    gotoPagarReadyGroup: function()
    {
        view._previousPage = view._actPage;
        view._actPage = view._pagargroup;
        view.changePage(pagargroup.getHtml(model));
        pagargroup.setEvents();
    },
     gotoPagarGroup: function(dir)
    {
        var direction ="right";
        if(dir=="left")
            direction="left";
        //model.getReceberNaoLiquidadasGroup();
        window.localStorage.setItem("direction", direction);
        model.getPagarNaoLiquidadaGroup();
    },
    gotoPagarName: function(){
        window.localStorage.setItem("direction", "right");
       // model.prepareModelNameReceber();
       model.getPagarNaoLiquidadasName();
    },
    gotoPagar: function()
    {
        window.localStorage.setItem("direction", "right");
        model.getPagarNaoLiquidadas();
    },
    gotoPagarReady: function()
    {
        view._previousPage = view._actPage;
        view._actPage = view._pagar;
        view.changePage(pagar.getHtml(model));
        pagar.setEvents();
    },
     gotoAddPagarNameReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._addPagar;
        view._addPagar._hasName=true;
        view.changePage(view._addPagar.getHtml(model));
        view._addPagar.setEvents();
        view._addPagar.cleanStorage();
    },
    gotoPagarItem: function(){
        window.localStorage.setItem("direction", "right");
        model.prepareModelItemPagar();
    },
     gotoPagarNameReady: function(){
        view._previousPage = this._actPage;
        view._actPage = view._pagar;
        view.changePage(view._pagar.getHtml(model));
        view._pagar.setEvents();
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
        view._addPagar._hasName=false;
        view.changePage(view._addPagar.getHtml(model));
        view._addPagar.setEvents();
        view._addPagar.cleanStorage();
    },
    //****************** @PAGAR *******************//
    goBack: function()
    {   
        document.activeElement.blur();
    //    view._actPage.removeEvents();
        if(view._actPage==view._receber)
        {
            view.gotoReceberGroup("left");
         /*  view._slider.slidePageFrom($(view._recebergroup.getHtml(model)), "left");
            view._recebergroup.setEvents();
            view._actPage=view._recebergroup;*/
         //   view.hideBackBtn();
            
        }
        else if(view._actPage==view._recebergroup)
        {
            view._slider.slidePageFrom($(view._home.getHtml(model)), "left");
            view._home.setEvents();
            view._actPage=view._home;
            view.hideBackBtn();
            
        }
         else if(view._actPage==view._pagargroup)
        {
            view._slider.slidePageFrom($(view._home.getHtml(model)), "left");
            view._home.setEvents();
            view._actPage=view._home;
            view.hideBackBtn();
            
        }
        else if(view._actPage==view._pagar)
        {
        /*   view._slider.slidePageFrom($(view._home.getHtml(model)), "left");
           view._home.setEvents();     
           view._actPage = view._home;
           view.hideBackBtn();*/
            view.gotoPagarGroup("left");
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
            if(window.localStorage.getItem("addDirect")==1)
            {
                view._slider.slidePageFrom($(view._recebergroup.getHtml(model)), "left");
                view._recebergroup.setEvents();     
                view._actPage = view._recebergroup;
            }
            else
            {
                view._slider.slidePageFrom($(view._receber.getHtml(model)), "left");
                view._receber.setEvents();     
                view._actPage = view._receber;
            }
          
           view.showSearch();
        }
        else if(view._actPage==view._addPagar)
        {
           if(window.localStorage.getItem("addDirect")==1)
           {
                view._slider.slidePageFrom($(view._pagargroup.getHtml(model)), "left");
                view._pagargroup.setEvents();     
                view._actPage = view._pagargroup;
                view.showSearch();
            }   
            else{
                view._slider.slidePageFrom($(view._pagar.getHtml(model)), "left");
                view._pagar.setEvents();     
                view._actPage = view._pagar;
                view.showSearch();
            }
        }
         else if(view._actPage==view._itemPagar)
        {
           view._slider.slidePageFrom($(view._pagar.getHtml(model)), "left");
           view._pagar.setEvents();     
           view._actPage = view._pagar;
           view.showSearch();
        }
        else if(view._actPage==view._historicList)
        {
            window.localStorage.setItem("direction", "left");
           if(window.localStorage.getItem("actpage")=="receber")
                view.gotoReceber("right");
            else if(window.localStorage.getItem("actpage")=="pagar")
                view.gotoPagar();
           view.showSearch();
        }
        else if(view._actPage == view._contactList)
        {
            if(window.localStorage.getItem("actpage")=="addreceber")
            {
                view._slider.slidePageFrom($(view._addReceber.getHtml(model)), "left");
                view._actPage = view._addReceber;
            }
            else if(window.localStorage.getItem("actpage")=="itemreceber")
            {
                view._slider.slidePageFrom($(view._itemReceber.getHtml(model)), "left");
                view._actPage = view._itemReceber;
            }
            else if(window.localStorage.getItem("actpage")=="addpagar")
            {
                view._slider.slidePageFrom($(view._addPagar.getHtml(model)), "left");
                view._actPage = view._addPagar;
            }
            else if(window.localStorage.getItem("actpage")=="itempagar")
            {
                view._slider.slidePageFrom($(view._itemPagar.getHtml(model)), "left");
                view._actPage = view._itemPagar;
            }
            view._actPage.setEvents();
            view._actPage.setStorage();
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