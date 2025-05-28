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
        }

        .n8n-chat-widget .chat-container.position-left {
            right: auto;
            left: 20px;
        }

        .n8n-chat-widget .chat-container.open {
            display: flex;
            flex-direction: column;
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
            transition: transform 0.3s;
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
            margin: 20px;
            padding: 16px;
            background: #f8f9fa;
            border-radius: 12px;
            border-left: 4px solid var(--chat--color-primary);
        }

        .n8n-chat-widget .initial-message h3 {
            margin: 0 0 8px 0;
            color: var(--chat--color-font);
            font-family: 'Anton SC', sans-serif;
            font-size: 16px;
        }

        .n8n-chat-widget .initial-message p {
            margin: 0;
            color: var(--chat--color-font);
            opacity: 0.8;
            font-size: 14px;
            line-height: 1.4;
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
            name: 'Growth.ai',
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
  
    function convertMarkdownLinksToHtml(text) {
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        return text.replace(markdownLinkRegex, '<a href="$2" target="_blank">$1</a>');
    }

    const chatContainer = document.createElement('div');
    chatContainer.className = `chat-container${config.style.position === 'left' ? ' position-left' : ''}`;
    
    const chatInterfaceHTML = `
        <div class="chat-interface">
            <div class="brand-header">
                <span>${config.branding.name}</span>
                <button class="close-button">×</button>
            </div>
            <div class="initial-message">
                <h3>${config.branding.welcomeText}</h3>
                <p>Je suis là pour vous aider avec vos questions. N'hésitez pas à me poser votre question !</p>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <textarea placeholder="Posez votre question..." rows="1"></textarea>
                <button type="submit">Envoyer</button>
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
    
    widgetContainer.appendChild(chatContainer);
    widgetContainer.appendChild(toggleButton);
    document.body.appendChild(widgetContainer);

    const chatInterface = chatContainer.querySelector('.chat-interface');
    const messagesContainer = chatContainer.querySelector('.chat-messages');
    const textarea = chatContainer.querySelector('textarea');
    const sendButton = chatContainer.querySelector('button[type="submit"]');

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
            
            messagesContainer.removeChild(typingIndicator);
            const botMessageDiv = document.createElement('div');
            botMessageDiv.className = 'chat-message bot';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            botMessageDiv.appendChild(avatarDiv);
            
            let messageText = Array.isArray(data) ? data[0].output : data.output;
            
            if (messageText.trim().startsWith('<html>') && messageText.trim().endsWith('</html>')) {
                messageText = messageText.replace(/<html>|<\/html>/g, '').trim();
                botMessageDiv.innerHTML += messageText;
            } else {
                messageText = convertMarkdownLinksToHtml(messageText);
                messageText = messageText.replace(/\\n/g, '<br>');
                messageText = messageText.replace(/\n/g, '<br>');
                botMessageDiv.innerHTML += messageText;
            }
            
            messagesContainer.appendChild(botMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        } catch (error) {
            console.error('Error:', error);
            
            if (messagesContainer.contains(typingIndicator)) {
                messagesContainer.removeChild(typingIndicator);
            }
            
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'chat-message bot';
            
            const avatarDiv = document.createElement('div');
            avatarDiv.className = 'bot-avatar';
            errorMessageDiv.appendChild(avatarDiv);
            
            errorMessageDiv.innerHTML += "Désolé, une erreur est survenue. Veuillez réessayer.";
            messagesContainer.appendChild(errorMessageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
    }

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
        chatContainer.classList.toggle('open');
    });

    const closeButton = chatContainer.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        chatContainer.classList.remove('open');
    });
})();