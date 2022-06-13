fetch('http://localhost:3000/planocontas', {
    method: 'GET'
    }).then(response => {
        if (response.ok) return response.json();
        else showAlert('Erro na resposta do servidor');

    }).then(planos => {
        if (planos.length > 0){
            
            let table = '';
            $('#contas th').remove();
            planos.forEach(plano => {
                total = parseFloat(plano.id_contaPagar.valor) + parseFloat(plano.id_contaPagar.valor) + parseFloat(plano.id_contaPagar.multa + plano.id_contaPagar.juros)
                table += '<tr>' +
                            `<th scope="row">${plano.id_contaPagar.data_pgto ? 'Pago' : ''} </th>` +
                            `<th>${plano.id_fornecedor}                                     </th>` +
                            `<th>${plano.descricao}                                         </th>` +
                            `<th>${plano.id_contaPagar.vencimento}                    </th>` +
                            `<th>${total}                                                   </th>` +
                            `<th>${plano.id_contaPagar.data_pgto}                           </th>` +
                            `<th>${total}                                                   </th>`
            });
            $('#contas').append(table);
        }
    })