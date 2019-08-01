"use strict";

class Minesweeper {
    constructor ( target ) {
        this.target = document.querySelector(target);
        this.smile;

        this.board = {
            rows: 16,
            columns: 16
        };
        this.bombCount = 24;
        this.timer = 0;
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
        this.timer = 0;
        this.gameStatus = 'start';
        this.gameEndType = null;

        // target elemente uzsidedame "minesweeper" css clase
        this.target.classList.add('minesweeper');
        
        // idedam html.layout
        this.target.innerHTML = this.html_template.layout;

        this.smile = this.target.querySelector('.status');

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
        }

        if ( this.gameStatus === 'in-progress' ) {
            // ar tai langelis kuris jau buvo atidarytas
            if ( this.map[y][x] === 2 ) {
                // tai nedarom nieko
                console.log('baigta');
                return;
            }

            // tikriname ar paspaudziau ant bombos
            if ( this.map[y][x] === 1 ) {
                // taip, baigiam zaidima:
                    this.gameStatus = 'end';
                    // sustabdome laikrodi
                    // pakeiciame zaidimo statusa: end
                    // parodome/atidengiame visu bombu pozicijas
                    // parodome neteisingai pazymetas bombas (flags)
                    // pazymime bomba, per kuria pralaimejom
                    // gameEndType = death
                    this.gameEndType = 'death';
            } else {
                // ne, tesiam zaidima:
                    // atidarome einamoji langeli (pridedame class="open")
                    this.target.querySelector(`.cell[data-id="${cellId}"]`).classList.add('open');
                    // suskaiciuoju kiek aplink sita langeli yra bombu
                    // i ta langeli irasau bombu skaiciu (pridedame class="n-[bombuSkaicius]")
                    // jeigu bombu yra 0:
                        // atidaro visus aplinkinius langelius
                        // rekursija "tesiam zaidima" ant tu atidarytu langeliu
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

        this.bombs.forEach( cellId => {
            this.target.querySelector(`.cell[data-id="${cellId}"]`).classList.add('bomb');
        });
    }

}

export default Minesweeper;
