import * as React from 'react';
import { Fabric } from 'office-ui-fabric-react';
import HamsterDataProvider from '../hamsters/HamsterDataProvider';
import styles from './styles/HomePage.module.scss';

export interface IHomePageProps extends React.HTMLProps<HTMLElement> {

}

export interface IHomePageStates {
}

export default class HomePage extends React.Component<IHomePageProps, IHomePageStates> {
  private _hamsterStore: HamsterDataProvider;
  private _width: number;
  private _height: number;

  constructor(props: IHomePageProps) {
    super(props);

    this._width = 4;
    this._height = 4;
    this._hamsterStore = new HamsterDataProvider(this._width, this._height);
    this._hamsterStore.attachListener(() => {
      this.forceUpdate();
    });
  }

  public componentDidMount(): void {
    this._hamsterStore.start();
  }

  public render(): JSX.Element {
    const gamePane: JSX.Element[] = [];
    for (let x: number = 0; x < this._height; ++x) {
      const row: JSX.Element[] = [];
      for (let y: number = 0; y < this._width; ++y) {
        row.push(
          <div className={ styles.gameCell }>
            <button onMouseDown={ this._onItemClicked.bind(this, x, y) }>
              { this._hamsterStore.getHamster({x, y}) }
            </button>
          </div>
        );
      }
      gamePane.push(
        <div className={ styles.gameRow }>
          { row }
        </div>
      )
    }

    return (
      <Fabric>
        <div className={ styles.pageRoot }>
          <div className={ styles.gameWrapper }>
            { gamePane }
          </div>
        </div>
      </Fabric>
    );
  }
  
  private _onItemClicked(x: number, y: number): void {
    this._hamsterStore.kickHamster({ x, y });
  }
}