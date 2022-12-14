import userData from '../../store/userData';
import CustomSelect from '../UI/CustomSelect/CustomSelect';
import classes from './ConversionScreen.module.css'
import { getLastNumbers } from '../../functions/getLastNumbers';
import CustomInput from '../UI/CustomInput/CustomInput';
import { useRef } from 'react';
import popupStore from '../../store/popupStore';
import Popup from '../UI/Popup/Popup';
import { observer } from 'mobx-react-lite';

function ConversionScreen() {
  const fromCardRef = useRef(null); // Ссылка на первый <select> для карты, с к-ой переводят
  const toCardRef = useRef(null); // Ссылка на второй <select> для карты, на к-ую переводят
  const inputRef = useRef(null); // Ссылка на <input /> с вводом суммы перевода
  const transferBtnRef = useRef(null); // Кнопка, "обрабатывающая" перевод

  // Функции
  function createOptionsValues(defaultValue, optionsValues) { // Создаю конечный массив со значениями ВСЕХ <option>
    return { defaultValue, optionsValues };
  }

  function createOptionsArray() { // Создаю массив со значениями <option>, кроме первого (дефолтного)
    const walletsData = userData.values.wallets; // Получаю данные о кошельках
    const array = [];

    for (let cardNumber in walletsData) {
      const currentWallet = walletsData[cardNumber];

      const obj = {
        text: `Счёт *${getLastNumbers(cardNumber, 4)}: ${currentWallet.value} ${currentWallet.name.toUpperCase()}`,
        card: cardNumber
      }
      array.push(obj);
    }

    return array;
  }

  function handleButtonClick() {
    // Получаю номера карт
    const fromCard = fromCardRef.current.dataset.card;
    const toCard = toCardRef.current.dataset.card;

    if (fromCard === toCard) {
      popupStore.setNewMessage("Вы выбрали одну и ту же карту.");
      popupStore.togglePopup();
    }

    else if (fromCard && toCard) { // Если мы получили номера обоих счетов
      const fromCardBalance = userData.getBalance(fromCard);
      const inputValue = Number(inputRef.current.value); // Кол-во средств, к-ое ввел пользователь

      if (inputValue > 0 && inputValue <= fromCardBalance) {
        userData.transferMoney(fromCard, toCard, inputValue);
        transferBtnRef.current.classList.add(classes.btn_disabled);
        transferBtnRef.current.dataset.disabled = "disabled";
      }

      else {
        popupStore.setNewMessage("Сумма перевода больше, чем есть средств на карте.");
        popupStore.togglePopup();
      }
    }

    else {
      popupStore.setNewMessage("Вы забыли выбрать карты для перевода средств.");
      popupStore.togglePopup()
    }
  }

  // Функции END

  const optionsArray = createOptionsArray();

  return (
    <>
      <div className={classes.wrapper}>
        <CustomSelect ref={fromCardRef} valuesArr={createOptionsValues('Откуда переводим:', optionsArray)} />
        <span className={classes.icon}>&dArr;</span>
        <CustomSelect ref={toCardRef} valuesArr={createOptionsValues('Куда переводим:', optionsArray)} />
        <CustomInput ref={inputRef} type={"text"} id={"value"} placeholder={"100.000"} labelText={"Сколько переводим?"} />
        <button ref={transferBtnRef} className={[classes.btn, "main-hover-animation"].join(' ')} onClick={handleButtonClick}>Перевести</button>
      </div>
      {popupStore.data.isOpen && <Popup />}
    </>
  );
};

export default observer(ConversionScreen);