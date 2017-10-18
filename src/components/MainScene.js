import React, { Component } from "react";
// A-Frame Components
import "aframe";
import "aframe-layout-component";
import "aframe-animation-component";
// A-Frame React
import { Entity, Scene } from "aframe-react";
import { EVENTS } from "../data/Store";

const IMAGE_PROXY =
  "https://wt-jhampton-gmail_com-0.run.webtask.io/cross-origin-image-proxy?i=";

export default class MainScene extends Component {
  constructor() {
    super();
    this.state = {
      itemSet: "all",
      cameraLookControls: false,
      cameraPosition: {
        x: 0,
        y: 0,
        z: 1
      },
      animations: {
        animation: {
          dur: 2400,
          elasticity: 100,
          property: "position",
          to: {
            x: 0,
            y: 0,
            z: 1
          }
        }
      }
    };
  }
  _entityForItem(item, index) {
    return (
      <Entity
        key={item.id}
        geometry={{ primitive: "plane", width: 1, height: 1 }}
        material={{
          color: index === 0 ? "#ff0000" : "#ffffff",
          src: `${IMAGE_PROXY}${item.thumb_image_url}`
        }}
        rotation={{
          x: 0,
          y: -180,
          z: 0
        }}
        events={{
          click: this._handleSelect(item).bind(this)
        }}
        text={{
          value: `${item.name}\n\n
            ${item.body}\n\n
            Price: $ ${item.price.price} per ${item.price.unit}`
        }}
      />
    );
  }

  _handleSelect(obj) {
    return e => {
      e.preventDefault();
      this._animateCameraToCoordinate({
        x: e.detail.intersection.point.x,
        y: e.detail.intersection.point.y,
        z: -3.8
      });
    };
  }

  _resetCamera(duration = 1) {
    this._animateCameraToCoordinate(
      {
        x: 0,
        y: 0,
        z: 2
      },
      duration
    );
  }

  _animateCameraToCoordinate(coords, duration = 1133) {
    let newAnimation = {};
    newAnimation["animation__" + Math.random().toString()] = {
      dur: duration,
      elasticity: 100,
      easing: "easeOutElastic",
      property: "position",
      to: coords
    };
    this.setState(
      {
        animations: newAnimation,
        cameraLookControls: false,
        cameraRotation: {
          x: 0,
          y: 0,
          z: 0
        }
      },
      () =>
        setTimeout(
          () =>
            this.setState({
              cameraLookControls: true,
              cameraPosition: coords,
              animations: {}
            }),
          duration
        )
    );
  }

  render() {
    let itemsToDisplay = this.props.items.current;
    let columnsToDisplay = Math.ceil(Math.sqrt(itemsToDisplay.length)) || 1;
    let radius = Math.floor(itemsToDisplay.length * 1.25 / 6.28) || 10;
    // console.log(">>> square", Math.ceil(Math.sqrt(this.state.items.length)));
    return (
      <Scene>
        <Entity
          primitive="a-camera"
          look-controls={this.state.cameraLookControls}
          wasd-controls={this.state.cameraLookControls}
          position={this.state.cameraPosition}
          {...this.state.animations}
        >
          <Entity primitive="a-cursor" />
        </Entity>
        <Entity
          layout={{
            type: "box",
            margin: 1,
            radius: radius,
            reverse: true,
            columns: columnsToDisplay
          }}
          position={{
            x: Math.floor(columnsToDisplay / 2),
            y: Math.floor(columnsToDisplay / 2) * -1,
            z: -5
          }}
          rotation={{
            x: 0,
            y: 180,
            z: 0
          }}
        >
          {itemsToDisplay.map((o, i) => this._entityForItem(o, i))}
        </Entity>
        <Entity
          geometry={{ primitive: "plane", width: 3, height: 3 }}
          position={{ x: 0, y: -1 * columnsToDisplay, z: -4 }}
          rotation={{ x: -45, y: 0, z: 0 }}
          material={{ color: "#ffffff", src: `map.jpg` }}
          events={{
            click: () => {
              this._resetCamera(433);
              this.setState({ itemSet: "all" });
            }
          }}
        />
        <Entity
          geometry={{ primitive: "plane", width: 3, height: 3 }}
          position={{ x: 4, y: -1 * columnsToDisplay, z: -4 }}
          rotation={{ x: -45, y: 0, z: 0 }}
          material={{ color: "#ffffff", src: `sortAZ.jpg` }}
          events={{
            click: () => {
              this._resetCamera(433);
              this.props.emit(EVENTS.SORT_ALPHA);
            }
          }}
        />
        <Entity
          geometry={{ primitive: "plane", width: 3, height: 3 }}
          position={{ x: 8, y: -1 * columnsToDisplay, z: -4 }}
          rotation={{ x: -45, y: 0, z: 0 }}
          material={{ color: "#ffffff", src: `sortAsc.jpg` }}
          events={{
            click: () => {
              this._resetCamera(433);
              this.props.emit(EVENTS.SORT_PRICE_ASC);
            }
          }}
        />
        <Entity
          geometry={{ primitive: "plane", width: 3, height: 3 }}
          position={{ x: 8, y: -1 * columnsToDisplay, z: -4 }}
          rotation={{ x: -45, y: 0, z: 0 }}
          material={{ color: "#ffffff", src: `sortAsc.jpg` }}
          events={{
            click: () => {
              this._resetCamera(433);
              this.props.emit(EVENTS.SORT_PRICE_ASC);
            }
          }}
        />
        <Entity
          geometry={{ primitive: "plane", width: 3, height: 3 }}
          position={{ x: 12, y: -1 * columnsToDisplay, z: -4 }}
          rotation={{ x: -45, y: 0, z: 0 }}
          material={{ color: "#ffffff", src: `sortDesc.jpg` }}
          events={{
            click: () => {
              this._resetCamera(433);
              this.props.emit(EVENTS.SORT_PRICE_DESC);
            }
          }}
        />
        <Entity light={{ type: "point" }} />
        <Entity primitive="a-sky" src="denver.jpg" />
      </Scene>
    );
  }
}
