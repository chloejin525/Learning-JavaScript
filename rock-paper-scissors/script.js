// Game part
function getUserChoice(){
  var userInput = prompt('Rock, Paper, or Scissors?');
  userInput = userInput.toLowerCase();
  if (userInput === 'rock' || userInput === 'paper' || userInput === 'scissors'){
    return userInput;
  } else {
    console.log('Error!');
  }
}

function getComputerChoice(){
  num = Math.floor(Math.random() * 3);
  switch(num) {
    case 0:
      return 'rock';
    case 1:
      return 'paper';
    case 2: 
      return 'scissors';
  }
}

function determineWinner(userChoice, computerChoice) {
  if (userChoice === computerChoice){
    return 0;
  } else if (userChoice==='rock'){
      if(computerChoice ==='paper'){
        return 1;
      } else {
        return 2;
      }
  }
    
    else if (userChoice==='paper'){
      if(computerChoice ==='rock'){
        return 1;
      } else {
        return 2;
      }
  }
    
    else if (userChoice==='scissors'){
      if(computerChoice ==='paper'){
        return 1;
      } else {
        return 2;
      }
  }
}



function playGame(){
  var userChoice = getUserChoice();
  var computerChoice = getComputerChoice();
  console.log(`User: ${userChoice}`);
  console.log(`Computer: ${computerChoice}`);
  if (determineWinner(userChoice, computerChoice) === 0) {
    return "It's a tie!";
  } else if (determineWinner(userChoice, computerChoice) === 1) {
    return "You win!";
  } else {
    return "You lose...";
  }
}



//Webpate part



// tie:  'https://lolzombie.com/wp-content/uploads/2011/09/tumblr_lozjgrKzSC1qmgxb2o1_500.gif'
// win: https://media.giphy.com/media/o88b7sigrFmQE/giphy.gif'
// lose: http://www.gifmania.co.uk/Objects-Animated-Gifs/Animated-Toys/Rock-Paper-Scissors/Rock-Paper-Scissors-87021.gif'