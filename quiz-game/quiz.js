(function(){
	function Question(question, answers, correct){
		this.question = question;
		this.answers = answers;
		this.correct = correct;
	}

	//.displayQuestion is a prototype function, and that's why we can do questions[num].displayQuestion();
	// This way the code is reuseable 
	Question.prototype.displayQuestion = function() {
		console.log(this.question);
		for (var i = 0; i < this.answers.length; i++){
			console.log(i + ': '+ this.answers[i]);
		}
	}

	Question.prototype.checkAnswer = function(answer, callback) {
		var sc;
		if (answer === this.correct) {
			console.log('That is correct!');
			sc = callback(true);
		} else {
			console.log('Oops... Try again');
			sc = callback(false);
		}
		this.displayScore(sc);
	}

	Question.prototype.displayScore = function(score) {
		console.log('Current Score: ' + score);
		console.log('---------------------------------------------');
	}

	var q1 = new Question('What\'s the color of sky?', 
												['blue', 'green', 'red'], 0);
	var q2 = new Question('What\'s the shape of sun?', 
												['square', 'sphere', 'pyrimad'], 1);
	var q3 = new Question('What\'s the color of ocean?', 
												['purple', 'red', 'yellow', 'blue'], 3);
	var q4 = new Question('What\'s the color of grass?', 
												['red', 'pink', 'green', 'blue'], 2)
	var questions = [q1, q2, q3, q4];

	function score() {
		var sc = 0;
		return function(correct) {
			if (correct) {
				sc++;
			}
			return sc;
		}
	}

// keepScore is a value that the function score returns; if keepScore = function score () {....}, it is a function!
	var keepScore = score();

	function nextQuestion() {

		var num = Math.floor(Math.random() * questions.length);
		questions[num].displayQuestion();
		var answer = prompt('What is the correct answer?');

		if (answer !== 'exit') {
				questions[num].checkAnswer(parseInt(answer), keepScore);
				nextQuestion();
		} else {
			console.log('Bye!');
		}

	}
	
	nextQuestion();

})();





