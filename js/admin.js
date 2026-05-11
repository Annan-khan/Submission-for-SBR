const adminSection = document.getElementById('section-admin');
if (!adminSection) {
  return;
}

const sectionListEl = document.getElementById('section-list');
const sectionSelect = document.getElementById('section-select');
const sectionKeyInput = document.getElementById('section-key');
const sectionNameInput = document.getElementById('section-name');
const sectionDataInput = document.getElementById('section-data');
const sectionMessage = document.getElementById('section-message');
const loadSectionsBtn = document.getElementById('section-load');
const saveSectionBtn = document.getElementById('section-save');
const deleteSectionBtn = document.getElementById('section-delete');
const newSectionBtn = document.getElementById('section-new');

const apiUrl = '/api/sections';
let currentSections = [];

const showMessage = (text, isError = false) => {
  if (!sectionMessage) return;
  sectionMessage.textContent = text;
  sectionMessage.style.color = isError ? '#b00020' : '#026936';
};

const renderSectionList = (sections) => {
  if (!sectionListEl) return;
  sectionListEl.innerHTML = '';
  sections.forEach((section) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = 'btn btn--ghost btn--pill';
    item.style.margin = '4px';
    item.textContent = `${section.key} (${section.name})`;
    item.addEventListener('click', () => loadSection(section.key));
    sectionListEl.appendChild(item);
  });
};

const fillSectionForm = (section) => {
  sectionKeyInput.value = section.key || '';
  sectionNameInput.value = section.name || '';
  sectionDataInput.value = JSON.stringify(section.data || {}, null, 2);
};

const clearSectionForm = () => {
  sectionKeyInput.value = '';
  sectionNameInput.value = '';
  sectionDataInput.value = '{}';
  showMessage('Ready for a new section.');
};

const loadSections = async () => {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    currentSections = Array.isArray(data) ? data : [];
    renderSectionList(currentSections);
    if (sectionSelect) {
      sectionSelect.innerHTML = `<option value="" disabled selected>Choose section</option>`;
      currentSections.forEach((section) => {
        const option = document.createElement('option');
        option.value = section.key;
        option.textContent = section.name;
        sectionSelect.appendChild(option);
      });
    }
    showMessage('Sections loaded.');
  } catch (err) {
    showMessage('Unable to load sections.', true);
    console.error(err);
  }
};

const loadSection = async (key) => {
  if (!key) return;
  try {
    const response = await fetch(`${apiUrl}/${encodeURIComponent(key)}`);
    if (!response.ok) throw new Error('Section not found');
    const section = await response.json();
    fillSectionForm(section);
    showMessage(`Loaded section: ${section.key}`);
  } catch (err) {
    showMessage('Unable to load section.', true);
    console.error(err);
  }
};

const saveSection = async () => {
  try {
    const key = sectionKeyInput.value.trim();
    const name = sectionNameInput.value.trim();
    const data = JSON.parse(sectionDataInput.value || '{}');

    if (!key || !name) {
      showMessage('Key and name are required.', true);
      return;
    }

    const existing = currentSections.find((section) => section.key === key);
    const payload = { key, name, data };
    const method = existing ? 'PUT' : 'POST';
    const url = existing ? `${apiUrl}/${encodeURIComponent(key)}` : apiUrl;

    const response = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Save failed');
    }

    await loadSections();
    fillSectionForm(result);
    showMessage(existing ? 'Section updated.' : 'Section created.');
  } catch (err) {
    showMessage(err.message || 'Unable to save section.', true);
    console.error(err);
  }
};

const deleteSection = async () => {
  const key = sectionKeyInput.value.trim();
  if (!key) {
    showMessage('Section key is required to delete.', true);
    return;
  }
  try {
    const response = await fetch(`${apiUrl}/${encodeURIComponent(key)}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Delete failed');
    }
    clearSectionForm();
    await loadSections();
    showMessage('Section deleted.');
  } catch (err) {
    showMessage(err.message || 'Unable to delete section.', true);
    console.error(err);
  }
};

loadSections();

if (loadSectionsBtn) {
  loadSectionsBtn.addEventListener('click', () => loadSections());
}
if (saveSectionBtn) {
  saveSectionBtn.addEventListener('click', (event) => {
    event.preventDefault();
    saveSection();
  });
}
if (deleteSectionBtn) {
  deleteSectionBtn.addEventListener('click', (event) => {
    event.preventDefault();
    deleteSection();
  });
}
if (newSectionBtn) {
  newSectionBtn.addEventListener('click', (event) => {
    event.preventDefault();
    clearSectionForm();
  });
}
if (sectionSelect) {
  sectionSelect.addEventListener('change', (event) => {
    loadSection(event.target.value);
  });
}
