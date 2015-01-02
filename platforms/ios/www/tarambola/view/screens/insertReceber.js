var insertReceber = {
     _nome:"",
    _data:"",
    _valor:"",
    _descricao:"",
    
    getHtml: function (model){
          var date = new Date();
          var dateStr = date.getDate()+'/'+(date.getMonth()+1)+'/'+date.getFullYear();
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
                            '<div class="dividaInput"><input id="receberNomeInput" class="nameInput" type="text" name="name" value=""/></div>'+
                            '<select id="contactList"></select>'+
                        '</li>'+
                        '<li class="dividaLi">'+
                            '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.valor+' '+translate.currency+': </span></div>'+
                            '<div class="dividaInput"><input id="receberValorInput" class="nameInput" type="number" name="valor" value="" /></div>'+
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
        $('body').css({top: "0px"});
         var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()  + $('#footer2').height()) - ($('#footer2').height()*0.01)*2 -47;
         if($('#dividaUl').height()<h)
            $('#dividaUl').height(h);
         var t = $(document).height() - $('#footer').height() - ($('#footer').height()*0.01)*4 -7;
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
        $('.aAdicionar').click(function(){insertReceber.triggerSubmitReceber(); return(false);});
        $('#contactList').change(function(){insertReceber.chooseName(); return(false);});
    },
     removeEvents: function(){
        $('.aAdicionar').unbind('click');
        $('#contactList').unbind('change');
    },
    triggerSubmitReceber: function(evt){
        if($('#receberNomeInput').val()!="")
        {
            var reg = new RegExp(/[0-9.,]/);
            if(reg.test($('#receberValorInput').val()))
            {
                model.addReceber($('#receberNomeInput').val(), $('#receberValorInput').val(), $('#receberDescricaoInput').val());
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
        alert("Erro na Lista de Contactos!");
    },
    chooseName: function(){
        $('#receberNomeInput').val($("#contactList option:selected").text());
    }
};