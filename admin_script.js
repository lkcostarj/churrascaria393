// Variáveis globais
let currentUser = null;
let currentSection = 'dashboard';
let whatsappNumbers = [];
let defaultMessageTemplate = "Olá! Recebemos seu pedido da Rota 393 Churrascaria:\n\n*Itens:*\n{items}\n\n*Observações:* {observation}\n\n*Endereço de entrega:* {address}\n\n*Forma de pagamento:* {payment} {change}\n\n*Total:* {total}\n\nAgradecemos sua preferência! Seu pedido está sendo preparado e logo será enviado.";

// Credenciais de teste (em produção, isso seria validado no servidor)
const testCredentials = {
    username: 'admin',
    password: 'admin123'
};

// Inicialização
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar eventos de login
    initLoginEvents();
    
    // Inicializar navegação
    initNavigation();
    
    // Inicializar eventos de upload
    initUploadEvents();
    
    // Inicializar eventos de mensagem
    initMessageEvents();
    
    // Inicializar eventos de WhatsApp
    initWhatsAppEvents();
    
    // Inicializar eventos de configurações
    initSettingsEvents();
    
    // Carregar dados salvos (simulação)
    loadSavedData();
});

// Funções de Login
function initLoginEvents() {
    const loginForm = document.getElementById('login-form');
    
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        // Validação simples (em produção, isso seria feito no servidor)
        if (username === testCredentials.username && password === testCredentials.password) {
            currentUser = username;
            showAdminPanel();
        } else {
            document.getElementById('login-error').textContent = 'Usuário ou senha incorretos';
        }
    });
}

function showAdminPanel() {
    document.getElementById('login-container').style.display = 'none';
    document.getElementById('admin-container').style.display = 'flex';
    
    // Mostrar notificação de boas-vindas
    showNotification('Bem-vindo ao Painel Administrativo!', 'success');
}

// Funções de Navegação
function initNavigation() {
    const navItems = document.querySelectorAll('.nav-item:not(.logout)');
    const logoutButton = document.querySelector('.nav-item.logout');
    const toggleSidebar = document.querySelector('.toggle-sidebar');
    
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetSection = item.getAttribute('data-target');
            changeSection(targetSection);
            
            // Atualizar item ativo
            navItems.forEach(navItem => navItem.classList.remove('active'));
            item.classList.add('active');
            
            // Em dispositivos móveis, fechar o menu após a seleção
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('active');
            }
        });
    });
    
    logoutButton.addEventListener('click', () => {
        logout();
    });
    
    toggleSidebar.addEventListener('click', () => {
        document.querySelector('.sidebar').classList.toggle('active');
    });
}

function changeSection(section) {
    currentSection = section;
    
    // Esconder todas as seções
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Mostrar a seção selecionada
    document.getElementById(`${section}-section`).classList.add('active');
}

function logout() {
    currentUser = null;
    document.getElementById('admin-container').style.display = 'none';
    document.getElementById('login-container').style.display = 'flex';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('login-error').textContent = '';
}

// Funções de Upload
function initUploadEvents() {
    // Background upload
    const backgroundUpload = document.getElementById('background-upload');
    const backgroundPreview = document.getElementById('background-preview');
    const backgroundPlaceholder = document.getElementById('background-placeholder');
    const saveBackgroundBtn = document.getElementById('save-background');
    const removeBackgroundBtn = document.getElementById('remove-background');
    
    backgroundUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                backgroundPreview.src = event.target.result;
                backgroundPreview.style.display = 'block';
                backgroundPlaceholder.style.display = 'none';
                saveBackgroundBtn.disabled = false;
                removeBackgroundBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });
    
    saveBackgroundBtn.addEventListener('click', () => {
        // Simulação de salvamento (em produção, isso enviaria para o servidor)
        localStorage.setItem('background-image', backgroundPreview.src);
        showNotification('Imagem de fundo salva com sucesso!', 'success');
    });
    
    removeBackgroundBtn.addEventListener('click', () => {
        backgroundPreview.src = '';
        backgroundPreview.style.display = 'none';
        backgroundPlaceholder.style.display = 'block';
        saveBackgroundBtn.disabled = true;
        removeBackgroundBtn.disabled = true;
        localStorage.removeItem('background-image');
        showNotification('Imagem de fundo removida!', 'success');
    });
    
    // Logo upload
    const logoUpload = document.getElementById('logo-upload');
    const logoPreview = document.getElementById('logo-preview');
    const saveLogoBtn = document.getElementById('save-logo');
    const removeLogoBtn = document.getElementById('remove-logo');
    
    logoUpload.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                logoPreview.src = event.target.result;
                saveLogoBtn.disabled = false;
                removeLogoBtn.disabled = false;
            };
            reader.readAsDataURL(file);
        }
    });
    
    saveLogoBtn.addEventListener('click', () => {
        // Simulação de salvamento (em produção, isso enviaria para o servidor)
        localStorage.setItem('logo-image', logoPreview.src);
        showNotification('Logo salva com sucesso!', 'success');
    });
    
    removeLogoBtn.addEventListener('click', () => {
        logoPreview.src = 'logo_web.png';
        saveLogoBtn.disabled = true;
        removeLogoBtn.disabled = true;
        localStorage.removeItem('logo-image');
        showNotification('Logo restaurada para o padrão!', 'success');
    });
}

// Funções de Mensagem
function initMessageEvents() {
    const messageTemplate = document.getElementById('message-template');
    const messagePreview = document.getElementById('message-preview');
    const previewMessageBtn = document.getElementById('preview-message');
    const saveMessageBtn = document.getElementById('save-message');
    const resetMessageBtn = document.getElementById('reset-message');
    
    // Carregar template padrão
    messageTemplate.value = localStorage.getItem('message-template') || defaultMessageTemplate;
    
    previewMessageBtn.addEventListener('click', () => {
        const template = messageTemplate.value;
        const previewData = {
            items: '1x Arroz tradicional\n1x Farofa\n1x Feijão\n1x Batata frita\n1x Alface e tomate\n1x Pastel carne',
            total: 'R$ 24,90',
            address: 'Rua Exemplo, 123 - Bairro, Cidade',
            payment: 'Dinheiro',
            change: '(Troco para R$ 50,00)',
            observation: 'Sem cebola, por favor.'
        };
        
        // Substituir variáveis
        let previewText = template;
        for (const [key, value] of Object.entries(previewData)) {
            previewText = previewText.replace(new RegExp(`{${key}}`, 'g'), value);
        }
        
        messagePreview.textContent = previewText;
    });
    
    saveMessageBtn.addEventListener('click', () => {
        localStorage.setItem('message-template', messageTemplate.value);
        showNotification('Template de mensagem salvo com sucesso!', 'success');
    });
    
    resetMessageBtn.addEventListener('click', () => {
        messageTemplate.value = defaultMessageTemplate;
        localStorage.setItem('message-template', defaultMessageTemplate);
        showNotification('Template de mensagem restaurado para o padrão!', 'success');
    });
}

// Funções de WhatsApp
function initWhatsAppEvents() {
    const whatsappList = document.getElementById('whatsapp-list');
    const numberInput = document.getElementById('number-input');
    const numberName = document.getElementById('number-name');
    const numberType = document.getElementById('number-type');
    const defaultNumber = document.getElementById('default-number');
    const addNumberBtn = document.getElementById('add-number');
    
    // Adicionar número inicial se não houver nenhum
    if (whatsappNumbers.length === 0) {
        whatsappNumbers.push({
            id: 1,
            number: '24998665908',
            name: 'Pedidos Gerais',
            type: 'all',
            isDefault: true
        });
        
        saveWhatsAppNumbers();
    }
    
    // Renderizar lista de números
    renderWhatsAppNumbers();
    
    addNumberBtn.addEventListener('click', () => {
        const number = numberInput.value.trim();
        const name = numberName.value.trim();
        const type = numberType.value;
        const isDefault = defaultNumber.checked;
        
        if (!number || !name) {
            showNotification('Preencha todos os campos!', 'error');
            return;
        }
        
        // Validar formato do número
        if (!/^\d+$/.test(number)) {
            showNotification('O número deve conter apenas dígitos!', 'error');
            return;
        }
        
        // Gerar ID único
        const id = Date.now();
        
        // Se for definido como padrão, remover padrão dos outros
        if (isDefault) {
            whatsappNumbers.forEach(item => {
                item.isDefault = false;
            });
        }
        
        // Adicionar novo número
        whatsappNumbers.push({
            id,
            number,
            name,
            type,
            isDefault
        });
        
        // Se for o primeiro número, definir como padrão
        if (whatsappNumbers.length === 1) {
            whatsappNumbers[0].isDefault = true;
        }
        
        // Salvar e renderizar
        saveWhatsAppNumbers();
        renderWhatsAppNumbers();
        
        // Limpar campos
        numberInput.value = '';
        numberName.value = '';
        numberType.value = 'all';
        defaultNumber.checked = false;
        
        showNotification('Número de WhatsApp adicionado com sucesso!', 'success');
    });
}

function renderWhatsAppNumbers() {
    const whatsappList = document.getElementById('whatsapp-list');
    whatsappList.innerHTML = '';
    
    if (whatsappNumbers.length === 0) {
        whatsappList.innerHTML = '<p>Nenhum número cadastrado.</p>';
        return;
    }
    
    whatsappNumbers.forEach(item => {
        const whatsappItem = document.createElement('div');
        whatsappItem.className = 'whatsapp-item';
        whatsappItem.innerHTML = `
            <div class="whatsapp-info">
                <h4>
                    ${item.name}
                    ${item.isDefault ? '<span class="default-badge">Padrão</span>' : ''}
                </h4>
                <p>${item.number} (${getTypeLabel(item.type)})</p>
            </div>
            <div class="whatsapp-actions">
                <button class="edit-btn" data-id="${item.id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${item.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        whatsappList.appendChild(whatsappItem);
    });
    
    // Adicionar eventos aos botões
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            deleteWhatsAppNumber(id);
        });
    });
    
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.getAttribute('data-id'));
            editWhatsAppNumber(id);
        });
    });
}

function getTypeLabel(type) {
    switch (type) {
        case 'all':
            return 'Todos os pedidos';
        case 'delivery':
            return 'Apenas Delivery';
        case 'pickup':
            return 'Apenas Retirada';
        default:
            return 'Desconhecido';
    }
}

function deleteWhatsAppNumber(id) {
    // Encontrar índice do número
    const index = whatsappNumbers.findIndex(item => item.id === id);
    
    if (index === -1) return;
    
    // Verificar se é o número padrão
    const isDefault = whatsappNumbers[index].isDefault;
    
    // Remover número
    whatsappNumbers.splice(index, 1);
    
    // Se era o padrão e ainda há outros números, definir o primeiro como padrão
    if (isDefault && whatsappNumbers.length > 0) {
        whatsappNumbers[0].isDefault = true;
    }
    
    // Salvar e renderizar
    saveWhatsAppNumbers();
    renderWhatsAppNumbers();
    
    showNotification('Número de WhatsApp removido!', 'success');
}

function editWhatsAppNumber(id) {
    // Encontrar número
    const number = whatsappNumbers.find(item => item.id === id);
    
    if (!number) return;
    
    // Preencher campos
    document.getElementById('number-input').value = number.number;
    document.getElementById('number-name').value = number.name;
    document.getElementById('number-type').value = number.type;
    document.getElementById('default-number').checked = number.isDefault;
    
    // Remover número
    deleteWhatsAppNumber(id);
    
    // Focar no campo de número
    document.getElementById('number-input').focus();
    
    showNotification('Edite o número e clique em Adicionar para salvar as alterações', 'success');
}

function saveWhatsAppNumbers() {
    localStorage.setItem('whatsapp-numbers', JSON.stringify(whatsappNumbers));
}

// Funções de Configurações
function initSettingsEvents() {
    const passwordForm = document.getElementById('password-form');
    const establishmentForm = document.getElementById('establishment-form');
    
    passwordForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const currentPassword = document.getElementById('current-password').value;
        const newPassword = document.getElementById('new-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;
        
        // Validar senha atual
        if (currentPassword !== testCredentials.password) {
            showNotification('Senha atual incorreta!', 'error');
            return;
        }
        
        // Validar nova senha
        if (newPassword !== confirmPassword) {
            showNotification('As senhas não coincidem!', 'error');
            return;
        }
        
        // Atualizar senha (em produção, isso seria feito no servidor)
        testCredentials.password = newPassword;
        
        // Limpar campos
        document.getElementById('current-password').value = '';
        document.getElementById('new-password').value = '';
        document.getElementById('confirm-password').value = '';
        
        showNotification('Senha alterada com sucesso!', 'success');
    });
    
    establishmentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('establishment-name').value;
        const address = document.getElementById('establishment-address').value;
        const phone = document.getElementById('establishment-phone').value;
        
        // Salvar informações
        localStorage.setItem('establishment-name', name);
        localStorage.setItem('establishment-address', address);
        localStorage.setItem('establishment-phone', phone);
        
        showNotification('Informações do estabelecimento salvas com sucesso!', 'success');
    });
}

// Funções de Notificação
function showNotification(message, type = 'success') {
    const notification = document.getElementById('notification');
    const notificationIcon = notification.querySelector('.notification-icon');
    const notificationMessage = notification.querySelector('.notification-message');
    
    // Definir ícone
    if (type === 'success') {
        notificationIcon.className = 'notification-icon fas fa-check-circle';
        notification.className = 'notification show success';
    } else {
        notificationIcon.className = 'notification-icon fas fa-exclamation-circle';
        notification.className = 'notification show error';
    }
    
    // Definir mensagem
    notificationMessage.textContent = message;
    
    // Mostrar notificação
    notification.classList.add('show');
    
    // Esconder após 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
    }, 3000);
    
    // Adicionar evento para fechar
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
    });
}

// Carregar dados salvos
function loadSavedData() {
    // Carregar imagem de fundo
    const backgroundImage = localStorage.getItem('background-image');
    if (backgroundImage) {
        const backgroundPreview = document.getElementById('background-preview');
        const backgroundPlaceholder = document.getElementById('background-placeholder');
        const saveBackgroundBtn = document.getElementById('save-background');
        const removeBackgroundBtn = document.getElementById('remove-background');
        
        backgroundPreview.src = backgroundImage;
        backgroundPreview.style.display = 'block';
        backgroundPlaceholder.style.display = 'none';
        saveBackgroundBtn.disabled = false;
        removeBackgroundBtn.disabled = false;
    }
    
    // Carregar logo
    const logoImage = localStorage.getItem('logo-image');
    if (logoImage) {
        const logoPreview = document.getElementById('logo-preview');
        const saveLogoBtn = document.getElementById('save-logo');
        const removeLogoBtn = document.getElementById('remove-logo');
        
        logoPreview.src = logoImage;
        saveLogoBtn.disabled = false;
        removeLogoBtn.disabled = false;
    }
    
    // Carregar template de mensagem
    const messageTemplate = localStorage.getItem('message-template');
    if (messageTemplate) {
        document.getElementById('message-template').value = messageTemplate;
    }
    
    // Carregar números de WhatsApp
    const savedNumbers = localStorage.getItem('whatsapp-numbers');
    if (savedNumbers) {
        whatsappNumbers = JSON.parse(savedNumbers);
        renderWhatsAppNumbers();
    }
    
    // Carregar informações do estabelecimento
    const establishmentName = localStorage.getItem('establishment-name');
    const establishmentAddress = localStorage.getItem('establishment-address');
    const establishmentPhone = localStorage.getItem('establishment-phone');
    
    if (establishmentName) {
        document.getElementById('establishment-name').value = establishmentName;
    }
    
    if (establishmentAddress) {
        document.getElementById('establishment-address').value = establishmentAddress;
    }
    
    if (establishmentPhone) {
        document.getElementById('establishment-phone').value = establishmentPhone;
    }
}
