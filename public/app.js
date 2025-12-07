async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error('Request failed');
  return res.json();
}

function createDestinationCard(destination) {
  const card = document.createElement('article');
  card.className = 'card';

  const badge = document.createElement('span');
  badge.className = 'badge';
  badge.textContent = destination.country;
  card.appendChild(badge);

  const title = document.createElement('h3');
  title.textContent = destination.name;
  card.appendChild(title);

  const desc = document.createElement('p');
  desc.textContent = destination.description;
  card.appendChild(desc);

  const highlights = document.createElement('div');
  highlights.className = 'highlights';
  destination.highlights.forEach(item => {
    const chip = document.createElement('span');
    chip.className = 'pill';
    chip.textContent = item;
    highlights.appendChild(chip);
  });
  card.appendChild(highlights);

  const priceRow = document.createElement('div');
  priceRow.className = 'price-row';
  const price = document.createElement('span');
  price.textContent = `$${destination.price} · ${destination.duration}`;
  const cta = document.createElement('a');
  cta.href = '#quote';
  cta.className = 'btn ghost';
  cta.textContent = 'Plan this trip';
  priceRow.append(price, cta);
  card.appendChild(priceRow);

  return card;
}

function createFaqCard(faq) {
  const card = document.createElement('article');
  card.className = 'faq';

  const question = document.createElement('h4');
  question.textContent = faq.question;
  const answer = document.createElement('p');
  answer.textContent = faq.answer;
  card.append(question, answer);

  return card;
}

async function renderDestinations() {
  try {
    const data = await fetchJSON('/api/destinations');
    const grid = document.getElementById('destination-grid');
    data.destinations.forEach(dest => grid.appendChild(createDestinationCard(dest)));
  } catch (err) {
    console.error(err);
  }
}

async function renderFaqs() {
  try {
    const data = await fetchJSON('/api/faqs');
    const grid = document.getElementById('faq-grid');
    data.faqs.forEach(faq => grid.appendChild(createFaqCard(faq)));
  } catch (err) {
    console.error(err);
  }
}

function handleFormSubmit() {
  const form = document.getElementById('quote-form');
  const message = document.getElementById('form-message');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.textContent = 'Sending your request...';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message || 'Unable to send request');

      message.textContent = 'Thanks! A travel designer will reach out within one business day.';
      form.reset();
    } catch (err) {
      console.error(err);
      message.textContent = 'Something went wrong. Please check your details and try again.';
    }
  });
}

renderDestinations();
renderFaqs();
handleFormSubmit();
