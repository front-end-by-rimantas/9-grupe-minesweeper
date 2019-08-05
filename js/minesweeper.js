"use strict";

class Minesweeper {
    constructor ( target ) {
        // html elements
        this.target = document.querySelector(target);
        this.smile;
        this.bombCounter;
        this.clock;

        // inner object logic / memory
        this.board = {
            rows: 20,
            columns: 30
        };
        this.timer;
        this.seconds = 0;
        this.bombCount = 80;
        this.map = [];                   // pvz.: [ [1, 2, 3], [4, 5, 6], [7, 8, 9] ]
        this.bombs = [];
        this.gameStatus = 'start';       // start / in-progress / end
        this.gameEndType = null;         // happy / death

        this.html_template = {
            layout: `<header>
                        <div class="numbers bombs">099</div>
                        <div class="status">:)</div>
                        <div class="numbers timer">000</div>
                    </header>
                    <section></section>`,
            cell: `<div class="cell" data-id="{{id}}"></div>`
        }
        this.cell = {
            size: 30
        }

        this.init();
    }

    init = () => {
        // game reset
        this.map = [];
        this.bombs = [];
        this.timer = null;
        this.seconds = 0;
        this.gameStatus = 'start';
        this.gameEndType = null;

        // target elemente uzsidedame "minesweeper" css clase
        this.target.classList.add('minesweeper');
        
        // idedam html.layout
        this.target.innerHTML = this.html_template.layout;

        this.smile = this.target.querySelector('.status');
        this.bombCounter = this.target.querySelector('.bombs');
        this.clock = this.target.querySelector('.timer');

        let bombCount = '';
        if ( this.bombCount < 100 ) {
            bombCount += '0';
        }
        if ( this.bombCount < 10 ) {
            bombCount += '0';
        }
        this.bombCounter.textContent = bombCount + this.bombCount;
        
        this.clock.textContent = '000';

        // atnaujiname layout'o ploti (pagal langeliu eileje kieki)
        this.target.style.width = this.board.columns * this.cell.size + 20 + 'px';

        // susigeneruojame cell'es
        let cell_html = '';
        for ( let i=0; i<this.board.columns * this.board.rows; i++ ) {
            cell_html += this.html_template.cell.replace('{{id}}', i);
        }

        // cell'es idedame i html.layout'a
        this.target.querySelector('section').innerHTML = cell_html;

        // kiekvienai cell'ei uzdedame click event'a
        this.target.querySelectorAll('section > .cell').forEach(cell => {
            cell.addEventListener('click', this.cellClick);
        });

        // smile click event
        this.smile.addEventListener('click', this.init);
    }

    cellClick = ( event ) => {
        const cellId = parseInt(event.target.dataset.id);
        const x = cellId % this.board.columns;
        const y = (cellId - x) / this.board.columns;

        if ( this.gameStatus === 'start' ) {
            this.gameStatus = 'in-progress';
            this.generateBombs( cellId );
            this.timer = setInterval( ()=>{
                this.seconds++;

                let sec = '';
                if ( this.seconds < 100 ) {
                    sec += '0';
                }
                if ( this.seconds < 10 ) {
                    sec += '0';
                }

                this.clock.textContent = sec + this.seconds;

                if ( this.seconds === 999 ) {
                    clearInterval( this.timer );
                }
            }, 1000 );
        }

        if ( this.gameStatus === 'in-progress' ) {
            // ar tai langelis kuris jau buvo atidarytas
            if ( this.map[y][x] === 2 ) {
                // tai nedarom nieko
                return;
            }

            // tikriname ar paspaudziau ant bombos
            if ( this.map[y][x] === 1 ) {
                // taip, baigiam zaidima:
                    // pakeiciame zaidimo statusa: end
                    this.gameStatus = 'end';
                    // sustabdome laikrodi
                    clearInterval( this.timer );
                    // parodome/atidengiame visu bombu pozicijas
                    this.bombs.forEach( bomb => {
                        this.target.querySelector(`.cell[data-id="${bomb}"]`).classList.add('bomb');
                    });
                    // parodome neteisingai pazymetas bombas (flags)
                    // pazymime bomba, per kuria pralaimejom
                    this.target.querySelector(`.cell[data-id="${cellId}"]`).classList.add('bomb-killer');
                    // gameEndType = death
                    this.gameEndType = 'death';
            } else {
                // ne, tesiam zaidima:
                    this.openCells( cellId );

                    // jei atidaryti visi langeliai be bombu - zaidimas laimetas
                    if ( this.isWin() ) {
                        // reikia sustabdyti laikrodi
                        clearInterval( this.timer );

                        // pakeisti smile
                        this.smile.textContent = 'B-)';
                    }
            }
        }

        // atnaujiname smile
        if ( this.gameStatus === 'end' ) {
            if ( this.gameEndType === null ) {
                return console.error('Gavome nezinoma zaidimo pabaigos situacija.');
            }
            if ( this.gameEndType === 'happy' ) {
                this.smile.textContent = 'B-)';
            }
            if ( this.gameEndType === 'death' ) {
                this.smile.textContent = ':(';
            }
        }
    }

    openCells = ( cellId ) => {
        // atidarome einamoji langeli (pridedame class="open")
        this.target.querySelector(`.cell[data-id="${cellId}"]`).classList.add('open');

        // suskaiciuoju kiek aplink sita langeli yra bombu
        let count = 0;
        const col = this.board.columns;
        const row = this.board.rows-1;
        const x = cellId % col;
        const y = (cellId - x) / col;

        // this.map pazymime, kad langelis jau atidarytas
        this.map[y][x] = 2;

        if ( y > 0 && x > 0 && this.map[y-1][x-1] === 1 ) { count++ }     // top left
        if ( y > 0 && this.map[y-1][x] === 1 ) { count++ }     // top
        if ( y > 0 && x < col && this.map[y-1][x+1] === 1 ) { count++ }     // top right
        if ( x < col && this.map[y][x+1] === 1 ) { count++ }     // right
        if ( y < row && x < col && this.map[y+1][x+1] === 1 ) { count++ }     // bottom right
        if ( y < row && this.map[y+1][x] === 1 ) { count++ }     // bottom
        if ( y < row && x > 0 && this.map[y+1][x-1] === 1 ) { count++ }     // bottom left
        if ( x > 0 && this.map[y][x-1] === 1 ) { count++ }     // left

        // i ta langeli irasau bombu skaiciu (pridedame class="n-[bombuSkaicius]")
        this.target.querySelector(`.cell[data-id="${cellId}"]`).classList.add('n-'+count);

        // jeigu bombu yra 0:
        if ( count === 0 ) {
            // atidaro visus aplinkinius langelius
            for ( let cx=-1; cx<=1; cx++ ) {
                for ( let cy=-1; cy<=1; cy++ ) {
                    if ( x+cx >= 0 && x+cx < col &&
                         y+cy >= 0 && y+cy <= row &&
                         this.map[y+cy][x+cx] === 0 ) {
                        // rekursija "tesiam zaidima" ant tu atidarytu langeliu
                        const nextCellId = (y+cy) * col + x+cx;
                        this.openCells( nextCellId );
                    }
                }
            }
        }
    }

    generateBombs = ( exclude ) => {
        let bombList = [],
            position = 0,
            board = this.board.columns * this.board.rows - 1;
        
        while ( bombList.length !== this.bombCount ) {
            position = Math.round(Math.random() * board);
            if ( bombList.indexOf(position) === -1 &&
                 position !== exclude ) {
                bombList.push(position);
            }
        }

        this.bombs = bombList;
        
        // sugeneruojame 2D bombu zemelapio masyva
        this.map = []

        for ( let r=0; r<this.board.rows; r++ ) {
            this.map.push([]);
            for ( let c=0; c<this.board.columns; c++ ) {
                if ( bombList.indexOf( r * this.board.columns + c ) >= 0 ) {
                    this.map[r].push(1);
                } else {
                    this.map[r].push(0);
                }
            }
        }

        // this.bombs.forEach( cellId => {
        //     this.target.querySelector(`.cell[data-id="${cellId}"]`).classList.add('bomb');
        // });
    }

    isWin = () => {
        let leftToOpen = 0;

        this.map.forEach( row => {
            
            row.forEach( cell => {
                if ( cell === 0 ) leftToOpen++;
            })
        })
        console.log(this.map);
        
        return leftToOpen > 0 ? false : true;
    }

}

export default Minesweeper;
