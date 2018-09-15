import React from 'react';
import opponent from '../opponent/opponent';
import '../stylesheets/Board.scss';
import successSVG from '../../assets/success.svg';
import failureSVG from '../../assets/failure.svg';

const generateInitialPints = () => {
  const pints = [];
  const number = Math.floor(Math.random() * (20 - 13) + 13);
  for (let i = 0; i < number; i++)
    pints.push({id: `pint-${i}`, full: true});
  return {number, pints};
};

export default class Board extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      pints: [],
      end: null,
      usersTurn: null
    };

    this.setupBoard = this.setupBoard.bind(this);
    this.drink = this.drink.bind(this);
  }

  componentDidMount()
  {
    this.setupBoard();
    this.Opponent = opponent(this);
  }

  setupBoard()
  {
    const pintsObj = generateInitialPints();

    this.total = pintsObj.number;
    this.empty = 0;

    this.setState({pints: pintsObj.pints,
      end: false,
      usersTurn: true});
  }

  drink(amount)
  {
    if(this.total < this.empty + amount)
      amount = this.total - this.empty;
    const {end, pints, usersTurn} = this.state;
    const temp = pints.concat();

    for(let i=0;i<amount;i++)
      temp.find(({full}) => full).full = false;

    this.empty += amount;

    const newState = {
      end: this.empty === this.total,
      pints: temp,
      usersTurn: !usersTurn
    }
    this.setState(newState);

    if(!newState.end && !newState.usersTurn)
      setTimeout(()=> this.Opponent.move(),500)
  }

  render() {
    const {usersTurn, pints, end} = this.state;
    const propWrapper = {
      disabled: !usersTurn,
      buttonHandler: this.drink
    }
    return (<React.Fragment>
      <div className="board">
        {pints.map((item)=><Pint {...item} />)}
      </div>
      <Panel {...propWrapper}/>
      {end?<GameOverView reset={this.setupBoard} userWon={!usersTurn}/>: null}
      <div className="rules">Try to drink the last pint!</div>
      <img style={{display: 'none'}} src={successSVG} />
      <img style={{display: 'none'}} src={failureSVG} />
    </React.Fragment>)
  }
}

const Panel = ({buttonHandler, ...props}) => {
  return (<div className="panel">
    <button {...props} onClick={() => buttonHandler(1)}>1</button>
    <button {...props} onClick={() => buttonHandler(2)}>2</button>
    <button {...props} onClick={() => buttonHandler(3)}>3</button>
  </div>)
};

const Pint = ({full}) => {

  return (<div className='pint-container'><div className={full ? 'pint full' : 'pint empty'} /><div className={full? 'pint-shadow': 'pint-shadow hide'} /></div>);
};

const GameOverView = ({userWon, reset}) => {
    const message = userWon?'You won': 'You\'ve lost';
    return (<div className='mask'>
      <div className='mask-container'>
        <div className='message-container'>
          <div className='message'><p>{message}</p></div>
          <img className='message-img' src={userWon ? successSVG : failureSVG} />
        </div>
        <button onClick={reset}>Play again</button>
      </div>
    </div>);
};