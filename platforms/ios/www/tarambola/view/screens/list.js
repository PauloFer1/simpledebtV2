list = {
    _scroll: "",
    _isFiltro: false,
    _estado: 1,
    _count:0,
    _list:"",
    getHtml: function(model){
        var lista = model.getListaReceber();
        list._list=lista;
        list._list.sort(function(a,b){
            d1=new Date(a.data);
            d2=new Date(b.data);
             return d1<d2?-1:d1>d2?1:0;
        });
        var filtragem=translate.act_lang.por_liquidar;
        var html=' <div id="container" class="receberScreen">'+
                      '<div id="headerDown">'+
                        '<img alt="" src="img/inoutTop.png" class="headerReceber"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">'+translate.act_lang.todas+'</span>'+
                        '<span id="totalReceber" class="span26White margRight40 floatRight marginTop30">12</span><span id="categoriaTitle" class="span26White floatRight margRight5 marginTop30">'+ filtragem +':</span>'+
                    '</div>'+
                      '<div class="listLi liFst">'+
                            '<span id="listArrow"></span>'+
                            '<div class="divHead1"><img class="headThImg" src="img/head.png" title=""/>'+
                            '</div>'+
                            '<div class="divHead2">'+translate.act_lang.nome+'</div>'+
                            '<div class="divHead3">'+translate.act_lang.data+'</div>'+
                            '<div class="divHead4">'+translate.act_lang.valor+'</div>'+
                    '</div>'+
                    '<div id="pesquisa">'+
                        '<input type="text" id="pesquisaInput" value=""/>'+
                        '<span id="lupa"></span>'+
                        '<button id="closePesquisa"></button>'+
                    '</div>'+
                    '<div id ="listagem">'+
                    '<ul id="listUl">';
                list._count=0;
                var tabela;
                for(var i=0; i<lista.length; i++)
                {
                  list._count++;
                  var liq;
                  var liqStr="";
                  if(lista[i].tabela=="receber")
                      liqStr = "headIn";
                  else
                      liqStr = "headOut";
                  var data = new Date(lista[i].data);
                  var dataStr = data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear();
                  html+='<li id="' + lista[i].id + '" tabela="'+ lista[i].tabela +'" class="listLi liNext"> <div class="divBody1"><img class="headThImg" src="img/'+liqStr+'.png" title=""/></div>'+
                            '<div id="nomeLista1" class="divBody2"><span id="nomeLista2" class="span26Blue font20">'+ lista[i].nome +' </span></div>'+
                            '<div class="divBody3"><span class="span26Blue font20">'+ dataStr +'</span></div>'+
                            '<div class="divBody4"><span class="span26BlueRight font20">'+ lista[i].valor.toFixed(2).replace('.', ',') + translate.currency+'</span></div>'+
                         '</li>';
                }
                html+='</ul"></div>'+
                    '</div>';
        return(html);
    },
    setEvents: function()
    {
        setTimeout(function(){
           //****** LAYOUT           
            var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()) - $('.liFst').height()*0.6;
            $('#listagem').height(h);
            $('#totalReceber').html(list._count.toString());
            //***** HANDLERS
            $('#pesquisaInput').keyup(function(){list.filtraLista();});
            $('#closePesquisa').click(function(){receber.hidePesquisa();}); 
            //$('#closePesquisa').on('tap', function(){receber.hidePesquisa();}); 
            
            $('li').on("click", list.gotoItem);
            $('li').on('touchstart', function(e){$(this).addClass('tapped');});
            $('li').on('touchend', function(e){$(this).removeClass('tapped');});
            //******* SCROLL LISTAGEM
            list._scroll = new iScroll('listagem'); 
        }, 300);
    },
    removeEvents: function(){
         $('#closePesquisa').unbind('click');
         //$('#closePesquisa').unbind('tap');
         $('#pesquisaInput').unbind('keyup');
         $('li').unbind('click');
         $('li').unbind('touchstart');
         $('li').unbind('touchsend');
         list._scroll.destroy();
         list._scroll=null;
    },
    gotoItem: function(){
        window.localStorage.setItem("item", $(this).attr('id'));
        window.localStorage.setItem("tabela", $(this).attr('tabela'));
        var event = new Event("model.all.goto.item");
        document.dispatchEvent(event);
        list.removeEvents();
    },
    triggerAddReceber: function(){
        var event = new Event('receber.add.btn');
        document.dispatchEvent(event);
        list.removeEvents();
        return(0);
    },
    showPesquisa: function(){
        if(list._isFiltro==true)
        {
            $('#options').animate({bottom:"0"}, 200, function(){$('#options').css({display:"none"});});
            list._isFiltro=false;
        }
        $('#pesquisa').show(200);
    },
    hidePesquisa: function(){
        //$('#pesquisa').hide(200);        
        var styles = {display : "none"};
        $('#pesquisa').css(styles);
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
       list._scroll.refresh();
    }
};