class Rompecabezas {
    constructor(size) {
        // Initialize properties for tracking puzzle state and statistics
        this.tabla = [];
        this.contador = 0;
        this.victorias = 0;
        this.noVictorias = 0;
        this.inicializar(size);
        this.size = size;
        // Initialize variables to store the start time and the current time
        this.startTime = new Date().getTime();
    }

    inicializar(size) {
        // Initialize the puzzle array
        this.tabla = [];
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
                do {
                    aleatorio = Math.floor(Math.random() * Math.pow(this.size, 2));
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
        this.comprobarFinal();
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
            if (confirm("Has ganado ¿Reiniciar?"))
                this.reiniciar(this.size);
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
                num.setAttribute('id', i * this.size + j);
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

// Returns an array of the possible next states for the puzzle
    getNextStates(current) {
        let next = [];

        // Find the position of the null (empty) cell
        let [row, col] = this.findNull(current);

        // Check if the cell above the empty cell can be moved
        if (row > 0) {
            let state = this.copyState(current);
            state[row][col] = state[row - 1][col];
            state[row - 1][col] = null;
            next.push(state);
        }

        // Check if the cell below the empty cell can be moved
        if (row < this.size - 1) {
            let state = this.copyState(current);
            state[row][col] = state[row + 1][col];
            state[row + 1][col] = null;
            next.push(state);
        }

        // Check if the cell to the left of the empty cell can be moved
        if (col > 0) {
            let state = this.copyState(current);
            state[row][col] = state[row][col - 1];
            state[row][col - 1] = null;
            next.push(state);
        }

        // Check if the cell to the right of the empty cell can be moved
        if (col < this.size - 1) {
            let state = this.copyState(current);
            state[row][col] = state[row][col + 1];
            state[row][col + 1] = null;
            next.push(state);
        }

        return next;
    }

    // Finds the position of the null (empty) cell in the given state
    findNull(state) {
        for (let i = 0; i < state.length; i++) {
            for (let j = 0; j < state[i].length; j++) {
                if (state[i][j] === null) {
                    return [i, j];
                }
            }
        }
        return [-1, -1];
    }

    // Returns a deep copy of the given state
    copyState(state) {
        // Create a new 2D array with the same dimensions as the given state
        const copy = [];
        for (let i = 0; i < state.length; i++) {
            copy[i] = [];
            for (let j = 0; j < state[i].length; j++) {
                copy[i][j] = state[i][j];
            }
        }

        return copy;
    }

    // Returns the number of misplaced tiles in the given state
    getMisplacedTiles(state, target) {
        let misplaced = 0;
        for (let i = 0; i < state.length; i++) {
            for (let j = 0; j < state[i].length; j++) {
                if (state[i][j] !== null && state[i][j] !== target[i][j]) {
                    misplaced++;
                }
            }
        }
        return misplaced;
    }

// Uses a breadth-first search algorithm with pruning to find a solution to the puzzle
    trucar() {
        let queue = [];
        let visited = new Set();
        let current = this.tabla;
        let target = this.getSolvedState();

        queue.push({ state: current, misplaced: this.getMisplacedTiles(current, target) });
        visited.add(this.getHash(current));

        while (queue.length > 0) {
            current = queue.shift();
            console.log('Current state:', current.state);
            console.log('Misplaced tiles:', current.misplaced);
            console.log('Target state:', target);
            console.log('Are states equal:', this.compare(current.state, target));

            if (this.compare(current.state, target)) {
                console.log('Solution found!');
                this.tabla = current.state;
                this.trampa = true;
                this.visualizar();
                this.comprobarFinal();
                return;
            }

            const next = this.getNextStates(current.state);
            console.log('Next states:', next);

            for (let i = 0; i < next.length; i++) {
                const state = next[i];
                console.log('Current hash:', this.getHash(current.state));
                console.log('Target hash:', this.getHash(target));

                const hash = this.getHash(state);
                if (!visited.has(hash)) {
                    const misplaced = this.getMisplacedTiles(state, target);
                    queue.push({ state, misplaced });
                    visited.add(hash);
                }
            }

            // Sort the queue by the number of misplaced tiles, so that states with fewer misplaced tiles are explored first
            queue.sort((a, b) => a.misplaced - b.misplaced);
        }

        console.log('Solution not found.');
    }

    // Returns the solved state for the puzzle
    getSolvedState() {
        let solved = [];
        let n = this.size;
        for (let i = 0; i < n; i++) {
            solved[i] = [];
            for (let j = 0; j < n; j++) {
                solved[i][j] = i * n + j + 1;
            }
        }
        solved[n - 1][n - 1] = null;
        return solved;
    }

    // Returns a unique hash value for the given puzzle state
    getHash(state) {
        if (!state.every(x => x !== null)) {
            return null;
        }
        return state.flat().join(',');
    }

    // Returns true if the two puzzle states are identical, false otherwise
    compare(puzzle1, puzzle2) {
        for (let i = 0; i < puzzle1.length; i++) {
            for (let j = 0; j < puzzle1[i].length; j++) {
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

