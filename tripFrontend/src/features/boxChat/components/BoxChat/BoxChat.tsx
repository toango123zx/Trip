import { TBoxChat, TMessage } from '@/types';
import { notificationUtils } from '@/utils/notificationUtils';
import { JSX, useEffect, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

export type TChatProps = {
  myInformationId: string;
  userId: string;
  boxChat: TBoxChat;
  wsUrl?: string;
  isChatBot?: boolean;
}

export const BoxChat = ({
  myInformationId,
  userId,
  boxChat,
  wsUrl = 'http://localhost:3000',
  isChatBot = false
}: TChatProps): JSX.Element => {
  const socketRef = useRef<Socket | null>(null);
  const [messages, setMessages] = useState<TMessage[]>(boxChat?.messages || []);
  const [input, setInput] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    console.log(`=== Initializing ${isChatBot ? 'Chatbot' : 'Normal Chat'} WebSocket ===`);
    console.log('WS URL:', wsUrl);
    console.log('User ID:', userId);
    console.log('My Information ID:', myInformationId);
    console.log('Box Chat ID:', boxChat.id);

    // Tạo socket connection
    socketRef.current = io(wsUrl, {
      transports: ['websocket', 'polling'],
      withCredentials: true,
      timeout: 20000,
      forceNew: true,
    });

    const socket = socketRef.current;

    // Lắng nghe sự kiện connect thành công
    socket.on('connect', () => {
      console.log('✅ Socket connected successfully:', socket.id);
      setIsConnected(true);

      // Join vào boxChat ngay sau khi connect
      console.log('📞 Joining boxChat with:', {
        userId: myInformationId,
        boxChatId: boxChat.id
      });
    });

    // Lắng nghe confirmation từ server
    socket.on('connected', (success: boolean) => {
      console.log('✅ Server confirmed connection:', success);
      if (!success) {
        notificationUtils.error({ message: 'Kết nối không thành công. Vui lòng thử lại.' });
        return;
      }
      socket.emit('joinBoxChat', {
        userId: userId,
        boxChatId: boxChat.id
      });
      setIsConnected(success);
    });

    // Lắng nghe sự kiện disconnect
    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
      setIsConnected(false);
    });

    // Lắng nghe connect_error
    socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
      setIsConnected(false);
    });

    // Lắng nghe chat history
    socket.on('chatHistory', (response: { data: TBoxChat }) => {
      console.log('📝 Received chat history:', response.data.messages);
      if (response.data.messages) {
        setMessages(response.data.messages);
      }
    });

    // Lắng nghe tin nhắn mới
    socket.on('newMessage', (response: { boxChatId: string, message: TMessage }) => {
      console.log('📨 New message received:', response);

      if (isChatBot) {
        // Cho chatbot, nhận tất cả tin nhắn
        setMessages((prev) => [...prev, response.message]);
      } else {
        // Cho chat thường, chỉ nhận tin nhắn của boxChat hiện tại
        if (response.boxChatId === boxChat.id) {
          setMessages((prev) => [...prev, response.message]);
        }
      }
    });

    // Lắng nghe lỗi
    socket.on('error', (error: { message: string }) => {
      console.error('❌ Socket error:', error);
      setIsConnected(false);
      notificationUtils.error({
        message: error.message || 'Lỗi kết nối chat'
      });
    });

    // Load messages từ boxChat prop
    if (boxChat.messages) {
      setMessages(boxChat.messages);
    }

    // Cleanup khi component unmount hoặc dependencies thay đổi
    return () => {
      console.log('🧹 Cleaning up socket connection');
      if (socket) {
        socket.disconnect();
      }
    };
  }, [myInformationId, boxChat, wsUrl, isChatBot, userId]);

  const sendMessage = () => {
    if (!input.trim() || !socketRef.current || !isConnected) {
      if (!isConnected) {
        notificationUtils.error({ message: 'Chưa kết nối tới server' });
      }
      return;
    }

    console.log('📤 Sending message:', {
      boxChatId: boxChat.id,
      content: input.trim(),
      userId: myInformationId,
      isChatBot
    });

    if (isChatBot) {
      const newMessage: TMessage = {
        id: `msg-${Date.now()}`, // Tạo ID tạm thời
        content: input.trim(),
        userId: myInformationId,
        userName: 'You',
        image: '', // Có thể để trống hoặc thêm ảnh đại diện
        userRoleName: 'User',
        createAt: new Date(),
        updateAt: new Date()
      }
      setMessages((prev) => [...prev, newMessage]);
    }

    socketRef.current.emit('sendMessage', {
      boxChatId: boxChat.id,
      content: input.trim(),
      userId: myInformationId
    });

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex flex-col h-full w-full bg-white shadow-xl rounded-lg overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between p-4 text-white shadow-md ${isChatBot
        ? 'bg-gradient-to-r from-blue-500 to-purple-600'
        : 'bg-gradient-to-r from-blue-500 to-blue-600'
        }`}>
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
              <span className="text-white font-bold text-lg">
                {boxChat?.name?.charAt(0)?.toUpperCase() || (isChatBot ? '🤖' : 'C')}
              </span>
            </div>
            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${isConnected ? 'bg-green-400' : 'bg-gray-400'
              }`}></div>
          </div>
          <div>
            <h3 className="font-semibold text-lg">
              {boxChat?.name || (isChatBot ? 'AI Assistant' : 'Chat')}
            </h3>
            <span className={`text-sm ${isChatBot ? 'text-blue-100' : 'text-blue-100'}`}>
              {isConnected ? 'Đang hoạt động' : 'Đang kết nối...'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 shadow-lg ${isChatBot
              ? 'bg-gradient-to-br from-blue-100 to-purple-200'
              : 'bg-gradient-to-br from-blue-100 to-blue-200'
              }`}>
              {isChatBot ? (
                <span className="text-4xl">🤖</span>
              ) : (
                <svg className="w-10 h-10 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-lg font-medium mb-2">
              {isChatBot ? 'Chào mừng đến AI Assistant!' : 'Chào mừng đến cuộc trò chuyện!'}
            </p>
            <p className="text-sm text-center">
              {isChatBot ? 'Hỏi tôi bất cứ điều gì bạn muốn biết' : 'Hãy gửi tin nhắn đầu tiên để bắt đầu'}
            </p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMyMessage = message.userId === myInformationId;
            const showAvatar = index === messages.length - 1 ||
              messages[index + 1]?.userId !== message.userId;
            const showTime = index === messages.length - 1 ||
              new Date(messages[index + 1]?.createAt).getTime() - new Date(message.createAt).getTime() > 300000;

            return (
              <div key={message.id || index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'} mb-1`}>
                <div className={`flex items-end space-x-2 max-w-xs lg:max-w-md ${isMyMessage ? 'flex-row-reverse space-x-reverse' : ''
                  }`}>
                  {/* Avatar cho tin nhắn không phải của tôi */}
                  {!isMyMessage && showAvatar && (
                    <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center flex-shrink-0 shadow-sm">
                      {isChatBot ? (
                        <span className="text-lg">🤖</span>
                      ) : message.image ? (
                        <img
                          src={message.image}
                          alt={message.userName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xs font-semibold text-gray-600">
                          {message.userName?.charAt(0)?.toUpperCase() || '?'}
                        </span>
                      )}
                    </div>
                  )}

                  {!isMyMessage && !showAvatar && <div className="w-8"></div>}

                  {/* Message bubble */}
                  <div className="flex flex-col">
                    <div className={`relative px-4 py-3 rounded-2xl break-words shadow-sm ${isMyMessage
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md'
                      : isChatBot
                        ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-gray-800 border border-purple-200 rounded-bl-md'
                        : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md'
                      }`}>
                      <p className="text-sm leading-relaxed">
                        {message.content}
                        {
                          message.attractionReference && message.attractionReference.length > 0 && (
                            <div className="mt-2 space-y-2">
                              {message.attractionReference.map((attraction) => (
                                <button 
                                key={attraction.id}
                                onClick={() => window.open(`/attractions/${attraction.id}`, '_blank')}
                                className="w-full flex justify-start items-center gap-2 border-[1px] border-gray-200 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                                  <img
                                    src={attraction.image}
                                    alt={attraction.name}
                                    className="w-12 h-12 rounded-lg object-cover"
                                  />
                                  <span className="text-sm font-medium text-gray-800">
                                    {attraction.name}
                                  </span>
                                </button>
                              ))}
                            </div>
                          )
                        }
                      </p>

                    </div>

                    {/* Timestamp */}
                    {showTime && (
                      <div className={`text-xs text-gray-400 mt-1 px-2 ${isMyMessage ? 'text-right' : 'text-left'
                        }`}>
                        {formatTime(message.createAt)}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Section */}
      <div className="p-4 bg-white border-t border-gray-200">
        <div className="flex items-center space-x-3">
          {/* Attachment button */}
          <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
            </svg>
          </button>

          {/* Text input */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isChatBot ? "Hỏi AI Assistant..." : "Nhập tin nhắn..."}
              disabled={!isConnected}
              className="w-full px-4 py-3 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            />

            {/* Emoji button */}
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 100-2 1 1 0 000 2zm7-1a1 1 0 11-2 0 1 1 0 012 0zm-.464 5.535a1 1 0 10-1.415-1.414 3 3 0 01-4.242 0 1 1 0 00-1.415 1.414 5 5 0 007.072 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Send button */}
          <button
            type="button"
            onClick={sendMessage}
            disabled={!isConnected || !input.trim()}
            className={`p-3 rounded-full transition-all duration-200 ${isConnected && input.trim()
              ? isChatBot
                ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg transform hover:scale-105'
                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg transform hover:scale-105'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>

        {/* Connection Status */}
        <div className="mt-2 h-5">
          {!isConnected ? (
            <div className="flex items-center space-x-2 text-xs text-red-500">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span>Đang kết nối lại...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2 text-xs text-green-500">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Đã kết nối {isChatBot ? '(Chatbot)' : '(Chat)'}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};