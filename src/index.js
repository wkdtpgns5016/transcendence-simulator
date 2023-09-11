import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

// class SquareButton extends React.Component {
//   constructor(props) {
//     super(props);
//   }

//   handleClick = () => {
//     // 클릭 이벤트 핸들러 내에서 함수를 호출하고 매개변수를 전달합니다.
//     this.props.overEvent(this.props.square.line, this.props.square.row);
//   }

//   render() {
//     return (
//       <button
//         className="square"
//         onMouseOver={this.handleClick}
//       >
//         {this.props.square.value}
//       </button>
//     );
//   }
// }

// class Square {
//   constructor(line, row) {
//     this.row = row;
//     this.line = line;
//     this.active = true;
//     this.value = 0;
//     this.specital = false;
//   }
// }

// class Board extends React.Component {
//   constructor(props) {
//     super(props);
//     this.board = new Array(5);
//     for (let i=0; i<5; i++) {
//       this.board[i] = new Array(5);
//       for (let j=0; j<5; j++) {
//         this.board[i][j] = new Square(i, j);
//       }
//     }
//     this.state = {
//       aa: this.board,
//     }
//   }

//   test = (i, j) => {
//     // 이벤트 핸들링 로직을 작성하고 매개변수 param을 사용합니다.
//     console.log(i + '   ' + j);
//     this.setState({aa[i][j].values: 100})

//   }

//   renderRowSquare(i) {
//     const result = [];
//     for (let j=0; j<5; j++) {
//       result.push(<SquareButton square={this.board[i][j]} overEvent={this.test}/>);
//     }
//     return result;
//   }

//   render() {
//     const status = 'Next player: X';

//     return (
//       <div>
//         <div className="status">{status}</div>
//         <div className="board-row">
//           {this.renderRowSquare(0)}
//         </div>
//         <div className="board-row">
//           {this.renderRowSquare(1)}
//         </div>
//         <div className="board-row">
//           {this.renderRowSquare(2)}
//         </div>
//         <div className="board-row">
//           {this.renderRowSquare(3)}
//         </div>
//         <div className="board-row">
//           {this.renderRowSquare(4)}
//         </div>
//       </div>
//     );
//   }
// }

// class Game extends React.Component {
//   render() {
//     return (
//       <div className="game">
//         <div className="game-board">
//           <Board />
//         </div>
//         <div className="game-info">
//           <div>{/* status */}</div>
//           <ol>{/* TODO */}</ol>
//         </div>
//       </div>
//     );
//   }
// }
root.render(
  <App/>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
