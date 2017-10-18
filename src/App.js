import React, { Component } from "react";
import "./App.css";
import { store, EVENTS } from "./data/Store";
import MainScene from "./components/MainScene";
import SearchArea from "./components/SearchArea";

class App extends Component {
  constructor() {
    super();
    this.state = {
      store: store.get(),
      search: ""
    };
  }
  componentDidMount() {
    this.setState({ store: store.get() });
    store.emit(EVENTS.LOAD_DATA);
    store.on("update", (newState, prevState) => {
      console.log(">>> newState", newState);
      this.setState({ store: newState });
    });
  }

  render() {
    return (
      <div className="App">
        <MainScene
          emit={store.emit}
          items={this.state.store.items}
          events={EVENTS}
        />
        <SearchArea emit={store.emit} />
      </div>
    );
  }
}

export default App;
