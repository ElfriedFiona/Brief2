const cvItems = document.querySelectorAll('.cv-item');

cvItems.forEach(item => {
  item.addEventListener('mouseenter', () => {
    item.style.transform = 'scale(1.05)'; // Légère augmentation de taille
    item.style.boxShadow = '5px 5px 10px rgba(0, 0, 0, 0.2)'; // Ombre plus prononcée
  });

  item.addEventListener('mouseleave', () => {
    item.style.transform = 'scale(1)'; // Retour à la taille normale
    item.style.boxShadow = '2px 2px 5px rgba(0, 0, 0, 0.1)'; // Ombre initiale
  });
});

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


