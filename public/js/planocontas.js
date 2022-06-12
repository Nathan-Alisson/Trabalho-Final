// Message Alert 
function showAlert(msg, color='warning'){
    $('[data-message]').children().remove()
    $('[data-message]').attr('class', `alert alert-${color}`)
    $('[data-message]').append(`<p>${msg}</p>`);
}

// Validation
function validadeData(ids, tagId){
    let ok = true;
    let dt = tagId == 'edit' ? 'Dt' : ''

    ids.forEach(id => {
        if (!$(`#${tagId} #${id+dt}`).val())
            ok = false;
    })

    return ok;
}

fetch('http://localhost:3000/planocontas', {
    method: 'GET'
    }).then(response => {
        if (response.ok) return response.json();
        else showAlert('Erro na resposta do servidor');

    }).then(planos => {
        if (planos.length > 0){
            // ================ Update Table
            addTable();

            // ================ Add options in select
            planos.forEach(item => {
                $('#id-conta').append(`<option value="${item.id_fornecedor}">${item.id_fornecedor}</option>`)
            })
            
            // ================ Post
            $('#cadastrar').click(function(){
                const ids = ['documento', 'valor', 'vencimento', 'multa', 'juros', 'pagamento', 'id-conta'];
                console.log(validadeData(ids, 'registration'))
                if (validadeData(ids, 'registration')){
                    let fields = {};

                    ids.forEach(id => {
                        fields[$(`#registration #${id}`).attr('name')] = $(`#${id}`).val();
                    });
                    
                    fetch('http://localhost:3000/contapagar',{
                        method: 'POST',
                        headers: {'Content-Type' : 'application/json'},
                        body: JSON.stringify(fields)
                    }).then(response => {
                        if(response.ok) return response.json();
                        else showAlert('Erro na resposta do servidor');
                    })
                }
            })
        }
        else{
            showAlert('Para cadastrar um conta, será necessário cadastrar um plano de conta');
            $('input').each(function(){
                $(this).attr('disabled', true);
            })
        }
    })

    function addTable(){
        fetch('http://localhost:3000/contapagar', {
            method: 'GET'
        }).then(response => {
            if (response.ok) return response.json();
            else showAlert('Erro na resposta do servidor');
            
        }).then(contas => {
            if (contas.length >= 0){
                let table = '';
                $('#contas th').remove();
                contas.forEach(conta => {
                    table += 
                            `<th scope="row">${conta.id}        </th>` +
                            `<th>${conta.num_doc}   </th>` +
                            `<th>${conta.valor}     </th>` +
                            `<th>${conta.vencimento}</th>` +
                            `<th>${conta.multa}     </th>` +
                            `<th>${conta.juros}     </th>` +
                            `<th>${conta.data_pgto} </th>` +
                            `<th>${conta.id_conta}  </th>` +
                            `<th>\
                                <button type="button" data-code="${conta.id}" class="btn btn-secondary alterar" >\
                                    Alterar\
                                </button>\
                                <button type="button" data-code="${conta.id}" class="btn btn-danger delete" >\
                                    Excluir\
                                </button>\
                            </th>`
                });
                $('#contas').append(table);
            }
            else
                $('#clients ul').remove();
        });
    }