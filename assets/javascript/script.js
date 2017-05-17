$(document).ready(function(){

var arrayPick = ["rock", "paper", "scissors", "lizard", "spock"]

var compGuess
var guess

var result
var resultArray = ["Won", "Lost", "Draw"]

var winCount = 0;
var lossCount = 0

//superfluos hover feature
$(".gameBtn").hover(function() {
	$(".gameArrow").css("opacity", ".2");
	$("#"+$(this).context.id+"Beats").css("opacity", "1");
}, function() {
	$(".gameArrow").css("opacity", "1");
});

//add a single player multiplayer here
$(".gameBtn").on("click", play)

function play () {

	$(".gameBtn").off()

	guess = $(this).context.id
	var userGuess = parseInt($(this).attr("data-value"))

	//this makes the icon of users guess in the current play div
	$("#userIcon").append($("<img class=icon src=assets/images/"+guess+"/"+guess+"Icon.png>"))
	$("#userIcon").append($("<h5>"+guess+"</h5>"))
	

	setTimeout(function(){

		var compPick = Math.floor(Math.random()*5)
		compGuess = arrayPick[compPick]

		$("#oppIcon").append($("<img class=icon src=assets/images/"+compGuess+"/"+compGuess+"Icon.png>"))
		$("#oppIcon").append($("<h5>"+compGuess+"</h5>"))
		checkGuess(userGuess, compPick);
		}, 1000)

	setTimeout(setNext, 3000)
};//end of play function

function checkGuess(you, opp){
	
	if (you == opp){
		tie();
	} else {

		//rock
		if (you == 0){
			switch (opp){
				case 2:
					$("h4").text("Rock crushes Scissors")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 3:
					$("h4").text("Rock crushes Lizard")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 1:
					$("h4").text("Paper covers Rock")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
				case 4:
					$("h4").text("Spock vaporizes Rock")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
			}//end of switch
		}//end of rock

		//paper
		if (you == 1){
			switch (opp){
				case 0:
					$("h4").text("Paper covers Rock")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 4:
					$("h4").text("Paper disproves Spock")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 2:
					$("h4").text("Scissors cuts Paper")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
				case 3:
					$("h4").text("Lizard eats Paper")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
			}//end of switch
		}//end of paper

		//scissors
		if (you == 2){
			switch (opp){
				case 1:
					$("h4").text("Scissors cuts Paper")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 3:
					$("h4").text("Scissors decapitates Lizard")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 0:
					$("h4").text("Rock crushes Scissors")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
				case 4:
					$("h4").text("Spock crushes Scissors")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
			}//end of switch
		}//end of scissors

		//lizard
		if (you == 3){
			switch (opp){
				case 1:
					$("h4").text("Lizard eats Paper")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 4:
					$("h4").text("Lizard poisons Spock")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 0:
					$("h4").text("Rock crushes Lizard")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
				case 2:
					$("h4").text("Scissors decapitates Lizard")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
			}//end of switch
		}//end of lizard

		//spock
		if (you == 4){
			switch (opp){
				case 0:
					$("h4").text("Spock vaporizes Rock")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 2:
					$("h4").text("Spock crushes Scissors")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "green")
					win();
					break;
				case 1:
					$("h4").text("Paper disproves Spock")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
				case 3:
					$("h4").text("Lizard poisons Spock")
					$("h4").css("font-weight", "bold")
					$("h4").css("color", "red")
					lose()
					break;
			}//end of switch
		}//end of spock

	}//end of check
}//end of function

function tie() {
	$("h4").text("Draw")
	$("h4").css("font-weight", "bold")
	result = 2;
}
function win() {
	console.log("win")
	result = 0;
	winCount++;
	$("#winHere").text(winCount)
}
function lose() {
	console.log("lose")
	result = 1;
	lossCount++;
	$("#lossHere").text(lossCount)
}

function setNext() {

	//reset ready
	$("h4").text("Ready")
	$("h4").css("font-weight", "normal")
	$("h4").css("color", "black")

	//add past plays
	var log = $("<div class=record>")
	log.append($("<img class=icon src=assets/images/"+guess+"/"+guess+"Icon.png>"))
	log.append(resultArray[result])
	log.append($("<img class=icon src=assets/images/"+compGuess+"/"+compGuess+"Icon.png>"))	
	$("#pastPlays").prepend(log)

	//empty icons from current play
	$("#oppIcon").empty()
	$("#userIcon").empty()

	//reset gameboard diagram
	$(".gameArrow").css("opacity", "1")

	//return hover feature
	$(".gameBtn").hover(function() {
	$(".gameArrow").css("opacity", ".2");
	$("#"+$(this).context.id+"Beats").css("opacity", "1");
	}, function() {
	$(".gameArrow").css("opacity", "1");
	});

	//return on click
	$(".gameBtn").on("click", play)
}

});//end of document ready