class Memoria {
    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;
        this.elements = {
            "elements": [
                { element: "RedBull", source: "multimedia/imagenes/redbull.svg" },
                { element: "McLaren", source: "multimedia/imagenes/mcLaren.svg" },
                { element: "Alpine", source: "multimedia/imagenes/alpine.svg" },
                { element: "AstonMartin", source: "multimedia/imagenes/astonMartin.svg" },
                { element: "Ferrari", source: "multimedia/imagenes/ferrari.svg" },
                { element: "Mercedes", source: "multimedia/imagenes/mercedes.svg" },
                { element: "RedBull", source: "multimedia/imagenes/redbull.svg" },
                { element: "McLaren", source: "multimedia/imagenes/mcLaren.svg" },
                { element: "Alpine", source: "multimedia/imagenes/alpine.svg" },
                { element: "AstonMartin", source: "multimedia/imagenes/astonMartin.svg" },
                { element: "Ferrari", source: "multimedia/imagenes/ferrari.svg" },
                { element: "Mercedes", source: "multimedia/imagenes/mercedes.svg" }
            ]
        }
        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }
  
    shuffleElements() {
        for (let i = this.elements.elements.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.elements.elements[i], this.elements.elements[j]] = [this.elements.elements[j], this.elements.elements[i]];
        }
    }

    unflipCards() {
        this.lockBoard = true;

        setTimeout(() => {
            if (this.firstCard) {
                this.firstCard.removeAttribute('data-state');
            }
            if (this.secondCard) {
                this.secondCard.removeAttribute('data-state');
            }
            this.resetBoard();
        }, 1500);
    }

    resetBoard() {
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    checkForMatch() {
        const sonIguales = this.firstCard.getAttribute('data-element') === this.secondCard.getAttribute('data-element');
        sonIguales ? this.disableCards() : this.unflipCards();
    }

    disableCards() {
        this.firstCard.setAttribute('data-state', 'revealed');
        this.secondCard.setAttribute('data-state', 'revealed');
        this.resetBoard();
    }

    createElements() {
        const section = document.querySelectorAll('section')[1];
        this.elements.elements.forEach(item => {
            const article = document.createElement('article');
            article.setAttribute('data-element', item.element);


            const titulo = document.createElement('h3');
            titulo.textContent = "Tarjeta de memoria";
            article.appendChild(titulo);

            const img = document.createElement('img');
            img.src = item.source;
            img.alt = item.element;

            article.appendChild(img);
            section.appendChild(article);
        });
    }

    addEventListeners() {
        const cards = document.querySelectorAll("article");

        cards.forEach(card => {
            card.addEventListener("click", this.flipCard.bind(card, this));
        });
    }

    flipCard(game) {
        const card = this;
        if (card.getAttribute('data-state') === "revealed") {
            return;
        }
        if (game.lockBoard) {
            return;
        }
        if (card === game.firstCard) {
            return;
        }
        card.setAttribute('data-state', 'flip');

        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = card;

        } else {
            game.secondCard = card;
            game.checkForMatch();

        }
    }
 
}

