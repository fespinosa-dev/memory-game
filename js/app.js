'use strict'
/**
 * @description Represents the main Grid
 */
let Grid = function() {
	var numberOfMoves = 0;
	var numberOfClicks = 0;
	var previewsFlippedCard = {};
	let remainingStars = 3;
	let timerEnabled = false;
	let grid = document.querySelector(".container");
	this.cards = cards;
	var timer = new Timer();
	

	/**
	 * @description fills the main grid with given cards and internally stores them.
	 * @param {array} cards
	 */
	grid.fillWithCards = function (cards){
		let columnClasses = ["three", "six","twelve"]
		let cardIterator = cards[Symbol.iterator]();
			for (let rowCount = 0; rowCount < 4; rowCount++) {
					let row = createRow();
				for (let columnCount = 0; columnCount < 4; columnCount++) {
					let column = document.createElement("div");
					column.setAttribute("class", `${columnClasses} column`)
					row.appendChild(cardIterator.next().value);
				}

				grid.appendChild(row);
			}
			this.cards = cards;
	}

	let createRow = function(){
		let row = document.createElement("div");
		row.setAttribute("class", "row");
		return row;
	}

	/**
	 * @description clears the grid by emptying it's content (cards)
	 */
	grid.clear = function() {
		grid.innerHTML = "";
	};

	/**
	 * @description shuffles the cards in the grid using the fisher yates algorithm.
	 */
	grid.shuffle = function() {
		grid.clear();
		var i = 0,
			j = 0,
			temp = null
		for (i = this.cards.length - 1; i > 0; i -= 1) {
			j = Math.floor(Math.random() * (i + 1))
			temp = this.cards[i]
			this.cards[i] = this.cards[j]
			this.cards[j] = temp
		}
		grid.fillWithCards(cards);
	};

	/**
	 * @description Resets the grid to start playing again.
	 */
	grid.reset = function() {
		resetCards(this.cards);
		grid.shuffle();
		numberOfClicks = 0;
		resetScorePanel();
		timer.stop();
		timer.reset();
		timerEnabled = false;
	};

	/**
	 * @description Resets the score panel.
	 */
	let resetScorePanel = function() {
		numberOfMoves = 0;
		displayNumberOfMoves(0);
		$(".fa-star-o").removeClass("fa-star-o").addClass("fa-star");
	};

	/**
	 * Callback to run when the animation is done.
	 * @callback afterDone
	 * @param {Object[]} cards - the cards used to animate.
	 */
	/**
	 * @description Animates a given array of cards and passes the cards to a callback function.
	 * @param {Object} options
	 * @param {String} options.type - An animation's type.
	 * @param {function(object[]):void} options.afterDone - Callback function.
	 * @param {Object[]} cards - the cards given to animate.
	 */
	let animate = function(options, cards) {
		let type = options["type"];
		let afterDone = options["afterDone"]
		if (type && afterDone) {
			$(cards).animateCss(type, afterDone.bind(null, cards));
		}
		if (type) {
			$(cards).animateCss(type);
		}
	};

	/**
	 * @description Event handler for handling user click|flip events.
	 * @param {Object} event - the event.
	 */
	let clickEventHandler = function(event) {
		let currentFlippedCard = event.target.parentElement;
		if (isNotCard(currentFlippedCard) || currentFlippedCard.matches(".matched")) {
			return;
		}
		if (!timerEnabled) { 
			timer.show();
			timerEnabled = true;
		}
		numberOfClicks++;
		if (numberOfClicks > 1 && !(currentFlippedCard.id === previewsFlippedCard.id)) {
			
			let cardsMatched = checkMatch(currentFlippedCard, previewsFlippedCard);
			if (cardsMatched) {
				$([previewsFlippedCard, currentFlippedCard]).addClass("matched");
				animate({
					type: "rubberBand"
				}, [currentFlippedCard, previewsFlippedCard]);
				if (checkIfAllMatched()) {
					let timeTaken = timer.stop();
					showWinningPanel(numberOfMoves, remainingStars, timeTaken);
				}
			} else {
				$([previewsFlippedCard.back, currentFlippedCard.back]).addClass("mismatch");
				animate({
					type: "wobble",
					afterDone: resetCards
				}, [previewsFlippedCard, currentFlippedCard]);
			}
			numberOfClicks = 0;
			numberOfMoves++;
			displayNumberOfMoves(numberOfMoves);
			if (numberOfMoves === 10 || numberOfMoves > 15) {
				remainingStars = decreaseStarRating();
			}
		}
		previewsFlippedCard = currentFlippedCard; // tmp to use for the next click
	};

	/**
	 * @description increments the number of moves and displays them on the score panel.
	 * @param {number} numberOfMoves - the number of moves to be displayed.
	 */
	let displayNumberOfMoves = function(numberOfMoves) {
		document.querySelector(".moves").innerHTML = `${numberOfMoves} moves`;
	};

	/**
	 * @description decreases one star.
	 * @return {number} the remaining stars.
	 */
	let decreaseStarRating = function() {
		if ($(".fa-star").length > 1){
			$(".rating").children(".fa-star").last().removeClass("fa-star").addClass("fa-star-o");
		}
		return $(".fa-star").length;
	};

	/**
	 * @description increments the number of moves and displays them on the score panel.
	 * @param {object} element - the element to check against.
	 * @returns {boolean} true or false.
	 */
	let isNotCard = function(element) {
		return (element && !element.matches(".card"));
	};

	/**
	 * @description reset a given array of cards to their inital state.
	 * @param {object[]} cards - the given cards.
	 */
	let resetCards = function(cards) {
		$(cards).children(".back").removeClass("mismatch");
		$(cards).removeClass("matched");
		$(cards).flip(false);
		$(cards).one("click", function() {
			$(this).flip(true);
		});
	};

	/**
	 * @description checks two cards to see whether they match or not.
	 * @param {Object} card1 - the first card to be compared.
	 * @param {Object} card2 - the second card to be compared.
	 */
	let checkMatch = function(card1, card2) {
		let cardsMatched = false;
		if (card1.icon === card2.icon) {
			cardsMatched = true;
		}
		return cardsMatched;
	};

	/**
	 * @description checks if all the cards are already matched.
	 * @returns {boolean} - true or false
	 */
	let checkIfAllMatched = function() {
		let matches = $(".matched").length;
		return matches === 16;
	};
	$(grid).click(clickEventHandler);
	return grid;
};

/**
 * @description
 * Represents a deck card.
 */
let Card = function(id, icon) {
	let card = document.createElement("div");
	card.icon = icon;
	card.id = `card-${id}`;
	card.setAttribute("class", "card");
	let front = document.createElement("div");
	front.id = `card-front-${id}`;
	front.setAttribute("class", "front");
	let iconTag = document.createElement("i");
	iconTag.setAttribute("class", "fa fa-4x card-icon " + icon);
	let back = document.createElement("div");
	back.appendChild(iconTag);
	back.setAttribute("class", "back");
	back.id = `card-back-${id}`;
	card.front = front;
	card.back = back;
	card.appendChild(front);
	card.appendChild(back);
	/**
	 * @description checks whether the card is already flipped or not.
	 * @returns {boolean}  true or false.
	 */
	card.isFlipped = function() {
		return $(card).data("flip-model").isFlipped;
	};

	$(card).flip({
		trigger: "manual",
		speed: 100
	});
	$(card).one("click", function() {
		$(this).flip(true);
	});
	return card;
};

/**
 * @description cretes an array of cards.
 * @returns {Object[]} cards - the array of cards
 */
let createCards = function() {
	let cards = [];
	const icons = ["fa-moon-o", "fa-bicycle", "fa-space-shuttle", "fa-usb", "fa-user-md",
		"fa-superpowers", "fa-university", "fa-sign-language"
	];
	let cardId = 1;
	for (let i = 0; i < 2; i++) {
		for (let j = 0; j < 8; j++) {
			let card = new Card(cardId++, icons[j]);
			cards.push(card);
		}
	}
	return cards;
};

/**
 * @description closes the winning panel
 */
let closeWinningPanel = function() {
	document.querySelector(".winning-panel").style.display = "none";;
};

/**
 * @description displays the winning panel showing the number of moves and stars.
 * @param {number} numberOfMoves - the number of moves to be shown.
 * @param {number} stars - the number of stars to be shown.
 * @param {number} timeTaken - the timeTaken to win the game.
 */
let showWinningPanel = function(numberOfMoves, stars, timeTaken) {
	let winningPanel = document.querySelector(".winning-panel");
	let scoreDetails = winningPanel.children[0].children[1];
	scoreDetails.innerHTML = `With ${numberOfMoves} moves and ${stars} stars in ${timeTaken}`;
	winningPanel.style.display = "block";
};

/**
 * @description Represents a timer object
 */
var Timer = function() {
	this.interval = {};

	/**
	 * @description displays a timer above the score panel of the game.
	 * from: https://stackoverflow.com/a/7910506
	 */
	this.show = function() {
		var sec = 0;

		function pad(val) {
			return val > 9 ? val : "0" + val;
		}
		this.interval = setInterval(function() {
			$("#seconds").html(pad(++sec % 60));
			$("#minutes").html(pad(parseInt(sec / 60, 10)));
		}, 1000);
	};

	/**
	 * @description stops the timer and returns where it stops.
	 * @return {string} - 00:00 string representation of the time where it stops. 
	 */
	this.stop = function() {
		clearInterval(this.interval);
		let time = `${$("#minutes").html()}:${$("#seconds").html()}`;
		return time;
	};
	/**
	 * @description resets the timer.
	 */
	this.reset = function() {
		$("#seconds").html("");
		$("#minutes").html("");
		clearInterval(this.interval);
	};

	

};


var cards = createCards();
var grid = new Grid();
grid.fillWithCards(cards);


$(".repeat-btn").click(function() {
	grid.reset();

});
$(".button-primary").click(function() {
	grid.reset();
	closeWinningPanel();
});
