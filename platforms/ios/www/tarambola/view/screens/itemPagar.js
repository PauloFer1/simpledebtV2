var itemPagar = {
    _nome:"",
    _data:"",
    _valor:"",
    _descricao:"",
    _scroll:"",
    
    getHtml: function(model){
        var item = model.item;
        var liq = item.liquidada;
          var liqStr="";
          if(liq==1)
              liqStr =  translate.act_lang.liquidada;
          else
              liqStr = translate.act_lang.por_liquidar;
            var data = new Date(item.data);
                  var dataStr = data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear();
          var html='<div id="container">'+
                  '<div id="headerDown">'+
                        '<img alt="" src="img/liquidarTop.png" class="headerLiquidar"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">'+translate.act_lang.apagar+'</span>'+
                    '</div>'+
                    '<div class="listLi liFst">'+
                            '<div class="divHeadDebt1"><span class="span26White">'+ dataStr +'</span></div>'+
                            '<div class="divHeadDebt2"><span class="span26Black">'+translate.act_lang.estado+'</span><span class="span26White">'+ liqStr +'</span></div>'+                                                      
                    '</div>'+
                     '<div id="dividaContainer">'+
                    '<ul id="dividaUl">'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.nome+':</span></div>'+
                            '<div class="dividaInput"><input id="receberNomeInput" class="nameInput" type="text" name="name" value="'+item.nome+'" /></div>'+
                        '</li>'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.valor+' '+translate.currency+': </span></div>'+
                            '<div class="dividaInput"><input id="receberValorInput" class="nameInput" type="number" name="valor" value="'+ item.valor +'" /></div>'+
                            '<select id="contactList"></select>'+
                        '</li>'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.descricao+': </span></div>'+
                            '<div class="dividaInput"><input id="receberDescricaoInput" class="nameInput" type="text" name="descricao" value="'+ item.descricao +'" /></div>'+
                        '</li>'+
                        '<li class="dividaLi">'+
                                '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.abati+' '+translate.currency+': </span></div>'+
                                '<div class="dividaInput"><input id="receberAbaterInput" class="nameInput" type="number" name="abater" value="" /></div>'+
                            '</li>'+
                    '</ul>'+
                    '</div>'+
                     '<div id="footer2">'+
                    '<button id="liquidarPagar" type="button" class="aLiquidar" title="filtrar">'+translate.act_lang.liquidar+'</button>'+
                    '<button id="editarPagar" type="button" class="aEditar" title="salvar">'+translate.act_lang.salvar+'</button>'+
                '</div>'+
                '</div>';
          return(html);
    },
    setEvents: function()
    {
        //**** LAYOUT
         var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()  + $('#footer2').height()) - ($('#footer2').height()*0.01)*2 -47;
         $('#dividaUl').height(h);
         var t = $(document).height() - $('#footer').height() - ($('#footer').height()*0.01)*4 -8;
         var styles = {top : t.toString()+"px"};
         $('#footer2').css(styles);
         
         var options      = new ContactFindOptions();
         options.multiple = true;
        // options.filter = "";
         var fields       = ["displayName"];
         navigator.contacts.find(fields, itemPagar.onSuccessContacts, itemPagar.onError, options);
         //**** HANDLERS
        //$('.receberItemList').on("click", receber.gotoItem);
         $('#editarPagar').click(function(){itemPagar.triggerSubmitPagar(); return(false);});
         $('#liquidarPagar').click(function(){itemPagar.triggerLiquidar(); return(false);});
          $('#contactList').change(function(){itemPagar.chooseName(); return(false);});
          
          itemPagar._scroll = new iScroll('dividaContainer', {useTransform: false,
            onBeforeScrollStart: function (e) {
                var target = e.target;
                while (target.nodeType != 1) target = target.parentNode;

                if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                    e.preventDefault();
            }});
        
        if(model.item.liquidada==0)
              $('#liquidarPagar').css({ opacity: 1 });
          else
              $('#liquidarPagar').css({ opacity: 0.5 });
 
    },    
    removeEvents: function(){
        $('#editarPagar').unbind('click');
        $('#liquidarPagar').unbind('click');
         $('#contactList').unbind('change');
    },
    triggerSubmitPagar: function(evt){
          if($('#receberNomeInput').val()!="")
        {
            var val = $('#receberValorInput').val().replace('.', ',');
            var valAb = $('#receberAbaterInput').val().replace('.', ',');
            var reg = new RegExp(/[0-9.,]/);
            if(reg.test(val))
            {
                if(valAb!="" && reg.test(valAb))
                {
                    if(reg.test(valAb))
                    {
                        var abater = valAb;
                        var valor = val;
                        if(parseFloat(abater) <= parseFloat(valor))
                        {
                            var final = parseFloat(valor) - parseFloat(abater);
                            if(final == 0)
                            {
                                navigator.notification.confirm(translate.alert_lang.liquidar, itemPagar.triggerLiquidar, model.item.nome, [translate.confirm_lang.sim, translate.confirm_lang.nao]);
                            }   
                            else
                            {
                                var msg=translate.alert_lang.abater +$('#receberAbaterInput').val()+translate.currency+' '+translate.confirm_lang.a+' '+$('#receberValorInput').val()+translate.currency+'?';
                                navigator.notification.confirm(msg, function(index){
                                    if(index==1)
                                        {
                                            model.updatePagar(model.item.id, $('#receberNomeInput').val(), final, $('#receberDescricaoInput').val())
                                            var event = new Event('home.pagar.btn');
                                            document.dispatchEvent(event);
                                            itemPagar.removeEvents();
                                        }
                                }, model.item.nome, [translate.confirm_lang.sim, translate.confirm_lang.nao]);
                            }
                            evt.preventDefault();
                            return(false);
                        }
                        else
                        {
                           navigator.notification.alert(translate.alert_lang.valor_abater, function(){}, model.item.nome, 'ok'); 
                        }
                    }
                    else
                    {navigator.notification.alert(translate.alert_lang.valor_abater_inv, function(){}, model.item.nome, 'ok');}
                }
                else
                {
                    itemPagar.savePagar(1);
                    //navigator.notification.confirm('Salvar alterações?', itemPagar.savePagar, 'a pagar', 'sim, não');
                    evt.preventDefault();
                    return(false);
                }
            }
            else{
                navigator.notification.alert(translate.alert_lang.valor_inv, function(){}, model.item.nome, 'ok');
            }
        }
        else
            navigator.notification.alert(translate.alert_lang.nome_inv, function(){}, model.item.nome, 'ok');
    },
    savePagar: function(index){
        if(index==1)
        {
            var val = $('#receberValorInput').val().replace('.', ',');
            var valFloat = parseFloat(val);
            model.updatePagar(model.item.id, $('#receberNomeInput').val(), valFloat, $('#receberDescricaoInput').val())
            var event = new Event('home.pagar.btn');
            document.dispatchEvent(event);
            itemPagar.removeEvents();
        }
    },
    triggerLiquidar: function(evt){
    if(model.item.liquidada==0)
        navigator.notification.confirm(translate.alert_lang.liquidar, itemPagar.confirmLiquidarPagar, model.item.nome, [translate.confirm_lang.sim, translate.confirm_lang.nao]);
       /* model.liquidaPagar(model.item.id);
        $('.span26White').html('Liquidada');
        navigator.notification.alert('Dívida liquidada!', function(){
             var event = new Event('home.pagar.btn');
            document.dispatchEvent(event);
        }, 'a pagar', 'ok');*/
    },
    confirmLiquidarPagar: function(index){
       if(index==1)
       {
            model.liquidaPagar(model.item.id);
            $('.span26White').html('Liquidada');
            var event = new Event('home.pagar.btn');
            document.dispatchEvent(event);
            /*navigator.notification.alert('Dívida liquidada!', function(){
                 var event = new Event('home.pagar.btn');
                document.dispatchEvent(event);
            }, model.item.nome, 'ok');*/
       }
    },
    triggerDelete: function(evt){
        navigator.notification.confirm(translate.alert_lang.apagar, itemPagar.deletePagar, model.item.nome, [translate.confirm_lang.sim, translate.confirm_lang.nao]);
        evt.preventDefault();
        itemPagar.removeEvents();
        return(false);
    },
    deletePagar: function(index){
        if(index==1)
        {
            model.deletePagar(model.item.id)
            var event = new Event('home.pagar.btn');
            document.dispatchEvent(event);
        }
    },
    pickContact: function(evt){
        alert("contacts"); 
    },
    onSuccessContacts: function(contacts){
        var html='';
        contacts.sort(function(a, b){if(a.displayName < b.displayName) return -1; else return 1;});
        for(var i=0; i<contacts.length; i++)
        {
            if(contacts[i].displayName!="")
                html+='<option value="' + contacts[i].displayName + '">' + contacts[i].displayName + '</option>'
        }
        $('#contactList').html(html);
    },
    onError: function(contactError){
        navigator.notification.alert("Erro na Lista de Contactos!", function(){}, model.item.nome, 'ok');
    },
    chooseName: function(){
        $('#receberNomeInput').val($("#contactList option:selected").text());
    }
};


