import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, MicOff, Volume2, VolumeX, Minimize2, Maximize2, X } from 'lucide-react';
import AIAssistantLogo from './AIAssistant';

interface AITravelAssistantProps {
  isDarkMode: boolean;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AITravelAssistant: React.FC<AITravelAssistantProps> = ({ isDarkMode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'नमस्ते! मैं यात्रा सहायक हूँ। आपकी यात्रा में कैसे मदद कर सकता हूँ? 🙏',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const predefinedResponses = {
    'hello': 'नमस्ते! मैं आपकी यात्रा में सहायता के लिए यहाँ हूँ। कहाँ जाना चाहते हैं?',
    'help': 'मैं आपकी मदद कर सकता हूँ:\n• यात्रा योजना बनाने में\n• होटल खोजने में\n• स्थानीय भोजन की जानकारी\n• परिवहन की व्यवस्था\n• छुपे हुए स्थानों की खोज',
    'food': 'आपके आस-पास के बेहतरीन खाने के स्थान:\n• स्ट्रीट फूड के लिए चांदनी चौक\n• उत्तर भारतीय खाने के लिए कनॉट प्लेस\n• दक्षिण भारतीय खाने के लिए लाजपत नगर',
    'hotel': 'होटल की तलाश में हैं? मैं आपको बजट के अनुसार सुझाव दे सकता हूँ:\n• बजट होटल: ₹1000-3000\n• मिड-रेंज: ₹3000-8000\n• लक्जरी: ₹8000+',
    'transport': 'परिवहन के विकल्प:\n• मेट्रो - सबसे तेज़ और सस्ता\n• बस - किफायती\n• टैक्सी/ऑटो - सुविधाजनक\n• ट्रेन - लंबी दूरी के लिए',
    'offline': 'ऑफलाइन मोड में भी मैं आपकी मदद कर सकता हूँ:\n• सहेजे गए मैप्स\n• आपातकालीन नंबर\n• बेसिक फ्रेज़ बुक\n• स्थानीय टिप्स'
  };

  const getAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('hello') || message.includes('hi') || message.includes('नमस्ते')) {
      return predefinedResponses.hello;
    } else if (message.includes('help') || message.includes('मदद')) {
      return predefinedResponses.help;
    } else if (message.includes('food') || message.includes('खाना') || message.includes('भोजन')) {
      return predefinedResponses.food;
    } else if (message.includes('hotel') || message.includes('होटल')) {
      return predefinedResponses.hotel;
    } else if (message.includes('transport') || message.includes('परिवहन')) {
      return predefinedResponses.transport;
    } else if (message.includes('plan') || message.includes('योजना')) {
      return 'मैं आपके लिए एक शानदार यात्रा योजना बना सकता हूँ! कृपया बताएं:\n• कहाँ जाना है?\n• कितने दिन?\n• बजट क्या है?\n• किस तरह की जगहें पसंद हैं?';
    } else if (message.includes('budget') || message.includes('बजट')) {
      return 'बजट के अनुसार सुझाव:\n• कम बजट (₹1000/दिन): धर्मशाला, हॉस्टल\n• मध्यम बजट (₹3000/दिन): अच्छे होटल, रेस्टोरेंट\n• उच्च बजट (₹8000+/दिन): लक्जरी होटल, प्राइवेट ट्रांसपोर्ट';
    } else if (!isOnline) {
      return predefinedResponses.offline;
    } else {
      return 'मुझे खुशी होगी आपकी मदद करने में! कृपया अपना सवाल और स्पष्ट रूप से पूछें या "help" टाइप करें सभी विकल्प देखने के लिए।';
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: getAIResponse(inputMessage),
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);

    setInputMessage('');
  };

  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window) {
      const recognition = new (window as any).webkitSpeechRecognition();
      recognition.lang = 'hi-IN';
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => setIsListening(true);
      recognition.onend = () => setIsListening(false);
      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputMessage(transcript);
      };

      recognition.start();
    } else {
      alert('Voice recognition not supported in this browser');
    }
  };

  const handleTextToSpeech = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'hi-IN';
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      speechSynthesis.speak(utterance);
    }
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 animate-pulse-glow"
        >
          <AIAssistantLogo size="md" />
        </button>
        <div className="absolute -top-12 right-0 bg-black text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          यात्रा सहायक - YatraSathi
        </div>
      </div>
    );
  }

  return (
    <div className={`fixed bottom-6 right-6 z-50 ${isMinimized ? 'w-80' : 'w-96'} transition-all duration-300`}>
      <div className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border rounded-lg shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : 'h-96'}`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="flex items-center space-x-3">
            <AIAssistantLogo size="sm" />
            <div>
              <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-800'}`}>
                यात्रा सहायक
              </h3>
              <div className="flex items-center space-x-2">
                <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {isOnline ? 'Online' : 'Offline Mode'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className={`p-1 rounded ${isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'} transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {!isMinimized && (
          <>
            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-3 py-2 rounded-lg ${
                    message.type === 'user'
                      ? 'bg-blue-600 text-white'
                      : `${isDarkMode ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-800'}`
                  }`}>
                    <p className="text-sm whitespace-pre-line">{message.content}</p>
                    {message.type === 'assistant' && (
                      <button
                        onClick={() => handleTextToSpeech(message.content)}
                        className="mt-1 text-xs opacity-70 hover:opacity-100 flex items-center space-x-1"
                      >
                        {isSpeaking ? <VolumeX className="h-3 w-3" /> : <Volume2 className="h-3 w-3" />}
                        <span>सुनें</span>
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className={`p-4 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="अपना सवाल पूछें..."
                  className={`flex-1 px-3 py-2 border ${isDarkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white'} rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm`}
                />
                <button
                  onClick={handleVoiceInput}
                  className={`p-2 rounded-lg transition-colors ${
                    isListening 
                      ? 'bg-red-600 text-white' 
                      : `${isDarkMode ? 'bg-gray-700 hover:bg-gray-600 text-gray-300' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'}`
                  }`}
                >
                  {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                </button>
                <button
                  onClick={handleSendMessage}
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-colors"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AITravelAssistant;