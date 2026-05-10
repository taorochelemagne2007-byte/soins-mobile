const DB_NAME = 'SoinsMobile_V1_Final_Prod';
const DB_VERSION = 1;
const COLORS = ['#1a9e7e','#4a9edd','#e0a832','#e05252','#9b7de0','#e07a5f'];

let state = { 
  page: 'login', 
  currentUser: null, 
  authenticated: false, 
  pin: null, 
  patients: [], 
  activePid: null, 
  activeDid: null, 
  search: '', 
  category: 'active', 
  db: null 
};

core.boot();