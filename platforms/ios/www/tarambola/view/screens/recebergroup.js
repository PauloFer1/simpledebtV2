recebergroup = {
    _btns: new Array(),
    _scroll: "",
    _isFiltro: false,
    _isPesquisa:false,
    _estado: 1,
    _count:0,
    _list:"",
    _touchName:0,
    getHtml: function(model){
        var list = model.getListaReceber();
        recebergroup._list=list;
        recebergroup._isPesquisa=false;
        var filtragem=translate.act_lang.liquidadas;
        if(recebergroup._estado==0)
            {
                 filtragem=translate.act_lang.todas;
            }
            else if(recebergroup._estado==2)
            {
                filtragem=translate.act_lang.liquidadas;
            }
            else if(recebergroup._estado==1)
            {
                 filtragem=translate.act_lang.por_liquidar;
            }
        var html=' <div id="container" class="receberScreen">'+
                      '<div id="headerDown">'+
                        '<img alt="" src="img/receberTop.png" class="headerReceber"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">'+translate.act_lang.areceber+'</span>'+
                        '<span id="totalReceber" class="span26White margRight40 floatRight marginTop30">12</span><span id="categoriaTitle" class="span26White floatRight margRight5 marginTop30">'+ filtragem +':</span>'+
                    '</div>'+
                      '<div class="listLi liFst">'+
                            '<span id="listArrow"></span>'+
                            '<div class="divHead1"><img class="headThImg" src="img/head.png" title=""/>'+
                            '</div>'+
                            '<div class="divHead2">'+translate.act_lang.nome+'</div>'+
                            '<div class="divHead4 right">'+translate.act_lang.valor+'</div>'+
                    '</div>'+
                    '<div id="pesquisa">'+
                        '<input type="text" id="pesquisaInput" value=""/>'+
                        '<span id="lupa"></span>'+
                        '<button id="closePesquisa"></button>'+
                    '</div>'+
                    '<div id ="listagem">'+
                    '<ul id="listUl">';
                recebergroup._count=0;
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
                  
                  recebergroup._count++;
                  var liq;
                  var liqStr="head_green";
                  if(list[i].liquidada==1)
                      liqStr = "head_green";
                  else
                      liqStr = "head_green";
                
                  var data = new Date(list[i].data);
                  var dataStr = data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear();
                  html+='<li id="' + list[i].id + '" name="'+list[i].nome+'" class="listLi liNext"> <div class="divBody1"><img class="headThImg" src="img/'+liqStr+'.png" title=""/></div>'+
                            '<div id="nomeLista1" class="divBody2"><span class="nomeLista2 span26Blue" name="'+list[i].nome+'" >'+ list[i].nome +' </span></div>'+
                            '<div class="divBody4"><span class="span26BlueRight">'+ valor.toFixed(2).replace('.', ',') + translate.currency +'</span></div>'+
                         '</li>';
                }
                html+='</ul">'+
                        '</div>'+
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
           recebergroup._touchName=0;
            var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()  + $('#footer').height()) - ($('#footer').height()*0.01)*2 -47;
            $('#listagem').height(h);
            $('#totalReceber').html(recebergroup._count.toString());
            $('#options').hide();
            var t = $(document).height() - $('#footer').height() - ($('#footer').height()*0.01)*4 -7;
            var styles = {top : t.toString()+"px"};
            var styles2 = {top : (t-$('#footer').height()).toString()+"px"};
            $('#footer').css(styles);
           // $('#options').css(styles2);
            recebergroup.setOptionsAlpha();
            recebergroup._isFiltro=false;
            //***** HANDLERS
            $('#filtrarReceberBtn').click(function(){recebergroup.showOptions();}); 
            $('#addReceberBtn').click(function(){recebergroup.triggerAddReceber();}); 
            $('#closePesquisa').click(function(){recebergroup.hidePesquisa();}); 
            //$('#closePesquisa').on('tap', function(){recebergroup.hidePesquisa();}); 
            $('#pesquisaInput').keyup(function(){recebergroup.filtraLista();});
            $('#noLiquidadaReceber').click(function(){recebergroup.getNoLiquidadas();}); 
            $('#liquidadaReceber').click(function(){recebergroup.getLiquidadas();}); 
            $('#allReceber').click(function(){recebergroup.getAll();}); 
            
            $('li').on("click", recebergroup.gotoItem);
           // $('li').on("click", recebergroup.gotoHistoric);
     /*       $('.nomeLista2').on('touchstart', function(e){recebergroup._touchName=1; $(this).addClass('tappedName');});
            $('.nomeLista2').on('touchend', function(e){recebergroup._touchName=0; $(this).removeClass('tappedName');});
            $('.nomeLista2').on("click", function(e){e.preventDefault(); e.stopPropagation(); recebergroup.gotoHistoric($(this).attr('name'));}); */
            $('li').on('touchstart', function(e){if(recebergroup._touchName==0) $(this).addClass('tapped');});
            $('li').on('touchend', function(e){$(this).removeClass('tapped');});
            //******* SCROLL LISTAGEM
            recebergroup._scroll = new iScroll('listagem'); 
            $('html, body').scrollTop(0);
            recebergroup._estado = window.localStorage.getItem("estado");
            recebergroup.setOptionsAlpha();
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
         recebergroup._scroll.destroy();
         recebergroup._scroll=null;
    },
    gotoItem: function(){
        window.localStorage.setItem("item", $(this).attr('id'));
        window.localStorage.setItem("name", $(this).attr('name'));
        
        recebergroup.removeEvents();
        var event = new Event("model.goto.name");
        document.dispatchEvent(event);
        
    },
    gotoHistoric: function(name){
        window.localStorage.setItem("name", name);
        window.localStorage.setItem("actpage", "receber");
        
        var event = new Event("historic.list.btn");
        document.dispatchEvent(event);
        recebergroup.removeEvents();
    },
    triggerAddReceber: function(){
        document.activeElement.blur();
        window.localStorage.setItem("addDirect", 1);
        var event = new Event('receber.add.btn');
        document.dispatchEvent(event);
        recebergroup.removeEvents();
        return(0);
    },
    showOptions: function(){
        if(recebergroup._isFiltro==false)
        {                        
            //$('#options').show(200);
            $('#options').css({display:"block"});
            $('#options').animate({bottom:"118px"}, 200);
            recebergroup._isFiltro=true;
            
             recebergroup.setOptionsAlpha();
        }
        else
        {
            $('#options').animate({bottom:"0"}, 200, function(){$('#options').css({display:"none"});});
            recebergroup._isFiltro=false;
        }
        if(recebergroup._isPesquisa)
            recebergroup.hidePesquisa();
        
    },
    setOptionsAlpha: function(){
        $(".all").css({ opacity: 1 });
        $(".liquidada").css({ opacity: 1 });
        $(".noLiquidada").css({ opacity: 1 });
       if(recebergroup._estado==0)
       {
            $(".all").css({ opacity: 0.5 });
            $('#categoriaTitle').html(translate.act_lang.todas);
       }
       else if(recebergroup._estado==2)
       {
           $('#categoriaTitle').html(translate.act_lang.liquidadas);
            $(".liquidada").css({ opacity: 0.5 });
       }
       else if(recebergroup._estado==1)
       {
            $(".noLiquidada").css({ opacity: 0.5 });
            $('#categoriaTitle').html(translate.act_lang.por_liquidar);
       }
    },
    getLiquidadas: function(){
         if(recebergroup._estado!=2)
         {
            window.localStorage.setItem("estado", 2);
            model.getReceberLiquidadasGroup();
            recebergroup._estado=2;
         }
    },
    getNoLiquidadas: function(){
        if(recebergroup._estado!=1)
        {
            window.localStorage.setItem("estado", 1);
            model.getReceberNaoLiquidadasGroup();
            recebergroup._estado=1;
        }
    },
    getAll: function(){
        if(recebergroup._estado!=0)
        {
            window.localStorage.setItem("estado", 0);
            model.getReceberAllGroup();
            recebergroup._estado=0;
        }
    },
    showPesquisa: function(){
        if(recebergroup._isFiltro==true)
        {
            $('#options').animate({bottom:"0"}, 200, function(){$('#options').css({display:"none"});});
            recebergroup._isFiltro=false;
        }
        $('#pesquisa').show(200);
        recebergroup._isPesquisa=true;
    },
    hidePesquisa: function(){
        //$('#pesquisa').hide(200);        
        var styles = {display : "none"};
        $('#pesquisa').css(styles);
        recebergroup._isPesquisa=false;
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
       recebergroup._scroll.refresh();
    }
};