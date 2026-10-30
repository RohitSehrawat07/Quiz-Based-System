const subjectInfo = {
  math: { name: 'MATHS', emoji: '🔢' },
  english: { name: 'ENGLISH', emoji: '📚' },
  Evs: { name: 'Evs', emoji: '🌱' }
};

const staticQuestionBank = {
  math: {
    Nursery: [
      { q: 'What is 1 + 1?', o: ['1', '2', '3', '4'], a: 1, e: '1 + 1 = 2. Great counting!' },
      { q: 'Which number comes after 3?', o: ['2', '4', '5', '6'], a: 1, e: 'After 3 comes 4.' },
      { q: 'How many sides does a square have?', o: ['2', '3', '4', '5'], a: 2, e: 'A square has 4 sides.' }
    ],
    'Class 1': [
      { q: 'What is 2 + 3?', o: ['4', '5', '6', '7'], a: 1, e: '2 + 3 = 5. Count two, then three more!' },
      { q: 'Which number comes after 9?', o: ['8', '10', '11', '7'], a: 1, e: 'After 9 comes 10.' },
      { q: 'What is 4 + 4?', o: ['6', '7', '8', '9'], a: 2, e: '4 + 4 = 8.' }
    ],
    'Class 2': [
      { q: 'What is 10 − 4?', o: ['5', '7', '6', '4'], a: 2, e: '10 take away 4 leaves 6.' },
      { q: 'How many days are in a week?', o: ['5', '6', '7', '8'], a: 2, e: 'There are 7 days in a week.' },
      { q: 'Which shape is round?', o: ['Square', 'Triangle', 'Circle', 'Rectangle'], a: 2, e: 'A circle is round and has no corners.' }
    ],
    'Class 3': [
      { q: 'What is 5 + 2?', o: ['6', '7', '8', '9'], a: 1, e: '5 + 2 = 7.' },
      { q: 'How many fingers are on one hand?', o: ['4', '5', '6', '10'], a: 1, e: 'One hand usually has 5 fingers.' },
      { q: 'Which number is the biggest?', o: ['12', '8', '15', '10'], a: 2, e: '15 is bigger than 12, 8 and 10.' }
    ],
    'Class 4': [
      { q: 'What is 8 + 7?', o: ['14', '15', '16', '17'], a: 1, e: '8 + 7 = 15.' },
      { q: 'Which number is even?', o: ['3', '5', '8', '9'], a: 2, e: '8 is even because it can be paired.' },
      { q: 'How many sides does a triangle have?', o: ['2', '4', '3', '5'], a: 2, e: 'A triangle has 3 sides.' }
    ],
    'Class 5': [
      { q: 'What is 12 + 9?', o: ['20', '21', '22', '23'], a: 1, e: '12 + 9 = 21.' },
      { q: 'What is 18 − 7?', o: ['9', '10', '11', '12'], a: 2, e: '18 minus 7 is 11.' },
      { q: 'How many months are in a year?', o: ['10', '11', '12', '13'], a: 2, e: 'A year has 12 months.' }
    ]
  },
  english: {
    Nursery: [
      { q: 'Which word is a fruit?', o: ['Book', 'Apple', 'Chair', 'Sun'], a: 1, e: 'Apple is a fruit.' },
      { q: "What is the first letter of 'cat'?", o: ['A', 'C', 'M', 'T'], a: 1, e: 'The word cat begins with C.' },
      { q: 'Which word is a colour?', o: ['Happy', 'Blue', 'Jump', 'Table'], a: 1, e: 'Blue is the name of a colour.' }
    ],
    'Class 1': [
      { q: 'What is the opposite of hot?', o: ['Warm', 'Cold', 'Big', 'Fast'], a: 1, e: 'Cold is the opposite of hot.' },
      { q: 'Which one is an animal?', o: ['Tiger', 'Pencil', 'Chair', 'Cloud'], a: 0, e: 'A tiger is a wild animal.' },
      { q: 'Choose the correct spelling.', o: ['Applle', 'Aple', 'Apple', 'Appel'], a: 2, e: 'Apple is spelled A-P-P-L-E.' }
    ],
    'Class 2': [
      { q: 'What is the plural of cat?', o: ['Cats', 'Cates', 'Caties', 'Cating'], a: 0, e: 'We add s to make cat into cats.' },
      { q: 'Which word is an action?', o: ['Sleep', 'Pillow', 'Blue', 'Soft'], a: 0, e: 'Sleep is something you can do.' },
      { q: 'Fill in the blank: The sun ___ bright.', o: ['are', 'am', 'is', 'be'], a: 2, e: "We say, 'The sun is bright.'" }
    ],
    'Class 3': [
      { q: 'Which word rhymes with ball?', o: ['Bell', 'Tall', 'Bull', 'Book'], a: 1, e: 'Ball and tall rhyme because they have a similar ending sound.' },
      { q: 'What is the opposite of up?', o: ['Over', 'Down', 'Near', 'On'], a: 1, e: 'Down is the opposite of up.' },
      { q: 'Which one is a vowel?', o: ['B', 'T', 'A', 'G'], a: 2, e: 'A is one of the five main English vowels: A, E, I, O, U.' }
    ],
    'Class 4': [
      { q: 'Which word means the same as happy?', o: ['Sad', 'Joyful', 'Slow', 'Tiny'], a: 1, e: 'Joyful means happy.' },
      { q: 'Choose the sentence with correct punctuation.', o: ['where are you', 'Where are you?', 'where Are you', 'Where are you'], a: 1, e: 'A question needs a question mark.' },
      { q: 'What is the past tense of jump?', o: ['Jumped', 'Jumping', 'Jumps', 'Jumpt'], a: 0, e: 'Jumped is the past tense of jump.' }
    ],
    'Class 5': [
      { q: 'Which sentence is correct?', o: ['She go to school.', 'She goes to school.', 'She going to school.', 'She gone to school.'], a: 1, e: "We use 'goes' with she/he/it." },
      { q: 'What is the synonym of bright?', o: ['Dark', 'Shiny', 'Slow', 'Small'], a: 1, e: 'Shiny is a synonym for bright.' },
      { q: 'Which word is a noun?', o: ['Run', 'Jump', 'Table', 'Quickly'], a: 2, e: 'Table is a noun because it is a thing.' }
    ]
  },
  Evs: {
    Nursery: [
      { q: 'Which animal has wings?', o: ['Horse', 'Duck', 'Fish', 'Cat'], a: 1, e: 'A duck has wings and can fly.' },
      { q: 'What do we breathe in?', o: ['Water', 'Air', 'Sand', 'Rocks'], a: 1, e: 'We breathe in air to stay alive.' },
      { q: 'Which star gives Earth light and warmth?', o: ['The Moon', 'The Sun', 'Mars', 'Venus'], a: 1, e: 'The Sun gives Earth light and warmth.' }
    ],
    'Class 1': [
      { q: 'Which part of a plant is usually underground?', o: ['Flower', 'Leaf', 'Root', 'Fruit'], a: 2, e: 'Roots usually grow underground and take in water.' },
      { q: "Which animal says 'meow'?", o: ['Dog', 'Cow', 'Cat', 'Duck'], a: 2, e: 'Cats often say meow.' },
      { q: 'What do we use to smell?', o: ['Ears', 'Nose', 'Hands', 'Eyes'], a: 1, e: 'Our nose helps us smell.' }
    ],
    'Class 2': [
      { q: 'Which one lives in water?', o: ['Fish', 'Lion', 'Camel', 'Hen'], a: 0, e: 'Fish live in water.' },
      { q: 'What do plants need to grow?', o: ['Plastic', 'Sunlight', 'Toys', 'Shoes'], a: 1, e: 'Plants need sunlight, water and air to grow.' },
      { q: 'Which is a healthy drink?', o: ['Clean water', 'Paint', 'Soap', 'Ink'], a: 0, e: 'Clean water helps keep our bodies healthy.' }
    ],
    'Class 3': [
      { q: 'How many legs does a spider have?', o: ['6', '8', '4', '10'], a: 1, e: 'A spider has 8 legs.' },
      { q: 'Which body part helps you hear?', o: ['Eyes', 'Nose', 'Ears', 'Elbows'], a: 2, e: 'Our ears help us hear sounds.' },
      { q: 'What do bees help flowers do?', o: ['Sleep', 'Pollinate', 'Run', 'Swim'], a: 1, e: 'Bees carry pollen between flowers, helping many plants make seeds.' }
    ],
    'Class 4': [
      { q: 'What is the main source of heat and light for Earth?', o: ['Moon', 'Sun', 'Cloud', 'Star'], a: 1, e: 'The Sun is the main source of light and warmth.' },
      { q: 'Which part of the body pumps blood?', o: ['Brain', 'Heart', 'Lungs', 'Skin'], a: 1, e: 'The heart pumps blood around the body.' },
      { q: 'Which material floats in water?', o: ['Metal', 'Wood', 'Stone', 'Glass'], a: 1, e: 'Wood often floats because it is lighter than water.' }
    ],
    'Class 5': [
      { q: 'Which gas do plants take in from the air?', o: ['Oxygen', 'Carbon dioxide', 'Helium', 'Hydrogen'], a: 1, e: 'Plants use carbon dioxide during photosynthesis.' },
      { q: 'What do we call the process when water changes to vapour?', o: ['Freezing', 'Melting', 'Evaporation', 'Condensation'], a: 2, e: 'Evaporation is when water turns into vapour.' },
      { q: 'What helps our body grow and stay healthy?', o: ['Exercise', 'Sleep', 'Food', 'All of these'], a: 3, e: 'Food, sleep, and exercise all help our body stay healthy.' }
    ]
  }
};

let selected = 'math';
let questionBank = window.teacherAdmin.buildQuestionBank(staticQuestionBank);
let questions = [];
let index = 0;
let score = 0;
let answered = false;
let student = '';
let grade = '';

const $ = (id) => document.getElementById(id);

document.querySelectorAll('.subject').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.subject').forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    selected = button.dataset.subject;
  });
});

function show(id) {
  ['hero', 'setup', 'quiz', 'result'].forEach((section) => {
    $(section).classList.toggle('hidden', section !== id);
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion() {
  answered = false;
  const item = questions[index];

  $('questionCount').textContent = `QUESTION ${index + 1} OF ${questions.length}`;
  $('questionText').textContent = item.q;
  $('progress').style.width = `${(index / questions.length) * 100}%`;
  $('liveScore').textContent = score;
  $('feedback').className = 'feedback';
  $('feedback').textContent = '';
  $('nextBtn').disabled = true;
  $('nextBtn').textContent = index === questions.length - 1 ? 'See My Score 🏆' : 'Next ➜';
  $('answers').innerHTML = '';

  item.o.forEach((option, i) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span></span>`;
    button.children[1].textContent = option;
    button.addEventListener('click', () => chooseAnswer(i, button));
    $('answers').appendChild(button);
  });
}

function chooseAnswer(choice, button) {
  if (answered) return;
  answered = true;

  const item = questions[index];
  document.querySelectorAll('.answer').forEach((b, i) => {
    b.disabled = true;
    if (i === item.a) b.classList.add('correct');
  });

  const feedback = $('feedback');

  if (choice === item.a) {
    score += 1;
    feedback.textContent = `🎉 Great job! ${item.e}`;
    feedback.className = 'feedback show good';
  } else {
    button.classList.add('wrong');
    feedback.textContent = `💡 Good try! ${item.e}`;
    feedback.className = 'feedback show bad';
  }

  $('liveScore').textContent = score;
  $('nextBtn').disabled = false;
  $('progress').style.width = `${((index + 1) / questions.length) * 100}%`;
}

function finishQuiz() {
  show('result');
  const percent = Math.round((score / questions.length) * 100);
  $('finalScore').textContent = `${score}/${questions.length}`;
  $('resultEmoji').textContent = percent === 100 ? '🏆' : percent >= 70 ? '🌟' : percent >= 40 ? '😊' : '🌱';
  $('resultTitle').textContent = percent === 100 ? `Perfect score, ${student}!` : percent >= 70 ? `Amazing work, ${student}!` : percent >= 40 ? `Well done, ${student}!` : `Keep growing, ${student}!`;
  $('resultText').textContent = `You finished the ${subjectInfo[selected].name.toLowerCase()} quiz for ${grade}.`;
  $('resultMessage').textContent = percent >= 70 ? 'You are doing a fantastic job. Keep being curious!' : 'Every question helps you learn. Try again and see how much you can improve!';
}

$('startBtn').addEventListener('click', () => {
  student = $('studentName').value.trim() || 'Little Learner';
  grade = $('grade').value;
  questions = [...(questionBank[selected][grade] || questionBank[selected]['Class 1'])];
  index = 0;
  score = 0;

  $('studentLabel').textContent = `${student} • ${grade}`;
  $('subjectLabel').textContent = `${subjectInfo[selected].emoji} ${subjectInfo[selected].name}`;
  show('quiz');
  renderQuestion();
});

$('nextBtn').addEventListener('click', () => {
  if (!answered) return;
  if (index < questions.length - 1) {
    index += 1;
    renderQuestion();
  } else {
    finishQuiz();
  }
});

$('homeBtn').addEventListener('click', () => show('setup'));
$('changeBtn').addEventListener('click', () => show('setup'));
$('againBtn').addEventListener('click', () => {
  index = 0;
  score = 0;
  questions = [...(questionBank[selected][grade] || questionBank[selected]['Class 1'])];
  $('studentLabel').textContent = `${student} • ${grade}`;
  show('quiz');
  renderQuestion();
});

document.addEventListener('teacher:questions-saved', () => {
  questionBank = window.teacherAdmin.buildQuestionBank(staticQuestionBank);
});
