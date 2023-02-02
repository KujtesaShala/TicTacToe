import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { main } from '@popperjs/core';

interface TicTac {
  name: string;
  player1: string;
  player2: string;
  winner?: string | null;
  isDraw?: boolean;
}
const lines = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]; 

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  squares!: any[];
  xIsNext!: boolean;
  winner!: string;
  count: number = 0;
  gameStarted: boolean = false;
  results: TicTac[] = [];
  xScore: Array<any> = [];
  oScore: Array<any> = [];
  Draw!: boolean;
  gameNumber: number = 0;
  xTotalScore: number = 0;
  oTotalScore: number = 0;
  gameEnded : boolean = false;
  closeResult = '';
  gameWinner: string = '';

  

  @ViewChild('content', { static: true, read: TemplateRef }) content!: TemplateRef<any>;
  randomValue: any;
  
  constructor(private modalService: NgbModal) { }

  ngOnInit() {
    // this.newGame();
  }

  newGame() {
    this.gameStarted = true;
    this.gameEnded = false;
    this.squares = Array(9).fill(null);
    this.xIsNext = true;
    this.Draw = false;

    if(this.gameNumber <= 10){
      
      // this.xScore.forEach((xScore) =>{
      //   if(xScore === '1') {
      //     this.xTotalScore++;
      //     // console.log(this.xTotalScore);
      //   }
      // })

      if((this.xScore[this.xScore.length-1]) === '1')
      this.xTotalScore++;
       
      // this.oScore.forEach((oScore) =>{
      //   if(oScore === '1') {
      //     this.oTotalScore++;
      //   }
      // })
      
      if((this.oScore[this.oScore.length-1]) === '1')
      this.oTotalScore++;

    }else {
      this.gameNumber = 0;
      this.xScore = [];
      this.oScore = [];
      this.xTotalScore = 0;
      this.oTotalScore = 0;
    }
    this.count = 0;
    this.gameNumber++;
 
    if(this.gameNumber === 11) {
  
      if(this.xTotalScore != this.oTotalScore){

        if(this.xTotalScore > this.oTotalScore) 
          this.gameWinner = 'X';
          else
          this.gameWinner = 'O';
      } 
      else
      this.gameWinner = 'Draw';

      this.open();
    }
      
  }
    

  get player() {
    return this.xIsNext ? "X" : 'O';
  }

  makeMove(index: number) {

    this.count++;
    // if the square is already clicked - nothing will happen, if it's empty
    //  we'll splice in the index the user clicked on with the current player
    if (!this.squares[index]) {
      this.squares.splice(index, 1, this.player);
      this.xIsNext = !this.xIsNext;
    }
    if(this.xIsNext === false)
    {
      this.computersTurn();
    }
    
    this.winner = this.calculateWinner();

    let result: TicTac = {
      name: `Game: ${this.gameNumber}`,
      player1: 'X',
      player2: 'O',
    } 
   
    if (this.count === 5 && !this.winner )
    {
      result.winner = null;
      result.isDraw = true;
      this.Draw = result.isDraw;
      this.gameEnded = true;
     
      // console.log(result.isDraw);
    }
    if (this.winner)
    {
      result.isDraw = false;
      this.Draw = false;
      result.winner = this.winner;
      this.gameEnded = true;
      console.log(this.winner);
     
    }
    this.results.push(result)

    if (this.gameEnded){
  
      if(this.winner === "X") {
      
        this.xScore.push('1');
        this.oScore.push('0');
        setTimeout(() => {
         this.newGame();
      }, 1000);
      } 
      if(this.winner === "O") {

        this.xScore.push('0');
        this.oScore.push('1');
        setTimeout(() => {
          this.newGame();
      }, 1000);
      }
    
      if(result.isDraw === true){
     
        this.xScore.push('-');
        this.oScore.push('-');
        setTimeout(() => {
          this.newGame();
      }, 1000);
      }
    }
    // console.log(result);
  }

  computersTurn(){

    for(let i = 0; i< lines.length; i++) {
      
      const [a, b, c] = lines[i];

      if(this.squares[a] && this.squares[a] === this.squares[b]) {
        if(this.squares[c] === null){
          // setTimeout(() => {
            this.squares.splice(c, 1, this.player);
            this.xIsNext = !this.xIsNext;
        // }, 1000);
          return;
         }
      }
      if(this.squares[a] && this.squares[a] === this.squares[c]) {
        if(this.squares[b] === null){
          // setTimeout(() => {
            this.squares.splice(b, 1, this.player);
            this.xIsNext = !this.xIsNext;
        // }, 1000);
          return;
         }
      }
      if(this.squares[b] && this.squares[b] === this.squares[c]) {
        if(this.squares[a] === null){
          // setTimeout(() => {
            this.squares.splice(a, 1, this.player);
            this.xIsNext = !this.xIsNext;
        // }, 1000);
          return;
         }
      }
        
    }  
      for(let i=0; i<this.squares.length; i++) {

        let randomValue = Math.floor(Math.random() * this.squares.length);
        if(this.squares[randomValue] === null){
          // setTimeout(() => {
            this.squares.splice(randomValue, 1, this.player);
            this.xIsNext = !this.xIsNext;
        // }, 1000);
          return;
        }
      } 
  }
 

  
  calculateWinner() {

    for(let i = 0; i< lines.length; i++) {
      const [a, b, c] = lines[i];
      if(
        this.squares[a] &&
        this.squares[a] === this.squares[b] &&
        this.squares[a] === this.squares[c] 
      ) 
        return this.squares[a];
    }
    return null;
  }

  open() {
    // console.log(this.content)
		this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			}
		);
	}
  
  
}
