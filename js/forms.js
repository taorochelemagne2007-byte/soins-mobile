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

  fPansement(d) {
    if(!d.photos) d.photos = [];
    return `<div class="modal-field"><label>Localisation de la plaie</label><input class="modal-input" id="f-loc" value="${d.localisation||''}" placeholder="ex: Talon gauche, Sacrum..." oninput="ui.autoSave()"></div>
    <div class="modal-field"><label>Évaluation / Observation</label><textarea class="modal-input" id="f-eval" style="min-height:80px" placeholder="Aspect, exsudat, odeur..." oninput="ui.autoSave()">${d.evaluation||''}</textarea></div>
    <div class="modal-field"><label>Protocole de soins</label><textarea class="modal-input" id="f-protocole" style="min-height:80px; border-color:var(--accent)" placeholder="Nettoyage, type de pansement, fréquence..." oninput="ui.autoSave()">${d.protocole||''}</textarea></div>
    
    <div class="section-label">Suivi Photo</div>
    <button class="modal-btn" style="background:var(--bg3); margin-bottom:15px" onclick="core.openImageModal('wound_photo', true)">📸 Ajouter une photo de la plaie</button>
    
    <div class="measure-table">
      <div class="mt-row" style="grid-template-columns: 1fr 1fr; background:var(--bg3); font-weight:bold; font-size:10px">
        <div class="mt-cell">Date</div><div class="mt-cell">Photo</div>
      </div>
      ${(d.photos||[]).map((p,i)=>`<div class="mt-row" style="grid-template-columns: 1fr 1fr">
        <div class="mt-cell" style="font-size:10px">${new Date(p.date).toLocaleDateString()}</div>
        <div class="mt-cell" onclick="core.handleIdClick('photo_${i}')"><span style="cursor:pointer">🖼️ Voir</span></div>
      </div>`).join('')}
    </div>`;
  },

  fOrdonnance(d) {
    return `<div class="modal-field"><label>Nom de l'ordonnance / Traitement</label><input class="modal-input" id="f-title" value="${d.title||''}" oninput="ui.autoSave()"></div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-top:10px">
      <div class="modal-field"><label>Médecin</label><input class="modal-input" id="f-med" value="${d.medecin||''}" oninput="ui.autoSave()"></div>
      <div class="modal-field"><label>Date Expiration</label><input class="modal-input" id="f-exp" type="date" value="${d.expiry||''}" oninput="ui.autoSave()"></div>
    </div>
    <div class="doc-card" style="margin-top:20px; text-align:center; border:2px dashed var(--border)" onclick="core.openImageModal('doc_ordo', true)">
      ${(d.idDocs && d.idDocs.doc_ordo) ? '✅ Photo ajoutée' : '📸 Ajouter photo ordonnance'}
    </div>
    <textarea class="modal-input" id="obs" style="margin-top:10px; min-height:100px" placeholder="Notes complémentaires..." oninput="ui.autoSave()">${d.obs||''}</textarea>`;
  },

  fLabo(d) {
    return `<div class="modal-field"><label>Titre des résultats</label><input class="modal-input" id="f-title" value="${d.title||''}" oninput="ui.autoSave()"></div>
    <div class="doc-card" style="margin-top:20px; text-align:center; border:2px dashed var(--border)" onclick="core.openImageModal('doc_labo', true)">
      ${(d.idDocs && d.idDocs.doc_labo) ? '✅ Photo ajoutée' : '🧪 Ajouter photo résultats'}
    </div>
    <textarea class="modal-input" id="obs" style="margin-top:10px; min-height:100px" placeholder="Observations..." oninput="ui.autoSave()">${d.obs||''}</textarea>`;
  },

  fConsentement(d) {
    const isLocked = !!d.signatureDate;
    return `<div class="section-label">Gestion des Clés</div>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:20px">
      <div class="modal-field"><label>Clés reçues le</label><input class="modal-input" id="f-key-in" type="date" value="${d.keyIn||''}" ${isLocked?'disabled':''} oninput="ui.autoSave()"></div>
      <div class="modal-field"><label>Clés restituées le</label><input class="modal-input" id="f-key-out" type="date" value="${d.keyOut||''}" ${isLocked?'disabled':''} oninput="ui.autoSave()"></div>
    </div>
    <div class="modal-field"><label>Détails Consentement</label>
      <textarea class="modal-input" id="obs" style="min-height:100px" placeholder="Notes sur le consentement..." ${isLocked?'disabled':''} oninput="ui.autoSave()">${d.obs||''}</textarea>
    </div>
    
    <div class="section-label">Signature Patient</div>
    ${isLocked ? 
      `<div style="background:var(--bg2); padding:15px; border-radius:12px; text-align:center; border:1px solid var(--accent)">
        <p style="color:var(--accent2); font-size:12px; margin-bottom:10px">✅ Document signé le ${new Date(d.signatureDate).toLocaleString()}</p>
        <img src="${d.signatureImg}" style="max-width:100%; height:80px; filter:invert(1) grayscale(1); border:1px solid var(--border)">
        <p style="font-size:10px; color:var(--text3); margin-top:10px">🔒 Document verrouillé (non modifiable)</p>
      </div>` :
      `<div style="background:#fff; border-radius:12px; overflow:hidden">
        <canvas id="sig-canvas" style="width:100%; height:150px; cursor:crosshair; touch-action:none"></canvas>
        <div style="display:flex; border-top:1px solid #eee">
          <button class="modal-btn" style="background:#eee; color:#666; margin:0; border-radius:0" onclick="ui.clearSignature()">Effacer</button>
          <button class="modal-btn" style="margin:0; border-radius:0" onclick="ui.saveSignature()">Signer officiellement</button>
        </div>
      </div>
      <p style="font-size:10px; color:var(--text3); margin-top:5px">La signature verrouillera définitivement ce document.</p>
      <script>setTimeout(() => ui.initSignature(), 100);</script>`
    }
    `;
  }
});