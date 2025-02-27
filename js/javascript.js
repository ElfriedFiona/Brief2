const faqItems = document.querySelectorAll('.faq-item');

faqItems.forEach(item => {
  const question = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  const toggle = item.querySelector('.faq-toggle');

  question.addEventListener('click', () => {
    answer.classList.toggle('show');
    toggle.textContent = answer.classList.contains('show') ? '▲' : '▼';
  });
});