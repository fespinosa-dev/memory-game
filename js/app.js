'use strict'
let Grid = function() {
  var numberOfMoves = 0;
  var numberOfClicks = 0;
  var previewsFlippedCard = {};

  let grid = document.querySelector(".grid");
  this.cards = [];

  grid.fillWithCards = function(cards) {
    for (var i = 0; i < 16; i++) {
      grid.appendChild(cards[i]);
    }
    this.cards = cards;
  };

  grid.clear = function() {
    grid.innerHTML = "";
  };

  grid.shuffle = function() {
    this.clear();
    var i = 0,
      j = 0,
      temp = null
    for (i = this.cards.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1))
      temp = this.cards[i]
      this.cards[i] = this.cards[j]
      this.cards[j] = temp
    }
    this.fillWithCards(this.cards);
  };

  let animate = function(options, ...cards) {
    let type = options["type"];
    let afterDone = options["afterDone"]
    if (type && afterDone) {
      $(cards).animateCss(type, afterDone.bind(null, cards));
    } else {
      $(cards).animateCss(type);
    }
  };

  $(grid).click(function(event) {
    let currentFlippedCard = event.target.parentElement;
    if (isNotCard(currentFlippedCard)) {
      return;
    }
    if(currentFlippedCard.matches(".matched")){
      return;
    }

    numberOfClicks++;
    numberOfMoves++;
    if (numberOfClicks > 1) {
      let cardsMatched = checkIfMatch(currentFlippedCard, previewsFlippedCard);
      if (cardsMatched) {
        $([previewsFlippedCard, currentFlippedCard]).addClass("matched");

        animate({
          type: "rubberBand"
        }, currentFlippedCard, previewsFlippedCard);

      } else {
        $([previewsFlippedCard.back, currentFlippedCard.back]).addClass("mismatch");

        animate({
          type: "wobble",
          afterDone: resetCards
        }, previewsFlippedCard, currentFlippedCard);
      }
      numberOfClicks = 0;
    }
    previewsFlippedCard = currentFlippedCard; //save for the second flip
  });

  let addClass = function(marker, ...cards) {
    $(cards).addClass(marker);
  };

  let isNotCard = function(element) {
    return (element && !element.matches(".card"));
  };

  let resetCards = function(cards) {
    $([cards[0].back, cards[1].back]).removeClass("mismatch");
    $(cards).flip(false);
    $(cards).one("click", function (){
      $(this).flip(true);
    });
  };

  let checkIfMatch = function(currentCard, previewsCard) {
    let cardsMatched = false;
    if (currentCard.icon === previewsCard.icon) {
      cardsMatched = true;
    }
    return cardsMatched;
  };


  return grid;
};

let Card = function(id, icon) {
  let card = document.createElement("div");
  card.icon = icon;
  card.id = `card-${id}`;
  card.setAttribute("class", "card");
  let front = document.createElement("div");
  front.id = `card-front-${id}`;
  front.setAttribute("class", "front");
  let iconTag = document.createElement("i");
  iconTag.setAttribute("class", "fa fa-3x card-icon " + icon);
  let back = document.createElement("div");
  back.appendChild(iconTag);
  back.setAttribute("class", "back");
  back.id = `card-back-${id}`;
  card.front = front;
  card.back = back;
  card.appendChild(front);
  card.appendChild(back);

  card.isFlipped = function() {
    return $(card).data("flip-model").isFlipped;
  };

  $(card).flip({
    trigger: "manual",
    speed: 100
  });

  $(card).one("click", function (){
    $(this).flip(true);
  });

  return card;
};

let createCards = function() {
  let cards = [];
  const icons = ["fa-moon-o", "fa-bicycle", "fa-space-shuttle", "fa-usb", "fa-user-md", "fa-superpowers", "fa-university", "fa-sign-language"];
  let cardId = 1;
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 8; j++) {
      let card = new Card(cardId++, icons[j]);
      cards.push(card);
    }
  }
  return cards;
};

var grid = new Grid();
var cards = createCards();
grid.fillWithCards(cards);
document.querySelector(".fa-repeat").addEventListener("click", function() {
  grid.shuffle();


});
