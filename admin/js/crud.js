/********************************************************************
 * Objetivo: Sistema de cadastro, edição, exclusão e listagem de filmes
 * Data: 20/11/2024
 * Autor: Luan, Caio e Lucas
 * Versão: 1.0
 ********************************************************************/

const botaoSalvar = document.getElementById('salvar')


const getDadosForm = function(){
    let filmeJSON = {}
    let status = true

    let nomefilme       = document.getElementById('nome')
    let descricaofilme  = document.getElementById('sinopse')
    let fotofilme       = document.getElementById('image')
    let valorfilme      = document.getElementById('valor')

    if(nomefilme == '' || descricaofilme == '' || fotofilme == '' || valorfilme == ''){
        alert('Todos os dados devem ser preenchidos.')
        status = false
    }else{
        filmeJSON.nome     = nomefilme.value
        filmeJSON.sinopse  = descricaofilme.value
        filmeJSON.image     = fotofilme.value
        filmeJSON.valor     = valorfilme.value
    }

    if(status){
        return filmeJSON
    }else{
        return false
    }

}

const postfilme = async function(dadosfilme){
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/novo/filme'

    let response = await fetch(url, {
        method: 'POST',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dadosfilme)
    })

    if(response.status == 201){
        alert('Registro inserido com sucesso.')
        getfilmes()
    }else{
        alert('Não foi possível inserir o filme, verifique os dados encaminhados.')
    }
}

const putfilme = async function(dadosfilme){

    let id = sessionStorage.getItem('idfilme')

    alert(id)
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/atualizar/filme/${id}`

    let response = await fetch(url, {
        method: 'PUT',
        mode: 'cors',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(dadosfilme)
    })

    if(response.status == 200){
        alert('Registro atualizado com sucesso.')
        getfilmes()
    }else{
        alert('Não foi possível atualizar o filme, verifique os dados encaminhados.')
    }

}

const deletefilme = async function(id){
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/excluir/filme/${id}`

    let response = await fetch(url, {
        method: 'DELETE'
    })

    if(response.status == 200){
        alert('Registro excluído com sucesso!')
        getfilmes()
    }else{
        alert('Não foi possível excluir o registro.')
    }
}

const getfilmes = async function(){
    let url = 'https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/listar/filmes'

    let response = await fetch(url)

    let dados = await response.json()

    setCardItens(dados)
}

const setCardItens = function(dadosfilmes){
    let divListDados = document.getElementById('listDados')

    divListDados.innerText = ''

    dadosfilmes.filmes.forEach(function(filmes){

        //Cria os elementos no HTML
        let divDados    = document.createElement('div')
        let divNome    = document.createElement('div')  
        let divValor    = document.createElement('div')
        let divOpcoes   = document.createElement('div')
        let spanEditar  = document.createElement('span')
        let spanExcluir = document.createElement('span')
        let imgEditar   = document.createElement('img')
        let imgExcluir  = document.createElement('img')

        divNome.innerText      = filmes.nome
        divValor.innerText      = filmes.valor


        divDados.setAttribute('id', 'dados')
        divDados.setAttribute('class', 'linha dados')
        imgEditar.setAttribute('src', 'icones/editar.png')
        imgExcluir.setAttribute('src', 'icones/excluir.png')

        imgEditar.setAttribute('idfilme', filmes.id)
        imgExcluir.setAttribute('idfilme', filmes.id)

        divListDados.appendChild(divDados)
        divDados.appendChild(divNome)
        divDados.appendChild(divValor)
        divDados.appendChild(divOpcoes)
        divOpcoes.appendChild(spanEditar)
        divOpcoes.appendChild(spanExcluir)
        spanEditar.appendChild(imgEditar)
        spanExcluir.appendChild(imgExcluir)


        imgExcluir.addEventListener('click',function(){
            let id = imgExcluir.getAttribute('idfilme')
            let resposta = confirm('Deseja realmente excluir o filme?')
            if(resposta){
                deletefilme(id)
            }
        })

        imgEditar.addEventListener('click', function(){
            let id = imgEditar.getAttribute('idfilme')

            getBuscarfilme(id)

        })

    })


}

const getBuscarfilme = async function(id){
    let url = `https://app-avaliacao-brh0avd2ahegehac.brazilsouth-01.azurewebsites.net/projeto1/fecaf/buscar/filme/${id}`

    let response = await fetch(url)

    let dados = await response.json()

    if(response.status == 200){
        document.getElementById('nome').value = dados.filme[0].nome
        document.getElementById('sinopse').value = dados.filme[0].sinopse
        document.getElementById('image').value = dados.filme[0].image
        document.getElementById('valor').value = dados.filme[0].valor

        //Altera o texto do botão para a palavra Atualizar
        document.getElementById('salvar').innerText = 'Atualizar'

        //Guardando o ID do filme na área de sessão do navegador, para ser utilizado no put
        sessionStorage.setItem('idfilme',id)
    }

}

botaoSalvar.addEventListener('click', function(){
    //postfilme()
    let dados = getDadosForm()

    if(dados){
        //Validação para identificar qual requisição na API será realizado (POST ou PUT)
        if(document.getElementById('salvar').innerText == 'Salvar'){
            postfilme(dados)
        }else if(document.getElementById('salvar').innerText == 'Atualizar'){
            putfilme(dados)
        }
    }
})

window.addEventListener('load', function(){
    getfilmes()
})