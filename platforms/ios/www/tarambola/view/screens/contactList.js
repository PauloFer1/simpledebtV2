var contactList={
    getHtml:function(model){
        var html='';
        var html='<div id="container">'+
                 '<div id="headerDown">'+
                        '<img alt="" src="img/receberTop.png" class="headerReceber"/>'+
                        '<span class="span30Black2 margLeft20 floatLeft marginTop24">A receber</span>'+
                    '</div>'+
                    '<div class="listLi liFst">'+
                     '<span id="listArrow"></span>'+
                            '<div class="divHeadDebt1"><span class="span26White">Contactos</span></div>'+                                                   
                    '</div>'+
                     '<div id="contactsContainer">'+
                            '<ul id="abc">'+
                                '<li>A</li><li>B</li><li>C</li><li>D</li><li>E</li><li>F</li><li>G</li><li>H</li><li>I</li><li>J</li><li>K</li><li>L</li><li>M</li><li>N</li><li>O</li><li>P</li><li>Q</li><li>R</li><li>S</li><li>T</li><li>U</li><li>V</li><li>W</li><li>X</li><li>Y</li><li>Z</li><li>#</li>'+
                            '</ul>'+
                            '<div id="wrapper">'+
                                '<dl id="scroller">'+
                                    '<dt id="A">A</dt><dd>Aaaaaa Aaaaaa</dd><dd>Aaaaaa Aaaaaa</dd><dd>Aaaaaa Aaaaaa</dd><dd>Aaaaaa Aaaaaa</dd><dd class="last">Aaaaaa Aaaaaa</dd>'+
                                    '<dt id="B">B</dt><dd>Bbbbbb Bbbbbb</dd><dd>Bbbbbb Bbbbbb</dd><dd>Bbbbbb Bbbbbb</dd><dd class="last">Bbbbbb Bbbbbb</dd>'+
                                    '<dt id="C">C</dt><dd>Cccccc Cccccc</dd><dd>Cccccc Cccccc</dd><dd>Cccccc Cccccc</dd><dd class="last">Cccccc Cccccc</dd>'+
                                    '<dt id="D">D</dt><dd>Dddddd Dddddd</dd><dd>Dddddd Dddddd</dd><dd>Dddddd Dddddd</dd><dd>Dddddd Dddddd</dd><dd class="last">Dddddd Dddddd</dd>'+
                                    '<dt id="E">E</dt><dd>Eeeeee Eeeeee</dd><dd>Eeeeee Eeeeee</dd><dd>Eeeeee Eeeeee</dd><dd class="last">Eeeeee Eeeeee</dd>'+
                                    '<dt id="L">L</dt><dd>Llllll Llllll</dd><dd>Llllll Llllll</dd><dd>Llllll Llllll</dd>'+
                                    '<dt id="O">O</dt><dd>Oooooo Oooooo</dd><dd>Oooooo Oooooo</dd><dd>Oooooo Oooooo</dd>'+
                                    '<dt id="W">W</dt><dd>Wwwwww Wwwwww</dd><dd>Wwwwww Wwwwww</dd><dd>Wwwwww Wwwwww</dd><dd>Wwwwww Wwwwww</dd>'+
                                '</dl>'+
                            '</div>'+
                    '</div>'+
                '</div>';
        return(html);
    },
    setEvents:function(){
        document.body.scrollTop = 0;
        
        var options      = new ContactFindOptions();
        options.multiple = true;
        var fields       = ["displayName", "name"];
        navigator.contacts.find(fields, contactList.onSuccessContacts, contactList.onError, options);
         $('body').css({top: "0px"});
         var h =  $(document).height() - ($('.liFst').offset().top + $('.liFst').height()) -47;
         if($('#wrapper').height()<h)
         {
            $('#contactsContainer').height(h);
            $('#wrapper').height(h);
            $('#abc').height(h);
         }
        
        setTimeout(function(){$('dd').on("click", contactList.chooseContact);}, 300);
        setTimeout(function(){ contactList.loaded(); }, 300);

    },
    removeEvents:function(){
        
    },
    loaded: function(){
        function abc(el){
             this.element = el;

            this.element.addEventListener('touchstart', this, false);
        };
        abc.prototype = {
	handleEvent: function(e) {
		switch(e.type) {
			case 'touchstart': this.onTouchStart(e); break;
			case 'touchmove': this.onTouchMove(e); break;
			case 'touchend': this.onTouchEnd(e); break;
		}
	},
	
	onTouchStart: function(e) {
		e.preventDefault();
		this.element.className = 'hover';

		var theTarget = e.target;
		if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
		theTarget = theTarget.innerText;

		//if( document.getElementById(theTarget) )
		//	contactList._scroll.scrollTo(-document.getElementById(theTarget).offsetTop, '0s');
                    if( document.getElementById(theTarget) ) {
			theTarget = -document.getElementById(theTarget).offsetTop;			
			contactList._scroll.scrollTo(0, theTarget, 100);
		}

		this.element.addEventListener('touchmove', this, false);
		this.element.addEventListener('touchend', this, false);

		return false;
	},

	onTouchEnd: function(e) {
		e.preventDefault();
		this.element.className = '';

		this.element.removeEventListener('touchmove', this, false);
		this.element.removeEventListener('touchend', this, false);
		return false;
	},

	onTouchMove: function(e) {
		e.preventDefault();
		
		var theTarget = document.elementFromPoint(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
		if(theTarget.nodeType == 3) theTarget = theTarget.parentNode;
		theTarget = theTarget.innerText;
		if( document.getElementById(theTarget) ) {
			theTarget = -document.getElementById(theTarget).offsetTop;
			//if( theTarget<contactList._scroll.maxScroll )
			//	theTarget = contactList._scroll.maxScroll;
			
			contactList._scroll.scrollTo(0, theTarget, 100);
		}

		return false;
	}
        };
	
	document.addEventListener('touchmove', function(e){ e.preventDefault(); return false; }, false);
	
	contactList._scroll = new iScroll('wrapper', {useTransform:false, hScroll:false, vScroll:true});
	
	new abc(document.getElementById('abc'));
    },
    chooseContact:function(){
        window.localStorage.setItem("contact", $(this).html());
        
        var event = new Event("receber.contact.choose");
        document.dispatchEvent(event);
        contactList.removeEvents();
    },
    onError: function(contactError){
        alert("Erro na Lista de Contactos!");
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
       contacts.sort(function(a, b){if(getName(a).toUpperCase() < getName(b).toUpperCase()) return -1; else return 1;});
        for(var i=0; i<contacts.length; i++)
        {
            var name = getName(contacts[i]);
            if(name!="")
            {
                array.push(name);
            }
        }
        
        var obj = contactList.addAlphabetic(array);
        var html='<dl id="scroller">';
        
        for(var i=0; i<obj.contacts.length; i++)
        {
            var contact = obj.contacts[i];
            html+='<dt id="' + Object.keys(contact)[0] + '">'+ Object.keys(contact)[0] + '</dt>';
            for(var j = 0; j<contact[Object.keys(contact)[0]].length; j++)
            {
                html+='<dd>' + contact[Object.keys(contact)[0]][j].firstName + '</dd>';
            }
        }
        html+='</dl>';
        $('#wrapper').html(html);
    },
    addAlphabetic: function(array){
        var ex = '{"contacts":[{"A":[{"firstName":"Antonio"}, {"firstName":"Alberto"}], {"B":[{"firstname":"Beatriz"}]} ]}';
        var obj = '{"contacts":[';
        var k=0;
        var j=0;
        var numbers =', {"#":[';
        var charS = '';
        for(var i=0; i<array.length; i++)
        {
            if(array[i].charAt(0)>=0 && array[i].charAt(0)<=9)
            {
                if(k>0)
                    numbers+=', ';
                numbers+='{"firstName":"'+ array[i] +'"}';
                k++;
                
            }
            else
            {
                if(array[i].charAt(0)<="z")
                {
                    if(j==0)
                    {
                        obj+='{"'+ array[i].charAt(0).toUpperCase() +'":[{"firstName":"'+ array[i] + '"}';
                    }
                    else if(j>0 && array[i-1].charAt(0).toUpperCase()!= array[i].charAt(0).toUpperCase())
                    {
                        obj+=']},';
                        obj+='{"'+ array[i].charAt(0).toUpperCase() +'":[{"firstName":"'+ array[i] + '"}';
                    }
                    else
                        obj+=',{"firstName":"'+ array[i] +'"}';
                    j++;
                }
                else
                {
                   if(k>0)
                    numbers+=', ';
                   numbers+='{"firstName":"'+ array[i] +'"}'; 
                }
            }
            if(i==array.length-1)
                obj+=']}';
        }
        numbers+=']}';
        alert(numbers);
        obj+=numbers;
        obj+=']}';
        var json = JSON.parse(obj);
        //alert(Object.keys(json.contacts[0])[0]);
        //alert(json.contacts[0][Object.keys(json.contacts[0])[0]][0].firstName);
        
        return(json);
    }
};
