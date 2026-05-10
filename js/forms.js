// FORMS
Object.assign(ui, {
  fTension(d) {
    if(!d.entries.length) d.entries=[{date:utils.today(),heure:'08:00',sys:'',dia:'',pouls:''}];
    return `<div class="measure-table">${d.entries.map((e,i)=>`<div class="mt-row mt-tension"><div class="mt-cell"><input data-t="date" data-i="${i}" value="${e.date}" type="date" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="heure" data-i="${i}" value="${e.heure}" type="time" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="sys" data-i="${i}" value="${e.sys}" type="number" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="dia" data-i="${i}" value="${e.dia}" type="number" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="pouls" data-i="${i}" value="${e.pouls}" type="number" oninput="ui.autoSave()"></div></div>`).join('')}</div><button class="modal-btn" style="background:var(--bg3)" onclick="ui.addRow()">＋ Ligne</button>`;
  },

  fGlycemie(d) {
    if(!d.entries.length) d.entries=[{date:utils.today(),heure:'08:00',avant:'',apres:''}];
    return `<div class="measure-table">${d.entries.map((e,i)=>`<div class="mt-row mt-glyc"><div class="mt-cell"><input data-t="date" data-i="${i}" value="${e.date}" type="date" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="heure" data-i="${i}" value="${e.heure}" type="time" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="avant" data-i="${i}" value="${e.avant}" type="number" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="apres" data-i="${i}" value="${e.apres}" type="number" oninput="ui.autoSave()"></div></div>`).join('')}</div><button class="modal-btn" style="background:var(--bg3)" onclick="ui.addRow()">＋ Ligne</button>`;
  }
});