var insertReceber = {
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
          if(insertReceber._hasName)
          {
              strRead="readonly";
              nameRead = window.localStorage.getItem("name");
          }
          var html='<div id="container">'+
                  '<div id="headerDown">'+
                        '<img alt="" src="img/receberTop.png" class="headerReceber"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">A receber</span>'+
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
                            '<div class="dividaInput"><input id="receberNomeInput" class="nameInput" '+ strRead +' type="text" name="name" value="'+ nameRead +'"/></div>';
                            if(!insertReceber._hasName)
                                html+='<button type="button" id="contactList" class="contactBtn" title="Contactos">contactos</button>';

                        html+='</li>'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.valor+' '+translate.currency+': </span></div>'+
                            '<div class="dividaInput"><input id="receberValorInput" class="nameInput" type="number" pattern="\d (\.\d*)?" step="0.01" name="valor" value="" /></div>'+
                        '</li>'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.descricao+': </span></div>'+
                            '<div class="dividaInput"><input id="receberDescricaoInput" class="nameInput" type="text" name="descricao" value="" /></div>'+
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
        
         insertReceber._scroll = new iScroll('dividaContainer', {useTransform: false,
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
         navigator.contacts.find(fields, insertReceber.onSuccessContacts, insertReceber.onError, options);
         //**** HANDLERS
        $('.contactBtn').click(function(){insertReceber.triggerContacts(); return(false);});
        $('.aAdicionar').click(function(){insertReceber.triggerSubmitReceber(); return(false);});
        $('#contactList').change(function(){insertReceber.chooseName(); return(false);});
    },
    cleanStorage: function(){
      window.localStorage.setItem("contact", "");
      window.localStorage.setItem("value", "");
      window.localStorage.setItem("description", "");
    },
    setStorage: function(){
        $('#receberNomeInput').val(window.localStorage.getItem("contact"));
        $('#receberValorInput').val(window.localStorage.getItem("value"));
        $('#receberDescricaoInput').val(window.localStorage.getItem("description"));
    },
     removeEvents: function(){
        $('.aAdicionar').unbind('click');
        $('#contactList').unbind('change');
        $('.contactBtn').unbind('click');
    },
    triggerSubmitReceber: function(evt){
        if($('#receberNomeInput').val()!="")
        {
            var reg = new RegExp(/^[0-9.,]+$/);
            if(reg.test($('#receberValorInput').val()))
            {
                var v = $('#receberValorInput').val().replace(',','.');
                model.addReceber($('#receberNomeInput').val(), v, $('#receberDescricaoInput').val());
                window.localStorage.setItem("nomeItem", $('#nomeReceber').val());
                var event = new Event('home.receber.btn');
                document.dispatchEvent(event);
                insertReceber.removeEvents();
            }
            else
                navigator.notification.alert(translate.alert_lang.valor_inv, function(){}, translate.act_lang.receber, 'ok');
        }
        else
            navigator.notification.alert(translate.alert_lang.nome_inv, function(){}, translate.act_lang.receber, 'ok');
        
        evt.preventDefault();
        return(false);
    },
    triggerContacts:function(){
         window.localStorage.setItem("contact",$('#receberNomeInput').val());
         window.localStorage.setItem("value", $('#receberValorInput').val());
         window.localStorage.setItem("description", $('#receberDescricaoInput').val());
         window.localStorage.setItem("actpage", "addreceber");
      
         var event = new Event("receber.contact.list");
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
        alert("Erro na Lista de Contactos!");
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
