import React, { useState, useEffect, useRef } from 'react';
import { lyroAgent, LyroMessage } from '../lib/lyro';
import { LYRO_CONFIG } from '../config/lyro';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { X, MessageCircle, Send, Bot, User } from 'lucide-react';

interface LyroChatWidgetProps {
  isOpen: boolean;
  onToggle: () => void;
}

const LyroChatWidget: React.FC<LyroChatWidgetProps> = ({ isOpen, onToggle }) => {
  const [messages, setMessages] = useState<LyroMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Initialize Lyro agent
  useEffect(() => {
    const initLyro = async () => {
      try {
        await lyroAgent.initialize();
        setIsInitialized(true);
        
        // Add welcome message
        const welcomeMessage: LyroMessage = {
          id: 'welcome',
          text: LYRO_CONFIG.WELCOME_MESSAGE,
          sender: 'agent',
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
      } catch (error) {
        console.error('Failed to initialize Lyro:', error);
        const errorMessage: LyroMessage = {
          id: 'error',
          text: 'Sorry, I\'m having trouble connecting. Please try again later.',
          sender: 'agent',
          timestamp: new Date()
        };
        setMessages([errorMessage]);
      }
    };

    if (isOpen && !isInitialized) {
      initLyro();
    }
  }, [isOpen, isInitialized]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading || !isInitialized) return;

    const userMessage: LyroMessage = {
      id: Date.now().toString(),
      text: inputMessage.trim(),
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await lyroAgent.sendMessage(userMessage.text);
      setMessages(prev => [...prev, response]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: LyroMessage = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, something went wrong. Please try again.',
        sender: 'agent',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <Button
        onClick={onToggle}
        className="fixed bottom-4 right-4 w-14 h-14 rounded-full text-white shadow-lg z-50 hover:opacity-80"
        size="icon"
        style={{ backgroundColor: LYRO_CONFIG.PRIMARY_COLOR }}
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[500px] z-50">
      <Card className="w-full h-full flex flex-col shadow-xl border-0">
        <CardHeader className="text-white p-4 rounded-t-lg" style={{ backgroundColor: LYRO_CONFIG.PRIMARY_COLOR }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5" />
              <CardTitle className="text-lg font-semibold">{LYRO_CONFIG.AGENT_NAME}</CardTitle>
            </div>
                          <Button
                onClick={onToggle}
                variant="ghost"
                size="icon"
                className="text-white hover:opacity-80"
                style={{ backgroundColor: 'transparent' }}
              >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 p-0 flex flex-col">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                                     <div
                     className={`max-w-[80%] rounded-lg px-3 py-2 ${
                       message.sender === 'user'
                         ? 'text-white'
                         : 'bg-gray-100 text-gray-900'
                     }`}
                     style={{
                       backgroundColor: message.sender === 'user' ? LYRO_CONFIG.PRIMARY_COLOR : undefined
                     }}
                   >
                    <div className="flex items-start space-x-2">
                      {message.sender === 'agent' && (
                        <Bot className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="text-sm">{message.text}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-blue-100' : 'text-gray-500'
                        }`}>
                          {formatTime(message.timestamp)}
                        </p>
                      </div>
                      {message.sender === 'user' && (
                        <User className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-lg px-3 py-2">
                    <div className="flex items-center space-x-2">
                      <Bot className="w-4 h-4" />
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                ref={inputRef}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading || !isInitialized}
                className="flex-1"
              />
                             <Button
                 onClick={handleSendMessage}
                 disabled={!inputMessage.trim() || isLoading || !isInitialized}
                 size="icon"
                 style={{ backgroundColor: LYRO_CONFIG.PRIMARY_COLOR }}
                 className="hover:opacity-80"
               >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LyroChatWidget; 