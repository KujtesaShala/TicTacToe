import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

interface TicTac {
  name: string;
  player1: string;
  player2: string;
  winner?: string | null;
  isDraw?: boolean;
}

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
      
      this.xScore.forEach((xScore) =>{
        if(xScore === '1') {
          this.xTotalScore++;
          // console.log(this.xTotalScore);
        }
      })
       
      this.oScore.forEach((oScore) =>{
        if(oScore === '1') {
          this.oTotalScore++;
        }
      })
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
    this.winner = this.calculateWinner();

    let result: TicTac = {
      name: `Game: ${this.gameNumber}`,
      player1: 'X',
      player2: 'O',
    } 
    console.log(this.winner);
    if (this.count == 9 && !this.winner )
    {
      result.winner = null;
      result.isDraw = true;
      this.Draw = result.isDraw;
      this.gameEnded = true;
      // this.open();
    }
    if (this.winner)
    {
      result.isDraw = false;
      this.Draw = false;
      result.winner = this.winner;
      this.gameEnded = true;
      // this.open();
    }
    this.results.push(result)

    if (this.gameEnded){

      if(this.winner === "X") {
        
        this.xScore.push('1');
        this.oScore.push('0');
      } 
      if(this.winner === "O") {

        this.xScore.push('0');
        this.oScore.push('1');
      }
    
      if(result.isDraw === true){
        
        this.xScore.push('-');
        this.oScore.push('-');
      }
    }
    // console.log(result);
  }

  
  calculateWinner() {
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
    console.log(this.content)
		this.modalService.open(this.content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
			(result) => {
				this.closeResult = `Closed with: ${result}`;
			}
		);
	}
  
  
}
