"use strict";

class Minesweeper {
    constructor ( target ) {
        this.target = document.querySelector(target);
        this.width = 10;
        this.height = 10;
        this.bombCount = 10;
        this.timer = 0;
        this.gameStatus = '';       // start / in-progress / end

        this.init();
    }

    init = () => {
        // target elemente uzsidedame "minesweeper" css clase
    }

}

export default Minesweeper;