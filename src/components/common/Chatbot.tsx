import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, RefreshCw, Wifi, WifiOff } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

// Fallback responses when Ollama is not available
const getFallbackResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  const symptomMap: { keywords: string[]; response: string }[] = [
    {
      keywords: ['chest pain', 'heart', 'palpitation'],
      response: "Based on your symptoms, I recommend consulting a **Cardiologist** 🏥\n\n👨‍⚕️ Department: Cardiology\n\n💡 Please avoid physical exertion and book an appointment soon!"
    },
    {
      keywords: ['headache', 'migraine', 'dizziness'],
      response: "Based on your symptoms, I recommend consulting a **Neurologist** 🏥\n\n👨‍⚕️ Department: Neurology\n\n💡 Rest in a quiet place and avoid screens."
    },
    {
      keywords: ['stomach', 'digestion', 'vomiting', 'diarrhea'],
      response: "Based on your symptoms, I recommend consulting a **Gastroenterologist** 🏥\n\n👨‍⚕️ Department: Gastroenterology\n\n💡 Stay hydrated and eat light foods."
    },
    {
      keywords: ['fever', 'cold', 'cough', 'flu'],
      response: "Based on your symptoms, I recommend consulting a **General Physician** 🏥\n\n👨‍⚕️ Department: General Medicine\n\n💡 Rest well and drink plenty of fluids."
    },
    {
      keywords: ['skin', 'rash', 'acne', 'allergy'],
      response: "Based on your symptoms, I recommend consulting a **Dermatologist** 🏥\n\n👨‍⚕️ Department: Dermatology\n\n💡 Keep the area clean and avoid scratching."
    }
  ];

  for (const item of symptomMap) {
    if (item.keywords.some(k => lowerMessage.includes(k))) {
      return item.response;
    }
  }

  return "I understand you're describing symptoms. For a proper assessment, please describe your symptoms in more detail or book an appointment with our General Physician who can guide you to the right specialist. 😊";
};

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! 👋 I'm your AI Hospital Assistant powered by Llama. Tell me your symptoms and I'll suggest the right doctor for you.\n\nFor example: \"I have chest pain\" or \"My child has fever\"",
      isBot: true,
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [ollamaStatus, setOllamaStatus] = useState<'online' | 'offline' | 'checking'>('checking');
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Check Ollama status on mount
  useEffect(() => {
    checkOllamaStatus();
  }, []);

  const checkOllamaStatus = async () => {
    setOllamaStatus('checking');
    try {
      const res = await fetch('http://localhost:5000/api/chatbot/status');
      const data = await res.json();
      setOllamaStatus(data.status === 'online' && data.hasLlama ? 'online' : 'offline');
    } catch {
      setOllamaStatus('offline');
    }
  };

  const sendToOllama = async (userMessage: string): Promise<string> => {
    try {
      // Create abort controller for 10 second timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 10000);

      const res = await fetch('http://localhost:5000/api/chatbot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({ message: userMessage, sessionId })
      });

      clearTimeout(timeout);

      const data = await res.json();

      if (data.fallback || !res.ok) {
        // Use fallback if Ollama not available
        setOllamaStatus('offline');
        return getFallbackResponse(userMessage);
      }

      setOllamaStatus('online');
      return data.response;
    } catch (error: any) {
      console.error('Chatbot error:', error);
      
      // If timeout, use fallback
      if (error.name === 'AbortError') {
        return getFallbackResponse(userMessage) + "\n\n⚡ *Quick response (AI was slow)*";
      }
      
      setOllamaStatus('offline');
      return getFallbackResponse(userMessage);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: input,
      isBot: false,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const userInput = input;
    setInput('');
    setIsTyping(true);

    try {
      const botResponse = await sendToOllama(userInput);
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I encountered an error. Please try again.",
        isBot: true,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const clearChat = async () => {
    try {
      await fetch('http://localhost:5000/api/chatbot/clear', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId })
      });
    } catch {}
    
    setMessages([{
      id: 1,
      text: "Hello! 👋 Chat cleared. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }]);
  };

  return (
    <>
      {/* Floating Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-primary hover:bg-secondary'
        }`}
      >
        {isOpen ? (
          <X className="h-6 w-6 text-white" />
        ) : (
          <MessageCircle className="h-6 w-6 text-white" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 flex h-[500px] w-[380px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
          {/* Header */}
          <div className="bg-primary px-4 py-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
                  <Bot className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold">Hospital AI Assistant</h3>
                  <div className="flex items-center gap-1 text-xs">
                    {ollamaStatus === 'online' ? (
                      <>
                        <Wifi className="h-3 w-3 text-green-400" />
                        <span className="text-green-400">TinyLlama AI Online</span>
                      </>
                    ) : ollamaStatus === 'checking' ? (
                      <>
                        <RefreshCw className="h-3 w-3 animate-spin text-yellow-400" />
                        <span className="text-yellow-400">Connecting...</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 text-red-400" />
                        <span className="text-red-400">Basic Mode</span>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <button
                onClick={clearChat}
                className="rounded-full p-2 hover:bg-white/20"
                title="Clear chat"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto bg-gray-50 p-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`mb-4 flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`flex max-w-[85%] gap-2 ${message.isBot ? 'flex-row' : 'flex-row-reverse'}`}
                >
                  <div
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                      message.isBot ? 'bg-primary' : 'bg-secondary'
                    }`}
                  >
                    {message.isBot ? (
                      <Bot className="h-4 w-4 text-white" />
                    ) : (
                      <User className="h-4 w-4 text-primary" />
                    )}
                  </div>
                  <div
                    className={`rounded-2xl px-4 py-2 ${
                      message.isBot
                        ? 'rounded-tl-none bg-white shadow-md'
                        : 'rounded-tr-none bg-primary text-white'
                    }`}
                  >
                    <p className="whitespace-pre-line text-sm">{message.text}</p>
                    <p
                      className={`mt-1 text-xs ${
                        message.isBot ? 'text-gray-400' : 'text-secondary'
                      }`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="mb-4 flex justify-start">
                <div className="flex items-center gap-2 rounded-2xl rounded-tl-none bg-white px-4 py-3 shadow-md">
                  <div className="flex gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '0ms' }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '150ms' }}></span>
                    <span className="h-2 w-2 animate-bounce rounded-full bg-gray-400" style={{ animationDelay: '300ms' }}></span>
                  </div>
                  <span className="text-xs text-gray-400">AI is thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="border-t bg-white p-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Describe your symptoms..."
                disabled={isTyping}
                className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-primary disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-secondary hover:text-primary disabled:opacity-50"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
            <p className="mt-2 text-center text-xs text-gray-400">
              Powered by {ollamaStatus === 'online' ? 'TinyLlama AI' : 'Hospital Button'}
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
