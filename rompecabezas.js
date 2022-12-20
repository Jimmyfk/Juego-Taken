class Rompecabezas {
    constructor(size) {
        this.tabla = [];
        this.contador = 0;
        this.victorias = 0;
        this.noVictorias = 0;
        this.inicio = new Date().getTime();
        this.blankPos = null;
        this.inicializar(size);
    }

    inicializar(size) {
        this.tabla.length = size ** 2;
        this.trampa = false;
        this.crearTablero(size);
        do {
            this.llenar();
        } while (!this.tieneSolucion());
        this.visualizar();
        this.tiempo();
    }

    crearTablero(size) {
        const table = document.createElement("table");
        const main = document.getElementsByTagName("main")[0];
        main.appendChild(table);
        const titulo = document.createElement("caption");
        table.appendChild(titulo);
        titulo.innerHTML = "Nº de movimientos: ";
        for (let i = 0, valor = 0; i < size; i++) {
            const fila = document.createElement("tr");
            for (let j = 0; j < size; j++, valor++) {
                const num = document.createElement("td");
                num.setAttribute("id", valor.toString());
                num.setAttribute("onclick", `rompecabezas.movimiento(${i}, ${j})`);
                fila.appendChild(num);
            }
            table.appendChild(fila);
        }
    }

    llenar() {
        const numerosUsados = [];
        for (let i = 0; i < this.tabla.length; i++) {
            if (i === 0) {
                this.tabla[i] = null;
                this.blankPos = i;
            } else {
                do {
                    var aleatorio = Math.floor(Math.random() * this.tabla.length);
                } while (numerosUsados[aleatorio]);
                numerosUsados[aleatorio] = 1;
                this.tabla[i] = aleatorio;
            }
        }
    }

    tieneSolucion() {
        const intercambios = this.contarIntercambios();
        if (this.tabla.length & 1) {
            return !(intercambios & 1);
        } else {
            if (this.blankPos & 1) {
                return !(intercambios & 1);
            }
            return intercambios & 1;
        }
    }

    contarIntercambios() {
        let intercambios = 0;
        for (let i = 0; i < this.tabla.length - 1; i++) {
            for (let j = i + 1; j < this.tabla.length; j++) {
                if (this.tabla[j] && this.tabla[i] && this.tabla[i] > this.tabla[j]) {
                    intercambios++;
                }
            }
        }
        return intercambios;
    }

    movimiento(i, j) {
        if (this.trampa) {
            return;
        }
        const pos = i * this.tabla.length + j;
        if (this.blankPos - 1 === pos || this.blankPos + 1 === pos || this.blankPos - this.tabla.length === pos || this.blankPos + this.tabla.length === pos) {
            this.tabla[this.blankPos] = this.tabla[pos];
            this.blankPos = pos;
            this.tabla[pos] = null;
            this.visualizar();
            this.contador++;
            this.tiempo();
            if (this.esGanador()) {
                this.victorias++;
                this.trampa = true;
                setTimeout(() => {
                    alert("¡Has ganado!");
                    this.inicializar(Math.sqrt(this.tabla.length));
                }, 1);
            }
        }
    }

    visualizar() {
        for (let i = 0, k = 0; i < this.tabla.length; i++, k++) {
            document.getElementById(k.toString()).innerHTML = this.tabla[i] || "";
        }
    }

    esGanador() {
        for (let i = 0; i < this.tabla.length - 1; i++) {
            if (this.tabla[i] !== i + 1) {
                return false;
            }
        }
        return true;
    }

    tiempo() {
        const fin = new Date().getTime();
        document.getElementsByTagName("caption")[0].innerHTML = "Nº de movimientos: " + this.contador + " Tiempo: " + Math.floor((fin - this.inicio) / 1000) + "s";
    }
}
