/*
GAME RULES:

- The game has 2 players, playing in rounds
- In each turn, a player rolls a dice as many times as he whishes. Each result get added to his ROUND score
- BUT, if the player rolls a 1, all his ROUND score gets lost. After that, it's the next player's turn
- The player can choose to 'Hold', which means that his ROUND score gets added to his GLBAL score. After that, it's the next player's turn
- The first player to reach 100 points on GLOBAL score wins the game

ADDITIONAL RULES:
- A play loses his entire score if he rolls two sixes in a roll
- The player can set winning score
- Add a second dice to the game. The player loses his current score when only one of them is an one. 

*/

var scores, roundScore, activePlayer, gamePlaying, previousDie; 

function init () {
	scores = [0, 0];
	roundScore = 0;
	activePlayer = 0;
	document.querySelector('.dice').style.display = 'none';
	document.getElementById('score-0').textContent = '0';
	document.getElementById('score-1').textContent = '0';
	document.getElementById('current-0').textContent = '0';
	document.getElementById('current-1').textContent = '0';
	document.getElementById('name-0').textContent = 'Player 1';
	document.getElementById('name-1').textContent = 'Player 2';
	document.querySelector('.player-0-panel').classList.remove('winner');
	document.querySelector('.player-1-panel').classList.remove('winner');
	document.querySelector('.player-0-panel').classList.remove('active');
	document.querySelector('.player-1-panel').classList.remove('active');
	document.querySelector('.player-0-panel').classList.add('active');
	gamePlaying = true;
}

init()


// Functions for the roll button 
document.querySelector('.btn-roll').addEventListener('click', function() {
	if (gamePlaying) {
		// 1. Random number
		var dice = Math.floor(Math.random()*6) + 1;

		// 2. Display the result
		document.querySelector('#current-' + activePlayer).textContent = dice;
		var diceDOM = document.querySelector('.dice');
		diceDOM.style.display = 'block';
		diceDOM.src = 'dice-' + dice + '.png' ;

		// 3. Update the round score IF the rolled number was NOT a 1
		if (dice === 6 && previousDie === dice) {
			scores[activePlayer] = 0;
			document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];
			nextPlayer();
		} else if (dice !== 1) {
			// Add score
			roundScore += dice;
			document.getElementById('current-' + activePlayer).textContent = roundScore;
			previousDie = dice
		}
		else {
			// Next player
			// Ternarry operator 
			nextPlayer();
		}
	}
	
});

function nextPlayer () {
	activePlayer === 0 ? activePlayer = 1 :  activePlayer = 0;
	roundScore = 0;

	document.getElementById('current-0').textContent = 0;
	document.getElementById('current-1').textContent = 0;		

	//activePlayer === 0 ?  document.querySelector('.player-1-panel').classList.remove('active') : document.querySelector('.player-0-panel').classList.remove('active');
	//activePlayer === 0 ? document.querySelector('.player-0-panel').classList.add('active') :  document.querySelector('.player-1-panel').classList.add('active');;

	document.querySelector('.player-0-panel').classList.toggle('active');
	document.querySelector('.player-1-panel').classList.toggle('active');

	document.querySelector('.dice').style.display='none';
	
};

// functions for the hold button 

document.querySelector('.btn-hold').addEventListener('click', function() {
	if (gamePlaying) {
		// Add current score to global score
		// The variable activePlayer has been changed in the btn-roll action! 
		scores[activePlayer] += roundScore;

		// Update the UI
		document.getElementById('score-' + activePlayer).textContent = scores[activePlayer];

		// Check if the player won the game
		if (scores[activePlayer] >= 100) {
			document.getElementById('name-' + activePlayer).textContent = 'Winner!';
			document.querySelector('.dice').style.display = 'none';
			document.querySelector('.player-' + activePlayer + '-panel').classList.add('winner'); 
			document.querySelector('.player-' + activePlayer + '-panel').classList.remove('active'); 
			gamePlaying = false;
		} else {
			// Change the player
			nextPlayer();
		};
	}
});

document.querySelector('.btn-new').addEventListener('click', init);