(function() {
    // Prevent multiple initializations
    if (window.GrowthAIChatWidgetInitialized) return;
    window.GrowthAIChatWidgetInitialized = true;

    // Load Google Fonts
    const fontLink = document.createElement('link');
    fontLink.rel = 'stylesheet';
    fontLink.href = 'https://fonts.googleapis.com/css2?family=Anton+SC:wght@400&family=Archivo:wght@300;400;500;600;700&display=swap';
    document.head.appendChild(fontLink);

    // Create and inject styles
    const styles = `
        .n8n-chat-widget {
            --chat--color-primary: var(--n8n-chat-primary-color, #FF8000);
            --chat--color-secondary: var(--n8n-chat-secondary-color, #E7BF26);
            --chat--color-background: var(--n8n-chat-background-color, #ffffff);
            --chat--color-font: var(--n8n-chat-font-color, #1B1919);
            font-family: 'Archivo', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }
        
        .n8n-chat-widget .chat-container {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 1000;
            display: none;
            width: 380px;
            height: 600px;
            background: var(--chat--color-background);
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(255, 128, 0, 0.15);
            border: 1px solid rgba(255, 128, 0, 0.2);
            overflow: hidden;
            font-family: inherit;
            opacity: 0;
            transform: translateY(20px) scale(0.95);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
            opacity: 1;
            transform: translateY(0) scale(1);
        }

        .n8n-chat-widget .chat-container.closing {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
        }

        .n8n-chat-widget .brand-header {
            padding: 16px;
            display: flex;
            align-items: center;
            gap: 12px;
            border-bottom: 1px solid rgba(255, 128, 0, 0.1);
            position: relative;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
        }

        .n8n-chat-widget .close-button {
            position: absolute;
            right: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #ffffff;
            cursor: pointer;
            padding: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            font-size: 20px;
            opacity: 0.8;
            font-weight: bold;
        }

        .n8n-chat-widget .close-button:hover {
            opacity: 1;
        }

        .n8n-chat-widget .brand-header span {
            font-size: 18px;
            font-weight: 500;
            color: #ffffff;
            font-family: 'Archivo', sans-serif;
        }

        .n8n-chat-widget .chat-interface {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        .n8n-chat-widget .chat-messages {
            flex: 1;
            overflow-y: auto;
            padding: 20px;
            background: var(--chat--color-background);
            display: flex;
            flex-direction: column;
        }

        .n8n-chat-widget .chat-message {
            padding: 12px 16px;
            margin: 8px 0;
            border-radius: 12px;
            max-width: 80%;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.5;
            font-family: 'Archivo', sans-serif;
        }

        .n8n-chat-widget .chat-message.user {
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: #ffffff;
            align-self: flex-end;
            box-shadow: 0 4px 12px rgba(255, 128, 0, 0.2);
            border: none;
            font-weight: 500;
        }

        .n8n-chat-widget .chat-message.bot {
            background: #f8f9fa;
            border: 1px solid rgba(27, 25, 25, 0.1);
            color: var(--chat--color-font);
            align-self: flex-start;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
            position: relative;
            margin-top: 35px;
            margin-left: 18px;
        }

        .n8n-chat-widget .chat-input {
            padding: 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(255, 128, 0, 0.1);
            display: flex;
            gap: 8px;
        }

        .n8n-chat-widget .chat-input textarea {
            flex: 1;
            padding: 12px;
            border: 1px solid rgba(255, 128, 0, 0.2);
            border-radius: 8px;
            background: var(--chat--color-background);
            color: var(--chat--color-font);
            resize: none;
            font-family: 'Archivo', sans-serif;
            font-size: 14px;
            transition: border-color 0.2s;
        }

        .n8n-chat-widget .chat-input textarea:focus {
            outline: none;
            border-color: var(--chat--color-primary);
        }

        .n8n-chat-widget .chat-input textarea::placeholder {
            color: var(--chat--color-font);
            opacity: 0.6;
        }

        .n8n-chat-widget .chat-input button {
    background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
    color: #ffffff;
    border: none;
    border-radius: 8px;
    padding: 0 20px;
    cursor: pointer;
    transition: transform 0.2s;
    font-family: 'Archivo', sans-serif;
    font-weight: 600;
    height: 100%;
    min-height: 44px;
    align-self: stretch;
}

        .n8n-chat-widget .chat-input button:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 30px;
            background: linear-gradient(135deg, var(--chat--color-primary) 0%, var(--chat--color-secondary) 100%);
            color: #ffffff;
            border: none;
            cursor: pointer;
            box-shadow: 0 4px 12px rgba(255, 128, 0, 0.3);
            z-index: 999;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .n8n-chat-widget .chat-toggle.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-toggle:hover {
            transform: scale(1.05);
        }

        .n8n-chat-widget .chat-toggle.hidden {
            transform: scale(0);
            opacity: 0;
        }

        .n8n-chat-widget .chat-toggle svg {
            width: 24px;
            height: 24px;
            fill: currentColor;
        }

        .n8n-chat-widget .typing-indicator {
            display: flex;
            align-items: center;
            margin: 10px 0;
            padding: 8px 12px;
            background: rgba(255, 128, 0, 0.1);
            border-radius: 12px;
            width: fit-content;
            align-self: flex-start;
            margin-top: 35px;
            margin-left: 18px;
        }

        .n8n-chat-widget .typing-indicator span {
            height: 8px;
            width: 8px;
            margin: 0 2px;
            background-color: var(--chat--color-primary);
            border-radius: 50%;
            display: inline-block;
            opacity: 0.8;
        }

        .n8n-chat-widget .typing-indicator span:nth-child(1) {
            animation: pulse 1s infinite;
        }

        .n8n-chat-widget .typing-indicator span:nth-child(2) {
            animation: pulse 1s infinite 0.2s;
        }

        .n8n-chat-widget .typing-indicator span:nth-child(3) {
            animation: pulse 1s infinite 0.4s;
        }

        @keyframes pulse {
            0% {
                opacity: 0.4;
                transform: scale(1);
            }
            50% {
                opacity: 1;
                transform: scale(1.2);
            }
            100% {
                opacity: 0.4;
                transform: scale(1);
            }
        }

        .n8n-chat-widget .bot-avatar {
            position: absolute;
            top: -30px;
            left: -12px;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background-size: cover;
            background-position: center;
            background-image: url('https://img.icons8.com/?size=512&id=Jz5tDx0gvMMC&format=png');
            border: 2px solid var(--chat--color-primary);
        }

        .n8n-chat-widget .chat-message a {
            color: var(--chat--color-primary);
            text-decoration: underline;
            font-weight: 600;
            transition: color 0.2s;
        }

        .n8n-chat-widget .chat-message a:hover {
            color: var(--chat--color-secondary);
            opacity: 0.8;
        }

        .n8n-chat-widget .initial-message {
    margin: 10px 20px; /* Réduire les marges verticales */
    padding: 8px 12px; /* Réduire le padding */
    background: #f8f9fa;
    border-radius: 8px; /* Réduire le border-radius */
    border-left: 3px solid var(--chat--color-primary); /* Réduire la bordure */
}

.n8n-chat-widget .initial-message h3 {
    margin: 0 0 4px 0; /* Réduire l'espacement sous le titre */
    color: var(--chat--color-font);
    font-family: 'Anton SC', sans-serif;
    font-size: 14px; /* Réduire la taille du titre */
}

.n8n-chat-widget .initial-message p {
    margin: 0;
    color: var(--chat--color-font);
    opacity: 0.8;
    font-size: 12px; /* Réduire la taille du texte */
    line-height: 1.3; /* Réduire l'interligne */
}

        /* Styles pour les messages pré-rédigés */
        .n8n-chat-widget .predefined-messages {
            padding: 16px;
            background: var(--chat--color-background);
            border-bottom: 1px solid rgba(255, 128, 0, 0.1);
        }

        .n8n-chat-widget .predefined-messages-title {
            font-size: 12px;
            color: var(--chat--color-font);
            opacity: 0.7;
            margin-bottom: 12px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .n8n-chat-widget .predefined-message-button {
            display: block;
            width: 100%;
            text-align: left;
            padding: 10px 14px;
            margin-bottom: 8px;
            background: #f8f9fa;
            border: 1px solid rgba(255, 128, 0, 0.15);
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            line-height: 1.4;
            color: var(--chat--color-font);
            font-family: 'Archivo', sans-serif;
            transition: all 0.2s ease;
        }

        .n8n-chat-widget .predefined-message-button:last-child {
            margin-bottom: 0;
        }

        .n8n-chat-widget .predefined-message-button:hover {
            background: linear-gradient(135deg, rgba(255, 128, 0, 0.1) 0%, rgba(231, 191, 38, 0.1) 100%);
            border-color: var(--chat--color-primary);
            transform: translateX(4px);
        }

        .n8n-chat-widget .predefined-message-button:active {
            transform: scale(0.98);
        }

        /* Animation de sortie pour les messages pré-rédigés */
        @keyframes fadeOut {
            0% {
                opacity: 1;
                transform: translateY(0);
            }
            100% {
                opacity: 0;
                transform: translateY(-10px);
            }
        }

        .n8n-chat-widget .predefined-messages.hide {
            animation: fadeOut 0.3s ease forwards;
        }

        /* Animation d'apparition pour les messages du bot */
        @keyframes messageAppear {
            0% {
                opacity: 0;
                transform: translateY(10px);
            }
            100% {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .n8n-chat-widget .chat-message.bot {
            animation: messageAppear 0.3s ease-out;
        }

        .n8n-chat-widget .bot-avatar {
            animation: messageAppear 0.2s ease-out;
        }

        /* Effet curseur clignotant pour l'effet machine à écrire */
        @keyframes blink {
            0%, 50% { opacity: 1; }
            51%, 100% { opacity: 0; }
        }

        .n8n-chat-widget .chat-message.bot.typing::after {
            content: '|';
            animation: blink 1s infinite;
            color: var(--chat--color-primary);
            font-weight: bold;
        }

        /* Popup "Une question ?" */
        .n8n-chat-widget .chat-popup {
            position: fixed;
            bottom: 90px;
            right: 20px;
            background: #DC2626;
            color: #ffffff;
            padding: 12px 20px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            font-family: 'Archivo', sans-serif;
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
            opacity: 0;
            transform: scale(0) translateX(20px);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
            pointer-events: none;
            z-index: 998;
            cursor: pointer;
        }

        .n8n-chat-widget .chat-popup.position-left {
            right: auto;
            left: 20px;
            transform: scale(0) translateX(-20px);
        }

        .n8n-chat-widget .chat-popup.show {
            opacity: 1;
            transform: scale(1) translateX(0);
            pointer-events: auto;
        }

        .n8n-chat-widget .chat-popup::after {
            content: '';
            position: absolute;
            bottom: -8px;
            right: 30px;
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid #DC2626;
        }

        .n8n-chat-widget .chat-popup.position-left::after {
            right: auto;
            left: 30px;
        }

        @keyframes popupBounce {
            0%, 100% { transform: scale(1) translateX(0); }
            50% { transform: scale(1.05) translateX(0); }
        }

        .n8n-chat-widget .chat-popup.show {
            animation: popupBounce 2s ease-in-out infinite;
        }
        .n8n-chat-widget .chat-message strong {
    font-weight: 700;
    color: inherit;
        }
        .n8n-chat-widget .chat-message em {
            font-style: italic;
            color: inherit;
        }

        .n8n-chat-widget .chat-message.bot strong {
            color: var(--chat--color-font);
            font-weight: 700;
        }

        .n8n-chat-widget .chat-message.bot em {
            color: var(--chat--color-font);
            font-style: italic;
        }

        .n8n-chat-widget .chat-footer {
            padding: 8px 16px;
            background: var(--chat--color-background);
            border-top: 1px solid rgba(255, 128, 0, 0.1);
            text-align: center;
            font-size: 11px;
            color: var(--chat--color-font);
            opacity: 0.7;
            font-family: 'Archivo', sans-serif;
        }

        .n8n-chat-widget .chat-footer a {
            color: var(--chat--color-primary);
            text-decoration: none;
            font-weight: 500;
            transition: opacity 0.2s;
        }

        .n8n-chat-widget .chat-footer a:hover {
            opacity: 0.8;
            text-decoration: underline;
        }    
`;

    // Inject styles
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);

    // Default configuration
    const defaultConfig = {
        webhook: {
            url: 'https://n8n.srv749948.hstgr.cloud/webhook/b7ade37a-0d38-4e8a-b2f7-d65e32c32670/chat',
            route: 'general'
        },
        branding: {
            welcomeText: 'Besoin d\'aide ?',
        },
        style: {
            primaryColor: '#FF8000',
            secondaryColor: '#E7BF26',
            position: 'right',
            backgroundColor: '#ffffff',
            fontColor: '#1B1919'
        }
    };

    // Messages pré-rédigés
    const predefinedMessages = [
        "J'aimerais automatiser une tâche dans mon entreprise, par où commencer ?",
        "Quels outils sont compatibles avec votre service ?",
        "Combien coûte une automatisation personnalisée ?",
        "Moi aussi je peux avoir un chatbot comme celui-ci ?! 😍"
    ];

    // Merge user config with defaults
    const config = window.GrowthAIChatConfig ? 
        {
            webhook: { ...defaultConfig.webhook, ...window.GrowthAIChatConfig.webhook },
            branding: { ...defaultConfig.branding, ...window.GrowthAIChatConfig.branding },
            style: { ...defaultConfig.style, ...window.GrowthAIChatConfig.style }
        } : defaultConfig;

    let currentSessionId = '';

    // Create widget container
    const widgetContainer = document.createElement('div');
    widgetContainer.className = 'n8n-chat-widget';
    
    // Set CSS variables for colors
    widgetContainer.style.setProperty('--n8n-chat-primary-color', config.style.primaryColor);
    widgetContainer.style.setProperty('--n8n-chat-secondary-color', config.style.secondaryColor);
    widgetContainer.style.setProperty('--n8n-chat-background-color', config.style.backgroundColor);
    widgetContainer.style.setProperty('--n8n-chat-font-color', config.style.fontColor);
  
    function convertMarkdownToHtml(text) {
    // Juste les conversions de base
    text = text.replace(/\\n/g, '\n');
    text = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
    text = text.replace(/\n/g, '<br>');
    
    return text;
}
    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <button class="close-button">×</button>
            </div>
            <div class="initial-message">
                <h3>${config.branding.welcomeText}</h3>
                <p>Je suis là pour vous aider avec vos questions !</p>
            </div>
            <div class="predefined-messages">
                <div class="predefined-messages-title">Questions fréquentes</div>
                ${predefinedMessages.map(msg => 
                    `<button class="predefined-message-button">${msg}</button>`
                ).join('')}
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Posez votre question..." rows="1"></textarea>
                <button type="submit">Envoyer</button>
            </div> 
             <div class="chat-footer">
            Propulsé par <a href="https://agencen8n.com" target="_blank">Growth-AI</a>
            </div>
        </div>
    `;
    
    chatContainer.innerHTML = chatInterfaceHTML;
    
    const toggleButton = document.createElement('button');
    toggleButton.className = `chat-toggle${config.style.position === 'left' ? ' position-left' : ''}`;
    toggleButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.476 0-2.886-.313-4.156-.878l-3.156.586.586-3.156A7.962 7.962 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/>
        </svg>`;
    
    // Créer le popup "Une question ?"
    const chatPopup = document.createElement('div');
    chatPopup.className = `chat-popup${config.style.position === 'left' ? ' position-left' : ''}`;
    chatPopup.textContent = 'Une question ?';
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    widgetContainer.appendChild(chatPopup);
    document.body.appendChild(widgetContainer);
    // Ouvrir automatiquement le chatbot au chargement
setTimeout(() => {
    chatContainer.style.display = 'flex';
    void chatContainer.offsetWidth; // Force reflow
    chatContainer.classList.add('open');
    chatHasBeenOpened = true;
}, 500); // Attendre 500ms pour une apparition fluide

    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');
    const predefinedMessagesContainer = chatContainer.querySelector('.predefined-messages');

    function generateUUID() {
        return crypto.randomUUID();
    }

    // Initialiser la session automatiquement lors de l'ouverture
    async function initializeSession() {
        if (!currentSessionId) {
            currentSessionId = generateUUID();
            
            const data = [{
                action: "loadPreviousSession",
                sessionId: currentSessionId,
                route: config.webhook.route,
                metadata: {
                    userId: ""
                }
            }];

            try {
                const response = await fetch(config.webhook.url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const responseData = await response.json();
                console.log('Session initialized:', responseData);
            } catch (error) {
                console.error('Error initializing session:', error);
            }
        }
    }

    // Fonction pour masquer les messages pré-rédigés
    function hidePredefinedMessages() {
    if (predefinedMessagesContainer && !predefinedMessagesContainer.classList.contains('hide')) {
        predefinedMessagesContainer.style.display = 'none';
    }
}

    // Fonction pour créer l'effet machine à écrire
    function typeWriter(element, htmlText, speed = 30) {
    let index = 0;
    const parentDiv = element.parentElement;
    parentDiv.classList.add('typing');
    element.innerHTML = '';
    
    // Convertir le HTML en texte visible + balises cachées
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlText;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    function type() {
        if (index < textContent.length) {
            // Récupérer le texte partiel
            const partialText = textContent.substring(0, index + 1);
            
            // Reconstruire le HTML avec le texte partiel
            let currentHtml = htmlText;
            
            // Remplacer le contenu textuel par le texte partiel
            const regex = /^(.*?)([^<>]*?)$/;
            let tempElement = document.createElement('div');
            tempElement.innerHTML = htmlText;
            
            // Méthode simple : injecter caractère par caractère en préservant les balises
            updateElementWithPartialText(element, htmlText, index + 1);
            
            index++;
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            setTimeout(type, speed);
        } else {
            parentDiv.classList.remove('typing');
        }
    }
    
    function updateElementWithPartialText(elem, fullHtml, charCount) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = fullHtml;
        
        let currentCount = 0;
        processNode(tempDiv, charCount);
        elem.innerHTML = tempDiv.innerHTML;
        
        function processNode(node, targetCount) {
            for (let i = 0; i < node.childNodes.length; i++) {
                const child = node.childNodes[i];
                
                if (child.nodeType === Node.TEXT_NODE) {
                    const textLength = child.textContent.length;
                    if (currentCount + textLength <= targetCount) {
                        currentCount += textLength;
                    } else {
                        const remainingChars = targetCount - currentCount;
                        child.textContent = child.textContent.substring(0, remainingChars);
                        currentCount = targetCount;
                        // Supprimer les nœuds suivants
                        while (node.childNodes[i + 1]) {
                            node.removeChild(node.childNodes[i + 1]);
                        }
                        return;
                    }
                } else if (child.nodeType === Node.ELEMENT_NODE) {
                    const textInElement = child.textContent.length;
                    if (currentCount + textInElement <= targetCount) {
                        currentCount += textInElement;
                    } else {
                        processNode(child, targetCount);
                        // Supprimer les nœuds suivants
                        while (node.childNodes[i + 1]) {
                            node.removeChild(node.childNodes[i + 1]);
                        }
                        return;
                    }
                }
                
                if (currentCount >= targetCount) {
                    // Supprimer les nœuds suivants
                    while (node.childNodes[i + 1]) {
                        node.removeChild(node.childNodes[i + 1]);
                    }
                    return;
                }
            }
        }
    }
    
    type();
}

    async function sendMessage(message) {
    await initializeSession();

    const messageData = {
        action: "sendMessage",
        sessionId: currentSessionId,
        route: config.webhook.route,
        chatInput: message,
        metadata: {
            userId: ""
        }
    };
    
    const userMessageDiv = document.createElement('div');
    userMessageDiv.className = 'chat-message user';
    userMessageDiv.textContent = message;
    messagesContainer.appendChild(userMessageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    const typingIndicator = document.createElement('div');
    typingIndicator.className = 'typing-indicator';
    typingIndicator.innerHTML = '<span></span><span></span><span></span>';
    messagesContainer.appendChild(typingIndicator);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;

    try {
        const response = await fetch(config.webhook.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });
        
        const data = await response.json();
        
        console.log("Response data:", data); // Pour debug
        
        // TRAITER LA RÉPONSE MÊME SI ERREUR 500
        messagesContainer.removeChild(typingIndicator);
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'bot-avatar';
        botMessageDiv.appendChild(avatarDiv);
        
        // Créer un conteneur pour le texte
        const textContainer = document.createElement('span');
        botMessageDiv.appendChild(textContainer);
        
        let messageText = Array.isArray(data) ? data[0].output : data.output;
        
        // Ajouter le message au DOM avant l'animation
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        if (messageText.trim().startsWith('<html>') && messageText.trim().endsWith('</html>')) {
            messageText = messageText.replace(/<html>|<\/html>/g, '').trim();
            typeWriter(textContainer, messageText, 20);
        } else {
            messageText = convertMarkdownToHtml(messageText);
            typeWriter(textContainer, messageText, 20);
        }
        
    } catch (error) {
        console.error('Vraie erreur réseau:', error);
        
        if (messagesContainer.contains(typingIndicator)) {
            messagesContainer.removeChild(typingIndicator);
        }
        
        const errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'chat-message bot';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'bot-avatar';
        errorMessageDiv.appendChild(avatarDiv);
        
        // Créer un conteneur pour le texte
        const textContainer = document.createElement('span');
        errorMessageDiv.appendChild(textContainer);
        
        messagesContainer.appendChild(errorMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // Animer le message d'erreur
        typeWriter(textContainer, "Désolé, une erreur est survenue. Veuillez réessayer.", 20);
    }
}
async function sendMessageBackground(message, existingTypingIndicator) {
    await initializeSession();

    const messageData = {
        action: "sendMessage",
        sessionId: currentSessionId,
        route: config.webhook.route,
        chatInput: message,
        metadata: {
            userId: ""
        }
    };

    try {
        const response = await fetch(config.webhook.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(messageData)
        });
        
        const data = await response.json();
        
        console.log("Response data:", data);
        
        // Supprimer le typing indicator existant
        if (messagesContainer.contains(existingTypingIndicator)) {
            messagesContainer.removeChild(existingTypingIndicator);
        }
        
        const botMessageDiv = document.createElement('div');
        botMessageDiv.className = 'chat-message bot';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'bot-avatar';
        botMessageDiv.appendChild(avatarDiv);
        
        const textContainer = document.createElement('span');
        botMessageDiv.appendChild(textContainer);
        
        let messageText = Array.isArray(data) ? data[0].output : data.output;
        
        messagesContainer.appendChild(botMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        if (messageText.trim().startsWith('<html>') && messageText.trim().endsWith('</html>')) {
            messageText = messageText.replace(/<html>|<\/html>/g, '').trim();
            typeWriter(textContainer, messageText, 20);
        } else {
            messageText = convertMarkdownToHtml(messageText);
            typeWriter(textContainer, messageText, 20);
        }
        
    } catch (error) {
        console.error('Erreur réseau:', error);
        
        if (messagesContainer.contains(existingTypingIndicator)) {
            messagesContainer.removeChild(existingTypingIndicator);
        }
        
        // Afficher message d'erreur...
        const errorMessageDiv = document.createElement('div');
        errorMessageDiv.className = 'chat-message bot';
        
        const avatarDiv = document.createElement('div');
        avatarDiv.className = 'bot-avatar';
        errorMessageDiv.appendChild(avatarDiv);
        
        const textContainer = document.createElement('span');
        errorMessageDiv.appendChild(textContainer);
        
        messagesContainer.appendChild(errorMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        typeWriter(textContainer, "Désolé, une erreur est survenue. Veuillez réessayer.", 20);
    }
}


// Gestionnaire pour les messages pré-rédigés
const predefinedMessageButtons = chatContainer.querySelectorAll('.predefined-message-button');
predefinedMessageButtons.forEach(button => {
    button.addEventListener('click', () => {
        const message = button.textContent;
        
        // 1. Masquer immédiatement les messages pré-remplis
        hidePredefinedMessages();
        
        // 2. Afficher immédiatement le message utilisateur
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'chat-message user';
        userMessageDiv.textContent = message;
        messagesContainer.appendChild(userMessageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 3. Afficher immédiatement l'indicateur "typing"
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        messagesContainer.appendChild(typingIndicator);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        // 4. Envoyer la requête en arrière-plan
        sendMessageBackground(message, typingIndicator);
    });
});

    sendButton.addEventListener('click', () => {
        const message = textarea.value.trim();
        if (message) {
            sendMessage(message);
            textarea.value = '';
        }
    });
    
    textarea.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const message = textarea.value.trim();
            if (message) {
                sendMessage(message);
                textarea.value = '';
            }
        }
    });
    
    toggleButton.addEventListener('click', () => {
    if (chatContainer.classList.contains('open')) {
        // Fermeture
        chatContainer.classList.add('closing');
        toggleButton.classList.add('hidden');
        
        setTimeout(() => {
            chatContainer.classList.remove('open', 'closing');
            chatContainer.style.display = 'none';
            toggleButton.classList.remove('hidden');
            
            // Afficher le popup après fermeture
            handlePopupDisplay();
        }, 300);
    } else {
        // Ouverture
        chatContainer.style.display = 'flex';
        toggleButton.classList.add('hidden');
        
        // Force reflow pour que l'animation fonctionne
        void chatContainer.offsetWidth;
        
        chatContainer.classList.add('open');
        chatHasBeenOpened = true;
        
        // Masquer le popup lors de l'ouverture
        chatPopup.classList.remove('show');
        
        setTimeout(() => {
            toggleButton.classList.remove('hidden');
        }, 100);
    }
});

    const closeButton = chatContainer.querySelector('.close-button');
closeButton.addEventListener('click', () => {
    chatContainer.classList.add('closing');
    toggleButton.classList.add('hidden');
    
    setTimeout(() => {
        chatContainer.classList.remove('open', 'closing');
        chatContainer.style.display = 'none';
        toggleButton.classList.remove('hidden');
        
        // Afficher le popup après fermeture
        handlePopupDisplay();
    }, 300);
});

    // Variable pour suivre si le chat a déjà été ouvert
let chatHasBeenOpened = false;

// Fonction pour gérer l'affichage du popup
function handlePopupDisplay() {
    if (!chatContainer.classList.contains('open')) {
        // Afficher le popup avec un petit délai après fermeture
        setTimeout(() => {
            if (!chatContainer.classList.contains('open')) {
                chatPopup.classList.add('show');
            }
        }, 1000); // 1 seconde après fermeture
    } else {
        // Masquer le popup si le chat est ouvert
        chatPopup.classList.remove('show');
    }
}

// Afficher le popup initial après ouverture automatique (si fermé)
setTimeout(() => {
    handlePopupDisplay();
}, 2000); // Après que l'auto-ouverture soit terminée

    // Masquer le popup si on clique dessus ou sur le bouton
    chatPopup.addEventListener('click', () => {
        toggleButton.click();
    });

    // Modifier le gestionnaire du bouton toggle pour gérer le popup
    const originalToggleHandler = toggleButton.onclick;
    toggleButton.addEventListener('click', () => {
        chatHasBeenOpened = true;
        chatPopup.classList.remove('show');
    });
})();