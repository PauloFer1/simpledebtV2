var itemReceber = {
    _nome:"",
    _data:"",
    _valor:"",
    _descricao:"",
    _scroll: "",
    
    getHtml: function(model){
        var item = model.item;
        var listDisc = model.results2;
        var liq = item.liquidada;
          var liqStr="";
          var read="";
          if(liq==1)
          {
              liqStr = translate.act_lang.liquidadas;
              read="readonly";
          }
          else
              liqStr = translate.act_lang.por_liquidar;
            var data = new Date(item.data);
                  var dataStr = data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear();
          var html='<div id="container">'+
                  '<div id="headerDown">'+
                        '<img alt="" src="img/receberTop.png" class="headerLiquidar"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">'+translate.act_lang.areceber+'</span>'+
                    '</div>'+
                    '<div class="listLi liFst">'+
                            '<div class="divHeadDebt1"><span class="span26White">'+ dataStr +'</span></div>'+
                            '<div class="divHeadDebt2"><span class="span26Black">'+translate.act_lang.estado+' </span><span class="span26White">'+ liqStr +'</span></div>'+                                                      
                    '</div>'+
                    '<div id="dividaContainer">'+
                        '<ul id="dividaUl">'+
                            '<li class="dividaLi">'+
                                '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.nome+': </span></div>'+
                                '<div class="dividaInput"><input id="receberNomeInput" class="nameInput" type="text" '+read+' name="name" value="'+item.nome+'" /></div>';
                                
                                if(liq!=1)
                                    html+='<button type="button" id="contactList" class="contactBtn" title="Contactos">contactos</button>';
                                        
                            html+='</li>'+
                            '<li class="dividaLi">'+
                                '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.deve+' '+translate.currency+': </span></div>'+
                                '<div class="dividaInput"><input id="receberValorInput" class="nameInput" type="text" '+read+' pattern="[0-9]+([\.|,][0-9]+)?" step="0.01" name="valor" value="'+ item.valor +'" /></div>'+
                            '</li>'+
                            '<li class="dividaLi">'+
                                '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.descricao+': </span></div>'+
                                '<div class="dividaInput"><input id="receberDescricaoInput" class="nameInput" '+read+' type="text" name="descricao" value="'+ item.descricao +'" /></div>'+
                            '</li>'+
                             '<li class="dividaLi">';
                             if(liq!=1)
                             {
                                html+='<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.abateu+' '+translate.currency+': </span></div>'+
                                '<div class="dividaInput"><input id="receberAbaterInput" class="nameInput" '+read+' type="text" name="abater" value="" /></div>'+
                                '<button type="button" id="abaterBtn" class="abaterBtn" title="Abater">abater</button>';
                             }           
                            html+='</li>';
                            for(var i=0; i< listDisc.length; i++)
                            {
                                var dataDisc = new Date(item.data);
                                var dataStrDisc = dataDisc.getDate()+'/'+(dataDisc.getMonth()+1)+'/'+dataDisc.getFullYear();
                                html+='<li class="dividaLi abateuInput">'+
                                        '<img alt="" src="img/abateu.png" class="abateuImg"/>'+
                                //    '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.abateu+' '+translate.currency+': </span></div>'+
                                     //'<div class="dividaInput"><div class="abateuValue"> - '+listDisc[i].valor+'€ on '+listDisc[i].data+'</div><div class="abateuData"> on '+listDisc[i].data+'</div></div>'+
                                     '<div class="dividaInput abateuInput"><div class="abateuValue"> Discounted '+listDisc[i].valor.toFixed(2).replace('.', ',')+'€ on '+dataStrDisc+'</div></div>'+
                                '</li>';
                            }
                      html+='</ul>'+
                             //' <div class="emptySpace40"></div>'+
                    '</div>'+
                     '<div id="footer2">'+
                    '<button id="liquidarReceber" type="button" class="aLiquidar" title="filtrar">'+translate.act_lang.liquidar+'</button>'+
                    '<button id="editarReceber" type="button" class="aEditar" title="salvar">'+translate.act_lang.salvar+'</button>'+
                '</div>'+
                '</div>';
          return(html);
    },
    setEvents: function()
    {
    //    cordova.plugins.Keyboard.disableScroll(true);
        //**** LAYOUT
         $('html, body').scrollTop(0);
         //var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()  + $('#footer2').height()) - ($('#footer2').height()*0.01)*2 -47;
         var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()  + $('#footer2').height()) -47;
         if($('#dividaUl').height()<h)
            $('#dividaUl').height(h);
         var t = $(document).height() - $('#footer2').height() - ($('#footer2').height()*0.01)*4 -7;
          var styles = {top : t.toString()+"px"};
         $('#footer2').css(styles);
        $('#dividaContainer').height(h);
         var styles2 = {top : $('#dividaUl').offset().top+"px" };
         $('#dividaContainer').css(styles2);
         //**** HANDLERS
        //$('.receberItemList').on("click", receber.gotoItem);
         $('#editarReceber').click(function(){itemReceber.triggerSubmitReceber(); return(false);});
       //  $('#editarReceber').click(function(){setTimeout(function(){cordova.plugins.Keyboard.show();}, 1000); return(false);});
         $('#liquidarReceber').click(function(){itemReceber.triggerLiquidar(); return(false);});
         $('.contactBtn').click(function(){itemReceber.triggerContacts(); return(false);});
         $('#abaterBtn').click(function(){itemReceber.abater(); return(false);});
         

            
         itemReceber._scroll = new iScroll('dividaContainer', {useTransform: false,
        onBeforeScrollStart: function (e) {
            var target = e.target;
            while (target.nodeType != 1) target = target.parentNode;

            if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA')
                e.preventDefault();
        }});
        
         var options      = new ContactFindOptions();
         options.multiple = true;
        // options.filter = "";
         var fields       = ["displayName"];
         navigator.contacts.find(fields, itemReceber.onSuccessContacts, itemReceber.onError, options);
         if(model.item.liquidada==0)
              $('#liquidarReceber').css({ opacity: 1 });
          else
              $('#liquidarReceber').css({ opacity: 0.5 });
    },   
    removeEvents: function(){
         $('#editarReceber').unbind('click');
         $('#liquidarReceber').unbind('click');
         $('.contactBtn').unbind('click');
           $('#abaterBtn').unbind('click');
    },
    setStorage: function(){
        $('#receberNomeInput').val(window.localStorage.getItem("contact"));
      //  $('#receberValorInput').val(window.localStorage.getItem("value"));
       // $('#receberDescricaoInput').val(window.localStorage.getItem("description"));
    },
    abater:function(evt){
        var val = $('#receberValorInput').val().replace(',', '.');
            var valAb = $('#receberAbaterInput').val().replace(',', '.');
            var reg = new RegExp(/^[0-9.,]+$/);
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
                               // navigator.notification.confirm(translate.alert_lang.liquidar, itemReceber.triggerLiquidar, model.item.nome, translate.confirm_lang.sim, translate.confirm_lang.nao);
                                itemReceber.triggerLiquidar();
                            }   
                            else
                            {
                                var msg=translate.alert_lang.abater+ ' ' +$('#receberAbaterInput').val()+translate.currency+' '+translate.confirm_lang.a+' '+$('#receberValorInput').val()+translate.currency+'?';
                                navigator.notification.confirm(msg, function(index){
                                    if(index==1)
                                        {
                                        //    $('#receberAbaterInput').blur();
                                                setTimeout(function(){
                                                var liq=0;
                                                if(final==0)
                                                    liq=1;
                                                model.updateReceberAbater(model.item.id, $('#receberAbaterInput').val(), final, liq);
                                                //var event = new Event('home.receber.btn');
                                                itemReceber.removeEvents();
                                            }, 300);
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
                    {
                        navigator.notification.alert(translate.alert_lang.valor_abater_inv, function(){}, model.item.nome, 'ok');
                    }
                }
                else
                {
                    itemReceber.saveReceber(1);
                    /*navigator.notification.confirm('Salvar alterações?', itemReceber.saveReceber, 'a receber', 'sim, não');*/
                    evt.preventDefault();
                    return(false);
                }
            }
            else{
                navigator.notification.alert(translate.alert_lang.valor_inv, function(){}, model.item.nome, 'ok');
            }
    },
    triggerSubmitReceber: function(evt){
        
        if($('#receberNomeInput').val()!="")
        {
            var val = $('#receberValorInput').val().replace(',', '.');
      //     var valAb = $('#receberAbaterInput').val().replace(',', '.');
            var reg = new RegExp(/^[0-9.,]+$/);
            if(reg.test(val))
            {
               /* if(valAb!="" && reg.test(valAb))
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
                                navigator.notification.confirm(translate.alert_lang.liquidar, itemReceber.triggerLiquidar, model.item.nome, translate.confirm_lang.sim, translate.confirm_lang.nao);
                            }   
                            else
                            {
                                var msg=translate.alert_lang.abater+ " " +$('#receberAbaterInput').val()+translate.currency+' '+translate.confirm_lang.a+' '+$('#receberValorInput').val()+translate.currency+'?';
                                navigator.notification.confirm(msg, function(index){
                                    if(index==1)
                                        {
                                            model.updateReceber(model.item.id, $('#receberNomeInput').val(), final, $('#receberDescricaoInput').val())
                                            itemReceber.removeEvents();
                                            var event = new Event('home.receber.btn');
                                          //  document.dispatchEvent(event);
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
                else*/
                {
                    itemReceber.saveReceber(1);
                    /*navigator.notification.confirm('Salvar alterações?', itemReceber.saveReceber, 'a receber', 'sim, não');*/
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
    saveReceber: function(index){
        if(index==1)
        {
            setTimeout(function(){
                var val = $('#receberValorInput').val().replace(',', '.');
                var valFloat = parseFloat(val);
                model.updateReceber(model.item.id, $('#receberNomeInput').val(), valFloat, $('#receberDescricaoInput').val())
                itemReceber.removeEvents();
                var event = new Event('home.receber.btn');
            //    document.dispatchEvent(event);
            },100);
        }
        $('html, body').scrollTop(0);
     //   $('body').css({top: "0px"});
    },
    triggerLiquidar: function(evt){
        $('html, body').scrollTop(0);
        if(model.item.liquidada==0)
            navigator.notification.confirm(translate.alert_lang.liquidar, itemReceber.confirmLiquidarReceber, model.item.nome, [translate.confirm_lang.sim, translate.confirm_lang.nao]);
            
     /*   model.liquidaReceber(model.item.id);
        $('.span26White').html('Liquidada');
        navigator.notification.alert('Dívida liquidada!', function(){ 
                var event = new Event('home.receber.btn');
                document.dispatchEvent(event);
            }, 'a pagar', 'ok');*/
    },
    confirmLiquidarReceber: function(index){
        $('html, body').scrollTop(0);
       if(index==1)
       {
           // model.liquidaReceber(model.item.id);
           model.updateReceberAbater(model.item.id, model.item.valor, 0, 1);
            $('.span26White').html('Liquidada');
            var event = new Event('home.receber.btn');
            document.dispatchEvent(event);
            /*navigator.notification.alert('Dívida liquidada!', function(){ 
                    var event = new Event('home.receber.btn');
                    document.dispatchEvent(event);
                }, model.item.nome, 'ok');*/
       }
    },
    triggerDelete: function(evt){
        navigator.notification.confirm(translate.alert_lang.apagar, itemReceber.deleteReceber, model.item.nome, [translate.confirm_lang.sim, translate.confirm_lang.nao]);
        evt.preventDefault();
        return(false);
    },
    deleteReceber: function(index){
        if(index==1)
        {
            model.deleteReceber(model.item.id)
            var event = new Event('home.receber.btn');
            document.dispatchEvent(event);
            itemReceber.removeEvents();
        }
    },
    triggerContacts:function(){
         window.localStorage.setItem("contact",$('#receberNomeInput').val());
         window.localStorage.setItem("value", $('#receberValorInput').val());
         window.localStorage.setItem("description", $('#receberDescricaoInput').val());
         window.localStorage.setItem("actpage", "itemreceber");
      
         var event = new Event("receber.contact.list");
         document.dispatchEvent(event);
    },
    pickContact: function(evt){
        alert("contacts"); 
    },
    onSuccessContacts: function(contacts){
        
        function getName(c) {
            var name = c.displayName;
            if(!name || name === "") {
                if(c.name.formatted) 
                    return c.name.formatted;
                if(c.name.givenName && c.name.familyName) 
                    return c.name.givenName +" "+c.name.familyName;
                return "";
            }
            return name;
        }
        
       var array = new Array();
       contacts.sort(function(a, b){if(getName(a) < getName(b)) return -1; else return 1;});
        for(var i=0; i<contacts.length; i++)
        {
            var name = getName(contacts[i]);
            if(name!="")
            {
                array.push(name);
            }
        }
        
        $('#receberNomeInput').autocomplete({
            lookup: array,
            onSelect: function(suggestion){
                document.body.scrollTop = 0;
                $('#receberNomeInput').val(suggestion.value);
                setTimeout(function(){
                    $('body').css({top: "0px"});
                }, 500);
            }
        });
    },
    onError: function(contactError){
         navigator.notification.alert('Erro na Lista de Contactos!', function(){}, model.item.nome, 'ok');
    },
    chooseName: function(){
        $('#receberNomeInput').val($("#contactList option:selected").text());
    },
    fillName:function(name){
        $('#receberNomeInput').val(name);
    },
    addAlphabetic: function(array){
        var ex = '{"contacts":[{"A":[{"firstName":"Antonio"}, {"firstName":"Alberto"}], {"B":[{"firstname":"Beatriz"}]} ]}';
        var obj = '{"contacts":[';
        for(var i=0; i<array.length; i++)
        {
            if(i==0)
            {
                obj+='{"'+ array[i].charAt(0).toUpperCase() +'":[{"firstName":"'+ array[i] + '"}';
            }
            else if(i>0 && array[i-1].charAt(0)!= array[i].charAt(0))
            {
                obj+=']},';
                obj+='{"'+ array[i].charAt(0).toUpperCase() +'":[{"firstName":"'+ array[i] + '"}';
            }
            else
                obj+=',{"firstName":"'+ array[i] +'"}';
            if(i==array.length-1)
                obj+=']}';
        }
        obj+=']}';
        var json = JSON.parse(obj);
        //alert(Object.keys(json.contacts[0])[0]);
        //alert(json.contacts[0][Object.keys(json.contacts[0])[0]][0].firstName);
        
        return(json);
    }
};


