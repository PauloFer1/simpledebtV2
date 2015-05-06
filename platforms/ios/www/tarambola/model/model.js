var model ={
    database:"",
    results:new Array(),
    results2:new Array(),
    item:"",
    totalReceber:"",
    totalPagar:"",
    countTotal:0,
    isTransaction:0,
    
    initialize: function(){
        model.database = window.sqlitePlugin.openDatabase({name:"db"});
       // this.database.executeSql('SELECT * FROM receber', [], model.querySuccess, model.errorCB);
    },
    getListaReceber: function(){
      /*  var a = new Array();
        a.push("Item 1");
        a.push("Item 2");
        a.push("Item 3");
        a.push("Item 4");
        a.push("Item 5");
        return(a);*/
        return(model.results);
    },
    prepareModel: function(){
        model.database.transaction(model.getListaQuery, model.errorCB);
    },
    checkTable: function(){
      model.database.executeSql("SELECT name FROM sqlite_master WHERE type='table' AND name='discount';", [], model.checkTableCallBack, model.errorCB);
    },
    checkTableCallBack:function(results){
        if(results)
        {
            if(results.rows.length==0)
            {
                model.createVersionTable();
                model.createDiscountTable();
            }
            else
            {
                model.database.executeSql('SELECT * FROM version WHERE id =?', [1], function(res){});
             //   model.database.executeSql('DROP TABLE version', [], function(res){});
             //   model.database.executeSql('DROP TABLE discount', [], function(res){});
            }
        }
    },
err: function(){
    alert(0);
    model.isTransaction=0;
    model.createVersionTable();
    model.createDiscountTable();

},
    createVersionTable:function(){
        model.database.executeSql("CREATE TABLE IF NOT EXISTS version (id INTEGER PRIMARY KEY, number INTEGER)");
        model.database.executeSql('INSERT INTO version (id, number) VALUES (?,?)', [1,20], function(res){console.log("insertId: " + res.insertId);});
    },
    createDiscountTable:function(){
        model.database.executeSql("CREATE TABLE IF NOT EXISTS discount (id INTEGER PRIMARY KEY AUTOINCREMENT UNIQUE, tipo INTEGER, id_tabela INTEGER, data TEXT, valor DOUBLE)");
    },
    //**************************************************** HOME ****************************************************//
    getTotal: function(){
        model.database.transaction(model.getTotalQuery, model.errorCB);
    },
    getTotalQuery: function(){
         model.database.executeSql('SELECT SUM(valor) AS valor, COUNT(id) AS total FROM receber WHERE liquidada=0', [], model.successTotalReceber, model.errorCB);
         model.isTransaction=1;
    },
    getTotalReceber: function(){
         model.database.executeSql('SELECT SUM(r.valor) AS valorReceber, COUNT(r.id) AS totalReceber, SUM(p.valor) AS valorPagar, COUNT(p.id) AS totalPagar  FROM receber AS r INNER JOIN pagar as p', [], model.successTotalReceber, model.errorCB);
         model.isTransaction=1;
    },
    getTotalPagar: function(){
         model.database.executeSql('SELECT SUM(valor) AS valor, COUNT(id) AS total FROM pagar WHERE liquidada = 0', [], model.successTotalPagar, model.errorCB);
         model.isTransaction=1;
    },
    successTotalReceber:function(results) {
        model.countTotal++;
        if(results)
        {
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                model.totalReceber = new Object();
                model.totalReceber.valor = results.rows.item(i).valor;
                model.totalReceber.total = results.rows.item(i).total;
            }
            var event = new Event("model.totalReceber.ready");
            document.dispatchEvent(event);
            model.getTotalPagar();
        }
        model.isTransaction=0;
    },
    successTotalPagar:function(results) {
        if(results)
        {
            model.countTotal++;
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                model.totalPagar = new Object();
                model.totalPagar.valor = results.rows.item(i).valor;
                model.totalPagar.total = results.rows.item(i).total;
            }
            var event = new Event("model.totalPagar.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    getAllDebts: function(){
        model.isTransaction=1;
        model.database.executeSql('SELECT * FROM receber WHERE liquidada=0', [], model.suc1, model.errorCB);
    },
    suc1:function(results) {
        if(model.isTransaction==1)
            {
                if(results)
                {
                    var len = results.rows.length;
                    model.results = new Array();
                    for (var i=0; i<len; i++){
                        var obj = new Object();
                        obj.id = results.rows.item(i).id;
                        obj.valor = results.rows.item(i).valor;
                        obj.nome = results.rows.item(i).nome;
                        obj.data = results.rows.item(i).data;
                        obj.descricao = results.rows.item(i).descricao;
                        obj.liquidada = results.rows.item(i).liquidada;
                        obj.tabela = "receber"
                        model.results.push(obj);
                    }
                }
                model.getAllDebts2();
            }
    },    
    getAllDebts2: function(){
        model.isTransaction=1;
        model.database.executeSql('SELECT * FROM pagar WHERE liquidada = 0', [], model.suc2, model.errorCB);
    },
    suc2:function(results) {
        if(model.isTransaction==1)
        {
            if(results)
            {
                var len = results.rows.length;
                for (var i=0; i<len; i++){
                    var obj = new Object();
                    obj.id = results.rows.item(i).id;
                    obj.valor = results.rows.item(i).valor;
                    obj.nome = results.rows.item(i).nome;
                    obj.data = results.rows.item(i).data;
                    obj.descricao = results.rows.item(i).descricao;
                    obj.liquidada = results.rows.item(i).liquidada;
                    obj.tabela = "pagar"
                    model.results.push(obj);
                }
            }
                var event = new Event("model.list.ready");
                document.dispatchEvent(event);
        }
        model.isTransaction=0;
    }, 
    prepareModelItemAll: function(){
        var it = window.localStorage.getItem("item");
        var tabela = window.localStorage.getItem("tabela");
        model.database.executeSql('SELECT * FROM '+tabela+' WHERE id=?', [it], model.querySuccessAllItem, model.errorCB);
        model.isTransaction=1;
    },
    querySuccessAllItem:function(results) {
        if(results)
        {
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                model.item=obj;
            }
            var event = new Event("model.allitem.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },   
    ////**************************************************** @HOME ****************************************************//
    ////**************************************************** HISTORICLIST ****************************************************//
    getHistoricReceberByUser:function(name){
        window.localStorage.setItem("name", name);
        model.database.executeSql('SELECT * FROM ( SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 1 AS tabela FROM receber WHERE nome="'+name+'" UNION SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 0 AS tabela FROM pagar  WHERE nome="'+name+'") ORDER BY data', [], model.queryHistoricReceberSuccess, model.errorCB);
        model.isTransaction=1;
    },
    queryHistoricReceberSuccess:function(results){
        if(results)
        {
            var len = results.rows.length;
            model.results = new Array();
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                // tabela = 1 para receber, 0 para pagar
                obj.tabela = results.rows.item(i).tabela;
                model.results.push(obj);
            }
            var event = new Event("model.historic.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    ////**************************************************** @HISTORICLIST ****************************************************//
    //**************************************************** RECEBER *************************************************//
    getListaQuery: function(){
        //model.database.executeSql('CREATE TABLE IF NOT EXISTS receber (id integer primary key, nome text, data text, valor double)');
        //model.database.executeSql('INSERT INTO receber (nome, data, valor) VALUES (?,?, ?)', ['test', '11/08/2013', 12]);
        model.database.executeSql('SELECT * FROM receber', [], model.querySuccess, model.errorCB);
        model.isTransaction=1;
    },
    querySuccess:function(results) {
        if(results)
        {
            var len = results.rows.length;
            model.results = new Array();
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                model.results.push(obj);
            }

            var event = new Event("model.receber.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    querySuccessGroup:function(results) {
        if(results)
        {
            var len = results.rows.length;
            model.results = new Array();
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                model.results.push(obj);
            }

            var event = new Event("model.recebergroup.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    getReceberLiquidadas: function(){
        model.database.executeSql('SELECT * FROM receber WHERE liquidada=1', [], model.querySuccess, model.errorCB);
        model.isTransaction=1;
    },
    getReceberLiquidadasName: function(){
        var it = window.localStorage.getItem("name");
        model.database.executeSql('SELECT * FROM ( SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 1 AS tabela FROM receber WHERE liquidada=1 AND nome="'+it+'" UNION SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 0 AS tabela FROM pagar  WHERE liquidada=1 AND nome="'+it+'") ORDER BY data', [it], model.querySuccessReceberName, model.errorCB);
        model.isTransaction=1;
    },
    getReceberAllGroup: function(){
        model.database.executeSql('SELECT id, nome, data, liquidada, SUM(valor) AS valor FROM receber GROUP BY nome ORDER By nome', [], model.querySuccessGroup, model.errorCB);
        model.isTransaction=1;
    },
    getReceberNaoLiquidadasGroup: function(){
        model.database.executeSql('SELECT * FROM (SELECT * FROM (SELECT id , SUM(1) AS num, nome, data, liquidada, SUM(valor) AS valor, SUM(liquidada) AS total_liquidada FROM receber WHERE liquidada = 0 GROUP BY nome ORDER BY nome)) WHERE total_liquidada < num', [], model.querySuccessGroup, model.errorCB);
        model.isTransaction=1;
    },
    getReceberLiquidadasGroup: function(){
        model.database.executeSql('SELECT * FROM (SELECT * FROM (SELECT id , SUM(1) AS num, nome, data, SUM(valor) AS valor, SUM(liquidada) AS liquidada FROM receber GROUP BY nome)) WHERE liquidada = num', [], model.querySuccessGroup, model.errorCB);
        model.isTransaction=1;
    },
    getReceberNaoLiquidadas: function(){
        model.database.executeSql('SELECT * FROM receber WHERE liquidada=0', [], model.querySuccess, model.errorCB);
        model.isTransaction=1;
    },
    getReceberNaoLiquidadasName: function(){
        var it = window.localStorage.getItem("name");
        model.database.executeSql('SELECT * FROM ( SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 1 AS tabela FROM receber WHERE liquidada=0 AND nome="'+it+'" UNION SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 0 AS tabela FROM pagar  WHERE liquidada=0 AND nome="'+it+'") ORDER BY data', [], model.querySuccessReceberName, model.errorCB);
        model.isTransaction=1;
    },
    prepareModelNameReceber: function(){
       model.database.transaction(model.getNameReceberQuery, model.errorCB);
       model.isTransaction=1;
    },
    getNameReceberQuery: function(){
        var it = window.localStorage.getItem("name");
        model.database.executeSql('SELECT * FROM ( SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 1 AS tabela FROM receber WHERE nome="'+it+'" UNION SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 0 AS tabela FROM pagar  WHERE nome="'+it+'") ORDER BY data', [], model.querySuccessReceberName, model.errorCB);
        model.isTransaction=1;
    },
    querySuccessReceberName:function(results) {
        if(results)
        {
            model.results = new Array();
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                obj.tabela = results.rows.item(i).tabela;
                model.results.push(obj);
            }
            var event = new Event("model.recebername.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    prepareModelItemReceber: function(){
       model.database.transaction(model.getItemReceberQuery, model.errorCB);
       model.isTransaction=1;
    },
    getItemReceberQuery: function(){
        var it = window.localStorage.getItem("item");
        model.database.executeSql('SELECT * FROM receber WHERE id=?', [it], model.querySuccessReceberItem, model.errorCB);
        model.isTransaction=1;
    },
    querySuccessReceberItem:function(results) {
        if(results)
        {
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                model.item=obj;
            }
          //  var event = new Event("model.receberitem.ready");
           // document.dispatchEvent(event);
           model.getItemDiscounts(model.item.id);
        }
        model.isTransaction=0;
    },    
    getItemDiscounts: function(id_tabela){
        model.database.executeSql('SELECT * FROM discount WHERE id_tabela=? AND tipo=1', [id_tabela], model.querySuccessReceberItemDiscounts, model.errorCB);
        model.isTransaction=1;
    },
    querySuccessReceberItemDiscounts:function(results) {
        if(results)
        {
            model.results2=new Array();
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.tipo = results.rows.item(i).tipo;
                obj.id_tabela = results.rows.item(i).id_tabela;
                obj.data = results.rows.item(i).data;
                obj.valor = results.rows.item(i).valor;
                model.results2.push(obj);
            }
            var event = new Event("model.receberitem.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    errorCB:function(err) {
          navigator.notification.alert("Error processing SQL: "+err.code, function(){}, 'SimpleDebt', 'ok');
          model.isTransaction=0;
    },
    addReceber: function(nome, valor, descricao){
        var date = new Date();
        var dateStr = date.getDay()+'/'+date.getDate()+'/'+date.getFullYear();
        model.database.executeSql('INSERT INTO receber (nome, data, valor, descricao) VALUES (?, date("now"),?,?)', [nome, valor, descricao], model.querySuccessAddReceber,  model.queryErrorAddReceber);
        model.isTransaction=1;
    },  
    updateReceber: function(id, nome, valor, descricao){
        model.database.executeSql('UPDATE receber set nome=?, valor=?, descricao=? WHERE id=?', [nome, valor, descricao, id], model.querySuccessUpdateReceber,  model.queryErrorUpdateReceber);
        model.isTransaction=1;
    }, 
    updateReceberAbater:function(id_tabela, valor, final, liquidar){
        model.database.executeSql('INSERT INTO discount (tipo, id_tabela, data, valor) VALUES (1, ?, date("now"), ?)', [id_tabela, valor], function(){
             model.database.executeSql('UPDATE receber set valor=?, liquidada=? WHERE id=?', [final, liquidar, id_tabela], model.querySuccessUpdateReceber,  model.queryErrorUpdateReceber);
             model.isTransaction=1;
        }, model.queryErrorUpdateReceber);
    },
    liquidaReceber: function(id){
        model.database.executeSql('UPDATE receber set liquidada=1 WHERE id=?', [id], model.successLiquidaReceber,  model.errorLiquidaReceber);
        model.isTransaction=1;
    },
    deleteReceber: function(id){
        model.database.executeSql('DELETE FROM receber WHERE id=?', [id], model.sucessDeleteReceber, model.errorDeleteReceber);
        model.isTransaction=1;
    },
     //----------- HANDLERS
    querySuccessAddReceber: function(){
        var event = new Event("model.add.receber.sucess");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
     queryErrorAddReceber: function(err){
        navigator.notification.alert("Erro ao introduzir item " + err.code, function(){}, 'SimpleDebt', 'ok');
        var event = new Event("model.add.receber.error");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
     querySuccessUpdateReceber: function(){
        //var event = new Event("model.update.receber.sucess");
        var event = new Event("model.goto.name");
        document.dispatchEvent(event);
    },
     queryErrorUpdateReceber: function(){
        var event = new Event("model.update.receber.error");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },       
    successLiquidaReceber: function(){
        var event = new Event("model.liquida.receber.sucess");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
    errorLiquidaReceber: function(){
        var event = new Event("model.liquida.receber.error");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
    successDeleteReceber: function(){
        var event = new Event("model.delete.receber.sucess");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
    errorDeleteReceber: function(){
        var event = new Event("model.delete.receber.error");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
    //**************************************************** @RECEBER *************************************************//
    //**************************************************** PAGAR *************************************************//
    prepareModelPagar: function(){
        model.database.transaction(model.getListaPagarQuery, model.errorCB);
    },
    getListaPagarQuery: function(){
        model.database.executeSql('SELECT * FROM pagar', [], model.querySuccessPagar, model.errorCB);
        model.isTransaction=1;
    },
    querySuccessPagar:function(results) {
        if(results)
            {
            var len = results.rows.length;
            model.results = new Array();
            for (var i=0; i<len; i++){
                    var obj = new Object();
                    obj.id = results.rows.item(i).id;
                    obj.valor = results.rows.item(i).valor;
                    obj.nome = results.rows.item(i).nome;
                    obj.data = results.rows.item(i).data;
                    obj.descricao = results.rows.item(i).descricao;
                    obj.liquidada = results.rows.item(i).liquidada;
                    model.results.push(obj);
                }
            var event = new Event("model.pagar.ready");
            document.dispatchEvent(event);
            }
            model.isTransaction=0;
    },
    getPagarNaoLiquidadasName: function(){
        var it = window.localStorage.getItem("name");
        model.database.executeSql('SELECT * FROM ( SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 1 AS tabela FROM pagar WHERE liquidada=0 AND nome="'+it+'" UNION SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 0 AS tabela FROM receber  WHERE liquidada=0 AND nome="'+it+'") ORDER BY data', [], model.querySuccessPagarName, model.errorCB);
        model.isTransaction=1;
    },
    prepareModelNamePagar: function(){
       model.database.transaction(model.getNamePagarQuery, model.errorCB);
       model.isTransaction=1;
    },
    getNamePagarQuery: function(){
        var it = window.localStorage.getItem("name");
        model.database.executeSql('SELECT * FROM ( SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 1 AS tabela FROM pagar WHERE nome="'+it+'" UNION SELECT DISTINCT id, nome, data, valor, descricao, liquidada, 0 AS tabela FROM receber  WHERE nome="'+it+'") ORDER BY data', [], model.querySuccessPagarName, model.errorCB);
        model.isTransaction=1;
    },
    querySuccessPagarName:function(results) {
        if(results)
        {
            model.results = new Array();
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                obj.tabela = results.rows.item(i).tabela;
                model.results.push(obj);
            }
            var event = new Event("model.pagarname.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    getPagarAllGroup: function(){
        model.database.executeSql('SELECT id, nome, data, liquidada, SUM(valor) AS valor FROM pagar GROUP BY nome ORDER By nome', [], model.queryPagarSuccessGroup, model.errorCB);
        model.isTransaction=1;
    },
    getPagarNaoLiquidadaGroup: function(){
        model.database.executeSql('SELECT * FROM (SELECT id, nome, data, liquidada, SUM(valor) AS valor FROM pagar GROUP BY nome ORDER By nome) WHERE valor >0', [], model.queryPagarSuccessGroup, model.errorCB);
        model.isTransaction=1;
    },
    getPagarLiquidadaGroup: function(){
        model.database.executeSql('SELECT * FROM (SELECT id, nome, data, liquidada, SUM(valor) AS valor FROM pagar GROUP BY nome ORDER By nome) WHERE valor =0', [], model.queryPagarSuccessGroup, model.errorCB);
        model.isTransaction=1;
    },
    getListaPagar: function(){
        return(model.results);
    },
    getPagarLiquidadas: function(){
        model.database.executeSql('SELECT * FROM pagar WHERE liquidada=1', [], model.querySuccessPagar, model.errorCB);
        model.isTransaction=1;
    },
    getPagarNaoLiquidadas: function(){
        model.database.executeSql('SELECT * FROM pagar WHERE liquidada=0', [], model.querySuccessPagar, model.errorCB);
        model.isTransaction=1;
    },
    prepareModelItemPagar: function(){
       model.database.transaction(model.getItemPagarQuery, model.errorCB);
    },
    getItemPagarQuery: function(){
        var it = window.localStorage.getItem("item");
        model.database.executeSql('SELECT * FROM pagar WHERE id=?', [it], model.querySuccessPagarItem, model.errorCB);
        model.isTransaction=1;
    },
    queryPagarSuccessGroup:function(results) {
        if(results)
        {
            var len = results.rows.length;
            model.results = new Array();
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                model.results.push(obj);
            }

            var event = new Event("model.pagargroup.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    querySuccessPagarItem:function(results) {
        if(results)
        {
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.valor = results.rows.item(i).valor;
                obj.nome = results.rows.item(i).nome;
                obj.data = results.rows.item(i).data;
                obj.descricao = results.rows.item(i).descricao;
                obj.liquidada = results.rows.item(i).liquidada;
                model.item=obj;
            }
           // var event = new Event("model.pagaritem.ready");
           // document.dispatchEvent(event);
           model.getItemPagarDiscounts(model.item.id);
        }
        model.isTransaction=0;
    },    
    getItemPagarDiscounts: function(id_tabela){
        model.database.executeSql('SELECT * FROM discount WHERE id_tabela=? AND tipo=2', [id_tabela], model.querySuccessPagarItemDiscounts, model.errorCB);
        model.isTransaction=1;
    },
    querySuccessPagarItemDiscounts:function(results) {
        if(results)
        {
            model.results2=new Array();
            var len = results.rows.length;
            for (var i=0; i<len; i++){
                var obj = new Object();
                obj.id = results.rows.item(i).id;
                obj.tipo = results.rows.item(i).tipo;
                obj.id_tabela = results.rows.item(i).id_tabela;
                obj.data = results.rows.item(i).data;
                obj.valor = results.rows.item(i).valor;
                model.results2.push(obj);
            }
            var event = new Event("model.pagaritem.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },
    updatePagar: function(id, nome, valor, descricao){
        model.database.executeSql('UPDATE pagar set nome=?, valor=?, descricao=? WHERE id=?', [nome, valor, descricao, id], model.querySuccessUpdatePagar,  model.queryErrorUpdatePagar);
        model.isTransaction=1;
    }, 
    addPagar: function(nome, valor, descricao){
        var date = new Date();
        var dateStr = date.getDay()+'/'+date.getDate()+'/'+date.getFullYear();
        model.database.executeSql('INSERT INTO pagar (nome, data, valor, descricao) VALUES (?,date("now"),?,?)', [nome, valor, descricao], model.querySuccessAddPagar,  model.queryErrorAddPagar);
        model.isTransaction=1;
    },  
    updatePagarAbater:function(id_tabela, valor, final, liquidar){
        model.database.executeSql('INSERT INTO discount (tipo, id_tabela, data, valor) VALUES (2, ?, date("now"), ?)', [id_tabela, valor], function(){
             model.database.executeSql('UPDATE pagar set valor=?, liquidada=? WHERE id=?', [final, liquidar, id_tabela], model.querySuccessUpdatePagar,  model.queryErrorUpdatePagar);
             model.isTransaction=1;
        }, model.queryErrorUpdatePagar);
    },
    updatePagar: function(id, nome, valor, descricao){
        model.database.executeSql('UPDATE pagar set nome=?, valor=?, descricao=? WHERE id=?', [nome, valor, descricao, id], model.querySuccessUpdatePagar,  model.queryErrorUpdatePagar);
        model.isTransaction=1;
    },  
    liquidaPagar: function(id){
        model.database.executeSql('UPDATE pagar set liquidada=1 WHERE id=?', [id], model.successLiquidaPagar,  model.errorLiquidaPagar);
        model.isTransaction=1;
    },
    deletePagar: function(id){
        model.database.executeSql('DELETE FROM pagar WHERE id=?', [id], model.sucessDeletePagar, model.errorDeletePagar)    
        model.isTransaction=1;
    },
     //----------- HANDLERS
    querySuccessAddPagar: function(){
        var event = new Event("model.add.pagar.sucess");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
     queryErrorAddPagar: function(err){
         navigator.notification.alert("Erro ao introduzir item " + err.code, function(){}, 'SimpleDebt', 'ok');
        var event = new Event("model.add.pagar.error");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
     querySuccessUpdatePagar: function(){
        //var event = new Event("model.update.pagar.sucess");
        var event = new Event("model.goto.pagarname");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
     queryErrorUpdatePagar: function(){
        var event = new Event("model.update.pagar.error");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },       
    successLiquidaPagar: function(){
        var event = new Event("model.liquida.pagar.sucess");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
    errorLiquidaPagar: function(){
        var event = new Event("model.liquida.pagar.error");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
    successDeletePagar: function(){
        var event = new Event("model.delete.pagar.sucess");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
    errorDeletePagar: function(){
        var event = new Event("model.delete.pagar.error");
        document.dispatchEvent(event);
        model.isTransaction=0;
    },
    //**************************************************** @RECEBER *************************************************//
};