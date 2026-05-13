const auth = {
  checkPin() { if(document.getElementById('auth-pin').value===state.pin){ state.authenticated=true; state.page='login'; ui.render(); } else { ui.toast('❌ PIN incorrect'); } },
  async setPin() { const p=prompt('PIN 4 chiffres :'); if(p===''){await db.delete('config','app_pin'); state.pin=null;} else if(/^\d{4}$/.test(p)){await db.save('config',{key:'app_pin',value:p}); state.pin=p;} ui.render(); }
};