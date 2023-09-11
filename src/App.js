import React, { Component } from 'react';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttons: Array(25).fill(null),
    };
  }

  handleMouseOver = (index) => {
    const buttons = [...this.state.buttons];

    for (let i = 0; i < buttons.length; i++) {
      buttons[i] = null;
    }
    buttons[index] = 'yellow';

    this.setState({ buttons });
  }

  handleMouseOut = () => {
    const buttons = Array(25).fill(null);
    this.setState({ buttons });
  }

  render() {
    const rows = [];
    for (let i = 0; i < 5; i++) {
      const rowButtons = this.state.buttons.slice(i * 5, (i + 1) * 5);
      rows.push(
        <div key={i} className="button-row">
          {rowButtons.map((button, index) => (
            <button
              key={index}
              className="grid-button"
              style={{ width: '100px', height: '100px', backgroundColor: button }}
              onMouseOver={() => this.handleMouseOver(i * 5 + index)}
              onMouseOut={this.handleMouseOut}
            />
          ))}
        </div>
      );
    }

    return (
      <div className="App">
        <h1>버튼 그리드</h1>
        <div className="button-grid">
          {rows}
        </div>
      </div>
    );
  }
}

export default App;