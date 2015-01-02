var allItem = {
    _nome:"",
    _data:"",
    _valor:"",
    _descricao:"",
    _scroll: "",
    
    getHtml: function(model){
        var item = model.item;
        var liq = item.liquidada;
          var liqStr="";
          if(liq==1)
              liqStr = translate.act_lang.liquidar;
          else
              liqStr = translate.act_lang.por_liquidar;
            var data = new Date(item.data);
                  var dataStr = data.getDate()+'/'+(data.getMonth()+1)+'/'+data.getFullYear();
          var image;
          var label;
          if(window.localStorage.getItem("tabela")=="receber")
          {
              label=translate.act_lang.areceber;
              image="receberTop.png"; 
          }
          else
          {
              image="liquidarTop.png"; 
              label=translate.act_lang.apagar;
          }
          var html='<div id="container">'+
                  '<div id="headerDown">'+
                        '<img alt="" src="img/'+image+'" class="headerLiquidar"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">'+ label +'</span>'+
                    '</div>'+
                    '<div class="listLi liFst">'+
                            '<div class="divHeadDebt1"><span class="span26White">'+ dataStr +'</span></div>'+
                            '<div class="divHeadDebt2"><span class="span26Black">'+translate.act_lang.estado+' </span><span class="span26White">'+ liqStr +'</span></div>'+                                                      
                    '</div>'+
                    '<div id="dividaContainer">'+
                        '<ul id="dividaUl">'+
                            '<li class="dividaLi">'+
                                '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.nome+': </span></div>'+
                                '<div class="dividaInput"><input id="receberNomeInput" class="nameInput" type="text" name="name" value="'+item.nome+'" readonly /></div>'+
                            '</li>'+
                            '<li class="dividaLi">'+
                                '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.deve+' '+translate.currency+': </span></div>'+
                                '<div class="dividaInput"><input id="receberValorInput" class="nameInput" type="number" pattern="[0-9]+([\,|.][0-9]+)?" step="0.01" name="valor" value="'+ item.valor +'" readonly /></div>'+
                            '</li>'+
                            '<li class="dividaLi">'+
                                '<div class="dividaLabel"><span class="span26Black">'+translate.act_lang.descricao+': </span></div>'+
                                '<div class="dividaInput"><input id="receberDescricaoInput" class="nameInput" type="text" name="descricao" value="'+ item.descricao +'" readonly /></div>'+
                            '</li>'+
                        '</ul>'+
                    '</div>'+
                '</div>';
          return(html);
    },
    setEvents: function()
    {
        //**** LAYOUT
         var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height());
         if($('#dividaUl').height()<h)
            $('#dividaUl').height(h);
         $('#dividaContainer').height(h);
         var styles2 = {top : $('#dividaUl').offset().top+"px" };
         $('#dividaContainer').css(styles2);
         //**** HANDLERS
        //$('.receberItemList').on("click", receber.gotoItem);
         $('#contactList').change(function(){allItem.chooseName(); return(false);});
            
         allItem._scroll = new iScroll('dividaContainer', {useTransform: false,
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
         navigator.contacts.find(fields, allItem.onSuccessContacts, allItem.onError, options);
 
    },   
    removeEvents: function(){
         $('#editarReceber').unbind('click');
         $('#liquidarReceber').unbind('click');
         $('#contactList').unbind('change');
    },
    triggerDelete: function(evt){
        navigator.notification.confirm(translate.alert_lang.apagar, allItem.deleteReceber, '', [translate.confirm_lang.sim, translate.confirm_lang.nao]);
        evt.preventDefault();
        return(false);
    },
    deleteReceber: function(index){
        if(index==1)
        {
            model.deleteReceber(model.item.id)
            var event = new Event('home.receber.btn');
            document.dispatchEvent(event);
            allItem.removeEvents();
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
         navigator.notification.alert('Erro na Lista de Contactos!', function(){}, 'a pagar', 'ok');
    },
    chooseName: function(){
        $('#receberNomeInput').val($("#contactList option:selected").text());
    }
};


