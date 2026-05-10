// UI - Sécurisé
const ui = {
  toast(m) { 
    const t=document.getElementById('toast'); 
    if(!t) return;
    t.textContent=m; t.classList.add('show'); 
    setTimeout(()=>t.classList.remove('show'),2500); 
  },

  openModal(id) { 
    const el = document.getElementById(id);
    if(!el) return;
    if(id==='modal-patient') {
      const p = state.activePid ? utils.p(state.activePid) : null;
      const mpTitle = document.getElementById('mp-title');
      if(mpTitle) mpTitle.textContent = p ? 'Modifier Patient' : 'Nouveau Patient';
      ['prenom','nom','ddn','medecin','adresse','notes','urgent','status'].forEach(k => {
        const input = document.getElementById('np-'+k);
        if(input) input.value = p ? p[k]||'' : (k==='status'?'active':'');
      });
      const sel = document.getElementById('np-couple');
      if(sel) sel.innerHTML = '<option value="">-- Aucun --</option>' + state.patients.filter(x=>x.id!==state.activePid).map(x=>`<option value="${x.id}" ${p&&p.coupleWith==x.id?'selected':''}>${x.prenom} ${x.nom}</option>`).join('');
    }
    el.classList.add('open'); 
  },

  closeModal(id) { 
    const el = document.getElementById(id);
    if(el) el.classList.remove('open'); 
  },

  go(p, pid, did) { 
    state.page = p; 
    if(pid !== undefined && pid !== null) state.activePid = pid; 
    if(did !== undefined && did !== null) state.activeDid = did; 
    this.render(); 
    window.scrollTo(0,0); 
  },

  render() {
    const a = document.getElementById('app');
    if(!a) return;
    try {
      let html = '';
      switch(state.page) {
        case 'auth': html = this.vAuth(); break;
        case 'login': html = this.vLogin(); break;
        case 'home': html = this.vHome(); break;
        case 'dossier': html = this.vDossier(); break;
        case 'form': html = this.vForm(); break;
        case 'modeles': html = this.vModeles(); break;
        case 'data': html = this.vData(); break;
        case 'ordonnancier': html = this.vOrdonnancier(); break;
        default: html = this.vHome();
      }
      a.innerHTML = html;
    } catch(e) {
      console.error('Render error:', e);
      a.innerHTML = `<div style="padding:40px; text-align:center; color:white;">
        <h2>⚠️ Erreur d'affichage</h2>
        <p style="font-size:12px; margin:20px 0; opacity:0.7">${e.message}</p>
        <button class="modal-btn" onclick="state.page='home'; ui.render()">Retour Accueil</button>
      </div>`;
    }
  },

  vAuth() {
    return `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;background:var(--bg)">
      <div style="font-size:40px;margin-bottom:20px">🔒</div>
      <p style="margin-bottom:30px">Saisissez votre code PIN</p>
      <input type="password" id="auth-pin" maxlength="4" inputmode="numeric" style="width:150px;height:50px;background:var(--bg3);border:1px solid var(--border);border-radius:12px;color:white;font-size:32px;text-align:center;letter-spacing:10px;outline:none">
      <button class="modal-btn" style="max-width:200px;margin-top:30px" onclick="auth.checkPin()">Valider</button>
    </div>`;
  },

  vLogin() {
    return `<div style="height:100%;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:20px;text-align:center;background:linear-gradient(135deg, var(--bg) 0%, var(--bg2) 100%)">
      <img src="logo.png" style="width:90px;height:90px;border-radius:20px;margin-bottom:20px;box-shadow:0 10px 30px rgba(0,0,0,0.5)">
      <h1>SoinsMobile</h1><p style="color:var(--text3);margin-bottom:40px">Choisissez votre profil</p>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%;max-width:360px">
        <div class="patient-card" style="flex-direction:column;padding:30px 10px;text-align:center" onclick="state.currentUser='Florence';ui.go('home')"><span style="font-size:40px">🐶</span><br><b>Florence</b></div>
        <div class="patient-card" style="flex-direction:column;padding:30px 10px;text-align:center" onclick="state.currentUser='Céline';ui.go('home')"><span style="font-size:40px">🐴</span><br><b>Céline</b></div>
      </div>
      <div style="position:fixed;bottom:20px;font-size:10px;color:var(--text3)">V1.0 FINAL</div>
    </div>`;
  },

  vHome() {
    const q = (state.search||'').toLowerCase();
    const fil = state.patients.filter(p => p.status === state.category && `${p.nom} ${p.prenom}`.toLowerCase().includes(q));
    const seen = state.patients.filter(p => p.status==='active' && (p.seenDates||[]).includes(utils.today())).length;
    let h = ''; const done = new Set();
    fil.forEach(p => {
      if(done.has(p.id)) return; done.add(p.id);
      const pt = p.coupleWith ? fil.find(x => x.id === p.coupleWith) : null;
      if(pt && !done.has(pt.id)) { done.add(pt.id); h += `<div class="couple-group"><div class="couple-label">💑 Foyer ${p.nom}</div>${this.pCard(p)}${this.pCard(pt)}</div>`; }
      else h += this.pCard(p);
    });
    return `<div class="topbar">
      <div style="text-align:left"><div class="topbar-title">SoinsMobile</div><div style="font-size:10px;color:var(--text2)">${new Date().toLocaleDateString()}</div></div>
      <div style="display:flex;gap:8px;align-items:center"><button class="tbtn" onclick="ui.go('ordonnancier')">💊</button><div class="user-badge">${state.currentUser==='Florence'?'🐶':'🐴'}</div><button class="tbtn" onclick="ui.go('data')">⚙️</button><button class="tbtn accent" onclick="state.activePid=null;ui.openModal('modal-patient')">＋</button></div>
    </div>
    <div class="content">
      <div class="cat-toggle"><div class="cat-btn ${state.category==='active'?'active':''}" onclick="state.category='active';ui.render()">En cours</div><div class="cat-btn ${state.category==='pds'?'active':''}" onclick="state.category='pds';ui.render()">PDS</div><div class="cat-btn ${state.category==='archived'?'active':''}" onclick="state.category='archived';ui.render()">Anciens</div></div>
      <div class="stats-bar"><div class="stat-chip"><div class="val">${state.patients.filter(x=>x.status==='active').length}</div><div class="lbl">Actifs</div></div><div class="stat-chip"><div class="val">${seen}</div><div class="lbl">Vus</div></div></div>
      <div class="search-wrap"><input class="search-input" id="si" placeholder="Rechercher..." value="${state.search}" oninput="state.search=this.value;ui.render();document.getElementById('si').focus()"></div>
      <div class="patient-list">${h || '<div style="text-align:center;padding:40px;opacity:0.3">Vide</div>'}</div>
    </div>`;
  },

  pCard(p) {
    const isSeen = (p.seenDates||[]).includes(utils.today());
    return `<div class="patient-card anim ${p.urgent?'urgent':''}" onclick="ui.go('dossier', ${p.id})">
      <div class="patient-avatar" style="background:${p.color}22;color:${p.color}">${utils.ini(p)}</div>
      <div class="patient-info"><div class="patient-name">${p.prenom} ${p.nom}</div><div class="patient-meta">${utils.age(p.ddn)} — ${p.medecin}</div></div>
      ${isSeen?'<span style="color:var(--accent2);font-size:18px">✓</span>':''}
    </div>`;
  },

  vDossier() {
    const p = utils.p(state.activePid); 
    if(!p) return `<div style="padding:40px; text-align:center; color:white;"><h2>Dossier introuvable</h2><button class="modal-btn" onclick="ui.go('home')">Retour</button></div>`;
    const isSeen = (p.seenDates||[]).includes(utils.today());
    const ids = [{k:'vitale',l:'Carte Vitale',i:'💳'},{k:'mutuelle',l:'Mutuelle',i:'🛡️'},{k:'identite',l:'C.N.I',i:'🆔'}];
    
    return `<div class="topbar"><button class="tbtn" onclick="ui.go('home')">←</button><div class="topbar-title">${p.prenom} ${p.nom}</div><div style="display:flex;gap:6px"><button class="tbtn" onclick="ui.openModal('modal-patient')">✏️</button></div></div>
    <div class="content anim">
      <div class="patient-card" style="margin-bottom:20px;cursor:default"><div class="patient-avatar" style="width:56px;height:56px;background:${p.color}22;color:${p.color};font-size:24px">${utils.ini(p)}</div><div class="patient-info"><h2 style="font-size:20px">${p.prenom} ${p.nom}</h2><p style="color:var(--text2)">${utils.fd(p.ddn)} (${utils.age(p.ddn)})</p></div></div>
      <button class="vu-btn ${isSeen?'is-seen':'not-seen'}" onclick="core.toggleVu(${p.id})">${isSeen?'✅ Vu aujourd\'hui':'⬜ Marquer comme vu'}</button>
      
      <div class="section-label">Identité</div>
      <div class="docs-grid" style="grid-template-columns: repeat(3, 1fr); margin-bottom: 20px;">
        ${ids.map(id => {
          const hasImg = p.idDocs && p.idDocs[id.k];
          return `<div class="doc-card ${hasImg?'active':''}" style="text-align:center; padding: 10px 5px;" onclick="core.handleIdClick('${id.k}')">
            <span style="font-size:20px; display:block;">${id.i}</span>
            <div style="font-size:10px; margin-top:5px;">${id.l}</div>
            ${hasImg ? '<div style="font-size:8px; color:var(--accent2); margin-top:2px">✓ Photo</div>' : ''}
          </div>`;
        }).join('')}
      </div>

      <div class="section-label">Contacts</div>
      <div style="margin-bottom: 20px;">
        ${(p.contacts||[]).map(c => `<div class="patient-card" style="padding: 10px; margin-bottom: 5px; flex-direction:column; align-items:flex-start;">
          <div style="width:100%; display:flex; justify-content:space-between; align-items:center;">
            <b>${c.nom}</b>
            <button class="tbtn" style="background:transparent; color:var(--red); font-size:14px; width:auto; height:auto;" onclick="core.deleteContact(${p.id}, ${c.id})">✕</button>
          </div>
          <div style="font-size:12px; color:var(--text2); margin-top:4px;">
            ${c.tel ? `<div>📞 ${c.tel}</div>` : ''}
            ${c.mail ? `<div style="word-break:break-all;">✉️ ${c.mail}</div>` : ''}
          </div>
          <div style="display:flex; gap:10px; margin-top:8px; width:100%;">
            ${c.tel ? `<a href="tel:${c.tel}" class="cat-btn" style="flex:1; text-decoration:none; padding:6px; font-size:10px;">Appeler</a>` : ''}
            ${c.mail ? `<a href="mailto:${c.mail}" class="cat-btn" style="flex:1; text-decoration:none; padding:6px; font-size:10px; border-color:var(--blue); color:var(--blue);">Email</a>` : ''}
          </div>
        </div>`).join('')}
        <button class="cat-btn" style="width:100%; margin-top:5px; border-style:dashed" onclick="ui.openModal('modal-contact')">＋ Ajouter un contact</button>
      </div>

      <div class="section-label">Documents</div>
      <div class="docs-grid">${(p.docs||[]).map(d => `<div class="doc-card" onclick="ui.go('form',${p.id},${d.id})"><span class="doc-icon">${d.icon}</span><div class="doc-name">${d.label}</div></div>`).join('')}<div class="doc-card" style="border:2px dashed var(--border);text-align:center" onclick="ui.go('modeles')"><span style="font-size:24px">＋</span></div></div>
    </div>`;
  },

  vModeles() {
    const ms = [{t:'tension',i:'🩺',l:'Tension'},{t:'glycemie',i:'🩸',l:'Glycémie'},{t:'pansement',i:'🩹',l:'Pansement'},{t:'labo',i:'🧪',l:'Labo'},{t:'ordonnance',i:'💊',l:'Ordonnance'},{t:'consentement',i:'✍️',l:'Consentement'}];
    return `<div class="topbar"><button class="tbtn" onclick="ui.go('dossier',state.activePid)">←</button><div class="topbar-title">Nouveau document</div><div style="width:36px"></div></div>
    <div class="content anim"><div class="patient-list">${ms.map(m => `<div class="patient-card" onclick="core.createDoc('${m.t}')"><span style="font-size:24px;margin-right:10px">${m.i}</span><b>${m.l}</b></div>`).join('')}</div></div>`;
  },

  vForm() {
    const p = utils.p(state.activePid); 
    const d = p ? p.docs.find(x => x.id == state.activeDid) : null;
    if(!p || !d) return `<div style="padding:40px; text-align:center; color:white;"><h2>Document introuvable</h2><button class="modal-btn" onclick="ui.go('home')">Retour</button></div>`;
    
    let content = '';
    if(d.type==='tension') content = this.fTension(d);
    else if(d.type==='glycemie') content = this.fGlycemie(d);
    else if(d.type==='ordonnance') content = this.fOrdonnance(d);
    else if(d.type==='labo') content = this.fLabo(d);
    else if(d.type==='consentement') content = this.fConsentement(d);
    else content = `<textarea class="modal-input" id="obs" style="min-height:200px" oninput="ui.autoSave()">${d.obs||''}</textarea>`;

    return `<div class="topbar"><button class="tbtn" onclick="ui.go('dossier',${p.id})">←</button><div class="topbar-title">${d.label}</div><button class="tbtn" onclick="ui.exportPdf()">📄</button></div>
    <div class="content anim">
      <input type="datetime-local" id="doc-dt" value="${d.datetime}" class="modal-input" style="margin-bottom:20px" oninput="ui.autoSave()">
      ${content}
      <button class="modal-btn" onclick="ui.go('dossier',${p.id})">💾 Enregistrer & Fermer</button>
    </div>`;
  },

  vOrdonnancier() {
    const o = [];
    state.patients.forEach(p => (p.docs||[]).filter(d => d.type === 'ordonnance').forEach(or => o.push({p, or})));
    return `<div class="topbar"><button class="tbtn" onclick="ui.go('home')">←</button><div class="topbar-title">Ordonnancier</div><div style="width:36px"></div></div>
    <div class="content anim"><div class="patient-list">
      ${o.length ? o.map(i => `<div class="patient-card" onclick="ui.go('form', ${i.p.id}, ${i.or.id})">💊 ${i.or.label} - ${i.p.prenom} ${i.p.nom}</div>`).join('') : '<div style="text-align:center;padding:40px;opacity:0.3">Aucune ordonnance</div>'}
    </div></div>`;
  },

  vData() {
    return `<div class="topbar"><button class="tbtn" onclick="ui.go('home')">←</button><div class="topbar-title">Réglages</div><div style="width:36px"></div></div>
    <div class="content anim"><button class="modal-btn" onclick="auth.setPin()">🔑 Code PIN</button><button class="modal-btn" onclick="state.page='login';ui.render()" style="margin-top:10px;background:var(--bg3)">🔄 Profil (${state.currentUser})</button><button class="modal-btn" style="margin-top:40px;background:var(--red)" onclick="ui.reset()">⚠️ Reset complet</button></div>`;
  },

  exportPdf() {
    const p = utils.p(state.activePid);
    const d = p.docs.find(x => x.id == state.activeDid);
    const div = document.createElement('div');
    div.innerHTML = `<div style="padding:40px; font-family:sans-serif; background:white; color:black;">
      <h1 style="color:#1a9e7e">${d.label}</h1>
      <p><b>Patient:</b> ${p.prenom} ${p.nom}</p>
      <p><b>Date:</b> ${new Date(d.datetime).toLocaleString()}</p>
      <hr>
      <div style="margin-top:20px">${document.querySelector('.content').innerHTML}</div>
    </div>`;
    div.querySelectorAll('button, input[type="file"], .doc-card').forEach(el => el.remove());
    // Convertir les inputs en texte pour le PDF
    div.querySelectorAll('input').forEach(i => {
      const span = document.createElement('span');
      span.textContent = i.value;
      i.parentNode.replaceChild(span, i);
    });
    html2pdf().from(div).set({margin:10, filename: `${p.nom}_${d.label}.pdf`}).save();
  },

  addRow() { 
    const p=utils.p(state.activePid); 
    const d=p ? p.docs.find(x=>x.id==state.activeDid) : null; 
    if(d) {
      d.entries.push({date:utils.today(),heure:'08:00',sys:'',dia:'',pouls:'',avant:'',apres:''}); 
      this.render(); 
    }
  },

  autoSave() {
    core.autoSave();
  },

  reset() { if(confirm('TOUT EFFACER ?')) { indexedDB.deleteDatabase(DB_NAME); location.reload(); } }
};