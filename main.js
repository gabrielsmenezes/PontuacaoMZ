// ==UserScript==
// @name         PontuacaoMZ
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Ferramenta que dá uma pontuação para seus jogadores para cada posição
// @author       Gabriel Menezes (mz_seds)
// @match        https://www.managerzone.com/*
// @grant        none
// ==/UserScript==

(function() {
    'use strict';
    setTimeout(() => {

        var players_container = document.getElementById("players_container");
        var players_html = players_container.children;



    var pesos =
        {
            "Goleiro": {
                "Velocidade":0.09,
                "Resistência":0.09,
                "Inteligência":0.09,
                "Passe Curto":0.02,
                "Chute":0,
                "Cabeceio":0,
                "Defesa a Gol":0.55,
                "Controle de Bola":0.09,
                "Desarme":0,
                "Passe Longo":0.02,
                "Bola Parada":0,
                "Experiência":0.05,
                "Forma":0
            },
            "Zagueiro": {
                "Velocidade":0.25,
                "Resistência":0.16,
                "Inteligência":0.07,
                "Passe Curto":0.02,
                "Chute":0,
                "Cabeceio":0,
                "Defesa a Gol":0.0,
                "Controle de Bola":0.08,
                "Desarme":0.3,
                "Passe Longo":0.07,
                "Bola Parada":0,
                "Experiência":0.05,
                "Forma":0
            },
            "Ancora": {
                "Velocidade":0.25,
                "Resistência":0.18,
                "Inteligência":0.05,
                "Passe Curto":0.05,
                "Chute":0,
                "Cabeceio":0.02,
                "Defesa a Gol":0.0,
                "Controle de Bola":0.1,
                "Desarme":0.25,
                "Passe Longo":0.05,
                "Bola Parada":0,
                "Experiência":0.05,
                "Forma":0
            },
            "Meio": {
                "Velocidade":0.15,
                "Resistência":0.15,
                "Inteligência":0.1,
                "Passe Curto":0.15,
                "Chute":0,
                "Cabeceio":0,
                "Defesa a Gol":0,
                "Controle de Bola":0.12,
                "Desarme":0.2,
                "Passe Longo":0.08,
                "Bola Parada":0,
                "Experiência":0.05,
                "Forma":0
            },
            "Ponta": {
                "Velocidade":0.25,
                "Resistência":0.2,
                "Inteligência":0.06,
                "Passe Curto":0.04,
                "Chute":0.05,
                "Cabeceio":0,
                "Defesa a Gol":0,
                "Controle de Bola":0.15,
                "Desarme":0.05,
                "Passe Longo":0.15,
                "Bola Parada":0,
                "Experiência":0.05,
                "Forma":0
            }
            ,
            "Atacante": {
                "Velocidade":0.2,
                "Resistência":0.15,
                "Inteligência":0.05,
                "Passe Curto":0.04,
                "Chute":0.25,
                "Cabeceio":0.11,
                "Defesa a Gol":0,
                "Controle de Bola":0.15,
                "Desarme":0,
                "Passe Longo":0,
                "Bola Parada":0,
                "Experiência":0.05,
                "Forma":0
            }
    }

    var habilidades = [
        "Velocidade",
        "Resistência",
        "Inteligência",
        "Passe Curto",
        "Chute",
        "Cabeceio" ,
        "Defesa a Gol",
        "Controle de Bola",
        "Desarme",
        "Passe Longo",
        "Bola Parada",
        "Experiência",
        "Forma"
    ]

    function calcularNotaPorPosicao(jogador, posicao) {
        let somatorioDaHabilidade = 0
        let somatorioDoPeso = 0
        habilidades.forEach(habilidade => {
            somatorioDaHabilidade = somatorioDaHabilidade + (jogador[habilidade] * pesos[posicao][habilidade])
            somatorioDoPeso = somatorioDoPeso + pesos[posicao][habilidade]
        })

        return somatorioDaHabilidade / somatorioDoPeso
    }

    function buscaHabilidadesDoJogador(allskillval) {
        let contador = 0
        let jogador = {}
        for (var i = 0; i < allskillval.length; i++) {
            let habilidade = habilidades[contador]
            if (!allskillval[i].innerText.includes("%")){
                jogador[habilidade] = allskillval[i].innerText.replace(/[()]/g, "")
                contador++
            }
        }
        return jogador
    }

    for (var i = 0; i < players_html.length; i++) {
        var player = players_html[i];
        var header = player.getElementsByClassName("subheader clearfix")[0];


        var allskillval = player.getElementsByClassName("skillval")



        var jogador = buscaHabilidadesDoJogador(allskillval)



        var goleiro = calcularNotaPorPosicao(jogador, "Goleiro")
        var zagueiro = calcularNotaPorPosicao(jogador, "Zagueiro")
        var ancora = calcularNotaPorPosicao(jogador, "Ancora")
        var meio = calcularNotaPorPosicao(jogador, "Meio")
        var ponta = calcularNotaPorPosicao(jogador, "Ponta")
        var atacante = calcularNotaPorPosicao(jogador, "Atacante")

        const posicoes = [
            {nome: "Goleiro", nota: goleiro},
            {nome:"Zagueiro", nota: zagueiro},
            {nome:"Ancora", nota: ancora},
            {nome:"Meio", nota: meio},
            {nome:"Ponta", nota: ponta},
            {nome:"Atacante", nota:atacante }
        ]

        posicoes.sort((a,b) => (a.nota > b.nota) ? -1: 1)


        var stringNota = ""

        posicoes.forEach(posicao => {
            stringNota = stringNota + `${posicao.nome}: ${posicao.nota.toFixed(3)} || `
        })

        var nota = document.createElement("span");
        var novaLinha = document.createElement("br");

        nota.textContent = stringNota

        if (!window.location.href.includes("transfer")) header.appendChild(novaLinha)
        header.appendChild(nota)

    }

        }, 10000)


})();
