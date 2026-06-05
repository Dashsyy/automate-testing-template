const STATUSES = ['Not Tested', 'Pass', 'Fail', 'Blocked', 'Skipped'];
const PRIORITIES = ['High', 'Medium', 'Low'];
const TYPES = ['E2E', 'API', 'Manual'];
const ROLES = ['User', 'Admin', 'Guest', 'Any'];

let sheets = [];
let currentSheetId = null;
let currentSheet = null;
let saveTimer = null;

// ── DOM refs ──────────────────────────────────────────────────────────────────
const sheetList       = document.getElementById('sheet-list');
const emptyState      = document.getElementById('empty-state');
const sheetView       = document.getElementById('sheet-view');
const sheetTitle      = document.getElementById('sheet-title');
const sheetProject    = document.getElementById('sheet-project');
const tbody           = document.getElementById('tc-tbody');
const modalOverlay    = document.getElementById('modal-overlay');
const toast           = document.getElementById('toast');

// ── Init ──────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadSheets();

  document.getElementById('btn-new-sheet').addEventListener('click', openModal);
  document.getElementById('btn-new-sheet-empty').addEventListener('click', openModal);
  document.getElementById('btn-modal-cancel').addEventListener('click', closeModal);
  document.getElementById('btn-modal-create').addEventListener('click', createSheet);
  document.getElementById('btn-add-row').addEventListener('click', addRow);
  document.getElementById('btn-delete-sheet').addEventListener('click', deleteSheet);
  document.getElementById('btn-export-excel').addEventListener('click', () => exportSheet('excel'));
  document.getElementById('btn-export-csv').addEventListener('click', () => exportSheet('csv'));

  document.getElementById('input-feature').addEventListener('keydown', e => {
    if (e.key === 'Enter') createSheet();
  });
});

// ── API helpers ───────────────────────────────────────────────────────────────
async function api(method, path, body) {
  const res = await fetch(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : {},
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

// ── Sheet list ────────────────────────────────────────────────────────────────
async function loadSheets() {
  sheets = await api('GET', '/api/sheets');
  renderSidebar();
}

function renderSidebar() {
  sheetList.innerHTML = '';
  if (sheets.length === 0) {
    sheetList.innerHTML = '<li style="color:#9ca3af;font-size:12px;padding:8px 10px;">No sheets yet</li>';
    return;
  }
  sheets.forEach(s => {
    const li = document.createElement('li');
    li.dataset.id = s.id;
    if (s.id === currentSheetId) li.classList.add('active');
    li.innerHTML = `
      <span class="sheet-name" title="${s.feature}">${s.feature}</span>
      <span class="sheet-badge">${s.project}</span>
    `;
    li.addEventListener('click', () => selectSheet(s.id));
    sheetList.appendChild(li);
  });
}

async function selectSheet(id) {
  currentSheetId = id;
  currentSheet = await api('GET', `/api/sheets/${id}`);
  renderSidebar();
  renderSheet();
  emptyState.classList.add('hidden');
  sheetView.classList.remove('hidden');
}

// ── Sheet view ────────────────────────────────────────────────────────────────
function renderSheet() {
  sheetTitle.textContent = currentSheet.feature || 'Untitled';
  sheetProject.textContent = currentSheet.project || '';
  renderTable();
  updateSummary();
}

function renderTable() {
  tbody.innerHTML = '';
  (currentSheet.testCases || []).forEach((tc, idx) => {
    tbody.appendChild(buildRow(tc, idx));
  });
}

function buildRow(tc, idx) {
  const tr = document.createElement('tr');
  tr.dataset.idx = idx;

  tr.innerHTML = `
    <td><div class="editable" contenteditable="true" data-field="id">${esc(tc.id)}</div></td>
    <td><div class="editable" contenteditable="true" data-field="title">${esc(tc.title)}</div></td>
    <td>${buildSelect('priority', PRIORITIES, tc.priority, priorityClass)}</td>
    <td>${buildSelect('type', TYPES, tc.type)}</td>
    <td>${buildSelect('role', ROLES, tc.role)}</td>
    <td><div class="editable" contenteditable="true" data-field="steps">${esc(Array.isArray(tc.steps) ? tc.steps.join('\n') : tc.steps)}</div></td>
    <td><div class="editable" contenteditable="true" data-field="expectedResult">${esc(tc.expectedResult)}</div></td>
    <td><div class="editable" contenteditable="true" data-field="actualResult">${esc(tc.actualResult)}</div></td>
    <td>${buildSelect('status', STATUSES, tc.status, statusClass)}</td>
    <td><div class="editable" contenteditable="true" data-field="bugReport">${esc(tc.bugReport)}</div></td>
    <td><div class="editable" contenteditable="true" data-field="notes">${esc(tc.notes)}</div></td>
    <td><button class="btn-row-delete" title="Delete row">✕</button></td>
  `;

  // Editable cells
  tr.querySelectorAll('[contenteditable]').forEach(cell => {
    cell.addEventListener('blur', () => {
      const field = cell.dataset.field;
      let value = cell.innerText.trim();
      if (field === 'steps') {
        currentSheet.testCases[idx][field] = value.split('\n').filter(s => s.trim());
      } else {
        currentSheet.testCases[idx][field] = value;
      }
      scheduleSave();
      updateSummary();
    });
    cell.addEventListener('keydown', e => {
      if (e.key === 'Enter' && !e.shiftKey && cell.dataset.field !== 'steps') {
        e.preventDefault();
        cell.blur();
      }
      if (e.key === 'Escape') {
        cell.blur();
      }
    });
  });

  // Select dropdowns
  tr.querySelectorAll('select').forEach(sel => {
    applySelectStyle(sel);
    sel.addEventListener('change', () => {
      const field = sel.dataset.field;
      currentSheet.testCases[idx][field] = sel.value;
      applySelectStyle(sel);
      scheduleSave();
      updateSummary();
    });
  });

  // Delete row
  tr.querySelector('.btn-row-delete').addEventListener('click', () => {
    if (confirm('Delete this test case?')) {
      currentSheet.testCases.splice(idx, 1);
      renderTable();
      updateSummary();
      scheduleSave();
    }
  });

  return tr;
}

function buildSelect(field, options, value, classFn) {
  const opts = options.map(o =>
    `<option value="${o}" ${o === value ? 'selected' : ''}>${o}</option>`
  ).join('');
  const cls = classFn ? classFn(value) : '';
  return `<select class="cell-select ${cls}" data-field="${field}">${opts}</select>`;
}

function applySelectStyle(sel) {
  const field = sel.dataset.field;
  if (field === 'status') {
    sel.className = `cell-select ${statusClass(sel.value)}`;
  } else if (field === 'priority') {
    sel.className = `cell-select ${priorityClass(sel.value)}`;
  }
}

function statusClass(status) {
  const map = { 'Pass': 'badge-pass', 'Fail': 'badge-fail', 'Blocked': 'badge-blocked', 'Skipped': 'badge-skipped', 'Not Tested': 'badge-not-tested' };
  return map[status] || 'badge-not-tested';
}

function priorityClass(priority) {
  const map = { 'High': 'badge-high', 'Medium': 'badge-medium', 'Low': 'badge-low' };
  return map[priority] || '';
}

function updateSummary() {
  const tcs = currentSheet.testCases || [];
  const counts = { Pass: 0, Fail: 0, Blocked: 0, 'Not Tested': 0, Skipped: 0 };
  tcs.forEach(tc => { counts[tc.status] = (counts[tc.status] || 0) + 1; });
  document.getElementById('count-pass').textContent = counts.Pass;
  document.getElementById('count-fail').textContent = counts.Fail;
  document.getElementById('count-blocked').textContent = counts.Blocked;
  document.getElementById('count-not-tested').textContent = (counts['Not Tested'] || 0) + (counts.Skipped || 0);
  document.getElementById('count-total').textContent = tcs.length;
}

// ── Add / delete row ──────────────────────────────────────────────────────────
function addRow() {
  const tcs = currentSheet.testCases || [];
  const feature = guessFeatureCode();
  const nextNum = String(tcs.length + 1).padStart(3, '0');
  tcs.push({
    id: `TC-${feature}-${nextNum}`,
    title: '',
    priority: 'Medium',
    type: 'E2E',
    role: 'User',
    preconditions: '',
    steps: [],
    expectedResult: '',
    actualResult: '',
    status: 'Not Tested',
    bugReport: '',
    notes: '',
  });
  currentSheet.testCases = tcs;
  renderTable();
  updateSummary();
  scheduleSave();

  // Focus the title cell of the new row
  const rows = tbody.querySelectorAll('tr');
  const lastRow = rows[rows.length - 1];
  if (lastRow) {
    const titleCell = lastRow.querySelector('[data-field="title"]');
    if (titleCell) { titleCell.focus(); }
    lastRow.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }
}

function guessFeatureCode() {
  const feature = (currentSheet.feature || 'FEATURE').toUpperCase();
  const words = feature.split(/\s+/);
  if (words.length >= 2) return words.map(w => w[0]).join('');
  return feature.replace(/[^A-Z]/g, '').slice(0, 6) || 'TC';
}

// ── Save ──────────────────────────────────────────────────────────────────────
function scheduleSave() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(saveSheet, 600);
}

async function saveSheet() {
  try {
    await api('PUT', `/api/sheets/${currentSheetId}`, currentSheet);
  } catch (e) {
    showToast('Save failed: ' + e.message, true);
  }
}

// ── Create / delete sheet ─────────────────────────────────────────────────────
async function createSheet() {
  const project = document.getElementById('input-project').value.trim();
  const feature = document.getElementById('input-feature').value.trim();
  const preparedBy = document.getElementById('input-prepared-by').value.trim();

  if (!project || !feature) {
    showToast('Project and Feature name are required');
    return;
  }

  const id = feature.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  try {
    await api('POST', '/api/sheets', {
      id, project, feature, preparedBy,
      date: new Date().toISOString().split('T')[0],
      testCases: [],
    });
    closeModal();
    await loadSheets();
    selectSheet(id);
    showToast(`"${feature}" sheet created`);
  } catch (e) {
    showToast('Error: ' + e.message, true);
  }
}

async function deleteSheet() {
  if (!confirm(`Delete "${currentSheet.feature}"? This cannot be undone.`)) return;
  await api('DELETE', `/api/sheets/${currentSheetId}`);
  currentSheetId = null;
  currentSheet = null;
  sheetView.classList.add('hidden');
  emptyState.classList.remove('hidden');
  await loadSheets();
  showToast('Sheet deleted');
}

// ── Export ────────────────────────────────────────────────────────────────────
function exportSheet(format) {
  window.location.href = `/api/export/${currentSheetId}/${format}`;
}

// ── Modal ─────────────────────────────────────────────────────────────────────
function openModal() {
  document.getElementById('input-project').value = '';
  document.getElementById('input-feature').value = '';
  document.getElementById('input-prepared-by').value = '';
  modalOverlay.classList.remove('hidden');
  setTimeout(() => document.getElementById('input-project').focus(), 50);
}

function closeModal() {
  modalOverlay.classList.add('hidden');
}

modalOverlay.addEventListener('click', e => {
  if (e.target === modalOverlay) closeModal();
});

// ── Toast ─────────────────────────────────────────────────────────────────────
let toastTimer = null;
function showToast(msg, isError = false) {
  toast.textContent = msg;
  toast.style.background = isError ? '#dc2626' : '#1a1d23';
  toast.classList.remove('hidden');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.add('hidden'), 2500);
}

// ── Utils ─────────────────────────────────────────────────────────────────────
function esc(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
