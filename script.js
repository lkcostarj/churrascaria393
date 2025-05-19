// Variáveis globais
let currentStep = 1;
const totalSteps = 7;
let selectedItems = {};
const whatsappNumber = "24998665908"; // Número fornecido pelo usuário

// Inicialização quando o DOM estiver carregado
document.addEventListener('DOMContentLoaded', function() {
    // Inicializar partículas
    initParticles();
    
    // Inicializar os contadores de quantidade
    initQuantityControls();
    
    // Configurar botões de navegação
    setupNavigationButtons();
    
    // Configurar botão de voltar no cabeçalho
    document.querySelector('.back-button').addEventListener('click', function() {
        if (currentStep > 1) {
            navigateToStep(currentStep - 1);
        }
    });
    
    // Configurar toggle de retirada no estabelecimento
    document.getElementById('pickup-toggle').addEventListener('change', function() {
        const addressForm = document.getElementById('address-form');
        if (this.checked) {
            addressForm.style.display = 'none';
        } else {
            addressForm.style.display = 'block';
        }
    });
    
    // Configurar botão de adicionar aos favoritos
    document.getElementById('add-favorite').addEventListener('click', function() {
        const icon = this.querySelector('i');
        if (icon.classList.contains('far')) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            showConfetti();
            playSuccessSound();
            alert('Adicionado aos favoritos!');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            alert('Removido dos favoritos!');
        }
    });
    
    // Configurar opções de pagamento para mostrar/ocultar campo de troco
    const paymentOptions = document.querySelectorAll('input[name="payment"]');
    const changeField = document.getElementById('change-field');
    
    paymentOptions.forEach(option => {
        option.addEventListener('change', function() {
            if (this.value === 'money') {
                changeField.style.display = 'block';
                changeField.classList.add('animate__animated', 'animate__fadeIn');
            } else {
                changeField.style.display = 'none';
            }
        });
    });
    
    // Inicializar estado do campo de troco (oculto por padrão)
    changeField.style.display = 'none';
    
    // Configurar botão de enviar para WhatsApp
    document.getElementById('send-whatsapp').addEventListener('click', function() {
        // Validar formulário de endereço se não for retirada no local
        if (!document.getElementById('pickup-toggle').checked) {
            if (!validateAddressForm()) {
                return;
            }
        }
        
        // Validar campo de troco se pagamento for em dinheiro
        const moneyPayment = document.querySelector('input[name="payment"][value="money"]').checked;
        if (moneyPayment) {
            const changeAmount = document.getElementById('change-amount').value;
            if (!changeAmount) {
                highlightEmptyField('change-amount');
                alert('Por favor, informe para quanto precisa de troco ou digite "Não precisa" se não for necessário.');
                return;
            }
        }
        
        // Preparar e enviar mensagem para WhatsApp
        sendToWhatsApp();
        
        // Mostrar confirmação
        hideAllSteps();
        document.getElementById('confirmation').classList.add('active');
        
        // Atualizar barra de progresso
        updateProgressBar(totalSteps + 1);
        
        // Efeito de confete para celebrar o pedido finalizado
        showBigConfetti();
    });
    
    // Configurar botão de voltar ao início na confirmação
    document.querySelector('.home-btn').addEventListener('click', function() {
        resetForm();
        navigateToStep(1);
    });
});

// Inicializar partículas
function initParticles() {
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": {
                    "value": 30,
                    "density": {
                        "enable": true,
                        "value_area": 800
                    }
                },
                "color": {
                    "value": "#ff8c00"
                },
                "shape": {
                    "type": "circle",
                    "stroke": {
                        "width": 0,
                        "color": "#000000"
                    },
                    "polygon": {
                        "nb_sides": 5
                    }
                },
                "opacity": {
                    "value": 0.5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 1,
                        "opacity_min": 0.1,
                        "sync": false
                    }
                },
                "size": {
                    "value": 5,
                    "random": true,
                    "anim": {
                        "enable": true,
                        "speed": 4,
                        "size_min": 0.3,
                        "sync": false
                    }
                },
                "line_linked": {
                    "enable": false
                },
                "move": {
                    "enable": true,
                    "speed": 2,
                    "direction": "top",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false,
                    "attract": {
                        "enable": false,
                        "rotateX": 600,
                        "rotateY": 1200
                    }
                }
            },
            "interactivity": {
                "detect_on": "canvas",
                "events": {
                    "onhover": {
                        "enable": true,
                        "mode": "repulse"
                    },
                    "onclick": {
                        "enable": true,
                        "mode": "push"
                    },
                    "resize": true
                },
                "modes": {
                    "repulse": {
                        "distance": 100,
                        "duration": 0.4
                    },
                    "push": {
                        "particles_nb": 4
                    }
                }
            },
            "retina_detect": true
        });
    }
}

// Inicializar controles de quantidade
function initQuantityControls() {
    const quantityControls = document.querySelectorAll('.quantity-control');
    
    quantityControls.forEach(control => {
        const decrementBtn = control.querySelector('.decrement-btn');
        const incrementBtn = control.querySelector('.increment-btn');
        const quantityDisplay = control.querySelector('.quantity');
        
        // Obter informações do item
        const optionItem = control.closest('.option-item');
        let itemName = '';
        let maxQuantity = 1;
        
        if (optionItem) {
            itemName = optionItem.querySelector('h3').textContent;
            const stepContent = optionItem.closest('.step-content');
            const limitText = stepContent.querySelector('.limit').textContent;
            const limitMatch = limitText.match(/\d+/);
            if (limitMatch) {
                maxQuantity = parseInt(limitMatch[0]);
            }
        }
        
        // Configurar botão de decremento
        decrementBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityDisplay.textContent);
            if (quantity > 0) {
                quantity--;
                quantityDisplay.textContent = quantity;
                
                // Efeito visual
                quantityDisplay.classList.add('pulse');
                setTimeout(() => {
                    quantityDisplay.classList.remove('pulse');
                }, 500);
                
                // Atualizar seleção
                if (itemName && optionItem) {
                    updateItemSelection(itemName, quantity, optionItem);
                }
            } else {
                // Efeito de shake para feedback negativo
                decrementBtn.classList.add('shake');
                setTimeout(() => {
                    decrementBtn.classList.remove('shake');
                }, 500);
            }
        });
        
        // Configurar botão de incremento
        incrementBtn.addEventListener('click', function() {
            let quantity = parseInt(quantityDisplay.textContent);
            
            // Verificar limite de seleção para a etapa atual
            if (optionItem) {
                const stepContent = optionItem.closest('.step-content');
                const stepId = stepContent.id;
                const currentStepItems = document.querySelectorAll(`#${stepId} .quantity`);
                
                let totalSelected = 0;
                currentStepItems.forEach(item => {
                    totalSelected += parseInt(item.textContent);
                });
                
                if (totalSelected >= maxQuantity) {
                    // Efeito de shake para feedback negativo
                    incrementBtn.classList.add('shake');
                    setTimeout(() => {
                        incrementBtn.classList.remove('shake');
                    }, 500);
                    
                    alert(`Você só pode escolher até ${maxQuantity} item(ns) nesta etapa.`);
                    return;
                }
            }
            
            quantity++;
            quantityDisplay.textContent = quantity;
            
            // Efeitos visuais de recompensa
            quantityDisplay.classList.add('pulse');
            optionItem.classList.add('glow');
            
            // Remover classes após a animação
            setTimeout(() => {
                quantityDisplay.classList.remove('pulse');
                optionItem.classList.remove('glow');
            }, 800);
            
            // Efeito de partículas ao selecionar
            if (quantity === 1) {
                showItemConfetti(incrementBtn);
                playSuccessSound();
            }
            
            // Atualizar seleção
            if (itemName && optionItem) {
                updateItemSelection(itemName, quantity, optionItem);
            }
        });
    });
}

// Atualizar seleção de item
function updateItemSelection(itemName, quantity, optionItem) {
    const stepContent = optionItem.closest('.step-content');
    const stepId = stepContent.id;
    const stepNumber = stepId.replace('step', '');
    
    // Armazenar seleção
    if (!selectedItems[stepNumber]) {
        selectedItems[stepNumber] = {};
    }
    
    if (quantity > 0) {
        selectedItems[stepNumber][itemName] = quantity;
    } else {
        delete selectedItems[stepNumber][itemName];
    }
    
    // Atualizar resumo
    updateSummary();
}

// Atualizar resumo do pedido
function updateSummary() {
    const selectedItemsContainer = document.getElementById('selected-items');
    const orderItemsContainer = document.getElementById('order-items');
    
    // Limpar contêineres
    selectedItemsContainer.innerHTML = '';
    orderItemsContainer.innerHTML = '';
    
    // Criar lista de itens selecionados
    let itemsList = '';
    
    for (const step in selectedItems) {
        for (const item in selectedItems[step]) {
            const quantity = selectedItems[step][item];
            if (quantity > 0) {
                itemsList += `${quantity} ${item}, `;
            }
        }
    }
    
    // Remover vírgula final
    if (itemsList) {
        itemsList = itemsList.slice(0, -2);
    } else {
        itemsList = 'Nenhum item selecionado';
    }
    
    // Atualizar contêineres
    selectedItemsContainer.textContent = itemsList;
    orderItemsContainer.textContent = itemsList;
    
    // Adicionar efeito de animação ao atualizar
    selectedItemsContainer.classList.add('pulse');
    setTimeout(() => {
        selectedItemsContainer.classList.remove('pulse');
    }, 500);
}

// Configurar botões de navegação
function setupNavigationButtons() {
    const prevButtons = document.querySelectorAll('.prev-btn');
    const nextButtons = document.querySelectorAll('.next-btn');
    
    prevButtons.forEach(button => {
        button.addEventListener('click', function() {
            navigateToStep(currentStep - 1);
        });
    });
    
    nextButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Verificar se há itens selecionados na etapa atual
            const stepContent = button.closest('.step-content');
            const stepId = stepContent.id;
            const stepNumber = stepId.replace('step', '');
            
            // Permitir avançar sem seleção apenas na última etapa (resumo)
            if (stepNumber < 6) {
                const hasSelection = checkStepSelection(stepNumber);
                if (!hasSelection) {
                    // Efeito de shake para feedback negativo
                    button.classList.add('shake');
                    setTimeout(() => {
                        button.classList.remove('shake');
                    }, 500);
                    
                    alert('Por favor, selecione pelo menos um item antes de continuar.');
                    return;
                }
            }
            
            navigateToStep(currentStep + 1);
            
            // Efeito de confete ao avançar para a próxima etapa
            showSmallConfetti();
        });
    });
}

// Verificar se há itens selecionados na etapa
function checkStepSelection(stepNumber) {
    if (!selectedItems[stepNumber]) {
        return false;
    }
    
    for (const item in selectedItems[stepNumber]) {
        if (selectedItems[stepNumber][item] > 0) {
            return true;
        }
    }
    
    return false;
}

// Navegar para uma etapa específica
function navigateToStep(step) {
    if (step < 1 || step > totalSteps) {
        return;
    }
    
    // Esconder todas as etapas
    hideAllSteps();
    
    // Mostrar a etapa atual com animação
    const nextStep = document.getElementById(`step${step}`);
    nextStep.classList.add('active');
    
    // Adicionar animação baseada na direção
    if (step > currentStep) {
        // Animação para frente
        nextStep.style.animation = 'slideInRight 0.5s forwards';
    } else {
        // Animação para trás
        nextStep.style.animation = 'slideInLeft 0.5s forwards';
    }
    
    // Limpar animação após completar
    setTimeout(() => {
        nextStep.style.animation = '';
    }, 500);
    
    // Atualizar etapa atual
    currentStep = step;
    
    // Atualizar barra de progresso
    updateProgressBar(step);
}

// Esconder todas as etapas
function hideAllSteps() {
    const steps = document.querySelectorAll('.step-content');
    steps.forEach(step => {
        step.classList.remove('active');
    });
}

// Atualizar barra de progresso
function updateProgressBar(step) {
    const progressSteps = document.querySelectorAll('.progress-step');
    
    progressSteps.forEach((progressStep, index) => {
        const stepNumber = index + 1;
        
        if (stepNumber < step) {
            progressStep.classList.add('completed');
            progressStep.classList.remove('active');
        } else if (stepNumber === step) {
            progressStep.classList.add('active');
            progressStep.classList.remove('completed');
            
            // Adicionar animação de pulso ao círculo ativo
            const stepCircle = progressStep.querySelector('.step-circle');
            stepCircle.classList.add('pulse');
            setTimeout(() => {
                stepCircle.classList.remove('pulse');
            }, 500);
        } else {
            progressStep.classList.remove('active');
            progressStep.classList.remove('completed');
        }
    });
}

// Validar formulário de endereço
function validateAddressForm() {
    const street = document.getElementById('street').value;
    const number = document.getElementById('number').value;
    const neighborhood = document.getElementById('neighborhood').value;
    
    if (!street || !number || !neighborhood) {
        // Destacar campos vazios
        if (!street) highlightEmptyField('street');
        if (!number) highlightEmptyField('number');
        if (!neighborhood) highlightEmptyField('neighborhood');
        
        alert('Por favor, preencha os campos obrigatórios: Rua, Número e Bairro.');
        return false;
    }
    
    return true;
}

// Destacar campo vazio
function highlightEmptyField(fieldId) {
    const field = document.getElementById(fieldId);
    field.classList.add('shake');
    field.style.borderColor = 'var(--alert-color)';
    
    setTimeout(() => {
        field.classList.remove('shake');
        field.style.borderColor = '';
    }, 1000);
}

// Enviar pedido para WhatsApp
function sendToWhatsApp() {
    // Coletar informações do pedido
    let message = "🍖 *NOVO PEDIDO - ROTA 393 CHURRASCARIA* 🍖\n\n";
    
    // Adicionar itens selecionados
    message += "*Itens do Pedido:*\n";
    let hasItems = false;
    
    for (const step in selectedItems) {
        for (const item in selectedItems[step]) {
            const quantity = selectedItems[step][item];
            if (quantity > 0) {
                message += `- ${quantity}x ${item}\n`;
                hasItems = true;
            }
        }
    }
    
    if (!hasItems) {
        message += "- Nenhum item selecionado\n";
    }
    
    // Adicionar observação
    const observation = document.getElementById('observation').value;
    if (observation) {
        message += "\n*Observações:*\n" + observation + "\n";
    }
    
    // Adicionar informações de entrega
    const isPickup = document.getElementById('pickup-toggle').checked;
    
    if (isPickup) {
        message += "\n*Retirada no Local*\n";
    } else {
        const street = document.getElementById('street').value;
        const number = document.getElementById('number').value;
        const complement = document.getElementById('complement').value;
        const neighborhood = document.getElementById('neighborhood').value;
        const reference = document.getElementById('reference').value;
        
        message += "\n*Endereço de Entrega:*\n";
        message += `${street}, ${number}`;
        if (complement) message += `, ${complement}`;
        message += `\n${neighborhood}`;
        if (reference) message += `\nReferência: ${reference}`;
    }
    
    // Adicionar forma de pagamento
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;
    let paymentText = "";
    
    switch (paymentMethod) {
        case "card":
            paymentText = "Cartão";
            break;
        case "money":
            paymentText = "Dinheiro";
            // Adicionar informação de troco
            const changeAmount = document.getElementById('change-amount').value;
            if (changeAmount) {
                message += "\n*Troco para:* " + changeAmount;
            }
            break;
        case "pix":
            paymentText = "PIX";
            break;
    }
    
    message += "\n\n*Forma de Pagamento:* " + paymentText;
    
    // Adicionar valor total
    message += "\n*Valor Total:* R$ 24,90";
    
    // Codificar a mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    
    // Criar URL do WhatsApp
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
    
    // Abrir WhatsApp em nova janela
    window.open(whatsappUrl, '_blank');
}

// Resetar formulário
function resetForm() {
    // Resetar seleções
    selectedItems = {};
    
    // Resetar quantidades
    const quantities = document.querySelectorAll('.quantity');
    quantities.forEach(quantity => {
        if (!quantity.closest('.order-quantity')) {
            quantity.textContent = '0';
        }
    });
    
    // Resetar observação
    document.getElementById('observation').value = '';
    
    // Resetar formulário de endereço
    document.getElementById('street').value = '';
    document.getElementById('number').value = '';
    document.getElementById('complement').value = '';
    document.getElementById('neighborhood').value = '';
    document.getElementById('reference').value = '';
    
    // Resetar toggle de retirada
    document.getElementById('pickup-toggle').checked = false;
    document.getElementById('address-form').style.display = 'block';
    
    // Resetar opção de pagamento
    document.querySelector('input[name="payment"][value="card"]').checked = true;
    
    // Ocultar campo de troco
    document.getElementById('change-field').style.display = 'none';
    
    // Resetar valor de troco
    document.getElementById('change-amount').value = '';
    
    // Atualizar resumo
    updateSummary();
}

// Mostrar confete pequeno
function showSmallConfetti() {
    if (typeof confetti !== 'undefined') {
        const duration = 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 100, ticks: 60, zIndex: 9999 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            
            const particleCount = 20 * (timeLeft / duration);
            
            // Confete da esquerda
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#FF8C00', '#4CAF50', '#2196F3']
            }));
            
            // Confete da direita
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#FF8C00', '#4CAF50', '#2196F3']
            }));
        }, 250);
    }
}

// Mostrar confete grande (para finalização do pedido)
function showBigConfetti() {
    if (typeof confetti !== 'undefined') {
        const duration = 3000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };
        
        function randomInRange(min, max) {
            return Math.random() * (max - min) + min;
        }
        
        const interval = setInterval(function() {
            const timeLeft = animationEnd - Date.now();
            
            if (timeLeft <= 0) {
                return clearInterval(interval);
            }
            
            const particleCount = 50 * (timeLeft / duration);
            
            // Confete do centro
            confetti(Object.assign({}, defaults, {
                particleCount,
                origin: { x: randomInRange(0.3, 0.7), y: Math.random() - 0.2 },
                colors: ['#FF8C00', '#4CAF50', '#2196F3', '#E53935', '#9C27B0']
            }));
            
            // Confete da esquerda
            confetti(Object.assign({}, defaults, {
                particleCount: particleCount / 2,
                origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
                colors: ['#FF8C00', '#4CAF50', '#2196F3', '#E53935', '#9C27B0']
            }));
            
            // Confete da direita
            confetti(Object.assign({}, defaults, {
                particleCount: particleCount / 2,
                origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
                colors: ['#FF8C00', '#4CAF50', '#2196F3', '#E53935', '#9C27B0']
            }));
        }, 250);
    }
}

// Mostrar confete ao selecionar item
function showItemConfetti(element) {
    if (typeof confetti !== 'undefined') {
        const rect = element.getBoundingClientRect();
        const x = (rect.left + rect.width / 2) / window.innerWidth;
        const y = (rect.top + rect.height / 2) / window.innerHeight;
        
        confetti({
            particleCount: 30,
            spread: 70,
            origin: { x, y },
            colors: ['#FF8C00', '#4CAF50'],
            zIndex: 9999,
            disableForReducedMotion: true
        });
    }
}

// Reproduzir som de sucesso
function playSuccessSound() {
    // Criar elemento de áudio
    const audio = new Audio();
    audio.volume = 0.3; // Volume baixo para não incomodar
    
    // Usar um som de "pop" simples
    audio.src = "data:audio/wav;base64,UklGRpQGAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YXAGAACAgICAgICAgICAgICAgICAgICAgICAgICAf3hxeH+AfXZ1eHx6dnR5fYGFgoOKi42aloubq6GOjI2Op7ythXJ0eYF5aV1AOFFib32HmZSHhpCalIiYi4SRkZaLfnhxaWptb21qaWBea2BRYmZTVmFgWFNXVVVhaGdbYGhZbXh1gXZ1goeIlot1k6+oopOcpaWvp5uqrKCgm5iUmpqUlI+KhIaAf4J8dHJpb21qaGVjY2JgX1xbXFxcXF1cXF1cXV5fX2FiYmNlZmZoaGprbW5vcXJzdXZ4eXt8fn+BgoSFh4iJi4yOj5GSk5WWmJmbnJ6foaKkpaeoqaqsra6wsbO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdobG1ub3BxcnN0dXZ3eHl6e3x9fn+AgYKDhIWGh4iJiouMjY6PkJGSk5SVlpeYmZqbnJ2en6ChoqOkpaanqKmqq6ytrq+wsbKztLW2t7i5uru8vb6/wMHCw8TFxsfIycrLzM3Oz9DR0tPU1dbX2Nna29zd3t/g4eLj5OXm5+jp6uvs7e7v8PHy8/T19vf4+fr7/P3+/wABAgMEBQYHCAkKCwwNDg8QERITFBUWFxgZGhscHR4fICEiIyQlJicoKSorLC0uLzAxMjM0NTY3ODk6Ozw9Pj9AQUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpbXF1eX2BhYmNkZWZnaGlqa2xtbm9wcXJzdHV2d3h5ent8fX5/gIGCg4SFhoeIiYqLjI2Oj5CRkpOUlZaXmJmam5ydnp+goaKjpKWmp6ipqqusra6vsLGys7S1tre4ubq7vL2+v8DBwsPExcbHyMnKy8zNzs/Q0dLT1NXW19jZ2tvc3d7f4OHi4+Tl5ufo6err7O3u7/Dx8vP09fb3+Pn6+/z9/v8AAQIDBAUGBwgJCgsMDQ4PEBESExQVFhcYGRobHB0eHyAhIiMkJSYnKCkqKywtLi8wMTIzNDU2Nzg5Ojs8PT4/QEFCQ0RFRkdISUpLTE1OT1BRUlNUVVZXWFlaW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f4CBgoOEhYaHiImKi4yNjo+QkZKTlJWWl5iZmpucnZ6foKGio6SlpqeoqaqrrK2ur7CxsrO0tba3uLm6u7y9vr/AwcLDxMXGx8jJysvMzc7P0NHS09TV1tfY2drb3N3e3+Dh4uPk5ebn6Onq6+zt7u/w8fLz9PX29/j5+vv8/f7/AAECAwQFBgcICQoLDA0ODxAREhMUFRYXGBkaGxwdHh8gISIjJCUmJygpKissLS4vMDEyMzQ1Njc4OTo7PD0+P0BBQkNERUZHSElKS0xNTk9QUVJTVFVWV1hZWltcXV5fYGFiY2RlZmdobA==";
    
    // Reproduzir o som
    audio.play().catch(e => {
        // Silenciosamente falhar se o navegador bloquear a reprodução automática
        console.log("Reprodução de áudio bloqueada pelo navegador");
    });
}
