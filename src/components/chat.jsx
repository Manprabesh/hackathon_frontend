import React, { useEffect, useRef, useState } from 'react';
import { X, Send, Clock, Save, Plus, School, MessageCircle, ChevronRight } from 'lucide-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [historyData, setHistoryData] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    fetchChatHistory();
  }, []);

  const getToken = () => {
    return localStorage.getItem('access_token');
  };

  const fetchChatHistory = async () => {
    const token = getToken();
    if (!token) {
      alert('No access token found. Please login again.');
      return;
    }

    try {
      const response = await fetch('https://sikshasathi.nebd.in/api/v1/chat/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("response",response)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("history data", data)
      const validHistory = (data.data || []).filter(
        (entry) =>
          entry.data.chat_history &&
          Array.isArray(entry.data.chat_history) &&
          entry.data.chat_history.every((item) => item.user || item.system)
      );
      setHistoryData(validHistory);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      // alert(
      //   error.message.includes('404')
      //     ? 'Authentication error. Please login again.'
      //     : 'Could not fetch chat history.'
      // );
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      text: input.trim(),
      sender: 'user',
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const token = getToken();
    if (!token) {
      setIsTyping(false);
      alert('No access token found. Please login again.');
      return;
    }

    try {
      const response = await fetch('https://sikshasathi.nebd.in/api/v1/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: input.trim(),
          chat_history: chatHistory,
          save_chat: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const latestChat =
        data.chat_history && data.chat_history.length > 0
          ? data.chat_history[data.chat_history.length - 1]
          : null;

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        text: latestChat?.system || "Sorry, I couldn't process your request.",
        sender: 'ai',
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setChatHistory(
        data.chat_history || [
          ...chatHistory,
          { user: input.trim(), system: latestChat?.system || '' },
        ]
      );
    } catch (error) {
      console.error('Error sending message:', error);
      let errorText = 'Error: Could not connect to the server.';
      if (error.message.includes('401')) {
        errorText = 'Authentication error. Please login again.';
      } else if (error.message.includes('400')) {
        errorText = 'Invalid request. Please check your input.';
      }
      const errorMessage = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'ai',
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const saveChat = async () => {
    if (chatHistory.length === 0) {
      alert('No chat history to save.');
      return;
    }

    const token = getToken();
    if (!token) {
      alert('No access token found. Please login again.');
      return;
    }

    try {
      const response = await fetch('https://sikshasathi.nebd.in/api/v1/chat/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: '',
          chat_history: chatHistory,
          save_chat: true,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      alert('Chat history saved successfully!');
      await fetchChatHistory();
    } catch (error) {
      console.error('Error saving chat:', error);
      let errorText = 'Error: Could not save chat history.';
      if (error.message.includes('401')) {
        errorText = 'Authentication error. Please login again.';
      } else if (error.message.includes('400')) {
        errorText = 'Invalid request. Please try again.';
      }
      alert(errorText);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    setChatHistory([]);
  };

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-1 py-3 border-b border-gray-200 shadow-sm">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center">
            <div className="w-10 h-full bg-indigo-500 rounded-full flex items-center justify-center mr-3">
              <School size={20} color="white" />
            </div>
            <div>
              <h1 className="text-gray-800 text-xl font-bold">Siksha Sathi AI</h1>
              <p className="text-gray-500 text-sm">
                {messages.length > 0 ? `${messages.length} messages` : 'Online'}
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                fetchChatHistory();
                setShowHistory(true);
              }}
              className="flex items-center bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <Clock size={18} className="text-indigo-600" />
              <span className="text-indigo-600 font-medium ml-1">History</span>
            </button>
            <button
              onClick={saveChat}
              className="flex items-center bg-gray-100 px-3 py-2 rounded-lg hover:bg-gray-200 transition"
            >
              <Save size={18} className="text-indigo-600" />
              <span className="text-indigo-600 font-medium ml-1">Save Chat</span>
            </button>
            <button
              onClick={clearChat}
              className="flex items-center justify-center bg-gray-100 w-10 h-10 rounded-lg hover:bg-gray-200 transition"
            >
              <Plus size={18} className="text-indigo-600" />
            </button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto bg-gray-50 px-1 py-1">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-8">
              <div className="w-24 h-24 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <MessageCircle size={40} className="text-indigo-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 text-center mb-3">
                Welcome to Siksha Sathi AI
              </h2>
              <p className="text-gray-500 text-center text-base leading-6 px-4">
                Your AI learning assistant is here to help! Ask questions, get explanations, or
                explore educational topics.
              </p>
            </div>
          ) : (
            <>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`my-2 flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="max-w-[85%]">
                    <div
                      className={`px-4 py-3 rounded-2xl ${
                        message.sender === 'user'
                          ? 'bg-indigo-500 rounded-br-md'
                          : 'bg-white rounded-bl-md border border-gray-200'
                      }`}
                    >
                      <p
                        className={`text-base ${
                          message.sender === 'user' ? 'text-white' : 'text-gray-800'
                        }`}
                      >
                        {message.text}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          message.sender === 'user' ? 'text-indigo-200' : 'text-gray-500'
                        }`}
                      >
                        {formatTime(message.timestamp)} 
                      </p>
                    </div>
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="my-2 flex justify-start">
                  <div className="max-w-[85%]">
                    <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 border border-gray-200">
                      <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200"></div>
                        <span className="text-gray-500 text-sm ml-2">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="max-w-4xl mx-auto flex items-end gap-3">
          <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-2 flex items-end">
            <textarea
              ref={inputRef}
              className="flex-1 bg-transparent text-gray-900 text-base resize-none outline-none max-h-32 py-2"
              placeholder="Ask me anything about education..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              rows={1}
              maxLength={500}
            />
            {input.length > 0 && (
              <button
                onClick={() => setInput('')}
                className="p-1 ml-2 hover:bg-gray-200 rounded-full transition"
              >
                <X size={20} className="text-gray-400" />
              </button>
            )}
          </div>
          <button
            onClick={sendMessage}
            disabled={!input.trim()}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition ${
              input.trim() ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-300 cursor-not-allowed'
            }`}
          >
            <Send size={20} color={input.trim() ? 'white' : '#9ca3af'} />
          </button>
        </div>
      </div>

      {/* History Modal */}
      {showHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[80vh] flex flex-col">
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-gray-800 text-xl font-bold">Chat History</h2>
              <button onClick={() => setShowHistory(false)} className="p-2 hover:bg-gray-100 rounded">
                <X size={24} className="text-indigo-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {historyData.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <p className="text-gray-500 text-lg">No chat history available.</p>
                </div>
              ) : (
                historyData.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white p-4 mb-2 rounded-lg border border-gray-200 hover:shadow-md transition"
                  >
                    <h3 className="text-lg font-bold text-gray-800">{item.chat_title}</h3>
                    <p className="text-sm text-gray-500 mb-2">{formatDate(item.created_date)}</p>
                    <button
                      onClick={() => {
                        setSelectedChat(item);
                        setShowHistory(false);
                      }}
                      className="bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg flex items-center justify-center text-white font-medium transition"
                    >
                      <span>See More</span>
                      <ChevronRight size={18} className="ml-1" />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Chat Modal */}
      {selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-50 rounded-lg w-full max-w-3xl max-h-[80vh] flex flex-col">
            <div className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-gray-800 text-xl font-bold">{selectedChat.chat_title}</h2>
                <p className="text-gray-500 text-sm">{formatDate(selectedChat.created_date)}</p>
              </div>
              <button onClick={() => setSelectedChat(null)} className="p-2 hover:bg-gray-100 rounded">
                <X size={24} className="text-indigo-600" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {selectedChat.data.chat_history.map((item, index) => (
                <div key={index}>
                  {item.user && (
                    <div className="my-2 flex justify-end">
                      <div className="max-w-[85%]">
                        <div className="px-4 py-3 rounded-2xl bg-indigo-500 rounded-br-md">
                          <p className="text-base text-white">{item.user}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  {item.system && (
                    <div className="my-2 flex justify-start">
                      <div className="max-w-[85%]">
                        <div className="px-4 py-3 rounded-2xl bg-white rounded-bl-md border border-gray-200">
                          <p className="text-base text-gray-800">{item.system}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;