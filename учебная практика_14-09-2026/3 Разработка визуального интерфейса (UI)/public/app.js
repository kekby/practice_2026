async function loadPartners() {
  const response = await fetch('/api/partners');
  const partners = await response.json();

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
      <div class="partner-detail">Телефон: ${partner.phone ?? '—'}</div>
      <div class="partner-detail">Рейтинг: ${partner.rating ?? '—'}</div>
    `;
    list.appendChild(card);
  }
}

loadPartners();
