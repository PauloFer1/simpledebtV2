var model ={
    database:"",
    results:new Array(),
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
    getReceberLiquidadas: function(){
        model.database.executeSql('SELECT * FROM receber WHERE liquidada=1', [], model.querySuccess, model.errorCB);
        model.isTransaction=1;
    },
    getReceberNaoLiquidadas: function(){
        model.database.executeSql('SELECT * FROM receber WHERE liquidada=0', [], model.querySuccess, model.errorCB);
        model.isTransaction=1;
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
        var event = new Event("model.update.receber.sucess");
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
            var event = new Event("model.pagaritem.ready");
            document.dispatchEvent(event);
        }
        model.isTransaction=0;
    },    
    addPagar: function(nome, valor, descricao){
        var date = new Date();
        var dateStr = date.getDay()+'/'+date.getDate()+'/'+date.getFullYear();
        model.database.executeSql('INSERT INTO pagar (nome, data, valor, descricao) VALUES (?,date("now"),?,?)', [nome, valor, descricao], model.querySuccessAddPagar,  model.queryErrorAddPagar);
        model.isTransaction=1;
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
        var event = new Event("model.update.pagar.sucess");
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