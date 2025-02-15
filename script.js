// script.js

document.getElementById('nivel').addEventListener('input', function() {
    const nivel = parseInt(this.value);
    const maestria = Math.min(Math.floor((nivel - 1) / 4) + 2, 9);
    document.getElementById('maestria').value = maestria;
});

//Parte das pericais e modificadores
function getNivel() {
    return parseInt(document.querySelector('#nivel').value) || 0;
}

function getMaestria() {
    return parseInt(document.querySelector('#maestria').value) || 0;
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
        const outros = parseInt(row.querySelector('.outros').value) || 0;
        const maestriaElement = row.querySelector('.maestria');
        const especializacaoPrElement = row.querySelector('.especializacaoPr');
        const mt = maestriaElement && maestriaElement.checked ? maestria : 0;
        const es = especializacaoPrElement && especializacaoPrElement.checked ? Math.ceil(maestria / 2) : 0;
        const modificador = getModificador(row.querySelector('.atributo').getAttribute('data-atributo'));

        const total = base + outros + mt + es + modificador;
        row.querySelector('.total').textContent = `+${total}`;
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
function getMaiorModificador(atributos) {
    return Math.max(...atributos.map(atributo => getModificador(atributo)));
}

function getEspecializacaoNivel(especializacaoId) {
    return parseInt(document.querySelector(`#${especializacaoId}-nivel`).value) || 0;
}

function calcularPontosDeVida() {
    const nivelGeral = getNivel();
    const especializacao1 = document.querySelector('#especializacao1').value;
    const especializacao2 = document.querySelector('#especializacao2').value;
    const nivel1 = getEspecializacaoNivel('especializacao1');
    const nivel2 = getEspecializacaoNivel('especializacao2');
    const modCon = getModificador('CON');
    let pvMax = 0;

    const pvBase = {
        'Lutador': 12,
        'Especialista em Combate': 12,
        'Especialista em Técnica': 10,
        'Controlador': 10,
        'Suporte': 10,
        'Restringido': 16
    };

    const pvIncremento = {
        'Lutador': 6,
        'Especialista em Combate': 6,
        'Especialista em Técnica': 5,
        'Controlador': 5,
        'Suporte': 5,
        'Restringido': 7
    };

    const especializacaoPrincipal = nivel1 >= nivel2 ? especializacao1 : especializacao2;
    const especializacaoSecundaria = nivel1 >= nivel2 ? especializacao2 : especializacao1;
    const nivelPrincipal = nivel1 >= nivel2 ? nivel1 : nivel2;
    const nivelSecundario = nivel1 >= nivel2 ? nivel2 : nivel1;

    pvMax = pvBase[especializacaoPrincipal] + modCon;

    for (let i = 2; i <= nivelGeral; i++) {
        if (i <= nivelPrincipal) {
            pvMax += pvIncremento[especializacaoPrincipal] + modCon;
        } else {
            pvMax += pvIncremento[especializacaoSecundaria] + modCon;
        }
    }

    document.querySelector('#pvMax').value = pvMax;
    atualizarBarraVida();
}

function calcularPontosDeEnergia() {
    console.log('calcularPontosDeEnergia function called'); // Debugging line
    const nivelGeral = getNivel();
    const especializacao1 = document.querySelector('#especializacao1').value;
    const especializacao2 = document.querySelector('#especializacao2').value;
    const nivel1 = getEspecializacaoNivel('especializacao1');
    const nivel2 = getEspecializacaoNivel('especializacao2');
    let peMax = 0;

    console.log('Nivel Geral:', nivelGeral);
    console.log('Especializacao 1:', especializacao1, 'Nivel 1:', nivel1);
    console.log('Especializacao 2:', especializacao2, 'Nivel 2:', nivel2);

    const peBase = {
        'Lutador': 4,
        'Especialista em Combate': 4,
        'Especialista em Técnica': 6 + getMaiorModificador(['INT', 'SAB']),
        'Suporte': 5 + getMaiorModificador(['CAR', 'SAB']),
        'Controlador': 5 + getMaiorModificador(['CAR', 'SAB']),
        'Restringido': 4
    };

    const peIncremento = {
        'Lutador': 4,
        'Especialista em Combate': 4,
        'Especialista em Técnica': 6,
        'Suporte': 5,
        'Controlador': 5,
        'Restringido': 4
    };

    const especializacaoPrincipal = nivel1 >= nivel2 ? especializacao1 : especializacao2;
    const especializacaoSecundaria = nivel1 >= nivel2 ? especializacao2 : especializacao1;
    const nivelPrincipal = nivel1 >= nivel2 ? nivel1 : nivel2;
    const nivelSecundario = nivel1 >= nivel2 ? nivel2 : nivel1;

    peMax = peBase[especializacaoPrincipal];

    for (let i = 2; i <= nivelGeral; i++) {
        if (i <= nivelPrincipal) {
            peMax += peIncremento[especializacaoPrincipal];
        } else {
            peMax += peIncremento[especializacaoSecundaria];
        }
    }

    document.querySelector('#peMax').value = peMax;
    atualizarBarraEnergia();
}

function atualizarLabelEnergia() {
    const especializacao1 = document.querySelector('#especializacao1').value.toLowerCase();
    const especializacao2 = document.querySelector('#especializacao2').value.toLowerCase();
    const peLabel = document.querySelector('#pe-label');
    const peAtualLabel = document.querySelector('#pe-atual-label');
    const peTempLabel = document.querySelector('#pe-temp-label');

    if (especializacao1 === 'restringido' || especializacao2 === 'restringido') {
        peLabel.textContent = 'Pontos de Vigor Máximos (PV Max):';
        peAtualLabel.textContent = 'Pontos de Vigor Atuais (PV Atual):';
        peTempLabel.textContent = 'Pontos de Vigor Temporários (PE Temp):';
    } else {
        peLabel.textContent = 'Pontos de Energia Máximos (PE Max):';
        peAtualLabel.textContent = 'Pontos de Energia Atuais (PE Atual):';
        peTempLabel.textContent = 'Pontos de Energia Temporários (PE Temp):';
    }
}

function atualizarBarraVida() {
    const pvMax = parseInt(document.querySelector('#pvMax').value) || 1;
    const pvAtual = parseInt(document.querySelector('#pvAtual').value) || 0;
    const pvPercent = (pvAtual / pvMax) * 100;
    document.querySelector('#pv-bar').style.width = `${pvPercent}%`;
    document.querySelector('#pv-bar').ariaValueNow = pvPercent;
}

function atualizarBarraEnergia() {
    const peMax = parseInt(document.querySelector('#peMax').value) || 1;
    const peAtual = parseInt(document.querySelector('#peAtual').value) || 0;
    const pePercent = (peAtual / peMax) * 100;
    document.querySelector('#pe-bar').style.width = `${pePercent}%`;
    document.querySelector('#pe-bar').ariaValueNow = pePercent;
}

function validarEspecializacaoSecundaria() {
    const especializacao2 = document.querySelector('#especializacao2').value;
    const atributos = {
        'Lutador': ['DEX', 'CON'],
        'Especialista em Combate': ['FOR', 'DEX'],
        'Especialista em Técnica': ['INT', 'SAB'],
        'Suporte': ['CAR', 'SAB'],
        'Controlador': ['CAR', 'SAB']
    };

    if (especializacao2 && atributos[especializacao2]) {
        const requisitos = atributos[especializacao2];
        const valido = requisitos.some(atributo => getModificador(atributo) >= 3); // 16 in attribute means +3 modifier
        if (!valido) {
            alert(`Para escolher ${especializacao2} como especialização secundária, você precisa ter pelo menos 16 em ${requisitos.join(' ou ')}.`);
            document.querySelector('#especializacao2').value = '';
        }
    }
}

document.querySelector('#especializacao2').addEventListener('change', validarEspecializacaoSecundaria);

document.querySelector('#nivel').addEventListener('input', () => {
    calcularPontosDeVida();
    calcularPontosDeEnergia();
});
document.querySelector('#CON').addEventListener('input', calcularPontosDeVida);
document.querySelectorAll('#INT, #SAB, #CAR').forEach(element => {
    element.addEventListener('input', calcularPontosDeEnergia);
});
document.querySelector('#pvAtual').addEventListener('input', atualizarBarraVida);
document.querySelector('#peAtual').addEventListener('input', atualizarBarraEnergia);

document.querySelectorAll('#especializacao1, #especializacao2, #especializacao1-nivel, #especializacao2-nivel').forEach(element => {
    element.addEventListener('change', () => {
        const nivelGeral = getNivel();
        const nivel1 = getEspecializacaoNivel('especializacao1');
        const nivel2 = getEspecializacaoNivel('especializacao2');
        if (nivel1 + nivel2 > nivelGeral) {
            alert('A soma dos níveis das especializações não pode exceder o nível geral.');
            return;
        }
        calcularPontosDeVida();
        calcularPontosDeEnergia();
        atualizarLabelEnergia();
    });
});

// Ensure recalculations on page load
document.addEventListener('DOMContentLoaded', () => {
    calcularPontosDeVida();
    calcularPontosDeEnergia();
    atualizarLabelEnergia();
});

calcularPontosDeVida();
calcularPontosDeEnergia();
