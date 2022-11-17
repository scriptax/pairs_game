//Lists handler
class List {
    constructor(list, btn, selectedOption, listIsClosed){
        this.list = list;
        this.btn = btn;
        this.selectedOption = selectedOption;
        this.listIsClosed = listIsClosed;
    }
    listToggle(){
        if(this.listIsClosed){
            this.list.style.height = '110px';
            this.listIsClosed = false;
        } 
        else{
            this.list.style.height = '0px';
            this.listIsClosed = true;
        } 
    }
    chooseOption(item){
        this.btn.innerHTML = item.innerHTML;
        this.selectedOption = item.innerHTML;
        this.listToggle();
    }
}

const cardList = new List(
    document.getElementById('cards_items'),
    document.getElementById('cards_btn'),
    "",
    true
);

const diffList = new List(
    document.getElementById('diff_items'),
    document.getElementById('diff_btn'),
    "",
    true
);

//Initialize game with selected options
const initGame = {
    cards : 0,
    difficulty : 0,
    initTime : 0,
    initLives : 0,
	ready : false,
    icons : [
        "piano", "roller_skating", "smartphone", "house", "blender",
        "traffic", "fort", "face_4", "rocket", "forest", 
        "sentiment_very_satisfied", "sailing", "dining", "redeem", "diamond"
    ],
    initCards : function(option){
        let cardsDeck = document.getElementsByClassName("cardContainer");
        cardList.chooseOption(option);

        if(cardList.selectedOption === "10 cards") this.cards = 10; 
        if(cardList.selectedOption === "20 cards") this.cards = 20; 
        if(cardList.selectedOption === "30 cards") this.cards = 30; 

        //Arranging cards
        let parent = document.getElementById('cards_grid');
        for(let i = 0; i < cardsDeck.length; i + 1){
            parent.removeChild(cardsDeck[i]);
        }
        for(let i = 0; i < this.cards; i++){
            let newChild = document.createElement('div');
            let newSpan = document.createElement('span');
            newChild.setAttribute("class", "cardContainer");
            newSpan.setAttribute("class", "material-symbols-outlined");
            newChild.onclick = function(){gameRun(this)};
            newChild.appendChild(newSpan);
            parent.appendChild(newChild);
        }
        
        cardsDeck = document.getElementsByClassName("cardContainer");
        if(this.cards == 10 || this.cards == 20){
            for(let i = 0; i < cardsDeck.length; i++){
                cardsDeck[i].style.margin = "5px 2%";
            }
        }
        else{
            for(let i = 0; i < cardsDeck.length; i++){
                cardsDeck[i].style.margin = "5px 5px";
            }
        }
        this.initStatus();

        //Attach icons to the cards randomly
        const arr = [];
        for(let i = 0; i < this.cards / 2; i++){
            arr.push(i);
            arr.push(i);
        }
        const randArr = arr.sort(() => {
            let num = Math.random();
            if(num >= 0.5) return -1;
            return 1;
        });
        for(let i = 0; i < cardsDeck.length; i++){
            let index = randArr[i];
            cardsDeck[i].firstChild.innerHTML = this.icons[index];
        }

        //Show cards
        document.getElementById('cards_grid').style.visibility = "visible";
        for(let i = 0; i < cardsDeck.length; i++){
            cardsDeck[i].style.transform = "rotateY(0deg)";
            cardsDeck[i].firstChild.style.display = "block";
            setTimeout(() => {
                cardsDeck[i].style.transform = "rotateY(180deg)";
                cardsDeck[i].firstChild.style.display = "none";
            }, 1000);
        }
    },

    initDiff : function(option){
        diffList.chooseOption(option);
        if(diffList.selectedOption === "Easy") this.difficulty = 1;
        if(diffList.selectedOption === "Medium") this.difficulty = 2;
        if(diffList.selectedOption === "Hard") this.difficulty = 3;
        this.initStatus();
    },

    initStatus : function(){
        if(this.cards == 0 || this.difficulty == 0) return undefined;
        this.initTime = Math.floor(5 * this.cards / this.difficulty);
        this.initLives = Math.floor(this.cards / (0.5 * this.difficulty)); 
        document.getElementById('time').innerHTML = this.initTime;
        document.getElementById('lives').innerHTML = this.initLives;
        document.getElementById('ready').style.display = "block";
        rstButton.style.visibility = "visible";
		this.ready = true;
    }
}

//Gameplay handler
const gameRun = (function(clickedCard){
    let gameStarted = false;
    let cardClickCount = 1;
    let time = 0;
    let lives = 0;
    let firstCard;
    let firstCardIndex;
    let cards;
    const solvedCards = [];
    var timer;
    
    return function(clickedCard){
        //Initialize gameplay
		if(!initGame.ready) return null;
        if(!gameStarted){
            cards = [...document.getElementById('cards_grid').children];
            time = initGame.initTime;
            lives = initGame.initLives;
            gameStarted = true;
            document.getElementById('cards_btn').removeEventListener('click', handleCardList);
            document.getElementById('diff_btn').removeEventListener('click', handleDiffList);
            document.getElementById('cards_btn').style.backgroundColor = "rgb(196, 147, 11)";
            document.getElementById('diff_btn').style.backgroundColor = "rgb(196, 147, 11)";
            document.getElementById('ready').style.display = "none";
            timer = setInterval(() => {
                document.getElementById('time').innerHTML = --time;
                if(time == 0){
                    lose();
                    clearInterval(timer);
                }
            }, 1000);
        }
        
        //Safety cases
        let clickedCardIndex = cards.indexOf(clickedCard);
        if(firstCardIndex === clickedCardIndex) return null;
        if(solvedCards.includes(clickedCard.firstChild.innerHTML)) return null;
        if(time == 0 || lives == 0) return null;

        if(cardClickCount == 2){
            clickedCard.style.transform = "rotateY(0deg)";
            clickedCard.firstChild.style.display = "block";
            if(clickedCard.firstChild.innerHTML === firstCard.firstChild.innerHTML){
                clickedCard.style.backgroundColor = "rgb(94, 129, 96)";
                firstCard.style.backgroundColor = "rgb(94, 129, 96)";
                solvedCards.push(clickedCard.firstChild.innerHTML);
            }
            else{
                setTimeout(() => {
                    clickedCard.style.transform = "rotateY(180deg)";
                    firstCard.style.transform = "rotateY(180deg)";
                    clickedCard.firstChild.style.display = "none";
                    firstCard.firstChild.style.display = "none";
                    document.getElementById('lives').innerHTML = --lives;
                    firstCardIndex = 999;
                    if(lives == 0){
                        lose();
                        clearInterval(timer);
                    }
                }, 400);
            }
        }
        if(cardClickCount == 1){
            clickedCard.style.transform = "rotateY(0deg)";
            clickedCard.firstChild.style.display = "block";
            firstCard = clickedCard;
            firstCardIndex = cards.indexOf(firstCard);
        }
        
        if((initGame.cards / 2) == solvedCards.length){
            setTimeout(win, 200);
            clearInterval(timer);
        }
        cardClickCount = cardClickCount == 1 ? 2 : 1;
    }
})();

var messageElem = document.getElementById('message');
var resultElem = document.getElementById('game_result');
var rstButton = document.getElementById('rst_game');
function win(){
    messageElem.setAttribute("class","win");
    messageElem.innerHTML = "You Won!";
    resultElem.style.display = 'block';
    document.getElementById('top_rect').style.animationPlayState = 'running';
    document.getElementById('bottom_rect').style.animationPlayState = 'running';
    setTimeout(() => {
        resultElem.style.display = 'none';
    }, 2500);
}

function lose(){
    messageElem.setAttribute("class","lose");
    messageElem.innerHTML = "Game Over!";
    resultElem.style.display = 'block';
    setTimeout(() => {
        resultElem.style.display = 'none';
    }, 3500);
}

var cardsElem = document.getElementsByClassName('cards');
var diffElem = document.getElementsByClassName('diff');
function handleCardList(){cardList.listToggle()}
function handleDiffList(){diffList.listToggle()}
document.getElementById('cards_btn').addEventListener('click', handleCardList);
cardsElem[0].onclick = function(){initGame.initCards(this)};
cardsElem[1].onclick = function(){initGame.initCards(this)};
cardsElem[2].onclick = function(){initGame.initCards(this)};

document.getElementById('diff_btn').addEventListener('click', handleDiffList);
diffElem[0].onclick = function(){initGame.initDiff(this)};
diffElem[1].onclick = function(){initGame.initDiff(this)};
diffElem[2].onclick = function(){initGame.initDiff(this)};

rstButton.onclick = () => {window.top.location = window.top.location};