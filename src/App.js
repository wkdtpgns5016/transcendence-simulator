import React, { Component } from 'react';
import './App.css';

// 정령 효과 데이터 초기화
const options = [
  { value: "earthquake", label: "지진"},
  { value: "stom", label: "폭풍우"},
  { value: "thunderbolt", label: "낙뢰"},
  { value: "tsunami", label: "해일"},
  { value: "spout", label: "용오름"},
  { value: "bigbang", label: "대폭발"},
  { value: "hellfire", label: "업화"},
  { value: "shockwave", label: "충격파"},
  { value: "lightning", label: "벼락"},
  { value: "purification", label: "정화"},
  { value: "eruption", label: "분출"},
  { value: "resonance", label: "세계수의 공명"},
];

// 특수 장판 데이터 초기화
const specital = [ 
  { type: 4, name: "강화"},
  { type: 4, name: "강화"},
  { type: 4, name: "강화"},
  { type: 4, name: "강화"},
  { type: 4, name: "강화"},
  { type: 4, name: "강화"},
];

// const specital = [ 
//   { type: 0, name: "재배치"},
//   { type: 1, name: "축복"},
//   { type: 2, name: "추가"},
//   { type: 3, name: "신비"},
//   { type: 4, name: "강화"},
//   { type: 5, name: "복제"},
// ];

// 초월 단계 별 장판 데이터 초기화
const level_data = new Map();
level_data.set("2",[{ etype: "1", location: [7, 14, 21, 28] }, 
                    { etype: "2", location: [10, 15, 20, 25] }, 
                    { etype: "3", location: [14, 15, 20, 21] }, 
                    { etype: "4", location: [7, 8, 27, 28] }, 
                    { etype: "5", location: [9, 16, 19, 26] }]);
level_data.set("3",[{ etype: "1", location: [7, 10, 25, 28] }, 
                    { etype: "2", location: [7, 10, 25, 28] }, 
                    { etype: "3", location: [8, 16, 19, 27] }, 
                    { etype: "4", location: [7, 15, 20, 28] }, 
                    { etype: "5", location: [7, 9, 26, 28] }]);

// 장비 부위 별 장판 데이터 초기화
const e_data = [[0, 5, 30, 35], [0, 1, 4, 5, 6, 11, 24, 29, 30 ,31, 34, 35]];

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

class Square {
  constructor() {
    this.probability = 0;
    this.specital = null;
    this.activation = true;
    this.color = null;
    this.hide = true;
    this.visibility = "";
    this.distortion = false;
    this.text = ".";
  }

  excludeSquare() {
    this.visibility = "hidden";
    this.activation = false;
  }

  setDistortion() {
    this.distortion = true;
    this.color = "purple";
  }

  setSpirit(probability) {
    this.color = "yellow";
    this.probability = probability;
    this.hide = false;
    this.text = probability.toString();
  }
}

class Spirit {
  constructor(name, value) {
    this.name = name;
    this.value = value;
    this.level = 1;
  }

  getString() {
    let str = this.name;
    if (this.value === "eruption" || this.value === "resonance") {
      return (str);
    }
    str += "[";
    for (let i = 0; i < this.level; i++) {
      str += "★";
    }
    str += "]"
    return (str);
  }
}

class inventory {
  constructor() {
    this.poket = [this.createSpirit(), this.createSpirit(), this.createSpirit()];
    this.hand = [this.createSpirit(), this.createSpirit()];
    this.levelUpSpirit();
    this.selected = null;
    this.change = 2;
    this.specital = false;
    this.useIndex = null;
    this.saveUse = null;
  }

  initInventory() {
    delete this.poket;
    delete this.hand;

    this.poket = [this.createSpirit(), this.createSpirit(), this.createSpirit()];
    this.hand = [this.createSpirit(), this.createSpirit()];
    this.levelUpSpirit();
    this.selected = null;
    this.change = 2;
    this.specital = false;
    this.useIndex = null;
    this.saveUse = null;
  }

  changeHand(index) {
    if (this.change > 0) {
      this.hand[index] = this.poket.shift();
      this.poket.push(this.createSpirit());
      this.levelUpSpirit();
      this.selected = null;
      this.change--;
    }
  }

  appendHand(index) {
    this.hand[index] = this.poket.shift();
    this.poket.push(this.createSpirit());
    this.levelUpSpirit();
    this.selected = null;
  }

  useSpirit(index) {
    let spirit = this.hand[index];
    this.hand[index] = null;
    this.useIndex = index;
    this.selected = null;
    return (spirit);
  }

  createSpirit() {
    let randomNum = Math.floor(Math.random() * 10);
    let obj = options[randomNum];
    let spirit = new Spirit(obj.label, obj.value);
    return spirit;
  }

  levelUpSpirit() {
    if (this.hand[0].value === this.hand[1].value) {
      if (this.hand[0].value !== "eruption" && this.hand[0].value !== "resonance") {
        if (this.hand[0].level < 3 && this.hand[1].level < 3) {
          if (this.hand[0].level > this.hand[1].level)
            this.hand[0].level++;
          else
            this.hand[0].level = this.hand[1].level + 1;
          this.appendHand(1);
          this.levelUpSpirit();
        }
      }
    }
  }

  mystery() {
    let leftIdx = (this.useIndex === 0 ? 1 : 0);
    let randomNum = Math.floor(Math.random() * 2);
    if (randomNum === 0) {
      this.hand[leftIdx] = new Spirit("분출", "eruption");
    }
    else {
      this.hand[leftIdx] = new Spirit("세계수의 공명", "resonance");
    }
  }

  enhance() {
    let leftIdx = (this.useIndex === 0 ? 1 : 0);
    if (this.hand[leftIdx].value !== "eruption" && this.hand[leftIdx].value !== "resonance") {
      if (this.hand[leftIdx].level < 3) {
        this.hand[leftIdx].level++;
      }
    }
  }

  reproduction(selectSpirit) {
    let leftIdx = (this.useIndex === 0 ? 1 : 0);
    this.hand[leftIdx] = selectSpirit;
    this.levelUpSpirit();
  }

  getHandString() {
    return ("{ " + this.hand[0].getString() + ", " + 
                   this.hand[1].getString() + " }");
  }
  
  getPocketString() {
    return ("{ " + this.poket[0].getString() + ", " +
                   this.poket[1].getString() + ", " +
                   this.poket[2].getString() + " }");
  }

}

class board {
  constructor(level) {
    let squares = [];
    for (let i=0; i<level**2; i++) {
      squares[i] = new Square();
    }
    this.level = level;
    this.slate = squares;
    this.destroyed = [];
    this.left = level**2;
    this.count = 0;
    this.lightningPenalty = false;
  }

  initBoard(level) {

    let squares = [];
    for (let i=0; i<level**2; i++) {
      squares[i] = new Square();
    }
    this.level = level;
    this.slate = squares;
    this.destroyed = [];
    this.left = level**2;
    this.count = 0;
    this.lightningPenalty = false;
  }

  countLeftSlate() {
    let count = 0;
    for (let i = 0; i < this.level**2; i++) {
      if (this.slate[i].visibility !== "hidden" && this.slate[i].distortion === false)
        count++;
    }
    this.left = count;
  }

  // 머리 장갑 : 모서리 1개
  // 상의 : 마름모
  // 견갑 하의 : 풀
  setBoard(selectEquipment) {
    let flag = 0;

    if (selectEquipment === "3")
      flag = 1;
    else if (selectEquipment === "2" || selectEquipment === "4")
      return;
    for (let i = 0; i < e_data[flag].length; i++) {
      this.slate[e_data[flag][i]].excludeSquare();
    }
  }

  setSpecital() {
    let randomNum = Math.floor(Math.random() * 6);
    let randomIndex = [];
    for (let i = 0; i < this.slate.length; i++) {
      this.slate[i].specital = null;
      this.slate[i].color = null;
      if (this.slate[i].distortion || this.slate[i].visibility === "hidden")
        continue;
      randomIndex.push(i);
    }
    if (randomIndex.length === 0)
      return;
    let idx = Math.floor(Math.random() * randomIndex.length);
    this.slate[randomIndex[idx]].specital = specital[randomNum];
    this.slate[randomIndex[idx]].color = "green";
    this.slate[randomIndex[idx]].text = specital[randomNum].name;
  }

  setDistortion(selectEquipment, selectLevel) {
    const data = level_data.get(selectLevel);
    if (data === undefined)
      return ;
    const info = data.find((element) => element.etype === selectEquipment);
    if (info === undefined)
      return;
    for (let i = 0; i < info.location.length; i++) {
      this.slate[info.location[i]].setDistortion();
    }
  }

  recoverSlate() {
    let idx = this.destroyed.splice(Math.floor(Math.random() * this.destroyed.length),1)[0];
    this.slate[idx].visibility = "";
    this.left++;
  }

  processLightningPenalty() {
    this.recoverSlate();
  }

  processDestroyPenalty() {
    if (this.destroyed.length < 3) {
      while (this.destroyed.length !== 0) {
        this.recoverSlate();
      }
    }
    else {
      for (let i = 0; i < 3; i++) {
        this.recoverSlate();
      }
    }
  }

  shuffleBoard() {
    let shuffleBoard = [];
    for (let i = 0; i < this.slate.length - 1; i++) {
      if (this.slate[i].activation)
        shuffleBoard.push(this.slate[i]);
    }
    shuffle(shuffleBoard);
    let j = 0;
    for (let i = 0; i < this.slate.length - 1; i++) {
      if (this.slate[i].activation) {
        this.slate[i] = shuffleBoard[j];
        j++;
      }
    }
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    let inven = new inventory();
    this.state = {
      board: new board(6),
      inventory: inven,
      selectSpirit: null,
      selectLevel: "1",
      selectEquipment: "1",
    };
    this.state.board.setBoard(this.state.selectEquipment);
    this.state.board.countLeftSlate();
  }

  getStringProgress() {
    const board = this.state.board;
    let rate = this.checkRating();
    let str = "";
    let n;

    if (this.state.selectEquipment === "3")
      n = 5 - board.count;
    else 
      n = 7 - board.count;

    switch (rate) {
      case 0:
        str = "초월 성공 시 ☆☆☆ 달성"
        break;
      case 1:
        n += 3;
        str = n + "회 이내에 초월 성공 시 ★☆☆ 달성"
        break;
      case 2:
        n = 1;
        str = n + "회 이내에 초월 성공 시 ★★☆ 달성"
        break;
      case 3:
        str = n + "회 이내에 초월 성공 시 ★★★ 달성"
        break;
      default:
        break;
    }
    return (str);
  }

  checkRating() {
    const board = this.state.board;

    if (this.state.selectEquipment === "3") {
      if (board.count < 5)
        return 3;
      else if (board.count < 6)
        return 2;
      else if (board.count < 8)
        return 1;
      else
        return 0;
    }
    else {
      if (board.count < 7)
        return 3;
      else if (board.count < 8)
        return 2;
      else if (board.count < 10)
        return 1;
      else
        return 0;
    }
  }

  getStringfinish() {
    return ("초월 완료\n초월 등급 :  " + this.finishRating());
  }

  finishRating() {
    const board = this.state.board;

    if (this.state.selectEquipment === "3") {
      if (board.count <= 5)
        return "★★★";
      else if (board.count <= 6)
        return "★★☆";
      else if (board.count <= 8)
        return "★☆☆";
      else
        return "☆☆☆";
    }
    else {
      if (board.count <= 7)
        return "★★★";
      else if (board.count <= 8)
        return "★★☆";
      else if (board.count <= 10)
        return "★☆☆";
      else
        return "☆☆☆";
    }
  }

  // 지진 : 가로 1자
  earthquake(index, probability) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const size = Math.sqrt(board.slate.length);
    const line = Math.floor(index / size);
    
    if (selectSpirit.level > 1)
      probability = 0;
    for (let i = 0; i < size; i++) {
      let diff = Math.abs(index - (line * size + i));
      board.slate[line * size + i].setSpirit(100 - (probability * diff));
    }
    this.setState({ board });
  }

  // 폭풍우 : 세로 1자
  stom(index, probability) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const size = Math.sqrt(board.slate.length);
    const line = Math.floor(index / size);
    const row = Math.floor(index % size);

    if (selectSpirit.level > 1)
      probability = 0;
    for (let i = 0; i < size; i++) {
      let diff = Math.abs(line - i);
      board.slate[i * size + row].setSpirit(100 - (probability * diff));
    }
    this.setState({ board });
  }

  // 분출 : 선택 1칸
  eruption(index) {
    const board = this.state.board;
    board.slate[index].setSpirit(100);
    this.setState({ board });
  }
  
  // 낙뢰 : 십자 1칸
  // index 
  thunderbolt(index, probability) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const size = Math.sqrt(board.slate.length);
    const line = Math.floor(index / size);
    const row = Math.floor(index % size);

    if (selectSpirit.level > 1)
      probability = 100;
    for (let i = 0; i < 5; i++) {
      let idx = (i % 2 === 0 ? 
        (line - ((i / 2) - 1)) * size + row : line * size + row + (i - 2));
    
      if (idx >= 0 && idx < board.slate.length)
      {
        if (!(index % size === 0 && idx % size === size - 1) &&
          !(index % size === size - 1 && idx % size === 0))
        {
          board.slate[idx].setSpirit((idx === index ? 100 : probability));
        }
      }
    }
    this.setState({ board });
  }

  // 해일 : 십자 쭉
  tsunami(index, probability) {
    this.earthquake(index, probability);
    this.stom(index, probability);
  }

  // 용오름 : x 한칸
  spout(index, probability) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const size = Math.sqrt(board.slate.length);
    const line = Math.floor(index / size);
    const row = Math.floor(index % size);

    if (selectSpirit.level > 1)
      probability = 100;
    for (let i = 0; i < size; i++) {
      let idx = 0;
      if (i < 2)
        idx = (line - 1) * size + row + (i % 2 === 0 ? -1 : 1);
      else if (i === 2)
        idx = index;
      else 
        idx = (line + 1) * size + row + (i % 2 === 0 ? 1 : -1);
      if (idx >= 0 && idx < board.slate.length)
      {
        if (!(index % size === 0 && idx % size === size - 1) &&
          !(index % size === size - 1 && idx % size === 0))
        {
          board.slate[idx].setSpirit((idx === index ? 100 : probability));
        }
      }
    }
    this.setState({ board });
  }

  // 대폭발 : x 쭉
  half_bigbang(index, mark, probability) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const size = Math.sqrt(board.slate.length);
    const line = Math.floor(index / size);
    const row = Math.floor(index % size);

    if (selectSpirit.level > 1)
      probability = 0;
    for (let i = 0; i < size; i++) {
      let diff = i - line;
      let row_idx = row + (diff * mark);
      if (row_idx < 0 || row_idx > size - 1)
        continue;
      let idx = i * size + row_idx;
      if (idx >= 0 && idx < board.slate.length)
      {
        board.slate[idx].setSpirit(100 - (probability * Math.abs(diff)));
      }
    }
    this.setState({ board });
  }

  bigbang(index, probability) {
    this.half_bigbang(index, -1, probability);
    this.half_bigbang(index, 1, probability);
  }

  // 업화 : 마름모
  hellfire(index, probability) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const size = Math.sqrt(board.slate.length);
    const line = Math.floor(index / size);
    const row = Math.floor(index % size);

    if (selectSpirit.level > 1)
      probability = 100;
    this.shockwave(index, probability);
    for (let i = 0; i < 4; i++) {
      let line_idx = (i % 2 === 0 ? line + (i - 2) : line + (i - 1));
      let row_idx = (i % 3 === 0 ? row: row - (2 * ((-1) ** i)));
      if ((row_idx < 0 || row_idx > size - 1) || (line_idx < 0 || line_idx > size - 1))
        continue;
      let idx = line_idx * size + row_idx;
      board.slate[idx].setSpirit((idx === index ? 100 : probability));
    }
    this.setState({ board });
  }

  // 충격파 : 사각
  shockwave(index, probability) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const size = Math.sqrt(board.slate.length);
    const line = Math.floor(index / size);
    const row = Math.floor(index % size);

    if (selectSpirit.level > 1)
      probability = 100;
    for (let i = 0; i < 9; i++) {
      let line_idx = line + ((Math.floor(i / 3) - 1));
      let row_idx = row + (i % 3 - 1);
      if ((row_idx < 0 || row_idx > size - 1) || (line_idx < 0 || line_idx > size - 1))
        continue;
      let idx = line_idx * size + row_idx;
      board.slate[idx].setSpirit((idx === index ? 100 : probability));
    }
    this.setState({ board });
  }

  // 초기 벼락 알고리즘
  // strikeLightning(level, index) {
  //   const board = this.state.board;
  //   const boardIndex = [];
  //   const randomIndex = [];
  //   const result = { penalty: false, struck: null };
  //   let count = Math.floor(Math.random() * (level * 2 + 1));
  //   let penalty = 1;

  //   for (let i = 0; i < board.slate.length; i++) {
  //     if (board.slate[i].activation === false || board.slate[i].distortion || i === index)
  //       continue;
  //     boardIndex.push(i);
  //   }
  //   while (count > 0) {
  //     if (boardIndex.length === 0)
  //       break;
  //     let idx = boardIndex.splice(Math.floor(Math.random() * boardIndex.length),1)[0];
  //     if (board.destroyed.find((i) => i === idx) !== undefined) {
  //       if (penalty > 0) {
  //         result.penalty = true;
  //         count--;
  //         penalty--;
  //       }
  //     }
  //     else {
  //         randomIndex.push(idx);
  //         count--;
  //     }
  //   }
  //   result.struck = randomIndex;
  //   return (result);
  // }
  strikeLightning(level, index) { 
    const board = this.state.board;
    const boardIndex = [];
    const randomIndex = [];
    const result = { penalty: false, struck: null };
    let count = Math.floor(Math.random() * (level * 2 + 2)) - 1;

    for (let i = 0; i < board.slate.length; i++) {
      if (index === i)
        continue;
      if (board.slate[i].visibility !== "hidden" && !board.slate[i].distortion)
        boardIndex.push(i);
    }
    if (count < 0)
      result.penalty = true;
    while (count > 0) {
      if (boardIndex.length === 0)
        break;
      let idx = boardIndex.splice(Math.floor(Math.random() * boardIndex.length),1)[0];
      randomIndex.push(idx);
      count--;
    }
    result.struck = randomIndex;
    return (result);
  }
  // 벼락 : 레벨당 임의 2개 추가
  lightning(index) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const result = this.strikeLightning(selectSpirit.level, index);
    const struck = result.struck;

    board.lightningPenalty = result.penalty;
    for (let i = 0; i < struck.length; i++) {
        board.slate[struck[i]].probability = 100;
    }

    for (let i = 0; i < board.slate.length; i++) {
      if (board.slate[i].visibility !== "hidden") {
        if (i === index) {
          board.slate[i].probability = 100;
          board.slate[i].text = board.slate[i].probability.toString();
        }
        else {
          board.slate[i].text = "?";
        }
        board.slate[i].color = "yellow";
        board.slate[i].hide = false;
      }
    }
    this.setState({ board });
  }

  // 정화
  purification(index, probability) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const size = Math.sqrt(board.slate.length);
    const row = Math.floor(index % size);
    const line = Math.floor(index / size);

    if (selectSpirit.level > 1)
      probability = 100;
    for (let i = 0; i < 3; i++) {
      let row_idx = row + (i - 1);
      if ((row_idx < 0 || row_idx > size - 1))
        continue;
      let idx = line * size + row_idx;
      board.slate[idx].setSpirit((idx === index ? 100 : probability));
    }
    if (selectSpirit.level === 3) {
      for (let i = 0; i < 2; i++) {
        let idx = index - 6 + (i * 12);
        if (idx < 0 || idx > 35)
          continue;
        board.slate[idx].setSpirit(probability);
      }
    }
    this.setState({ board });
  }

  // 세계수의 공명
  resonance(index) {
    const board = this.state.board;
    const size = Math.sqrt(board.slate.length);
    const row = Math.floor(index % size);
    const line = Math.floor(index / size);

    for (let i = 0; i < 5; i++) {
      let row_idx = row + (i - 2);
      if ((row_idx < 0 || row_idx > size - 1)) {
        continue;
      }
      let idx = line * size + row_idx;
      board.slate[idx].setSpirit(100);
    }

    for (let i = 0; i < 5; i++) {
      let line_idx = line + (i - 2);
      if ((line_idx < 0 || line_idx > size - 1)) {
        continue;
      }
      let idx = line_idx * size + row;
      board.slate[idx].setSpirit(100);
    }
    
    this.setState({ board });
  }

  // specital
  useSpecital(specital, selectSpirit) {
    const board = this.state.board;
    const inventory = this.state.inventory;
    
    switch (specital.type) {
      case 0:
        this.reposition();
        break;
      case 1:
        this.bless();
        break;
      case 2:
        this.addition();
        break;
      case 3:
        this.mystery();
        break;
      case 4:
        this.enhance();
        break;
      case 5:
        this.reproduction(selectSpirit);
        break;
      default:
        break;
  }
    this.setState({ board, inventory });
  }

  reposition() {
    const board = this.state.board;
    board.shuffleBoard();
    this.setState({ board });
  }

  bless() {
    const board = this.state.board;
    board.count--;
    this.setState({ board });
  }

  addition() {
    const inventory = this.state.inventory;
    inventory.change++;
    this.setState({ inventory });
  }

  mystery() {
    const inventory = this.state.inventory;
    inventory.mystery();
    this.setState({ inventory });
  }
  
  enhance() {
    const inventory = this.state.inventory;
    inventory.enhance();
    this.setState({ inventory });

  }

  reproduction(selectSpirit) {
    const inventory = this.state.inventory;
    inventory.reproduction(selectSpirit);
    this.setState({ inventory });
  }
  

  handleMouseOver(index) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const spirit = this.state.selectSpirit;

    if (!spirit)
      return;
    if (board.slate[index].visibility === "hidden")
      return ;
    this.handleMouseOut();

    if (selectSpirit.value !== "eruption" && selectSpirit.value !== "resonance" && selectSpirit.value !== "purification") {
      if (board.slate[index].distortion)
        return ;
    }
    switch (spirit.value) {
      case options[0].value:
        this.earthquake(index, 15);
        break;
      case options[1].value:
        this.stom(index, 15);
        break;
      case options[2].value:
        this.thunderbolt(index, 50);
        break;
      case options[3].value:
        this.tsunami(index, 15);
        break;
      case options[4].value:
        this.spout(index, 50);
        break;
      case options[5].value:
        this.bigbang(index, 15);
        break;
      case options[6].value:
        this.hellfire(index, 50);
        break;
      case options[7].value:
        this.shockwave(index, 75);
        break;
      case options[8].value:
        this.lightning(index);
        break;
      case options[9].value:
        this.purification(index, 50);
        break;
      case options[10].value:
        this.eruption(index);
        break;
      case options[11].value:
        this.resonance(index);
        break;
      default:
        break;
    }

    for (let i = 0; i < board.slate.length; i++) {
      if (board.slate[i].distortion && board.slate[i].color === "yellow") {
        if (selectSpirit.value === "lightning") {
          board.slate[i].color = "purple";
          board.slate[i].text = ".";
          continue;
        }
        else
          board.slate[i].color = "brown";
        if (selectSpirit.level === 3 && selectSpirit.value !== "purification") {
          board.slate[i].probability = 0;
          board.slate[i].text = board.slate[i].probability.toString();
        }
      }
    }
    this.setState({ board });
  }

  handleMouseOut() {
    const board = this.state.board;

    for (let i = 0; i < board.slate.length; i++) {
      board.slate[i].color = null;
      board.slate[i].probability = 0;
      board.slate[i].hide = true;
      board.slate[i].text = ".";
      if (board.slate[i].distortion)
        board.slate[i].color = "purple";
      if (board.slate[i].specital !== null) {
        board.slate[i].color = "green";
        board.slate[i].text = board.slate[i].specital.name;
      }
    }
    board.lightningPenalty = false;
    this.setState({ board });
  }

  handleBoardClick(index) {
    const board = this.state.board;
    const inventory = this.state.inventory;
    let selectSpirit = this.state.selectSpirit;
    let count = 0;

    if (!selectSpirit)
      return;

    if (selectSpirit.value !== "eruption" && selectSpirit.value !== "resonance" && selectSpirit.value !== "purification") {
      if (board.slate[index].distortion)
        return ;
    }
    
    inventory.useSpirit(inventory.selected);

    for (let i = 0; i < board.slate.length; i++) {
      if (board.slate[i].probability > 0) {
        const randomNum = Math.floor((Math.random() * 99) + 1);
        if (randomNum <= board.slate[i].probability) {
          if (board.slate[i].distortion) {
            if (selectSpirit.value === "purification" || selectSpirit.value === "resonance")
              board.slate[i].visibility = "hidden";
            else if (board.slate[i].visibility !== "hidden")
              count++;
          }
          else {
            if (board.slate[i].visibility !== "hidden") {
              board.slate[i].visibility = "hidden";
              board.destroyed.push(i);
              board.left--;
              if (board.slate[i].specital !== null) {
                this.useSpecital(board.slate[i].specital, selectSpirit);
              }
            }
          }
        }
        else {
          board.slate[i].color = null;
          board.slate[i].probability = 0;
          board.slate[i].hide = true;
        }
      }
    }

    inventory.appendHand(inventory.useIndex);
    // 석판 복구 로직
    // 벼락 재생성
    if (board.lightningPenalty) {
      board.processLightningPenalty();
      board.lightningPenalty = false;
    }
    // 왜곡된 장판 효과
    while (count !== 0) {
      board.processDestroyPenalty();
      count--;
    }
    board.count++;
    board.setSpecital();
    selectSpirit = null; 
    this.handleMouseOver(index);
    this.setState({ board, inventory, selectSpirit });
    this.checkFinish();
  }

  handleSpiritClick(index) {
    const inventory = this.state.inventory;
    let selectSpirit = this.state.selectSpirit;

    if (inventory.selected !== index) {
      inventory.selected = index;
      selectSpirit = inventory.hand[index];
    }
    else {
      inventory.selected = null;
      selectSpirit = null;
    }
    this.setState({ inventory, selectSpirit })
  }

  handleChangeClick(index) {
    const inventory = this.state.inventory;

    inventory.changeHand(index);
    if (inventory.selected === index) {
      inventory.selected = null;
    }
    this.setState({ inventory, selectSpirit: null });
  }

  checkFinish() {
    const board = this.state.board;
    if (board.left === 0) {
      alert(this.getStringfinish());
      this.refreshBoard();
    }
  }

  refreshBoard() {
    const board = this.state.board;
    const inventory = this.state.inventory;
    const selectEquipment = this.state.selectEquipment;
    const selectLevel = this.state.selectLevel;

    board.initBoard(6);
    board.setBoard(selectEquipment);
    board.setDistortion(selectEquipment, selectLevel);
    board.countLeftSlate();
    inventory.initInventory();
    this.setState({ board, inventory, selectSpirit: null });
  }

  selectLevelBoard = (e) => {
    this.setState({ selectLevel: e.target.value });
  }

  selectEquipmentBoard = (e) => {
    this.setState({ selectEquipment: e.target.value });
  }

  render() {
    // 버튼
    const rows = [];
    for (let i = 0; i < this.state.board.level; i++) {
      const rowButtons = this.state.board.slate.slice(i * this.state.board.level, (i + 1) * this.state.board.level);
      rows.push(
        <div key={i} className="button-row">
          {rowButtons.map((button, index) => (
            <button
              key={index}
              className="grid-button"
              style={{  visibility: button.visibility, 
                        fontSize: '15px', 
                        width: '75px', 
                        height: '75px', 
                        backgroundColor: button.color }}
              onMouseOver={() => this.handleMouseOver(i * this.state.board.level + index)}
              onMouseOut={() => this.handleMouseOut()}
              onClick={() => this.handleBoardClick(i * this.state.board.level + index)}
            >{button.text}</button>
          ))}
        </div>
      );
    }

    // 정령교체 버튼
    const change = [];
    for (let i = 0; i < 2; i++) {
      change.push(
        <button
          key={i}
          className="change-button"
          style={{  margin: '15px',
                    fontSize: '12px', 
                    width: '150px', 
                    height: '30px', 
                    backgroundColor: 'white'}}
          onClick={() => this.handleChangeClick(i)}
        >
          {"정령 교체"}
        </button>
      )
    }
    // 정령카드 버튼
    const hand = [];
    for (let i = 0; i < 2; i++) {
      let spirit = this.state.inventory.hand[i];
      hand.push(
        <button
          key={i}
          className="hand-button"
          style={{  margin: '15px',
                    fontSize: '20px', 
                    width: '150px', 
                    height: '270px', 
                    backgroundColor: (this.state.inventory.selected === i ? "yellow":"white")  }}
          onClick={() => this.handleSpiritClick(i)}
        >
          {spirit.getString()}
        </button>
      )
    }

    const pocket = [];
    for (let i = 2; i >= 0; i--) {
      let spirit = this.state.inventory.poket[i];
      pocket.push(
        <button
          key={i}
          className="procket-button"
          style={{  fontSize: '14px', 
                    width: '75px', 
                    height: '135px', 
                    backgroundColor: 'white' }}
        >
          {spirit.getString()}
        </button>
      )
    }
    
    return (
      <div className="App">
        <h1>초월 시뮬레이터</h1>
        {<select onChange={this.selectEquipmentBoard}>
          <option value={1}>투구</option>
          <option value={2}>견갑</option>
          <option value={3}>상의</option>
          <option value={4}>하의</option>
          <option value={5}>장갑</option>
        </select>}

        {<select onChange={this.selectLevelBoard}>
          <option value={1}>1 단계</option>
          <option value={2}>2 단계</option>
          <option value={3}>3 단계</option>
        </select>}

        {<button onClick={() => this.refreshBoard()}>
          새로고침
        </button>}
        <div className="button-grid"
             style={{ margin: '30px'}}
        >
          {rows}
        </div>
        <div>
          <div style={{ fontSize: '15px',
                        paddingBottom: '15px'}}>
            {this.getStringProgress()}
          </div>
          <span style={{ margin: '15px',
                         position: 'relative',
                         top: '100px',
                         right: '175px'}}>{pocket}</span>
          <span style={{ margin: '15px', 
                         position: 'relative',
                         right: '128px'}}>{hand}</span>
          <div>
            <span style={{position: 'relative',
                         bottom: '30px'}}>
                {change}
            </span>
          </div>
          <div>
            <span>
                {"남은 정령교체 횟수 : " + this.state.inventory.change}
            </span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;