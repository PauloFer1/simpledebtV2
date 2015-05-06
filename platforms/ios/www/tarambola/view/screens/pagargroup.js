pagargroup = {
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
        pagargroup._list=list;
        pagargroup._isPesquisa=false;
        var filtragem=translate.act_lang.liquidadas;
        if(pagargroup._estado==0)
            {
                 filtragem=translate.act_lang.todas;
            }
            else if(pagargroup._estado==2)
            {
                filtragem=translate.act_lang.liquidadas;
            }
            else if(pagargroup._estado==1)
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
                pagargroup._count=0;
                for(var i=0; i<list.length; i++)
                {
                  pagargroup._count++;
                  var liq;
                  var liqStr="head_green";
                  if(list[i].liquidada==1)
                      liqStr = "head_green";
                  else
                      liqStr = "head_green";
                  var valor = list[i].valor;
                  if(!valor)
                      valor=0;
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
           pagargroup._touchName=0;
            var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()  + $('#footer').height()) - ($('#footer').height()*0.01)*2 -47;
            $('#listagem').height(h);
            $('#totalReceber').html(pagargroup._count.toString());
            $('#options').hide();
            var t = $(document).height() - $('#footer').height() - ($('#footer').height()*0.01)*4 -7;
            var styles = {top : t.toString()+"px"};
            var styles2 = {top : (t-$('#footer').height()).toString()+"px"};
            $('#footer').css(styles);
           // $('#options').css(styles2);
            pagargroup.setOptionsAlpha();
            pagargroup._isFiltro=false;
            //***** HANDLERS
            $('#filtrarReceberBtn').click(function(){pagargroup.showOptions();}); 
            $('#addReceberBtn').click(function(){pagargroup.triggerAddPagar();}); 
            $('#closePesquisa').click(function(){pagargroup.hidePesquisa();}); 
            //$('#closePesquisa').on('tap', function(){pagargroup.hidePesquisa();}); 
            $('#pesquisaInput').keyup(function(){pagargroup.filtraLista();});
            $('#noLiquidadaReceber').click(function(){pagargroup.getNoLiquidadas();}); 
            $('#liquidadaReceber').click(function(){pagargroup.getLiquidadas();}); 
            $('#allReceber').click(function(){pagargroup.getAll();}); 
            
            $('li').on("click", pagargroup.gotoItem);
           // $('li').on("click", pagargroup.gotoHistoric);
     /*       $('.nomeLista2').on('touchstart', function(e){pagargroup._touchName=1; $(this).addClass('tappedName');});
            $('.nomeLista2').on('touchend', function(e){pagargroup._touchName=0; $(this).removeClass('tappedName');});
            $('.nomeLista2').on("click", function(e){e.preventDefault(); e.stopPropagation(); pagargroup.gotoHistoric($(this).attr('name'));}); */
            $('li').on('touchstart', function(e){if(pagargroup._touchName==0) $(this).addClass('tapped');});
            $('li').on('touchend', function(e){$(this).removeClass('tapped');});
            //******* SCROLL LISTAGEM
            pagargroup._scroll = new iScroll('listagem'); 
            $('html, body').scrollTop(0);
            pagargroup._estado = window.localStorage.getItem("estado");
            pagargroup.setOptionsAlpha();
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
         pagargroup._scroll.destroy();
         pagargroup._scroll=null;
    },
    gotoItem: function(){
        window.localStorage.setItem("item", $(this).attr('id'));
        window.localStorage.setItem("name", $(this).attr('name'));
        
        var event = new Event("model.goto.pagarname");
        document.dispatchEvent(event);
        pagargroup.removeEvents();
    },
    gotoHistoric: function(name){
        window.localStorage.setItem("name", name);
        window.localStorage.setItem("actpage", "receber");
        
        var event = new Event("historic.list.btn");
        document.dispatchEvent(event);
        pagargroup.removeEvents();
    },
    triggerAddPagar: function(){
        document.activeElement.blur();
        window.localStorage.setItem("addDirect", 1);
        var event = new Event('pagar.add.btn');
        document.dispatchEvent(event);
        pagargroup.removeEvents();
        return(0);
    },
    showOptions: function(){
        if(pagargroup._isFiltro==false)
        {                        
            //$('#options').show(200);
            $('#options').css({display:"block"});
            $('#options').animate({bottom:"118px"}, 200);
            pagargroup._isFiltro=true;
            
             pagargroup.setOptionsAlpha();
        }
        else
        {
            $('#options').animate({bottom:"0"}, 200, function(){$('#options').css({display:"none"});});
            pagargroup._isFiltro=false;
        }
        if(pagargroup._isPesquisa)
            pagargroup.hidePesquisa();
        
    },
    setOptionsAlpha: function(){
        $(".all").css({ opacity: 1 });
        $(".liquidada").css({ opacity: 1 });
        $(".noLiquidada").css({ opacity: 1 });
       if(pagargroup._estado==0)
       {
            $(".all").css({ opacity: 0.5 });
            $('#categoriaTitle').html(translate.act_lang.todas);
       }
       else if(pagargroup._estado==2)
       {
           $('#categoriaTitle').html(translate.act_lang.liquidadas);
            $(".liquidada").css({ opacity: 0.5 });
       }
       else if(pagargroup._estado==1)
       {
            $(".noLiquidada").css({ opacity: 0.5 });
            $('#categoriaTitle').html(translate.act_lang.por_liquidar);
       }
    },
    getLiquidadas: function(){
         if(pagargroup._estado!=2)
         {
             window.localStorage.setItem("estado", 2);
            model.getPagarLiquidadaGroup();
            pagargroup._estado=2;
         }
    },
    getNoLiquidadas: function(){
        if(pagargroup._estado!=1)
        {
            window.localStorage.setItem("estado", 1);
            model.getPagarNaoLiquidadaGroup();
            pagargroup._estado=1;
        }
    },
    getAll: function(){
        if(pagargroup._estado!=0)
        {
            window.localStorage.setItem("estado", 0);
            model.getPagarAllGroup();
            pagargroup._estado=0;
        }
    },
    showPesquisa: function(){
        if(pagargroup._isFiltro==true)
        {
            $('#options').animate({bottom:"0"}, 200, function(){$('#options').css({display:"none"});});
            pagargroup._isFiltro=false;
        }
        $('#pesquisa').show(200);
        pagargroup._isPesquisa=true;
    },
    hidePesquisa: function(){
        //$('#pesquisa').hide(200);        
        var styles = {display : "none"};
        $('#pesquisa').css(styles);
        pagargroup._isPesquisa=false;
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
       pagargroup._scroll.refresh();
    }
};