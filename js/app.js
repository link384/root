$(document).ready(function () {
    cardapio.eventos.init();
})

var cardapio = {
    primeraCategoria: null // Se inicializa en renderizarCategorias
};

var MEU_CARRINHO = [];

// Tipo de entrega seleccionado: 'domicilio' | 'local' | null. Por defecto ninguno.
var TIPO_ENTREGA = null;

// Número de orden actual (se genera al pasar al resumen del pedido)
var NUMERO_ORDEN = null;

// Municipio seleccionado para la entrega a domicilio
var MUNICIPIO_SELECCIONADO = null;

// Código de país seleccionado para el teléfono (por defecto Cuba)
var PAIS_TELEFONO_ACTUAL = '+53';

// Listado de países con validación de teléfono (nombre, código, longitud mínima/máxima de dígitos)
var PAISES_TELEFONO = [
    { code: '+53',  name: 'Cuba',              min: 8,  max: 8  },
    { code: '+1',   name: 'EE.UU. / Canadá',   min: 10, max: 10 },
    { code: '+34',  name: 'España',            min: 9,  max: 9  },
    { code: '+52',  name: 'México',            min: 10, max: 10 },
    { code: '+58',  name: 'Venezuela',         min: 10, max: 10 },
    { code: '+57',  name: 'Colombia',          min: 10, max: 10 },
    { code: '+54',  name: 'Argentina',         min: 10, max: 11 },
    { code: '+56',  name: 'Chile',             min: 9,  max: 9  },
    { code: '+55',  name: 'Brasil',            min: 10, max: 11 },
    { code: '+593', name: 'Ecuador',           min: 9,  max: 9  },
    { code: '+51',  name: 'Perú',              min: 9,  max: 9  },
    { code: '+591', name: 'Bolivia',           min: 8,  max: 8  },
    { code: '+598', name: 'Uruguay',           min: 8,  max: 9  },
    { code: '+595', name: 'Paraguay',          min: 9,  max: 9  },
    { code: '+502', name: 'Guatemala',         min: 8,  max: 8  },
    { code: '+503', name: 'El Salvador',       min: 8,  max: 8  },
    { code: '+504', name: 'Honduras',          min: 8,  max: 8  },
    { code: '+505', name: 'Nicaragua',         min: 8,  max: 8  },
    { code: '+506', name: 'Costa Rica',        min: 8,  max: 8  },
    { code: '+507', name: 'Panamá',            min: 7,  max: 8  },
    { code: '+39',  name: 'Italia',            min: 9,  max: 11 },
    { code: '+49',  name: 'Alemania',          min: 10, max: 12 },
    { code: '+33',  name: 'Francia',           min: 9,  max: 9  },
    { code: '+44',  name: 'Reino Unido',       min: 10, max: 10 },
    { code: '+351', name: 'Portugal',          min: 9,  max: 9  },
    { code: '+7',   name: 'Rusia',             min: 10, max: 10 }
];

// Las variables MUNICIPIOS_HABANA, MEU_ENDERECO, CELULAR_EMPRESA y CATEGORIAS
// ahora se cargan desde app-data.js para compartirlas con el panel de control

var VALOR_CARRINHO = 0;
var VALOR_ENTREGA = 0;

cardapio.eventos = {

    init: () => {
        // Generar las categorías dinámicamente desde CATEGORIAS
        cardapio.metodos.renderizarCategorias();
        cardapio.metodos.atualizarContadoresCategorias();
        cardapio.metodos.obterItensCardapio();
        cardapio.metodos.carregarBotaoLigar();
        cardapio.metodos.carregarBotaoReserva();

        // poblar el selector de código de país (teléfono)
        cardapio.metodos.renderCodigosPais();

        // cerrar lightbox con la tecla ESC
        $(document).on('keydown', (ev) => {
            if (ev.key === 'Escape' || ev.keyCode === 27) {
                if (!$("#lightboxProducto").hasClass('hidden')) {
                    cardapio.metodos.cerrarLightbox(null, true);
                }
            }
        });

        // activar imagen con teclado (Enter/Espacio) cuando tiene foco
        $(document).on('keydown', '.img-produto', function (ev) {
            if (ev.key === 'Enter' || ev.key === ' ' || ev.keyCode === 13 || ev.keyCode === 32) {
                ev.preventDefault();
                $(this).trigger('click');
            }
        });
    }

}

cardapio.metodos = {

    // Genera dinámicamente las tarjetas de categorías desde la variable CATEGORIAS
    renderizarCategorias: () => {
        let $container = $("#categoriasGrid");
        if ($container.length === 0) return;
        
        $container.html(''); // Limpiar contenedor
        
        // La primera categoría con productos será la activa por defecto
        let primeraCategoria = Object.keys(CATEGORIAS)[0] || 'burgers';
        
        $.each(CATEGORIAS, (key, info) => {
            let activeClass = (key === primeraCategoria) ? 'active' : '';
            // Usar data-category para manejar claves con espacios
            let html = `
                <a id="menu-${key.replace(/\s+/g, '-')}" class="categoria-card ${activeClass}" data-category="${key}" onclick="cardapio.metodos.obterItensCardapio('${key}')">
                    <div class="categoria-icon-wrap">
                        <i class="${info.icone}"></i>
                    </div>
                    <span class="categoria-nombre">${info.nome}</span>
                    <span class="categoria-count">0</span>
                </a>
            `;
            $container.append(html);
        });
        
        // Guardar la primera categoría para usarla como default
        cardapio.primeraCategoria = primeraCategoria;
    },

    // actualizar el contador (badge) de cada categoría en el menú
    atualizarContadoresCategorias: () => {
        $.each(CATEGORIAS, (key, info) => {
            let total = (MENU[key] || []).length;
            // Usar selector de atributo data-category para manejar claves con espacios
            let $badge = $(".categoria-card[data-category='" + key + "'] .categoria-count");
            if ($badge.length > 0) {
                $badge.text(total);
            }
        });
    },

    // obtener la lista de elementos del menú
    obterItensCardapio: (categoria, vermais = false) => {
        // Si no se especifica categoría, usar la primera disponible
        if (!categoria) {
            categoria = cardapio.primeraCategoria || Object.keys(CATEGORIAS)[0] || 'burgers';
        }

        // si el usuario pulsa una categoría, salir del modo búsqueda
        if (!vermais) {
            $("#txtBuscarProduto").val('');
            $("#btnLimparBusca").addClass('hidden');
            $(".categorias-grid").removeClass('modo-busqueda');
        }

        var filtro = MENU[categoria] || [];
        var infoCat = CATEGORIAS[categoria] || { nome: '', icone: '' };

        if (!vermais) {
            $("#itensCardapio").html('');
            $("#btnVerMais").removeClass('hidden');
            // si la categoría tiene pocos items, ocultar "Ver más"
            if (filtro.length <= 47) {
                $("#btnVerMais").addClass('hidden');
            }
        }

        $.each(filtro, (i, e) => {

            // obtener cantidad actual en el carrito (si existe)
            let emCarrinho = MEU_CARRINHO.find(obj => obj.id == e.id);
            let qntdCarrinho = emCarrinho ? emCarrinho.qntd : 0;

            // Determinar si el producto soporta peso (lb/kg)
            let unit = e.unit || 'unidad';
            let supportsWeight = (unit === 'lb' || unit === 'kg' || unit === 'peso');
            
            // Generar etiqueta de unidad y selector si aplica
            let unitLabel = '';
            let unitSelector = '';
            
            if (supportsWeight) {
                unitLabel = ' <span class="unit-label" id="unit-label-' + e.id + '">/lb</span>';
                unitSelector = `
                    <div class="unit-selector" aria-label="Seleccionar unidad de peso">
                        <button type="button" class="unit-btn active" id="btn-lb-${e.id}" onclick="cardapio.metodos.cambiarUnidad('${e.id}', 'lb', ${e.price})">lb</button>
                        <button type="button" class="unit-btn" id="btn-kg-${e.id}" onclick="cardapio.metodos.cambiarUnidad('${e.id}', 'kg', ${e.price})">kg</button>
                    </div>
                `;
            }

            // Generar selector de opciones si el producto tiene opciones
            let hasOptions = e.options && e.options.length > 0;
            let optionsSelector = hasOptions ? cardapio.metodos.generarSelectorOpciones(e.id, e.options) : '';
            let hasRequiredOptions = hasOptions && e.options.some(opt => opt.required);
            let btnDisabledClass = hasRequiredOptions ? 'btn-disabled' : '';
            let btnDisabledAttr = hasRequiredOptions ? 'disabled' : '';

            let temp = cardapio.templates.item
                .replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${categoriaNome}/g, infoCat.nome)
                .replace(/\${categoriaIcone}/g, infoCat.icone)
                .replace(/\${inCartClass}/g, qntdCarrinho > 0 ? 'in-cart' : '')
                .replace(/\${inCartBadge}/g, qntdCarrinho > 0
                    ? `<span class="badge-in-cart" title="En el carrito"><i class="fa fa-check"></i> ${qntdCarrinho}</span>`
                    : '')
                .replace(/\${unitLabel}/g, unitLabel)
                .replace(/\${unitSelector}/g, unitSelector)
                .replace(/\${hasOptions}/g, hasOptions ? 'true' : 'false')
                .replace(/\${optionsSelector}/g, optionsSelector)
                .replace(/\${btnDisabledClass}/g, btnDisabledClass)
                .replace(/\${btnDisabledAttr}/g, btnDisabledAttr);

            // botão ver mais foi clicado (12 itens)
            if (vermais && i >= 47 && i < 60) {
                $("#itensCardapio").append(temp)
            }

            // paginação inicial (8 itens)
            if (!vermais && i < 47) {
                $("#itensCardapio").append(temp)
            }

        })

        // si no hay productos, mostrar estado vacío
        if (filtro.length === 0) {
            $("#itensCardapio").html(`
                <div class="col-12 text-center empty-category">
                    <i class="fas fa-box-open"></i>
                    <p>Próximamente agregaremos productos a esta categoría.</p>
                </div>
            `);
            $("#btnVerMais").addClass('hidden');
        }

        // quitar el estado activo
        $(".categorias-grid .categoria-card").removeClass('active');

        // marcar el menú actual como activo
        $(".categoria-card[data-category='" + categoria + "']").addClass('active');

        // scroll suave en móvil para centrar la categoría activa
        cardapio.metodos.centrarCategoriaActiva(categoria);

    },

    // asegura que la categoría activa sea visible en móvil (scroll horizontal)
    centrarCategoriaActiva: (categoria) => {
        let $container = $(".categorias-grid");
        let $activo = $(".categoria-card[data-category='" + categoria + "']");
        if ($activo.length > 0 && $container.length > 0) {
            let containerWidth = $container.width();
            let activoLeft = $activo.position().left;
            let activoWidth = $activo.outerWidth();
            let scrollTarget = $container.scrollLeft() + activoLeft - (containerWidth / 2) + (activoWidth / 2);
            $container.animate({ scrollLeft: scrollTarget }, 300);
        }
    },

    // clique no botão de ver mais
    verMais: () => {

        let $ativo = $(".categorias-grid .categoria-card.active");
        if ($ativo.length === 0) return;
        var categoria = $ativo.data('category');
        cardapio.metodos.obterItensCardapio(categoria, true);

        $("#btnVerMais").addClass('hidden');

    },

    // ============================================================
    //  BÚSQUEDA EN TIEMPO REAL (filtra todos los productos)
    // ============================================================

    // normaliza el texto: minúsculas + sin acentos, para búsqueda tolerante
    normalizarTexto: (texto) => {
        if (texto == null) return '';
        return String(texto)
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    },

    // encuentra la categoría a la que pertenece un producto
    buscarCategoriaDoProduto: (id) => {
        for (var key in MENU) {
            if (MENU.hasOwnProperty(key)) {
                if ((MENU[key] || []).some(p => p.id == id)) return key;
            }
        }
        return cardapio.primeraCategoria || Object.keys(CATEGORIAS)[0] || 'burgers';
    },

    // ejecuta la búsqueda en tiempo real
    buscarProdutos: (termo) => {

        let query = cardapio.metodos.normalizarTexto(termo);

        // si no hay texto, salir del modo búsqueda y restaurar categoría activa
        if (query.length === 0) {
            $("#btnLimparBusca").addClass('hidden');
            cardapio.metodos.salirModoBusqueda();
            return;
        }

        $("#btnLimparBusca").removeClass('hidden');

        // recolectar coincidencias en todas las categorías
        let resultados = [];
        $.each(MENU, (cat, items) => {
            $.each(items || [], (i, e) => {
                let nomeNorm = cardapio.metodos.normalizarTexto(e.name);
                let dscNorm = cardapio.metodos.normalizarTexto(e.dsc);
                if (nomeNorm.indexOf(query) !== -1 || dscNorm.indexOf(query) !== -1) {
                    resultados.push({ item: e, categoria: cat });
                }
            });
        });

        // entrar en modo búsqueda
        $(".categorias-grid").addClass('modo-busqueda');
        $(".categorias-grid .categoria-card").removeClass('active');
        $("#btnVerMais").addClass('hidden');

        // renderizar resultados
        $("#itensCardapio").html('');

        if (resultados.length === 0) {
            $("#itensCardapio").html(`
                <div class="col-12 text-center empty-category">
                    <i class="fas fa-search"></i>
                    <p>Sin resultados para <b>"${$('<div/>').text(termo).html()}"</b>.</p>
                    <p class="text-sm">Prueba con otro nombre de producto.</p>
                </div>
            `);
            return;
        }

        $.each(resultados, (i, r) => {

            let e = r.item;
            let infoCat = CATEGORIAS[r.categoria] || { nome: '', icone: '' };

            let emCarrinho = MEU_CARRINHO.find(obj => obj.id == e.id);
            let qntdCarrinho = emCarrinho ? emCarrinho.qntd : 0;

            // Determinar si el producto soporta peso (lb/kg)
            let unit = e.unit || 'unidad';
            let supportsWeight = (unit === 'lb' || unit === 'kg' || unit === 'peso');
            
            // Generar etiqueta de unidad y selector si aplica
            let unitLabel = '';
            let unitSelector = '';
            
            if (supportsWeight) {
                unitLabel = ' <span class="unit-label" id="unit-label-' + e.id + '">/lb</span>';
                unitSelector = `
                    <div class="unit-selector" aria-label="Seleccionar unidad de peso">
                        <button type="button" class="unit-btn active" id="btn-lb-${e.id}" onclick="cardapio.metodos.cambiarUnidad('${e.id}', 'lb', ${e.price})">lb</button>
                        <button type="button" class="unit-btn" id="btn-kg-${e.id}" onclick="cardapio.metodos.cambiarUnidad('${e.id}', 'kg', ${e.price})">kg</button>
                    </div>
                `;
            }

            // Generar selector de opciones si el producto tiene opciones
            let hasOptions = e.options && e.options.length > 0;
            let optionsSelector = hasOptions ? cardapio.metodos.generarSelectorOpciones(e.id, e.options) : '';
            let hasRequiredOptions = hasOptions && e.options.some(opt => opt.required);
            let btnDisabledClass = hasRequiredOptions ? 'btn-disabled' : '';
            let btnDisabledAttr = hasRequiredOptions ? 'disabled' : '';

            let temp = cardapio.templates.item
                .replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${categoriaNome}/g, infoCat.nome)
                .replace(/\${categoriaIcone}/g, infoCat.icone)
                .replace(/\${inCartClass}/g, qntdCarrinho > 0 ? 'in-cart' : '')
                .replace(/\${inCartBadge}/g, qntdCarrinho > 0
                    ? `<span class="badge-in-cart" title="En el carrito"><i class="fa fa-check"></i> ${qntdCarrinho}</span>`
                    : '')
                .replace(/\${unitLabel}/g, unitLabel)
                .replace(/\${unitSelector}/g, unitSelector)
                .replace(/\${hasOptions}/g, hasOptions ? 'true' : 'false')
                .replace(/\${optionsSelector}/g, optionsSelector)
                .replace(/\${btnDisabledClass}/g, btnDisabledClass)
                .replace(/\${btnDisabledAttr}/g, btnDisabledAttr);

            $("#itensCardapio").append(temp);
        });
    },

    // limpiar el input de búsqueda y volver a la vista de categorías
    limparBusca: () => {
        $("#txtBuscarProduto").val('').focus();
        $("#btnLimparBusca").addClass('hidden');
        cardapio.metodos.salirModoBusqueda();
    },

    // restaura la vista normal: categoría activa (o la primera por defecto)
    salirModoBusqueda: () => {
        $(".categorias-grid").removeClass('modo-busqueda');
        let $activo = $(".categorias-grid .categoria-card.active");
        let primeraCategoria = cardapio.primeraCategoria || Object.keys(CATEGORIAS)[0] || 'burgers';
        let categoria = $activo.length > 0 ? $activo.data('category') : primeraCategoria;
        cardapio.metodos.obterItensCardapio(categoria);
    },

    // ============================================================
    //  LIGHTBOX para ampliar imagen del producto
    // ============================================================

    abrirLightbox: (src, alt) => {
        $("#lightboxImg").attr('src', src).attr('alt', alt || '');
        $("#lightboxCaption").text(alt || '');
        $("#lightboxProducto").removeClass('hidden').removeClass('zoomed');
        $("#btnLightboxZoom").find('i').attr('class', 'fas fa-search-plus');
        $("body").addClass('no-scroll');
    },

    cerrarLightbox: (event, force) => {
        // si no es forzado y el clic NO fue directamente sobre el overlay, ignorar
        if (event && !force) {
            if (event.target !== event.currentTarget) return;
        }
        if (event) {
            event.stopPropagation();
        }
        $("#lightboxProducto").addClass('hidden').removeClass('zoomed');
        $("#lightboxImg").attr('src', '');
        $("body").removeClass('no-scroll');
    },

    alternarZoomLightbox: () => {
        let $lb = $("#lightboxProducto");
        let $icon = $("#btnLightboxZoom").find('i');
        $lb.toggleClass('zoomed');
        if ($lb.hasClass('zoomed')) {
            $icon.attr('class', 'fas fa-search-minus');
        } else {
            $icon.attr('class', 'fas fa-search-plus');
        }
    },

    // diminuir a quantidade do item no cardapio
    diminuirQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());

        if (qntdAtual > 1) {
            $("#qntd-" + id).text(qntdAtual - 1)
        }

    },

    // aumentar a quantidade do item no cardapio
    aumentarQuantidade: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text());
        if (qntdAtual < 99) {
            $("#qntd-" + id).text(qntdAtual + 1)
        }

    },

    // Genera el HTML de los selectores de opciones para un producto
    generarSelectorOpciones: (id, options) => {
        if (!options || options.length === 0) return '';
        
        let html = '<div class="product-options-container">';
        
        options.forEach((opt, optIndex) => {
            let requiredLabel = opt.required ? '<span class="option-required">*</span>' : '';
            html += `
                <div class="product-option-group" data-option-index="${optIndex}" data-option-name="${opt.name}" data-required="${opt.required ? 'true' : 'false'}">
                    <label class="option-label">${opt.name}${requiredLabel}</label>
                    <div class="option-choices" id="option-choices-${id}-${optIndex}">
            `;
            
            opt.choices.forEach((choice, choiceIndex) => {
                let choiceId = `${id}-opt${optIndex}-choice${choiceIndex}`;
                // Las opciones pueden ser strings o objetos {name, price}
                let choiceName = typeof choice === 'object' ? choice.name : choice;
                let choicePrice = typeof choice === 'object' ? (choice.price || 0) : 0;
                let priceLabel = choicePrice > 0 ? ` (+$${choicePrice})` : '';
                
                html += `
                    <button type="button" 
                            class="option-chip" 
                            id="${choiceId}"
                            data-product-id="${id}"
                            data-option-index="${optIndex}"
                            data-choice="${choiceName}"
                            data-choice-price="${choicePrice}"
                            onclick="cardapio.metodos.seleccionarOpcion('${id}', ${optIndex}, '${choiceName}', ${choicePrice}, this)">
                        ${choiceName}${priceLabel}
                    </button>
                `;
            });
            
            html += `
                    </div>
                </div>
            `;
        });
        
        html += '</div>';
        return html;
    },

    // Selecciona una opción para un producto
    seleccionarOpcion: (productId, optionIndex, choice, choicePrice, btnElement) => {
        let escapedId = cardapio.metodos.escaparId(productId);
        let $card = $("#" + escapedId);
        
        // Quitar selección previa de este grupo de opciones
        $card.find(`.option-chip[data-option-index="${optionIndex}"]`).removeClass('selected');
        
        // Marcar la nueva selección
        $(btnElement).addClass('selected');
        
        // Guardar la selección en el data del card (incluyendo el precio adicional)
        let selections = $card.data('selectedOptions') || {};
        let optionName = $(btnElement).closest('.product-option-group').data('option-name');
        selections[optionIndex] = { name: optionName, choice: choice, price: choicePrice || 0 };
        $card.data('selectedOptions', selections);
        
        // Verificar si todas las opciones requeridas están seleccionadas
        cardapio.metodos.verificarOpcionesCompletas(productId);
    },

    // Verifica si todas las opciones requeridas están seleccionadas
    verificarOpcionesCompletas: (productId) => {
        let escapedId = cardapio.metodos.escaparId(productId);
        let $card = $("#" + escapedId);
        let $btn = $card.find('.btn-add');
        
        // Si el producto no tiene opciones, el botón siempre está habilitado
        // Usar attr() en lugar de data() para leer el atributo HTML correctamente
        let hasOptions = $card.attr('data-has-options');
        if (hasOptions !== 'true') {
            return true;
        }
        
        let selections = $card.data('selectedOptions') || {};
        let allComplete = true;
        
        // Verificar cada grupo de opciones requeridas
        $card.find('.product-option-group[data-required="true"]').each(function() {
            let optIndex = $(this).data('option-index');
            if (selections[optIndex] === undefined) {
                allComplete = false;
            }
        });
        
        if (allComplete) {
            $btn.removeClass('btn-disabled').prop('disabled', false);
        } else {
            $btn.addClass('btn-disabled').prop('disabled', true);
        }
        
        return allComplete;
    },

    // cambiar unidad de peso (lb/kg) para un producto
    cambiarUnidad: (id, unit, precioBase) => {
        let escapedId = cardapio.metodos.escaparId(id);
        
        // Calcular el precio según la unidad
        let precio;
        if (unit === 'kg') {
            // Convertir precio de lb a kg (1 kg = 2.20462 lb)
            precio = precioBase * CONVERSION_LB_KG;
        } else {
            precio = precioBase;
        }
        
        // Actualizar el precio mostrado
        let $priceEl = $("#price-" + escapedId);
        $priceEl.find('b').text('MN$ ' + precio.toFixed(2).replace('.', ','));
        
        // Actualizar la etiqueta de unidad
        let $unitLabel = $("#unit-label-" + escapedId);
        $unitLabel.text('/' + unit);
        
        // Actualizar estado de los botones
        $("#btn-lb-" + escapedId).removeClass('active');
        $("#btn-kg-" + escapedId).removeClass('active');
        $("#btn-" + unit + "-" + escapedId).addClass('active');
        
        // Guardar la unidad seleccionada en el elemento para usarla al agregar al carrito
        let $card = $("#" + escapedId);
        $card.attr('data-selected-unit', unit);
        $card.attr('data-selected-price', precio);
    },

    // adicionar ao carrinho o item do cardápio
    adicionarAoCarrinho: (id) => {

        let qntdAtual = parseInt($("#qntd-" + id).text()) || 1;
        let escapedId = cardapio.metodos.escaparId(id);

        // obter a categoria ativa (o la del producto si estamos en modo búsqueda)
        let $ativo = $(".container-menu a.active");
        var categoria = $ativo.length > 0
            ? $ativo.attr('id').split('menu-')[1]
            : cardapio.metodos.buscarCategoriaDoProduto(id);

        // obtem a lista de itens
        let filtro = MENU[categoria] || [];

        // obtem o item
        let item = $.grep(filtro, (e, i) => { return e.id == id });

        if (item.length > 0) {

            // Obtener unidad y precio seleccionados (si aplica)
            let $card = $("#" + escapedId);
            let selectedUnit = $card.attr('data-selected-unit') || item[0].unit || 'unidad';
            let selectedPrice = parseFloat($card.attr('data-selected-price')) || item[0].price;

            // Obtener opciones seleccionadas
            let selectedOptions = $card.data('selectedOptions') || {};
            let hasOptions = item[0].options && item[0].options.length > 0;
            
            // Verificar que todas las opciones requeridas están seleccionadas
            if (hasOptions) {
                let allComplete = cardapio.metodos.verificarOpcionesCompletas(id);
                if (!allComplete) {
                    cardapio.metodos.mensagem('Por favor, selecciona todas las opciones requeridas.', 'red');
                    return;
                }
            }
            
            // Calcular precio adicional por opciones seleccionadas
            let optionsExtraPrice = 0;
            if (hasOptions && Object.keys(selectedOptions).length > 0) {
                Object.values(selectedOptions).forEach(opt => {
                    optionsExtraPrice += (opt.price || 0);
                });
            }
            let finalPrice = selectedPrice + optionsExtraPrice;

            // Crear un ID único que incluya la unidad y las opciones
            let cartItemId = id;
            let supportsWeight = (item[0].unit === 'lb' || item[0].unit === 'kg' || item[0].unit === 'peso');
            if (supportsWeight) {
                cartItemId = id + '-' + selectedUnit;
            }
            
            // Agregar opciones al ID del carrito para diferenciar variantes
            if (hasOptions && Object.keys(selectedOptions).length > 0) {
                let optionsSuffix = Object.values(selectedOptions).map(o => o.choice).join('-');
                cartItemId = cartItemId + '-' + optionsSuffix;
            }

            // validar si ya existe ese item en el carrito (con la misma unidad y opciones)
            let existe = $.grep(MEU_CARRINHO, (elem, index) => { return elem.cartId == cartItemId });

            let novaQntd;

            if (existe.length > 0) {
                let objIndex = MEU_CARRINHO.findIndex((obj => obj.cartId == cartItemId));
                MEU_CARRINHO[objIndex].qntd = MEU_CARRINHO[objIndex].qntd + qntdAtual;
                novaQntd = MEU_CARRINHO[objIndex].qntd;
            }
            else {
                // clonar para no contaminar el MENU original
                let nuevoItem = Object.assign({}, item[0]);
                nuevoItem.qntd = qntdAtual;
                nuevoItem.cartId = cartItemId;
                nuevoItem.selectedUnit = selectedUnit;
                nuevoItem.price = finalPrice; // Precio base + extras de opciones
                nuevoItem.optionsExtraPrice = optionsExtraPrice; // Guardar el extra para referencia
                
                // Guardar las opciones seleccionadas
                if (hasOptions && Object.keys(selectedOptions).length > 0) {
                    nuevoItem.selectedOptions = JSON.parse(JSON.stringify(selectedOptions));
                }
                
                MEU_CARRINHO.push(nuevoItem);
                novaQntd = qntdAtual;
            }

            // Mensaje con unidad y opciones si aplica
            let unitText = supportsWeight ? ` (${selectedUnit})` : '';
            let optionsText = '';
            if (hasOptions && Object.keys(selectedOptions).length > 0) {
                optionsText = ' - ' + Object.values(selectedOptions).map(o => `${o.name}: ${o.choice}`).join(', ');
            }
            cardapio.metodos.mensagem(`${qntdAtual} × ${item[0].name}${unitText}${optionsText} agregado`, 'green');

            // resetear selector a 1, limpiar opciones y actualizar estado visual de la tarjeta
            $("#qntd-" + escapedId).text(1);
            
            // Limpiar opciones seleccionadas para la próxima adición
            if (hasOptions) {
                $card.data('selectedOptions', {});
                $card.find('.option-chip').removeClass('selected');
                $card.find('.btn-add').addClass('btn-disabled').prop('disabled', true);
            }
            
            cardapio.metodos.marcarTarjetaEnCarrito(id, novaQntd);

            cardapio.metodos.atualizarBadgeTotal();

        }

    },

    // escapa un id para poder usarlo en selectores jQuery (compatible con jQuery 1.12)
    escaparId: (id) => {
        if (typeof CSS !== 'undefined' && typeof CSS.escape === 'function') {
            return CSS.escape(id);
        }
        // fallback: escapar caracteres especiales manualmente
        return String(id).replace(/([!"#$%&'()*+,./:;<=>?@[\\\]^`{|}~])/g, '\\$1');
    },

    // aplica el estado visual "en carrito" a la tarjeta del producto
    marcarTarjetaEnCarrito: (id, qntd) => {
        let $card = $("#" + cardapio.metodos.escaparId(id));
        if ($card.length === 0) return;

        $card.addClass('in-cart');

        // animación de "added"
        $card.removeClass('just-added');
        // force reflow para reiniciar la animación
        void $card[0].offsetWidth;
        $card.addClass('just-added');

        // Calcular cantidad total de todos los items con este id (puede haber lb y kg)
        let totalQntd = MEU_CARRINHO.filter(e => e.id == id).reduce((sum, e) => sum + e.qntd, 0);

        // actualizar/crear badge "en carrito"
        let $badge = $card.find('.badge-in-cart');
        if ($badge.length === 0) {
            $card.prepend(`<span class="badge-in-cart" title="En el carrito"><i class="fa fa-check"></i> ${totalQntd}</span>`);
        } else {
            $badge.html(`<i class="fa fa-check"></i> ${totalQntd}`);
        }
    },

    // atualiza o badge de totais dos botões "Meu carrinho"
    atualizarBadgeTotal: () => {

        var total = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            total += e.qntd
        })

        if (total > 0) {
            $(".botao-carrinho").removeClass('hidden');
            $(".container-total-carrinho").removeClass('hidden');
        }
        else {
            $(".botao-carrinho").addClass('hidden')
            $(".container-total-carrinho").addClass('hidden');
        }

        $(".badge-total-carrinho").html(total);

    },

    // abrir a modal de carrinho
    abrirCarrinho: (abrir) => {

        if (abrir) {
            $("#modalCarrinho").removeClass('hidden');
            cardapio.metodos.carregarCarrinho();
        }
        else {
            $("#modalCarrinho").addClass('hidden');
        }

    },

    // altera os texto e exibe os botões das etapas
    carregarEtapa: (etapa) => {

        if (etapa == 1) {
            $("#lblTituloEtapa").text('Tu carrito:');
            $("#itensCarrinho").removeClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").addClass('hidden');
            // "accionesCarrinho" se controla en carregarCarrinho según haya items o no

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');

            $("#btnEtapaPedido").removeClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").addClass('hidden');

            // mostrar Subtotal / Total en el carrito
            $(".m-footer .container-total").removeClass('hidden');
        }
        
        if (etapa == 2) {
            $("#lblTituloEtapa").text('Dirección de entrega:');
            $("#itensCarrinho").addClass('hidden');
            $("#accionesCarrinho").addClass('hidden');
            $("#localEntrega").removeClass('hidden');
            $("#resumoCarrinho").addClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").removeClass('hidden');
            $("#btnEtapaResumo").addClass('hidden');
            $("#btnVoltar").removeClass('hidden');

            // en esta etapa NO se muestran Subtotal ni Total
            $(".m-footer .container-total").addClass('hidden');
        }

        if (etapa == 3) {
            $("#lblTituloEtapa").text('Resumen del pedido:');
            $("#itensCarrinho").addClass('hidden');
            $("#accionesCarrinho").addClass('hidden');
            $("#localEntrega").addClass('hidden');
            $("#resumoCarrinho").removeClass('hidden');

            $(".etapa").removeClass('active');
            $(".etapa1").addClass('active');
            $(".etapa2").addClass('active');
            $(".etapa3").addClass('active');

            $("#btnEtapaPedido").addClass('hidden');
            $("#btnEtapaEndereco").addClass('hidden');
            $("#btnEtapaResumo").removeClass('hidden');
            $("#btnVoltar").removeClass('hidden');

            // los totales ya se muestran dentro del resumen, ocultamos la barra inferior
            $(".m-footer .container-total").addClass('hidden');
        }

    },

    // botão de voltar etapa
    voltarEtapa: () => {

        let etapa = $(".etapa.active").length;
        cardapio.metodos.carregarEtapa(etapa - 1);

    },

    // carrega a lista de itens do carrinho
    carregarCarrinho: () => {

        cardapio.metodos.carregarEtapa(1);

        if (MEU_CARRINHO.length > 0) {

            $("#itensCarrinho").html('');
            // mostrar botón "Vaciar carrito"
            $("#accionesCarrinho").removeClass('hidden');

            $.each(MEU_CARRINHO, (i, e) => {

                // Mostrar unidad si es un producto con peso
                let unitBadge = '';
                let unitLabelCart = '';
                if (e.selectedUnit && e.selectedUnit !== 'unidad') {
                    unitBadge = ` <span class="unit-badge-cart">(${e.selectedUnit})</span>`;
                    unitLabelCart = `<span class="unit-label-cart">/${e.selectedUnit}</span>`;
                }

                // Mostrar opciones seleccionadas (con precio extra si aplica)
                let optionsBadgeCart = '';
                if (e.selectedOptions && Object.keys(e.selectedOptions).length > 0) {
                    let optionsText = Object.values(e.selectedOptions).map(o => {
                        let priceExtra = o.price > 0 ? ` (+$${o.price})` : '';
                        return `${o.name}: ${o.choice}${priceExtra}`;
                    }).join(' | ');
                    optionsBadgeCart = `<span class="options-badge-cart">${optionsText}</span>`;
                }

                let temp = cardapio.templates.itemCarrinho.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${id}/g, e.id)
                .replace(/\${cartId}/g, e.cartId || e.id)
                .replace(/\${qntd}/g, e.qntd)
                .replace(/\${unitBadge}/g, unitBadge)
                .replace(/\${unitLabelCart}/g, unitLabelCart)
                .replace(/\${optionsBadgeCart}/g, optionsBadgeCart)

                $("#itensCarrinho").append(temp);

                // último item
                if ((i + 1) == MEU_CARRINHO.length) {
                    cardapio.metodos.carregarValores();
                }

            })

        }
        else {
            $("#itensCarrinho").html('<p class="carrinho-vazio"><i class="fa fa-shopping-bag"></i> Tu carrito está vacío.</p>');
            // ocultar botón "Vaciar carrito" cuando no hay nada
            $("#accionesCarrinho").addClass('hidden');
            cardapio.metodos.carregarValores();
        }

    },

    // vaciar el carrito completo (pide confirmación al usuario)
    vaciarCarrinho: () => {

        if (MEU_CARRINHO.length === 0) {
            cardapio.metodos.mensagem('El carrito ya está vacío.');
            return;
        }

        if (!confirm('¿Estás seguro de que deseas vaciar el carrito? Se eliminarán todos los productos.')) {
            return;
        }

        // capturar ids originales (únicos) antes de limpiar para actualizar las tarjetas del cardápio
        let ids = [...new Set(MEU_CARRINHO.map(e => e.id))];
        MEU_CARRINHO = [];

        // resetear estado de entrega relacionado con costos
        VALOR_ENTREGA = 0;
        MUNICIPIO_SELECCIONADO = null;
        $("#lblMunicipioEntrega").text('');
        $(".municipio-chip").removeClass('selected');
        $(".municipio-chip input[type='radio']").prop('checked', false);

        // quitar badge "en carrito" de las tarjetas visibles
        ids.forEach((id) => cardapio.metodos.refrescarEstadoEnCarrito(id));

        // refrescar vista del carrito (mostrará estado vacío y valores en 0)
        cardapio.metodos.carregarCarrinho();
        cardapio.metodos.atualizarBadgeTotal();

        cardapio.metodos.mensagem('Carrito vaciado correctamente.', 'green');
    },

    // diminuir quantidade do item no carrinho
    diminuirQuantidadeCarrinho: (cartId) => {

        let escapedCartId = cardapio.metodos.escaparId(cartId);
        let qntdAtual = parseInt($("#qntd-carrinho-" + escapedCartId).text());

        if (qntdAtual > 1) {
            $("#qntd-carrinho-" + escapedCartId).text(qntdAtual - 1);
            cardapio.metodos.atualizarCarrinho(cartId, qntdAtual - 1);
        }
        else {
            cardapio.metodos.removerItemCarrinho(cartId)
        }

    },

    // aumentar quantidade do item no carrinho
    aumentarQuantidadeCarrinho: (cartId) => {

        let escapedCartId = cardapio.metodos.escaparId(cartId);
        let qntdAtual = parseInt($("#qntd-carrinho-" + escapedCartId).text());
        $("#qntd-carrinho-" + escapedCartId).text(qntdAtual + 1);
        cardapio.metodos.atualizarCarrinho(cartId, qntdAtual + 1);

    },

    // botão remover item do carrinho
    removerItemCarrinho: (cartId) => {

        // Obtener el id del producto original antes de remover
        let item = MEU_CARRINHO.find(e => (e.cartId || e.id) == cartId);
        let originalId = item ? item.id : cartId;

        MEU_CARRINHO = $.grep(MEU_CARRINHO, (e, i) => { return (e.cartId || e.id) != cartId });
        cardapio.metodos.carregarCarrinho();

        // refrescar tarjetas del cardápio para quitar badge "en carrito"
        cardapio.metodos.refrescarEstadoEnCarrito(originalId);

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();
        
    },

    // refresca el estado visual de la tarjeta del producto (quitar badge)
    refrescarEstadoEnCarrito: (id) => {
        let $card = $("#" + cardapio.metodos.escaparId(id));
        if ($card.length === 0) return;
        // Solo quitar si no quedan items con este id en el carrito
        let itemsRestantes = MEU_CARRINHO.filter(e => e.id == id);
        if (itemsRestantes.length === 0) {
            $card.removeClass('in-cart just-added');
            $card.find('.badge-in-cart').remove();
        } else {
            // Actualizar el contador con la suma de todos los items
            let totalQntd = itemsRestantes.reduce((sum, e) => sum + e.qntd, 0);
            let $badge = $card.find('.badge-in-cart');
            if ($badge.length > 0) {
                $badge.html(`<i class="fa fa-check"></i> ${totalQntd}`);
            }
        }
    },

    // atualiza o carrinho com a quantidade atual
    atualizarCarrinho: (cartId, qntd) => {

        let objIndex = MEU_CARRINHO.findIndex((obj => (obj.cartId || obj.id) == cartId));
        if (objIndex === -1) return;
        MEU_CARRINHO[objIndex].qntd = qntd;

        // atualiza o botão carrinho com a quantidade atualizada
        cardapio.metodos.atualizarBadgeTotal();

        // actualizar badge en la tarjeta del cardápio si visible
        let originalId = MEU_CARRINHO[objIndex].id;
        let $badge = $("#" + cardapio.metodos.escaparId(originalId)).find('.badge-in-cart');
        if ($badge.length > 0) {
            // Sumar cantidad de todos los items con el mismo id original
            let totalQntd = MEU_CARRINHO.filter(e => e.id == originalId).reduce((sum, e) => sum + e.qntd, 0);
            $badge.html(`<i class="fa fa-check"></i> ${totalQntd}`);
        }

        // atualiza os valores (R$) totais do carrinho
        cardapio.metodos.carregarValores();

    },

    // carrega os valores de SubTotal, Entrega e Total
    carregarValores: () => {

        VALOR_CARRINHO = 0;

        $.each(MEU_CARRINHO, (i, e) => {
            VALOR_CARRINHO += parseFloat(e.price * e.qntd);
        });

        // si el carrito está vacío, todo queda en 0 (Subtotal, Entrega y Total)
        let carritoVacio = MEU_CARRINHO.length === 0;

        // costo de entrega solo aplica si el carrito tiene items y se eligió "domicilio" CON municipio
        let costoEntrega = (!carritoVacio && TIPO_ENTREGA === 'domicilio' && MUNICIPIO_SELECCIONADO)
            ? VALOR_ENTREGA
            : 0;

        let subtotalMostrar = carritoVacio ? 0 : VALOR_CARRINHO;
        let totalMostrar = carritoVacio ? 0 : (VALOR_CARRINHO + costoEntrega);

        $("#lblSubTotal").text(`MN$ ${subtotalMostrar.toFixed(2).replace('.', ',')}`);
        $("#lblValorEntrega").text(`+ MN$ ${costoEntrega.toFixed(2).replace('.', ',')}`);
        $("#lblValorTotal").text(`MN$ ${totalMostrar.toFixed(2).replace('.', ',')}`);

        // mostrar la fila "Entrega" solo si el carrito tiene items y hay un costo a mostrar
        if (!carritoVacio && TIPO_ENTREGA === 'domicilio' && MUNICIPIO_SELECCIONADO) {
            $("#filaEntrega").removeClass('hidden');
        } else {
            $("#filaEntrega").addClass('hidden');
        }

    },

    // carregar a etapa enderecos
    carregarEndereco: () => {

        if (MEU_CARRINHO.length <= 0) {
            cardapio.metodos.mensagem('Tu carrito está vacío.')
            return;
        }

        cardapio.metodos.carregarEtapa(2);
        cardapio.metodos.renderMunicipios();

        // no preseleccionar ninguna opción por defecto
        if (TIPO_ENTREGA) {
            $(`input[name='tipoEntrega'][value='${TIPO_ENTREGA}']`).prop('checked', true);
            $(".tipo-entrega-card").removeClass('selected');
            $(`.tipo-entrega-card[data-tipo='${TIPO_ENTREGA}']`).addClass('selected');
            cardapio.metodos.refrescarVistaEntrega();
        } else {
            $("input[name='tipoEntrega']").prop('checked', false);
            $(".tipo-entrega-card").removeClass('selected');
            $("#resumenDireccionConfirmada").addClass('hidden');
        }

        // el botón "Revisar pedido" arranca deshabilitado hasta completar los datos
        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // ============================================================
    //  ENTREGA: domicilio / recoger en local
    // ============================================================

    // el usuario selecciona un tipo de entrega (domicilio | local)
    // SIEMPRE abre el modal para que el usuario vea/confirme los datos
    seleccionarTipoEntrega: (tipo) => {

        TIPO_ENTREGA = tipo;

        // actualizar highlight visual de las tarjetas del radio
        $(".tipo-entrega-card").removeClass('selected');
        $(`.tipo-entrega-card[data-tipo='${tipo}']`).addClass('selected');

        if (tipo === 'local') {
            // recogida en el local: gratis, sin municipio
            VALOR_ENTREGA = 0;
            MUNICIPIO_SELECCIONADO = null;
            $("#filaEntrega").addClass('hidden');
            $("#lblMunicipioEntrega").text('');
        } else if (tipo === 'domicilio') {
            // si ya había dirección previa válida, mantener costo
            if (MUNICIPIO_SELECCIONADO) {
                VALOR_ENTREGA = MUNICIPIO_SELECCIONADO.costo;
            } else {
                VALOR_ENTREGA = 0;
            }
            $("#filaEntrega").removeClass('hidden');
        }

        // abrir la ventana (modal) para mostrar todas las opciones del tipo seleccionado
        cardapio.metodos.abrirModalEntrega();

        cardapio.metodos.refrescarVistaEntrega();
        cardapio.metodos.carregarValores();
        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // Refresca el resumen visible debajo de las tarjetas de tipo de entrega
    refrescarVistaEntrega: () => {
        if (TIPO_ENTREGA === 'local') {
            cardapio.metodos.actualizarResumenEntregaLocal();
        } else if (TIPO_ENTREGA === 'domicilio') {
            cardapio.metodos.actualizarResumenDireccionConfirmada();
        }
    },

    // ============================================================
    //  MODAL UNIFICADO: Detalles de la entrega (domicilio / local)
    // ============================================================

    // Abre el modal y muestra el contenido según el tipo de entrega actual
    abrirModalEntrega: () => {

        let $icon = $("#iconModalEntrega");
        let $titulo = $("#modalDireccionTitulo");
        let $subtitulo = $("#modalDireccionSubtitulo");
        let $btnTxt = $("#lblBtnConfirmarEntrega");

        // ocultar ambos bloques antes de mostrar el correspondiente
        $("#modalContentDomicilio").addClass('hidden');
        $("#modalContentLocal").addClass('hidden');

        if (TIPO_ENTREGA === 'domicilio') {
            cardapio.metodos.renderMunicipios();

            $icon.attr('class', 'fas fa-motorcycle');
            $titulo.text('Dirección de entrega');
            $subtitulo.text('Completa los datos para entregarte el pedido a domicilio');
            $btnTxt.text('Confirmar pedido');

            $("#modalContentDomicilio").removeClass('hidden');
        } else {
            $icon.attr('class', 'fas fa-store');
            $titulo.text('Recoger en el local');
            $subtitulo.text('Revisa la información del punto de recogida');
            $btnTxt.text('Confirmar pedido');

            $("#modalContentLocal").removeClass('hidden');
        }

        $("#modalDireccion").removeClass('hidden');
        $("body").addClass('modal-abierto');

        // foco en el primer campo para mejor UX (solo domicilio)
        if (TIPO_ENTREGA === 'domicilio') {
            setTimeout(() => {
                $("#txtEndereco").trigger('focus');
            }, 80);
        }
    },

    // Alias para mantener compatibilidad
    abrirModalDireccion: () => cardapio.metodos.abrirModalEntrega(),

    // Cierra el modal
    cerrarModalEntrega: () => {
        $("#modalDireccion").addClass('hidden');
        $("body").removeClass('modal-abierto');
    },
    cerrarModalDireccion: () => cardapio.metodos.cerrarModalEntrega(),

    // Verifica (sin mostrar mensajes) que TODOS los datos requeridos estén completos
    // según el tipo de entrega seleccionado. Devuelve true/false.
    datosEntregaCompletos: () => {
        if (!TIPO_ENTREGA) return false;

        // datos de contacto (ambos tipos)
        let nombre = ($("#txtComplemento").val() || '').trim();
        if (nombre.length <= 0) return false;

        let tel = cardapio.metodos.validarTelefono();
        if (!tel.ok) return false;

        // método de pago (ambos tipos)
        let metodoChecked = $("input[name='metodoPago']:checked").val();
        if (!metodoChecked) return false;

        // domicilio: dirección y municipio (reparto/barrio es opcional)
        if (TIPO_ENTREGA === 'domicilio') {
            let endereco = ($("#txtEndereco").val() || '').trim();
            if (endereco.length <= 0) return false;
            if (!MUNICIPIO_SELECCIONADO) return false;
        }

        return true;
    },

    // Habilita / deshabilita el botón "Revisar pedido" según estén completos los datos.
    actualizarEstadoBotonRevisar: () => {
        let $btn = $("#btnEtapaEndereco");
        if ($btn.length === 0) return;
        if (cardapio.metodos.datosEntregaCompletos()) {
            $btn.removeClass('btn-disabled').attr('aria-disabled', 'false');
        } else {
            $btn.addClass('btn-disabled').attr('aria-disabled', 'true');
        }
    },

    // Valida datos de contacto y método de pago (sección compartida dentro del modal)
    validarDatosContactoModal: () => {

        let complemento = $("#txtComplemento").val().trim();
        if (complemento.length <= 0) {
            cardapio.metodos.mensagem('El campo "¿Cuál es tu nombre?" es obligatorio.');
            $("#txtComplemento").trigger('focus');
            return false;
        }

        let tel = cardapio.metodos.validarTelefono();
        if (!tel.ok) {
            cardapio.metodos.mensagem(tel.msg);
            cardapio.metodos.validarTelefonoEnVivo();
            $("#txtCEP").trigger('focus');
            return false;
        }

        // método de pago: se valida que haya uno seleccionado
        let metodoChecked = $("input[name='metodoPago']:checked").val();
        if (!metodoChecked) {
            cardapio.metodos.mensagem('Selecciona un método de pago.');
            return false;
        }

        return true;
    },

    // Botón "Confirmar/Guardar" del modal
    confirmarEntrega: () => {

        // primero valida lo específico del tipo de entrega (reparto/barrio es opcional)
        if (TIPO_ENTREGA === 'domicilio') {
            let endereco = $("#txtEndereco").val().trim();

            if (endereco.length <= 0) {
                cardapio.metodos.mensagem('El campo Dirección (calle) es obligatorio.');
                $("#txtEndereco").trigger('focus');
                return;
            }
            if (!MUNICIPIO_SELECCIONADO) {
                cardapio.metodos.mensagem('Selecciona el municipio de La Habana para calcular el envío.');
                return;
            }
        } else if (TIPO_ENTREGA !== 'local') {
            cardapio.metodos.mensagem('Selecciona cómo deseas recibir tu pedido.');
            return;
        }

        // después valida datos de contacto y método de pago (comunes a ambos)
        if (!cardapio.metodos.validarDatosContactoModal()) {
            return;
        }

        // cerrar modal y reflejar
        cardapio.metodos.cerrarModalEntrega();
        if (TIPO_ENTREGA === 'domicilio') {
            cardapio.metodos.actualizarResumenDireccionConfirmada();
            cardapio.metodos.mensagem('Dirección guardada correctamente.', 'green');
        } else {
            cardapio.metodos.actualizarResumenEntregaLocal();
            cardapio.metodos.mensagem('Recogida en el local confirmada.', 'green');
        }
        cardapio.metodos.carregarValores();
        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // (compatibilidad) guardar dirección desde el modal
    guardarDireccion: () => {
        cardapio.metodos.confirmarEntrega();
    },

    // Muestra el resumen de la dirección confirmada (domicilio) debajo de las tarjetas
    actualizarResumenDireccionConfirmada: () => {
        let endereco = $("#txtEndereco").val().trim();
        let bairro = $("#txtBairro").val().trim();

        if (TIPO_ENTREGA !== 'domicilio' || !endereco || !MUNICIPIO_SELECCIONADO) {
            $("#resumenDireccionConfirmada").addClass('hidden');
            return;
        }

        $("#iconResumenDireccion").attr('class', 'fas fa-motorcycle');
        $("#resumenDireccionTitulo").text('Entrega a domicilio');
        $("#resumenDireccionValor").text(bairro ? `${endereco} — ${bairro}` : endereco);
        $("#resumenDireccionMunicipio").text(
            `Municipio: ${MUNICIPIO_SELECCIONADO.nome} · Envío MN$ ${MUNICIPIO_SELECCIONADO.costo.toFixed(2).replace('.', ',')}`
        );
        $("#resumenDireccionConfirmada").removeClass('hidden');
    },

    // Muestra el resumen de la recogida en el local
    actualizarResumenEntregaLocal: () => {
        if (TIPO_ENTREGA !== 'local') {
            return;
        }
        $("#iconResumenDireccion").attr('class', 'fas fa-store');
        $("#resumenDireccionTitulo").text('Recoger en el local');
        $("#resumenDireccionValor").text('Farmacia Habanaaaaa · Calle 23 #456 entre E y F, Vedado');
        $("#resumenDireccionMunicipio").text('Horario: Lun a Sáb, 9:00 AM - 7:00 PM · Envío gratis');
        $("#resumenDireccionConfirmada").removeClass('hidden');
    },

    // ============================================================
    //  MÉTODO DE PAGO (tarjetas)
    // ============================================================

    seleccionarMetodoPago: (metodo) => {
        $(".metodo-pago-card").removeClass('selected');
        $(`.metodo-pago-card[data-metodo='${metodo}']`).addClass('selected');

        if (metodo === 'transferencia') {
            $("#ddlUf").val('Pago por transferencia');
        } else {
            $("#ddlUf").val('Pago en efectivo');
        }

        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // ============================================================
    //  TELÉFONO: selector de código de país + validación
    // ============================================================

    renderCodigosPais: () => {
        let $sel = $("#ddlCountryCode");
        if ($sel.length === 0 || $sel.children().length > 0) return;

        let html = '';
        PAISES_TELEFONO.forEach((p) => {
            let selected = (p.code === PAIS_TELEFONO_ACTUAL) ? 'selected' : '';
            html += `<option value="${p.code}" ${selected}>${p.code} ${p.name}</option>`;
        });
        $sel.html(html);

        $sel.off('change.codigopais').on('change.codigopais', function () {
            PAIS_TELEFONO_ACTUAL = $(this).val();
            cardapio.metodos.validarTelefonoEnVivo();
        });
    },

    // Busca el país por código
    buscarPaisTelefono: (code) => {
        return PAISES_TELEFONO.find((p) => p.code === code) || PAISES_TELEFONO[0];
    },

    // Valida el teléfono: solo dígitos, longitud correcta según país.
    // Devuelve { ok: bool, msg: string, digitos: string, pais: obj }
    validarTelefono: () => {
        let code = $("#ddlCountryCode").val() || PAIS_TELEFONO_ACTUAL;
        let pais = cardapio.metodos.buscarPaisTelefono(code);
        let raw = ($("#txtCEP").val() || '').trim();
        // quitar espacios, guiones, paréntesis, y el propio prefijo si lo incluyó el usuario
        let digitos = raw.replace(/[\s\-()+]/g, '');
        if (digitos.startsWith(pais.code.replace('+', ''))) {
            digitos = digitos.substring(pais.code.replace('+', '').length);
        }

        if (digitos.length === 0) {
            return { ok: false, msg: 'El teléfono es obligatorio.', digitos: '', pais: pais };
        }
        if (!/^\d+$/.test(digitos)) {
            return { ok: false, msg: 'El teléfono solo puede contener números.', digitos: digitos, pais: pais };
        }
        if (digitos.length < pais.min || digitos.length > pais.max) {
            let rango = (pais.min === pais.max) ? `${pais.min} dígitos` : `entre ${pais.min} y ${pais.max} dígitos`;
            return {
                ok: false,
                msg: `Número no válido para ${pais.name} (${pais.code}). Debe tener ${rango}.`,
                digitos: digitos,
                pais: pais
            };
        }

        return { ok: true, msg: 'Número válido', digitos: digitos, pais: pais };
    },

    // Muestra feedback en vivo debajo del campo teléfono
    validarTelefonoEnVivo: () => {
        let $fb = $("#telefonoFeedback");
        let raw = ($("#txtCEP").val() || '').trim();

        if (raw.length === 0) {
            $fb.removeClass('error ok').text('');
            $("#txtCEP").removeClass('input-error input-ok');
            return;
        }

        let r = cardapio.metodos.validarTelefono();
        if (r.ok) {
            $fb.removeClass('error').addClass('ok')
                .html(`<i class="fas fa-check-circle"></i> ${r.msg} · ${r.pais.code} ${r.pais.name}`);
            $("#txtCEP").removeClass('input-error').addClass('input-ok');
        } else {
            $fb.removeClass('ok').addClass('error')
                .html(`<i class="fas fa-exclamation-triangle"></i> ${r.msg}`);
            $("#txtCEP").removeClass('input-ok').addClass('input-error');
        }
    },

    // pinta la lista de municipios seleccionables
    renderMunicipios: () => {

        let $cont = $("#listaMunicipios");
        if ($cont.length === 0 || $cont.children().length > 0) return; // evitar re-render

        let html = '';
        MUNICIPIOS_HABANA.forEach((m) => {
            html += `
                <label class="municipio-chip" data-id="${m.id}">
                    <input type="radio" name="municipio" value="${m.id}" onchange="cardapio.metodos.seleccionarMunicipio('${m.id}')" />
                    <div class="municipio-chip-body">
                        <span class="municipio-chip-nome"><i class="fas fa-map-marker-alt"></i> ${m.nome}</span>
                        <span class="municipio-chip-preco">MN$ ${m.costo.toFixed(2).replace('.', ',')}</span>
                    </div>
                </label>
            `;
        });

        $cont.html(html);
    },

    // elegir un municipio para el domicilio
    seleccionarMunicipio: (id) => {

        let muni = MUNICIPIOS_HABANA.find(m => m.id === id);
        if (!muni) return;

        MUNICIPIO_SELECCIONADO = muni;
        VALOR_ENTREGA = muni.costo;

        $(".municipio-chip").removeClass('selected');
        $(`.municipio-chip[data-id='${id}']`).addClass('selected');

        $("#lblMunicipioEntrega").text(`(${muni.nome})`);
        cardapio.metodos.carregarValores();
        cardapio.metodos.actualizarEstadoBotonRevisar();
    },

    // (legacy) API ViaCEP: no se usa en Cuba, conservado como no-op para compatibilidad
    buscarCep: () => {
        $("#txtCEP").focus();
    },

    // genera un número de orden único (distinto en cada pedido)
    generarNumeroOrden: () => {
        let d = new Date();
        let pad = (n, l = 2) => String(n).padStart(l, '0');
        let fecha = `${String(d.getFullYear()).slice(-2)}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
        let hora = `${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
        let rand = Math.floor(Math.random() * 9000) + 1000;
        return `FH-${fecha}-${hora}-${rand}`;
    },

    // validação antes de prosseguir para a etapa 3
    resumoPedido: () => {

        // si el botón está deshabilitado, ignorar el click
        if ($("#btnEtapaEndereco").hasClass('btn-disabled')) {
            cardapio.metodos.mensagem('Completa todos los datos de la entrega antes de continuar.');
            return;
        }

        // 0. tipo de entrega es obligatorio
        if (!TIPO_ENTREGA) {
            cardapio.metodos.mensagem('Selecciona si deseas entrega a domicilio o recoger en el local.');
            return;
        }

        let uf = $("#ddlUf").val().trim();
        let complemento = $("#txtComplemento").val().trim();

        // nombre obligatorio (por si el modal no se confirmó)
        if (complemento.length <= 0) {
            cardapio.metodos.mensagem('Completa tus datos de contacto antes de continuar.');
            cardapio.metodos.abrirModalEntrega();
            return;
        }

        // validación de teléfono con código de país
        let tel = cardapio.metodos.validarTelefono();
        if (!tel.ok) {
            cardapio.metodos.mensagem(tel.msg);
            cardapio.metodos.abrirModalEntrega();
            return;
        }

        // teléfono completo con código de país
        let telefonoCompleto = `${tel.pais.code} ${tel.digitos}`;
        let cep = telefonoCompleto;

        if (TIPO_ENTREGA === 'domicilio') {

            let endereco = $("#txtEndereco").val().trim();
            let bairro = $("#txtBairro").val().trim(); // opcional
            let cidade = $("#txtCidade").val().trim();

            if (endereco.length <= 0 || !MUNICIPIO_SELECCIONADO) {
                cardapio.metodos.mensagem('Completa la dirección de entrega antes de continuar.');
                cardapio.metodos.abrirModalEntrega();
                return;
            }

            MEU_ENDERECO = {
                tipo: 'domicilio',
                cep: cep,
                telefonoPais: tel.pais,
                telefonoDigitos: tel.digitos,
                endereco: endereco,
                bairro: bairro || '', // puede estar vacío
                cidade: cidade,
                uf: uf,
                complemento: complemento,
                municipio: MUNICIPIO_SELECCIONADO.nome,
                costoEntrega: MUNICIPIO_SELECCIONADO.costo
            };
        }
        else {
            // recoger en local: sin dirección
            MEU_ENDERECO = {
                tipo: 'local',
                cep: cep,
                telefonoPais: tel.pais,
                telefonoDigitos: tel.digitos,
                uf: uf,
                complemento: complemento,
                costoEntrega: 0
            };
        }

        // generar un nuevo número de orden único para este pedido
        NUMERO_ORDEN = cardapio.metodos.generarNumeroOrden();

        cardapio.metodos.carregarEtapa(3);
        cardapio.metodos.carregarResumo();

    },

    // escapar HTML para evitar inyección al imprimir datos del usuario
    escaparHTML: (texto) => {
        if (texto == null) return '';
        return String(texto)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    },

    // construye una fila de "dato" para el resumen
    filaResumo: (icono, etiqueta, valor) => {
        let val = cardapio.metodos.escaparHTML(valor);
        return `
            <div class="resumo-dato-row">
                <span class="resumo-dato-icon"><i class="${icono}"></i></span>
                <span class="resumo-dato-label">${etiqueta}</span>
                <span class="resumo-dato-value">${val}</span>
            </div>
        `;
    },

    // carrega a etapa de Resumo do pedido
    carregarResumo: () => {

        // --- NÚMERO DE ORDEN ---
        $("#lblNumeroOrden").text(NUMERO_ORDEN || '—');

        // --- PRODUCTOS ---
        $("#listaItensResumo").html('');
        $.each(MEU_CARRINHO, (i, e) => {
            // Mostrar unidad si es un producto con peso
            let unitBadgeResumo = '';
            let unitLabelResumo = '';
            if (e.selectedUnit && e.selectedUnit !== 'unidad') {
                unitBadgeResumo = ` <span class="unit-badge-resumo">(${e.selectedUnit})</span>`;
                unitLabelResumo = `<span class="unit-label-resumo">/${e.selectedUnit}</span>`;
            }

            // Mostrar opciones seleccionadas (con precio extra si aplica)
            let optionsBadgeResumo = '';
            if (e.selectedOptions && Object.keys(e.selectedOptions).length > 0) {
                let optionsText = Object.values(e.selectedOptions).map(o => {
                    let priceExtra = o.price > 0 ? ` (+$${o.price})` : '';
                    return `${o.name}: ${o.choice}${priceExtra}`;
                }).join(' | ');
                optionsBadgeResumo = `<span class="options-badge-resumo">${optionsText}</span>`;
            }

            let temp = cardapio.templates.itemResumo.replace(/\${img}/g, e.img)
                .replace(/\${nome}/g, e.name)
                .replace(/\${preco}/g, e.price.toFixed(2).replace('.', ','))
                .replace(/\${qntd}/g, e.qntd)
                .replace(/\${unitBadgeResumo}/g, unitBadgeResumo)
                .replace(/\${unitLabelResumo}/g, unitLabelResumo)
                .replace(/\${optionsBadgeResumo}/g, optionsBadgeResumo);
            $("#listaItensResumo").append(temp);
        });

        // --- DATOS DEL CLIENTE ---
        let esTransferencia = MEU_ENDERECO && MEU_ENDERECO.uf === 'Pago por transferencia';
        // Transferencia NO aplica ningún recargo adicional sobre los productos.
        let recargoTransferencia = 0;

        let clienteHTML = '';
        if (MEU_ENDERECO) {
            clienteHTML += cardapio.metodos.filaResumo('fas fa-user', 'Nombre:', MEU_ENDERECO.complemento);
            // teléfono con código de país y país
            let telDisplay = MEU_ENDERECO.cep;
            if (MEU_ENDERECO.telefonoPais) {
                telDisplay = `${MEU_ENDERECO.telefonoPais.code} ${MEU_ENDERECO.telefonoDigitos} (${MEU_ENDERECO.telefonoPais.name})`;
            }
            clienteHTML += cardapio.metodos.filaResumo('fas fa-phone', 'Teléfono:', telDisplay);
            clienteHTML += cardapio.metodos.filaResumo('fas fa-money-bill-wave', 'Método de pago:', MEU_ENDERECO.uf);
        }
        $("#resumoDatosCliente").html(clienteHTML);

        // --- ENTREGA ---
        let entregaHTML = '';
        if (MEU_ENDERECO && MEU_ENDERECO.tipo === 'domicilio') {
            $("#lblResumoTituloEntrega").text('Entrega a domicilio');
            $("#iconResumoSectionEntrega").attr('class', 'fas fa-motorcycle');

            entregaHTML += cardapio.metodos.filaResumo('fas fa-truck', 'Modalidad:', 'Entrega a domicilio');
            entregaHTML += cardapio.metodos.filaResumo('fas fa-road', 'Dirección:', MEU_ENDERECO.endereco);
            if (MEU_ENDERECO.bairro) {
                entregaHTML += cardapio.metodos.filaResumo('fas fa-map-signs', 'Reparto / Barrio:', MEU_ENDERECO.bairro);
            }
            entregaHTML += cardapio.metodos.filaResumo('fas fa-map-marker-alt', 'Municipio:', `${MEU_ENDERECO.municipio} (MN$ ${(MEU_ENDERECO.costoEntrega || 0).toFixed(2).replace('.', ',')})`);
            entregaHTML += cardapio.metodos.filaResumo('fas fa-city', 'Ciudad:', MEU_ENDERECO.cidade);
        } else if (MEU_ENDERECO && MEU_ENDERECO.tipo === 'local') {
            $("#lblResumoTituloEntrega").text('Recogida en el local');
            $("#iconResumoSectionEntrega").attr('class', 'fas fa-store');

            entregaHTML += cardapio.metodos.filaResumo('fas fa-store', 'Modalidad:', 'Recoger en el local');
            entregaHTML += cardapio.metodos.filaResumo('fas fa-clinic-medical', 'Local:', 'Farmacia Habana');
            entregaHTML += cardapio.metodos.filaResumo('fas fa-map-marker-alt', 'Dirección:', 'Calle 23 #456 entre E y F, Vedado, Plaza de la Revolución, La Habana');
            entregaHTML += cardapio.metodos.filaResumo('far fa-clock', 'Horario:', 'Lun a Sáb, 9:00 AM - 7:00 PM');
        }
        $("#resumoDatosEntrega").html(entregaHTML);

        // --- TOTALES ---
        let costoEntrega = (MEU_ENDERECO && MEU_ENDERECO.costoEntrega) || 0;
        let esDomicilio = MEU_ENDERECO && MEU_ENDERECO.tipo === 'domicilio';
        let totalFinal = VALOR_CARRINHO + costoEntrega + recargoTransferencia;

        let totaisHTML = '';
        totaisHTML += `
            <div class="resumo-total-row">
                <span class="resumo-total-label">Subtotal productos</span>
                <span class="resumo-total-value">MN$ ${VALOR_CARRINHO.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        if (esDomicilio) {
            totaisHTML += `
                <div class="resumo-total-row">
                    <span class="resumo-total-label"><i class="fas fa-motorcycle"></i> Envío (${cardapio.metodos.escaparHTML(MEU_ENDERECO.municipio)})</span>
                    <span class="resumo-total-value">+ MN$ ${costoEntrega.toFixed(2).replace('.', ',')}</span>
                </div>
            `;
        } else {
            totaisHTML += `
                <div class="resumo-total-row">
                    <span class="resumo-total-label"><i class="fas fa-store"></i> Envío (recogida en local)</span>
                    <span class="resumo-total-value"><span class="tag-gratis">Gratis</span></span>
                </div>
            `;
        }
        totaisHTML += `
            <div class="resumo-total-row resumo-total-final">
                <span class="resumo-total-label">TOTAL A PAGAR</span>
                <span class="resumo-total-value">MN$ ${totalFinal.toFixed(2).replace('.', ',')}</span>
            </div>
        `;
        $("#resumoTotais").html(totaisHTML);

        cardapio.metodos.finalizarPedido();

    },

    // Atualiza o link do botão do WhatsApp (formato POS Ticketing)
    finalizarPedido: () => {

        if (MEU_CARRINHO.length <= 0 || MEU_ENDERECO == null) return;

        let costoEntrega = MEU_ENDERECO.costoEntrega || 0;
        let esDomicilio = MEU_ENDERECO.tipo === 'domicilio';
        let total = VALOR_CARRINHO + costoEntrega;

        // Formatear numero sin decimales si es entero
        let fmt = (n) => {
            if (Number.isInteger(n)) return n.toString();
            return n.toFixed(2).replace('.', ',');
        };
        
        // Obtener fecha y hora actual
        let d = new Date();
        let pad = (n) => n.toString().padStart(2, '0');
        let fechaFormateada = `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
        let horaFormateada = `${pad(d.getHours())}:${pad(d.getMinutes())}`;
        
        let linea = '--------------------------------';
        let texto = '';

        // === ENCABEZADO ===
        texto += `        *TIENDITA D'MIMA*\n`;
        texto += `${linea}\n`;
        texto += `Fecha: ${fechaFormateada}  Hora: ${horaFormateada}\n`;
        if (NUMERO_ORDEN) {
            texto += `Orden: ${NUMERO_ORDEN}\n`;
        }
        texto += `${linea}\n\n`;

        // === DATOS DEL CLIENTE (PRIMERO) ===
        texto += `*CLIENTE:*\n`;
        texto += `${MEU_ENDERECO.complemento}\n`;
        let telText = MEU_ENDERECO.cep;
        if (MEU_ENDERECO.telefonoPais) {
            telText = `${MEU_ENDERECO.telefonoPais.code} ${MEU_ENDERECO.telefonoDigitos}`;
        }
        texto += `Tel: ${telText}\n`;
        texto += `Pago: ${MEU_ENDERECO.uf}\n`;
        
        // Direccion del cliente
        if (esDomicilio) {
            texto += `\n*DIRECCION:*\n`;
            texto += `${MEU_ENDERECO.endereco}\n`;
            if (MEU_ENDERECO.bairro) {
                texto += `${MEU_ENDERECO.bairro}, ${MEU_ENDERECO.municipio}\n`;
            } else {
                texto += `${MEU_ENDERECO.municipio}\n`;
            }
            texto += `${MEU_ENDERECO.cidade}\n`;
        } else {
            texto += `\n*RECOGIDA EN LOCAL*\n`;
        }
        texto += `${linea}\n\n`;

        // === PRODUCTOS (FORMATO POS) ===
        texto += `*PRODUCTOS:*\n`;
        $.each(MEU_CARRINHO, (i, e) => {
            let subtotalItem = e.price * e.qntd;
            
            // Nombre del producto con unidad si aplica
            let nombreProducto = e.name;
            if (e.selectedUnit && e.selectedUnit !== 'unidad') {
                nombreProducto += ` (${e.selectedUnit})`;
            }
            
            // Formato POS: Producto
            //              cantidad x precio
            texto += `${nombreProducto}\n`;
            texto += `    ${e.qntd} x ${fmt(e.price)} = ${fmt(subtotalItem)}\n`;
            
            // Opciones si existen (en linea separada)
            if (e.selectedOptions && Object.keys(e.selectedOptions).length > 0) {
                let optionsText = Object.values(e.selectedOptions).map(o => `${o.choice}`).join(', ');
                texto += `    (${optionsText})\n`;
            }
        });
        texto += `${linea}\n\n`;

        // === TOTALES ===
        texto += `Subtotal:        ${fmt(VALOR_CARRINHO)}\n`;
        if (esDomicilio) {
            texto += `Envio (${MEU_ENDERECO.municipio}):  +${fmt(costoEntrega)}\n`;
        } else {
            texto += `Envio:           GRATIS\n`;
        }
        texto += `${linea}\n`;
        texto += `*TOTAL:          ${fmt(total)}*\n`;
        texto += `${linea}\n`;
        texto += `\nGracias por su compra!`;

        // converte a URL
        let encode = encodeURIComponent(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnEtapaResumo").attr('href', URL);

    },

    // cargar el enlace del botón de reserva
    carregarBotaoReserva: () => {

        var texto = '¡Hola! Me gustaría hablar con un *asistente*';

        let encode = encodeURI(texto);
        let URL = `https://wa.me/${CELULAR_EMPRESA}?text=${encode}`;

        $("#btnReserva").attr('href', URL);

    },

    // carrega o botão de ligar
    carregarBotaoLigar: () => {

        $("#btnLigar").attr('href', `tel:${CELULAR_EMPRESA}`);

    },

    // abre o depoimento
    abrirDepoimento: (depoimento) => {

        $("#depoimento-1").addClass('hidden');
        $("#depoimento-2").addClass('hidden');
        $("#depoimento-3").addClass('hidden');

        $("#btnDepoimento-1").removeClass('active');
        $("#btnDepoimento-2").removeClass('active');
        $("#btnDepoimento-3").removeClass('active');

        $("#depoimento-" + depoimento).removeClass('hidden');
        $("#btnDepoimento-" + depoimento).addClass('active');

    },

    // mensagens
    mensagem: (texto, cor = 'red', tempo = 3500) => {

        let id = Math.floor(Date.now() * Math.random()).toString();

        let msg = `<div id="msg-${id}" class="animated fadeInDown toast ${cor}">${texto}</div>`;

        $("#container-mensagens").append(msg);

        setTimeout(() => {
            $("#msg-" + id).removeClass('fadeInDown');
            $("#msg-" + id).addClass('fadeOutUp');
            setTimeout(() => {
                $("#msg-" + id).remove();
            }, 800);
        }, tempo)

    }

}

cardapio.templates = {

    item: `
        <div class="col-12 col-lg-3 col-md-3 col-sm-6 mb-5 animated fadeInUp">
            <div class="card card-item \${inCartClass}" id="\${id}" data-has-options="\${hasOptions}">
                \${inCartBadge}
                <span class="card-badge-categoria"><i class="\${categoriaIcone}"></i> \${categoriaNome}</span>
                <div class="img-produto" onclick="cardapio.metodos.abrirLightbox('\${img}', '\${nome}')" role="button" tabindex="0" aria-label="Ampliar imagen de \${nome}" title="Toca para ampliar">
                    <img src="\${img}" alt="\${nome}" />
                    <span class="img-zoom-hint" aria-hidden="true"><i class="fas fa-search-plus"></i></span>
                </div>
                <p class="title-produto text-center mt-4">
                    <b>\${nome}</b>
                </p>
                <p class="price-produto text-center" id="price-\${id}">
                    <b>MN$ \${preco}</b>\${unitLabel}
                </p>
                \${unitSelector}
                \${optionsSelector}
                <div class="add-carrinho">
                    <div class="quantidade-wrapper" aria-label="Seleccionar cantidad">
                        <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidade('\${id}')" role="button" aria-label="Disminuir cantidad"><i class="fas fa-minus"></i></span>
                        <span class="add-numero-itens" id="qntd-\${id}">1</span>
                        <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidade('\${id}')" role="button" aria-label="Aumentar cantidad"><i class="fas fa-plus"></i></span>
                    </div>
                    <button class="btn btn-add \${btnDisabledClass}" onclick="cardapio.metodos.adicionarAoCarrinho('\${id}')" aria-label="Añadir al carrito" \${btnDisabledAttr}>
                        <i class="fa fa-shopping-cart"></i>
                        <span class="btn-add-label">Añadir</span>
                    </button>
                </div>
            </div>
        </div>
    `,

    itemCarrinho: `
        <div class="col-12 item-carrinho">
            <div class="img-produto">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto"><b>\${nome}</b>\${unitBadge}</p>
                \${optionsBadgeCart}
                <p class="price-produto"><b>MN$ \${preco}</b>\${unitLabelCart}</p>
            </div>
            <div class="add-carrinho">
                <span class="btn-menos" onclick="cardapio.metodos.diminuirQuantidadeCarrinho('\${cartId}')"><i class="fas fa-minus"></i></span>
                <span class="add-numero-itens" id="qntd-carrinho-\${cartId}">\${qntd}</span>
                <span class="btn-mais" onclick="cardapio.metodos.aumentarQuantidadeCarrinho('\${cartId}')"><i class="fas fa-plus"></i></span>
                <span class="btn btn-remove no-mobile" onclick="cardapio.metodos.removerItemCarrinho('\${cartId}')"><i class="fa fa-times"></i></span>
            </div>
        </div>
    `,

    itemResumo: `
        <div class="col-12 item-carrinho resumo">
            <div class="img-produto-resumo">
                <img src="\${img}" />
            </div>
            <div class="dados-produto">
                <p class="title-produto-resumo">
                    <b>\${nome}</b>\${unitBadgeResumo}
                </p>
                \${optionsBadgeResumo}
                <p class="price-produto-resumo">
                    <b>MN$ \${preco}</b>\${unitLabelResumo}
                </p>
            </div>
            <p class="quantidade-produto-resumo">
                x <b>\${qntd}</b>
            </p>
        </div>
    `

}
