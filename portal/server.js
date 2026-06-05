import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import XLSX from 'xlsx';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const DATA_DIR = path.join(__dirname, '..', 'data');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// List all sheets
app.get('/api/sheets', (req, res) => {
  const files = fs.readdirSync(DATA_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const data = JSON.parse(fs.readFileSync(path.join(DATA_DIR, f), 'utf8'));
      return { id: f.replace('.json', ''), project: data.project, feature: data.feature };
    });
  res.json(files);
});

// Get one sheet
app.get('/api/sheets/:id', (req, res) => {
  const file = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  res.json(JSON.parse(fs.readFileSync(file, 'utf8')));
});

// Create sheet
app.post('/api/sheets', (req, res) => {
  const { id, ...data } = req.body;
  const safeId = id.replace(/[^a-z0-9-_]/gi, '-').toLowerCase();
  const file = path.join(DATA_DIR, `${safeId}.json`);
  if (fs.existsSync(file)) return res.status(409).json({ error: 'Sheet with this ID already exists' });
  fs.writeFileSync(file, JSON.stringify({ ...data, testCases: [] }, null, 2));
  res.json({ id: safeId });
});

// Save sheet
app.put('/api/sheets/:id', (req, res) => {
  const file = path.join(DATA_DIR, `${req.params.id}.json`);
  fs.writeFileSync(file, JSON.stringify(req.body, null, 2));
  res.json({ ok: true });
});

// Delete sheet
app.delete('/api/sheets/:id', (req, res) => {
  const file = path.join(DATA_DIR, `${req.params.id}.json`);
  if (fs.existsSync(file)) fs.unlinkSync(file);
  res.json({ ok: true });
});

// Export Excel
app.get('/api/export/:id/excel', (req, res) => {
  const file = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  const sheet = JSON.parse(fs.readFileSync(file, 'utf8'));

  const rows = (sheet.testCases || []).map(tc => ({
    'TC ID': tc.id || '',
    'Title': tc.title || '',
    'Priority': tc.priority || '',
    'Type': tc.type || '',
    'Role': tc.role || '',
    'Pre-conditions': tc.preconditions || '',
    'Steps': Array.isArray(tc.steps) ? tc.steps.join('\n') : (tc.steps || ''),
    'Expected Result': tc.expectedResult || '',
    'Actual Result': tc.actualResult || '',
    'Status': tc.status || 'Not Tested',
    'Bug Report': tc.bugReport || '',
    'Notes': tc.notes || '',
  }));

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(rows);

  // Column widths
  ws['!cols'] = [
    { wch: 16 }, { wch: 36 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
    { wch: 28 }, { wch: 36 }, { wch: 36 }, { wch: 36 }, { wch: 12 },
    { wch: 28 }, { wch: 28 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Test Cases');

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}.xlsx"`);
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.send(buf);
});

// Export CSV
app.get('/api/export/:id/csv', (req, res) => {
  const file = path.join(DATA_DIR, `${req.params.id}.json`);
  if (!fs.existsSync(file)) return res.status(404).json({ error: 'Not found' });
  const sheet = JSON.parse(fs.readFileSync(file, 'utf8'));

  const headers = ['TC ID', 'Title', 'Priority', 'Type', 'Role', 'Pre-conditions', 'Steps', 'Expected Result', 'Actual Result', 'Status', 'Bug Report', 'Notes'];
  const escape = v => `"${(v || '').toString().replace(/"/g, '""')}"`;

  const rows = (sheet.testCases || []).map(tc => [
    tc.id, tc.title, tc.priority, tc.type, tc.role, tc.preconditions,
    Array.isArray(tc.steps) ? tc.steps.join(' | ') : (tc.steps || ''),
    tc.expectedResult, tc.actualResult, tc.status, tc.bugReport, tc.notes,
  ].map(escape).join(','));

  const csv = [headers.map(escape).join(','), ...rows].join('\n');
  res.setHeader('Content-Disposition', `attachment; filename="${req.params.id}.csv"`);
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.send('﻿' + csv); // BOM for Excel UTF-8 compatibility
});

const PORT = process.env.PORTAL_PORT || 3333;
app.listen(PORT, () => {
  console.log(`\n  QA Portal  →  http://localhost:${PORT}\n`);
});
