const subjectInfo = {
  math: { name: 'MATHS', emoji: '🔢' },
  english: { name: 'ENGLISH', emoji: '📚' },
  science: { name: 'SCIENCE', emoji: '🌱' }
};

const LEADERBOARD_KEY = 'brightFutureLeaderboard';
const STATS_KEY = 'brightFutureStats';
const modeSettings = {
  easy: { time: 20 },
  normal: { time: 15 },
  challenge: { time: 10 }
};
let currentMode = 'easy';
let playWithFriend = false;
let friendName = '';
let timerId = null;
let timeLeft = modeSettings[currentMode].time;

function loadLeaderboard() {
  try {
    const raw = localStorage.getItem(LEADERBOARD_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    return [];
  }
}

function saveLeaderboard(entries) {
  localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(entries));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function renderLeaderboard() {
  const board = $('leaderboardBoard');
  const entries = loadLeaderboard().slice(0, 5);

  $('leaderboardSummary').textContent = entries.length ? `Top ${entries.length}` : 'No scores yet';

  if (!entries.length) {
    board.innerHTML = '<div class="leaderboard-empty">Play a quiz to set the first chess champion.</div>';
    return;
  }

  const chessIcons = ['♔', '♕', '♖', '♗', '♙'];

  board.innerHTML = entries.map((entry, index) => {
    const percent = Math.round((entry.score / entry.total) * 100);
    const rankIcon = chessIcons[Math.min(index, chessIcons.length - 1)];

    return `
      <div class="leaderboard-row ${index % 2 === 0 ? 'light' : 'dark'}">
        <div class="rank-badge">${rankIcon} #${index + 1}</div>
        <div class="player-info">
          <span class="player-name">${escapeHtml(entry.name)}</span>
          <span class="player-meta">${escapeHtml(entry.grade)} • ${escapeHtml(entry.subject)}</span>
        </div>
        <div class="player-score">${entry.score}/${entry.total}</div>
        <div class="player-percent">${percent}%</div>
      </div>
    `;
  }).join('');
}

function loadStats() {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    return raw ? JSON.parse(raw) : { bestScore: 0, gamesPlayed: 0, streak: 0 };
  } catch (error) {
    return { bestScore: 0, gamesPlayed: 0, streak: 0 };
  }
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

function renderStats() {
  const stats = loadStats();
  $('bestScoreStat').textContent = stats.bestScore;
  $('gamesPlayedStat').textContent = stats.gamesPlayed;
  $('streakStat').textContent = stats.streak;
}

function updateStatsWithResult(finalScore, total) {
  const stats = loadStats();
  const percent = Math.round((finalScore / total) * 100);
  stats.bestScore = Math.max(stats.bestScore, percent);
  stats.gamesPlayed = Number(stats.gamesPlayed || 0) + 1;
  stats.streak = percent >= 70 ? (Number(stats.streak || 0) + 1) : 0;
  saveStats(stats);
  renderStats();
  $('resultStreak').textContent = stats.streak;
  $('resultBest').textContent = stats.bestScore;
}

function resetLeaderboard() {
  saveLeaderboard([]);
  renderLeaderboard();
}

function recordLeaderboardEntry() {
  const entries = loadLeaderboard();
  entries.push({
    name: student,
    grade,
    subject: subjectInfo[selected].name,
    score,
    total: questions.length,
    createdAt: Date.now()
  });

  const sorted = entries.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return (b.total - a.total) || (a.name || '').localeCompare(b.name || '');
  }).slice(0, 10);

  saveLeaderboard(sorted);
  renderLeaderboard();
}

const staticQuestionBank = {
  math: {
    Nursery: [
      { q: 'What is 1 + 1?', o: ['1', '2', '3', '4'], a: 1, e: '1 + 1 = 2. Great counting!' },
      { q: 'Which number comes after 3?', o: ['2', '4', '5', '6'], a: 1, e: 'After 3 comes 4.' },
      { q: 'How many sides does a square have?', o: ['2', '3', '4', '5'], a: 2, e: 'A square has 4 sides.' },
      { q: 'What is 2 + 2?', o: ['3', '4', '5', '6'], a: 1, e: '2 + 2 = 4.' },
      { q: 'Which number is smaller: 5 or 7?', o: ['5', '7', '9', '8'], a: 0, e: '5 is smaller than 7.' },
      { q: 'How many eyes do you have?', o: ['1', '2', '3', '4'], a: 1, e: 'You have 2 eyes.' },
      { q: 'What is 3 + 1?', o: ['3', '4', '5', '6'], a: 1, e: '3 + 1 = 4.' },
      { q: 'Which shape has 3 sides?', o: ['Circle', 'Triangle', 'Square', 'Rectangle'], a: 1, e: 'A triangle has 3 sides.' },
      { q: 'What is 5 - 2?', o: ['2', '3', '4', '5'], a: 2, e: '5 - 2 = 3.' },
      { q: 'Which number comes before 10?', o: ['8', '9', '11', '12'], a: 1, e: '9 comes before 10.' }
    ],
    'Class 1': [
      { q: 'What is 2 + 3?', o: ['4', '5', '6', '7'], a: 1, e: '2 + 3 = 5. Count two, then three more!' },
      { q: 'Which number comes after 9?', o: ['8', '10', '11', '7'], a: 1, e: 'After 9 comes 10.' },
      { q: 'What is 4 + 4?', o: ['6', '7', '8', '9'], a: 2, e: '4 + 4 = 8.' },
      { q: 'What is 6 + 1?', o: ['6', '7', '8', '9'], a: 1, e: '6 + 1 = 7.' },
      { q: 'What is 10 - 3?', o: ['6', '7', '8', '9'], a: 2, e: '10 - 3 = 7.' },
      { q: 'How many sides does a rectangle have?', o: ['2', '3', '4', '5'], a: 2, e: 'A rectangle has 4 sides.' },
      { q: 'Which number is bigger: 8 or 6?', o: ['6', '8', '7', '5'], a: 1, e: '8 is bigger than 6.' },
      { q: 'What is 5 + 5?', o: ['8', '9', '10', '11'], a: 2, e: '5 + 5 = 10.' },
      { q: 'What is 9 - 4?', o: ['5', '6', '7', '8'], a: 0, e: '9 - 4 = 5.' },
      { q: 'Which number is odd?', o: ['2', '4', '7', '8'], a: 2, e: '7 is odd.' }
    ],
    'Class 2': [
      { q: 'What is 10 − 4?', o: ['5', '7', '6', '4'], a: 2, e: '10 take away 4 leaves 6.' },
      { q: 'How many days are in a week?', o: ['5', '6', '7', '8'], a: 2, e: 'There are 7 days in a week.' },
      { q: 'Which shape is round?', o: ['Square', 'Triangle', 'Circle', 'Rectangle'], a: 2, e: 'A circle is round and has no corners.' },
      { q: 'What is 12 + 5?', o: ['16', '17', '18', '19'], a: 1, e: '12 + 5 = 17.' },
      { q: 'What is 15 - 6?', o: ['7', '8', '9', '10'], a: 2, e: '15 - 6 = 9.' },
      { q: 'Which number is even?', o: ['9', '11', '14', '15'], a: 2, e: '14 is even.' },
      { q: 'What is double 6?', o: ['10', '12', '14', '16'], a: 1, e: 'Double 6 is 12.' },
      { q: 'How many months are in a year?', o: ['10', '11', '12', '13'], a: 2, e: 'A year has 12 months.' },
      { q: 'What is 7 + 8?', o: ['13', '14', '15', '16'], a: 2, e: '7 + 8 = 15.' },
      { q: 'Which is the smallest number?', o: ['12', '8', '10', '6'], a: 3, e: '6 is the smallest.' }
    ],
    'Class 3': [
      { q: 'What is 5 + 2?', o: ['6', '7', '8', '9'], a: 1, e: '5 + 2 = 7.' },
      { q: 'How many fingers are on one hand?', o: ['4', '5', '6', '10'], a: 1, e: 'One hand usually has 5 fingers.' },
      { q: 'Which number is the biggest?', o: ['12', '8', '15', '10'], a: 2, e: '15 is bigger than 12, 8 and 10.' },
      { q: 'What is 9 + 6?', o: ['13', '14', '15', '16'], a: 2, e: '9 + 6 = 15.' },
      { q: 'What is 18 - 9?', o: ['8', '9', '10', '11'], a: 1, e: '18 - 9 = 9.' },
      { q: 'How many minutes are in one hour?', o: ['30', '45', '60', '90'], a: 2, e: 'An hour has 60 minutes.' },
      { q: 'What is 4 x 3?', o: ['10', '11', '12', '13'], a: 2, e: '4 times 3 is 12.' },
      { q: 'Which number is a multiple of 5?', o: ['11', '12', '15', '17'], a: 2, e: '15 is a multiple of 5.' },
      { q: 'What is 20 ÷ 5?', o: ['3', '4', '5', '6'], a: 2, e: '20 divided by 5 equals 4.' },
      { q: 'How many sides does a pentagon have?', o: ['4', '5', '6', '7'], a: 1, e: 'A pentagon has 5 sides.' }
    ],
    'Class 4': [
      { q: 'What is 8 + 7?', o: ['14', '15', '16', '17'], a: 1, e: '8 + 7 = 15.' },
      { q: 'Which number is even?', o: ['3', '5', '8', '9'], a: 2, e: '8 is even because it can be paired.' },
      { q: 'How many sides does a triangle have?', o: ['2', '4', '3', '5'], a: 2, e: 'A triangle has 3 sides.' },
      { q: 'What is 25 + 18?', o: ['33', '34', '43', '44'], a: 2, e: '25 + 18 = 43.' },
      { q: 'What is 96 - 27?', o: ['69', '71', '73', '79'], a: 0, e: '96 - 27 = 69.' },
      { q: 'What is 7 x 6?', o: ['36', '42', '48', '54'], a: 1, e: '7 x 6 = 42.' },
      { q: 'Which is a factor of 12?', o: ['5', '6', '7', '9'], a: 1, e: '6 is a factor of 12.' },
      { q: 'How many hours are in 2 days?', o: ['24', '36', '48', '72'], a: 2, e: '2 days = 48 hours.' },
      { q: 'What is 1/2 of 20?', o: ['5', '8', '10', '12'], a: 2, e: 'Half of 20 is 10.' },
      { q: 'Which fraction is bigger: 1/3 or 1/2?', o: ['1/3', '1/2', 'They are equal', 'None'], a: 1, e: '1/2 is bigger than 1/3.' }
    ],
    'Class 5': [
      { q: 'What is 12 + 9?', o: ['20', '21', '22', '23'], a: 1, e: '12 + 9 = 21.' },
      { q: 'What is 18 − 7?', o: ['9', '10', '11', '12'], a: 2, e: '18 minus 7 is 11.' },
      { q: 'How many months are in a year?', o: ['10', '11', '12', '13'], a: 2, e: 'A year has 12 months.' },
      { q: 'What is 27 + 39?', o: ['55', '66', '76', '86'], a: 2, e: '27 + 39 = 66.' },
      { q: 'What is 84 - 29?', o: ['45', '55', '65', '75'], a: 1, e: '84 - 29 = 55.' },
      { q: 'What is 8 x 9?', o: ['64', '70', '72', '80'], a: 2, e: '8 x 9 = 72.' },
      { q: 'What is 144 ÷ 12?', o: ['10', '11', '12', '13'], a: 2, e: '144 ÷ 12 = 12.' },
      { q: 'Which of these is a prime number?', o: ['9', '11', '15', '21'], a: 1, e: '11 is a prime number.' },
      { q: 'What is 3/4 of 16?', o: ['10', '12', '14', '16'], a: 1, e: '3/4 of 16 is 12.' },
      { q: 'Which angle is a right angle?', o: ['30°', '90°', '120°', '180°'], a: 1, e: 'A right angle is 90°.' }
    ]
  },
  english: {
    Nursery: [
      { q: 'Which word is a fruit?', o: ['Book', 'Apple', 'Chair', 'Sun'], a: 1, e: 'Apple is a fruit.' },
      { q: "What is the first letter of 'cat'?", o: ['A', 'C', 'M', 'T'], a: 1, e: 'The word cat begins with C.' },
      { q: 'Which word is a colour?', o: ['Happy', 'Blue', 'Jump', 'Table'], a: 1, e: 'Blue is the name of a colour.' },
      { q: 'Which word is an animal?', o: ['Dog', 'House', 'Ball', 'Book'], a: 0, e: 'Dog is an animal.' },
      { q: 'Which one is a vowel?', o: ['B', 'A', 'M', 'D'], a: 1, e: 'A is a vowel.' },
      { q: 'Which word means big?', o: ['Small', 'Tiny', 'Large', 'Fast'], a: 2, e: 'Large means big.' },
      { q: 'What is the opposite of day?', o: ['Night', 'Sun', 'Light', 'Cloud'], a: 0, e: 'Night is the opposite of day.' },
      { q: 'Which word rhymes with cat?', o: ['Hat', 'Tree', 'Stone', 'Book'], a: 0, e: 'Hat rhymes with cat.' },
      { q: 'Choose the correct word: I ___ a ball.', o: ['am', 'is', 'have', 'are'], a: 2, e: 'I have a ball.' },
      { q: 'Which word is a family member?', o: ['Chair', 'Mother', 'River', 'Cloud'], a: 1, e: 'Mother is a family member.' }
    ],
    'Class 1': [
      { q: 'What is the opposite of hot?', o: ['Warm', 'Cold', 'Big', 'Fast'], a: 1, e: 'Cold is the opposite of hot.' },
      { q: 'Which one is an animal?', o: ['Tiger', 'Pencil', 'Chair', 'Cloud'], a: 0, e: 'A tiger is a wild animal.' },
      { q: 'Choose the correct spelling.', o: ['Applle', 'Aple', 'Apple', 'Appel'], a: 2, e: 'Apple is spelled A-P-P-L-E.' },
      { q: 'Which word is a verb?', o: ['Jump', 'Table', 'Chair', 'Blue'], a: 0, e: 'Jump is an action word.' },
      { q: 'Fill in the blank: The bird ___ in the sky.', o: ['is', 'am', 'fly', 'are'], a: 2, e: 'The bird flies in the sky.' },
      { q: 'Which word is a colour?', o: ['Happy', 'Green', 'Jump', 'Book'], a: 1, e: 'Green is a colour.' },
      { q: 'What is the plural of box?', o: ['Boxes', 'Boxs', 'Boxies', 'Box'], a: 0, e: 'The plural is boxes.' },
      { q: 'Which sentence is correct?', o: ['I am happy.', 'I are happy.', 'I is happy.', 'I happy.'], a: 0, e: 'I am happy is correct.' },
      { q: 'Which word is a noun?', o: ['Run', 'Happy', 'School', 'Quickly'], a: 2, e: 'School is a thing.' },
      { q: 'Which word rhymes with sun?', o: ['Fun', 'Paper', 'Moon', 'Book'], a: 0, e: 'Fun rhymes with sun.' }
    ],
    'Class 2': [
      { q: 'What is the plural of cat?', o: ['Cats', 'Cates', 'Caties', 'Cating'], a: 0, e: 'We add s to make cat into cats.' },
      { q: 'Which word is an action?', o: ['Sleep', 'Pillow', 'Blue', 'Soft'], a: 0, e: 'Sleep is something you can do.' },
      { q: 'Fill in the blank: The sun ___ bright.', o: ['are', 'am', 'is', 'be'], a: 2, e: "We say, 'The sun is bright.'" },
      { q: 'What is the opposite of small?', o: ['Big', 'Tall', 'Slow', 'Weak'], a: 0, e: 'Big is the opposite of small.' },
      { q: 'Which word is a pronoun?', o: ['Book', 'He', 'River', 'Desk'], a: 1, e: 'He is a pronoun.' },
      { q: 'Which sentence has correct punctuation?', o: ['where are you', 'Where are you?', 'where Are you', 'Where are you'], a: 1, e: 'A question mark ends a question.' },
      { q: 'What is the past tense of play?', o: ['Played', 'Playing', 'Plays', 'Playes'], a: 0, e: 'Played is the past tense.' },
      { q: 'Which word is an adjective?', o: ['Happy', 'Jump', 'Sing', 'Run'], a: 0, e: 'Happy describes a person.' },
      { q: 'Which word is the correct spelling?', o: ['Becaus', 'Because', 'Becase', 'Becausse'], a: 1, e: 'Because is spelled correctly.' },
      { q: 'Choose the correct word: We ___ reading books.', o: ['am', 'is', 'are', 'be'], a: 2, e: 'We are reading books.' }
    ],
    'Class 3': [
      { q: 'Which word rhymes with ball?', o: ['Bell', 'Tall', 'Bull', 'Book'], a: 1, e: 'Ball and tall rhyme because they have a similar ending sound.' },
      { q: 'What is the opposite of up?', o: ['Over', 'Down', 'Near', 'On'], a: 1, e: 'Down is the opposite of up.' },
      { q: 'Which one is a vowel?', o: ['B', 'T', 'A', 'G'], a: 2, e: 'A is one of the five vowels.' },
      { q: 'What is the synonym of happy?', o: ['Sad', 'Joyful', 'Slow', 'Tiny'], a: 1, e: 'Joyful means happy.' },
      { q: 'Choose the correct pronoun: ___ is my friend.', o: ['She', 'Book', 'Green', 'Table'], a: 0, e: 'She is a pronoun.' },
      { q: 'Which word is a noun?', o: ['Quickly', 'Jump', 'Table', 'Beautiful'], a: 2, e: 'Table is a noun.' },
      { q: 'What is the past tense of walk?', o: ['Walked', 'Walking', 'Walks', 'Walken'], a: 0, e: 'Walked is the past tense.' },
      { q: 'Which sentence is correct?', o: ['She go to school.', 'She goes to school.', 'She going to school.', 'She gone to school.'], a: 1, e: "We use 'goes' with she." },
      { q: 'What is the opposite of weak?', o: ['Strong', 'Tall', 'Fast', 'Small'], a: 0, e: 'Strong is the opposite of weak.' },
      { q: 'What does the word quiet mean?', o: ['Noisy', 'Calm', 'Fast', 'Happy'], a: 1, e: 'Quiet means calm and not noisy.' }
    ],
    'Class 4': [
      { q: 'Which word means the same as happy?', o: ['Sad', 'Joyful', 'Slow', 'Tiny'], a: 1, e: 'Joyful means happy.' },
      { q: 'Choose the sentence with correct punctuation.', o: ['where are you', 'Where are you?', 'where Are you', 'Where are you'], a: 1, e: 'A question needs a question mark.' },
      { q: 'What is the past tense of jump?', o: ['Jumped', 'Jumping', 'Jumps', 'Jumpt'], a: 0, e: 'Jumped is the past tense of jump.' },
      { q: 'Which word is an adverb?', o: ['Quickly', 'Table', 'Happy', 'Book'], a: 0, e: 'Quickly tells how something happens.' },
      { q: 'What is the plural of baby?', o: ['Babys', 'Babies', 'Babyes', 'Babyss'], a: 1, e: 'Babies is the correct plural form.' },
      { q: 'Which sentence is correct?', o: ['I have went home.', 'I have gone home.', 'I has gone home.', 'I goes home.'], a: 1, e: 'I have gone home is correct.' },
      { q: 'Which word is a conjunction?', o: ['And', 'House', 'Jump', 'Quick'], a: 0, e: 'And joins ideas together.' },
      { q: 'What is a synonym for bright?', o: ['Dark', 'Shiny', 'Cold', 'Slow'], a: 1, e: 'Shiny is a synonym for bright.' },
      { q: 'Choose the correct spelling.', o: ['Receeve', 'Receive', 'Recieve', 'Receve'], a: 1, e: 'Receive is spelled correctly.' },
      { q: 'Which word is an antonym of noisy?', o: ['Quiet', 'Loud', 'Fast', 'Large'], a: 0, e: 'Quiet is the opposite of noisy.' }
    ],
    'Class 5': [
      { q: 'Which sentence is correct?', o: ['She go to school.', 'She goes to school.', 'She going to school.', 'She gone to school.'], a: 1, e: "We use 'goes' with she/he/it." },
      { q: 'What is the synonym of bright?', o: ['Dark', 'Shiny', 'Slow', 'Small'], a: 1, e: 'Shiny is a synonym for bright.' },
      { q: 'Which word is a noun?', o: ['Run', 'Jump', 'Table', 'Quickly'], a: 2, e: 'Table is a noun because it is a thing.' },
      { q: 'What is the antonym of generous?', o: ['Kind', 'Greedy', 'Friendly', 'Happy'], a: 1, e: 'Greedy is the opposite of generous.' },
      { q: 'Choose the correct form: They ___ playing outside.', o: ['is', 'am', 'are', 'be'], a: 2, e: 'They are playing outside.' },
      { q: 'Which sentence is in the past tense?', o: ['I read a book.', 'I am reading a book.', 'I will read a book.', 'I read books every day.'], a: 0, e: 'I read a book is in the past tense.' },
      { q: 'What is the adjective in this sentence: The tall tree swayed?', o: ['The', 'Tall', 'Tree', 'Swayed'], a: 1, e: 'Tall describes the tree.' },
      { q: 'Which word is an example of a proper noun?', o: ['City', 'India', 'River', 'Book'], a: 1, e: 'India is a proper noun.' },
      { q: 'What is the meaning of the word curious?', o: ['Sleepy', 'Eager to learn', 'Angry', 'Lazy'], a: 1, e: 'Curious means eager to learn.' },
      { q: 'Which is the correct sentence?', o: ['He do his homework.', 'He does his homework.', 'He doing his homework.', 'He did his homework yesterday.'], a: 1, e: 'He does his homework is correct.' }
    ]
  },
  science: {
    Nursery: [
      { q: 'Which animal has wings?', o: ['Horse', 'Duck', 'Fish', 'Cat'], a: 1, e: 'A duck has wings and can fly.' },
      { q: 'What do we breathe in?', o: ['Water', 'Air', 'Sand', 'Rocks'], a: 1, e: 'We breathe in air to stay alive.' },
      { q: 'Which star gives Earth light and warmth?', o: ['The Moon', 'The Sun', 'Mars', 'Venus'], a: 1, e: 'The Sun gives Earth light and warmth.' },
      { q: 'Which plant part grows underground?', o: ['Flower', 'Leaf', 'Root', 'Stem'], a: 2, e: 'Roots grow underground.' },
      { q: 'Which animal lives in water?', o: ['Dog', 'Fish', 'Cow', 'Bird'], a: 1, e: 'Fish live in water.' },
      { q: 'What do plants need to grow?', o: ['Toys', 'Sunlight', 'Shoes', 'Plastic'], a: 1, e: 'Plants need sunlight and water.' },
      { q: 'Which part of the body helps us see?', o: ['Ears', 'Eyes', 'Nose', 'Hands'], a: 1, e: 'Eyes help us see.' },
      { q: 'What do bees collect from flowers?', o: ['Stone', 'Dust', 'Pollen', 'Sand'], a: 2, e: 'Bees collect pollen.' },
      { q: 'Which is a healthy food?', o: ['Chips', 'Apple', 'Candy', 'Soda'], a: 1, e: 'Apples are a healthy food.' },
      { q: 'What do we use to keep warm in winter?', o: ['Umbrella', 'Sweater', 'Pail', 'Rope'], a: 1, e: 'A sweater keeps us warm.' }
    ],
    'Class 1': [
      { q: 'Which part of a plant is usually underground?', o: ['Flower', 'Leaf', 'Root', 'Fruit'], a: 2, e: 'Roots usually grow underground and take in water.' },
      { q: "Which animal says 'meow'?", o: ['Dog', 'Cow', 'Cat', 'Duck'], a: 2, e: 'Cats often say meow.' },
      { q: 'What do we use to smell?', o: ['Ears', 'Nose', 'Hands', 'Eyes'], a: 1, e: 'Our nose helps us smell.' },
      { q: 'Which thing is soft?', o: ['Stone', 'Pillow', 'Glass', 'Metal'], a: 1, e: 'A pillow is soft.' },
      { q: 'Which part of the body helps us hear?', o: ['Eyes', 'Ears', 'Mouth', 'Nose'], a: 1, e: 'Ears help us hear.' },
      { q: 'What is the weather like on a rainy day?', o: ['Very hot', 'Wet and cloudy', 'Snowy', 'Dry'], a: 1, e: 'Rainy days are wet and cloudy.' },
      { q: 'Which of these is a mammal?', o: ['Fish', 'Cat', 'Frog', 'Bird'], a: 1, e: 'Cats are mammals.' },
      { q: 'What do we use to drink?', o: ['Cup', 'Pencil', 'Book', 'Ruler'], a: 0, e: 'A cup is used to drink.' },
      { q: 'Which part of a tree makes food?', o: ['Root', 'Leaf', 'Stem', 'Flower'], a: 1, e: 'Leaves make food for the plant.' },
      { q: 'Which source gives us light at night?', o: ['Sun', 'Moon', 'Cloud', 'Tree'], a: 1, e: 'The Moon gives us light at night.' }
    ],
    'Class 2': [
      { q: 'Which one lives in water?', o: ['Fish', 'Lion', 'Camel', 'Hen'], a: 0, e: 'Fish live in water.' },
      { q: 'What do plants need to grow?', o: ['Plastic', 'Sunlight', 'Toys', 'Shoes'], a: 1, e: 'Plants need sunlight, water and air to grow.' },
      { q: 'Which is a healthy drink?', o: ['Clean water', 'Paint', 'Soap', 'Ink'], a: 0, e: 'Clean water helps keep our bodies healthy.' },
      { q: 'Which is a natural resource?', o: ['Plastic', 'Water', 'Toy', 'Bottle'], a: 1, e: 'Water is a natural resource.' },
      { q: 'Which material is transparent?', o: ['Wood', 'Glass', 'Brick', 'Stone'], a: 1, e: 'Glass is transparent.' },
      { q: 'What do lungs help us do?', o: ['Digest food', 'Breathe', 'Walk', 'Smile'], a: 1, e: 'Lungs help us breathe.' },
      { q: 'Which season is the hottest?', o: ['Winter', 'Summer', 'Autumn', 'Spring'], a: 1, e: 'Summer is usually the hottest.' },
      { q: 'Which planet do we live on?', o: ['Mars', 'Earth', 'Jupiter', 'Venus'], a: 1, e: 'We live on Earth.' },
      { q: 'What do birds use to fly?', o: ['Tail', 'Wings', 'Teeth', 'Fin'], a: 1, e: 'Birds use wings to fly.' },
      { q: 'Which part of the body helps us digest food?', o: ['Stomach', 'Ears', 'Eyes', 'Lungs'], a: 0, e: 'The stomach helps digest food.' }
    ],
    'Class 3': [
      { q: 'How many legs does a spider have?', o: ['6', '8', '4', '10'], a: 1, e: 'A spider has 8 legs.' },
      { q: 'Which body part helps you hear?', o: ['Eyes', 'Nose', 'Ears', 'Elbows'], a: 2, e: 'Our ears help us hear sounds.' },
      { q: 'What do bees help flowers do?', o: ['Sleep', 'Pollinate', 'Run', 'Swim'], a: 1, e: 'Bees carry pollen between flowers, helping many plants make seeds.' },
      { q: 'Which gas do humans need to breathe?', o: ['Oxygen', 'Carbon dioxide', 'Helium', 'Hydrogen'], a: 0, e: 'Humans need oxygen to breathe.' },
      { q: 'Which force pulls things toward Earth?', o: ['Magnetism', 'Gravity', 'Friction', 'Sound'], a: 1, e: 'Gravity pulls objects toward Earth.' },
      { q: 'What does a thermometer measure?', o: ['Wind', 'Temperature', 'Weight', 'Sound'], a: 1, e: 'A thermometer measures temperature.' },
      { q: 'Which part of the body pumps blood?', o: ['Brain', 'Heart', 'Lungs', 'Skin'], a: 1, e: 'The heart pumps blood around the body.' },
      { q: 'What happens to water when it freezes?', o: ['It sinks', 'It turns into ice', 'It disappears', 'It becomes steam'], a: 1, e: 'Freezing changes water into ice.' },
      { q: 'Which is the largest planet in our solar system?', o: ['Earth', 'Mars', 'Jupiter', 'Venus'], a: 2, e: 'Jupiter is the largest planet.' },
      { q: 'Which animal is a reptile?', o: ['Frog', 'Lizard', 'Whale', 'Butterfly'], a: 1, e: 'A lizard is a reptile.' }
    ],
    'Class 4': [
      { q: 'What is the main source of heat and light for Earth?', o: ['Moon', 'Sun', 'Cloud', 'Star'], a: 1, e: 'The Sun is the main source of light and warmth.' },
      { q: 'Which part of the body pumps blood?', o: ['Brain', 'Heart', 'Lungs', 'Skin'], a: 1, e: 'The heart pumps blood around the body.' },
      { q: 'Which material floats in water?', o: ['Metal', 'Wood', 'Stone', 'Glass'], a: 1, e: 'Wood often floats because it is lighter than water.' },
      { q: 'What is the process called when water turns into vapour?', o: ['Freezing', 'Melting', 'Evaporation', 'Condensation'], a: 2, e: 'Evaporation changes liquid water into vapour.' },
      { q: 'What do plants make during photosynthesis?', o: ['Sand', 'Food', 'Plastic', 'Metal'], a: 1, e: 'Plants make food in their leaves.' },
      { q: 'Which body system helps us breathe?', o: ['Digestive system', 'Respiratory system', 'Skeletal system', 'Nervous system'], a: 1, e: 'The respiratory system helps us breathe.' },
      { q: 'Which is a conductor of electricity?', o: ['Wood', 'Plastic', 'Copper', 'Rubber'], a: 2, e: 'Copper conducts electricity well.' },
      { q: 'What do roots absorb from the soil?', o: ['Air', 'Water', 'Sunlight', 'Clouds'], a: 1, e: 'Roots absorb water and minerals.' },
      { q: 'Which planet is known as the Red Planet?', o: ['Earth', 'Saturn', 'Mars', 'Jupiter'], a: 2, e: 'Mars is known as the Red Planet.' },
      { q: 'What is the closest star to Earth?', o: ['Polaris', 'Sun', 'Sirius', 'Betelgeuse'], a: 1, e: 'The Sun is the closest star to Earth.' }
    ],
    'Class 5': [
      { q: 'Which gas do plants take in from the air?', o: ['Oxygen', 'Carbon dioxide', 'Helium', 'Hydrogen'], a: 1, e: 'Plants use carbon dioxide during photosynthesis.' },
      { q: 'What do we call the process when water changes to vapour?', o: ['Freezing', 'Melting', 'Evaporation', 'Condensation'], a: 2, e: 'Evaporation is when water turns into vapour.' },
      { q: 'What helps our body grow and stay healthy?', o: ['Exercise', 'Sleep', 'Food', 'All of these'], a: 3, e: 'Food, sleep, and exercise all help our body stay healthy.' },
      { q: 'Which planet has rings?', o: ['Venus', 'Mars', 'Saturn', 'Mercury'], a: 2, e: 'Saturn is famous for its rings.' },
      { q: 'What do animals need in order to survive?', o: ['Only toys', 'Air, water, and food', 'Only sunlight', 'Only clothes'], a: 1, e: 'Animals need air, water, and food to survive.' },
      { q: 'Which is a non-living thing?', o: ['Tree', 'Rock', 'Dog', 'Bird'], a: 1, e: 'A rock is non-living.' },
      { q: 'What kind of energy does the Sun provide?', o: ['Heat and light', 'Sound only', 'Electricity only', 'None'], a: 0, e: 'The Sun provides heat and light.' },
      { q: 'What protects our brain?', o: ['Ribs', 'Skull', 'Lungs', 'Stomach'], a: 1, e: 'The skull protects the brain.' },
      { q: 'What is the main function of leaves?', o: ['To eat', 'To make food', 'To drink water', 'To breathe dust'], a: 1, e: 'Leaves make food for the plant.' },
      { q: 'Which force slows moving objects down?', o: ['Friction', 'Light', 'Sound', 'Gravity'], a: 0, e: 'Friction slows objects down.' }
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
let onlineMode = false;
let socket = null;
let onlineRoomCode = '';
let onlinePlayerId = '';
let onlinePlayers = [];

const $ = (id) => document.getElementById(id);

function setOnlineStatus(message) {
  const onlineStatus = $('onlineStatus');
  if (onlineStatus) {
    onlineStatus.textContent = message;
  }
}

function syncOnlineScoreboard() {
  const board = $('onlineScoreboard');
  if (!board) return;

  if (!onlineMode || !onlinePlayers.length) {
    board.classList.add('hidden');
    return;
  }

  board.classList.remove('hidden');

  const [playerOne, playerTwo] = onlinePlayers;
  const playerOneName = $('onlinePlayerOneName');
  const playerOneScore = $('onlinePlayerOneScore');
  const playerTwoName = $('onlinePlayerTwoName');
  const playerTwoScore = $('onlinePlayerTwoScore');

  if (playerOneName) playerOneName.textContent = playerOne ? playerOne.name : 'Player 1';
  if (playerOneScore) playerOneScore.textContent = playerOne ? String(playerOne.score || 0) : '0';
  if (playerTwoName) playerTwoName.textContent = playerTwo ? playerTwo.name : 'Player 2';
  if (playerTwoScore) playerTwoScore.textContent = playerTwo ? String(playerTwo.score || 0) : '0';
}

function updateWinnerBanner(title, visible = true) {
  const banner = $('winnerBanner');
  if (!banner) return;
  banner.textContent = title;
  banner.classList.toggle('hidden', !visible);
}

function connectSocket() {
  if (socket) return;

  socket = io();

  socket.on('connect', () => {
    console.log('Connected to Bright Future multiplayer server');
  });

  socket.on('room:created', ({ code, playerId }) => {
    onlineRoomCode = code;
    onlinePlayerId = playerId;
    setOnlineStatus(`Room created! Share code: ${code}`);
    $('roomCodeInput').value = code;
  });

  socket.on('room:state', ({ code, players }) => {
    onlineRoomCode = code;
    onlinePlayers = players || [];
    syncOnlineScoreboard();
    const me = onlinePlayers.find((player) => player.id === socket.id);
    const friend = onlinePlayers.find((player) => player.id !== socket.id);

    if (me && friend) {
      setOnlineStatus(`${me.name} vs ${friend.name} • room ${code}`);
    } else if (me) {
      setOnlineStatus(`${me.name} is waiting for a friend in room ${code}`);
    }
  });

  socket.on('room:ready', ({ code, players }) => {
    onlineRoomCode = code;
    onlinePlayers = players || [];
    syncOnlineScoreboard();
    setOnlineStatus('Room ready! Both players are here. Press Start to begin.');
  });

  socket.on('game:start', ({ code, players }) => {
    onlineRoomCode = code;
    onlinePlayers = players || [];
    syncOnlineScoreboard();
    const currentPlayer = onlinePlayers.find((player) => player.id === socket.id);

    if (currentPlayer) {
      student = currentPlayer.name || student || 'Little Learner';
      grade = currentPlayer.grade || $('grade').value;
      selected = currentPlayer.subject || selected;
    } else {
      student = $('studentName').value.trim() || 'Little Learner';
      grade = $('grade').value;
    }

    questions = [...(questionBank[selected][grade] || questionBank[selected]['Class 1'])];
    index = 0;
    score = 0;
    updateStudentLabel();
    $('subjectLabel').textContent = `${subjectInfo[selected].emoji} ${subjectInfo[selected].name}`;
    setOnlineStatus('Match started! Answer each question together.');
    show('quiz');
    renderQuestion();
  });

  socket.on('game:advance', ({ code, currentIndex, finished, players }) => {
    onlineRoomCode = code;
    onlinePlayers = players || [];
    syncOnlineScoreboard();
    const me = onlinePlayers.find((player) => player.id === socket.id);
    if (me) {
      score = me.score;
    }
    index = currentIndex;

    if (finished) {
      finishOnlineQuiz();
      return;
    }

    renderQuestion();
  });

  socket.on('room:error', ({ message }) => {
    setOnlineStatus(message);
  });
}

function resetResultBanner() {
  updateWinnerBanner('', false);
}

function createOnlineRoom() {
  connectSocket();
  onlineMode = true;
  const formName = $('studentName').value.trim() || 'Little Learner';
  socket.emit('room:create', {
    name: formName,
    grade: $('grade').value,
    subject: selected,
    mode: currentMode
  });
}

function joinOnlineRoom() {
  const roomCode = String($('roomCodeInput').value || '').trim().toUpperCase();
  if (!roomCode) {
    setOnlineStatus('Enter a room code before joining.');
    return;
  }

  connectSocket();
  onlineMode = true;
  socket.emit('room:join', {
    code: roomCode,
    name: $('studentName').value.trim() || 'Little Learner',
    grade: $('grade').value,
    subject: selected,
    mode: currentMode
  });
}

function finishOnlineQuiz() {
  show('result');
  clearTimer();
  syncOnlineScoreboard();

  const me = onlinePlayers.find((player) => player.id === socket.id);
  const opponent = onlinePlayers.find((player) => player.id !== socket.id);
  const myScore = me ? me.score : score;
  const opponentScore = opponent ? opponent.score : 0;
  const total = questions.length || 10;
  const percent = Math.round((myScore / total) * 100);

  $('finalScore').textContent = `${myScore}/${total}`;
  $('resultEmoji').textContent = percent === 100 ? '🏆' : percent >= 70 ? '🌟' : percent >= 40 ? '😊' : '🌱';
  $('resultTitle').textContent = percent === 100 ? `Perfect score, ${student}!` : percent >= 70 ? `Amazing work, ${student}!` : percent >= 40 ? `Well done, ${student}!` : `Keep growing, ${student}!`;
  $('resultText').textContent = `Final score: ${student} ${myScore} - ${opponent ? opponent.name : 'Friend'} ${opponentScore}.`;

  let winnerText = 'It is a draw!';
  if (opponent) {
    if (myScore > opponentScore) {
      winnerText = `🏆 ${student} wins!`;
    } else if (opponentScore > myScore) {
      winnerText = `🏆 ${opponent.name} wins!`;
    }
  } else {
    winnerText = '🏆 Great teamwork!';
  }

  updateWinnerBanner(winnerText, true);
  $('resultMessage').textContent = opponent ? `${student} scored ${myScore} and ${opponent.name} scored ${opponentScore}.` : 'Excellent teamwork!';
}

function updateStudentLabel() {
  const label = $('studentLabel');
  if (!label) return;

  const playerName = student || 'Little Learner';
  const friendPlayer = playWithFriend ? (friendName || 'Friend') : '';
  const gradeLabel = grade || 'Class 1';

  label.textContent = playWithFriend ? `${playerName} vs ${friendPlayer} • ${gradeLabel}` : `${playerName} • ${gradeLabel}`;
}

function updateModeStatus() {
  const statusElement = $('modeStatus');
  if (!statusElement) return;

  const modeLabel = currentMode.charAt(0).toUpperCase() + currentMode.slice(1);
  const friendLabel = playWithFriend ? '1 vs 2' : 'Solo';
  statusElement.textContent = `Mode: ${modeLabel} • ${friendLabel}`;
}

function updateVersusDisplay() {
  const versusPill = $('versusPill');
  if (!versusPill) return;

  versusPill.classList.toggle('hidden', !playWithFriend);
  versusPill.textContent = playWithFriend ? '1 vs 2' : '';
}

function syncFriendModeUI() {
  const friendModeBtn = $('friendModeBtn');
  const friendNameWrap = $('friendNameWrap');
  const friendNameInput = $('friendName');

  if (friendModeBtn) {
    friendModeBtn.classList.toggle('active', playWithFriend);
    friendModeBtn.textContent = playWithFriend ? 'Friend mode on 👯‍♂️' : 'Play with a friend 👯';
  }

  if (friendNameWrap) {
    friendNameWrap.classList.toggle('hidden', !playWithFriend);
  }

  if (playWithFriend && friendNameInput) {
    friendNameInput.focus();
  } else if (friendNameInput) {
    friendNameInput.value = '';
    friendName = '';
  }

  updateModeStatus();
  updateVersusDisplay();
}

function clearTimer() {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  }
}

function startTimer() {
  clearTimer();
  timeLeft = modeSettings[currentMode].time;
  $('timerValue').textContent = `${timeLeft}s`;

  timerId = setInterval(() => {
    timeLeft -= 1;
    $('timerValue').textContent = `${timeLeft}s`;

    if (timeLeft <= 0) {
      clearTimer();
      handleTimeUp();
    }
  }, 1000);
}

function handleTimeUp() {
  const item = questions[index];
  if (!item || answered) return;
  chooseAnswer(-1, null, true);
}

renderLeaderboard();
renderStats();

document.querySelectorAll('.subject').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.subject').forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    selected = button.dataset.subject;
  });
});

document.querySelectorAll('.mode').forEach((button) => {
  button.addEventListener('click', () => {
    document.querySelectorAll('.mode').forEach((b) => b.classList.remove('selected'));
    button.classList.add('selected');
    currentMode = button.dataset.mode;
    updateModeStatus();
  });
});

const friendModeBtn = $('friendModeBtn');
const friendNameWrap = $('friendNameWrap');
const friendNameInput = $('friendName');

if (friendModeBtn) {
  friendModeBtn.addEventListener('click', () => {
    playWithFriend = !playWithFriend;
    syncFriendModeUI();
  });
}

const createRoomBtn = $('createRoomBtn');
const joinRoomBtn = $('joinRoomBtn');

if (createRoomBtn) {
  createRoomBtn.addEventListener('click', () => {
    onlineMode = true;
    setOnlineStatus('Creating a live room for two players...');
    createOnlineRoom();
  });
}

if (joinRoomBtn) {
  joinRoomBtn.addEventListener('click', () => {
    onlineMode = true;
    joinOnlineRoom();
  });
}

function show(id) {
  ['hero', 'setup', 'quiz', 'result'].forEach((section) => {
    $(section).classList.toggle('hidden', section !== id);
  });

  if (id !== 'result') {
    resetResultBanner();
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function renderQuestion() {
  answered = false;
  const item = questions[index];

  const timerPill = document.querySelector('.timer-pill');
  if (timerPill) {
    timerPill.classList.toggle('live', onlineMode);
  }

  $('questionCount').textContent = `QUESTION ${index + 1} OF ${questions.length}`;
  $('questionText').textContent = item.q;
  $('progress').style.width = `${(index / questions.length) * 100}%`;
  $('liveScore').textContent = score;
  $('feedback').className = 'feedback';
  $('feedback').textContent = '';
  $('nextBtn').disabled = onlineMode;
  $('nextBtn').textContent = onlineMode ? 'Waiting...' : (index === questions.length - 1 ? 'See My Score 🏆' : 'Next ➜');
  $('answers').innerHTML = '';

  item.o.forEach((option, i) => {
    const button = document.createElement('button');
    button.className = 'answer';
    button.innerHTML = `<span class="letter">${String.fromCharCode(65 + i)}</span><span></span>`;
    button.children[1].textContent = option;
    button.addEventListener('click', () => chooseAnswer(i, button));
    $('answers').appendChild(button);
  });

  if (!onlineMode) {
    startTimer();
  }
}

function chooseAnswer(choice, button, timedOut = false) {
  if (answered) return;
  answered = true;
  clearTimer();

  const item = questions[index];
  document.querySelectorAll('.answer').forEach((b, i) => {
    b.disabled = true;
    if (i === item.a) b.classList.add('correct');
  });

  const feedback = $('feedback');

  if (onlineMode && socket && onlineRoomCode) {
    socket.emit('game:answer', {
      code: onlineRoomCode,
      questionIndex: index,
      answerIndex: choice,
      correctIndex: item.a
    });

    feedback.textContent = choice === item.a ? `🎉 Correct! Waiting for your friend...` : `💡 You answered. Waiting for your friend...`;
    feedback.className = `feedback show ${choice === item.a ? 'good' : 'bad'}`;
    $('nextBtn').disabled = true;
    $('progress').style.width = `${((index + 1) / questions.length) * 100}%`;
    return;
  }

  if (choice === item.a) {
    score += 1;
    feedback.textContent = `🎉 Great job! ${item.e}`;
    feedback.className = 'feedback show good';
  } else {
    if (button) button.classList.add('wrong');
    feedback.textContent = timedOut ? `⏰ Time's up! ${item.e}` : `💡 Good try! ${item.e}`;
    feedback.className = 'feedback show bad';
  }

  $('liveScore').textContent = score;
  $('nextBtn').disabled = false;
  $('progress').style.width = `${((index + 1) / questions.length) * 100}%`;
}

function finishQuiz() {
  show('result');
  clearTimer();
  const percent = Math.round((score / questions.length) * 100);
  $('finalScore').textContent = `${score}/${questions.length}`;
  $('resultEmoji').textContent = percent === 100 ? '🏆' : percent >= 70 ? '🌟' : percent >= 40 ? '😊' : '🌱';
  $('resultTitle').textContent = percent === 100 ? `Perfect score, ${student}!` : percent >= 70 ? `Amazing work, ${student}!` : percent >= 40 ? `Well done, ${student}!` : `Keep growing, ${student}!`;
  const resultText = playWithFriend ? `${student} and ${friendName} finished the ${subjectInfo[selected].name.toLowerCase()} quiz for ${grade}.` : `You finished the ${subjectInfo[selected].name.toLowerCase()} quiz for ${grade}.`;
  $('resultText').textContent = resultText;
  $('resultMessage').textContent = percent >= 70 ? `${currentMode === 'challenge' ? 'Challenge complete!' : 'You are doing a fantastic job.'} Keep being curious!` : 'Every question helps you learn. Try again and see how much you can improve!';
  recordLeaderboardEntry();
  updateStatsWithResult(score, questions.length);
}

$('startBtn').addEventListener('click', () => {
  if (onlineMode) {
    if (onlineRoomCode) {
      socket.emit('game:start', { code: onlineRoomCode });
      return;
    }

    const roomCode = String($('roomCodeInput').value || '').trim();
    if (roomCode) {
      joinOnlineRoom();
    } else {
      createOnlineRoom();
    }
    return;
  }

  student = $('studentName').value.trim() || 'Little Learner';
  grade = $('grade').value;
  friendName = playWithFriend ? (friendNameInput ? friendNameInput.value.trim() || 'Friend' : 'Friend') : '';
  questions = [...(questionBank[selected][grade] || questionBank[selected]['Class 1'])];
  index = 0;
  score = 0;

  updateStudentLabel();
  $('subjectLabel').textContent = `${subjectInfo[selected].emoji} ${subjectInfo[selected].name}`;
  $('timerValue').textContent = `${modeSettings[currentMode].time}s`;
  $('resultText').textContent = playWithFriend ? `${student} and ${friendName} finished the ${subjectInfo[selected].name.toLowerCase()} quiz for ${grade}.` : `You finished the ${subjectInfo[selected].name.toLowerCase()} quiz for ${grade}.`;
  updateModeStatus();
  updateVersusDisplay();
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

$('homeBtn').addEventListener('click', () => {
  clearTimer();
  show('setup');
});
$('changeBtn').addEventListener('click', () => {
  clearTimer();
  show('setup');
});
$('againBtn').addEventListener('click', () => {
  clearTimer();
  index = 0;
  score = 0;
  questions = [...(questionBank[selected][grade] || questionBank[selected]['Class 1'])];
  updateStudentLabel();
  updateVersusDisplay();
  show('quiz');
  renderQuestion();
});
$('resetLeaderboardBtn').addEventListener('click', () => {
  resetLeaderboard();
});

document.addEventListener('teacher:questions-saved', () => {
  questionBank = window.teacherAdmin.buildQuestionBank(staticQuestionBank);
});

updateModeStatus();
updateVersusDisplay();
updateStudentLabel();
