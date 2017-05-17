$(document).ready(function(){

var arrayPick = ["rock", "paper", "scissors", "lizard", "spock"]

var compGuess
var guess

var result
var resultArray = ["Won", "Lost", "Draw"]

var winCount = 0;
var lossCount = 0
//superfluos hover feature should do a fade in and out
$(".gameBtn").hover(function() {
	$(".gameArrow").css("visibility", "hidden");
	$("#"+$(this).context.id+"Beats").css("visibility", "visible");
}, function() {
	$(".gameArrow").css("visibility", "visible");
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
			if (opp == 2||opp == 3){
				win();
			} else {
				lose();
			}
		}//end of rock

		if (you == 1){
			if (opp == 0 || opp == 4){
				win();
			} else {
				lose();
			}
		}//end of paper

		if (you == 2){
			if (opp == 1 || opp == 3){
				win();
			} else {
				lose();
			}
		}//end of scissors

		if (you == 3){
			if (opp == 2 || opp == 4){
				win();
			} else {
				lose();
			}
		}//end of lizard

		if (you == 4){
			if (opp == 0 || opp == 2){
				win();
			} else {
				lose();
			}
		}//end of spock
	}//end of check
}//end of function

function tie() {
	$("h4").text("Draw")
	$("h4").css("font-weight", "bold")
	result = 2;
}
function win() {
	$("h4").text("Win!!")
	$("h4").css("font-weight", "bold")
	$("h4").css("color", "green")
	result = 0;
	winCount++;
	$("#winHere").text(winCount)
}
function lose() {
	$("h4").text("Lose")
	$("h4").css("font-weight", "bold")
	$("h4").css("color", "red")
	result = 1;
	lossCount++;
	$("#lossHere").text(lossCount)
}

function setNext() {
	$("h4").text("Ready")
	$("h4").css("font-weight", "normal")
	$("h4").css("color", "black")

	var log = $("<div class=record>")
	log.append($("<img class=icon src=assets/images/"+guess+"/"+guess+"Icon.png>"))
	log.append(resultArray[result])
	log.append($("<img class=icon src=assets/images/"+compGuess+"/"+compGuess+"Icon.png>"))	
	$("#pastPlays").prepend(log)

	$("#oppIcon").empty()
	$("#userIcon").empty()

	$(".gameArrow").css("visibility", "visible")

	$(".gameBtn").hover(function() {
	$(".gameArrow").css("visibility", "hidden");
	$("#"+$(this).context.id+"Beats").css("visibility", "visible");
	}, function() {
	$(".gameArrow").css("visibility", "visible");
	});

	$(".gameBtn").on("click", play)
}

});//end of document ready