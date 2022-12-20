class Rompecabezas {

    constructor(size) {
        this.tabla = [];
        this.contador = 0;
        this.victorias = 0;
        this.noVictorias = 0;
        this.inicio = new Date().getTime();
        this.inicializar(size);
    }

    inicializar(size) {
        this.tabla.length = size;
        this.trampa = false;
        for (let i = 0; i < this.tabla.length; i++) {
            this.tabla[i] = [];
            this.tabla[i].length = this.tabla.length;
        }
        this.crearTablero(size);
        do
            this.llenar();
        while (!this.tieneSolucion());
        this.visualizar();
        this.tiempo();
    }

    crearTablero(size) {
        let table = document.createElement("table");
        let main = document.getElementsByTagName("main")[0];
        main.appendChild(table);
        let titulo = document.createElement("caption");
        table.appendChild(titulo);
        titulo.innerHTML = "Nº de movimientos: ";
        for (let i = 0, valor = 0; i < size; i++) {
            let fila = document.createElement("tr");
            for (let j = 0; j < size; j++, valor++) {
                let num = document.createElement("td");
                num.setAttribute('id', valor.toString());
                num.setAttribute('onclick', 'rompecabezas.movimiento(' + i + ", " + j + ')');
                fila.appendChild(num);
            }
            table.appendChild(fila);
        }
    }

    llenar() {
        let numerosUsados = [];
        for (let i = 0; i < this.tabla.length; i++) {
            for (let j = 0; j < this.tabla[i].length; j++) {
                do
                    var aleatorio = Math.floor(Math.random() * Math.pow(this.tabla.length, 2));
                while (numerosUsados[aleatorio]);
                numerosUsados[aleatorio] = 1;

                if (aleatorio === 0)
                    this.tabla[i][j] = null;
                else
                    this.tabla[i][j] = aleatorio;
            }
        }
    }

    tieneSolucion() {
        let intercambios = this.contarIntercambios();
        if (this.tabla.length & 1) {
            return !(intercambios & 1);
        }
        else
        {
            let pos = this.buscarNull();
            if (pos & 1){
                return !(intercambios & 1);
            }
            return intercambios & 1;
        }
    }

    contarIntercambios() {
        let intercambios = 0;
        let vector = this.convertir();
        for (let i = 0; i < vector.length - 1; i++) {
            for (let j = i + 1; j < vector.length; j++) {
                if (vector[j] && vector[i] && vector[i] > vector[j])
                    intercambios++;
            }
        }
        return intercambios;
    }

    convertir() {
        let aux = [];
        for (let i = 0, k = 0; i < this.tabla.length; i++) {
            for (let j = 0; j < this.tabla.length; j++) {
                aux[k++] = this.tabla[i][j];
            }
        }
        return aux;
    }

    buscarNull() {
        for (let i = this.tabla.length - 1; i >= 0; i--) {
            for (let j = this.tabla.length - 1; j >=0; j--) {
                if (!this.tabla[i][j])
                    return this.tabla.length - i;
            }
        }
    }

    movimiento(i, j) {
        let posI, posJ;
        if (this.tabla[i-1] && !this.tabla[i-1][j]) {
            posI = i-1;
            posJ = j;
        }
        else if (typeof this.tabla[i][j-1] !== "undefined" && !this.tabla[i][j-1]) {
            posI = i;
            posJ = j-1;
        }
        else if (this.tabla[i+1] && !this.tabla[i+1][j]) {
            posI = i+1;
            posJ = j;
        }
        else if (typeof this.tabla[i][j+1] !== "undefined" && !this.tabla[i][j+1]) {
            posI = i;
            posJ = j+1;
        }

        if (posI != null && posJ != null) {
            this.tabla[posI][posJ] = this.tabla[i][j];
            this.tabla[i][j] = null;
            this.contador++;
            this.visualizar();
            this.comprobarFinal();
        }
    }

    visualizar() {
        let vector = this.convertir();
        for (let i = 0; i < vector.length;) {
           document.getElementById(i.toString()).innerHTML = vector[i++];
        }
        document.getElementsByTagName("caption")[0].innerHTML = "Nº de movimientos: ".concat(this.contador.toLocaleString());
    }

    comprobarFinal() {
        if (this.comprobarVictoria()) {
            if (!this.trampa) {
                this.victorias++;
            }
            else {
                this.noVictorias++;
                this.trampa = false;
            }
            if (confirm("Has ganado ¿Reiniciar?"))
                this.reiniciar(this.tabla.length);
        }
    }

    comprobarVictoria() {
        let vector = this.convertir();
        for (var i = 0; vector[i++] === i;);
        return i === vector.length;
    }

    tiempo() {
        let ahora = new Date().getTime();
        let tiempo = new Date(ahora - this.inicio);

        let cadenaHora = tiempo.getUTCHours() + ":" + this.comprobarNum(tiempo.getUTCMinutes()) + ":"
                            + this.comprobarNum(tiempo.getUTCSeconds());
        this.visualizarHora(cadenaHora);
        let esto = this;
        setTimeout(function t() {
            esto.tiempo();
        }, 100);
    }

    comprobarNum(num) {
        if (num < 10)
            return "0" + num;
        return num;
    }

    visualizarHora(hora) {
        document.getElementById("reloj").innerHTML = "Tiempo: "+ hora;
    }

    trucar() {
        for (var i = 0, k = 0; i < this.tabla.length; i++) {
            for (var j = 0; j < this.tabla[i].length; j++) {
                this.tabla[i][j] = ++k;
            }
        }
        this.tabla[--i][--j]--;
        this.tabla[i][--j] = null;
        this.visualizar();
        this.trampa = true;
    }

    reiniciar(tam) {
        let tabla = document.getElementsByTagName("table")[0];
        let main = document.getElementsByTagName("main")[0];
        main.removeChild(tabla);
        this.inicio = new Date().getTime();
        this.contador = 0;
        this.inicializar(tam);
        document.getElementById("wins").innerHTML = "Victorias: " + this.victorias;
        if (this.noVictorias)
            document.getElementById("nowin").innerHTML = "Victorias trucadas: " + this.noVictorias;
    }
}
