class Semaforo {
    constructor() {
        this.levels = [0.2, 0.5, 0.8];
        this.lights = 4;
        this.unload_moment = null;
        this.clic_moment = null;
        this.difficulty = this.levels[Math.floor(Math.random() * this.levels.length)];
        this.createStructure();
    }

    createStructure() {
        const main = document.querySelector('main');
        const h2 = document.createElement('h2');
        h2.textContent = "SEMÁFORO";
        main.appendChild(h2);
        for (let i = 0; i < this.lights; i++) {
            const div = document.createElement('div');
            main.appendChild(div);
        }
        const buttonArrancar = document.createElement('button');
        buttonArrancar.textContent = "ARRANCAR";
        buttonArrancar.onclick = () => this.initSequence();
        main.appendChild(buttonArrancar);
        const buttonTiempo = document.createElement('button');
        buttonTiempo.textContent = "TIEMPO";
        buttonTiempo.onclick = () => this.stopReaction();
        buttonTiempo.disabled = true;
        main.appendChild(buttonTiempo);
    }

    initSequence() {
        const main = document.querySelector('main');
        main.classList.add('load');
        const buttonArrancar = document.querySelector('button:first-of-type');
        buttonArrancar.disabled = true;
        setTimeout(() => {
            this.unload_moment = new Date();
            this.endSequence();
        }, (2000 + this.difficulty * 100));

    }

    endSequence() {
        const main = document.querySelector('main');
        main.classList.add('unload');
        const buttonTiempo = document.querySelector('button:nth-of-type(2)');
        buttonTiempo.disabled = false;

    }

    stopReaction() {
        this.clic_moment = new Date();
        let diference = this.clic_moment.getTime() - this.unload_moment.getTime();
        const main = document.querySelector('main');
        const existingP = main.querySelector('p');
        if (existingP) {
            existingP.remove();
        }
        const p = document.createElement('p');
        diference = (diference / 1000).toFixed(3);
        p.textContent = `Tu tiempo de reacción es: ${diference} segundos`;
        main.appendChild(p);
        main.classList.remove('load', 'unload');
        const buttonArrancar = document.querySelector('button:first-of-type');
        const buttonTiempo = document.querySelector('button:nth-of-type(2)');
        buttonArrancar.disabled = false;
        buttonTiempo.disabled = true;
        this.createRecordForm();
    }


    createRecordForm() {
        if ($('form').length > 0) {
            $('form').remove();
        }
        const section = $('<section>');
        const h4 = $('<h4>').text('Guardar Resultado'); // Crear el h4 con el texto
        section.append(h4);
        const form = $('<form>', {
            method: 'POST',
            action: 'semaforo.php'
        });

        form.append($('<label>', {
            text: 'Nombre:',
        }).append($('<input>', {
            type: 'text',
            name: 'name',
            placeholder: 'Tu nombre',
            required: true
        })));
        form.append($('<label>', { text: 'Apellidos:' }).append($('<input>', {
            type: 'text',
            name: 'surname',
            placeholder: 'Tus apellidos',
            required: true
        })));

        form.append($('<label>', {
            text: 'Nivel:',
        }).append($('<input>', {
            type: 'text',
            name: 'level',
            value: this.difficulty,
            readonly: true
        })));

        let diference = this.clic_moment.getTime() - this.unload_moment.getTime();
        diference = (diference / 1000).toFixed(3);
        form.append($('<label>', {
            text: 'Tiempo (segundos):',
        }).append($('<input>', {
            type: 'text',
            name: 'time',
            value: diference,
            readonly: true
        })));


        form.append($('<button>', {
            type: 'submit',
            text: 'Guardar Récord'
        }));


        section.append(form);
        $('body').append(section);
    }
}