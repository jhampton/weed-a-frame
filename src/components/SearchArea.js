import React, { Component } from "react";
import { EVENTS } from "../data/Store";

export default class SearchArea extends Component {
  constructor() {
    super();
    this.state = {
      search: ""
    };
  }

  _handleSearchChange(e) {
    this.setState({ search: e.target.value });
    this.props.emit(EVENTS.SEARCH, e.target.value);
  }

  render() {
    return (
      <div className="search-area">
        <form onSubmit={e => e.preventDefault()}>
          <input
            ref="search"
            placeholder={"Search..."}
            type={"search"}
            value={this.state.search}
            onChange={this._handleSearchChange.bind(this)}
          />
        </form>
      </div>
    );
  }
}
