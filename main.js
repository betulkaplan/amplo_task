// alert('js loaded!')
// this is a basic structure for evaluation of a single choice exercise
// INTENTIONALLY parts of the code have been deleted.
//  It should serve as a hint towards finding a suitable solution for single choice exercise
// Written by GSoosalu ndr3svt

// GAPI Connection
const API_KEY = "AIzaSyDQNwROozFi8edyHduP79ZLnoMS6rWLy8E";
const DISCOVERY_DOCS = [
  "https://sheets.googleapis.com/$discovery/rest?version=v4",
];
const SCOPES = "https://www.googleapis.com/auth/spreadsheets.readonly";
// GAPI Connection

// Global variables
let options = ["this", "this not", "this either"];
let correct_answer_index = 0;
let currentQuestion;
let selectedOption = null;
let questions = [];
let nextQuestion;

// DOM elements
let proceedButton;
let evalButton;
let evalMsg;

async function myEvaluation() {
  if (selectedOption === null) {
    alert("Please select an option!");
    return;
  }
  proceedButton.style.display = "block";
  evalButton.style.display = "none";

  // Getting the previous question's answer
  const correctAnswerIndex = await getExerciseData(
    "A" + currentQuestion.raw,
    "F" + currentQuestion.raw,
    "single"
  );

  if (selectedOption == correctAnswerIndex) {
    evalMsg.innerHTML = "Correct!";
    evalMsg.style.color = "green";
    console.log("correct answer");
  } else {
    evalMsg.innerHTML = "Wrong!";
    evalMsg.style.color = "red";
    console.log("wrong answer");
  }

  // Getting the next question
  nextQuestion = nextRandomQuestion();
  currentQuestion = nextQuestion;
  if (nextQuestion === "no more questions") {
    return alert("no more questions");
  }
}

function proceed() {
  evalMsg.innerHTML = "";
  proceedButton.style.display = "none";
  evalButton.style.display = "block";
  // Updating the question statement
  let questionStamentContainer = document.querySelector(".question");
  questionStamentContainer.innerHTML = nextQuestion.statement;
  let optionsContainer = document.querySelector("#options-wrapper");
  optionsContainer.innerHTML = "";
  for (let i = 0; i < nextQuestion.options.length; i++) {
    optionsContainer.innerHTML +=
      `<div onClick={selectOption(${i})} id="opt-${i}" class='unchosen option'><p class='text'>` +
      nextQuestion.options[i] +
      "</p></div>";
  }
}

// GAPI Connection
function handleClientLoad() {
  proceedButton = document.getElementById("proceed-btn");
  evalButton = document.getElementById("eval-btn");
  evalMsg = document.getElementById("eval-msg");
  proceedButton.style.display = "none";
  proceedButton.addEventListener("click", proceed);
  gapi.load("client", initClient);
}

function initClient() {
  gapi.client
    .init({
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS,
    })
    .then(
      function () {
        getExerciseData("A2", "D10", false);
      },
      function (error) {
        console.log(JSON.stringify(error, null, 2));
      }
    );
}

async function getExerciseData(start, end, single) {
  const response = await gapi.client.sheets.spreadsheets.values.get({
    spreadsheetId: "1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc",
    range: `Learning!${start}:${end}`,
  });

  if (!single) {
    startTest(response.result.values);
  } else {
    correct_answer_index = parseInt(response.result.values[0][4]);
  }
  return correct_answer_index;
}

// My Code

function selectOption(index) {
  options = document.querySelectorAll(".option");
  options.forEach((option) => {
    option.classList.remove("choosen");
    option.classList.add("unchosen");
  });
  selected = document.getElementById(`opt-${index}`);
  selected.classList.add("choosen");
  selected.classList.remove("unchosen");
  selectedOption = index;
}

function startTest(data) {
  // Decorating the data
  questions = data.map((question, index) => {
    const topic = question[0];
    const statement = question[2];
    const options = question[3].split(";");
    const raw = index + 2;
    return {
      topic,
      statement,
      options,
      raw,
    };
  });

  let max = questions.length;
  let nextIndex = Math.floor(Math.random() * max);
  // currentQuestion = questions[nextIndex];
  currentQuestion = nextRandomQuestion();
  let questionStamentContainer = document.querySelector(".question");
  questionStamentContainer.innerHTML = currentQuestion.statement;
  let optionsContainer = document.querySelector("#options-wrapper");
  for (let i = 0; i < currentQuestion.options.length; i++) {
    optionsContainer.innerHTML +=
      `<div onClick={selectOption(${i})} id="opt-${i}" class='unchosen option'><p class='text'>` +
      currentQuestion.options[i] +
      "</p></div>";
  }
}

function nextRandomQuestion() {
  if (questions.length > 0) {
    let max = questions.length;
    let nextIndex = Math.floor(Math.random() * max);
    let nextQuestion = questions[nextIndex];
    questions.splice(nextIndex, 1);
    return nextQuestion;
  }
  selectedOption = null;
  return "no more questions";
}
