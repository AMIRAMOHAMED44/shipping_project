import React, { useState, useRef, useEffect } from "react";
import {
  MessageCircle,
  Send,
  X,
  Bot,
  User,
  Truck,
  Package,
} from "lucide-react";

const useAuth = () => ({
  user: { role: "agent", name: "Omar" }, 
});

export default function AiChat() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);
  const [lastAgent, setLastAgent] = useState(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages, isTyping]);

  // Get role-specific system prompts
  const getSystemPrompt = (role) => {
    if (role === "agent") {
      return `You are a specialized AI assistant for delivery agents. The agent's name is ${user?.name}.
      Provide expert advice on:
      - Safe delivery practices and handling procedures
      - Professional customer interaction techniques
      - Route optimization and time management
      - Handling difficult customers and complaints professionally
      - Package security and protection measures
      - Weather-related delivery challenges
      - Vehicle maintenance and safety checks
      - Emergency procedures and problem-solving
      - Documentation and proof of delivery best practices
      - Dealing with delivery delays and communication strategies
      
      Always be encouraging, practical, and safety-focused. Provide actionable tips that improve service quality and agent safety.`;
    } else if (role === "customer") {
      return `You are a helpful customer service AI for a shipping and delivery platform. The customer's name is ${user?.name}.
      
      Help customers with:
      - Step-by-step guidance on creating shipments
      - Explaining service advantages and benefits
      - Package preparation and labeling instructions
      - Tracking shipments and understanding delivery status
      - Pricing information and service options
      - Delivery scheduling and special requirements
      - Return and refund procedures
      - Account management and features
      - Troubleshooting common issues
      - Best practices for packaging different item types
      
      Be friendly, informative, and focus on showcasing the value and ease of using the service.`;
    }
    return "You are a helpful assistant for shipping and delivery services.";
  };

  // Simulate AI response (replace with actual API call)
  const simulateAIResponse = async (userMessage, role) => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 1000 + Math.random() * 1500)
    );

    // Mock responses based on role
    const agentResponses = [
      "Always prioritize safety when handling packages. Use proper lifting techniques - bend your knees, keep your back straight, and get help with heavy items over 50lbs. 📦💪",
      "When dealing with difficult customers, remain calm and professional. Listen actively, acknowledge their concerns, and focus on finding solutions. A simple 'I understand your frustration' can go a long way. 🤝",
      "Plan your routes efficiently by grouping deliveries by area and considering traffic patterns. Use GPS apps with real-time traffic updates and always have a backup route planned. 🗺️",
      "For package security, always verify the recipient's identity, take clear photos for proof of delivery, and follow company protocols for high-value items. Document everything! 📸",
      "In bad weather, drive slowly and increase following distance. Keep packages dry with protective covers, and communicate proactively with customers about potential delays. Safety first! 🌧️",
    ];

    const customerResponses = [
      "Creating a shipment is easy! Just enter pickup/delivery addresses, select package size, choose your service speed, and schedule pickup. Our drivers handle the rest! 📮✨",
      "Our service offers real-time tracking, insurance coverage, flexible pickup times, and 24/7 customer support. Plus, competitive rates and reliable delivery! 🚚💫",
      "For fragile items, use plenty of bubble wrap, mark the box clearly as 'FRAGILE', and consider our premium handling service for extra care. We'll treat it like our own! 📦🛡️",
      "You can track your shipment anytime using your tracking number on our website or mobile app. Get real-time updates from pickup to delivery! 📱📍",
      "Our return process is simple: request a return label through your account, repack the item securely, and schedule a pickup. Most returns are processed within 3-5 business days! 🔄",
    ];

    const responses = role === "agent" ? agentResponses : customerResponses;
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = async () => {
    if (!message.trim() || !user?.role) return;

    // Add user message
    const userMessage = {
      text: message,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    try {
      // Simulate AI response (replace with actual OpenAI API call)
      const aiResponse = await simulateAIResponse(message, user.role);

      setMessages((prev) => [
        ...prev,
        {
          text: aiResponse,
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } catch (error) {
      console.error("AI response error:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "I apologize, but I'm having trouble connecting right now. Please try again in a moment! 🔄",
          sender: "ai",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Welcome message when chat opens
  useEffect(() => {
    if (open && user?.role && messages.length === 0) {
      const welcomeMessages = {
        agent: `Hello ${user?.name}! 🚚👋

I'm your AI delivery assistant, here to help you provide excellent service and stay safe on the job.

**I can help you with:**
• Safe delivery practices
• Customer service tips  
• Route optimization
• Problem-solving strategies

What challenges are you facing today?`,
        customer: `Welcome ${user?.name}! 📦✨

I'm here to make your shipping experience smooth and easy!

**Our service advantages:**
• Real-time tracking 📍
• Flexible pickup times ⏰
• Insurance coverage 🛡️
• 24/7 support 🌟

How can I help you ship smarter today?`,
      };

      const welcomeMessage = {
        text: welcomeMessages[user.role] || welcomeMessages.customer,
        sender: "ai",
        timestamp: new Date(),
      };

      setTimeout(() => setMessages([welcomeMessage]), 500);
    }
  }, [open, user?.role]);

  // Handle role changes
  useEffect(() => {
    if (user?.role !== lastAgent && user?.role) {
      setMessages([]);
      setLastAgent(user?.role);

      if (open) {
        const switchMessages = {
          agent: `Welcome back, Agent ${user?.name}! 🚚

Ready to help you deliver excellence today. What's on your route?`,
          customer: `Hello ${user?.name}! 📦

Let's make shipping simple for you. What would you like to send today?`,
        };

        const switchMessage = {
          text: switchMessages[user.role] || switchMessages.customer,
          sender: "ai",
          timestamp: new Date(),
        };

        setTimeout(() => setMessages([switchMessage]), 300);
      }
    }
  }, [user?.role, open, lastAgent]);

  if (!user?.role) return null;

  const isAgent = user.role === "agent";
  const themeColors = isAgent
    ? "from-blue-600 to-blue-700"
    : "from-emerald-600 to-emerald-700";

  const Icon = isAgent ? Truck : Package;

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setOpen(!open)}
          className={`group relative flex items-center justify-center w-14 h-14 rounded-full transition-all duration-300 ease-out transform hover:scale-110 shadow-lg ${
            open
              ? "hidden"
              : `bg-gradient-to-br ${themeColors} hover:shadow-xl hover:shadow-current/30`
          }`}
        >
          <MessageCircle className="text-white" />
          {!open && (
            <div
              className={`absolute inset-0 rounded-full bg-gradient-to-br ${themeColors} animate-ping opacity-20`}
            >
              <MessageCircle />
            </div>
          )}
        </button>
      </div>

      {/* Chat Window */}
      <div
        className={`fixed bottom-3 md:bottom-6 md:right-6 z-40 w-80 h-[500px] transition-all duration-500 ease-out transform origin-bottom-right ${
          open
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-75 opacity-0 translate-y-8 pointer-events-none"
        }`}
      >
        <div className="w-full h-full bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div
            className={`bg-gradient-to-r ${themeColors} p-4 relative overflow-hidden`}
          >
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">
                    {isAgent ? "Agent Assistant" : "Shipping Helper"}
                  </h3>
                  <p className="text-white/80 text-xs capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end">
                <div onClick={() => setOpen(false)}>
                  <X
                    size={16}
                    className="text-white hover:text-red-600 cursor-pointer"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-white/80 text-xs">Online</span>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full"></div>
            <div className="absolute -bottom-2 -left-2 w-12 h-12 bg-white/5 rounded-full"></div>
          </div>

          {/* Messages Container */}
          <div
            ref={chatContainerRef}
            className="h-[calc(100%-140px)] overflow-y-auto p-4 space-y-3 bg-gray-50/30"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-start space-x-2 max-w-[85%] ${
                    msg.sender === "user"
                      ? "flex-row-reverse space-x-reverse"
                      : ""
                  }`}
                >
                  {msg.sender === "ai" && (
                    <div
                      className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeColors} flex items-center justify-center flex-shrink-0 mt-1`}
                    >
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  {msg.sender === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-400 flex items-center justify-center flex-shrink-0 mt-1">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}

                  <div
                    className={`rounded-2xl p-3 text-sm ${
                      msg.sender === "user"
                        ? `bg-gradient-to-br ${themeColors} text-white rounded-br-md shadow-md`
                        : "bg-white text-gray-800 rounded-bl-md shadow-md border border-gray-100"
                    }`}
                  >
                    <div className="whitespace-pre-wrap break-words">
                      {msg.text}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-2 max-w-[85%]">
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${themeColors} flex items-center justify-center flex-shrink-0`}
                  >
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white text-gray-800 rounded-2xl rounded-bl-md p-4 shadow-md border border-gray-100">
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      </div>
                      <span className="text-xs text-gray-500">Typing...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className="px-2 py-4 bg-white border-t border-gray-100">
            <div className="flex gap-2">
              <div className="flex-1">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyPress}
                  placeholder={
                    isAgent
                      ? "Ask about delivery tips, safety, or customer service..."
                      : "Ask about shipping, tracking, or our services..."
                  }
                  rows={1}
                  className="w-full text-sm p-2 rounded-xl border-2 border-gray-200 focus:border-current focus:ring-2 focus:ring-current/10 bg-white resize-none transition-all duration-200 placeholder:text-gray-400"
                />
              </div>

              <button
                onClick={handleSend}
                disabled={!message.trim() || isTyping}
                className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  message.trim() && !isTyping
                    ? `bg-gradient-to-br ${themeColors} hover:shadow-lg hover:shadow-current/30 hover:scale-105 text-white`
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}