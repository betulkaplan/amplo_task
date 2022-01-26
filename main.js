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

let options = ["this", "this not", "this either"];
let states = [false, false, false];
let correct_answer_index = 0;
let currentQuestion;

document.addEventListener("DOMContentLoaded", init);

function init() {
  // let optionsContainer = document.querySelector("#options-wrapper");
  // for (let i = 0; i < options.length; i++) {
  //   optionsContainer.innerHTML +=
  //     "<div class='unchosen option'><p class='text'>" +
  //     options[i] +
  //     "</p></div>";
  // }
  // ...
}

function toggleChoice(i) {
  states[i] = true;
  // ...
}

function myEvaluation() {
  const correctAnswerIndex = getExerciseData(
    "A" + currentQuestion.raw,
    "F" + currentQuestion.raw,
    "single"
  );
  debugger;
  const correctAnswer = currentQuestion.options[correctAnswerIndex];
  console.log("correct answer is:", correctAnswer);

  let evMessage = document.querySelector("#evaluation-message");
  const nextQuestion = nextRandomQuestion();
  currentQuestion = nextQuestion;
  if (nextQuestion === "no more questions") {
    return alert("no more questions");
  }

  let questionStamentContainer = document.querySelector(".question");
  questionStamentContainer.innerHTML = nextQuestion.statement;
  let optionsContainer = document.querySelector("#options-wrapper");
  optionsContainer.innerHTML = "";
  for (let i = 0; i < nextQuestion.options.length; i++) {
    optionsContainer.innerHTML +=
      "<div class='unchosen option'><p class='text'>" +
      nextQuestion.options[i] +
      "</p></div>";
  }
  for (let i = 0; i < nextQuestion.options.length; i++) {
    if (states[i] && i == correct_answer_index) {
      evMessage.innerHTML = "<p>Awesome!</p>";
      // console.log('awesome')
      break;
    } else {
      evMessage.innerHTML = "<p>Keep trying!</p>";
      // console.log('tryAgain')
      break;
    }
  }
}

// GAPI Connection
function handleClientLoad() {
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

function getExerciseData(start, end, single) {
  gapi.client.sheets.spreadsheets.values
    .get({
      spreadsheetId: "1hzA42BEzt2lPvOAePP6RLLRZKggbg0RWuxSaEwd5xLc",
      range: `Learning!${start}:${end}`,
    })
    .then(
      function (response) {
        // console.log(response);
        // console.log("our data here --->", response.result.values);
        if (!single) {
          startTest(response.result.values);
        } else {
          console.log("single data retrieved");
          console.log(response.result.values[0]);
          correct_answer_index = parseInt(response.result.values[0][4]);
        }
      },
      function (response) {
        console.log("Error: " + response.result.error.message);
      }
    );

  return correct_answer_index;
}

// My Code
let questions = [];
function startTest(data) {
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
    // console.log("each question", question);
  });

  /*****test****/
  currentQuestion = questions[0];
  let questionStamentContainer = document.querySelector(".question");
  questionStamentContainer.innerHTML = questions[0].statement;
  let optionsContainer = document.querySelector("#options-wrapper");
  for (let i = 0; i < questions[0].options.length; i++) {
    optionsContainer.innerHTML +=
      "<div class='unchosen option'><p class='text'>" +
      questions[0].options[i] +
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
  return "no more questions";
}
