// script.js

document.getElementById('nivel').addEventListener('input', function() {
    const nivel = parseInt(this.value);
    let maestria;

    if (nivel >= 1 && nivel <= 4) {
        maestria = 2;
    } else if (nivel >= 5 && nivel <= 8) {
        maestria = 3;
    } else if (nivel >= 9 && nivel <= 12) {
        maestria = 4;
    } else if (nivel >= 13 && nivel <= 16) {
        maestria = 5;
    } else if (nivel >= 17 && nivel <= 20) {
        maestria = 6;
    } else if (nivel >= 21 && nivel <= 24) {
        maestria = 7;
    } else if (nivel >= 25 && nivel <= 28) {
        maestria = 8;
    } else if (nivel >= 29 && nivel <= 30) {
        maestria = 9;
    }

    document.getElementById('maestria').value = maestria;
});

//Parte das pericais e modificadores
function getNivel() {
    const nivel = parseInt(document.querySelector('#nivel').value) || 0;
    return nivel;
}

function getMaestria() {
    const maestria = parseInt(document.querySelector('#maestria').value) || 0;
    return maestria;
}

function getModificador(atributo) {
    const valor = parseInt(document.querySelector(`#${atributo}`).value) || 0;
    return Math.floor((valor - 10) / 2);
}

function atualizarModificadores() {
    const atributos = ['FOR', 'DEX', 'CON', 'INT', 'SAB', 'CAR'];
    atributos.forEach(atributo => {
        const modificador = getModificador(atributo);
        document.querySelector(`#mod-${atributo}`).textContent = modificador >= 0 ? `+${modificador}` : modificador;
    });
}

function calcularTotal() {
    const nivel = getNivel();
    const maestria = getMaestria();
    const base = Math.floor(nivel / 2);

    document.querySelectorAll('tbody tr').forEach(row => {
        const outrosEl = row.querySelector('.outros');
        const maestriaEl = row.querySelector('.maestria');
        const especializacaoEl = row.querySelector('.especializacaoPr');
        const atributoEl = row.querySelector('.atributo');
        const totalEl = row.querySelector('.total');

        const outros = parseInt(outrosEl.value) || 0;
        const mt = maestriaEl.checked ? maestria : 0;
        const es = especializacaoEl.checked ? Math.ceil(maestria / 2) : 0;
        const modificador = getModificador(atributoEl.getAttribute('data-atributo'));

        const total = base + outros + mt + es + modificador;
        totalEl.textContent = `+${total}`;
    });
}

document.querySelectorAll('.outros, .maestria, .especializacaoPr').forEach(element => {
    element.addEventListener('change', calcularTotal);
});

document.querySelectorAll('#FOR, #DEX, #CON, #INT, #SAB, #CAR').forEach(element => {
    element.addEventListener('change', () => {
        atualizarModificadores();
        calcularTotal();
    });
});


atualizarModificadores();
calcularTotal();

// Função PE E PV
function getMaiorModificadorINTouSAB() {
    const inteligencia = parseInt(document.querySelector('#INT').value) || 10;
    const sabedoria = parseInt(document.querySelector('#SAB').value) || 10;
    const modInteligencia = Math.floor((inteligencia - 10) / 2);
    const modSabedoria = Math.floor((sabedoria - 10) / 2);
    const maiorModificador = Math.max(modInteligencia, modSabedoria);
    return maiorModificador;
}

function getMaiorModificadorCARouSAB() {
    const carisma = parseInt(document.querySelector('#CAR').value) || 10;
    const sabedoria = parseInt(document.querySelector('#SAB').value) || 10;
    const modCarisma = Math.floor((carisma - 10) / 2);
    const modSabedoria = Math.floor((sabedoria - 10) / 2);
    const maiorModificador = Math.max(modCarisma, modSabedoria);
    return maiorModificador;
}

function getNivel() {
    const nivel = parseInt(document.querySelector('#nivel').value) || 1;
    return nivel;
}

function getModificadorConstituicao() {
    const constituicao = parseInt(document.querySelector('#CON').value) || 10;
    const modificador = Math.floor((constituicao - 10) / 2);
    return modificador;
}

function calcularPontosDeVida() {
    const nivel = getNivel();
    const especializacao = document.querySelector('#especializacao').value;
    let pvMax = 0;
    const modCon = getModificadorConstituicao();

    if (especializacao === 'Lutador') {
        pvMax = 12 + modCon; 
        for (let i = 2; i <= nivel; i++) {
            pvMax += 6 + modCon; 
        }
    }

    if (especializacao === 'Especialista em Combate') {
        pvMax = 12 + modCon; 
        for (let i = 2; i <= nivel; i++) {
            pvMax += 6 + modCon; 
        }
    }

    if (especializacao === 'Especialista em Técnica') {
        pvMax = 10 + modCon; 
        for (let i = 2; i <= nivel; i++) {
            pvMax += 5 + modCon; 
        }
    }
    
    if (especializacao === 'Controlador') {
        pvMax = 10 + modCon; 
        for (let i = 2; i <= nivel; i++) {
            pvMax += 5 + modCon; 
        }
    }
    
    if (especializacao === 'Suporte') {
        pvMax = 10 + modCon; 
        for (let i = 2; i <= nivel; i++) {
            pvMax += 5 + modCon; 
        }
    }

    if (especializacao === 'Restringido') {
        pvMax = 16 + modCon; 
        for (let i = 2; i <= nivel; i++) {
            pvMax += 7 + modCon; 
        }
    }

    document.querySelector('#pvMax').value = pvMax;
}

function calcularPontosDeEnergia() {
    const nivel = getNivel();
    const especializacao = document.querySelector('#especializacao').value;
    let peMax = 0;

    if (especializacao === 'Lutador') {
        peMax = 4;
        for (let i = 2; i <= nivel; i++) {
            peMax += 4;

        } 
    }

    if (especializacao === 'Especialista em Combate') {
        peMax = 4;
        for (let i = 2; i <= nivel; i++) {
            peMax += 4;

        } 
    }

    if (especializacao === 'Especialista em Técnica') {
        const maiorMod = getMaiorModificadorINTouSAB();
        peMax = 6 + maiorMod; 
        for (let i = 2; i <= nivel; i++) {
            peMax += 6; 
        }
    }

    if (especializacao === 'Suporte') {
        const maiorMod = getMaiorModificadorCARouSAB();
        peMax = 5 + maiorMod; 
        for (let i = 2; i <= nivel; i++) {
            peMax += 5; 
        }
    }

    if (especializacao === 'Controlador') {
        const maiorMod = getMaiorModificadorCARouSAB();
        peMax = 5 + maiorMod; 
        for (let i = 2; i <= nivel; i++) {
            peMax += 5; 
        }
    }

    if (especializacao === 'Restringido') {
        peMax = 4;
        for (let i = 2; i <= nivel; i++) {
            peMax += 4;

        } 
    }

    document.querySelector('#peMax').value = peMax;
}

function atualizarLabelEnergia() {
    const especializacao = document.querySelector('#especializacao').value.toLowerCase();
    const peLabel = document.querySelector('#pe-label');
    const peAtualLabel = document.querySelector('#pe-atual-label');
    const peTempLabel = document.querySelector('#pe-temp-label');

    if (especializacao === 'restringido') {
        peLabel.textContent = 'Pontos de Vigor Máximos (PV Max):';
        peAtualLabel.textContent = 'Pontos de Vigor Atuais (PV Atual):';
        peTempLabel.textContent = 'Pontos de Vigor Temporários (PE Temp):';
    } else {
        peLabel.textContent = 'Pontos de Energia Máximos (PE Max):';
        peAtualLabel.textContent = 'Pontos de Energia Atuais (PE Atual):';
        peTempLabel.textContent = 'Pontos de Energia Temporários (PE Temp):';
    }
}

document.querySelector('#especializacao').addEventListener('change', () => {
    calcularPontosDeVida();
    calcularPontosDeEnergia();
    atualizarLabelEnergia();
});
document.querySelector('#nivel').addEventListener('input', () => {
    calcularPontosDeVida();
    calcularPontosDeEnergia();
});
document.querySelector('#CON').addEventListener('input', calcularPontosDeVida);
document.querySelector('#INT').addEventListener('input', () => {
    calcularPontosDeEnergia();
});
document.querySelector('#SAB').addEventListener('input', () => {
    calcularPontosDeEnergia();
});
document.querySelector('#CAR').addEventListener('input', () => {
    calcularPontosDeEnergia();
});

calcularPontosDeVida();
calcularPontosDeEnergia();
