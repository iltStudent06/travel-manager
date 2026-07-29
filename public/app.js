const messageEl = document.getElementById('message');
const destinationModal = document.getElementById('destinationModal');
const destinationModalTitle = document.getElementById('destinationModalTitle');
const destinationModalSubmit = document.getElementById('destinationModalSubmit');
const destinationModalForm = document.getElementById('destinationModalForm');
const packageModal = document.getElementById('packageModal');
const packageModalTitle = document.getElementById('packageModalTitle');
const packageModalSubmit = document.getElementById('packageModalSubmit');
const packageModalForm = document.getElementById('packageModalForm');

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

function openDestinationModal(mode, item = null) {
  if (mode === 'edit' && item) {
    document.getElementById('destinationId').value = item.id;
    document.getElementById('destinationName').value = item.name;
    document.getElementById('destinationCountry').value = item.country;
    document.getElementById('destinationDescription').value = item.description;
    destinationModalTitle.textContent = 'Edit Destination';
    destinationModalSubmit.textContent = 'Update Destination';
  } else {
    destinationModalForm.reset();
    document.getElementById('destinationId').value = '';
    destinationModalTitle.textContent = 'Add Destination';
    destinationModalSubmit.textContent = 'Save Destination';
  }

  destinationModal.classList.remove('hidden');
}

function closeDestinationModal() {
  destinationModal.classList.add('hidden');
  destinationModalForm.reset();
  document.getElementById('destinationId').value = '';
}

function openPackageModal(mode, item = null) {
  if (mode === 'edit' && item) {
    document.getElementById('packageId').value = item.id;
    document.getElementById('packageTitle').value = item.title;
    document.getElementById('packageDestinationId').value = item.destinationId;
    document.getElementById('packagePrice').value = item.price;
    document.getElementById('packageDuration').value = item.durationDays;
    packageModalTitle.textContent = 'Edit Package';
    packageModalSubmit.textContent = 'Update Package';
  } else {
    packageModalForm.reset();
    document.getElementById('packageId').value = '';
    packageModalTitle.textContent = 'Add Package';
    packageModalSubmit.textContent = 'Save Package';
  }

  packageModal.classList.remove('hidden');
}

function closePackageModal() {
  packageModal.classList.add('hidden');
  packageModalForm.reset();
  document.getElementById('packageId').value = '';
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
    actions.className = 'actions-cell';
    const group = document.createElement('div');
    group.className = 'action-buttons';
    group.append(
      button('Edit', 'edit-button', () => {
        openDestinationModal('edit', item);
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
    actions.className = 'actions-cell';
    const group = document.createElement('div');
    group.className = 'action-buttons';
    group.append(
      button('Edit', 'edit-button', () => {
        openPackageModal('edit', item);
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

destinationModalForm.addEventListener('submit', async (event) => {
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

    closeDestinationModal();
    await loadDestinations(document.getElementById('destinationFilter').value);
  } catch (error) {
    setMessage(error.message, true);
  }
});

packageModalForm.addEventListener('submit', async (event) => {
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

    closePackageModal();
    await loadPackages();
  } catch (error) {
    setMessage(error.message, true);
  }
});

document.getElementById('openDestinationModal').addEventListener('click', () => {
  openDestinationModal('create');
});

document.getElementById('destinationModalCancel').addEventListener('click', closeDestinationModal);
destinationModal.addEventListener('click', (event) => {
  if (event.target === destinationModal) {
    closeDestinationModal();
  }
});

document.getElementById('openPackageModal').addEventListener('click', () => {
  openPackageModal('create');
});

document.getElementById('packageModalCancel').addEventListener('click', closePackageModal);
packageModal.addEventListener('click', (event) => {
  if (event.target === packageModal) {
    closePackageModal();
  }
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