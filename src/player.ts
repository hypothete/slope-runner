import { Positioned, Direction, TILE_SIZE, GRAVITY } from './common';
import Level, { Tile } from './level';

enum PlayerState {
  Standing,
  Crouching,
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
  spinrev = 0;
  facing = true; // right = true

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

  debugString = '';

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

  get sensorE() {
    switch(this.rotation) {
      case Direction.Left: {
        return {
          x: this.x,
          y: this.y + this.pushRadius
        };
      }
      case Direction.Right: {
        return {
          x: this.x,
          y: this.y - this.pushRadius
        };
      }
      case Direction.Up: {
        return {
          x: this.x + this.pushRadius,
          y: this.y
        };
      }
      case Direction.Down:
      default: {
        return {
          x: this.x - this.pushRadius,
          y: this.y + (this.angle === 0 ? 8 : 0)
        };
      }
    }
  }

  get sensorF() {
    switch(this.rotation) {
      case Direction.Left: {
        return {
          x: this.x,
          y: this.y - this.pushRadius
        };
      }
      case Direction.Right: {
        return {
          x: this.x,
          y: this.y + this.pushRadius
        };
      }
      case Direction.Up: {
        return {
          x: this.x - this.pushRadius,
          y: this.y
        };
      }
      case Direction.Down:
      default: {
        return {
          x: this.x + this.pushRadius,
          y: this.y + (this.angle === 0 ? 8 : 0)
        };
      }
    }
  }

  get stateString () {
    switch(this.state) {
      case PlayerState.Hurt:
        return 'Hurt';
      case PlayerState.Jumping:
        return 'Jumping';
      case PlayerState.Rolling:
        return 'Rolling';
      case PlayerState.Crouching:
        return 'Crouching';
      default:
        return 'Standing';
    }
  }

  get rotationString () {
    switch(this.rotation) {
      case Direction.Up:
        return 'Up';
      case Direction.Right:
        return 'Right';
      case Direction.Left:
        return 'Left';
      case Direction.Down:
      default:
        return 'Down';
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
    // todo I think there's a bug here where slopes keep ticking up groundSpeed
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
        if (Math.abs(this.groundSpeed) < this.friction && !input.down) {
          this.state = PlayerState.Standing;
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
      this.ySpeed = -this.groundSpeed * Math.sin(this.angle);
    } else {
      // apply input
      if (input.left) {
        this.xSpeed -= this.airAcceleration;
      } else if (input.right) {
        this.xSpeed += this.airAcceleration;
      }
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
    if (!this.grounded) {
      if (
        (Math.abs(this.xSpeed) < Math.abs(this.ySpeed)) && // not going mostly left or right
        this.ySpeed < 0
        )
      {
        // mostly going up
        return;
      }
    }

    const { sensorA, sensorB } = this;

    interface FloorSensorDetails {
      offset: Positioned;
      tile: Tile;
    }

    const extendSensor = (sensor: Positioned) => {
      switch(this.rotation) {
        case Direction.Left: {
          sensor.x -= TILE_SIZE;
          break;
        }
        case Direction.Right: {
          sensor.x += TILE_SIZE;
          break;
        }
        case Direction.Up: {
          sensor.y -= TILE_SIZE;
          break;
        }
        case Direction.Down: {
          sensor.y += TILE_SIZE;
          break;
        }
      }
    };

    const regressSensor = (sensor: Positioned) => {
      switch(this.rotation) {
        case Direction.Left: {
          sensor.x += TILE_SIZE;
          break;
        }
        case Direction.Right: {
          sensor.x -= TILE_SIZE;
          break;
        }
        case Direction.Up: {
          sensor.y += TILE_SIZE;
          break;
        }
        case Direction.Down: {
          sensor.y -= TILE_SIZE;
          break;
        }
      }
    };

    const checkSensor = (sensor: Positioned): FloorSensorDetails => {
      const tileCheckPosition = {
        x: sensor.x,
        y: sensor.y
      };

      let tile = level.getTile(tileCheckPosition.x, tileCheckPosition.y);

      if (tile.isEmpty) {
        // extension
        extendSensor(tileCheckPosition);
        tile = level.getTile(tileCheckPosition.x, tileCheckPosition.y);

      } else if (tile.isFull) {
        // regression
        regressSensor(tileCheckPosition);
        tile = level.getTile(tileCheckPosition.x, tileCheckPosition.y);

        if (tile.isEmpty) {
          extendSensor(tileCheckPosition);
          tile = level.getTile(tileCheckPosition.x, tileCheckPosition.y);
        }
      }

      const tileOffset = {
        x: tileCheckPosition.x % TILE_SIZE,
        y: tileCheckPosition.y % TILE_SIZE
      }

      const foundOffset = tile.getCollisionOffset(tileOffset, this.rotation);
      // foundOffset does not take into account extension/regression

      const totalOffset = {
        x: tileCheckPosition.x + foundOffset.x - sensor.x,
        y: tileCheckPosition.y + foundOffset.y - sensor.y,
      }

      return { offset: totalOffset, tile };
    };

    const checkA = checkSensor(sensorA);
    const checkB = checkSensor(sensorB);
    let minCheck: FloorSensorDetails;
    let minDist = 14; // special term

    switch(this.rotation) {
      case Direction.Left: {
        const minX = Math.min(checkA.offset.x, checkB.offset.x);
        minCheck = minX == checkA.offset.x ? checkA : checkB;
        minDist = Math.abs(minX);
        break;
      }
      case Direction.Right: {
        const minX = Math.max(checkA.offset.x, checkB.offset.x);
        minCheck = minX == checkA.offset.x ? checkA : checkB;
        minDist = Math.abs(minX);
        break;
      }
      case Direction.Up: {
        const minY = Math.max(checkA.offset.y, checkB.offset.y);
        minCheck = minY == checkA.offset.y ? checkA : checkB;
        minDist = Math.abs(minY);
        break;
      }
      case Direction.Down:
      default: {
        const minY = Math.min(checkA.offset.y, checkB.offset.y);
        minCheck = minY == checkA.offset.y ? checkA : checkB;
        minDist = Math.abs(minY);
        break;
      }
    }

    // at this point we know which check wins
    if (minDist <= 14) {
      // move to contact position

      switch(this.rotation) {
        case Direction.Left:
        case Direction.Right: {
          this.x += minCheck.offset.x;
          break;
        }
        case Direction.Up:
        case Direction.Down:
        default: {
          this.y += minCheck.offset.y;
          break;
        }
      }

      this.angle = minCheck.tile.angle;
      this.grounded = true;

      if (this.state == PlayerState.Jumping) {
        this.state = PlayerState.Standing;
      }
    } else {
      this.grounded = false;
    }
  }

  checkWallCollisions(level: Level) {
    const { sensorE, sensorF } = this;

    const checkSensor = (sensor: Positioned, direction: Direction): number => {
      const tile = level.getTile(sensor.x, sensor.y);
      if (tile.isEmpty) {
        return 0;
      }

      const tileOffset = {
        x: sensor.x % TILE_SIZE,
        y: sensor.y % TILE_SIZE
      }
      const offset = tile.getCollisionOffset(tileOffset, direction);
      return offset.x;
    };

    const activeSensor =
    (this.grounded ? this.groundSpeed : this.xSpeed) < 0 ? sensorE : sensorF;

    const activeDirection = 
      (this.grounded ? this.groundSpeed : this.xSpeed) < 0 ? Direction.Left : Direction.Right;
    
    const offsetDist = checkSensor(activeSensor, activeDirection);

    if (offsetDist !== 0) {
      this.groundSpeed = 0;
      switch(this.rotation) {
        case Direction.Left:
        case Direction.Right: {
          if (this.grounded) {
            this.ySpeed += offsetDist;
          } else {
            this.y += offsetDist;
            this.ySpeed = 0;
          }
        }
        case Direction.Up:
        case Direction.Down:
        default: {
          if (this.grounded) {
            this.xSpeed += offsetDist;
          } else {
            this.x += offsetDist;
            this.xSpeed = 0;
          }
        }
      }
    }
   
    this.debugString = `${offsetDist}`;
  }

  checkJumpStart(input: PlayerInputState) {
    if (this.grounded && input.jump && this.state !== PlayerState.Jumping && this.spinrev === 0) {
      this.state = PlayerState.Jumping;
      this.grounded = false;
      this.xSpeed -= this.jumpForce * Math.sin(this.angle);
      this.ySpeed -= this.jumpForce * Math.cos(this.angle);
    }
  }

  checkJumpRelease(input: PlayerInputState) {
    if (!input.jump && this.state == PlayerState.Jumping && this.ySpeed < -4) {
      this.ySpeed = -4;
    }
  }

  checkSpindash(input: PlayerInputState) {
    if (this.state === PlayerState.Crouching && input.down) {
      if (input.jump) {
        this.spinrev += 2;
      }
      this.spinrev -= (Math.floor(this.spinrev / 0.125) / 256);
    } else if (this.spinrev !== 0) {
      this.state = PlayerState.Rolling;
      this.groundSpeed = (this.facing ? 1 : -1) * (8 + Math.floor(this.spinrev) / 2);
      this.spinrev = 0;
    }
    if (this.spinrev > 0) {
      this.spinrev = Math.min(this.spinrev, 12);
    }
  }

  updatePosition() {
    this.x += Math.floor(this.xSpeed);
    this.y += Math.floor(this.ySpeed);
  }

  handleInput(keys: Record<string, boolean>): PlayerInputState {
    // handle facing here
    if (keys.ArrowLeft) {
      this.facing = false;
    } else if (keys.ArrowRight) {
      this.facing = true;
    }
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
      this.checkJumpStart(inputState);

      // update ground speed based on directional input and apply friction
      this.updateSpeed(inputState);

      // check wall collisions
      this.checkWallCollisions(level);
      
      // handle camera boundaries

      // update position
      this.updatePosition();

      // check floor and ceiling collisions
      this.checkFloorCollisions(level);

      // check for falling when ground speed is too low on walls and ceilings

    } else if (!this.grounded) {
      // check for jump release
      this.checkJumpRelease(inputState);

      // check for turning super

      // update X speed based on input
      this.updateSpeed(inputState);

      // apply air drag
      this.applyAirDrag();

      // update position
      this.updatePosition();

      // rotate angle back to 0
      if (this.angle > Math.PI ) {
        this.angle += this.rotateBack;
      } else {
        this.angle -= this.rotateBack;
      }

      // check wall collisions
      this.checkWallCollisions(level);

      // check floor and ceiling collisions
      this.checkFloorCollisions(level);
    } else {
      // "normal"

      // check for animations like balancing

      // check for starting a spindash
      this.checkSpindash(inputState);

      // adjust ground speed based on current ground angle
      this.updateGroundSpeed();

      // check for starting a jump
      this.checkJumpStart(inputState);

      // update ground speed based on directional input and apply accel/decel
      this.updateSpeed(inputState);

      // check for starting animations like ducking or balancing
      
      // check wall collisions
      this.checkWallCollisions(level);

      // check for starting a roll
      if (inputState.down && this.groundSpeed !== 0) {
        this.state = PlayerState.Rolling;
      } else if (inputState.down) {
        this.state = PlayerState.Crouching;
      } else if (this.groundSpeed === 0) {
        this.state = PlayerState.Standing;
      }

      // handle camera boundaries

      // update position
      this.updatePosition();

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

    // sensors
    const {sensorA, sensorB, sensorE, sensorF} = this;
    const sensors = [sensorA, sensorB, sensorE, sensorF];
    const colors = ['#00ff00', '#00cc66', '#ff00ff', '#ff0000'];
    sensors.forEach((sensor, index) => {
      ctx.strokeStyle = colors[index];
      ctx.beginPath();
      ctx.moveTo(this.x, this.y);
      ctx.lineTo(sensor.x, sensor.y);
      ctx.stroke();
    });

    // facing
    ctx.fillStyle = 'red';
    ctx.fillText(this.facing ? '➡️' : '⬅️', this.x, this.y);

    // data
    ctx.fillStyle = 'white';
    ctx.fillText(`${this.groundSpeed} ${this.grounded ? 'true' : 'false'}`, this.x + 32, this.y - 50);
    ctx.fillText(this.rotationString, this.x + 32, this.y - 40);
    ctx.fillText(this.angle + '', this.x + 32, this.y - 30);
    ctx.fillText(this.stateString, this.x + 32, this.y - 20);
    ctx.fillText(this.spinrev + '', this.x + 32, this.y - 10);
  }
}

export default Player;