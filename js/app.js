'use strict'

var Card = function(id, icon) {
  let card = document.createElement("div");
  card.icon = icon;
  card.id = "card-" + id;
  card.setAttribute("class", "card");
  let front = document.createElement("div");
  front.setAttribute("class", "front");
  let iconTag = document.createElement("i");
  iconTag.setAttribute("class", "fa fa-3x " + icon);
  let back = document.createElement("div");
  back.appendChild(iconTag);
  back.setAttribute("class", "back");
  card.appendChild(front);
  card.appendChild(back);

  card.isFlipped = function() {
    return card.classList.contains("flipped");
  };


  let onClickEventHanlder = function(event) {

  };

  let onFlipDoneEventHandler = function(event) {
    markCardAsFlipped();
    let currentCard = event.currentTarget;
    if (checkIfMatch(currentCard)) {
          
    }
    if (!checkIfMatch(currentCard)) {

    }
  };

  let markCardAsFlipped = function() {
    let classList = card.classList;
    classList.contains("flipped") ? classList.remove("flipped") :
      classList.add("flipped");
  };

  $(card).flip({
    trigger: "click"
  });
  $(card).click(onClickEventHanlder);
  $(card).on("flip:done", onFlipDoneEventHandler);

  return card;
};

let checkIfMatch = function(card) {
  let matchFound = false;
  let cards = document.querySelectorAll(".card");
  cards.forEach(c => {

    if (c.isFlipped() && c.id != card.id && (c.icon === card.icon)) {
      matchFound = true;
    }
  });
  return matchFound;
};

let createCards = function() {
  let cards = [];
  const icons = ["fa-moon-o", "fa-bicycle", "fa-space-shuttle", "fa-usb",
    "fa-user-md", "fa-superpowers", "fa-university", "fa-sign-language"
  ];

  let cardId = 1;
  for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 8; j++) {
      let card = new Card(cardId++, icons[j]);
      cards.push(card);
    }
  }
  return cards;
}


function shuffle(cards) {
  var i = 0,
    j = 0,
    temp = null

  for (i = cards.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = cards[i]
    cards[i] = cards[j]
    cards[j] = temp
  }

};

function fillGridWithCards(cards) {
  let grid = document.querySelector(".grid");
  for (var i = 0; i < 16; i++) {
    grid.appendChild(cards[i]);
  }
}

let cards = createCards();
fillGridWithCards(cards);

document.querySelector("button[name=shuffle]").addEventListener("click", function() {
  let grid = document.querySelector(".grid");
  grid.innerHTML = "";
  shuffle(cards);
  fillGridWithCards(cards);


});
