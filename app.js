const text = document.querySelector('.content-text');
const tryBtn = document.querySelector('.cta-btn');
let inputField = document.querySelector('.input-text');
let mistakes = document.querySelector('.content-list .content-list-item .mistakes');
let seconds = document.querySelector('.content-list .content-list-item .time');
let wpmTag = document.querySelector('.content-list .content-list-item .wpm');

const textArr = [];
let counter = 0;
let mistakeCounter = 0;
let timer;
let maxTime = 60;
let timeLeft = 60;
let isTyping = false;
let reload = false;



async function sendRequest() {
    const url = 'https://newsapi.org/v2/top-headlines?country=us&apiKey=4667ddb22d3849e0ad28d7e05c3a2c86';
    let response = await fetch(url);
    if (response.ok) { 
        let json = await response.json();
        return json;
      } 
      else {
        alert("HTTP-Error: " + response.status);
      }
}

async function getParagraph() {
    let newsPromise = await sendRequest();
    let randomNum = Math.floor(Math.random() * newsPromise.articles.length);
    let author = newsPromise.articles[randomNum].author;
    let title = newsPromise.articles[randomNum].title;
    let paragraph = newsPromise.articles[randomNum].description;
    let textNode = `${title} by ${author}: ${paragraph}`;
    return textNode;
}
async function initApp(reload) {
    if (reload) {
        text.textContent = "";
        timeLeft = 60;
        startCount();
        getParagraph().then(p => {
            paragraphToSpan(p); });
    }
    else {
        getParagraph().then(p => {
            paragraphToSpan(p);
            redirectEventsToInput();
        });
    }
}
function paragraphToSpan(p) {
    p.split('').forEach(char => {
        textArr.push(char);
        text.innerHTML += `<span>${char}</span>`
    });
}

function redirectEventsToInput()
{
    document.addEventListener('keydown', () => inputField.focus());
    text.addEventListener('click', () => inputField.focus());
}

function startCount() {
    if (timeLeft > 0) {
        timeLeft--;
        seconds.textContent = timeLeft;
    }
    else {
        clearInterval(timer);
    }
}

function initComparision() {
    const charEl = text.querySelectorAll('span');
    const inputChar = inputField.value.split('');
    if (timeLeft > 0 && counter < charEl.length - 1) {
        if (!isTyping) {
            timer = setInterval(startCount, 1000);
            isTyping = true;
        }
        if (inputChar[counter] == null) {
            counter --;
            if ( charEl[counter].classList.contains('failure')) {
                mistakeCounter--;
            }
            charEl[counter].classList.remove('success', 'failure');
        }
        else {
            if (inputChar[counter] === charEl[counter].textContent) {
                charEl[counter].classList.add('success');
                console.log('success');
            }
            else {
                charEl[counter].classList.add('failure');
                console.log('mistaked made, character was ', charEl[counter].textContent);
                mistakeCounter ++;
            }
            counter++;
        }
        charEl.forEach(span => span.classList.remove('active')); 
        charEl[counter].classList.add('active');
        mistakes.textContent = mistakeCounter;
        let wpm =  Math.round((((counter -  mistakeCounter) / 5) / (maxTime - timeLeft)) * 60);
        wpm = wpm < 0 || !wpm || wpm === Infinity ? 0 : wpm;
        console.log(wpm);
        wpmTag.textContent = wpm;
    }
    else {
        clearInterval(timer);
        console.log(timer, 'timer is now resetted');
    }
};

inputField.addEventListener('input', initComparision)
tryBtn.addEventListener('click', () => {
    reload = true;
    initApp(reload);
});

initApp(reload);
