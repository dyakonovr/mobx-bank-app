import classes from './AuthScreen.module.css'
import authStore from '../../store/authStore';
import { observer } from 'mobx-react-lite';
import screenStatus from '../../store/screenStatus';
import { useEffect } from 'react';
import Popup from '../UI/Popup/Popup';
import popupStore from '../../store/popupStore';


const AuthScreen = observer(() => {

  // Обрабатываю нажатие на клавиатуру
  useEffect(() => {
    function handleKeybordPress(e) {
      if (Number(e.key) >= 0 && Number(e.key) <= 9) { // Если мы нажали на цифру
        colorButtonByKeyboard(e.key);
        handleNumberClick(e.key);
      }
      if (e.key === "Backspace") { // Если мы нажали Backspace
        colorButtonByKeyboard(e.key);
        authStore.eraseLastNumber();
      }
    }
    document.addEventListener('keyup', handleKeybordPress);

    // При окончании авторизации - "открутить" слушатель
    return function () {
      document.removeEventListener('keyup', handleKeybordPress);
    }
  });
  // Обрабатываю нажатие на клавиатуру END


  // Функции

  function colorButtonByKeyboard(value) {
    const selector = `.${classes.number}[data-value="${value}"]`;
    const currentBtn = document.querySelector(selector);

    // Эмулирую hover-эффект для кнопки
    currentBtn.classList.add("auth-btn-active");
    setTimeout(() => {
      currentBtn.classList.remove("auth-btn-active");
    }, 175);
  }

  function handleNumberClick(value) {
    authStore.enterPinCode(value); // Передаю число, к-ое нажал пользователь в state

    const currentInputCode = authStore.values.currentInput;

    if (currentInputCode.length === 4) { // Если в текущем вводе 4 цифры
      const userCode = authStore.values.code;
      if (currentInputCode === userCode) {
        authStore.setAuthIsDone(true); // Устанавливаю флаг, что авторизация пройдена успешно
        screenStatus.setCurrentScreen("loading");
      }
      else {
        authStore.resetCurrentInput(); // Сбрасываю текущий ввод
        popupStore.togglePopup();
      }
    }
  }

  function createNumberList() {
    let numbersList = [];

    for (let i = 1; i < 11; i++) {
      numbersList.push(
        <li
          className={[classes.number, "main-hover-animation"].join(' ')}
          onClick={(e) => { handleNumberClick(e.target.dataset.value) }}
          data-value={i <= 9 ? i : 0} key={i}>
          {i <= 9 ? i : 0}
        </li>
      )
    }

    // Добавляю кнопку "Стереть"
    numbersList.push(
      <li
        className={[classes.number, "main-hover-animation"].join(' ')}
        onClick={() => { authStore.eraseLastNumber() }}
        data-value="Backspace"
        key={11}
      >
        &lArr;
      </li>
    );

    return numbersList;
  }

  // Функции END

  return (
    <div className={['full-screen-block', classes.auth_screen].join(' ')}>
      <div className={classes.wrapper}>
        <strong className={classes.title}>Введите PIN-код</strong>
        <ul className={classes.dots}>
          {/* Если в текущем вводе введено n-цифр, то закрашиваем точку */}
          <li className={authStore.values.currentInput.length >= 1 ? [classes.dot, classes.dot_active].join(' ') : classes.dot}></li>
          <li className={authStore.values.currentInput.length >= 2 ? [classes.dot, classes.dot_active].join(' ') : classes.dot}></li>
          <li className={authStore.values.currentInput.length >= 3 ? [classes.dot, classes.dot_active].join(' ') : classes.dot}></li>
          <li className={authStore.values.currentInput.length >= 4 ? [classes.dot, classes.dot_active].join(' ') : classes.dot}></li>
        </ul>
        <ul className={classes.numbers}>
          {createNumberList()}
        </ul>
      </div>
      {popupStore.data.isOpen && <Popup />}
    </div>
  );
})

export default AuthScreen;