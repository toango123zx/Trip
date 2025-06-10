import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { BoxChat, boxChatApi, boxChatThunk, ChatbotModal, ChatSidebar, FloatingChatbot } from '@/features/boxChat';
import { userApi } from '@/features/users/userApi';
import { TBoxChat, TUser } from '@/types';

const ChatPage: React.FC = () => {
  const dispatch = useDispatch<TReduxStoreDispatch>();
  const [userInfo, setUserInfo] = useState<TUser | null>(null);
  const [boxChatDetail, setBoxChatDetail] = useState<TBoxChat>({} as TBoxChat);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [targetUserId, setTargetUserId] = useState<string>('');
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true);

  // Lấy thông tin user hiện tại - ưu tiên từ API response
  const myInformationId = userInfo?.id || localStorage.getItem('userId') || 'cmazccubk001ne5q8f2f1nkjz';

  // Lấy targetUserId từ boxChat members (user đầu tiên không phải tôi)
  const getTargetUserId = (): string => {
    if (!boxChatDetail?.boxChatMember) return '';

    const targetMember = boxChatDetail.boxChatMember.find(
      member => member.userId !== myInformationId
    );

    return targetMember?.userId || '';
  };

  // Gọi API getMe khi component mount
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setIsLoadingUser(true);
        console.log('🔄 Loading user information...');
        
        const response = await userApi.getMe();
        console.log('✅ User info loaded:', response);
        
        setUserInfo(response);
        
        // Lưu vào localStorage để dùng lần sau
        if (response?.id) {
          localStorage.setItem('userId', response.id);
        }
        
      } catch (error) {
        console.error('❌ Error loading user info:', error);
        // Fallback to localStorage if API fails
        const localUserId = localStorage.getItem('userId');
        if (localUserId) {
          console.log('📁 Using userId from localStorage:', localUserId);
        }
      } finally {
        setIsLoadingUser(false);
      }
    };
    
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const userId = getTargetUserId();
    setTargetUserId(userId);
    console.log('🎯 Target user ID updated:', userId);
  }, [boxChatDetail]);

  const handleSelectChat = async (boxChatId: string) => {
    console.log('📞 Selecting chat:', boxChatId);
    setSelectedChatId(boxChatId);
    
    // Đóng chatbot nếu đang mở
    if (isChatbotOpen) {
      setIsChatbotOpen(false);
    }
    
    try {
      const boxChat = await boxChatApi.getBoxChatByBoxChatId(boxChatId);
      console.log('📦 BoxChat loaded:', boxChat);
      setBoxChatDetail(boxChat);
    } catch (error) {
      console.error('❌ Error loading chat detail:', error);
    }
  };

  const handleToggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
    
    // Đóng chat thường khi mở chatbot
    if (!isChatbotOpen) {
      setSelectedChatId(null);
      setBoxChatDetail({} as TBoxChat);
    }
  };

  const handleCloseChatbot = () => {
    setIsChatbotOpen(false);
  };

  // Loading state
  if (isLoadingUser) {
    return (
      <div className="flex h-screen bg-gray-100 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin người dùng...</p>
          <div className="mt-4 text-xs text-gray-400">
            <p>Local Storage: {localStorage.getItem('userId') || 'Not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100 relative">
      {/* Sidebar - Danh sách chat */}
      <ChatSidebar
        onSelectChat={handleSelectChat}
        selectedChatId={selectedChatId ?? undefined}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChatId && boxChatDetail?.id ? (
          <BoxChat
            myInformationId={myInformationId}
            userId={targetUserId}
            boxChat={boxChatDetail}
            wsUrl="http://localhost:3000"
            isChatBot={false}
          />
        ) : selectedChatId && !boxChatDetail?.id ? (
          // Loading state for chat
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải cuộc trò chuyện...</p>
            </div>
          </div>
        ) : (
          // Empty state
          <div className="flex-1 flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <svg className="w-12 h-12 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                Chào mừng đến Messenger
              </h3>
              <p className="text-gray-500 mb-6 max-w-md">
                Chọn một cuộc trò chuyện từ danh sách bên trái để bắt đầu hoặc sử dụng AI Assistant
              </p>
              
              {/* CTA Button for Chatbot */}
              <button
                onClick={handleToggleChatbot}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                🤖 Chat với AI Assistant
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Floating Chatbot Button - chỉ hiện khi không mở modal */}
      {!isChatbotOpen && (
        <FloatingChatbot
          onToggleChatbot={handleToggleChatbot}
          isChatbotActive={isChatbotOpen}
        />
      )}

      {/* Chatbot Modal */}
      <ChatbotModal
        isOpen={isChatbotOpen}
        onClose={handleCloseChatbot}
        myInformationId={myInformationId}
      />
    </div>
  );
};

export default ChatPage;