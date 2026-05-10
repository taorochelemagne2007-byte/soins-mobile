// UTILS
const utils = {
  p: id => state.patients.find(x => x.id == id),
  ini: p => (p.prenom[0]||'') + (p.nom[0]||''),
  fd: d => { if(!d) return ''; const p=d.split('-'); return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:d },
  age: d => { if(!d) return ''; return Math.floor((Date.now()-new Date(d))/31557600000)+' ans' },
  today: () => new Date().toISOString().split('T')[0],
  now: () => new Date().toISOString().slice(0,16),
  toIso: fr => { if(!fr) return utils.today(); const p=fr.split('/'); return p.length===3?`${p[2]}-${p[1]}-${p[0]}`:utils.today() },
  toFr: iso => { if(!iso) return ''; const p=iso.split('-'); return p.length===3?`${p[2]}/${p[1]}/${p[0]}`:iso }
};