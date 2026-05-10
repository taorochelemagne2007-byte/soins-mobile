// DB ENGINE
const db = {
  init() {
    return new Promise((res, rej) => {
      const req = indexedDB.open(DB_NAME, DB_VERSION);
      req.onupgradeneeded = e => {
        const d = e.target.result;
        ['patients','files','config'].forEach(s => { if(!d.objectStoreNames.contains(s)) d.createObjectStore(s, {keyPath:s==='config'?'key':'id'}); });
      };
      req.onsuccess = e => { state.db = e.target.result; res(); };
      req.onerror = () => rej();
    });
  },
  async save(s, d) { const tx = state.db.transaction(s, 'readwrite'); return new Promise(r => { tx.objectStore(s).put(d).onsuccess = () => r(); }); },
  async getAll(s) { const tx = state.db.transaction(s, 'readonly'); return new Promise(r => { tx.objectStore(s).getAll().onsuccess = e => r(e.target.result); }); },
  async get(s, id) { const tx = state.db.transaction(s, 'readonly'); return new Promise(r => { tx.objectStore(s).get(id).onsuccess = e => r(e.target.result); }); },
  async delete(s, id) { const tx = state.db.transaction(s, 'readwrite'); return new Promise(r => { tx.objectStore(s).delete(id).onsuccess = () => r(); }); }
};