receber = {
    _btns: new Array(),
    _scroll: "",
    _isFiltro: false,
    _isPesquisa:false,
    _estado: 1,
    _count:0,
    _list:"",
    _touchName:0,
    _total:0,
    getHtml: function(model){
        var minus = "";
        var list = model.getListaReceber();
        var opacity = "alpha";
        receber._list=list;
        receber._isPesquisa=false;
        receber._total=0;
        var filtragem=translate.act_lang.liquidadas;
        if(receber._estado==0)
            {
                 filtragem=translate.act_lang.todas;
            }
            else if(receber._estado==2)
            {
                filtragem=translate.act_lang.liquidadas;
            }
            else if(receber._estado==1)
            {
                 filtragem=translate.act_lang.por_liquidar;
            }
        var html=' <div id="container" class="receberScreen">'+
                      '<div id="headerDown">'+
                        '<img alt="" src="img/receberTop.png" class="headerReceber"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">'+translate.act_lang.areceber+'</span>'+
                        '<span id="categoriaTitle" class="span26White floatRight margRight5 marginTop30">'+ translate.act_lang.total +':0.00€</span>'+
                    '</div>'+
                      '<div class="listLi liFst">'+
                            '<span id="listArrow"></span>'+
                            '<div class="divHead1"><img class="headThImg" src="img/head.png" title=""/>'+
                            '</div>'+
                            '<div class="divHead2">'+ window.localStorage.getItem("name") +'</div>'+
                         //   '<div class="divHead3">'+translate.act_lang.data+'</div>'+
                 //          '<div class="divHead4 right" id="totalDebtReceber">Total:0€</div>'+
                    '</div>'+
                    '<div id="pesquisa">'+
                        '<input type="text" id="pesquisaInput" value=""/>'+
                        '<span id="lupa"></span>'+
                        '<button id="closePesquisa"></button>'+
                    '</div>'+
                    '<div id ="listagem">'+
                    '<ul id="listUl">';
                receber._count=0;
                for(var i=0; i<list.length; i++)
                {
                    
                    try{
                        var valor = list[i].valor.replace(',','.');
                    }
                    catch(err){
                        var valor = list[i].valor;
                    }
                    valor = parseFloat(valor);
                    if(!valor)
                      valor=0;
                  
                    if(list[i].liquidada==0 && list[i].tabela==1)
                    {
                        receber._total+=valor;
                        opacity="";
                    }
                    else if(list[i].liquidada==0 && list[i].tabela==0)
                    {
                        receber._total-=valor;
                        opacity="alpha";
                    }
                  receber._count++;
                  var liq;
                  var liqStr="";
                  var disable="";
                  
                  if(list[i].tabela==0)
                  {
                      minus="-";
                      liqStr ="headOut";
                      disable="1";
                  }
                  else
                  {
                      disable="";
                      minus="";
                      liqStr ="headIn";
                  }
                 
                  var data = new Date(list[i].data);
                  var dataStr = data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear();
                  html+='<li id="' + list[i].id + '" name="'+list[i].nome+'" disable="'+disable+'" class="listLi liNext '+opacity+'"> <div class="divBody1"><img class="headThImg" src="img/'+liqStr+'.png" title=""/></div>'+
                            //'<div id="nomeLista1" class="divBody2"><span class="nomeLista2 span26Blue" name="'+list[i].nome+'" >'+ list[i].nome +' </span></div>'+
                            '<div class="per50"><span class="span26Blue descricaoLabel noOverflow">'+list[i].descricao+'</span><span class="span15Grey dateList left fullWidth">'+dataStr+'</span></div>'+
                            '<div class="divBody4"><span class="span26BlueRight">'+minus+ valor.toFixed(2).replace('.', ',') + translate.currency +'</span></div>'+
                         '</li>';
                }
                html+='</ul"></div>'+
                         ' <div id="options" style="display:none">'+
                                '<button id="noLiquidadaReceber" class="noLiquidada">'+translate.act_lang.por_liquidar+'</button>'+
                                '<button id="liquidadaReceber" class="liquidada">'+translate.act_lang.liquidadas+'</button>'+
                                '<button id="allReceber" class="all">'+translate.act_lang.todas+'</button>'+
                             '</div>'+
                        ' <div id="footer">'+
                            '<button id="filtrarReceberBtn" type="button" class="aFiltrarListagem" title="filtrar">'+translate.act_lang.filtrar+'</button>'+
                            '<button id="addReceberBtn" type="button" class="aAdicionarListagem" title="adicionar">'+translate.act_lang.adicionar+'</button>'+
                        '</div>'+
                    '</div>';
        return(html);
    },
    setEvents: function()
    {
        $('html, body').scrollTop(0);
        setTimeout(function(){
           //****** LAYOUT    
           receber._touchName=0;
         //  $('#totalDebtReceber').html(translate.act_lang.total+": "+receber._total.toFixed(2).replace('.', ',')+translate.currency);
            var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()  + $('#footer').height()) - ($('#footer').height()*0.01)*2 -47;
            $('#listagem').height(h);
      //      $('#totalReceber').html(receber._count.toString());
            $('#options').hide();
            var t = $(document).height() - $('#footer').height() - ($('#footer').height()*0.01)*4 -7;
            var styles = {top : t.toString()+"px"};
            var styles2 = {top : (t-$('#footer').height()).toString()+"px"};
            $('#footer').css(styles);
           // $('#options').css(styles2);
            receber.setOptionsAlpha();
            receber._isFiltro=false;
            //***** HANDLERS
            $('#filtrarReceberBtn').click(function(){receber.showOptions();}); 
            $('#addReceberBtn').click(function(){receber.triggerAddReceber();}); 
            $('#closePesquisa').click(function(){receber.hidePesquisa();}); 
            //$('#closePesquisa').on('tap', function(){receber.hidePesquisa();}); 
            $('#pesquisaInput').keyup(function(){receber.filtraLista();});
            $('#noLiquidadaReceber').click(function(){receber.getNoLiquidadas();}); 
            $('#liquidadaReceber').click(function(){receber.getLiquidadas();}); 
            $('#allReceber').click(function(){receber.getAll();}); 
            
            $('li').on("click", receber.gotoItem);
           // $('li').on("click", receber.gotoHistoric);
       /*     $('.nomeLista2').on('touchstart', function(e){receber._touchName=1; $(this).addClass('tappedName');});
            $('.nomeLista2').on('touchend', function(e){receber._touchName=0; $(this).removeClass('tappedName');});
            $('.nomeLista2').on("click", function(e){e.preventDefault(); e.stopPropagation(); receber.gotoHistoric($(this).attr('name'));}); */
            $('li').on('touchstart', function(e){if($(this).attr('disable')!="1"){if(receber._touchName==0) $(this).addClass('tapped');}});
            $('li').on('touchend', function(e){if($(this).attr('disable')!="1"){$(this).removeClass('tapped');}});
            //******* SCROLL LISTAGEM
            receber._scroll = new iScroll('listagem'); 
            $('html, body').scrollTop(0);
            receber._estado = window.localStorage.getItem("estado");
            receber.setOptionsAlpha();
        }, 300);
    },
    removeEvents: function(){
         $('.aFiltrarListagem').unbind('click');
         $('.aAdicionarListagem').unbind('click');
         $('#closePesquisa').unbind('click');
         //$('#closePesquisa').unbind('tap');
         $('#noLiquidadaReceber').unbind('click');
         $('#liquidadaReceber').unbind('click');
         $('#allReceber').unbind('click');
         $('#pesquisaInput').unbind('keyup');
         $('li').unbind('click');
         $('li').unbind('touchstart');
         $('li').unbind('touchsend');
         receber._scroll.destroy();
         receber._scroll=null;
    },
    gotoItem: function(){
        if($(this).attr('disable')!="1")
        {
            window.localStorage.setItem("item", $(this).attr('id'));
        
            receber.removeEvents();
            var event = new Event("model.goto.item");
            document.dispatchEvent(event);
        }
    },
    gotoHistoric: function(name){
        window.localStorage.setItem("name", name);
        window.localStorage.setItem("actpage", "receber");
        
        var event = new Event("historic.list.btn");
        document.dispatchEvent(event);
        receber.removeEvents();
    },
    triggerAddReceber: function(){
        document.activeElement.blur();
        window.localStorage.setItem("addDirect", 0);
        var event = new Event('receber.addName.btn');
        document.dispatchEvent(event);
        receber.removeEvents();
        return(0);
    },
    showOptions: function(){
        if(receber._isFiltro==false)
        {                        
            //$('#options').show(200);
            $('#options').css({display:"block"});
            $('#options').animate({bottom:"118px"}, 200);
            receber._isFiltro=true;
            
             receber.setOptionsAlpha();
        }
        else
        {
            $('#options').animate({bottom:"0"}, 200, function(){$('#options').css({display:"none"});});
            receber._isFiltro=false;
        }
        if(receber._isPesquisa)
            receber.hidePesquisa();
        
    },
    setOptionsAlpha: function(){
        $(".all").css({ opacity: 1 });
        $(".liquidada").css({ opacity: 1 });
        $(".noLiquidada").css({ opacity: 1 });
       if(receber._estado==0)
       {
            $(".all").css({ opacity: 0.5 });
            $('#categoriaTitle').html(translate.act_lang.total+": "+receber._total.toFixed(2).replace('.', ',')+translate.currency);
       }
       else if(receber._estado==2)
       {
           $('#categoriaTitle').html(translate.act_lang.total+": "+receber._total.toFixed(2).replace('.', ',')+translate.currency);
            $(".liquidada").css({ opacity: 0.5 });
       }
       else if(receber._estado==1)
       {
            $(".noLiquidada").css({ opacity: 0.5 });
            $('#categoriaTitle').html(translate.act_lang.total+": "+receber._total.toFixed(2).replace('.', ',')+translate.currency);
       }
    },
    getLiquidadas: function(){
         if(receber._estado!=2)
         {
            window.localStorage.setItem("estado", 2);
            model.getReceberLiquidadasName();
            receber._estado=2;
         }
    },
    getNoLiquidadas: function(){
        if(receber._estado!=1)
        {
            window.localStorage.setItem("estado", 1);
            model.getReceberNaoLiquidadasName();
            receber._estado=1;
        }
    },
    getAll: function(){
        if(receber._estado!=0)
        {
            window.localStorage.setItem("estado", 0);
            model.getNameReceberQuery();
            receber._estado=0;
        }
    },
    showPesquisa: function(){
        if(receber._isFiltro==true)
        {
            $('#options').animate({bottom:"0"}, 200, function(){$('#options').css({display:"none"});});
            receber._isFiltro=false;
        }
        $('#pesquisa').show(200);
        receber._isPesquisa=true;
    },
    hidePesquisa: function(){
        //$('#pesquisa').hide(200);        
        var styles = {display : "none"};
        $('#pesquisa').css(styles);
        receber._isPesquisa=false;
    },
    filtraLista: function(){
        var list = $('.liNext');
        var styles = {display : "none"};
        var styles2 = {display : "block"};
        
         var pesq = $('#pesquisaInput').val().toString().toLowerCase();
                
        list.each(function()
        {
            if(pesq!="")
            {
                reg=null;
                var reg = new RegExp(pesq);
                var result = 0;
                var find = $(this).find('#nomeLista2').html().toString().toLowerCase();
                //alert($(this).find('#nomeLista1').find('#nomeLista2').html());
                //result = find.indexOf(pesq);
                result=reg.test(find);
                //alert(result);
                if(!result)
                    $(this).css(styles);
                else
                    $(this).css(styles2);
            }
            else
                $(this).css(styles2);
        });
       receber._scroll.refresh();
    }
};