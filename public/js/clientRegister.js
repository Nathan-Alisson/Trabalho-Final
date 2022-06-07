function validadeData(ids, tagId){
    let ok = true;
    let dt = tagId == 'edit' ? 'Dt' : ''

    ids.forEach(id => {
        if (!$(`#${tagId} #${id+dt}`).val())
            ok = false;
    })

    return ok;
}

function showAlert(msg, color='warning'){
    $('[data-message]').children().remove()
    $('[data-message]').attr('class', `alert alert-${color}`)
    $('[data-message]').append(`<p>${msg}</p>`);
}

$('#submit').click(() => {
    const ids = ['name', 'date', 'rg', 'cpf', 'tel', 'email', 'city', 'uf'];
    if(validadeData(ids, 'registration')){
        let fields = {};
        ids.forEach(id => {
            fields[$(`#registration #${id}`).attr('name')] = $(`#${id}`).val();
        });

        fetch('http://localhost:3000/clients/', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(fields)
        }).then(response => {
            if (response.ok){
                return response.json();
            }
            else{
                showAlert('Erro na resposta do servidor');
            }
        }).then(data => {
            showAlert(`${data.status} - Gerado o id ${data.code}`, 'success');
            addTable()

        }).catch(error => {
            showAlert(error.message, 'danger');
        })
    }
    else{
        showAlert('Insere todos os campos');
    }
})

addTable()
function addTable(){
    fetch('http://localhost:3000/clients/', {
        method: 'GET'
    }).then(response => {
        if (response.ok) 
            return response.json();
        else
            showAlert('Erro na resposta do servidor');
    }).then(clients => {
        if (clients.length >= 0){
            let table = '';
            $('#clients ul').remove();

            clients.forEach(client => {
                table += '<ul>' +
                            `<li>${client.code}  </li>` +
                            `<li>${client.name}  </li>` +
                            `<li>${client.rg}    </li>` +
                            `<li>${client.cpf}   </li>` +
                            `<li>${client.date}  </li>` +
                            `<li>${client.tel}   </li>` +
                            `<li>${client.email} </li>` +
                            `<li>${client.city} - ${client.uf} </li>` +
                            `<li>\
                                <button type="button" data-code="${client.code}" class="alterar" >\
                                    Alterar\
                                </button>\
                                <button type="button" data-code="${client.code}" class="delete" >\
                                    Excluir\
                                </button>\
                            </li>` +
                        '</ul>'
            })
            $('#clients').append(table);
            
            $('.delete').each(function() {
                $(this).click(function(){
                    fetch(`http://localhost:3000/clients/${$(this).attr('data-code')}`,{
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
                });
            });

            $('.alterar').click(function(){
                var code = $(this).attr('data-code');

                $('#edit').addClass('active');
                $('#cancel-editor').click(() => {
                    $('#edit').removeClass('active');
                });
                
                fetch(`http://localhost:3000/clients/${code}`, {
                    method: 'GET'
                }).then(response => {
                    if (response.ok) 
                        return response.json();
                    else
                        alert('Erro na resposta do servidor')
                }).then(client => {
                    $('#edit input').each(function(pos){
                        if (pos != 0)
                            this.value = client[$(this).attr('name')];
                        else
                            this.value = code;
                    });
                });

                $('#edited').click(() => {
                    const ids = ['name', 'date', 'rg', 'cpf', 'tel', 'email', 'city', 'uf'];
                    if(validadeData(ids, 'edit')){
                        let fields = {};
                        ids.forEach(id => {
                            fields[$(`#edit #${id}Dt`).attr('name')] = $(`#${id}Dt`).val();
                        });

                        console.log(code)
                        fetch(`http://localhost:3000/clients/${code}`, {
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
                            showAlert(`Cliente Alterado com succeso`, 'success');
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

$('#cancel').click(function(){
    $('#registration input').each(function(){
        $(this).val('')
    })
})