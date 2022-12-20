class Rompecabezas {
    constructor(size) {
        // Initialize properties for tracking puzzle state and statistics
        this.tabla = [];
        this.contador = 0;
        this.victorias = 0;
        this.noVictorias = 0;
        this.inicio = new Date().getTime();
        this.blankPos = null;
        this.inicializar(size);
    }

    inicializar(size) {
        // Set the length of the puzzle array and reset the "trampa" flag
        this.tabla.length = size ** 2;
        this.trampa = false;
        // Create the puzzle table and start the timer
        this.crearTablero(size);
        // Generate a puzzle until a solvable one is found
        do {
            this.llenar();
        } while (!this.tieneSolucion());
        // Display the initial puzzle configuration and start the timer
        this.visualizar();
        this.tiempo();
    }

    crearTablero(size) {
        // Create a table element and add it to the main element
        const table = document.createElement("table");
        const main = document.getElementsByTagName("main")[0];
        main.appendChild(table);
        // Create a caption element to display the move count and timer
        const titulo = document.createElement("caption");
        table.appendChild(titulo);
        titulo.innerHTML = "Nº de movimientos: ";
        // Create rows and cells for the puzzle
        for (let i = 0, valor = 0; i < size; i++) {
            const fila = document.createElement("tr");
            for (let j = 0; j < size; j++, valor++) {
                const num = document.createElement("td");
                // Set the cell's id and click handler
                num.setAttribute("id", valor.toString());
                num.setAttribute("onclick", `rompecabezas.movimiento(${i}, ${j})`);
                fila.appendChild(num);
            }
            table.appendChild(fila);
        }
    }

    llenar() {
        // Generate the puzzle values and store them in the puzzle array
        const numerosUsados = [];
        for (let i = 0; i < this.tabla.length; i++) {
            if (i === 0) {
                // Set the first element to null (the blank space) and store its position
                this.tabla[i] = null;
                this.blankPos = i;
            } else {
                // Generate a random number that hasn't been used yet
                do {
                    var aleatorio = Math.floor(Math.random() * this.tabla.length);
                } while (numerosUsados[aleatorio]);
                numerosUsados[aleatorio] = 1;
                this.tabla[i] = aleatorio;
            }
        }
    }

    tieneSolucion() {
        // Check if the puzzle is solvable using the parity of the number of inversions and the blank space's row
        const intercambios = this.contarIntercambios();
        if (this.tabla.length & 1) {
            // Odd-sized puzzle: solvable if the number of inversions is even
            return !(intercambios & 1);
        } else {
            // Even-sized puzzle: solvable if the number of inversions and the blank space's row have opposite parities
            if (this.blankPos & 1) {
                return !(intercambios & 1);
            }
            return intercambios & 1;
        }
    }

    contarIntercambios() {
        // Count the number of inversions in the puzzle (pairs of elements that are out of order)
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
        // Check if the "trampa" flag is set (to prevent moves after a win) and return if it is
        if (this.trampa) {
            return;
        }
        // Calculate the position of the clicked cell
        const pos = i * this.tabla.length + j;
        // Check if the clicked cell is next to the blank space
        if (this.blankPos - 1 === pos || this.blankPos + 1 === pos || this.blankPos - this.tabla.length === pos || this.blankPos + this.tabla.length === pos) {
            // Swap the blank space and the clicked cell
            this.tabla[this.blankPos] = this.tabla[pos];
            this.blankPos = pos;
            this.tabla[pos] = null;
            // Update the display and statistics
            this.visualizar();
            this.contador++;
            this.tiempo();
            // Check if the puzzle is solved
            if (this.esGanador()) {
                this.victorias++;
                this.trampa = true;
                // Display a win message and reset the puzzle after a short delay
                setTimeout(() => {
                    alert("¡Has ganado!");
                    this.inicializar(Math.sqrt(this.tabla.length));
                }, 1);
            }
        }
    }

    visualizar() {
        // Update the display with the current puzzle configuration
        for (let i = 0, k = 0; i < this.tabla.length; i++, k++) {
            document.getElementById(k.toString()).innerHTML = this.tabla[i] || "";
        }
    }

    esGanador() {
        // Check if the puzzle is solved (all cells are in the correct order)
        for (let i = 0; i < this.tabla.length - 1; i++) {
            if (this.tabla[i] !== i + 1) {
                return false;
            }
        }
        return true;
    }

    tiempo() {
        // Update the timer display
        const fin = new Date().getTime();
        document.getElementsByTagName("caption")[0].innerHTML = `Nº de movimientos: ${this.contador} Tiempo: ${Math.floor((fin - this.inicio) / 1000)}s`;
    }
}

