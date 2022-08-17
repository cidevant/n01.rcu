/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */

function showScene(scene) {
  return fetch(
    `${window.location.protocol}//${window.location.host}/scene/${scene}?accessCode=TEST`
  ).then((resp) => resp.json());
}

function sendScore(score) {
  return new Promise((resolve, _reject) => {
    n01obs__controller.send({
      type: 'inputScore',
      value: score,
    });
  });
}

function calc_add(val) {
  const score = calc_getScore();
  const newVal = `${isNaN(score) ? '' : score}${val}`;
  const newValNumber = parseInt(newVal, 10);

  if (document.getElementById('score')) {
    document.getElementById('score').innerText = newValNumber;

    if (
      isNaN(newValNumber) ||
      newValNumber < 0 ||
      newValNumber > 180 ||
      !calc_leftScore_check(newValNumber)
    ) {
      calc_inputError();
    }
  }
}

function calc_leftScore_check(score) {
  const scoreLeft = document.getElementById('scoreLeft').innerText;

  if (scoreLeft != null && scoreLeft !== '' && scoreLeft !== '-') {
    return score <= parseInt(scoreLeft, 10);
  }

  return true;
}

function calc_delete() {
  const score = `${calc_getScore()}`;
  const newScore = score.slice(0, -1);

  if (document.getElementById('score') && (newScore === '' || parseInt(newScore, 10) >= 0)) {
    document.getElementById('score').innerText = newScore;
  }
}

function calc_enter() {
  const score = calc_getScore();

  if (!isNaN(score) && score >= 0 && score <= 180 && calc_leftScore_check(score)) {
    sendScore(`${score}`);
    document.getElementById('score').innerText = '';
  } else {
    calc_inputError();
  }
}

function calc_inputOk() {
  const element = document.getElementById('input_value_wrapper');

  if (element) {
    element.classList.add('ok');

    setTimeout(() => {
      element.classList.remove('ok');
    }, 100);
  }
}

function calc_inputError() {
  const element = document.getElementById('input_value_wrapper');

  if (element) {
    element.classList.add('error');

    setTimeout(() => {
      element.classList.remove('error');
    }, 100);
  }
}

function calc_getScore() {
  if (document.getElementById('score')) {
    return parseInt(document.getElementById('score').innerText, 10);
  }

  return NaN;
}

function getFinishDart(data) {
  const i18n = {
    finish_first: '1st DART',
    finish_second: '2nd DART',
    finish_third: '3rd DART',
  };
  const modal = document.getElementById('modal');
  const modalContent = document.getElementById('modal-text');

  modalContent.innerHTML = '';
  modal.style.display = 'block';

  const title = document.createElement('h1');

  title.innerText = 'FINISH DARTS';
  title.classList.add('modal-title');
  modalContent.appendChild(title);

  data['value'].forEach((out) => {
    const button = document.createElement('button');

    button.innerHTML = i18n[out] || `-${out}-`;
    button.classList.add('modal-option');
    button.onclick = function () {
      n01obs__controller.send({
        type: 'setFinishDart',
        value: out,
      });
      modal.style.display = 'none';
      modalContent.innerHTML = '';

      return false;
    };

    modalContent.appendChild(button);
  });
}

function setScoreLeft(data, ws) {
  document.getElementById('scoreLeft').innerText = data['value'];
}
