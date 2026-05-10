// FORMS
Object.assign(ui, {
  fTension(d) {
    if(!d.entries.length) d.entries=[{date:utils.today(),heure:'08:00',sys:'',dia:'',pouls:''}];
    return `<div class="measure-table">
      <div class="mt-row mt-tension" style="background:var(--bg3); font-weight:bold; font-size:10px; color:var(--text3)">
        <div class="mt-cell">Date</div><div class="mt-cell">Heure</div><div class="mt-cell">Sys</div><div class="mt-cell">Dia</div><div class="mt-cell">Pouls</div>
      </div>
      ${d.entries.map((e,i)=>`<div class="mt-row mt-tension"><div class="mt-cell"><input data-t="date" data-i="${i}" value="${e.date}" type="date" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="heure" data-i="${i}" value="${e.heure}" type="time" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="sys" data-i="${i}" value="${e.sys}" type="number" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="dia" data-i="${i}" value="${e.dia}" type="number" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="pouls" data-i="${i}" value="${e.pouls}" type="number" oninput="ui.autoSave()"></div></div>`).join('')}
    </div><button class="modal-btn" style="background:var(--bg3)" onclick="ui.addRow()">＋ Ligne</button>`;
  },

  fGlycemie(d) {
    if(!d.entries.length) d.entries=[{date:utils.today(),heure:'08:00',avant:'',apres:''}];
    return `<div class="measure-table">
      <div class="mt-row mt-glyc" style="background:var(--bg3); font-weight:bold; font-size:10px; color:var(--text3)">
        <div class="mt-cell">Date</div><div class="mt-cell">Heure</div><div class="mt-cell">Av. Repas</div><div class="mt-cell">Ap. Repas</div>
      </div>
      ${d.entries.map((e,i)=>`<div class="mt-row mt-glyc"><div class="mt-cell"><input data-t="date" data-i="${i}" value="${e.date}" type="date" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="heure" data-i="${i}" value="${e.heure}" type="time" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="avant" data-i="${i}" value="${e.avant}" type="number" oninput="ui.autoSave()"></div><div class="mt-cell"><input data-t="apres" data-i="${i}" value="${e.apres}" type="number" oninput="ui.autoSave()"></div></div>`).join('')}
    </div><button class="modal-btn" style="background:var(--bg3)" onclick="ui.addRow()">＋ Ligne</button>`;
  },

  fOrdonnance(d) {
    return `<div class="modal-field"><label>Nom de l'ordonnance / Traitement</label><input class="modal-input" id="f-title" value="${d.title||''}" oninput="ui.autoSave()"></div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px">
      <div class="modal-field"><label>Médecin</label><input class="modal-input" id="f-med" value="${d.medecin||''}" oninput="ui.autoSave()"></div>
      <div class="modal-field"><label>Date Expiration</label><input class="modal-input" id="f-exp" type="date" value="${d.expiry||''}" oninput="ui.autoSave()"></div>
    </div>
    <div class="doc-card" style="margin-top:20px; text-align:center; border:2px dashed var(--border)" onclick="core.openImageModal('doc_ordo')">
      ${(d.idDocs && d.idDocs.doc_ordo) ? '✅ Photo ajoutée' : '📸 Ajouter photo ordonnance'}
    </div>
    <textarea class="modal-input" id="obs" style="margin-top:10px; min-height:100px" placeholder="Notes complémentaires..." oninput="ui.autoSave()">${d.obs||''}</textarea>`;
  },

  fLabo(d) {
    return `<div class="modal-field"><label>Titre des résultats</label><input class="modal-input" id="f-title" value="${d.title||''}" oninput="ui.autoSave()"></div>
    <div class="doc-card" style="margin-top:20px; text-align:center; border:2px dashed var(--border)" onclick="core.openImageModal('doc_labo')">
      ${(d.idDocs && d.idDocs.doc_labo) ? '✅ Photo ajoutée' : '🧪 Ajouter photo résultats'}
    </div>
    <textarea class="modal-input" id="obs" style="margin-top:10px; min-height:200px" placeholder="Observations..." oninput="ui.autoSave()">${d.obs||''}</textarea>`;
  },

  fConsentement(d) {
    return `<div class="section-label">Gestion des Clés</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px">
      <div class="modal-field"><label>Clés reçues le</label><input class="modal-input" id="f-key-in" type="date" value="${d.keyIn||''}" oninput="ui.autoSave()"></div>
      <div class="modal-field"><label>Clés restituées le</label><input class="modal-input" id="f-key-out" type="date" value="${d.keyOut||''}" oninput="ui.autoSave()"></div>
    </div>
    <div class="modal-field"><label>Détails Consentement</label>
      <textarea class="modal-input" id="obs" style="min-height:200px" placeholder="Notes sur le consentement, codes accès, etc..." oninput="ui.autoSave()">${d.obs||''}</textarea>
    </div>
    <div class="doc-card" style="text-align:center; border:2px dashed var(--border)" onclick="core.openImageModal('doc_signature')">
      ${(d.idDocs && d.idDocs.doc_signature) ? '✅ Signature enregistrée' : '✍️ Ajouter Photo Signature'}
    </div>`;
  }
});