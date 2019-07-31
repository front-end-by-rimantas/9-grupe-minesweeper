"use strict";

class Minesweeper {
    constructor ( target ) {
        this.target = document.querySelector(target);
        this.board = {
            rows: 10,
            columns: 10
        };
        this.bombCount = 15;
        this.bombs = [];
        this.timer = 0;
        this.gameStatus = '';       // start / in-progress / end
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
        // target elemente uzsidedame "minesweeper" css clase
        this.target.classList.add('minesweeper');
        
        // idedam html.layout
        this.target.innerHTML = this.html_template.layout;

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
    }

    cellClick = ( event ) => {
        const cellId = parseInt(event.target.dataset.id);
        console.log('Cell: ', cellId);

        this.generateBombs( cellId );
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

        this.bombs.forEach( cellId => {
            this.target.querySelector(`.cell[data-id="${cellId}"]`).classList.add('bomb');
        });
    }

}

export default Minesweeper;