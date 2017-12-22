'use strict'


var Table = function(rows, cells) {
  this.rows = rows;
  this.cells = cells;


  this.build = function() {
    let table = document.querySelector(".grid");
    for (var i = 0; i < this.rows; i++) {
      var row = new Row();
      for (var j = 0; j < this.cells; j++) {
        var cell = new Cell();
        row.appendChild(cell);
      }
      table.appendChild(row);
    }
    return table;
  }


};




var Row = function() {
  let tr = document.createElement("tr");
  tr.setAttribute("class", "row");


  return tr;
};

var Cell = function() {
  let td = document.createElement("td");
  td.setAttribute("class", "cell");

  return td;
};




var Card = function(icon) {
  this.icon = icon;

  let iconTag = document.createElement("i");
  iconTag.setAttribute("class", "fa fa-3x " + this.icon);
  let divCard = document.createElement("div");
  divCard.setAttribute("class", "card");
  divCard.setAttribute("id", "card");
  divCard.appendChild(iconTag);
  let divFrontCard = document.createElement("div");
  divFrontCard.setAttribute("class", "back");
  divFrontCard.appendChild(iconTag);
  let divBackCard = document.createElement("div");
  divBackCard.setAttribute("class", "front");
  divCard.appendChild(divFrontCard);
  divCard.appendChild(divBackCard);


  $(divCard).flip({
    trigger: 'click'
  });



  return divCard;
}

function shuffle(table) {

  let rows = table.cells;

  for (var i = 0; i < rows.length; i++) {
    for (var j = 0; j < 4; j++) {

    }
  }


}






function createCards() {
  let cards = new Array();
  let icons = ["fa-moon-o", "fa-bicycle", "fa-space-shuttle", "fa-usb",
    "fa-user-md", "fa-superpowers", "fa-university", "fa-sign-language"
  ];

  for (var i = 0; i < icons.length; i++) {
    let card = new Card(icons[i]);
    cards.push(card);
  }
  return cards;
}


var table = new Table(4, 4).build();
var body = document.querySelector("body");
body.appendChild(table);
