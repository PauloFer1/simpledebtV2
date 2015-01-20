var translate ={
        lang_pt: {historico: 'Histórico', receber: 'a receber', areceber: 'A receber', pagar: 'a pagar', apagar: 'A pagar', saldo:'saldo atual', por_liquidar:'Por liquidar', liquidadas:'Liquidadas', todas:'Todas',liquidada:'Liquidada',nome:'Nome', data:'Data', valor:'Valor', filtrar:'filtrar por', adicionar:'adicionar', estado:'Estado:', descricao:'Descrição', inserir:'Inserir', deve:'Deve-me', abateu:'Abateu', abati:'Abati', salvar:'salvar', liquidar:'liquidar'},
        lang_en: {historico: 'Historic', receber: 'to receive', areceber: 'To receive', pagar: 'to pay', apagar: 'To pay', saldo:'current balance', por_liquidar:'Not liquidated', liquidadas:'Liquidated', todas:'All', liquidada:'Liquidated', nome:'Name', data:'Date', valor:'Value', filtrar:'filter by', adicionar:'add new', estado:'State:', descricao:'Description', inserir:'Insert', deve:'Owe me', abateu:'Discount', abati:'Discount', salvar:'save', liquidar:'liquidate'},
        alert_pt:{liquidar:'Liquidar dívida?', abater:'Abater', valor_abater:'Valor a abater superior à dívida!', valor_abater_inv:'Valor a abater inválido!', valor_inv:'Valor inválido!', nome_inv:'Nome inválido!', apagar:'Apagar item?'},
        alert_en:{liquidar:'Liquidate debt?', abater:'Discount', valor_abater:'Value to discount higher than debt!', valor_abater_inv:'Invalid value to discount!', valor_inv:'Invalid value!', nome_inv:'Invalid name!', apagar:'Delete item?'},
        confirm_pt:{sim:'sim', nao:'não', a:'a'},
        confirm_en:{sim:'yes', nao:'no', a:'to'},
        act_lang: "",
        alert_lang:"",
        confirm_lang:"",
        currency: "",
        
        initialize: function(lang){
            if(lang=="pt-PT")
            {
                translate.act_lang = translate.lang_pt;
                translate.alert_lang = translate.alert_pt;
                translate.confirm_lang = translate.confirm_pt;
            }
            else
            {
                translate.act_lang = translate.lang_en;
                translate.alert_lang = translate.alert_en;
                translate.confirm_lang = translate.confirm_en;
            }
        }
    };
    
    