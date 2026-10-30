const STORAGE_KEY = 'brightFutureCustomQuestions';

window.teacherAdmin = {
  loadCustomQuestions() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch (error) {
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
        merged[subject][grade] = [...(merged[subject][grade] || []), ...custom[subject][grade]];
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
      const statusText = document.getElementById('adminStatus');

      if (!question || options.some((option) => !option)) {
        statusText.textContent = 'Please fill in the question and all 4 options.';
        statusText.style.color = '#b93c5a';
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

      this.saveCustomQuestions(custom);
      document.dispatchEvent(new CustomEvent('teacher:questions-saved'));

      statusText.textContent = `Saved for ${subject.toUpperCase()} • ${chosenClass}`;
      statusText.style.color = '#177b5c';

      ['adminQuestion', 'adminOption1', 'adminOption2', 'adminOption3', 'adminOption4', 'adminFeedback'].forEach((id) => {
        document.getElementById(id).value = '';
      });
      document.getElementById('adminCorrect').value = '0';
    });
  }
};

window.addEventListener('DOMContentLoaded', () => { window.teacherAdmin.init(); });
