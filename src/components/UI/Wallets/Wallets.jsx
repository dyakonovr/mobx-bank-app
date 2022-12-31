import { useRef } from 'react';
import userData from '../../../store/userData';
import Wallet from '../Wallet/Wallet';
import classes from './Wallets.module.css'

function Wallets() {
  const walletsListRef = useRef(null);

  // Функции

  function createWalletsList() {
    let walletsList = [];
    const walletsObj = userData.values.wallets;

    for (let currentCurrencyObj of walletsObj) {
      walletsList.push(
        <Wallet obj={currentCurrencyObj} key={Math.random()} />
      );
    }

    return walletsList;
  }

  // Функции END


  return (
    <div className={classes.wrapper} ref={walletsListRef}>
      <strong className={classes.title}>Кошельки</strong>
      <ul className={classes.list}>
        {createWalletsList()}
      </ul>
    </div>
  );
};

export default Wallets;