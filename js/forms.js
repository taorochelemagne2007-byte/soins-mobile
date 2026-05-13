// FORMS
Object.assign(ui, {
  fTension(d) {
    if(!d.entries.length) d.entries=[{date:utils.today(),heure:'08:00',sys:'',dia:'',pouls:'',user:state.currentUser}];
    return `<div class="measure-table">
      <div class="mt-row mt-tension" style="grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr; background:var(--bg3); font-weight:bold; font-size:10px; color:var(--text3)">
        <div class="mt-cell">Date</div><div class="mt-cell">Heure</div><div class="mt-cell">Sys</div><div class="mt-cell">Dia</div><div class="mt-cell">Pls</div><div class="mt-cell">ID</div>
      </div>
      ${d.entries.map((e,i)=>`<div class="mt-row mt-tension" style="grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr 1fr">
        <div class="mt-cell"><input data-t="date" data-i="${i}" value="${e.date}" type="date" oninput="ui.autoSave()"></div>
        <div class="mt-cell"><input data-t="heure" data-i="${i}" value="${e.heure}" type="time" oninput="ui.autoSave()"></div>
        <div class="mt-cell"><input data-t="sys" data-i="${i}" value="${e.sys}" type="number" oninput="ui.autoSave()"></div>
        <div class="mt-cell"><input data-t="dia" data-i="${i}" value="${e.dia}" type="number" oninput="ui.autoSave()"></div>
        <div class="mt-cell"><input data-t="pouls" data-i="${i}" value="${e.pouls}" type="number" oninput="ui.autoSave()"></div>
        <div class="mt-cell" style="font-size:10px; color:var(--text2)">${e.user||state.currentUser}</div>
      </div>`).join('')}
    </div><button class="modal-btn" style="background:var(--bg3)" onclick="ui.addRow()">＋ Ligne</button>`;
  },

  fGlycemie(d) {
    if(!d.entries.length) d.entries=[{date:utils.today(),heure:'08:00',avant:'',apres:'',user:state.currentUser}];
    return `<div class="measure-table">
      <div class="mt-row mt-glyc" style="grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 1fr; background:var(--bg3); font-weight:bold; font-size:10px; color:var(--text3)">
        <div class="mt-cell">Date</div><div class="mt-cell">Heure</div><div class="mt-cell">Av.</div><div class="mt-cell">Ap.</div><div class="mt-cell">ID</div>
      </div>
      ${d.entries.map((e,i)=>`<div class="mt-row mt-glyc" style="grid-template-columns: 1.2fr 0.8fr 0.8fr 0.8fr 1fr">
        <div class="mt-cell"><input data-t="date" data-i="${i}" value="${e.date}" type="date" oninput="ui.autoSave()"></div>
        <div class="mt-cell"><input data-t="heure" data-i="${i}" value="${e.heure}" type="time" oninput="ui.autoSave()"></div>
        <div class="mt-cell"><input data-t="avant" data-i="${i}" value="${e.avant}" type="number" oninput="ui.autoSave()"></div>
        <div class="mt-cell"><input data-t="apres" data-i="${i}" value="${e.apres}" type="number" oninput="ui.autoSave()"></div>
        <div class="mt-cell" style="font-size:10px; color:var(--text2)">${e.user||state.currentUser}</div>
      </div>`).join('')}
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
    if(!d.entries) d.entries = [];
    return `<div class="section-label">Cabinet de Soins - Suivi & Consentement</div>
    <div class="measure-table">
      <div class="mt-row" style="grid-template-columns: 0.8fr 2.2fr 1.5fr; background:var(--bg3); font-weight:bold; font-size:10px">
        <div class="mt-cell">Date</div><div class="mt-cell">Objet / Note</div><div class="mt-cell">Signature & Soignant</div>
      </div>
      ${d.entries.map((e,i) => {
        const isLocked = !!e.signatureDate;
        return `<div class="mt-row" style="grid-template-columns: 0.8fr 2.2fr 1.5fr; min-height:60px; align-items:center">
          <div class="mt-cell"><input data-t="date" data-i="${i}" value="${e.date}" type="date" style="width:100%; font-size:10px; padding:2px" ${isLocked?'disabled':''} oninput="ui.autoSave()"></div>
          <div class="mt-cell"><textarea data-t="note" data-i="${i}" style="font-size:11px; width:100%; border:none; background:transparent; color:white; resize:none" placeholder="ex: Remise clés..." ${isLocked?'disabled':''} oninput="ui.autoSave()">${e.note||''}</textarea></div>
          <div class="mt-cell" style="display:flex; flex-direction:column; gap:5px; padding:5px; text-align:center">
            ${isLocked ? 
              `<img src="${e.signatureImg}" style="height:30px; filter:invert(1); margin:0 auto">
               <div style="font-size:8px; opacity:0.6; line-height:1.2">Le ${new Date(e.signatureDate).toLocaleDateString()}<br>Par : <b>${e.user || 'Cabinet'}</b></div>` :
              `<div style="background:#fff; border-radius:4px; overflow:hidden">
                <canvas id="sig-canvas-${i}" style="width:100%; height:60px; cursor:crosshair; touch-action:none"></canvas>
                <div style="display:flex; border-top:1px solid #eee">
                  <button class="tbtn" style="flex:1; height:20px; font-size:9px; background:#eee; color:#666" onclick="ui.clearSignature(${i})">X</button>
                  <button class="tbtn" style="flex:2; height:20px; font-size:9px; background:var(--accent)" onclick="ui.saveSignature(${i})">Signer</button>
                </div>
              </div>
              <script>setTimeout(() => ui.initSignature(${i}), 100);</script>`
            }
          </div>
        </div>`;
      }).join('')}
    </div>
    <button class="modal-btn" style="background:var(--bg3); margin-top:10px" onclick="ui.addRow()">＋ Ajouter une ligne (Clés, Consentement...)</button>
    <div class="modal-field" style="margin-top:20px"><label>Observations Générales</label>
      <textarea class="modal-input" id="obs" style="min-height:80px" placeholder="Notes globales..." oninput="ui.autoSave()">${d.obs||''}</textarea>
    </div>`;
  }
});