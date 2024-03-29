class Rompecabezas {

    constructor(size) {
        // Initialize properties for tracking puzzle state and statistics
        this.tabla = [];
        this.contador = 0;
        this.victorias = 0;
        this.noVictorias = 0;
        this.setTimeout = false;
        this.timeout = null;
        this.inicializar(size);
        // Initialize variables to store the start time and the current time
        this.startTime = new Date().getTime();
    }

    inicializar(size) {
        // Initialize the puzzle array
        this.tabla = [];
        this.size = size;
        for (let i = 0; i < size; i++) {
            this.tabla[i] = [];
            for (let j = 0; j < size; j++) {
                this.tabla[i][j] = null;
            }
        }
        this.trampa = false;
        // Generate the puzzle values
        this.llenar();
        // Check if the puzzle has a solution
        while (!this.tieneSolucion()) {
            this.llenar();
        }
        // Update the display and statistics
        this.visualizar();
    }

// Get the elapsed time
    getTime() {
        return new Date().getTime()  - this.startTime;
    }

    llenar() {
        // Initialize an array to keep track of which numbers have been used
        let numerosUsados = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                // Generate a random number that has not been used
                let aleatorio;
                do {  // little trick to avoid math pow call and looks cool and clean 
                    aleatorio = Math.floor(Math.random() * (this.size ** 2));
                } while (numerosUsados[aleatorio]);
                numerosUsados[aleatorio] = 1;

                if (aleatorio === 0)
                    this.tabla[i][j] = null;
                else
                    this.tabla[i][j] = aleatorio;
            }
        }
    }

    tieneSolucion() {
        // Check if the puzzle is solvable using the parity of the number of inversions and the blank space's row
        const intercambios = this.contarIntercambios();
        const pos = this.buscarNull();
        // Bitwise operators to check parity  If (n & 1 == 0) then n it's even, odd otherwise. Lost count of the nested Ifss
        return (this.size & 1) ? !(intercambios & 1) : (pos & 1) ? !(intercambios & 1) : intercambios & 1;
    }

    contarIntercambios() {
        // Count the number of inversions in the puzzle (pairs of elements that are out of order)
        let intercambios = 0;
        for (let i = 0; i < this.size - 1; i++) {
            for (let j = i + 1; j < this.size; j++) {
                if (this.tabla[j] && this.tabla[i] && this.tabla[i] > this.tabla[j]) {
                    intercambios++;
                }
            }
        }
        return intercambios;
    }

    movimiento(fila, columna) {
        // Check if the clicked cell is adjacent to the blank space
        if ((fila > 0 && this.tabla[fila - 1][columna] === null) ||
            (fila < this.size - 1 && this.tabla[fila + 1][columna] === null) ||
            (columna > 0 && this.tabla[fila][columna - 1] === null) ||
            (columna < this.size - 1 && this.tabla[fila][columna + 1] === null)) {
            // Store the value of the clicked cell in a temporary variable
            const temp = this.tabla[fila][columna];
            // Swap the clicked cell with the blank space
            this.tabla[fila][columna] = null;
            if (fila > 0 && this.tabla[fila - 1][columna] === null) {
                this.tabla[fila - 1][columna] = temp;
            } else if (fila < this.size - 1 && this.tabla[fila + 1][columna] === null) {
                this.tabla[fila + 1][columna] = temp;
            } else if (columna > 0 && this.tabla[fila][columna - 1] === null) {
                this.tabla[fila][columna - 1] = temp;
            } else if (columna < this.size - 1 && this.tabla[fila][columna + 1] === null) {
                this.tabla[fila][columna + 1] = temp;
            }
        }
        // Update the counter and display the updated puzzle
        this.contador++;
        this.visualizar();
    }

    comprobarFinal() {
        if (this.isSolved()) {
            if (!this.trampa) {
                this.victorias++;
            }
            else {
                this.noVictorias++;
                this.trampa = false;
            }

            // Only set the timeout if it hasn't already been set
            if (!this.timeoutSet) {
                this.timeoutSet = true;
                this.timeout = setTimeout(() => {
                    if (confirm("Has ganado ¿Reiniciar?")) {
                        this.reiniciar(this.size);
                    }
                    this.timeoutSet = false;
                }, 200);
            } else {
                clearTimeout(this.timeout);
            }
        }
    }


    reiniciar(tam) {
        let tabla = document.getElementsByTagName("table")[0];
        let main = document.getElementsByTagName("main")[0];
        main.removeChild(tabla);
        this.startTime = new Date().getTime();
        this.contador = 0;
        this.inicializar(tam);
        document.getElementById("wins").innerHTML = "Victorias: " + this.victorias;
        if (this.noVictorias)
            document.getElementById("nowin").innerHTML = "Victorias trucadas: " + this.noVictorias;
    }

    visualizar() {
        // Get the table element or create it if it does not exist
        let table = document.getElementsByTagName("table")[0];
        if (!table) {
            table = document.createElement("table");
            document.getElementsByTagName("main")[0].appendChild(table);
        }
        // Update the table with the current puzzle values
        table.innerHTML = "";
        for (let i = 0; i < this.size; i++) {
            const fila = document.createElement("tr");
            for (let j = 0; j < this.size; j++) {
                const num = document.createElement("td");
                // Update the id attribute based on the current values of i and j
                num.setAttribute('id', i * this.size + j.toLocaleString());
                num.setAttribute('onclick', 'rompecabezas.movimiento(' + i + ", " + j + ')');
                fila.appendChild(num);
                num.innerHTML = this.tabla[i][j] || "&nbsp;";
            }
            table.appendChild(fila);
        }
        // Update the title with the current number of moves
        const titulo = document.createElement("caption");
        titulo.innerHTML = "Nº de movimientos: " + this.contador;
        table.insertBefore(titulo, table.firstChild);
        this.tiempo();
        this.comprobarFinal();
    }


    tiempo() {
        const t = this;
        const time = new Date(this.getTime());
        const cadenaHora = time.getUTCHours() + ":" + this.comprobarNum(time.getUTCMinutes()) + ":"
            + this.comprobarNum(time.getUTCSeconds());
        document.getElementsByTagName("caption")[0].innerHTML = `Nº de movimientos: ${t.contador} Tiempo: ${cadenaHora}`;

        // call the function again
        setInterval(function f() {
            t.tiempo();
        }, 100);
    }

    buscarNull() {
        for (let i = this.size - 1; i >= 0; i--) {
            for (let j = this.size - 1; j >= 0; j--) {
                if (!this.tabla[i][j])
                    return this.size - i;
            }
        }
    }

    trucar() {
       this.tabla = this.getSolvedState();
       this.trampa = true;
       this.visualizar();
    }

    // Returns the solved state for the puzzle
    getSolvedState() {
        let solved = [];
        for (let i = 0; i < this.size; i++) {
            solved[i] = [];
            for (let j = 0; j < this.size; j++) {
                solved[i][j] = i * this.size + j + 1;
            }
        }
        solved[this.size - 1][this.size - 1] = null;
        return solved;
    }

    // Returns true if the two puzzle states are identical, false otherwise
    compare(puzzle1, puzzle2) {
        if (!puzzle1 || !puzzle2) {
            return false;
        }

        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (puzzle1[i][j] !== puzzle2[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }

    isSolved() {
        // Get the solved state of the puzzle
        const solvedState = this.getSolvedState();

        // Compare the current state of the puzzle with the solved state
        return this.compare(this.tabla, solvedState);
    }

    comprobarNum(num) {
        if (num < 10)
            return "0" + num;
        return num;
    }
}

