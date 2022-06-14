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

$('#btnGravar').click(function() {
    const ids = ['descricao', 'fornecedor'];
    if (validadeData(ids, 'registration')){
        let fields = {};

        ids.forEach(id => {
            fields[$(`#registration #${id}`).attr('name')] = $(`#${id}`).val();
        });

        fetch('http://localhost:3000/planocontas',{
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

function addTable(){
    fetch('http://localhost:3000/planocontas', {
        method: 'GET'
    }).then(response => {
        if (response.ok) return response.json();
        else showAlert('Erro na resposta do servidor');
        
    }).then(planos => {
        if (planos.length >= 0){
            let table = '';
            $('#plano tr').remove();
            planos.forEach(plano => {
                table += '<tr>' + 
                        `<th scope="row">${plano.id}    </th>` +
                        `<th>${plano.descricao}         </th>` +
                        `<th>${plano.id_fornecedor}     </th>` +
                        `<th>\
                            <button type="button" data-code="${plano.id}" class="btn btn-secondary alterar" >\
                                Alterar\
                            </button>\
                            <button type="button" data-code="${plano.id}" class="btn btn-danger delete" >\
                                Excluir\
                            </button>\
                        </th>` +
                    '</tr>'
            });
            $('#plano').append(table);

            $('.delete').each(function() {
                $(this).click(function(){
                    const code = $(this).attr('data-code');

                    $('#pop-up').addClass('active');
                    $('#pop-up button').each(function(){
                        $(this).click(function(){
                            if($(this).val()){
                                fetch(`http://localhost:3000/planocontas/${code}`,{
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
                
                fetch(`http://localhost:3000/planocontas/${code}`, {
                    method: 'GET'
                }).then(response => {
                    if (response.ok) 
                        return response.json();
                    else
                        alert('Erro na resposta do servidor')
                }).then(conta => {
                    $('#edit input').each(function(pos){
                        console.log(conta,pos)
                        if (pos != 0)
                            this.value = conta[0][$(this).attr('name')];

                        else
                            this.value = code;
                    });
                });

                $('#btn2Gravar').click(() => {
                    const ids = ['descricao', 'fornecedor'];
                    if(validadeData(ids, 'edit')){
                        let fields = {};
                        ids.forEach(id => {
                            fields[$(`#edit #${id}Dt`).attr('name')] = $(`#${id}Dt`).val();
                        });

                        fetch(`http://localhost:3000/planocontas/${code}`, {
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
            $('#clients ul').remove();
    });
}

addTable()