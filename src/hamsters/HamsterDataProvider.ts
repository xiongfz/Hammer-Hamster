export enum HamsterStatus {
  Empty = 0,
  GettingUpOrDown = 1,
  Hamster = 2,
  Kicked = 3
}

export default class HamsterDataProvider {
  private static PARAMS: {times: number, minInterval: number, maxInterval: number, stayingTime: number}[] = [
    {
      times: 10,
      minInterval: 1500,
      maxInterval: 2000,
      stayingTime: 2000
    },
    {
      times: 8,
      minInterval: 800,
      maxInterval: 1500,
      stayingTime: 1500
    },
    {
      times: 10,
      minInterval: 600,
      maxInterval: 1200,
      stayingTime: 1200
    },
    {
      times: -1,
      minInterval: 400,
      maxInterval: 600,
      stayingTime: 1000
    }
  ];
  private static ANIMATION_TIME: number = 200; // millisecond
  private _paramIndex: number;
  private _paramTimes: number;

  private _hamsters: HamsterStatus[];
  private _width: number;
  private _height: number;
  private _interval: NodeJS.Timer;
  private _isActivated: boolean;
  private _listener: (() => void)[];

  constructor(width: number, height: number) {
    this._width = width;
    this._height = height;
    this._isActivated = false;
    this._hamsters = [];
    this._listener = [];

    for (let i: number = 0; i < width * height; ++i) {
      this._hamsters.push(HamsterStatus.Empty);
    }

    this._hamsterInterval = this._hamsterInterval.bind(this);
    this._setHamsterStatus = this._setHamsterStatus.bind(this);
  }

  public attachListener(listener: () => void): void {
    this._listener.push(listener);
  }

  public start(): void {
    this._start();
  }

  public stop(): void {
    this._stop();
  }

  public kickHamster(location: location): boolean {
    if (!this._isActivated) {
      return false;
    }

    const index: number = this._getIndexByPosition(location);

    if (
      this._hamsters[index] !== HamsterStatus.Empty &&
      this._hamsters[index] !== HamsterStatus.Kicked
    ) {
      this._setHamsterStatus(index, HamsterStatus.Kicked);
      setTimeout(() => {
        this._setHamsterStatus(index, HamsterStatus.Empty);
      }, 500);
      return true;
    } else {
      return false;
    }
  }

  public getHamster(location: location): number {
    return this._hamsters[this._getIndexByPosition(location)];
  }

  public get width(): number {
    return this._width;
  }

  public get height(): number {
    return this._height;
  }

  private _start(): void {
    this._isActivated = true;

    if (!this._interval) {
      this._paramIndex = 0;
      this._paramTimes = 0;
      this._interval = setInterval(this._hamsterInterval, HamsterDataProvider.PARAMS[0].maxInterval);
    }
  }

  private _stop(): void {
    this._isActivated = false;
    if (this._interval) {
      clearInterval(this._interval);
      this._interval = undefined;
    }
  }

  private _getIndexByPosition(location: location): number {
    return location.x * this.height + location.y;
  }

  private _getPositionByIndex(index: number): location {
    return {
      x: Math.floor(index / this.width),
      y: index - this.width * Math.floor(index / this.width)
    };
  }

  private _hamsterInterval(): void {
    this._addRandomHamster();
    this._paramTimes++;
    if (this._paramTimes === HamsterDataProvider.PARAMS[this._paramIndex].times) {
      this._paramIndex++;
      this._paramTimes = 0;
    }

    clearInterval(this._interval);

    const minInterval: number = HamsterDataProvider.PARAMS[this._paramIndex].minInterval;
    const maxInterval: number = HamsterDataProvider.PARAMS[this._paramIndex].maxInterval;
    this._interval = setInterval(
      this._hamsterInterval, Math.random() * (maxInterval - minInterval) + minInterval
    );
  }

  private _addRandomHamster(): boolean {
    const emptyHoles: number[] = this._hamsters
      .map((hamater: number, index: number) => hamater === 0 ? index : -index)
      .filter((indexValue: number) => indexValue >= 0);

    if (emptyHoles.length) {
      const randomIndex: number = emptyHoles[Math.floor(Math.random() * emptyHoles.length)];
      this._triggetHamsterAtIndex(randomIndex);
      return true;
    } else {
      return false;
    }
  }

  // @todo refactor to use promise.
  private _triggetHamsterAtIndex(index: number): void {
    this._setHamsterStatus(index, 1);
    setTimeout(() => {
      if (this._isKicked(index)) {
        return;
      }
      this._setHamsterStatus(index, 2);
      setTimeout(() => {
        if (this._isKicked(index)) {
          return;
        }
        this._setHamsterStatus(index, 1);
        setTimeout(() => {
          if (this._isKicked(index)) {
            return;
          }
          this._setHamsterStatus(index, 0);
        }, HamsterDataProvider.ANIMATION_TIME);
      }, HamsterDataProvider.PARAMS[this._paramIndex].stayingTime - HamsterDataProvider.ANIMATION_TIME);
    }, HamsterDataProvider.ANIMATION_TIME);
  }

  private _setHamsterStatus(index: number, status: HamsterStatus): void {
    this._hamsters[index] = status;
    this._listener.forEach((listener: () => void) => {
      listener();
    });
  }

  private _isKicked(index: number): boolean {
    return this._hamsters[index] === HamsterStatus.Empty || this._hamsters[index] === HamsterStatus.Kicked;
  }
}