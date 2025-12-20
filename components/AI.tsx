// app/components/AIAssistant.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Mic, 
  MicOff, 
  Send, 
  Sparkles, 
  Volume2,
  VolumeX,
  RotateCcw
} from "lucide-react";
import TextareaAutosize from 'react-textarea-autosize';
import { toast } from "sonner";

// TypeScript interfaces
interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  audioUrl?: string;
}

// Mock AI response generator
const generateAIResponse = async (input: string): Promise<string> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const responses = [
    `I understand you're asking about "${input}". This is a simulated response from your AI assistant.`,
    `Based on your query "${input}", here's what I recommend: Always validate your inputs and handle errors gracefully.`,
    `Interesting question about "${input}"! In a real implementation, this would connect to your AI backend.`,
    `Thanks for your message: "${input}". Remember to implement proper security measures for voice data.`,
  ];
  
  return responses[Math.floor(Math.random() * responses.length)];
};

// Text-to-Speech utility
const speakText = (text: string): string => {
  try {
    // Clean up any existing audio
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      speechSynthesis.speak(utterance);
      return 'playing';
    }
    return 'unsupported';
  } catch {
    return 'error';
  }
};

// Speech-to-Text utility
const startListening = (
  onResult: (text: string) => void,
  onError: (error: string) => void
): (() => void) | null => {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    onError('Speech recognition not supported in this browser');
    return null;
  }

  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';

  recognition.onresult = (event: any) => {
    const transcript = event.results[0][0].transcript;
    onResult(transcript);
  };

  recognition.onerror = (event: any) => {
    onError(`Speech recognition error: ${event.error}`);
  };

  recognition.start();
  
  return () => recognition.stop();
};

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioStatus, setAudioStatus] = useState<'on' | 'off'>('on');
  const stopListeningRef = useRef<(() => void) | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stopListeningRef.current) stopListeningRef.current();
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
    };
  }, []);

  const handleSend = async (text: string) => {
    if (!text.trim() || isProcessing) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: text,
      role: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsProcessing(true);
    
    try {
      // Get AI response
      const aiResponse = await generateAIResponse(text);
      
      // Add assistant message
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      // Speak response if audio is enabled
      if (audioStatus === 'on') {
        setIsSpeaking(true);
        const status = speakText(aiResponse);
        if (status === 'error') {
          toast.error('Failed to speak response');
        }
      }
    } catch (error) {
      toast.error('Failed to get AI response');
      console.error(error);
    } finally {
      setIsProcessing(false);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      if (stopListeningRef.current) {
        stopListeningRef.current();
        stopListeningRef.current = null;
      }
      setIsListening(false);
    } else {
      stopListeningRef.current = startListening(
        (text) => {
          setInputText(text);
          setIsListening(false);
        },
        (error) => {
          toast.error(error);
          setIsListening(false);
        }
      );
      setIsListening(true);
    }
  };

  const toggleAudio = () => {
    setAudioStatus(prev => prev === 'on' ? 'off' : 'on');
    if (isSpeaking) {
      if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
      }
      setIsSpeaking(false);
    }
  };

  const clearConversation = () => {
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
    }
    setMessages([]);
    setInputText('');
    setIsSpeaking(false);
  };

  return (
    <Card className="w-full max-w-3xl mx-auto flex flex-col h-[70vh]">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-blue-500" />
          <CardTitle className="text-xl">AI Assistant</CardTitle>
        </div>
        <div className="flex gap-2">
          <Button 
            size="icon" 
            variant="outline" 
            onClick={toggleAudio}
            title={audioStatus === 'on' ? 'Disable audio' : 'Enable audio'}
          >
            {audioStatus === 'on' ? 
              <Volume2 className="h-4 w-4" /> : 
              <VolumeX className="h-4 w-4" />
            }
          </Button>
          <Button 
            size="icon" 
            variant="outline" 
            onClick={clearConversation}
            title="Clear conversation"
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex flex-col flex-1 gap-4 pb-4">
        {/* Messages container */}
        <div className="flex-1 overflow-y-auto rounded-lg border p-4 bg-muted/30">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4">
              <Sparkles className="h-12 w-12 text-blue-400 mb-3" />
              <p className="text-muted-foreground">
                Ask me anything! I can help with voice or text queries.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Your conversations stay private and are not stored
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div 
                  key={message.id} 
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                      message.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-secondary rounded-bl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${
                      message.role === 'user' 
                        ? 'text-primary-foreground/70' 
                        : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      {message.role === 'assistant' && isSpeaking && messages[messages.length - 1].id === message.id && (
                        <span className="ml-2">• Speaking</span>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {isProcessing && (
                <div className="flex justify-start">
                  <div className="bg-secondary rounded-2xl rounded-bl-none px-4 py-2">
                    <div className="flex space-x-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndQRef} />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        
        {/* Input area */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <TextareaAutosize
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(inputText);
                }
              }}
              placeholder="Type your message or click mic to speak..."
              className="min-h-[40px] w-full resize-none rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              maxRows={3}
              disabled={isProcessing}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-1.5 h-7 w-7"
              onClick={() => handleSend(inputText)}
              disabled={!inputText.trim() || isProcessing}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          
          <Button
            size="icon"
            variant={isListening ? "destructive" : "outline"}
            onClick={toggleListening}
            disabled={isProcessing}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? (
              <MicOff className="h-4 w-4 animate-pulse" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>
        </div>
        
        {/* Status indicators */}
        <div className="flex justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            {isListening && (
              <>
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                Listening...
              </>
            )}
          </div>
          <div>
            {audioStatus === 'off' && 'Audio disabled'}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}