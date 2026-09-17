const MOCK_PARTNERS = [
  { companyName: 'ООО "Логистик-Экспресс"', inn: '7701234567', phone: '+7 (999) 111-22-33', rating: '4.8', discountPercent: 0 },
  { companyName: 'ИП Петров А.В.', inn: '5001098765', phone: '—', rating: '4.2', discountPercent: 5 },
  { companyName: 'ТК "Быстрый Путь"', inn: '7812345678', phone: '+78125554433', rating: '—', discountPercent: 10 },
];

function renderPartners(partners) {
  const list = document.getElementById('partners-list');
  list.innerHTML = '';

  for (const partner of partners) {
    const card = document.createElement('div');
    card.className = 'partner-card';
    card.innerHTML = `
      <div class="partner-card-top">
        <span>${partner.companyName}</span>
        <span>${partner.discountPercent}%</span>
      </div>
      <div class="partner-detail">ИНН: ${partner.inn}</div>
      <div class="partner-detail">Телефон: ${partner.phone}</div>
      <div class="partner-detail">Рейтинг: ${partner.rating}</div>
    `;
    list.appendChild(card);
  }
}

renderPartners(MOCK_PARTNERS);
