import React from 'react';
import { BoxChat } from '@/features/boxChat';
import { TBoxChat } from '@/types';

interface ChatbotModalProps {
  isOpen: boolean;
  onClose: () => void;
  myInformationId: string;
}

export const ChatbotModal: React.FC<ChatbotModalProps> = ({
  isOpen,
  onClose,
  myInformationId
}) => {
  // Mock data cho chatbot
  const chatbotBoxChat: TBoxChat = {
    id: 'chatbot-001',
    name: 'AI Assistant',
    boxChatMember: [
      {
        userId: myInformationId,
        userName: 'You',
        image: '',
        roleName: 'User'
      },
      {
        userId: 'chatbot-ai',
        userName: 'AI Assistant',
        image: '',
        roleName: 'Bot'
      }
    ],
    messages: [
      {
        id: 'welcome-1',
        content: 'Xin chào! Tôi là AI Assistant. Tôi có thể giúp gì cho bạn hôm nay?',
        userId: 'chatbot-ai',
        userName: 'AI Assistant',
        image: '',
        userRoleName: 'Bot',
        createAt: new Date(),
        updateAt: new Date()
      }
    ],
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="absolute w-full h-full bg-white rounded-lg shadow-2xl transform transition-all duration-300 ease-out">
        {/* Header */}
        <div className="absolute top-6 right-6 text-white">
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/20 rounded-full transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Chat Content */}
        <div className="h-full">
          <BoxChat
            myInformationId={myInformationId}
            userId={myInformationId}
            boxChat={chatbotBoxChat}
            wsUrl="http://10.10.30.205:8001"
            isChatBot={true}
          />
        </div>
      </div>
    </div>
  );
};