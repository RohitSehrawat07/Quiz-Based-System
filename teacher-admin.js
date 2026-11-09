const STORAGE_KEY = 'brightFutureCustomQuestions';
const CLASS_4_MATH_SEED_KEY = 'brightFutureClass4MathSeeded';

const BRIGHT_FUTURE_CLASS_4_MATH = [
  { q: 'What is the place value of 6 in 4,625?', o: ['6', '60', '600', '6000'], a: 2, e: 'The 6 is in the hundreds place, so its value is 600.' },
  { q: 'What is 2,345 + 1,256?', o: ['3,501', '3,601', '3,701', '3,801'], a: 1, e: '2,345 + 1,256 = 3,601.' },
  { q: 'What is 5,000 − 2,345?', o: ['2,555', '2,655', '2,755', '2,855'], a: 1, e: '5,000 minus 2,345 equals 2,655.' },
  { q: 'What is 125 × 8?', o: ['900', '950', '1,000', '1,100'], a: 2, e: '125 × 8 = 1,000.' },
  { q: 'What is 864 ÷ 8?', o: ['108', '118', '128', '98'], a: 0, e: '864 divided by 8 is 108.' },
  { q: 'What is the LCM of 8 and 12?', o: ['16', '20', '24', '36'], a: 2, e: 'The least common multiple of 8 and 12 is 24.' },
  { q: 'What is 1/2 + 1/4?', o: ['1/4', '2/4', '3/4', '1'], a: 2, e: '1/2 + 1/4 = 2/4 + 1/4 = 3/4.' },
  { q: 'How many sides does a hexagon have?', o: ['4', '5', '6', '8'], a: 2, e: 'A hexagon has 6 sides.' },
  { q: 'How many centimetres are there in 3 metres?', o: ['30 cm', '100 cm', '200 cm', '300 cm'], a: 3, e: '1 metre = 100 cm, so 3 metres = 300 cm.' },
  { q: 'A shopkeeper has 120 apples. He packs 10 apples in each box. How many boxes does he need?', o: ['10', '11', '12', '15'], a: 2, e: '120 ÷ 10 = 12 boxes.' }
];

window.teacherAdmin = {
  setStatus(message, color) {
    const statusText = document.getElementById('adminStatus');
    if (!statusText) return;
    statusText.textContent = message;
    statusText.style.color = color;
  },

  loadCustomQuestions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
      this.setStatus("Could not load saved questions. Check this browser's storage settings.", '#b93c5a');
      return {};
    }
  },

  saveCustomQuestions(customQuestions) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(customQuestions));
  },

  seedBrightFutureClass4MathQuestions() {
    if (localStorage.getItem(CLASS_4_MATH_SEED_KEY) === 'true') return;

    const custom = this.loadCustomQuestions();
    if (!custom.math) custom.math = {};
    if (!Array.isArray(custom.math['Class 4'])) custom.math['Class 4'] = [];

    if (!custom.math['Class 4'].length) {
      custom.math['Class 4'] = BRIGHT_FUTURE_CLASS_4_MATH;
      this.saveCustomQuestions(custom);
      localStorage.setItem(CLASS_4_MATH_SEED_KEY, 'true');
      this.setStatus('Added the Bright Future Class 4 Maths test.', '#177b5c');
    }
  },

  getClassGroups(customQuestions = this.loadCustomQuestions()) {
    const groups = [];

    Object.keys(customQuestions || {}).forEach((subject) => {
      const classMap = customQuestions[subject] || {};
      Object.keys(classMap).forEach((grade) => {
        if (!Array.isArray(classMap[grade]) || !classMap[grade].length) return;
        groups.push({ subject, grade, questions: classMap[grade] });
      });
    });

    return groups.sort((a, b) => `${a.subject}-${a.grade}`.localeCompare(`${b.subject}-${b.grade}`));
  },

  renderQuestionManager() {
    const panel = document.getElementById('questionManager');
    if (!panel) return;

    const groups = this.getClassGroups();
    panel.innerHTML = '';

    if (!groups.length) {
      const emptyState = document.createElement('div');
      emptyState.className = 'admin-empty';
      emptyState.textContent = 'No custom questions saved yet. Add one above and it will appear here.';
      panel.appendChild(emptyState);
      return;
    }

    groups.forEach(({ subject, grade, questions }) => {
      const section = document.createElement('div');
      section.className = 'admin-class-section';

      const header = document.createElement('div');
      header.className = 'admin-class-header';

      const title = document.createElement('span');
      title.textContent = `${subject.toUpperCase()} • ${grade}`;

      const removeClassBtn = document.createElement('button');
      removeClassBtn.type = 'button';
      removeClassBtn.className = 'small-btn';
      removeClassBtn.textContent = 'Remove class';
      removeClassBtn.addEventListener('click', () => {
        this.removeClass(subject, grade);
      });

      header.appendChild(title);
      header.appendChild(removeClassBtn);

      const questionList = document.createElement('div');
      questionList.className = 'admin-question-list';

      questions.forEach((question, index) => {
        const item = document.createElement('div');
        item.className = 'admin-question-item';

        const text = document.createElement('div');
        text.className = 'admin-question-text';
        text.textContent = question.q || 'Untitled question';

        const removeBtn = document.createElement('button');
        removeBtn.type = 'button';
        removeBtn.className = 'small-btn';
        removeBtn.textContent = 'Remove';
        removeBtn.addEventListener('click', () => {
          this.removeQuestion(subject, grade, index);
        });

        item.appendChild(text);
        item.appendChild(removeBtn);
        questionList.appendChild(item);
      });

      section.appendChild(header);
      section.appendChild(questionList);
      panel.appendChild(section);
    });
  },

  removeQuestion(subject, chosenClass, questionIndex) {
    const custom = this.loadCustomQuestions();
    const classQuestions = custom[subject] && custom[subject][chosenClass];

    if (!Array.isArray(classQuestions) || !classQuestions[questionIndex]) {
      this.setStatus('That question is no longer available to remove.', '#b93c5a');
      return;
    }

    classQuestions.splice(questionIndex, 1);

    if (!classQuestions.length) {
      delete custom[subject][chosenClass];
      if (!Object.keys(custom[subject] || {}).length) {
        delete custom[subject];
      }
    }

    this.saveCustomQuestions(custom);
    this.renderQuestionManager();
    document.dispatchEvent(new CustomEvent('teacher:questions-saved'));
    this.setStatus(`Removed question from ${subject.toUpperCase()} • ${chosenClass}.`, '#177b5c');
  },

  removeClass(subject, chosenClass) {
    const custom = this.loadCustomQuestions();

    if (!custom[subject] || !custom[subject][chosenClass]) {
      this.setStatus('This class section is already empty.', '#b93c5a');
      return;
    }

    delete custom[subject][chosenClass];

    if (!Object.keys(custom[subject] || {}).length) {
      delete custom[subject];
    }

    this.saveCustomQuestions(custom);
    this.renderQuestionManager();
    document.dispatchEvent(new CustomEvent('teacher:questions-saved'));
    this.setStatus(`Removed all saved questions for ${subject.toUpperCase()} • ${chosenClass}.`, '#177b5c');
  },

  buildQuestionBank(staticQuestionBank) {
    const merged = JSON.parse(JSON.stringify(staticQuestionBank));
    const custom = this.loadCustomQuestions();

    Object.keys(custom).forEach((subject) => {
      if (!merged[subject]) return;
      Object.keys(custom[subject] || {}).forEach((grade) => {
        if (!Array.isArray(custom[subject][grade])) return;
        merged[subject][grade] = [...custom[subject][grade], ...(merged[subject][grade] || [])];
      });
    });

    return merged;
  },

  init() {
    const toggleBtn = document.getElementById('toggleAdminBtn');
    const adminPanel = document.getElementById('adminPanel');
    const saveBtn = document.getElementById('saveQuestionBtn');

    if (toggleBtn && adminPanel) {
      toggleBtn.addEventListener('click', () => {
        adminPanel.classList.toggle('hidden');
      });
    }

    this.seedBrightFutureClass4MathQuestions();
    this.renderQuestionManager();

    if (saveBtn) {
      saveBtn.addEventListener('click', () => {
      const subject = document.getElementById('adminSubject').value;
      const chosenClass = document.getElementById('adminClass').value;
      const question = document.getElementById('adminQuestion').value.trim();
      const options = [
        document.getElementById('adminOption1').value.trim(),
        document.getElementById('adminOption2').value.trim(),
        document.getElementById('adminOption3').value.trim(),
        document.getElementById('adminOption4').value.trim()
      ];
      const answer = Number(document.getElementById('adminCorrect').value);
      const feedback = document.getElementById('adminFeedback').value.trim() || 'Good work!';

      if (!question || options.some((option) => !option)) {
        this.setStatus('Please fill in the question and all 4 options.', '#b93c5a');
        return;
      }

      const custom = this.loadCustomQuestions();
      if (!custom[subject]) custom[subject] = {};
      if (!Array.isArray(custom[subject][chosenClass])) custom[subject][chosenClass] = [];

      custom[subject][chosenClass].push({
        q: question,
        o: options,
        a: answer,
        e: feedback
      });

      try {
        this.saveCustomQuestions(custom);
      } catch (error) {
        this.setStatus("Could not save this question. Check this browser's storage settings.", '#b93c5a');
        return;
      }
      this.renderQuestionManager();
      document.dispatchEvent(new CustomEvent('teacher:questions-saved'));

      this.setStatus(`Saved for ${subject.toUpperCase()} • ${chosenClass}. It will appear first in that quiz.`, '#177b5c');

        ['adminQuestion', 'adminOption1', 'adminOption2', 'adminOption3', 'adminOption4', 'adminFeedback'].forEach((id) => {
          document.getElementById(id).value = '';
        });
        document.getElementById('adminCorrect').value = '0';
      });
    }
  }
};

window.addEventListener('DOMContentLoaded', () => { window.teacherAdmin.init(); });
