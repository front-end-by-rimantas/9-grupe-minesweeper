"use strict";


// sugeneruojame cell'es
let cell_html = '',
    plotis = 10,
    aukstis = 10,
    template = '<div class="cell"></div>';

for ( let i=0; i<plotis * aukstis; i++ ) {
    cell_html += template;
}

// analogas tam ciklui yra:
cell_html = template.repeat(plotis*aukstis);