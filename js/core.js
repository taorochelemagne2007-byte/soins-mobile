// CORE
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
    } catch(e) { document.body.innerHTML = '<div style="color:white;padding:40px;text-align:center"><h2>Erreur Stockage</h2><button onclick="location.reload()">Réessayer</button></div>'; }
  },
  async savePatient() {
    const d = { prenom:document.getElementById('np-prenom').value, nom:document.getElementById('np-nom').value, ddn:document.getElementById('np-ddn').value, medecin:document.getElementById('np-medecin').value, adresse:document.getElementById('np-adresse').value, notes:document.getElementById('np-notes').value, urgent:document.getElementById('np-urgent').value, status:document.getElementById('np-status').value, couple:document.getElementById('np-couple').value };
    if(!d.prenom || !d.nom) return ui.toast('⚠️ Nom/Prénom requis');
    let p = state.activePid ? utils.p(state.activePid) : null;
    if(p) { Object.assign(p, d); p.coupleWith = d.couple?parseInt(d.couple):null; } 
    else { p = { id:Date.now(), ...d, color:COLORS[Math.floor(Math.random()*COLORS.length)], docs:[], contacts:[], idDocs:{}, seenDates:[], coupleWith:d.couple?parseInt(d.couple):null }; state.patients.push(p); }
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
    const labels = {tension:'Tension',glycemie:'Glycémie',pansement:'Pansement',labo:'Labo',ordonnance:'Ordonnance',cr:'CR'};
    const icons = {tension:'🩺',glycemie:'🩸',pansement:'🩹',labo:'🧪',ordonnance:'💊',cr:'📋'};
    const n = { id: Date.now(), type: t, label: labels[t]||'Doc', icon: icons[t]||'📄', datetime: utils.now(), entries: [] };
    if(!p.docs) p.docs = [];
    p.docs.push(n);
    await db.save('patients', p);
    ui.go('form', p.id, n.id);
  },
  async saveContact() {
    const p = utils.p(state.activePid);
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
    p.contacts = p.contacts.filter(x => x.id !== cid);
    await db.save('patients', p); ui.render();
  }
};