var insertPagar = {
     _nome:"",
    _data:"",
    _valor:"",
    _descricao:"",
    _hasName:false,
    
    getHtml: function (model){
          var date = new Date();
          var dateStr = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
           var strRead = "";
          var nameRead="";
          if(insertPagar._hasName)
          {
              strRead="readonly";
              nameRead = window.localStorage.getItem("name");
          }
          var html='<div id="container">'+
                  '<div id="headerDown">'+
                        '<img alt="" src="img/liquidarTop.png" class="headerReceber"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">'+translate.act_lang.pagar+'</span>'+
                    '</div>'+
                    '<div class="listLi liFst">'+
                     '<span id="listArrow"></span>'+
                            '<div class="divHeadDebt1"><span class="span26White">'+ dateStr +'</span></div>'+
                            '<div class="divHeadDebt2"><span class="span26Black">'+translate.act_lang.estado+' </span><span class="span26White">Por liquidar</span></div>'+                                                      
                    '</div>'+
                     '<div id="dividaContainer">'+
                    '<ul id="dividaUl">'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.nome+': </span></div>'+
                            '<div class="dividaInput"><input id="pagarNomeInput" class="nameInput" '+ strRead +' type="text" name="name" value="'+ nameRead +'"/></div>';
                            if(!insertPagar._hasName)
                                html+='<button type="button" id="contactList" class="contactBtn" title="Contactos">contactos</button>';
                       html+= '</li>'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.valor+' '+translate.currency+': </span></div>'+
                            '<div class="dividaInput"><input id="pagarValorInput" class="nameInput" type="text" name="valor" value="" /></div>'+
                        '</li>'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.descricao+': </span></div>'+
                            '<div class="dividaInput"><input id="pagarDescricaoInput" class="nameInput" type="text" name="descricao" value="" /></div>'+
                        '</li>'+
                    '</ul>'+
                    '</div>'+
                     '<div id="footer2">'+
                    '<button type="button" class="aAdicionar" title="Inserir">'+translate.act_lang.inserir+'</button>'+
                '</div>'+
                '</div>';
          return(html);
    },
    setEvents: function(){
        //**** LAYOUT
        $('html, body').scrollTop(0);
          var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()  + $('#footer2').height()) - ($('#footer2').height()*0.01)*2 -47;
         if($('#dividaUl').height()<h)
            $('#dividaUl').height(h);
         var t = $(document).height() - $('#footer2').height() - ($('#footer2').height()*0.01)*4 -7;
          var styles = {top : t.toString()+"px"};
         $('#footer2').css(styles);
         $('#dividaContainer').height(h);
         var styles2 = {top : $('#dividaUl').offset().top+"px" };
         $('#dividaContainer').css(styles2);
        
        insertPagar._scroll = new iScroll('dividaContainer', {useTransform: false,
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
         navigator.contacts.find(fields, insertPagar.onSuccessContacts, insertPagar.onError, options);
         //**** HANDLERS
         $('.contactBtn').click(function(){insertPagar.triggerContacts(); return(false);});
        $('.aAdicionar').click(function(){insertPagar.triggerSubmitPagar(); return(false);});
        $('#contactList').change(function(){insertPagar.chooseName(); return(false);});
    },
    cleanStorage: function(){
      window.localStorage.setItem("contact", "");
      window.localStorage.setItem("value", "");
      window.localStorage.setItem("description", "");
    },
    setStorage: function(){
        $('#pagarNomeInput').val(window.localStorage.getItem("contact"));
        $('#pagarValorInput').val(window.localStorage.getItem("value"));
        $('#pagarDescricaoInput').val(window.localStorage.getItem("description"));
    },
    removeEvents: function(){
        $('.aAdicionar').unbind('click')
        $('#contactList').unbind('change')
    },
    triggerSubmitPagar: function(evt){
        if($('#pagarNomeInput').val()!="")
        {
            var reg = new RegExp(/^[0-9.,]+$/);
            if(reg.test($('#pagarValorInput').val()))
            {
                model.addPagar($('#pagarNomeInput').val(), $('#pagarValorInput').val(), $('#pagarDescricaoInput').val());
                window.localStorage.setItem("nomeItem", $('#nomepagar').val());
                var event = new Event('home.pagar.btn');
                document.dispatchEvent(event);
                insertPagar.removeEvents();
            }
            else
                navigator.notification.alert(translate.alert_lang.valor_inv, function(){}, translate.act_lang.pagar, 'ok');
        }
        else
            navigator.notification.alert(translate.alert_lang.nome_inv, function(){}, translate.act_lang.pagar, 'ok');
        
        evt.preventDefault();
        return(false);
    },
    triggerContacts:function(){
         window.localStorage.setItem("contact",$('#pagarNomeInput').val());
         window.localStorage.setItem("value", $('#pagarValorInput').val());
         window.localStorage.setItem("description", $('#pagarDescricaoInput').val());
         window.localStorage.setItem("actpage", "addpagar");
      
         var event = new Event("pagar.contact.list");
         document.dispatchEvent(event);
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
        
        $('#pagarNomeInput').autocomplete({
            lookup: array,
            onSelect: function(suggestion){
                document.body.scrollTop = 0;
                $('#pagarNomeInput').val(suggestion.value);
                setTimeout(function(){
                    $('body').css({top: "0px"});
                }, 500);
            }
        });
    },
    onError: function(contactError){
        navigator.notification.alert('Erro na Lista de Contactos!', function(){}, 'a pagar', 'ok');
    },
    chooseName: function(){
        $('#pagarNomeInput').val($("#contactList option:selected").text());
    },
    fillName:function(name){
        $('#pagarNomeInput').val(name);
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
