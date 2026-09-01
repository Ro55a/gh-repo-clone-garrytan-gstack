#!/usr/bin/env python3
"""Build a self-contained HTML dashboard from roles.json.

Usage: python3 build_dashboard.py [roles.json] [dashboard.html]

Reads the roles.json source of truth and writes a single dependency-free
HTML file with the role data inlined as JSON. No network access or server
is required to view the output - open it directly in a browser.
"""
import json
import sys
from pathlib import Path
from html import escape

DEFAULT_INPUT = "roles.json"
DEFAULT_OUTPUT = "dashboard.html"


def load_roles(path):
    with open(path, "r", encoding="utf-8") as f:
        return json.load(f)


def build_html(data):
    profile = data.get("profile", {})
    meta = data.get("meta", {})
    roles = data.get("roles", [])

    payload = json.dumps(
        {"profile": profile, "meta": meta, "roles": roles},
        ensure_ascii=False,
    )
    # Escape "</script>" so the inlined JSON can never break out of its tag.
    payload = payload.replace("</", "<\\/")

    title = f"{escape(profile.get('name', 'Placement'))} - Industrial Placement Dashboard"

    return HTML_TEMPLATE.replace("__TITLE__", escape(title)).replace(
        "__DATA__", payload
    ).replace("__NAME__", escape(profile.get("name", "")))


HTML_TEMPLATE = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
<style>
  :root {
    --bg: #0b0e14;
    --bg-alt: #11151f;
    --card: #161b26;
    --border: #262c3a;
    --text: #e6e9f0;
    --text-dim: #9aa3b5;
    --text-faint: #6b7286;
    --accent: #5b8cff;
    --green: #3ecf8e;
    --amber: #f2b84b;
    --red: #ef5a6f;
    --purple: #b48cff;
    --grey: #4a5164;
  }
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0;
    background: var(--bg);
    color: var(--text);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  }
  body { padding: 24px 20px 60px; }
  .wrap { max-width: 1200px; margin: 0 auto; }
  header { margin-bottom: 20px; }
  h1 { font-size: 22px; margin: 0 0 4px; font-weight: 650; }
  .subtitle { color: var(--text-dim); font-size: 13px; }
  .meta-line { color: var(--text-faint); font-size: 12px; margin-top: 6px; }

  .banner {
    background: linear-gradient(90deg, rgba(239,90,111,0.18), rgba(239,90,111,0.05));
    border: 1px solid rgba(239,90,111,0.4);
    color: #ffb3bd;
    border-radius: 10px;
    padding: 12px 16px;
    margin-bottom: 20px;
    font-size: 13.5px;
    line-height: 1.5;
    display: none;
  }
  .banner.show { display: block; }
  .banner b { color: #fff; }
  .banner ul { margin: 6px 0 0; padding-left: 18px; }

  .cards {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    gap: 12px;
    margin-bottom: 22px;
  }
  @media (max-width: 820px) { .cards { grid-template-columns: repeat(2, 1fr); } }
  .card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 14px 16px;
    cursor: pointer;
    transition: border-color .15s ease, transform .1s ease;
  }
  .card:hover { border-color: var(--accent); transform: translateY(-1px); }
  .card.active { border-color: var(--accent); background: #141a2b; }
  .card .num { font-size: 26px; font-weight: 700; line-height: 1.1; }
  .card .label { color: var(--text-dim); font-size: 12px; margin-top: 4px; }
  .card.red .num { color: var(--red); }
  .card.green .num { color: var(--green); }
  .card.amber .num { color: var(--amber); }
  .card.grey .num { color: var(--text); }
  .card.purple .num { color: var(--purple); }

  .toolbar {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: center;
    margin-bottom: 14px;
  }
  input[type="search"] {
    background: var(--bg-alt);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 8px;
    padding: 9px 12px;
    font-size: 13px;
    min-width: 220px;
    flex: 1 1 220px;
  }
  select {
    background: var(--bg-alt);
    border: 1px solid var(--border);
    color: var(--text);
    border-radius: 8px;
    padding: 9px 10px;
    font-size: 13px;
  }
  .toolbar .count { color: var(--text-faint); font-size: 12px; margin-left: auto; }

  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  thead th {
    position: sticky; top: 0;
    background: var(--bg-alt);
    text-align: left;
    padding: 10px 10px;
    color: var(--text-dim);
    font-weight: 600;
    border-bottom: 1px solid var(--border);
    cursor: pointer;
    user-select: none;
    white-space: nowrap;
  }
  thead th:hover { color: var(--text); }
  thead th.sorted::after { content: " " attr(data-dir); color: var(--accent); }
  tbody tr.role-row {
    border-bottom: 1px solid var(--border);
    cursor: pointer;
  }
  tbody tr.role-row:hover { background: #12172200; background: rgba(91,140,255,0.06); }
  tbody td { padding: 10px 10px; vertical-align: top; }
  tbody tr.detail-row { display: none; background: var(--bg-alt); }
  tbody tr.detail-row.show { display: table-row; }
  tbody tr.detail-row td {
    padding: 14px 18px 18px;
    border-bottom: 1px solid var(--border);
  }
  .detail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
  @media (max-width: 720px) { .detail-grid { grid-template-columns: 1fr; } }
  .detail-block h4 {
    margin: 0 0 6px; font-size: 11px; text-transform: uppercase;
    letter-spacing: .04em; color: var(--text-faint); font-weight: 700;
  }
  .detail-block p { margin: 0; color: var(--text); font-size: 13px; line-height: 1.55; }
  .detail-foot { grid-column: 1 / -1; display: flex; gap: 18px; flex-wrap: wrap; color: var(--text-faint); font-size: 11.5px; margin-top: 4px; }

  .pill { display: inline-block; padding: 3px 9px; border-radius: 999px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .pill-open { background: rgba(62,207,142,0.15); color: var(--green); }
  .pill-opens-soon { background: rgba(242,184,75,0.15); color: var(--amber); }
  .pill-verify { background: rgba(180,140,255,0.15); color: var(--purple); }
  .pill-watch { background: rgba(106,114,134,0.2); color: var(--text-dim); }
  .pill-closed { background: rgba(239,90,111,0.15); color: var(--red); }

  .fit { font-weight: 700; }
  .company { font-weight: 650; }
  .title-cell { color: var(--text); }
  .company-sub { color: var(--text-faint); font-size: 11.5px; }
  .days-left { font-size: 11.5px; }
  .days-urgent { color: var(--red); font-weight: 700; }
  .flag { font-size: 11px; color: var(--text-faint); }
  .flag.warn { color: var(--amber); }

  .empty { text-align: center; color: var(--text-faint); padding: 40px 0; }
  footer { margin-top: 26px; color: var(--text-faint); font-size: 11.5px; line-height: 1.6; }
</style>
</head>
<body>
<div class="wrap">
  <header>
    <h1>__NAME__ &mdash; Industrial Placement Dashboard</h1>
    <div class="subtitle">Consulting &middot; Finance &middot; Asset Management &middot; Investment Banking &middot; Risk / Auditing &mdash; London</div>
    <div class="meta-line" id="metaLine"></div>
  </header>

  <div class="banner" id="urgentBanner"></div>

  <div class="cards" id="cards">
    <div class="card grey" data-filter="all"><div class="num" id="cardTotal">0</div><div class="label">Total tracked</div></div>
    <div class="card green" data-filter="status:Open"><div class="num" id="cardOpen">0</div><div class="label">Open</div></div>
    <div class="card amber" data-filter="status:Opens soon"><div class="num" id="cardOpeningSoon">0</div><div class="label">Opening soon</div></div>
    <div class="card red" data-filter="urgent"><div class="num" id="cardClosingSoon">0</div><div class="label">Closing soon (&lt;14 days)</div></div>
    <div class="card purple" data-filter="unconfirmed"><div class="num" id="cardUnconfirmed">0</div><div class="label">Unconfirmed dates</div></div>
  </div>

  <div class="toolbar">
    <input type="search" id="searchBox" placeholder="Search company or title...">
    <select id="typeFilter"><option value="">All categories</option></select>
    <select id="statusFilter"><option value="">All statuses</option></select>
    <span class="count" id="resultCount"></span>
  </div>

  <table id="roleTable">
    <thead>
      <tr>
        <th data-key="company">Company</th>
        <th data-key="title">Title</th>
        <th data-key="type">Category</th>
        <th data-key="status">Status</th>
        <th data-key="deadline_date">Deadline</th>
        <th data-key="fit_score">Fit</th>
        <th data-key="date_confidence">Date conf.</th>
      </tr>
    </thead>
    <tbody id="tableBody"></tbody>
  </table>
  <div class="empty" id="emptyState" style="display:none;">No roles match the current filters.</div>

  <footer id="footer"></footer>
</div>

<script>
const DATA = __DATA__;
const roles = DATA.roles || [];
const meta = DATA.meta || {};
const profile = DATA.profile || {};

document.getElementById('metaLine').textContent =
  'Last discovery run: ' + (meta.last_discovery_run || 'n/a') +
  '  |  Last updated: ' + (meta.last_updated || 'n/a') +
  '  |  Region: ' + (profile.target ? profile.target.region : 'London only');

document.getElementById('footer').innerHTML =
  'Sourcing rules: dates are only recorded from a region-specific source; unconfirmed dates are never alerted on. ' +
  (meta.environment_notes ? escapeHtml(meta.environment_notes) : '');

function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}

function daysLeft(dateStr) {
  if (!dateStr) return null;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const d = new Date(dateStr + 'T00:00:00');
  if (isNaN(d.getTime())) return null;
  return Math.round((d - today) / 86400000);
}

function statusPillClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'open': return 'pill-open';
    case 'opens soon': return 'pill-opens-soon';
    case 'verify': return 'pill-verify';
    case 'watch': return 'pill-watch';
    case 'closed': return 'pill-closed';
    default: return 'pill-watch';
  }
}

// ---- derive computed fields ----
roles.forEach(r => {
  r._days = daysLeft(r.deadline_date);
  r._urgent = r.status === 'Open' && r._days !== null && r._days >= 0 && r._days < 14;
  r._unconfirmed = (r.date_confidence === 'unconfirmed') || (!r.deadline_date && !r.opens_date && r.status !== 'Closed');
});

// ---- summary cards ----
const total = roles.length;
const openCount = roles.filter(r => r.status === 'Open').length;
const openingSoonCount = roles.filter(r => r.status === 'Opens soon').length;
const closingSoonCount = roles.filter(r => r._urgent).length;
const unconfirmedCount = roles.filter(r => r._unconfirmed).length;

document.getElementById('cardTotal').textContent = total;
document.getElementById('cardOpen').textContent = openCount;
document.getElementById('cardOpeningSoon').textContent = openingSoonCount;
document.getElementById('cardClosingSoon').textContent = closingSoonCount;
document.getElementById('cardUnconfirmed').textContent = unconfirmedCount;

// ---- urgent banner ----
const urgentRoles = roles.filter(r => r._urgent).sort((a,b) => a._days - b._days);
const banner = document.getElementById('urgentBanner');
if (urgentRoles.length) {
  banner.classList.add('show');
  banner.innerHTML = '<b>' + urgentRoles.length + ' role' + (urgentRoles.length === 1 ? '' : 's') +
    ' closing within 14 days:</b><ul>' +
    urgentRoles.map(r => '<li>' + escapeHtml(r.company) + ' &mdash; ' + escapeHtml(r.title) +
      ' (' + r._days + ' day' + (r._days === 1 ? '' : 's') + ' left, deadline ' + escapeHtml(r.deadline_date) + ')</li>').join('') +
    '</ul>';
}

// ---- filter dropdowns ----
const typeSet = [...new Set(roles.map(r => r.type).filter(Boolean))].sort();
const statusSet = [...new Set(roles.map(r => r.status).filter(Boolean))].sort();
const typeFilter = document.getElementById('typeFilter');
const statusFilter = document.getElementById('statusFilter');
typeSet.forEach(t => { const o = document.createElement('option'); o.value = t; o.textContent = t; typeFilter.appendChild(o); });
statusSet.forEach(s => { const o = document.createElement('option'); o.value = s; o.textContent = s; statusFilter.appendChild(o); });

// ---- state ----
let state = { search: '', type: '', status: '', cardFilter: 'all', sortKey: 'deadline_date', sortDir: 1 };

document.getElementById('searchBox').addEventListener('input', e => { state.search = e.target.value.toLowerCase(); render(); });
typeFilter.addEventListener('change', e => { state.type = e.target.value; render(); });
statusFilter.addEventListener('change', e => { state.status = e.target.value; render(); });

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => {
    const f = card.getAttribute('data-filter');
    state.cardFilter = (state.cardFilter === f) ? 'all' : f;
    document.querySelectorAll('.card').forEach(c => c.classList.remove('active'));
    if (state.cardFilter !== 'all') card.classList.add('active');
    render();
  });
});

document.querySelectorAll('thead th[data-key]').forEach(th => {
  th.addEventListener('click', () => {
    const key = th.getAttribute('data-key');
    if (state.sortKey === key) { state.sortDir *= -1; } else { state.sortKey = key; state.sortDir = 1; }
    render();
  });
});

function passesCardFilter(r) {
  switch (state.cardFilter) {
    case 'all': return true;
    case 'status:Open': return r.status === 'Open';
    case 'status:Opens soon': return r.status === 'Opens soon';
    case 'urgent': return r._urgent;
    case 'unconfirmed': return r._unconfirmed;
    default: return true;
  }
}

function sortValue(r, key) {
  if (key === 'deadline_date') return r.deadline_date || '9999-99-99';
  if (key === 'fit_score') return r.fit_score || 0;
  return (r[key] || '').toString().toLowerCase();
}

function render() {
  let rows = roles.filter(r => {
    if (!passesCardFilter(r)) return false;
    if (state.type && r.type !== state.type) return false;
    if (state.status && r.status !== state.status) return false;
    if (state.search) {
      const hay = (r.company + ' ' + r.title).toLowerCase();
      if (!hay.includes(state.search)) return false;
    }
    return true;
  });

  rows.sort((a, b) => {
    const av = sortValue(a, state.sortKey), bv = sortValue(b, state.sortKey);
    if (av < bv) return -1 * state.sortDir;
    if (av > bv) return 1 * state.sortDir;
    return 0;
  });

  document.querySelectorAll('thead th[data-key]').forEach(th => {
    th.classList.toggle('sorted', th.getAttribute('data-key') === state.sortKey);
    th.setAttribute('data-dir', state.sortDir === 1 ? '\\u25b2' : '\\u25bc');
  });

  const tbody = document.getElementById('tableBody');
  tbody.innerHTML = '';
  document.getElementById('emptyState').style.display = rows.length ? 'none' : 'block';
  document.getElementById('resultCount').textContent = rows.length + ' of ' + total + ' roles';

  rows.forEach((r, idx) => {
    const tr = document.createElement('tr');
    tr.className = 'role-row';
    const deadlineText = r.deadline_date
      ? escapeHtml(r.deadline_date) + (r._days !== null ? ' <span class="days-left' + (r._urgent ? ' days-urgent' : '') + '">(' + (r._days >= 0 ? r._days + 'd left' : 'passed') + ')</span>' : '')
      : (r.opens_date ? 'opens ' + escapeHtml(r.opens_date) : '<span class="flag">rolling / TBC</span>');

    tr.innerHTML =
      '<td><div class="company">' + escapeHtml(r.company) + '</div><div class="company-sub">' + escapeHtml(r.tier || '') + '</div></td>' +
      '<td class="title-cell">' + escapeHtml(r.title) + '</td>' +
      '<td>' + escapeHtml(r.type || '') + '</td>' +
      '<td><span class="pill ' + statusPillClass(r.status) + '">' + escapeHtml(r.status || '') + '</span></td>' +
      '<td>' + deadlineText + '</td>' +
      '<td class="fit">' + ('&#9733;'.repeat(r.fit_score || 0)) + '<span style="color:var(--text-faint)">' + '&#9734;'.repeat(5 - (r.fit_score || 0)) + '</span></td>' +
      '<td><span class="flag' + (r.date_confidence === 'unconfirmed' ? ' warn' : '') + '">' + escapeHtml(r.date_confidence || '') + (r.region_confirmed === false ? ' &middot; region?' : '') + '</span></td>';

    const detail = document.createElement('tr');
    detail.className = 'detail-row';
    detail.innerHTML = '<td colspan="7"><div class="detail-grid">' +
      '<div class="detail-block"><h4>Eligibility</h4><p>' + escapeHtml(r.eligibility || '\\u2014') + '</p></div>' +
      '<div class="detail-block"><h4>Tactical notes</h4><p>' + escapeHtml(r.tactical_notes || '\\u2014') + '</p></div>' +
      '<div class="detail-foot">' +
        '<span><b>Source:</b> ' + escapeHtml(r.source || '\\u2014') + '</span>' +
        '<span><b>First seen:</b> ' + escapeHtml(r.first_seen || '\\u2014') + '</span>' +
        '<span><b>Region confirmed:</b> ' + (r.region_confirmed ? 'yes' : 'no') + '</span>' +
        '<span><b>ID:</b> ' + escapeHtml(r.id || '') + '</span>' +
      '</div></div></td>';

    tr.addEventListener('click', () => { detail.classList.toggle('show'); });

    tbody.appendChild(tr);
    tbody.appendChild(detail);
  });
}

render();
</script>
</body>
</html>
"""


def main():
    input_path = Path(sys.argv[1]) if len(sys.argv) > 1 else Path(DEFAULT_INPUT)
    output_path = Path(sys.argv[2]) if len(sys.argv) > 2 else Path(DEFAULT_OUTPUT)

    data = load_roles(input_path)
    html = build_html(data)

    with open(output_path, "w", encoding="utf-8") as f:
        f.write(html)

    print(f"Wrote {output_path} from {len(data.get('roles', []))} roles in {input_path}")


if __name__ == "__main__":
    main()
