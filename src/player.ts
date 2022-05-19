import { Positioned, Direction, TILE_SIZE, GRAVITY } from './common';
import Level from './level';

enum PlayerState {
  Standing,
  Jumping,
  Rolling,
  Hurt,
}

interface PlayerInputState {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  jump: boolean;
}

class Player {
  x = 0;
  y = 0;

  xSpeed = 0;
  ySpeed = 0;
  groundSpeed = 0;
  angle = 0; // radians
  grounded = true;
  state = PlayerState.Standing;
  controlLockTimer = 0;

  standWidthRadius = 9;
  standHeightRadius = 19;
  rollWidthRadius = 7;
  rollHeightRadius = 14;
  pushRadius = 10;
  hitboxWidthRadius = 8;

  acceleration = 0.046875;
  deceleration = 0.5;
  rollDeceleration = 0.125;
  friction = 0.046875;
  maxXSpeed = 6;  
  maxYSpeed = 16;
  minWallSpeed = 2.5;
  airAcceleration = 0.09375;

  jumpForce = 6.5;
  slopeFactor = 0.125;    // slope factor when walking/running
  slopeRollUp = 0.078125; // slope factor when rolling uphill
  slopeRollDown = 0.3125;   // slope factor when rolling downhill
  rotateBack = 0.0491; // radians to rotate back to 0

  get widthRadius () {
    return this.state === PlayerState.Standing ? this.standWidthRadius : this.rollWidthRadius;
  }

  get heightRadius () {
    return this.state === PlayerState.Standing ? this.standHeightRadius : this.rollHeightRadius;
  }
  
  get hitboxHeightRadius() {
    return this.heightRadius - 3;
  }

  get hitboxY() {
    return this.y - this.hitboxHeightRadius + (this.state === PlayerState.Standing ? 0 : 10);
  }

  get rotation() {
    if (
      this.angle > Math.PI * 5 / 4 && this.angle <= Math.PI * 7 / 4) {
      return Direction.Left;
    } else if (
      this.angle > Math.PI * 1 / 4 && this.angle <= Math.PI * 3 / 4) {
      return Direction.Right;
    } else if (
      this.angle > Math.PI * 3 / 4 && this.angle <= Math.PI * 5 / 4) {
      return Direction.Up;
    } else {
      return Direction.Down;
    }
  }

  get sensorA() {
    switch(this.rotation) {
      case Direction.Left: {
        return {
          x: this.x - this.heightRadius,
          y: this.y - this.widthRadius
        };
      }
      case Direction.Right: {
        return {
          x: this.x + this.heightRadius,
          y: this.y + this.widthRadius
        };
      }
      case Direction.Up: {
        return {
          x: this.x + this.widthRadius,
          y: this.y - this.heightRadius
        };
      }
      case Direction.Down:
      default: {
        return {
          x: this.x - this.widthRadius,
          y: this.y + this.heightRadius
        };
      }
    }
  }

  get sensorB() {
    switch(this.rotation) {
      case Direction.Left: {
        return {
          x: this.x - this.heightRadius,
          y: this.y + this.widthRadius
        };
      }
      case Direction.Right: {
        return {
          x: this.x + this.heightRadius,
          y: this.y - this.widthRadius
        };
      }
      case Direction.Up: {
        return {
          x: this.x - this.widthRadius,
          y: this.y - this.heightRadius
        };
      }
      case Direction.Down:
      default: {
        return {
          x: this.x + this.widthRadius,
          y: this.y + this.heightRadius
        };
      }
    }
  }

  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  updateGroundSpeed() {
    const sinGroundAngle = Math.sin(this.angle);
    let slopeFactor = this.slopeFactor;
    if (this.state === PlayerState.Rolling) {
      const upOrDown = Math.sign(sinGroundAngle) === Math.sign(this.groundSpeed);
      slopeFactor = upOrDown ? this.slopeRollUp : this.slopeRollDown;
    }
    this.groundSpeed -= slopeFactor * sinGroundAngle;
  }

  updateSpeed(input: PlayerInputState) {
    if (this.grounded) {
      if (this.state === PlayerState.Rolling) {
        if (input.left && this.groundSpeed > 0) {
          this.groundSpeed -= this.rollDeceleration;
        } else if (input.right && this.groundSpeed < 0) {
          this.groundSpeed += this.rollDeceleration;
        }
        if (!input.left && !input.right) {
          // apply rolling friction
          this.groundSpeed -= Math.sign(this.groundSpeed) * Math.min(Math.abs(this.groundSpeed), this.friction / 2);
        }
      } else if (this.state === PlayerState.Standing) {
        if (input.left) {
          this.groundSpeed -= this.groundSpeed > 0 ? this.deceleration : this.acceleration;
        } else if (input.right) {
          this.groundSpeed += this.groundSpeed < 0 ? this.deceleration : this.acceleration;
        }
        if (!input.left && !input.right) {
          // apply running friction
          this.groundSpeed -= Math.sign(this.groundSpeed) * Math.min(Math.abs(this.groundSpeed), this.friction);
        }
      }
      
      this.xSpeed = this.groundSpeed * Math.cos(this.angle);
      this.ySpeed = this.groundSpeed * Math.sin(this.angle);
    } else {
      // apply gravity
      this.ySpeed += GRAVITY;
      // cap fall speed
      this.ySpeed = Math.min(this.ySpeed, this.maxYSpeed);
    }

    // cap X speed
    this.xSpeed = Math.sign(this.xSpeed) * Math.min(Math.abs(this.xSpeed), this.maxXSpeed);
    // todo finish
  }

  applyAirDrag() {
    if (this.ySpeed < 0 && this.ySpeed > -4) {
        this.xSpeed -= ((this.xSpeed / 0.125) / 256);
    }
  }

  checkFloorCollisions(level: Level) {
    const { sensorA, sensorB } = this;

    const checkSensor = (sensor: Positioned) => {
      let tile = level.getTile(sensor.x, sensor.y);
      let distAtSensor = 0;
      if (tile.isEmpty) {
        distAtSensor += TILE_SIZE;
        tile = level.getTile(sensor.x, sensor.y + TILE_SIZE);
      } else if (tile.isFull) {
        distAtSensor -= TILE_SIZE;
        tile = level.getTile(sensor.x, sensor.y - TILE_SIZE);
        // check again if last tile was full
        if (tile.isEmpty) {
          distAtSensor += TILE_SIZE;
          tile = level.getTile(sensor.x, sensor.y + TILE_SIZE);
        }
      }

      const tileOffset = {
        x: sensor.x % TILE_SIZE,
        y: sensor.y % TILE_SIZE
      }
      distAtSensor += tile.getTileHeight(tileOffset, this.rotation);
      return distAtSensor;
    };

    const aDist = checkSensor(sensorA);
    const bDist = checkSensor(sensorB);
    const minDist = Math.min(aDist, bDist);

    switch(this.rotation) {
      case Direction.Left: {
        this.x -= minDist;
        break;
      }
      case Direction.Right: {
        this.x += minDist;
        break;
      }
      case Direction.Up: {
        this.y -= minDist;
        break;
      }
      case Direction.Down:
      default: {
        this.y += minDist;
        break;
      }
    }
  }

  handleInput(keys: Record<string, boolean>): PlayerInputState {
    return {
      left: keys.ArrowLeft,
      right: keys.ArrowRight,
      up: keys.ArrowUp,
      down: keys.ArrowDown,
      jump: keys[" "]
    };
  }

  update(keys: Record<string, boolean>, level: Level) {
    const inputState = this.handleInput(keys);

    if (this.state === PlayerState.Rolling) {
      // adjust ground speed based on current ground angle
      this.updateGroundSpeed();

      // check for starting a jump

      // update ground speed based on directional input and apply friction
      this.updateSpeed(inputState);

      // check wall collisions
      // handle camera boundaries

      // update position
      this.x += Math.floor(this.xSpeed);
      this.y += Math.floor(this.ySpeed);

      // check floor and ceiling collisions
      // check for falling when ground speed is too low on walls and ceilings

    } else if (!this.grounded) {
      // check for jump release
      // check for turning super

      // update X speed based on input
      this.updateSpeed(inputState);

      // apply air drag
      this.applyAirDrag();

      // update position
      this.x += Math.floor(this.xSpeed);
      this.y += Math.floor(this.ySpeed);

      // rotate angle back to 0
      if (this.angle > 0) {
        this.angle -= this.rotateBack;
      } else if (this.angle < 0) {
        this.angle += this.rotateBack;
      }

      // check wall collisions

      // check floor and ceiling collisions
      this.checkFloorCollisions(level);
    } else {
      // "normal"

      // check for animations like balancing
      // check for starting a spindash

      // adjust ground speed based on current ground angle
      this.updateGroundSpeed();

      // check for starting a jump

      // update ground speed based on directional input and apply accel/decel
      this.updateSpeed(inputState);

      // check for starting animations like ducking or balancing
      // check wall collisions

      // check for starting a roll
      if (this.groundSpeed !== 0 && inputState.down) {
        this.state = PlayerState.Rolling;
      }

      // handle camera boundaries

      // update position
      this.x += Math.floor(this.xSpeed);
      this.y += Math.floor(this.ySpeed);

      // check floor and ceiling collisions
      this.checkFloorCollisions(level);

      // check for falling when ground speed is too low on walls and ceilings
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    // width and height
    ctx.fillStyle = 'rgba(0, 255, 0, 0.6)';
    ctx.fillRect(
      this.x - this.widthRadius,
      this.y - this.heightRadius,
      this.widthRadius * 2 + 1,
      this.heightRadius * 2 + 1
    );

    // hitbox
    ctx.fillStyle = 'rgba(255, 0, 255, 0.6)';
    ctx.fillRect(
      this.x - this.hitboxWidthRadius,
      this.y - this.hitboxHeightRadius,
      this.hitboxWidthRadius * 2 + 1,
      this.hitboxHeightRadius * 2 + 1
    );
  }
}

export default Player;