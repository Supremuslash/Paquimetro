class Parquimetro {
    constructor() {
        this.tabela = [
            { preco: 1.00, minutos: 30 },
            { preco: 1.75, minutos: 60 },
            { preco: 3.00, minutos: 120 },
        ];
        this.precoMinimo = this.tabela[0].preco;
    }

    validarValor(valor) {
        return typeof valor === 'number' && !isNaN(valor) && valor >= this.precoMinimo;
    }

    // Retorna { minutos, precoUsado, troco } ou null se inválido

    calcularTempoETroco(valor) {
        if (!this.validarValor(valor)) return null;

        // encontra o maior preço da tabela que seja <= valor informado

        const opcoesValidas = this.tabela.filter(o => o.preco <= valor);
        if (opcoesValidas.length === 0) return null;

        const escolha = opcoesValidas[opcoesValidas.length - 1];

        // limita o tempo máximo a 120 minutos

        const minutos = Math.min(escolha.minutos, 120);
        const precoUsado = escolha.preco;
        const troco = parseFloat((valor - precoUsado).toFixed(2));

        return { minutos, precoUsado, troco };
    }

    // formata minutos em "1h 30min" ou "30min"

    formatarTempo(minutos){
        const h = Math.floor(minutos / 60);
        const m = minutos % 60;
        if(h === 0) return `${m} min`;
        if(m === 0) return `${h} h`;
        return `${h} h ${m} min`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const parquimetro = new Parquimetro();
    const valorInput = document.getElementById('valor');
    const calcularButton = document.getElementById('calcular');
    const resultadoDiv = document.getElementById('resultado');
    const erroDiv = document.getElementById('mensagem-erro');

    calcularButton.addEventListener('click', () => {
        const raw = (valorInput.value || '').trim().replace(',', '.');
        const valor = parseFloat(raw);
        erroDiv.textContent = '';
        resultadoDiv.textContent = '';

        if (!raw) {
            erroDiv.textContent = 'Informe um valor.';
            return;
        }

        if (!parquimetro.validarValor(valor)) {
            erroDiv.textContent = 'Valor insuficiente. O valor deve ser maior ou igual a R$1,00.';
            return;
        }

        const info = parquimetro.calcularTempoETroco(valor);
        if (!info) {
            erroDiv.textContent = 'Não foi possível calcular o tempo.';
            return;
        }

        resultadoDiv.innerHTML =
            `Tempo de permanência: <span class="badge">${parquimetro.formatarTempo(info.minutos)}</span><br>` +
            `Preço usado: R$ ${info.precoUsado.toFixed(2)}<br>` +
            `Troco: R$ ${info.troco.toFixed(2)}`;
    });

    // permite submeter com Enter, documentação muito boa!
    valorInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') calcularButton.click();
    });
});