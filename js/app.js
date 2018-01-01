'use strict'
/**
 * @description Represents the main Grid
 */
let Grid = function() {
	var numberOfMoves = 0;
	var numberOfClicks = 0;
	var previewsFlippedCard = {};
	let remainingStars = 3;
	let grid = document.querySelector( ".grid" );
	this.cards = [];
	/**
	 * @description fills the main grid with given cards and internally stores them.
	 * @param {array} cards
	 */
	grid.fillWithCards = function( cards ) {
		for ( var i = 0; i < 16; i++ ) {
			grid.appendChild( cards[ i ] );
		}
		this.cards = cards;
	};
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
		for ( i = this.cards.length - 1; i > 0; i -= 1 ) {
			j = Math.floor( Math.random() * ( i + 1 ) )
			temp = this.cards[ i ]
			this.cards[ i ] = this.cards[ j ]
			this.cards[ j ] = temp
		}
		grid.fillWithCards( cards );
	};
	/**
	 * @description Resets the grid to start playing again.
	 */
	grid.reset = function() {
		resetCards( this.cards );
		grid.shuffle();
		numberOfClicks = 0;
		resetScorePanel();
	};
	/**
	 * @description Resets the score panel.
	 */
	let resetScorePanel = function() {
		displayNumberOfMoves( 0 );
		$( ".fa-star-o" ).removeClass( "fa-star-o" ).addClass( "fa-star" );
	}
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
	let animate = function( options, cards ) {
		let type = options[ "type" ];
		let afterDone = options[ "afterDone" ]
		if ( type && afterDone ) {
			$( cards ).animateCss( type, afterDone.bind( null, cards ) );
		}
		if ( type ) {
			$( cards ).animateCss( type );
		}
	};
	/**
	 * @description Event handler for handling user click|flip events.
	 * @param {Object} event - the event.
	 */
	let clickEventHandler = function( event ) {
		let currentFlippedCard = event.target.parentElement;
		if ( isNotCard( currentFlippedCard ) || currentFlippedCard.matches( ".matched" ) ) {
			return;
		}
		numberOfClicks++;
		if ( numberOfClicks > 1 ) {
			let cardsMatched = checkMatch( currentFlippedCard, previewsFlippedCard );
			if ( cardsMatched ) {
				$( [ previewsFlippedCard, currentFlippedCard ] ).addClass( "matched" );
				animate( {
					type: "rubberBand"
				}, [ currentFlippedCard, previewsFlippedCard ] );
				if ( checkIfAllMatched() ) {
					showWinningPanel( numberOfMoves, remainingStars );
				}
			} else {
				$( [ previewsFlippedCard.back, currentFlippedCard.back ] ).addClass( "mismatch" );
				animate( {
					type: "wobble",
					afterDone: resetCards
				}, [ previewsFlippedCard, currentFlippedCard ] );
			}
			numberOfClicks = 0;
			numberOfMoves++;
			displayNumberOfMoves( numberOfMoves );
			if ( numberOfMoves === 4 || numberOfMoves > 7 ) {
				remainingStars = decreaseStarRating();
			}
		}
		previewsFlippedCard = currentFlippedCard; // tmp to use for the next click
	};
	/**
	 * @description increments the number of moves and displays them on the score panel.
	 * @param {number} numberOfMoves - the number of moves to be displayed.
	 */
	let displayNumberOfMoves = function( numberOfMoves ) {
		document.querySelector( ".moves" ).innerHTML = `${numberOfMoves} moves`;
	};
	/**
	 * @description decreases one star.
	 * @return {number} the remaining stars.
	 */
	let decreaseStarRating = function() {
		$( ".stars" ).children( ".fa-star" ).last().removeClass( "fa-star" ).addClass( "fa-star-o" );
		let remainingStars = $( ".fa-star" ).length;
		return ( remainingStars ? remainingStars : 0 );
	};
	/**
	 * @description increments the number of moves and displays them on the score panel.
	 * @param {object} element - the element to check against.
	 * @returns {boolean} true or false.
	 */
	let isNotCard = function( element ) {
		return ( element && !element.matches( ".card" ) );
	};
	/**
	 * @description reset a given array of cards to their inital states.
	 * @param {object[]} cards - the given cards.
	 */
	let resetCards = function( cards ) {
		$( cards ).children( ".back" ).removeClass( "mismatch" );
		$( cards ).removeClass( "matched" );
		$( cards ).flip( false );
		$( cards ).one( "click", function() {
			$( this ).flip( true );
		} );
	};
	/**
	 * @description checks two cards to see whether they match or not.
	 * @param {Object} card1 - the first card to be compared.
	 * @param {Object} card2 - the second card to be compared.
	 */
	let checkMatch = function( card1, card2 ) {
		let cardsMatched = false;
		if ( card1.icon === card2.icon ) {
			cardsMatched = true;
		}
		return cardsMatched;
	};
	/**
	 * @description checks if all the cards are already matched.
	 * @returns {boolean} - true or false
	 */
	let checkIfAllMatched = function() {
		let matches = $( ".matched" ).length;
		return matches === 16;
	};
	$( grid ).click( clickEventHandler );
	return grid;
};
/**
 * @description
 * Represents a deck card.
 */
let Card = function( id, icon ) {
	let card = document.createElement( "div" );
	card.icon = icon;
	card.id = `card-${id}`;
	card.setAttribute( "class", "card" );
	let front = document.createElement( "div" );
	front.id = `card-front-${id}`;
	front.setAttribute( "class", "front" );
	let iconTag = document.createElement( "i" );
	iconTag.setAttribute( "class", "fa fa-3x card-icon " + icon );
	let back = document.createElement( "div" );
	back.appendChild( iconTag );
	back.setAttribute( "class", "back" );
	back.id = `card-back-${id}`;
	card.front = front;
	card.back = back;
	card.appendChild( front );
	card.appendChild( back );
	/**
	 * @description checks whether the card is already flipped or not.
	 * @returns {boolean}  true or false.
	 */
	card.isFlipped = function() {
		return $( card ).data( "flip-model" ).isFlipped;
	};
	$( card ).flip( {
		trigger: "manual",
		speed: 100
	} );
	$( card ).one( "click", function() {
		$( this ).flip( true );
	} );
	return card;
};
/**
 * @description cretes an array of cards.
 * @returns {Object[]} cards - the array of cards
 */
let createCards = function() {
	let cards = [];
	const icons = [ "fa-moon-o", "fa-bicycle", "fa-space-shuttle", "fa-usb", "fa-user-md",
		"fa-superpowers", "fa-university", "fa-sign-language"
	];
	let cardId = 1;
	for ( let i = 0; i < 2; i++ ) {
		for ( let j = 0; j < 8; j++ ) {
			let card = new Card( cardId++, icons[ j ] );
			cards.push( card );
		}
	}
	return cards;
};
/**
 * @description closes the winning panel
 */
let closeWinningPanel = function() {
	document.querySelector( ".winning-panel" ).style.display = "none";;
};
/**
 * @description displays the winning panel showing the number of moves and stars.
 * @param {number} numberOfMoves - the number of moves to be shown
 * @param {number} stars - the number of stars to be shown
 */
let showWinningPanel = function( numberOfMoves, stars ) {
	let winningPanel = document.querySelector( ".winning-panel" );
	let scoreDetails = winningPanel.children[ 0 ].children[ 1 ];
	scoreDetails.innerHTML = `With ${numberOfMoves} moves and ${stars} Stars`;
	winningPanel.style.display = "block";
};
var grid = new Grid();
var cards = createCards();
grid.fillWithCards( cards );
$( ".repeat-btn" ).click( function() {
	grid.reset();
} );
$( ".play-again-btn" ).click( function() {
	grid.reset();
	closeWinningPanel();
} );
