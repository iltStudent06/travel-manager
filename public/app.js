const messageEl = document.getElementById('message');

function setMessage(text, isError = false) {
  messageEl.textContent = text;
  messageEl.style.color = isError ? '#b91c1c' : '#166534';
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });

  if (response.status === 204) {
    return null;
  }

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Request failed');
  }

  return payload;
}

function button(label, className, onClick) {
  const btn = document.createElement('button');
  btn.type = 'button';
  btn.className = className;
  btn.textContent = label;
  btn.addEventListener('click', onClick);
  return btn;
}

function rowCell(content) {
  const td = document.createElement('td');
  td.textContent = content;
  return td;
}

async function loadDestinations(filter = '') {
  const query = filter ? `?destination=${encodeURIComponent(filter)}` : '';
  const destinations = await request(`/api/destinations${query}`);
  const tbody = document.getElementById('destinationsTable');
  tbody.innerHTML = '';

  destinations.forEach((item) => {
    const tr = document.createElement('tr');
    tr.append(rowCell(String(item.id)));
    tr.append(rowCell(item.name));
    tr.append(rowCell(item.country));
    tr.append(rowCell(item.description));

    const actions = document.createElement('td');
    const group = document.createElement('div');
    group.className = 'action-buttons';
    group.append(
      button('Edit', '', () => {
        document.getElementById('destinationId').value = item.id;
        document.getElementById('destinationName').value = item.name;
        document.getElementById('destinationCountry').value = item.country;
        document.getElementById('destinationDescription').value = item.description;
      })
    );
    group.append(
      button('Delete', 'danger', async () => {
        await request(`/api/destinations/${item.id}`, { method: 'DELETE' });
        setMessage('Destination deleted');
        await loadDestinations(document.getElementById('destinationFilter').value);
      })
    );
    actions.append(group);
    tr.append(actions);
    tbody.append(tr);
  });
}

async function loadPackages() {
  const items = await request('/api/packages');
  const tbody = document.getElementById('packagesTable');
  tbody.innerHTML = '';

  items.forEach((item) => {
    const tr = document.createElement('tr');
    tr.append(rowCell(String(item.id)));
    tr.append(rowCell(item.title));
    tr.append(rowCell(String(item.destinationId)));
    tr.append(rowCell(String(item.price)));
    tr.append(rowCell(String(item.durationDays)));

    const actions = document.createElement('td');
    const group = document.createElement('div');
    group.className = 'action-buttons';
    group.append(
      button('Edit', '', () => {
        document.getElementById('packageId').value = item.id;
        document.getElementById('packageTitle').value = item.title;
        document.getElementById('packageDestinationId').value = item.destinationId;
        document.getElementById('packagePrice').value = item.price;
        document.getElementById('packageDuration').value = item.durationDays;
      })
    );
    group.append(
      button('Delete', 'danger', async () => {
        await request(`/api/packages/${item.id}`, { method: 'DELETE' });
        setMessage('Package deleted');
        await loadPackages();
      })
    );
    actions.append(group);
    tr.append(actions);
    tbody.append(tr);
  });
}

document.getElementById('destinationForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const id = document.getElementById('destinationId').value;
    const body = {
      name: document.getElementById('destinationName').value,
      country: document.getElementById('destinationCountry').value,
      description: document.getElementById('destinationDescription').value
    };

    if (id) {
      await request(`/api/destinations/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      setMessage('Destination updated');
    } else {
      await request('/api/destinations', { method: 'POST', body: JSON.stringify(body) });
      setMessage('Destination created');
    }

    event.target.reset();
    document.getElementById('destinationId').value = '';
    await loadDestinations(document.getElementById('destinationFilter').value);
  } catch (error) {
    setMessage(error.message, true);
  }
});

document.getElementById('packageForm').addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const id = document.getElementById('packageId').value;
    const body = {
      title: document.getElementById('packageTitle').value,
      destinationId: Number(document.getElementById('packageDestinationId').value),
      price: Number(document.getElementById('packagePrice').value),
      durationDays: Number(document.getElementById('packageDuration').value)
    };

    if (id) {
      await request(`/api/packages/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      setMessage('Package updated');
    } else {
      await request('/api/packages', { method: 'POST', body: JSON.stringify(body) });
      setMessage('Package created');
    }

    event.target.reset();
    document.getElementById('packageId').value = '';
    await loadPackages();
  } catch (error) {
    setMessage(error.message, true);
  }
});

document.getElementById('destinationCancel').addEventListener('click', () => {
  document.getElementById('destinationForm').reset();
  document.getElementById('destinationId').value = '';
});

document.getElementById('packageCancel').addEventListener('click', () => {
  document.getElementById('packageForm').reset();
  document.getElementById('packageId').value = '';
});

document.getElementById('applyDestinationFilter').addEventListener('click', async () => {
  try {
    await loadDestinations(document.getElementById('destinationFilter').value);
    setMessage('Destination filter applied');
  } catch (error) {
    setMessage(error.message, true);
  }
});

document.getElementById('refreshDestinations').addEventListener('click', async () => {
  try {
    await loadDestinations(document.getElementById('destinationFilter').value);
    setMessage('Destinations refreshed');
  } catch (error) {
    setMessage(error.message, true);
  }
});

document.getElementById('refreshPackages').addEventListener('click', async () => {
  try {
    await loadPackages();
    setMessage('Packages refreshed');
  } catch (error) {
    setMessage(error.message, true);
  }
});

async function init() {
  try {
    await Promise.all([loadDestinations(), loadPackages()]);
    setMessage('Data loaded');
  } catch (error) {
    setMessage(error.message, true);
  }
}

init();