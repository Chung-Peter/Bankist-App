'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

/////////////////////////////////////////////////
// Data

// DIFFERENT DATA! Contains movement dates, currency and locale

const account1 = {
  owner: 'Peter Chung',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  // movementsDates: [
  //   '2019-11-18T21:31:17.178Z',
  //   '2019-12-23T07:42:02.383Z',
  //   '2020-01-28T09:15:04.904Z',
  //   '2020-04-01T10:17:24.185Z',
  //   '2020-05-08T14:11:59.604Z',
  //   '2020-05-27T17:01:17.194Z',
  //   '2020-07-11T23:36:17.929Z',
  //   '2020-07-12T10:51:36.790Z',
  // ],
  movementsDates: [
    '2019-12-22T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2021-12-16T09:15:04.904Z',
    '2021-12-17T10:17:24.185Z',
    '2021-12-18T14:11:59.604Z',
    '2021-12-21T17:01:17.194Z',
    '2021-12-22T23:36:17.929Z',
    '2021-12-24T10:51:36.790Z',
  ],
  currency: 'USD',
  locale: 'en-US', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT',
};

const account3 = {
  owner: 'Remy Gracie',
  movements: [
    20000, 45598.23, 306789.5, 25000, 64254.21, 133123.9, 79875.97, 521300,
  ],
  interestRate: 1.2, // %
  pin: 3333,

  // movementsDates: [
  //   '2019-11-18T21:31:17.178Z',
  //   '2019-12-23T07:42:02.383Z',
  //   '2020-01-28T09:15:04.904Z',
  //   '2020-04-01T10:17:24.185Z',
  //   '2020-05-08T14:11:59.604Z',
  //   '2020-05-27T17:01:17.194Z',
  //   '2020-07-11T23:36:17.929Z',
  //   '2020-07-12T10:51:36.790Z',
  // ],
  movementsDates: [
    '2019-12-22T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2021-12-16T09:15:04.904Z',
    '2021-12-17T10:17:24.185Z',
    '2021-12-18T14:11:59.604Z',
    '2021-12-21T17:01:17.194Z',
    '2021-12-22T23:36:17.929Z',
    '2021-12-24T10:51:36.790Z',
  ],
  currency: 'KRW',
  locale: 'ko-kr', // de-DE
};

const accounts = [account1, account2, account3];

/////////////////////////////////////////////////
// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

/////////////////////////////////////////////////
// Functions
const capitalizeWord = word => word.replace(word[0], word[0].toUpperCase());

const authenticateUser = function (username, pin) {
  return accounts.find(
    account =>
      account.username === username.toLowerCase() && account.pin === +pin
  );
};

function logout() {
  containerApp.style.opacity = 0;
  labelWelcome.textContent = 'Log in to get started';
  console.log('You have been logged out.');
}

const daysBetween = (date1, date2) =>
  Math.round((date2 - date1) / (1000 * 60 * 60 * 24));

const formatMovDate = function (movDate, locale) {
  const daysSinceMov = daysBetween(movDate, new Date());
  // console.log(daysSinceMov);
  return daysSinceMov === 0
    ? `Today`
    : daysSinceMov === 1
    ? `Yesterday`
    : daysSinceMov <= 7
    ? `${daysSinceMov} days ago`
    : // : `${(movDate.getMonth() + 1).toString().padStart(2, 0)}/${movDate
      //     .getDate()
      //     .toString()
      //     .padStart(2, 0)}/${movDate.getFullYear()}`;
      new Intl.DateTimeFormat(locale).format(movDate);
};

const formatCurrency = (amt, locale, currency) =>
  new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
  }).format(amt);

const displayMovements = function (account, sort = false) {
  containerMovements.innerHTML = ''; // Clear existing data in containerMovements

  const movementsDisplay = sort
    ? account.movements.slice().sort((a, b) => a - b)
    : account.movements;
  // console.log(movementsDisplay);

  movementsDisplay.forEach(function (mov, i) {
    const movType = mov > 0 ? 'deposit' : 'withdrawal';
    const movDate = new Date(account.movementsDates[i]);
    const html = `
      <div class="movements__row">
          <div class="movements__type movements__type--${movType}">${
      i + 1
    } ${movType}</div>
          <div class="movements__date">${formatMovDate(
            movDate,
            account.locale
          )}</div>
          <div class="movements__value">${formatCurrency(
            mov,
            account.locale,
            account.currency
          )}</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};
// displayMovements(account1.movements);

const displaySummary = function (deposits, withdrawals, interest, account) {
  // labelSumIn.textContent = `${deposits.toFixed(2)}€`;
  // labelSumOut.textContent = `${Math.abs(withdrawals.toFixed(2))}€`;
  // labelSumInterest.textContent = `${interest.toFixed(2)}€`;
  labelSumIn.textContent = formatCurrency(
    deposits,
    account.locale,
    account.currency
  );
  labelSumOut.textContent = formatCurrency(
    Math.abs(withdrawals),
    account.locale,
    account.currency
  );
  labelSumInterest.textContent = formatCurrency(
    interest,
    account.locale,
    account.currency
  );
};

const calcSummary = function (account) {
  const deposits = account.movements
    .filter(mov => mov > 0)
    .reduce((sum, mov) => sum + mov);
  const withdrawals = account.movements
    .filter(mov => mov < 0)
    .reduce((sum, mov) => sum + mov, 0); // need to start at zero in case there have been no withdrawals
  const interest = (deposits * account.interestRate) / 100;
  // console.log(deposits, withdrawals);
  displaySummary(deposits, withdrawals, interest, account);
};
// calcSummary(account1);

const displayBalance = function (account) {
  // labelBalance.textContent = `${account.balance.toFixed(2)}€`;
  labelBalance.textContent = formatCurrency(
    account.balance,
    account.locale,
    account.currency
  );
};

const calcBalance = function (account) {
  account.balance = account.movements.reduce((bal, mov) => bal + mov);
  displayBalance(account);
  return account.balance;
};
// console.log(`${account1.owner}'s Balance: ${calcBalance(account1)}€`);
// calcBalance(account1);

// LOGOUT TIMER
let logoutTimer;
let intervalLogout;
// const timeoutInMs = 10 * 60 * 1000;
const timeoutInSec = 10 * 60;

function displayLogoutTimer() {
  // const min = Math.floor(logoutTimer / 60000)
  const min = String(Math.trunc(logoutTimer / 60)).padStart(2, 0);
  // const sec = Math.floor((logoutTimer - min * 60000) / 1000)
  const sec = String(logoutTimer % 60).padStart(2, 0);
  // console.log(min, sec);
  labelTimer.textContent = `${min}:${sec}`;
}

function updateLogoutTimer() {
  // console.log(logoutTimer);
  // logoutTimer -= 1000;
  logoutTimer--;

  // console.log(min, sec);
  displayLogoutTimer();

  if (logoutTimer <= 0) {
    clearInterval(intervalLogout);
    intervalLogout = null;
    logout();
  }
}

const updateUI = function () {
  const dateNowOptions = {
    hour: '2-digit',
    minute: '2-digit',
    // second: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    // weekday: 'long',
  };
  // const dateNowOptions = {
  //   dateStyle: 'full',
  //   timeStyle: 'short',
  // };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    dateNowOptions
  ).format(Date.now());

  displayMovements(currentAccount);
  calcSummary(currentAccount);
  calcBalance(currentAccount);
  if (intervalLogout) clearInterval(intervalLogout);
  logoutTimer = timeoutInSec;
  displayLogoutTimer(); // After resetting logoutTimer, display timer before first interval
  intervalLogout = setInterval(updateLogoutTimer, 1000);
};

const withdraw = (account, amt) => {
  account.movements.push(-amt);
  account.movementsDates.push(new Date());
};

const deposit = (account, amt) => {
  account.movements.push(amt);
  account.movementsDates.push(new Date());
};

const transfer = (fromAcct, toAcct, amt) => {
  if (amt > 0 && fromAcct.balance >= amt) {
    withdraw(fromAcct, amt);
    deposit(toAcct, amt);
    updateUI();
    console.log(
      `Transferred ${formatCurrency(
        amt,
        fromAcct.locale,
        fromAcct.currency
      )} from ${fromAcct.owner} to ${toAcct.owner}`
    );
    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
    return amt;
  } else if (amt <= 0) console.log(`Amount must be > 0€`);
  else console.log(`Insufficient Funds`);
};

// CREATE USERNAMES

// const user = 'Steven Thomas Williams'; // stw
// const username = user
//   .toLowerCase()
//   .split(' ')
//   .map(name => name[0]) // .map(name => name.slice(0, 1))
//   .join('');
// console.log(user);
// console.log(username);

const createUsernames = function (accounts) {
  // console.log(accounts);
  // const usernames = [];
  accounts.forEach(function (user) {
    // console.log(user.owner);
    user.username = user.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0]) // .map(name => name.slice(0, 1))
      .join('');
  });
  // return usernames;
};
// OR with arrow function:
// const createUsernamesArrow = user =>
//   user
//     .toLowerCase()
//     .split(' ')
//     .map(name => name[0]) // .map(name => name.slice(0, 1))
//     .join('');

createUsernames(accounts);
// console.log(accounts);

// EVENT HANDLERS
let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault(); // Prevents form from submitting

  // Check credentials
  // const username = inputLoginUsername.value.toLowerCase();
  // const pin = parseInt(inputLoginPin.value);
  // console.log(`LOGIN: ${username} ${pin}`);
  // console.log(accounts);
  // currentAccount = accounts.find(
  //   account =>
  //     account.username === inputLoginUsername.value.toLowerCase() &&
  //     account.pin === parseInt(inputLoginPin.value)
  // );
  currentAccount = authenticateUser(
    inputLoginUsername.value,
    inputLoginPin.value
  );

  // currentAccount = authenticateUser('js', 1111); // auto login
  // currentAccount = authenticateUser('jd', 2222); // auto login

  // console.log(currentAccount);
  if (currentAccount) {
    // Clear input fields
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginUsername.blur();
    inputLoginPin.blur();

    // timeOfDay
    const timeOfDay = new Intl.DateTimeFormat('en-US', {
      dayPeriod: 'long',
    }).format(new Date());
    const greeting = `Good ${
      timeOfDay.startsWith('in the ')
        ? capitalizeWord(timeOfDay.slice(7))
        : 'Day'
    }`;

    labelWelcome.textContent = `${greeting}, ${
      currentAccount.owner.split(' ')[0]
    }!`;

    // calcBalance(currentAccount);
    // calcSummary(currentAccount);
    // displayMovements(currentAccount.movements);
    updateUI();
    containerApp.style.opacity = '100';
    console.log(`Welcome, ${currentAccount.owner}!`);
  } else console.log(`LOGIN FAILED! TRY AGAIN`);
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = +inputTransferAmount.value;
  // console.log(`amount typeof: ${typeof amount}`);
  const transferTo = accounts.find(
    acc => acc.username === inputTransferTo.value
  );
  if (transferTo) {
    if (transferTo === currentAccount) {
      console.log(`Cannot transfer money to self.`);
    } else {
      // console.log(amount, transferTo);
      transfer(currentAccount, transferTo, amount);
    }
  } else console.log(`Account ${inputTransferTo.value} does not exist`);
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();
  const loanAmt = Math.floor(inputLoanAmount.value);
  if (
    loanAmt > 0 &&
    currentAccount.movements.some(mov => mov >= loanAmt * 0.1)
  ) {
    setTimeout(function () {
      deposit(currentAccount, loanAmt);
      updateUI();
      console.log(
        `Meets loan requirements. Loan for ${formatCurrency(
          loanAmt,
          currentAccount.locale,
          currentAccount.currency
        )} granted.`
      );
    }, 2500);
  } else console.log(`Loan denied`);

  // Clear input field
  inputLoanAmount.value = '';
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  const accountToClose = authenticateUser(
    inputCloseUsername.value,
    inputClosePin.value
  );
  if (accountToClose?.username === currentAccount.username) {
    // console.log(accounts);
    // console.log(accountToClose);
    if (confirm('Are you sure you want to delete your account?')) {
      accounts.splice(
        accounts.findIndex(account => account === accountToClose),
        1
      );
      // hide UI
      logout();
      console.log(
        `Your account has been closed. Your balance will be sent to you in the mail.`
      );
    } else
      console.log(
        `Close account cancelled. Thanks for staying with us, ${
          currentAccount.owner.split(' ')[0]
        }!`
      );

    // clear input box values
    inputCloseUsername.value = inputClosePin.value = '';
    inputCloseUsername.blur();
    inputClosePin.blur();
  } else console.log(`Invalid credentials`);
});

let sortMovement = false;
btnSort.addEventListener('click', function (e) {
  sortMovement = !sortMovement;
  displayMovements(currentAccount, sortMovement);
  // console.log(`sortMovement = ${sortMovement}`);
});

const randomInt = (min, max) =>
  Math.trunc(Math.random() * (max - min + 1)) + min;
// for (let i = 0; i < 20; i++) console.log(randomInt(1, 6));

/*
///////////////////////////////////////
// Working with BigInt
console.log(2 ** 53 - 1); // 9007199254740996 : Numbers in javascript or stored as a 64 bit binary number but only 53 bits store the actual number. So this is the largest integer that can safely be represented in JS
console.log(Number.MAX_SAFE_INTEGER);
console.log(2 ** 53 + 1);
console.log(2 ** 53 + 2);
console.log(2 ** 53 + 3);
console.log(2 ** 53 + 4);

console.log(4838430248342043823408394839483204n);
console.log(BigInt(48384302));

// Operations
console.log(10000n + 10000n);
console.log(36286372637263726376237263726372632n * 10000000n);
// console.log(Math.sqrt(16n));

const huge = 20289830237283728378237n;
const num = 23;
console.log(huge * BigInt(num));

// Exceptions
console.log(20n > 15);
console.log(20n === 20);
console.log(typeof 20n);
console.log(20n == '20');

console.log(huge + ' is REALLY big!!!');

// Divisions
console.log(11n / 3n);
console.log(10 / 3);
*/

/*
///////////////////////////////////////
// Numeric Separators

// 287,460,000,000
const diameter = 287_460_000_000; // JavaScript ignores the underscores to make numbers easier to read for us humans.
console.log(diameter); // 287460000000

const price = 345_99; // 34599
console.log(price);

const transferFee1 = 15_00;
const transferFee2 = 1_500;

const PI = 3.1415;
console.log(PI);

console.log(Number('230_000')); // NaN : Can't convert strings with underscores to numbers
console.log(parseInt('230_000')); // 230 : parseInt ignores anything after the underscore
*/

/*
///////////////////////////////////////
// The Remainder Operator
console.log(5 % 2); // 1
console.log(5 / 2); // 2.5

console.log(8 % 3); // 2
console.log(8 / 3); // 2.6666666666666665

console.log(6 % 2); // 0
console.log(6 / 2); // 3

console.log(7 % 2); // 1
console.log(7 / 2); // 3.5

const isEven = n => n % 2 === 0;
console.log(isEven(8)); // true
console.log(isEven(23)); // false
console.log(isEven(514)); // true

labelBalance.addEventListener('click', function () {
  [...document.querySelectorAll('.movements__row')].forEach(function (row, i) {
    // 0, 2, 4, 6
    if (i % 2 === 0) row.style.backgroundColor = 'orangered';
    // 0, 3, 6, 9
    if (i % 3 === 1) row.style.backgroundColor = 'blue';
  });
});
*/

/*
///////////////////////////////////////
// Math and Rounding
console.log(Math.sqrt(25)); // 5
console.log(25 ** (1 / 2)); // 5
console.log(8 ** (1 / 3)); // 2 : To do cube root

console.log(Math.max(5, 18, 23, 11, 2)); // 23
console.log(Math.max(5, 18, '23', 11, 2)); // 23 : converts strings to number
console.log(Math.max(5, 18, '23px', 11, 2)); // NaN : but doesn't parse numbers

console.log(Math.min(5, 18, 23, 11, 2)); // 2

console.log(Math.PI * Number.parseFloat('10px') ** 2); // 314.1592653589793

console.log(Math.trunc(Math.random() * 6) + 1); // random number between 1-6

// Rounding integers
console.log(Math.round(23.3)); // 23
console.log(Math.round(23.9)); // 24

console.log(Math.ceil(23.3)); // 24
console.log(Math.ceil(23.9)); // 24

console.log(Math.floor(23.3)); // 23
console.log(Math.floor('23.9')); // 23

console.log(Math.trunc(23.3)); // 23

console.log(Math.trunc(-23.3)); // -23
console.log(Math.floor(-23.3)); // -24

// Rounding decimals
console.log((2.7).toFixed(0)); // 3
console.log((2.7).toFixed(3)); // 2.700
console.log((2.345).toFixed(2)); // 2.35
console.log(+(2.345).toFixed(2)); // 2.35
*/

/*
///////////////////////////////////////
// Converting and Checking Numbers
console.log(23 === 23.0); // true

// Base 10 - 0 to 9. 1/10 = 0.1. 3/10 = 3.3333333
// Binary base 2 - 0 1
console.log(0.1 + 0.2); // 0.30000000000000004
console.log(0.1 + 0.2 === 0.3); // false

// Convert string to number
console.log(Number('23')); // 23
console.log(+'23'); // 23

// Parsing
console.log(Number.parseInt('30px', 10)); // 30
console.log(Number.parseInt('e23', 10)); // NaN. The string must start with a number

console.log(Number.parseInt('  2.5rem  ')); // 2
console.log(Number.parseFloat('  2.5rem  ')); // 2.5

// console.log(parseFloat('  2.5rem  '));

// Check if value is NaN
console.log(Number.isNaN(20)); // false
console.log(Number.isNaN('20')); // false
console.log(Number.isNaN(+'20X')); // true
console.log(Number.isNaN(23 / 0)); // false

// Checking if value is number
console.log(Number.isFinite(20)); // true
console.log(Number.isFinite('20')); // false
console.log(Number.isFinite(+'20X')); // false
console.log(Number.isFinite(23 / 0)); // false

console.log(Number.isInteger(23)); // true
console.log(Number.isInteger(23.0)); // true
console.log(Number.isInteger(23 / 0)); // false
*/
