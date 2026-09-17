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
      <div class="partner-detail">Телефон: ${partner.phone ?? '—'}</div>
      <div class="partner-detail">Рейтинг: ${partner.rating ?? '—'}</div>
    `;
    list.appendChild(card);
  }
}

async function loadPartners() {
  const list = document.getElementById('partners-list');
  try {
    const response = await fetch('/api/partners');
    if (!response.ok) {
      throw new Error(`сервер ответил ${response.status}`);
    }
    const partners = await response.json();
    renderPartners(partners);
  } catch (err) {
    list.innerHTML = '<p class="error-message">Не удалось загрузить список партнёров</p>';
  }
}

loadPartners();
