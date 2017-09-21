//Module Pattern
//(1) Create an IIFE to ensure data safety inside it
//(2) It returns an object containing all of the functions that we want to be public

// Budget Module
// Income and Expense Constructors
var budgetController = (function(){
	var Expense = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
		this.percentage = -1;
	};

	// Use different functions for different purposes
	// This method calculates the percentage
	Expense.prototype.calcPercentage = function(totalIncome){
		if (totalIncome>0) {
			this.percentage = Math.round(( this.value/totalIncome)*100);
		} else {
			this.percentage = -1;
		}
	};

	// This method returns the percentage
	Expense.prototype.getPercentage = function(){
		return this.percentage;
	}

	var Income = function(id, description, value) {
		this.id = id;
		this.description = description;
		this.value = value;
	};

	// Instead of using different variables, it's better to create a data structure
	// to host all data
	var data = {
		allItems: {
			exp: [],
			inc: []
		},
		totals: {
			exp: 0,
			inc: 0
		},
		budget: 0,
		percentage: -1
	};

	var calculateTotal = function(type) {

		var sum = 0;
		// It's better to use forEach than reduce to calculate the sum becuase current.value is the number we need. Current itself is an object.
    data.allItems[type].forEach(function(current) {
        sum += current.value;
    });
    data.totals[type] = sum;

	};

	// Add a public methods to allow other modules to add new data to our data structure
	return {
		addItem: function(type, des, val) {
			var newItem, ID; 

			// Create new ID
			ID = data.allItems[type].length<=0? 0 : data.allItems[type][data.allItems[type].length-1].id + 1;

			// Create new item
			if (type === 'exp') {
				newItem = new Expense(ID, des, val);
			} else if (type === 'inc') {
				newItem = new Income(ID, des, val);
			}

			// Add to the data structure
			data.allItems[type].push(newItem);
			return newItem;
		}, 

		deleteItem: function(type, id){
			var index;
			
			// The lecture's way of finding the index of the id
			// ids = data.allItems[type].map(function(current){
			// 	return current.id;
			// });
			// index = ids.indexOf(id);

			data.allItems[type].forEach(function(cur, i, arr){
				if (cur.id === id) return index = i;
			})

			if (index != -1) {
				data.allItems[type].splice(index, 1);
			};
		},

		// Separation of concerns: calculate budget and get budget are two functions
		// Each function serves one purpse
		calculateBudget: function() {

			// Calculate total income and expenses
			calculateTotal('exp');
			calculateTotal('inc');

			// Calculate the budget: income - expenses 
			data.budget = data.totals.inc - data.totals.exp;

			// Calcuate the percentage of income that we spent
			if (data.totals.inc > 0) {
				data.percentage = Math.round((data.totals.exp / data.totals.inc)*100);
			} else {
				data.percentage = -1;
			}
			

		},

		calculatePercentages: function(){
			data.allItems.exp.forEach(function(current){
				current.calcPercentage(data.totals.inc);
			});
		},

		getPercentages: function(){
			var allPerc = data.allItems.exp.map(function(current){
				return current.getPercentage();
			});
			return allPerc;
		},

		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			} 
		},

		testing: function() {
			console.log(data);
		}
	};

})();


// UI Module
var UIController = (function(){
	var DOMstrings = {
		inputType: '.add__type',
		inputDescription: '.add__description',
		inputValue: '.add__value',
		inputBtn: '.add__btn',
		incomeContainer: '.income__list',
		expenseContainer: '.expense__list',
		budgetLabel: '.budget__value',
		incomeLabel: ".budget__income--value",
		expenseLabel: ".budget__expense--value", 
		percentageLabel: ".budget__expense--percentage", 
		container: '.container',
		expensesPercentLabel: '.item__percentage',
		dateLabel: '.budget__title--month'
	};

	var formatNumber = function(num, type) {
		var numSplit, int, dec, sign;
		// + or - before number
		// exactly 2 decimal points
		// comma separating the thousands

		num = Math.abs(num);
		num = num.toFixed(2); // num is a string now
		numSplit = num.split('.');
		int = numSplit[0];
		if (int.length > 3) {
			int = int.substr(0, int.length-3) + ',' + int.substr(int.length-3, int.length);
		}

		dec = numSplit[1];

		sign = type === 'exp'? '-' : '+';

		return sign + ' ' + int + '.' + dec;
	};

	return {
		getInput: function(){
			return {
				type: document.querySelector(DOMstrings.inputType).value,
				description: document.querySelector(DOMstrings.inputDescription).value,
				value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
			}
		},

		clearInput: function(){
			var fields, fieldsArr;
			fields = document.querySelectorAll(DOMstrings.inputDescription + ', ' + DOMstrings.inputValue);

			//fieldsArr = Array.prototype.slice.call(fields);
			fields.forEach(function(current){
				current.value = '';
			});
			fields[0].focus();
		},

		getDOMstrings: function(){
			return DOMstrings;
		},

		addListItem: function(obj, type) {
			var html, newHTML, element;
			// Create HTML string with placeholder text 
			if (type === 'inc') {
				element = DOMstrings.incomeContainer;
				html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
			} else if (type === 'exp') {
				element = DOMstrings.expenseContainer;
				html = '<div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">%percentage%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
			}
			// Replace the placeholder text with some actual data
			newHTML = html.replace('%id%', obj.id);
			newHTML = newHTML.replace('%description%', obj.description);
			newHTML = newHTML.replace('%value%', formatNumber(obj.value, type));

			// Insert the HTML into the DOM
			document.querySelector(element).insertAdjacentHTML('beforeend', newHTML);

		}, 

		deleteListItem: function(selectorID){
			var child;
			child = document.getElementById(selectorID);
			child.parentNode.removeChild(child);
		},

		displayBudget: function (obj) {
			var type; 
			obj.budget>0? type = 'inc' : type = 'exp';

			document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
			document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, 'inc');
			document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, 'exp');
			
			if (obj.percentage>0){
				document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";
			} else {
				document.querySelector(DOMstrings.percentageLabel).textContent = '---';
			}
		},

		dispalyPercentage: function(percentages) {
			var fields = document.querySelectorAll(DOMstrings.expensesPercentLabel); 

			fields.forEach(function(current, index, array){
				current.textContent = percentages[index] > 0? percentages[index] + '%' : '---'; 
			});
		}, 

		displayMonth: function(){
			var now, year, month, months;
			months = ['January', 'Feburary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ]

			now = new Date();
			year = now.getFullYear();
			month = now.getMonth();
			document.querySelector(DOMstrings.dateLabel).textContent = months[month-1] + ', ' + year;
		},

		changeType: function(){
			var fields = document.querySelectorAll(
				DOMstrings.inputType + ',' + 
				DOMstrings.inputDescription + ',' +
				DOMstrings.inputValue
			);

			fields.forEach(function(current){
				current.classList.toggle('red-focus');
			});

			document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
		}

	};
})();

// App Module
// IIFE can take arguments; the purpose of using different names (budgetCtrl VS budgetCtrl)
// is to keep the different modules separated and independent
var controller = (function(budgetCtrl, UICtrl){
	var setupEventListeners = function(){
		var DOM = UICtrl.getDOMstrings();

		// Add evnent handler for click & enter
		document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
		addEventListener('keypress', function(event){
			if (event.keyCode === 13 || event.which === 13) {
				ctrlAddItem();
			}
		});

		//Add event handler for delete button
		document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);

		document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changeType);

	};

	var updateBudget = function() {
		// 1. Calculate the budget
		budgetCtrl.calculateBudget();

		// 2. Return the budget
		var budget = budgetCtrl.getBudget();


		// 3. Display the budget on the UI
		//console.log(budget);
		UICtrl.displayBudget(budget);
	};

	var updatePercentages = function(){

		// 1. Calculate percentages
		budgetCtrl.calculatePercentages();

		// 2. Read percentages from the budget controller
		var percentages = budgetCtrl.getPercentages();

		// 3. Update the UI with the new percentages
		UICtrl.dispalyPercentage(percentages);
	};

	var ctrlAddItem = function(){
		var input, newItem;

		// 1. Get the input data
		input = UICtrl.getInput();

		// Create input validation
		if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
			// 2. Add the item to the budget controller
			newItem = budgetCtrl.addItem(input.type, input.description, input.value);

			// 3. Add the item to the UI 
			UICtrl.addListItem(newItem, input.type);
			
			// 4. Clear the fields
			UICtrl.clearInput();

			// 5. Calculate and update budget 
			updateBudget();

			// 6. Update expense percentage
			updatePercentages();

		};

	};

	var ctrlDeleteItem = function(event){
		var itemID, splitID, type, id;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

		if (itemID) {
			splitID = itemID.split('-');
			type = splitID[0];
			id = parseInt(splitID[1]);

			// 1. Delete the item from the data structure 
			budgetCtrl.deleteItem(type, id);

			// 2. Delete the item from UI 
			UICtrl.deleteListItem(itemID);

			// 3. Update and show the new budget 
			updateBudget();

			// 4. Update percentage;
			updatePercentages();
		}

	};

	return {
		// Set up an initialization function to be called 
		init: function(){
			console.log('Application has started.');
			setupEventListeners();
			UICtrl.displayBudget({
				budget: 0,
				totalInc: 0,
				totalExp: 0,
				percentage: -1
			});
			UICtrl.displayMonth();
		}
	};

})(budgetController, UIController);

// Call the initialization function
controller.init();