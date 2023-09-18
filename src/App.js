import React, { Component } from 'react';
import './App.css';

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

const specital = [ 
  { type: 0, name: "재배치"},
  { type: 1, name: "축복"},
  { type: 2, name: "추가"},
  { type: 3, name: "신비"},
  { type: 4, name: "강화"},
  { type: 5, name: "복제"},
];

class Square {
  constructor() {
    this.probability = 0;
    this.specital = null;
    this.activation = true;
    this.color = null;
    this.hide = true;
    this.visibility = "";
    this.distortion = false;
    this.text = "";
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
    if (this.value === "eruption" && this.value === "resonance")
      return (str);
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
  }

  changeHand(index) {
    if (this.change > 0) {
      this.hand[index] = this.poket.shift();
      this.poket.push(this.createSpirit());
      this.levelUpSpirit();
      this.selected = null;
      this.change--;
    }
    console.log(this.hand);
  }

  useSpirit(index) {
    let spirit = null;
    if (index === 0) {
      spirit = this.hand.shift();
      this.useIndex = 0;
    }
    else {
      spirit = this.hand.pop();
      this.useIndex = 1;
    }

    this.selected = null;
    this.hand.push(this.poket.shift());
    this.poket.push(this.createSpirit());
    this.levelUpSpirit();
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
      if (this.hand[0].level < 3 && this.hand[0].value !== "eruption" && this.hand[0].value !== "resonance") {
        this.hand[0].level++;
        this.hand.pop();
        this.hand.push(this.createSpirit());
        this.levelUpSpirit();
      }
    }
  }

  mystery() {
    let leftIdx = (this.useIndex === 0 ? 1 : 0);
    let randomNum = Math.floor(Math.random() * 2);
    delete this.hand[leftIdx];
    if (randomNum === 0) {
      this.hand[leftIdx] = new Spirit("분출", "eruption");
    }
    else {
      this.hand[leftIdx] = new Spirit("세계수의 공명", "resonance");
    }
    console.log(this.useIndex);
    console.log(leftIdx);
    console.log(this.hand[leftIdx]);
  }

  enhance() {
    let leftIdx = (this.useIndex === 0 ? 1 : 0);
    
    if (this.hand[leftIdx].level < 3) {
      this.hand[leftIdx].level++;
    }
  }

  reproduction() {
    let leftIdx = (this.useIndex === 0 ? 1 : 0);
    delete this.hand[leftIdx];
    this.hand[leftIdx] = this.hand[this.useIndex];

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
    this.left = level**2 - 1;
    this.count = 1;
  }

  // 머리 장갑 : 모서리 1개
  // 상의 : 마름모
  // 견갑 하의 : 풀
  setBoard(flag) {
    switch (flag) {
      case 0:
        this.slate[0].visibility = "hidden";
        this.slate[this.level - 1].visibility = "hidden";
        this.slate[this.level * (this.level - 1)].visibility = "hidden";
        this.slate[this.level * this.level - 1].visibility = "hidden";
        break;
      case 1:
        this.slate[0].visibility = "hidden";
        this.slate[1].visibility = "hidden";
        this.slate[this.level].visibility = "hidden";

        this.slate[this.level - 2].visibility = "hidden";
        this.slate[this.level - 1].visibility = "hidden";
        this.slate[this.level + (this.level - 1)].visibility = "hidden";

        this.slate[this.level * (this.level - 2)].visibility = "hidden";
        this.slate[this.level * (this.level - 1)].visibility = "hidden";
        this.slate[this.level * (this.level - 1) + 1].visibility = "hidden";


        this.slate[this.level * (this.level - 1) - 1].visibility = "hidden";
        this.slate[this.level * this.level - 2].visibility = "hidden";
        this.slate[this.level * this.level - 1].visibility = "hidden";
        break;
      default:
        break;
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
    
    let idx = Math.floor(Math.random() * randomIndex.length);
    this.slate[randomIndex[idx]].specital = specital[randomNum];
    this.slate[randomIndex[idx]].color = "green";
    this.slate[randomIndex[idx]].text = specital[randomNum].name;
  }

  setDistortion() {
    let i = Math.floor(this.level / 2);
    this.slate[i * this.level + i].distortion = true;
    this.slate[i * this.level + i].color = "purple";
  }

  fallback() {
    this.destroyed.sort(() => Math.random() - 0.5);
    if (this.destroyed.length < 3) {
      while (this.destroyed.length !== 0) {
        let idx = this.destroyed.pop();
        this.slate[idx].visibility = "";
        this.left++;
      }
    }
    else {
      for (let i = 0; i < 3; i++) {
        let idx = this.destroyed.pop();
        this.slate[idx].visibility = "";
        this.left++;
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
    };
    //this.state.board.setDistortion();
    this.state.board.setBoard(0);
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
      board.slate[line * size + i].color = "yellow";
      board.slate[line * size + i].probability = 100 - (probability * diff);
      board.slate[line * size + i].hide = false;
      board.slate[line * size + i].text = board.slate[line * size + i].probability.toString();
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
      board.slate[i * size + row].color = "yellow";
      board.slate[i * size + row].probability = 100 - (probability * diff);
      board.slate[i * size + row].hide = false;
      board.slate[i * size + row].text = board.slate[i * size + row].probability.toString();
    }
    this.setState({ board });
  }

  // 분출 : 선택 1칸
  eruption(index) {
    const board = this.state.board;
    board.slate[index].color = "yellow";
    board.slate[index].probability = 100;
    board.slate[index].hide = false;
    board.slate[index].text = board.slate[index].probability.toString();

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
          board.slate[idx].color = "yellow";
          board.slate[idx].probability = (idx === index ? 100 : probability);
          board.slate[idx].hide = false;
          board.slate[idx].text = board.slate[idx].probability.toString();
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
          board.slate[idx].color = "yellow";
          board.slate[idx].probability = (idx === index ? 100 : probability);
          board.slate[idx].hide = false;
          board.slate[idx].text = board.slate[idx].probability.toString();
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
        board.slate[idx].color = "yellow";
        board.slate[idx].probability = 100 - (probability * Math.abs(diff));
        board.slate[idx].hide = false;
        board.slate[idx].text = board.slate[idx].probability.toString();
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
      board.slate[idx].color = "yellow";
      board.slate[idx].probability = (idx === index ? 100 : probability);
      board.slate[idx].hide = false;
      board.slate[idx].text = board.slate[idx].probability.toString();
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
      board.slate[idx].color = "yellow";
      board.slate[idx].probability = (idx === index ? 100 : probability);
      board.slate[idx].hide = false;
      board.slate[idx].text = board.slate[idx].probability.toString();
    }
    this.setState({ board });
  }

  countLightning(level, index) {
    const board = this.state.board;
    const randomNum = Math.floor((Math.random() * 99) + 1);
    const probability = 50;
    const num = probability / (level * 2);
    const randomIndex = [];
    const boardIndex = [];
    let count = 0;
    let penalty = 1;

    for (let i = 0; i < level * 2 + 1; i++) {
      if (randomNum <= probability - (num * i))
        count++;
    }

    for (let i = 0; i < board.slate.length; i++) {
      if (board.slate[i].visibility === "hidden" && board.destroyed.find((j) => i === j) === undefined) {
        continue;
      }
      boardIndex.push(i);
    }

    while (count > 0) {
      let idx = boardIndex.splice(Math.floor(Math.random() * boardIndex.length),1)[0];
      if (board.destroyed.find((i) => i === idx) !== undefined) {
        if (penalty > 0) {
          randomIndex.push(idx);
          count--;
          penalty--;
        }
      }
      else {
        if (board.slate[idx].distortion)
          continue;
        if (idx !== index) {
          randomIndex.push(idx);
          count--;
        }
      }
    }
    return (randomIndex);
  }

  // 벼락 : 레벨당 임의 2개 추가
  lightning(index) {
    const board = this.state.board;
    const selectSpirit = this.state.selectSpirit;
    const randomIndex = this.countLightning(selectSpirit.level, index);
    for (let i = 0; i < randomIndex.length; i++) {
      if (board.destroyed.find((j) => j === randomIndex[i]) !== undefined) {
        board.slate[randomIndex[i]].probability = -100;
      }
      else {
        board.slate[randomIndex[i]].probability = 100;
      }
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
      board.slate[idx].color = "yellow";
      board.slate[idx].probability = (idx === index ? 100 : probability);
      board.slate[idx].hide = false;
      board.slate[idx].text = board.slate[idx].probability.toString();
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
      board.slate[idx].color = "yellow";
      board.slate[idx].probability = 100;
      board.slate[idx].hide = false;
      board.slate[idx].text = board.slate[idx].probability.toString();
    }

    for (let i = 0; i < 5; i++) {
      let line_idx = line + (i - 2);
      if ((line_idx < 0 || line_idx > size - 1)) {
        continue;
      }
      let idx = line_idx * size + row;
      board.slate[idx].color = "yellow";
      board.slate[idx].probability = 100;
      board.slate[idx].hide = false;
      board.slate[idx].text = board.slate[idx].probability.toString();
    }
    
    this.setState({ board });
  }

  // specital
  useSpecital(specital) {
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
        this.reproduction();
        break;
      default:
        break;
  }
    this.setState({ board, inventory });
  }

  reposition() {

  }

  bless() {
    const board = this.state.board;
    board.left++;
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

  reproduction() {
    const inventory = this.state.inventory;
    inventory.reproduction();
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
        board.slate[i].color = "brown";
        if (selectSpirit.level === 3) {
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
      board.slate[i].hide = false;
      board.slate[i].text = ".";
      if (board.slate[i].distortion)
        board.slate[i].color = "purple";
      if (board.slate[i].specital !== null) {
        board.slate[i].color = "green";
        board.slate[i].text = board.slate[i].specital.name;

      }
    }
    this.setState({ board });
  }

  handleBoardClick(index) {
    const board = this.state.board;
    const inventory = this.state.inventory;
    let selectSpirit = this.state.selectSpirit;
    if (!selectSpirit)
      return;
    for (let i = 0; i < board.slate.length; i++) {
      if (board.slate[i].probability > 0) {
        const randomNum = Math.floor((Math.random() * 99) + 1);
        if (randomNum <= board.slate[i].probability) {
          if (board.slate[i].distortion) {
            if (selectSpirit.value === "purification" || selectSpirit.value === "resonance")
              board.slate[i].visibility = "hidden";
            else
              board.fallback();
          }
          else {
            if (board.slate[i].visibility !== "hidden") {
              board.slate[i].visibility = "hidden";
              board.destroyed.push(i);
              board.left--;
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
    if (board.slate[index].specital !== null) {
      this.useSpecital(board.slate[index].specital, selectSpirit);
    }
    board.count++;
    board.setSpecital();
    selectSpirit = null; 
    this.handleMouseOver(index);
    inventory.useSpirit(inventory.selected);
    this.setState({ board, inventory, selectSpirit });
    this.checkFinish();
  }

  // handleSelect = (e) => {
  //   this.handleMouseOut();
  //   this.setState({ selectSpirit: e.target.value })
  // };

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
    let selectSpirit = this.state.selectSpirit;

    inventory.changeHand(index);
    if (inventory.selected === index) {
      inventory.selected = null;
      selectSpirit = null;
    }
    this.setState({ inventory, selectSpirit });
  }

  checkFinish() {
    const board = this.state.board;
    if (board.left === 0)
      alert(board.count + "턴 소요하여 석판을 제거 하였습니다!");
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
                        fontSize: '20px', 
                        width: '100px', 
                        height: '100px', 
                        backgroundColor: button.color }}
              onMouseOver={() => this.handleMouseOver(i * this.state.board.level + index)}
              onMouseOut={() => this.handleMouseOut()}
              onClick={() => this.handleBoardClick(i * this.state.board.level + index)}
            >{button.text}</button>
          ))}
        </div>
      );
    }

    // //정령효과
    // let spirit = [];
    // spirit.push(
    //   options.map((option) => (
    //     <option
    //       key={option.value}
    //       value={option.value}
    //     >
    //       {option.label}
    //     </option>
    //   )));

    // 정령교체 버튼
    const change = [];
    for (let i = 0; i < 2; i++) {
      change.push(
        <button
          key={i}
          className="change-button"
          style={{  fontSize: '12px', 
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
          style={{  fontSize: '20px', 
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
        <h1>test</h1>
        {/* <select onChange={this.handleSelect}>{spirit}</select> */}
        <div className="button-grid"
             style={{ margin: '30px'}}
        >
          {rows}
        </div>
        <div>
          <div style={{ fontSize: '15px'}}>
            {this.state.board.count + "번째 턴 - 남은 석판의 개수 : " + this.state.board.left}
          </div>
          <div>
            <span style={{ margin: '0 auto'}}>{hand}</span>
          </div>
          <div>
            <span style={{margin: '0 auto'}}>
                {change}
            </span>
          </div>
          <div>
            <span style={{margin: '0 auto'}}>
                {"남은 교체 횟수 : " + this.state.inventory.change}
            </span>
          </div>
          <div style={{margin: '30px'}}>
            <span style={{ float: 'left'}}>{pocket}</span>
          </div>
        </div>
      </div>
    );
  }
}

export default App;