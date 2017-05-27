$(document).ready(function(){


// Initialize Firebase
var config = {
    apiKey: "AIzaSyBVCXuzKh8JIiac-T0RF29dMKqKlm5jB84",
    authDomain: "rpsls-game-c1922.firebaseapp.com",
    databaseURL: "https://rpsls-game-c1922.firebaseio.com",
    projectId: "rpsls-game-c1922",
    storageBucket: "rpsls-game-c1922.appspot.com",
    messagingSenderId: "660824625426"
};

firebase.initializeApp(config);

var database = firebase.database()

var sv
var svArr

var gameKey
var players

var userFinder

var userKey
var oppKey

var userID
var oppID

var arrayPick = ["rock", "paper", "scissors", "lizard", "spock"]

var userGuess
var oppGuess
var compGuess
var guess

var userName = "You"

var result
var resultArray = ["Won", "Lost", "Draw"]

var winCount = 0;
var lossCount = 0

var playerCount;

$(".gameBtn").css("visibility", "hidden")
$(".gameArrow").css("visibility", "hidden");	

player()

//function that determines single player and multiplayer
// -----------------------------------------------------------------
function player (){

	//-----------------single-----------------
	$("#gameBoard").append($("<button id=single>Single Player</button>"))
	$("#gameBoard").append($("<button id=multi>Multiplayer</button>"))

	$("#single").on("click", function(){
		playerCount = 1;
		$("#single").remove()
		$("#multi").remove()
		$(".gameBtn").css("visibility", "visible")
		$(".gameArrow").css("visibility", "visible");	
	})

	//----------------multi-----------------
	$("#multi").on("click", function(){
		playerCount = 2;

		$("#single").remove()
		$("#multi").remove()

		$(".form-group").css("visibility", "visible")

		$("#submit-guess").on("click", function(event){

			event.preventDefault();

			if (svArr == 0){

				gameKey = database.ref().push().key;

			} else if (svArr.length > 0) {
				for (i=0; i<svArr.length; i++){
					if (Object.keys(sv[svArr[i]]).length < 2){
						gameKey = svArr[i];
						oppKey = Object.keys(sv[svArr[i]])[0];
					} else {
						gameKey = database.ref().push().getKey();
					}//end if else to find open game
				}//end for loop to find open game
			}//end of svarr if else

			if (gameKey != undefined){

				userName = $("#user-name").val().trim()

				userKey = database.ref().child(gameKey).push({
					"name":userName,
					"status": "yo",
					"choice": "",
					"choiceValue": "",
					"chat": ""
				}).key;

				$("#your-name").text($("#user-name").val().trim());

				database.ref(gameKey+"/"+userKey).on("value", function(snapshotU){
					userID=snapshotU.val()
					database.ref(gameKey+"/"+userKey).onDisconnect().remove();
				})

				database.ref(gameKey).on("value", function(snapshotG){

					var gkArr = Object.keys(snapshotG.val())
					if(gkArr.length > 1){
						if (oppKey == undefined){
							oppKey = gkArr[1];
							database.ref(gameKey+"/"+oppKey).on("value", function(snapshotO){
								oppID = snapshotO.val()
								$("#opp-name").text(oppID.name)
								if (oppID.choice.length > 1){
									oppGuess = oppID.choice
									oppGuessID = oppID.choiceValue
									$("#oppIcon").html($("<img class=icon id=oppImg src=assets/images/"+oppGuess+"/"+oppGuess+"Icon.png><h5>"+oppGuess+"</h5>"))
									$("#oppReadyBox").css("background-color", "green")
									ifReady();
								}

								if(oppID.chat.length > 0){
									var oppChatLine = $("<p>"+oppID.name+": "+oppID.chat+"</p>")
									$("#chat").prepend(oppChatLine);
									$("#userChat").val("")

									database.ref().child(gameKey+"/"+oppKey).update({
										"chat":""
									})
								}
							})
							database.ref().child(gameKey+"/"+oppKey).update({
								"status":"whatup"
							})

						}
					}

				})
			}

			database.ref(gameKey+"/"+oppKey).on("value", function(snapshotO){
				oppID = snapshotO.val()
				if(oppID != null){

					$("#opp-name").text(oppID.name)

					if (oppID.choice.length > 1){
						oppGuess = oppID.choice
						oppGuessID = oppID.choiceValue
						$("#oppIcon").html($("<img class=icon id=oppImg src=assets/images/"+oppGuess+"/"+oppGuess+"Icon.png><h5>"+oppGuess+"</h5>"))
						$("#oppReadyBox").css("background-color", "green")
						ifReady();
					}

					if(oppID.chat.length > 0){
						var oppChatLine = $("<p>"+oppID.name+": "+oppID.chat+"</p>")
						$("#chat").prepend(oppChatLine);
						$("#userChat").val("")
						database.ref().child(gameKey+"/"+oppKey).update({
							"chat":""
						})
					}
					
				}
			})

			$(".form-group").css("visibility", "hidden");

			$(".gameBtn").css("visibility", "visible");
			$(".gameArrow").css("visibility", "visible");

		})	
	})
}//end of function player

// -----------------Firebase listenting function----------

database.ref().on("value", function(snapshotA) {

	sv = snapshotA.val();
	if (sv == null){
		svArr = 0
	} else {
		svArr = Object.keys(sv);
      	// userFinder = svArr.indexOf(userKey);
	}

}, function(errorObject) {
	console.log("The read failed: " + errorObject.code);
});//end of listener

//-------------------game key child listener
if (gameKey != undefined){
	database.ref().child(gameKey).on("child_added", function(snapshotC){
    	console.log(snapshotC.key)
    	players = snapshotC.val()
    	console.log(players)
		var gameKeyArr= Object.keys(snapshotC.val())

	}, function(errorObject) {
	 	console.log("The read failed: " + errorObject.code);
	});//end of child added
}

//------------------game value---------------
if (gameKey != undefined){
database.ref().child(gameKey).on("value", function(snapshotD){
    			console.log(snapshotD.val().players)
    			players = snapshotD.val().players

				}, function(errorObject) {
				  console.log("The read failed: " + errorObject.code);
	});//end of child value
}

//------------chat button----------------------------
$("#submit-chat").on("click", function(event){
	var chatVal = $("#userChat").val().trim()
	event.preventDefault();
	if(chatVal.length > 0){
		var chatVal = $("#userChat").val().trim()
		var chatLine = $("<p>"+userName+": "+chatVal+"</p>")
		$("#chat").prepend(chatLine);
		$("#userChat").val("")

		if (playerCount == 2){ 
			database.ref().child(gameKey).child(userKey).update({
				"chat": chatVal
			})
		}
	}
})


// ---------------------------------------------------------
//superfluos hover feature
$(".gameBtn").hover(function() {
	$(".gameArrow").css("opacity", ".2");
	$("#"+$(this).context.id+"Beats").css("opacity", "1");
}, function() {
	$(".gameArrow").css("opacity", "1");
});


$(".gameBtn").on("click", play)

// ----------------------main play function------------------
function play () {

	$(".gameBtn").off()


	userGuess = $(this).context.id
	userGuessID = parseInt($(this).attr("data-value"))
	$("#userReadyBox").css("background-color", "green")

	//this makes the icon of users guess in the current play div

	$("#userIcon").html($("<img class=icon id=oppImg src=assets/images/"+userGuess+"/"+userGuess+"Icon.png><h5>"+userGuess+"</h5>"))

	// $("#userIcon").append($("<img class=icon src=assets/images/"+userGuess+"/"+userGuess+"Icon.png>"))
	// $("#userIcon").append($("<h5>"+userGuess+"</h5>"))
	
	//-------single player game--------------
	if (playerCount==1){
		setTimeout(function(){

			var compPick = Math.floor(Math.random()*5)
			oppGuess = arrayPick[compPick]

			$("#oppIcon").append($("<img class=icon src=assets/images/"+oppGuess+"/"+oppGuess+"Icon.png>"))
			$("#oppIcon").append($("<h5>"+oppGuess+"</h5>"))
			$("#oppReadyBox").css("background-color", "green")
			checkGuess(userGuessID, compPick);
		}, 1000)

		setTimeout(setNext, 3000)
	};

	//-------mulitplayer game---------------
	if (playerCount == 2){
		database.ref().child(gameKey).child(userKey).update({
			"choice": userGuess,
			"choiceValue": userGuessID
		})
		ifReady();
	}//end of player 2
};//end of play function


//-----------------if both players are ready-------------
function ifReady(){
	if(userGuess != undefined && oppGuess != undefined)
		if (userGuess.length > 1 && oppGuess.length > 1 ){
			console.log("ready to play")
			setTimeout(function(){

				checkGuess(userGuessID, oppGuessID);
			}, 1000)

			setTimeout(setNext, 4000)
		} else {
			return;
		}

}
// --------------------------------------------------------
function checkGuess(you, opp){
	$("#oppIcon").css("visibility", "visible")
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

//--------------------------results and next---------------------------
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
	ready = 0;

	//add past plays
	var log = $("<div class=record>")
	log.append($("<img class=icon src=assets/images/"+userGuess+"/"+userGuess+"Icon.png>"))
	log.append(resultArray[result])
	log.append($("<img class=icon src=assets/images/"+oppGuess+"/"+oppGuess+"Icon.png>"))	
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

	if (playerCount == 2){
		database.ref().child(gameKey).child(userKey).update({
			"choice": " ",
			"choiceValue": " "
		})
		userGuess = ""
		oppGuess = ""
	}

	$("#oppIcon").css("visibility", "hidden")
	$("#oppReadyBox").css("background-color", "white")
	$("#userReadyBox").css("background-color", "white")
}

});//end of document ready