// Factor de conversion: 1 kg = 2.20462 lb
var CONVERSION_LB_KG = 2.20462;

var MENU = {
    "churrasco": [
        {
            "id": "carne-de-res",
            "img": "./img/cardapio/Carnico/carne-res.jpg",
            "name": "Carne de Res",
            "dsc": "Carne de res fresca de primera calidad, los paquetes vienen por más de 2Lb",
            "price": 1650,
            "unit": "lb",
            "options": [
                {
                    "name": "jaba",
                    "required": false,
                    "choices": [
                        {
                            "name": "jaba",
                            "price": 8
                        }
                    ]
                }
            ]
        },
        {
            "id": "ribs-brisket-and-burnt-ends",
            "img": "./img/cardapio/Carnico/Higado de pollo.jpg",
            "name": "Higado de pollo",
            "dsc": "Higado de pollo",
            "price": 780,
            "unit": "unidad"
        },
        {
            "id": "woodford-reserve-mint-julep-syrup",
            "img": "./img/cardapio/Carnico/Hígado de res.jpg",
            "name": "Hígado de res",
            "dsc": "Hígado de res",
            "price": 900,
            "unit": "unidad"
        },
        {
            "id": "guys-caliente-margaritas-for-12",
            "img": "./img/cardapio/Carnico/Carton de huevo.webp",
            "name": "Carton de huevo",
            "dsc": "Carton de huevo",
            "price": 2850,
            "unit": "unidad"
        },
        {
            "id": "sea-salted-caramel-swirl-cheesecake",
            "img": "./img/cardapio/Carnico/Huevos Sueltos de Gallina.webp",
            "name": "Huevos Sueltos de Gallina",
            "dsc": "Huevos Sueltos de Gallina",
            "price": 100,
            "unit": "unidad"
        },
        {
            "id": "Amitriptilina",
            "img": "./img/cardapio/Carnico/Lomo de cerdo NATURAL.webp",
            "name": "Lomo de cerdo (Natural)",
            "dsc": "Lomo de cerdo (Natural)",
            "price": 1200,
            "unit": "lb"
        },
        {
            "id": "super2",
            "img": "./img/cardapio/Carnico/Mollejas de Pollo Aurora 1kg.webp",
            "name": "Mollejas de Pollo Aurora 1kg",
            "dsc": "Mollejas de Pollo Aurora 1kg",
            "price": 1200,
            "unit": "unidad"
        },
        {
            "id": "paletas-de-cerdo-deshuesada",
            "img": "./img/cardapio/Carnico/Paletas de Cerdo deshuesada.jpeg",
            "name": "Paletas de Cerdo deshuesada",
            "dsc": "Paletas de Cerdo deshuesada",
            "price": 1100,
            "unit": "lb"
        },
        {
            "id": "pechuga-de-pollo-sin-hueso-10-lb",
            "img": "./img/cardapio/Carnico/Pechuga de pollo sin hueso 10 lb.jpeg",
            "name": "Pechuga de pollo sin hueso 10 lb",
            "dsc": "Pechuga de pollo sin hueso 10 lb",
            "price": 900,
            "unit": "lb"
        },
        {
            "id": "picadillo-mdm",
            "img": "./img/cardapio/Carnico/Picadillo MDM.jpg",
            "name": "Picadillo MDM",
            "dsc": "Picadillo MDM",
            "price": 320,
            "unit": "lb"
        },
        {
            "id": "muslos-de-pollo-10-lb-",
            "img": "./img/cardapio/Carnico/Muslos de pollo (10 lb).jpg",
            "name": "Muslos de pollo (10 lb)",
            "dsc": "Muslos de pollo (10 lb)",
            "price": 4250,
            "unit": "unidad"
        },
        {
            "id": "pechugas-de-pollo-lar-2kg-",
            "img": "./img/cardapio/Carnico/Pechugas de Pollo - Lar (2Kg).webp",
            "name": "Pechugas de Pollo - Lar (2Kg)",
            "dsc": "Pechugas de Pollo - Lar (2Kg)",
            "price": 4400,
            "unit": "unidad"
        }
    ],
    "burgers": [
        {
            "id": "the-gramercy-tavern-burger-4-pack",
            "img": "./img/cardapio/Mercado/aseite sublime.jpg",
            "name": "Aceite 900Ml",
            "dsc": "Aceite Sublime del gordo",
            "price": 1190,
            "unit": "unidad"
        },
        {
            "id": "shake-shack-shackburger-8-pack",
            "img": "./img/cardapio/Mercado/aceituna con hueso.jpg",
            "name": "Aceituna Verde Con Hueso",
            "dsc": "Aceituna Verde Con Hueso",
            "price": 1000,
            "unit": "unidad"
        },
        {
            "id": "double-stack-burger-kit-for-4",
            "img": "./img/cardapio/Mercado/Atun en Aceite 140 gramos.webp",
            "name": "Atun en Aceite 140 gramos",
            "dsc": "Atun en Aceite 140 gramos",
            "price": 450,
            "unit": "unidad"
        },
        {
            "id": "goldbelly-burger-bash-pack",
            "img": "./img/cardapio/Mercado/Azucar.webp",
            "name": "Azucar 1KG",
            "dsc": "Azucar 1KG",
            "price": 690,
            "unit": "unidad"
        },
        {
            "id": "burger-au-poivre-kit-4-pack",
            "img": "./img/cardapio/Mercado/Café SELLO ROJO.webp",
            "name": "Café Sello Rojo",
            "dsc": "Café SELLO ROJO",
            "price": 1850,
            "unit": "unidad"
        },
        {
            "id": "goldbelly-burger-blend-4-lbs",
            "img": "./img/cardapio/Mercado/CAFÉ CANDADO.webp",
            "name": "Café Candado",
            "dsc": "CAFÉ CANDADO",
            "price": 1900,
            "unit": "unidad"
        },
        {
            "id": "gotts-complete-cheeseburger-kit-for-8",
            "img": "./img/cardapio/Mercado/CAFÉ PILÓN.webp",
            "name": "Café Pilón",
            "dsc": "Café Pilón",
            "price": 1850,
            "unit": "unidad"
        },
        {
            "id": "complete",
            "img": "./img/cardapio/Mercado/Mayonesa Celorio (500ML).webp",
            "name": "Mayonesa Celorio (500ML)",
            "dsc": "Mayonesa Celorio (500ML)",
            "price": 1650,
            "unit": "unidad"
        },
        {
            "id": "gelatina-de-diferentes-sabores",
            "img": "./img/cardapio/Mercado/Caja de 3 Gelatinas.webp",
            "name": "Gelatina de diferentes sabores",
            "dsc": "Gelatina de piña",
            "price": 280,
            "unit": "unidad",
            "options": [
                {
                    "name": "Sabor",
                    "required": true,
                    "choices": [
                        "Piña",
                        "Fresa",
                        "Naranja",
                        "Limón",
                        "Uva"
                    ]
                }
            ]
        },
        {
            "id": "23699-choose-your-own-thin-crust-pizza-4-pack",
            "img": "./img/cardapio/Mercado/Leche en Polvo MU (1kg).webp",
            "name": "Leche en Polvo MU (1kg)",
            "dsc": "Leche en Polvo MU (1kg)",
            "price": 2550,
            "unit": "unidad"
        },
        {
            "id": "choose-your-own-new-haven-style-pizza-6-pack",
            "img": "./img/cardapio/Mercado/Leche condensada Vamica (380 g).jpg",
            "name": "Leche condensada Vamica (380 g)",
            "dsc": "Leche condensada Vamica (380 g)",
            "price": 500,
            "unit": "unidad"
        },
        {
            "id": "california-reserve-filet-mignon-steaks-gift-box",
            "img": "./img/cardapio/Mercado/Jabita de Leche en polvo 1Kg.webp",
            "name": "Jabita de Leche en polvo 1Kg",
            "dsc": "Jabita de Leche en polvo 1Kg",
            "price": 2230,
            "unit": "unidad"
        },
        {
            "id": "6-lou-malnatis-deep-dish-pizzas",
            "img": "./img/cardapio/Mercado/Mantequilla Bel Campo.jpg",
            "name": "Mantequilla Bel Campo",
            "dsc": "Mantequilla Bel Campo",
            "price": 550,
            "unit": "unidad"
        },
        {
            "id": "pasta-para-bocadito",
            "img": "./img/cardapio/Mercado/Pasta para Bocadito.webp",
            "name": "Pasta para Bocadito",
            "dsc": "Pasta para Bocadito",
            "price": 950,
            "unit": "unidad"
        },
        {
            "id": "pasta-para-bocaditos-hena",
            "img": "./img/cardapio/Mercado/Pasta para bocaditos Hena.jpg",
            "name": "Pasta para bocaditos Hena",
            "dsc": "Pasta para bocaditos Hena",
            "price": 1400,
            "unit": "unidad"
        },
        {
            "id": "paquete-de-sal-fina-1kg-",
            "img": "./img/cardapio/Mercado/Paquete de Sal Fina (1kg).webp",
            "name": "Paquete de Sal Fina (1kg)",
            "dsc": "Paquete de Sal Fina (1kg)",
            "price": 350,
            "unit": "unidad"
        },
        {
            "id": "sardinas-en-tomate-docanned",
            "img": "./img/cardapio/Mercado/Sardinas en Tomate Docanned.webp",
            "name": "Sardinas en Tomate Docanned",
            "dsc": "Sardinas en Tomate Docanned",
            "price": 800,
            "unit": "unidad"
        },
        {
            "id": "sopa-de-fideos-instant-neos-vitarella",
            "img": "./img/cardapio/Mercado/Sopa de Fideos Instantáneos Vitarella.webp",
            "name": "Sopa de Fideos Instantáneos Vitarella",
            "dsc": "Sopa de Fideos Instantáneos Vitarella",
            "price": 230,
            "unit": "unidad"
        },
        {
            "id": "vinagre-la-esperanza-1l-",
            "img": "./img/cardapio/Mercado/Vinagre La Esperanza ( 1L ).jpg",
            "name": "Vinagre La Esperanza ( 1L )",
            "dsc": "Vinagre La Esperanza ( 1L )",
            "price": 300,
            "unit": "unidad"
        },
        {
            "id": "vino-seco-la-esperanza-1000-g-",
            "img": "./img/cardapio/Mercado/Vino Seco La Esperanza (1000 g).webp",
            "name": "Vino Seco La Esperanza (1000 g)",
            "dsc": "Vino Seco La Esperanza (1000 g)",
            "price": 300,
            "unit": "unidad"
        }
    ],
    "sobremesas": [
        {
            "id": "luigis-original-cannoli-pie",
            "img": "./img/cardapio/Aseo/Detergente Marwa 400g.webp",
            "name": "Detergente Marwa 400g",
            "dsc": "Detergente Marwa 400g",
            "price": 450,
            "unit": "unidad"
        },
        {
            "id": "sea-salted-caramel-swirl-cheesecake",
            "img": "./img/cardapio/Aseo/Detergente Líquido KAPITAL.jpg",
            "name": "Detergente Líquido KAPITAL 750G",
            "dsc": "Detergente Líquido KAPITAL 750G",
            "price": 740,
            "unit": "unidad"
        },
        {
            "id": "pollo-entero",
            "img": "./img/cardapio/Aseo/jabon de baño 100g.webp",
            "name": "Jabon de baño 100g",
            "dsc": "jabon de baño 100g",
            "price": 160,
            "unit": "unidad"
        },
        {
            "id": "cerdo-pierna",
            "img": "./img/cardapio/Aseo/jabon de lavar miya.jpg",
            "name": "Jabón de lavar miya 150g",
            "dsc": "Jabón de lavar miya 150g",
            "price": 260,
            "unit": "unidad"
        },
        {
            "id": "papel-higi-nico",
            "img": "./img/cardapio/Aseo/Papel higiénico.jpg",
            "name": "Papel higiénico",
            "dsc": "Papel higiénico",
            "price": 140,
            "unit": "unidad"
        }
    ],
    "bebidas": [
        {
            "id": "15259-german-chocolate-killer-brownie-tin-pack",
            "img": "./img/cardapio/Liquidos/Jugo Goliath.jpg",
            "name": "Jugo Goliath",
            "dsc": "Jugo Goliath",
            "price": 800,
            "unit": "unidad"
        },
        {
            "id": "yogurt-probi-tico-yokey-1-54-litros",
            "img": "./img/cardapio/Liquidos/Yogurt Probiótico Yokey - 1.54 litros.webp",
            "name": "Yogurt Probiótico Yokey - 1.54 litros",
            "dsc": "Yogurt Probiótico Yokey - 1.54 litros",
            "price": 2400,
            "unit": "unidad",
            "options": [
                {
                    "name": "Sabor",
                    "required": true,
                    "choices": [
                        "Fresa",
                        "Natural",
                        "Vainilla",
                        "Coco",
                        "Piña"
                    ]
                }
            ]
        }
    ],
    "outros": [
        {
            "id": "brooklyn-blackout-cookie-brownie-combo-pack-2-tins",
            "img": "./img/cardapio/Mercado/Fanguito (Leche Condensada).webp",
            "name": "Fanguito (Leche Condensada)",
            "dsc": "Fanguito (Leche Condensada)",
            "price": 550,
            "unit": "unidad"
        },
        {
            "id": "17481-jewish-dessert-3-pack",
            "img": "./img/cardapio/Confituras/Galletas Crokantinas.webp",
            "name": "Galletas Crokantinas ",
            "dsc": "Galletas Crokantinas Paquete entero",
            "price": 1250,
            "unit": "unidad"
        },
        {
            "id": "dessert-bar-care-package",
            "img": "./img/cardapio/Confituras/Paquetico de Galletas de Soda Crokantinas.jpeg",
            "name": "Galletas sueltas de Soda Crokantinas",
            "dsc": "Galletas sueltas de Soda Crokantinas",
            "price": 190,
            "unit": "unidad"
        },
        {
            "id": "wood-fired-pizzas-best-seller-4-pack",
            "img": "./img/cardapio/Confituras/Natilla.webp",
            "name": "Natilla",
            "dsc": "Natilla",
            "price": 220,
            "unit": "unidad"
        },
        {
            "id": "papas-potato-china-110g",
            "img": "./img/cardapio/Confituras/Papas potato china 110g.jpg",
            "name": "Papas potato china 110g",
            "dsc": "Papas potato china 110g",
            "price": 750,
            "unit": "unidad"
        }
    ],
    "pizzas": [
        {
            "id": "hong-kong-boba-tea-kit-for-6",
            "img": "./img/cardapio/Quesos y Embutidos/QUESO-GOUDA-VIMA.webp",
            "name": "Queso Gouda Vima 3Kg Aprox.",
            "dsc": "Queso Gouda Vima 3Kg Aprox.",
            "price": 14500,
            "unit": "unidad"
        },
        {
            "id": "super1",
            "img": "./img/cardapio/Quesos y Embutidos/Mortadela Seara 1 kg.webp",
            "name": "Mortadela Seara 1 kg",
            "dsc": "Mortadela Seara 1 kg",
            "price": 1180,
            "unit": "unidad"
        },
        {
            "id": "salchicha-de-pollo-oderich-340g-",
            "img": "./img/cardapio/Quesos y Embutidos/Salchicha de Pollo Oderich (340g).webp",
            "name": "Salchicha de Pollo Oderich (340g)",
            "dsc": "",
            "price": 510,
            "unit": "unidad"
        },
        {
            "id": "queso-crema-prairie",
            "img": "./img/cardapio/Quesos y Embutidos/Queso crema Prairie.jpg",
            "name": "Queso crema Prairie",
            "dsc": "Queso crema Prairie",
            "price": 1150,
            "unit": "unidad"
        },
        {
            "id": "spam-de-pollo-tubo-de-400-g-",
            "img": "./img/cardapio/Quesos y Embutidos/Spam de pollo ( tubo de 400 g).webp",
            "name": "Spam de pollo ( tubo de 400 g)",
            "dsc": "Spam de pollo ( tubo de 400 g)",
            "price": 650,
            "unit": "unidad"
        },
        {
            "id": "spam-jamonilla-de-pollo-enlatado-340g",
            "img": "./img/cardapio/Quesos y Embutidos/Spam ( jamonilla ) de Pollo Enlatado 340g.webp",
            "name": "Spam ( jamonilla ) de Pollo Enlatado 340g",
            "dsc": "Spam ( jamonilla ) de Pollo Enlatado 340g",
            "price": 670,
            "unit": "unidad"
        }
    ],
    "steaks": [
        {
            "id": "2-lou-malnatis-deep-dish-pizzas",
            "img": "./img/cardapio/Harinas y Levaduras/Harina.webp",
            "name": "Harina por libra",
            "dsc": "Harina por libra",
            "price": 350,
            "unit": "lb"
        },
        {
            "id": "choose-your-own-ice-cream-donuts-6-pack",
            "img": "./img/cardapio/Harinas y Levaduras/Levadura Apalav.jpg",
            "name": "Levadura Apalav (500g)",
            "dsc": "Levadura Apalav (500g)",
            "price": 1500,
            "unit": "unidad"
        }
    ],
    "Condimentos": [
        {
            "id": "luigis-original-cannoli-pie",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Zumo de limón Badia (295.7 ml).webp",
            "name": "Zumo de limón Badia (295.7 ml)",
            "dsc": "Zumo de limón Badia (295.7 ml)",
            "price": 900,
            "unit": "unidad"
        },
        {
            "id": "gotts-cheeseburger-kit-for-4",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Adobo con pimienta.jpg",
            "name": "Adobo con pimienta",
            "dsc": "Adobo con pimienta",
            "price": 1800,
            "unit": "unidad"
        },
        {
            "id": "le-big-matt-kit-for-6",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Ajo_troceado_BADIA.jpg",
            "name": "Ajo_troceado_BADIA.jpg",
            "dsc": "Ajo troceado BADIA",
            "price": 880,
            "unit": "unidad"
        },
        {
            "id": "jacques-world-famous-chocolate-chip-cookies",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Tomato Ketchup KURTZ (680g).webp",
            "name": "Tomato Ketchup KURTZ (680g)",
            "dsc": "Tomato Ketchup KURTZ (680g)",
            "price": 1000,
            "unit": "unidad"
        },
        {
            "id": "super",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Mojo Marinado BADIA.webp",
            "name": "Mojo Marinado BADIA (295mL) ",
            "dsc": "Mojo Marinado BADIA (295mL)",
            "price": 850,
            "unit": "unidad"
        },
        {
            "id": "steaks-and-cakes-date-night-dinner-for-2",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Mostaza Kurtz.jpg",
            "name": "Mostaza Kurtz",
            "dsc": "Mostaza Kurtz",
            "price": 820,
            "unit": "unidad"
        },
        {
            "id": "Prime-holiday-steak-sampler-for-10-12",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Jugo Naranja Agria BADIA.webp",
            "name": "Jugo Naranja Agria BADIA",
            "dsc": "Jugo Naranja Agria BADIA",
            "price": 980,
            "unit": "unidad"
        },
        {
            "id": "or-gano-entero-en-hojas",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Orégano Entero En Hojas.jpg",
            "name": "Orégano Entero En Hojas",
            "dsc": "Orégano Entero En Hojas",
            "price": 850,
            "unit": "unidad"
        },
        {
            "id": "pan-rallado-con-saz-n-completa-15oz",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Badia Pan Rallado con Sazón Completa 15oz.webp",
            "name": "Pan Rallado con Sazón Completa 15oz",
            "dsc": "Pan Rallado con Sazón Completa 15oz",
            "price": 1550,
            "unit": "unidad"
        },
        {
            "id": "pasta-tomate-zer",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Pasta tomate zer.webp",
            "name": "Pasta tomate zer",
            "dsc": "Pasta tomate zer",
            "price": 460,
            "unit": "unidad"
        },
        {
            "id": "pasta-de-ajo",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Pasta de Ajo.webp",
            "name": "Pasta de Ajo",
            "dsc": "Pasta de Ajo",
            "price": 280,
            "unit": "unidad"
        },
        {
            "id": "salsa-picante-chili-badia-150ml-",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Salsa picante Chili BADIA (150mL).webp",
            "name": "Salsa picante Chili BADIA (150mL)",
            "dsc": "Salsa picante Chili BADIA (150mL)",
            "price": 1000,
            "unit": "unidad"
        },
        {
            "id": "saz-n-con-cilantro-y-achiote",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Sazón con cilantro y achiote.webp",
            "name": "Sazón con cilantro y achiote",
            "dsc": "Sazón con cilantro y achiote",
            "price": 60,
            "unit": "unidad"
        },
        {
            "id": "saz-n-completo-badia-3-5-oz",
            "img": "./img/cardapio/Salsas, condimentos y sazones/Sazón Completo BADIA 9 Oz.jpg",
            "name": "Sazón Completo BADIA 3.5 Oz",
            "dsc": "Sazón Completo BADIA 3.5 Oz",
            "price": 850,
            "unit": "unidad"
        }
    ],
    "Granos y Pastas": [
        {
            "id": "best-seller-cupcake-dozen",
            "img": "./img/cardapio/Granos y Pastas/Lentejas Del Campo (500g).webp",
            "name": "Lentejas Del Campo (500g)",
            "dsc": "Lentejas Del Campo (500g)",
            "price": 750,
            "unit": "unidad"
        },
        {
            "id": "choose-your-own-ice-cream-donuts-6-pack",
            "img": "./img/cardapio/Granos y Pastas/Frijoles Colorados.jpg",
            "name": "Frijoles Colorados",
            "dsc": "Frijoles Colorados",
            "price": 375,
            "unit": "lb"
        },
        {
            "id": "005-kings-carolina-oink-sampler",
            "img": "./img/cardapio/Granos y Pastas/Frijol Negro Rainha.webp",
            "name": "Frijol Negro 1Kg Paquete",
            "dsc": "Frijol Negro Rainha",
            "price": 750,
            "unit": "unidad"
        },
        {
            "id": "garbanzos-del-campo-500g",
            "img": "./img/cardapio/Granos y Pastas/Garbanzos del campo 500g.webp",
            "name": "Garbanzos del campo 500g",
            "dsc": "Garbanzos del campo 500g",
            "price": 700,
            "unit": "unidad"
        },
        {
            "id": "1",
            "img": "./img/cardapio/Granos y Pastas/Chícharos verdes Del campo.webp",
            "name": "Chícharos verdes Del campo (500g)",
            "dsc": "Chícharos verdes Del campo (500g)",
            "price": 650,
            "unit": "unidad"
        },
        {
            "id": "shake-shack-shackburger-16-pack",
            "img": "./img/cardapio/Granos y Pastas/Arroz Guayanés.jpg",
            "name": "Arroz Guayanés por libra",
            "dsc": "Arroz Guayanés por libra",
            "price": 290,
            "unit": "lb"
        },
        {
            "id": "shake-shack-shackburger-16-packkk",
            "img": "./img/cardapio/Granos y Pastas/Paquete de Arroz (1kg).jpg",
            "name": "Paquete de Arroz (1kg)",
            "dsc": "Paquete de Arroz (1kg)",
            "price": 620,
            "unit": "kg"
        },
        {
            "id": "brooklyn-blackout-cookie-brownie-combo-pack-2-tins",
            "img": "./img/cardapio/Granos y Pastas/Paquete de espaguetis.webp",
            "name": "Paquete de espaguetis",
            "dsc": "Paquete de espaguetis",
            "price": 300,
            "unit": "unidad"
        },
        {
            "id": "15259-german-chocolate-killer-brownie-tin-pack",
            "img": "./img/cardapio/Granos y Pastas/Coditos Doga 500g.jpg",
            "name": "Coditos Doga 500g",
            "dsc": "Coditos Doga 500g",
            "price": 300,
            "unit": "unidad"
        }
    ]
}
