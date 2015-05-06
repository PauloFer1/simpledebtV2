var home ={
    countTotal:0,
    getHtml: function(model)
    {
        var html='';
        var html= '<div id="container" class="center">'+
                    '<div id="graph">'+
                            '<canvas id="myCanvas" width="500" height="500"></canvas>'+
                            '<input id="value" value="45" style="display: none"></input>'+
                        '<div id="graphInner">'+
                            '<span id="saldo1" class="span100White">0,00</span><span id="saldo2" class="span30White2">'+translate.currency+'</span>'+
                            '<span class="span30BlackSpace">'+translate.act_lang.saldo+'</span>'+
                        '</div>'+
                        
                    '</div>'+
                '</div>'+
                    '<div id="footer">'+
                     '<div id="infoDiv">'+   
                     '<span id="setaHome"></span>'+
                        '<div class="infoDivLeft">'+
                            '<div class="divNrLeft">'+
                                '<span id="totalReceberHome" class="span30White2">0</span>'+
                            '</div>'+
                            '<div class="divSpanLeft">'+
                                '<span id="valorReceberHome" class="span30White">0.00€</span>'+
                            '</div>'+
                        '</div>'+
                        '<div class="infoDivRight">'+
                            '<div class="divNrRight">'+
                                '<span id="totalPagarHome" class="span30White2">0</span>'+
                            '</div>'+
                            '<div class="divSpanRight">'+
                                '<span id="valorPagarHome" class="span30White">0,00€</span>'+
                            '</div>'+
                        '</div>'+
                    '</div>'+
                    '<button type="button" class="aReceberIndex" title="a receber">'+translate.act_lang.receber+'</button>'+
                    '<button type="button" class="aPagarIndex" title="a pagar">'+translate.act_lang.pagar+'</button>'+
                '</div>'+
            '</div>';
        return(html);
    },
    setEvents:function(){
        $('html, body').scrollTop(0);
        home.countTotal=0;
        window.localStorage.setItem("estado", 1);
        //***** EVENTS
        $('.aReceberIndex').click(function(){home.triggerReceber();});    
        //$('.aReceberIndex').on('tap', function(){home.triggerReceber();});    
        $('.aPagarIndex').click(function(){home.triggerPagar();});   
        $('.infoDivLeft').click(function(){home.triggerReceber();});    
        $('.infoDivRight').click(function(){home.triggerPagar();}); 
        $('#graph').click(function(){home.triggerList();});    
        document.addEventListener("model.totalReceber.ready", home.setCircle, false);
        document.addEventListener("model.totalPagar.ready", home.setCircle, false);
        model.getTotal();
    },
    removeEvents:function(){
        $('.aReceberIndex').unbind('click');  
        $('.aPagarIndex').unbind('click');
        $('.infoDivLeft').unbind('click');  
        $('.infoDivRight').unbind('click');
        document.removeEventListener("model.totalReceber.ready", home.setCircle, false);
        document.removeEventListener("model.totalPagar.ready", home.setCircle, false);
    },
    triggerList: function(){
        var event = new Event('home.list.btn');
        document.dispatchEvent(event);
        home.removeEvents();
        receber._estado=1;
        return(0);
    },
    triggerReceber: function(){
        var event = new Event('home.receber.btn');
        document.dispatchEvent(event);
        home.removeEvents();
        receber._estado=1;
        return(0);
    },
    triggerPagar: function(){
        var event = new Event('home.pagar.btn');
        document.dispatchEvent(event);
        home.removeEvents();
        pagar._estado=1;
        return(0);
    },
    setCircle: function(){
        home.countTotal++;
        if(home.countTotal==2)
        {
          var totalReceber = model.totalReceber.total;
          var valorReceber = model.totalReceber.valor;
          var totalPagar = model.totalPagar.total;
          var valorPagar = model.totalPagar.valor;
          if(valorPagar == null)
              valorPagar=0;
          if(valorReceber == null)
              valorReceber =0;
          
          

          var total = model.totalReceber.valor + model.totalPagar.valor;
          var percRec = (model.totalReceber.valor/total) *100;
          var percPag = (model.totalPagar.valor/total) *100;
          
          
          var saldo = model.totalReceber.valor - model.totalPagar.valor;
          var left = (saldo%1)*100;
 
          
          $('#saldo1').html(Math.floor(saldo));
          $('#saldo2').html(","+Math.ceil(left)+translate.currency);
          $('#valorReceberHome').html((valorReceber.toFixed(2)+translate.currency).replace('.', ','));
          $('#totalReceberHome').html(totalReceber.toString());
          $('#totalPagarHome').html(totalPagar.toString());
          $('#valorPagarHome').html((valorPagar.toFixed(2)+translate.currency).replace('.', ','));

          var canvas = document.getElementById('myCanvas');
          var val = percPag;
          var context = canvas.getContext('2d');
          var context1 = canvas.getContext('2d');
          var context2 = canvas.getContext('2d');
          var x = canvas.width / 2;
          var y = canvas.height / 2;
          var radius = 178;


          if(val == 0){
              var startAngle = 5.5 * Math.PI;
              var endAngle = 3.5 * Math.PI;
          }
          else{
              var startAngle = 1.5 * Math.PI;
              var endAngle = (1.5 + ((val/100)*2)) * Math.PI;
          }

          var counterClockwise = false;
          var counterClockwiseTrue = true;

          context.beginPath();
          context.arc(x, y, radius, startAngle, endAngle, counterClockwise);
          context.lineWidth = 5;            

          // line color
          //context.strokeStyle = '#029E3C';
          context.strokeStyle = '#FF2626';
          context.stroke();

          context1.beginPath();
          context1.arc(x, y, radius, startAngle, endAngle, counterClockwiseTrue);
          context1.lineWidth = 5;

          //context1.strokeStyle = '#FF2626';
          context1.strokeStyle = '#029E3C';
          context1.stroke();

          context2.beginPath();
          context2.arc(x, y, 200, 0, 7, counterClockwise);
          context2.lineWidth = 40;

          context2.strokeStyle = '#046379';
          context2.stroke();
    }
    }
};
    