import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import i18n from "@/i18n/config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Plus, Search, Library, Clock, Globe, User, ChevronDown } from "lucide-react";
import Navigation from "@/components/Navigation";
import { supabase } from "@/integrations/supabase/client";
import gptLogo from "@/assets/gpt-logo.png";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
interface Message {
  role: "user" | "assistant";
  content: string;
}
interface Chat {
  id: string;
  title: string;
  messages: Message[];
  timestamp: number;
}
const Chat = () => {
  const {
    t
  } = useTranslation();
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChatId, setCurrentChatId] = useState<string>("");
  const [input, setInput] = useState("");
  const [showLookingPreview, setShowLookingPreview] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState("GPT-5");
  const scrollRef = useRef<HTMLDivElement>(null);
  
  const EXAMPLE_CHATS: Chat[] = [{
    id: "example-1",
    title: t("chat.example1.title"),
    messages: [{
      role: "user",
      content: t("chat.example1.user")
    }, {
      role: "assistant",
      content: t("chat.example1.assistant")
    }],
    timestamp: Date.now() - 3600000
  }, {
    id: "example-2",
    title: t("chat.example2.title"),
    messages: [{
      role: "user",
      content: t("chat.example2.user")
    }, {
      role: "assistant",
      content: t("chat.example2.assistant")
    }],
    timestamp: Date.now() - 7200000
  }, {
    id: "example-3",
    title: t("chat.example3.title"),
    messages: [{
      role: "user",
      content: t("chat.example3.user")
    }, {
      role: "assistant",
      content: t("chat.example3.assistant")
    }],
    timestamp: Date.now() - 10800000
  }];
  
  useEffect(() => {
    const stored = localStorage.getItem("looking-chats");
    const storedChats = stored ? JSON.parse(stored) : [];
    // Only set user chats, EXAMPLE_CHATS are always available separately
    setChats(storedChats);
    // Start with empty chat by default
    setCurrentChatId("");
  }, []);
  useEffect(() => {
    if (scrollRef.current) {
      const scrollElement = scrollRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollElement) {
        scrollElement.scrollTop = scrollElement.scrollHeight;
      }
    }
  }, [currentChatId, chats, isLoading]);
  useEffect(() => {
    // Show preview when typing any prefix of "/looking"
    const lookingCommand = "/looking";
    const shouldShow = input.length > 0 && 
                       input.startsWith("/") && 
                       lookingCommand.startsWith(input.toLowerCase()) &&
                       input.toLowerCase() !== lookingCommand;
    setShowLookingPreview(shouldShow);
  }, [input]);
  const currentChat = chats.find(c => c.id === currentChatId) || EXAMPLE_CHATS.find(c => c.id === currentChatId);
  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    const newMessage: Message = {
      role: "user",
      content: input
    };
    let updatedChats = [...chats];
    let targetChatId = currentChatId;
    if (currentChatId) {
      updatedChats = updatedChats.map(chat => chat.id === currentChatId ? {
        ...chat,
        messages: [...chat.messages, newMessage]
      } : chat);
    } else {
      const newChat: Chat = {
        id: `chat-${Date.now()}`,
        title: input.slice(0, 30),
        messages: [newMessage],
        timestamp: Date.now()
      };
      updatedChats = [newChat, ...updatedChats];
      targetChatId = newChat.id;
      setCurrentChatId(newChat.id);
    }
    setChats(updatedChats);
    setInput("");
    setIsLoading(true);
    try {
      const currentMessages = updatedChats.find(c => c.id === targetChatId)?.messages || [];
      const {
        data,
        error
      } = await supabase.functions.invoke('chat', {
        body: {
          messages: currentMessages
        }
      });
      if (error) throw error;
      const responseMessage: Message = {
        role: "assistant",
        content: data.message
      };
      const finalChats = updatedChats.map(chat => chat.id === targetChatId ? {
        ...chat,
        messages: [...chat.messages, responseMessage]
      } : chat);
      setChats(finalChats);
      // Only save non-example chats to localStorage
      const userChats = finalChats.filter(c => !EXAMPLE_CHATS.find(e => e.id === c.id));
      localStorage.setItem("looking-chats", JSON.stringify(userChats));
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        role: "assistant",
        content: "Entschuldigung, es gab einen Fehler bei der Verarbeitung Ihrer Anfrage."
      };
      const finalChats = updatedChats.map(chat => chat.id === targetChatId ? {
        ...chat,
        messages: [...chat.messages, errorMessage]
      } : chat);
      setChats(finalChats);
    } finally {
      setIsLoading(false);
    }
  };
  const handleNewChat = () => {
    setCurrentChatId("");
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    // Don't delete example chats
    if (EXAMPLE_CHATS.find(c => c.id === chatId)) return;
    
    const updatedChats = chats.filter(c => c.id !== chatId);
    setChats(updatedChats);
    localStorage.setItem("looking-chats", JSON.stringify(updatedChats));
    
    if (currentChatId === chatId) {
      setCurrentChatId("");
    }
  };
  return <div className="flex h-screen bg-background">
      <Navigation />
      
      <div className="flex flex-1 pt-14">
        {/* Sidebar */}
        <div className="w-64 border-r border-border flex flex-col bg-muted/20">
          <div className="p-3 border-b border-border">
            <Button onClick={handleNewChat} className="w-full justify-start gap-2 rounded-lg shadow-sm" variant="outline">
              <Plus className="h-4 w-4" />
              {t("chat.newChat")}
            </Button>
          </div>
          
          <div className="p-3 border-b border-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder={t("chat.searchChats")} className="pl-9 rounded-lg" />
            </div>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-2 space-y-1">
              <div className="px-3 py-1 text-xs text-muted-foreground font-medium">Beispiele</div>
              {EXAMPLE_CHATS.map(chat => (
                <button 
                  key={chat.id} 
                  onClick={() => setCurrentChatId(chat.id)} 
                  className={`w-full text-left px-3 py-2 rounded-lg transition-all text-sm ${currentChatId === chat.id ? "bg-accent shadow-sm" : "hover:bg-muted/50"}`}
                >
                  <span className="line-clamp-1">{chat.title}</span>
                </button>
              ))}
              {chats.length > 0 && (
                <div className="pt-2 mt-2 border-t border-border">
                  <div className="px-3 py-1 text-xs text-muted-foreground font-medium">Ihre Chats</div>
                  {chats.map(chat => (
                    <button 
                      key={chat.id} 
                      onClick={() => setCurrentChatId(chat.id)} 
                      className={`group w-full text-left px-3 py-2 rounded-lg transition-all text-sm flex items-center justify-between ${currentChatId === chat.id ? "bg-accent shadow-sm" : "hover:bg-muted/50"}`}
                    >
                      <span className="line-clamp-1 flex-1">{chat.title}</span>
                      <button
                        onClick={(e) => handleDeleteChat(chat.id, e)}
                        className="opacity-0 group-hover:opacity-100 hover:text-destructive transition-opacity p-1"
                        aria-label="Delete chat"
                      >
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="p-3 border-t border-border space-y-2">
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-2 text-sm">
              <Library className="h-4 w-4" />
              <span>{t("chat.library")}</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>{t("chat.codex")}</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-2 text-sm">
              <Globe className="h-4 w-4" />
              <span>{t("chat.atlas")}</span>
            </button>
            <button className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted/50 transition-colors flex items-center gap-2 text-sm border-t border-border pt-3 mt-3">
              <User className="h-4 w-4" />
              <span className="text-xs">{t("chat.userProfile")}</span>
            </button>
          </div>
        </div>

        {/* Main Chat Area */}
        <div className="flex-1 flex flex-col bg-background">
          {/* Model Selection */}
          <div className="border-b border-border/50 p-2 flex justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 rounded-lg">
                  <img src={gptLogo} alt="GPT" className="h-4 w-4" />
                  <span className="text-sm font-medium">{selectedModel}</span>
                  <ChevronDown className="h-4 w-4 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="rounded-lg">
                <DropdownMenuItem onClick={() => setSelectedModel("GPT-5")} className="rounded-md">
                  GPT-5
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedModel("Thinking")} className="rounded-md">
                  Thinking
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSelectedModel("Instant")} className="rounded-md">
                  Instant
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <ScrollArea className="flex-1" ref={scrollRef}>
            <div className="max-w-4xl mx-auto px-6 py-8 space-y-6">
              {!currentChat && <div className="text-center py-12">
                  <img src={gptLogo} alt="GPT Logo" className="h-16 w-16 mx-auto mb-6 opacity-20" />
                  <h1 className="font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-3xl">
                    {t("chat.title")}
                  </h1>
                  <p className="text-sm text-muted-foreground/70 bg-muted/30 rounded-lg px-4 py-2 inline-block">
                    {t("chat.lookingNote")}
                  </p>
                </div>}
              
              {currentChat?.messages.map((msg, i) => <div key={i} className={`flex gap-4 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  {msg.role === "assistant" && <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <img src={gptLogo} alt="AI" className="h-5 w-5" />
                    </div>}
                  <div className={`max-w-[70%] rounded-2xl px-5 py-3 shadow-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted/50 border border-border/50"}`}>
                    <p className="text-[15px] leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                  </div>
                  {msg.role === "user" && <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center flex-shrink-0 mt-1 shadow-sm">
                      <User className="h-4 w-4" />
                    </div>}
                </div>)}
              
              {isLoading && <div className="flex justify-start gap-4">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <img src={gptLogo} alt="AI" className="h-5 w-5" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl px-5 py-3 border border-border/50 shadow-sm">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{
                    animationDelay: "0ms"
                  }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{
                    animationDelay: "150ms"
                  }} />
                      <div className="w-2 h-2 bg-foreground/40 rounded-full animate-bounce" style={{
                    animationDelay: "300ms"
                  }} />
                    </div>
                  </div>
                </div>}
            </div>
          </ScrollArea>

          <div className="border-t border-border/50 p-4 bg-background/80 backdrop-blur-sm">
            <div className="max-w-4xl mx-auto relative">
              {showLookingPreview && (
                <button
                  onClick={() => setInput("/looking ")}
                  className="absolute bottom-full mb-7 left-0 right-0 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-xl p-3 border border-primary/20 shadow-md hover:from-primary/15 hover:to-secondary/15 transition-all cursor-pointer text-left w-full"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-sm font-medium bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      /looking
                    </span>
                    <span className="text-sm text-muted-foreground/60 opacity-70">
                      {t("chat.lookingPreview")}
                    </span>
                  </div>
                </button>
              )}
              {!currentChat && !input && (
                <button
                  onClick={() => setInput("/looking ")}
                  className="absolute bottom-full mb-7 left-0 right-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl p-3 border border-primary/10 hover:from-primary/10 hover:to-secondary/10 transition-all cursor-pointer text-left w-full"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary/50" />
                    <span className="text-sm font-medium text-primary/70">
                      /looking
                    </span>
                    <span className="text-sm text-muted-foreground/50 opacity-70">
                      {i18n.language === 'de' 
                        ? 'für ein Hotelzimmer in Obertauern für 2 Erwachsene zwischen dem 17.12.2025 und 24.12.2025...'
                        : 'for a hotel room in Obertauern for 2 adults from 17.12.2025 to 24.12.2025...'}
                    </span>
                  </div>
                </button>
              )}
              <div className="flex gap-3">
                <Input value={input} onChange={e => setInput(e.target.value)} onKeyPress={e => e.key === "Enter" && !e.shiftKey && handleSend()} placeholder={t("chat.placeholder")} className="flex-1 h-12 rounded-xl border-border/50 focus-visible:ring-primary/50 shadow-sm" disabled={isLoading} />
                <Button onClick={handleSend} size="icon" disabled={isLoading || !input.trim()} className="h-12 w-12 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-md">
                  <Send className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>;
};
export default Chat;