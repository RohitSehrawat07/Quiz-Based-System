const STORAGE_KEY = 'brightFutureCustomQuestions';

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

    toggleBtn.addEventListener('click', () => {
      adminPanel.classList.toggle('hidden');
    });

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
      document.dispatchEvent(new CustomEvent('teacher:questions-saved'));

      this.setStatus(`Saved for ${subject.toUpperCase()} • ${chosenClass}. It will appear first in that quiz.`, '#177b5c');

      ['adminQuestion', 'adminOption1', 'adminOption2', 'adminOption3', 'adminOption4', 'adminFeedback'].forEach((id) => {
        document.getElementById(id).value = '';
      });
      document.getElementById('adminCorrect').value = '0';
    });
  }
};

window.addEventListener('DOMContentLoaded', () => { window.teacherAdmin.init(); });
