// CORE - Sécurisé
const core = {
  async boot() {
    try {
      await db.init();
      state.patients = await db.getAll('patients');
      const pinObj = await db.get('config', 'app_pin');
      if(pinObj) { state.pin = pinObj.value; state.page = 'auth'; } else { state.authenticated = true; }
      if(state.patients.length === 0) {
        const def = [{id:1,nom:'Dubois',prenom:'Robert',ddn:'1948-03-12',medecin:'Dr. Lemaire',adresse:'Nîmes',notes:'HTA',color:COLORS[0],status:'active',docs:[],contacts:[],idDocs:{},seenDates:[],coupleWith:2},{id:2,nom:'Dubois',prenom:'Michèle',ddn:'1952-05-30',medecin:'Dr. Lemaire',adresse:'Nîmes',notes:'Arthrose',color:COLORS[2],status:'active',docs:[],contacts:[],idDocs:{},seenDates:[],coupleWith:1}];
        for(let p of def) { state.patients.push(p); await db.save('patients', p); }
      }
      ui.render();
    } catch(e) { 
      console.error('Boot error:', e);
      document.body.innerHTML = `<div style="color:white;padding:40px;text-align:center"><h2>Erreur Stockage</h2><p>${e.message}</p><button class="modal-btn" onclick="location.reload()">Réessayer</button></div>`; 
    }
  },

  async savePatient() {
    const d = { 
      prenom: document.getElementById('np-prenom').value, 
      nom: document.getElementById('np-nom').value, 
      ddn: document.getElementById('np-ddn').value, 
      medecin: document.getElementById('np-medecin').value, 
      adresse: document.getElementById('np-adresse').value, 
      notes: document.getElementById('np-notes').value, 
      urgent: document.getElementById('np-urgent').value, 
      status: document.getElementById('np-status').value, 
      couple: document.getElementById('np-couple').value 
    };
    if(!d.prenom || !d.nom) return ui.toast('⚠️ Nom/Prénom requis');
    let p = state.activePid ? utils.p(state.activePid) : null;
    if(p) { Object.assign(p, d); p.coupleWith = d.couple?parseInt(d.couple):null; } 
    else { 
      p = { id:Date.now(), ...d, color:COLORS[Math.floor(Math.random()*COLORS.length)], docs:[], contacts:[], idDocs:{}, seenDates:[], coupleWith:d.couple?parseInt(d.couple):null }; 
      state.patients.push(p); 
    }
    await db.save('patients', p);
    ui.toast('✓ Enregistré'); ui.closeModal('modal-patient'); ui.render();
  },

  async toggleVu(pid) {
    const p = utils.p(pid); if(!p) return;
    const ts = utils.today(); const idx = (p.seenDates||[]).indexOf(ts);
    if(idx>=0) p.seenDates.splice(idx,1); else { if(!p.seenDates)p.seenDates=[]; p.seenDates.push(ts); }
    await db.save('patients', p); ui.render();
  },

  async createDoc(t) {
    const p = utils.p(state.activePid);
    if(!p) return ui.toast('❌ Aucun patient sélectionné');
    const labels = {tension:'Tension',glycemie:'Glycémie',pansement:'Pansement',labo:'Labo',ordonnance:'Ordonnance',consentement:'Consentement'};
    const icons = {tension:'🩺',glycemie:'🩸',pansement:'🩹',labo:'🧪',ordonnance:'💊',consentement:'✍️'};
    const n = { id: Date.now(), type: t, label: labels[t]||'Doc', icon: icons[t]||'📄', datetime: utils.now(), entries: [] };
    if(!p.docs) p.docs = [];
    p.docs.push(n);
    await db.save('patients', p);
    ui.go('form', p.id, n.id);
  },

  async handleIdClick(k) {
    const p = utils.p(state.activePid);
    const d = p.docs ? p.docs.find(x => x.id == state.activeDid) : null;
    
    let imgId = null;
    if(d && d.idDocs && d.idDocs[k]) imgId = d.idDocs[k];
    else if(p.idDocs && p.idDocs[k]) imgId = p.idDocs[k];

    if(imgId) {
      const data = await db.get('files', imgId);
      if(data) {
        const src = URL.createObjectURL(data.blob);
        this.openViewer(src, k);
      } else return ui.toast('❌ Image introuvable');
    } else {
      this.openImageModal(k, !!d);
    }
  },

  openImageModal(k, isDoc = false) {
    state._imgTarget = { type: isDoc ? 'doc' : 'id', key: k };
    ui.openModal('modal-image');
  },

  openViewer(src, title) {
    const imgEl = document.getElementById('viewer-img');
    const titleEl = document.getElementById('viewer-title');
    if(imgEl) imgEl.src = src;
    if(titleEl) titleEl.textContent = title;
    ui.openModal('modal-viewer');
  },

  async saveImage(e) {
    const file = e.target.files[0];
    if(!file) return;
    const id = 'id_' + Date.now();
    await db.save('files', { id, blob: file });
    const p = utils.p(state.activePid);
    
    if(state._imgTarget.type === 'id') {
      if(!p.idDocs) p.idDocs = {};
      p.idDocs[state._imgTarget.key] = id;
    } else if(state._imgTarget.type === 'doc') {
      const d = p.docs.find(x => x.id == state.activeDid);
      if(d.type === 'pansement' && state._imgTarget.key === 'wound_photo') {
        if(!d.photos) d.photos = [];
        d.photos.push({ id, date: new Date().toISOString() });
        if(!d.idDocs) d.idDocs = {};
        d.idDocs['photo_' + (d.photos.length - 1)] = id;
      } else {
        if(!d.idDocs) d.idDocs = {};
        d.idDocs[state._imgTarget.key] = id;
      }
    }
    
    await db.save('patients', p);
    ui.closeModal('modal-image');
    ui.render();
    ui.toast('✓ Document ajouté');
  },

  async saveContact() {
    const p = utils.p(state.activePid);
    if(!p) return ui.toast('❌ Erreur patient');
    const c = { 
      id: Date.now(), 
      nom: document.getElementById('c-nom').value, 
      tel: document.getElementById('c-tel').value,
      mail: document.getElementById('c-mail').value
    };
    if(!c.nom) return ui.toast('⚠️ Nom requis');
    if(!p.contacts) p.contacts = [];
    p.contacts.push(c);
    await db.save('patients', p);
    ui.toast('✓ Contact ajouté'); ui.closeModal('modal-contact'); ui.render();
  },

  async deleteContact(pid, cid) {
    const p = utils.p(pid);
    if(!p) return;
    p.contacts = p.contacts.filter(x => x.id !== cid);
    await db.save('patients', p); ui.render();
  },

  async autoSave() {
    const p = utils.p(state.activePid); 
    const d = p ? p.docs.find(x => x.id == state.activeDid) : null; 
    if(!d) return;
    
    const dtInput = document.getElementById('doc-dt');
    if(dtInput) d.datetime = dtInput.value;

    const fTitle = document.getElementById('f-title'); if(fTitle) d.title = fTitle.value;
    const fMed = document.getElementById('f-med'); if(fMed) d.medecin = fMed.value;
    const fExp = document.getElementById('f-exp'); if(fExp) d.expiry = fExp.value;
    const fKIn = document.getElementById('f-key-in'); if(fKIn) d.keyIn = fKIn.value;
    const fKOut = document.getElementById('f-key-out'); if(fKOut) d.keyOut = fKOut.value;
    const fLoc = document.getElementById('f-loc'); if(fLoc) d.localisation = fLoc.value;
    const fEval = document.getElementById('f-eval'); if(fEval) d.evaluation = fEval.value;
    const fProt = document.getElementById('f-protocole'); if(fProt) d.protocole = fProt.value;

    if(d.type==='tension'||d.type==='glycemie') {
      const rows={}; 
      document.querySelectorAll('[data-t]').forEach(el=>{ 
        const i=el.dataset.i, t=el.dataset.t; 
        if(!rows[i])rows[i]={}; 
        rows[i][t]=el.value; 
      });
      d.entries = Object.values(rows).sort((a,b)=>(a.date+a.heure).localeCompare(b.date+b.heure));
    } else { 
      const o=document.getElementById('obs'); 
      if(o) d.obs=o.value; 
    }
    await db.save('patients', p);
  }
};