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

                    }).then(data => {
                        showAlert(`${data.status} - Gerado o id ${data.id}`, 'success');
                        addTable();

                    }).catch(error => {
                        showAlert(error.message, 'danger');
                    })
                }
            })
        }
        else{
            showAlert('Para cadastrar um conta, ser?? necess??rio cadastrar um plano de conta');
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
        console.log(contas)
        if (contas.length >= 0){
            let table = '';
            $('#contas th').remove();
            contas.forEach(conta => {
                table += '<tr>' +
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
                                    <i class="fa-solid fa-pen-to-square"></i>\
                                </button>\
                                <button type="button" data-code="${conta.id}" class="btn btn-danger delete" >\
                                    <i class="fa-solid fa-trash"></i>\
                                </button>\
                            </th>` +
                        '</tr>'
            });
            $('#contas').append(table);
            
            $('.delete').each(function() {
                $(this).click(function(){
                    const code = $(this).attr('data-code');

                    $('#pop-up').addClass('active');
                    $('#pop-up button').each(function(){
                        $(this).click(function(){
                            if($(this).val()){
                                fetch(`http://localhost:3000/contapagar/${code}`,{
                                    method: 'DELETE'
                                }).then(response => {
                                    if (response.ok)
                                        return response.json();
                                    else
                                        showAlert('Erro na resposta do servidor');
                                }).then(data => {
                                    if (data.resultado){
                                        showAlert(`Cliente deletado com sucesso`, 'success');
                                    }
                                    else{
                                        showAlert('Erro ao deletar cliente');
                                    }
                                    addTable();
                        
                                }).catch(error => {
                                    showAlert(error.message, 'danger');
                                });
                            }
                            $('#pop-up').removeClass('active');
                        });
                    });
                });
            });

            $('.alterar').click(function(){
                var code = $(this).attr('data-code');

                $('#edit').addClass('active');
                $('#cancel-editor').click(() => {
                    $('#edit').removeClass('active');
                });
                
                fetch(`http://localhost:3000/contapagar/${code}`, {
                    method: 'GET'
                }).then(response => {
                    if (response.ok) 
                        return response.json();
                    else
                        alert('Erro na resposta do servidor')
                }).then(conta => {
                    $('#edit input').each(function(pos){
                        if ($('#edit input').length -1 == pos){
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
                                            $('#id-contaDt').append(`<option value="${item.id_fornecedor}">${item.id_fornecedor}</option>`)
                                        })        
                                    }
                                })
                        }
                        else if (pos != 0)
                            this.value = conta[$(this).attr('name')];

                        else
                            this.value = code;
                    });
                });

                $('#edited').click(() => {
                    const ids = ['documento', 'valor', 'vencimento', 'multa', 'juros', 'pagamento', 'id-conta'];
                    if(validadeData(ids, 'edit')){
                        let fields = {};
                        ids.forEach(id => {
                            fields[$(`#edit #${id}Dt`).attr('name')] = $(`#${id}Dt`).val();
                        });

                        fetch(`http://localhost:3000/contapagar/${code}`, {
                            method: 'PUT',
                            headers: {'Content-Type' : 'application/json'},
                            body: JSON.stringify(fields)
                        }).then(response => {
                            if (response.ok){
                                return response.json();
                            }
                            else{
                                showAlert('Erro na resposta do servidor');
                                $('#edit').removeClass('active');
                            }
                        }).then(data => {
                            showAlert(`Conta alterado com succeso`, 'success');
                            addTable()
                            $('#edit').removeClass('active');
                
                        }).catch(error => {
                            showAlert(error.message, 'danger');
                            $('#edit').removeClass('active');
                        })
                    }
                    else{
                        showAlert('Insere todos os campos');
                        $('#edit').removeClass('active');
                    }
                });
            });
        }
        else
            $('#contas tr').remove();
    });
}