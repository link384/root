/**
 * D'Mima - Datos Compartidos
 * Este archivo contiene los datos de configuracion que son compartidos
 * entre la tienda (index.html) y el panel de control (admin.html)
 * Generado desde el Panel de Control: 2/5/2026, 21:57:52
 */

// Numero de WhatsApp para pedidos (sin el +)
var CELULAR_EMPRESA = '5363282554';

// Direccion de la tienda
var MEU_ENDERECO = null;

// Municipios de La Habana con costo de envio (en MN / CUP)
var MUNICIPIOS_HABANA = [
    { id: 'habana-vieja', nome: 'Habana Vieja', costo: 200 },
    { id: 'centro-habana', nome: 'Centro Habana', costo: 200 },
    { id: 'plaza', nome: 'Plaza de la Revolución', costo: 250 },
    { id: 'cerro', nome: 'Cerro', costo: 250 },
    { id: 'diez-de-octubre', nome: 'Diez de Octubre', costo: 250 },
    { id: 'playa', nome: 'Playa', costo: 350 },
    { id: 'marianao', nome: 'Marianao', costo: 400 },
    { id: 'la-lisa', nome: 'La Lisa', costo: 450 },
    { id: 'boyeros', nome: 'Boyeros', costo: 400 },
    { id: 'arroyo-naranjo', nome: 'Arroyo Naranjo', costo: 400 },
    { id: 'san-miguel', nome: 'San Miguel del Padrón', costo: 350 },
    { id: 'guanabacoa', nome: 'Guanabacoa', costo: 400 },
    { id: 'regla', nome: 'Regla', costo: 300 },
    { id: 'habana-del-este', nome: 'Habana del Este', costo: 450 },
    { id: 'cotorro', nome: 'Cotorro', costo: 500 }
];

// Metadata de las categorias: nombre visible, icono y clave interna
var CATEGORIAS = {
    "burgers": { nome: "Mercado", icone: "fas fa-store" },
    "pizzas": { nome: "Quesos y Embutidos", icone: "fas fa-bacon" },
    "churrasco": { nome: "Carnico", icone: "fas fa-drumstick-bite" },
    "steaks": { nome: "Harinas y Levaduras", icone: "fas fa-bread-slice" },
    "bebidas": { nome: "Liquidos", icone: "fas fa-tint" },
    "sobremesas": { nome: "Aseo", icone: "fas fa-soap" },
    "outros": { nome: "Confituras", icone: "fas fa-candy-cane" },
    "Condimentos": { nome: "Salsas, condimentos y sazones", icone: "fas fa-pepper-hot" },
    "Granos y Pastas": { nome: "Granos y Pastas", icone: "fas fa-seedling" }
};
