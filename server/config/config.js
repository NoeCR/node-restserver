// =====================
//  Puerto
// =====================
process.env.PORT = process.env.PORT || 3000;


// ======================
// Entorno
// =====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ======================
// Vencimiento del Token
// =====================
// 60 segundos * 60 minutos * 24 horas * 30 dias
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ======================
// SEED de atenticación
// =====================
process.env.SEED = process.env.SEED || 'semilla-de-desarrollo';

// ======================
// Google client ID
// =====================
process.env.CLIENT_ID = process.env.CLIENT_ID || '133612375483-2hn9jlo82ajkllf1h9s85hodhcjlv786.apps.googleusercontent.com';
// ======================
// Base de datos
// =====================

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;