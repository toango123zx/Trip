import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { TReduxStoreDispatch, TReduxStoreState } from '@/store';
import { boxChatThunk } from '../../boxChatThunk';

interface ChatSidebarProps {
  onSelectChat: (boxChatId: string) => void;
  selectedChatId?: string;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({ 
  onSelectChat, 
  selectedChatId 
}) => {
  const dispatch = useDispatch<TReduxStoreDispatch>();
  const boxChats = useSelector((state: TReduxStoreState) => state.boxChat.boxChats);
  const loading = useSelector((state: TReduxStoreState) => state.boxChat.loading);
  
  // State cho tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Gọi API lấy danh sách boxChat
    dispatch(boxChatThunk.getBoxChats());
  }, [dispatch]);

  // Lọc danh sách chat theo tên
  const filteredChats = boxChats.filter(chat =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Xử lý thay đổi input tìm kiếm
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Xóa tìm kiếm
  const clearSearch = () => {
    setSearchTerm('');
  };

  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">Tin nhắn</h2>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full pl-10 pr-10 py-2 bg-gray-100 rounded-full border-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <svg 
            className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500"
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          
          {/* Clear button */}
          {searchTerm && (
            <button
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          )}
        </div>
        
        {/* Search results count */}
        {searchTerm && (
          <div className="mt-2 text-xs text-gray-500">
            {filteredChats.length > 0 
              ? `Tìm thấy ${filteredChats.length} cuộc trò chuyện`
              : 'Không tìm thấy cuộc trò chuyện nào'
            }
          </div>
        )}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4 text-center text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
            Đang tải...
          </div>
        ) : filteredChats.length === 0 ? (
          <div className="p-4 text-center text-gray-500">
            {searchTerm ? (
              <div>
                <div className="text-4xl mb-2">🔍</div>
                <p>Không tìm thấy cuộc trò chuyện</p>
                <p className="text-xs mt-1">Thử tìm kiếm với từ khóa khác</p>
              </div>
            ) : (
              <div>
                <div className="text-4xl mb-2">💬</div>
                <p>Chưa có cuộc trò chuyện nào</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1 p-2">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => onSelectChat(chat.id)}
                className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 hover:bg-gray-100 hover:shadow-sm ${
                  selectedChatId === chat.id 
                    ? 'bg-blue-50 border-l-4 border-blue-500 shadow-sm' 
                    : ''
                }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-sm font-semibold text-white">
                      {chat.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-sm"></div>
                </div>

                {/* Chat Info */}
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {/* Highlight search term */}
                      {searchTerm ? (
                        <HighlightText text={chat.name} highlight={searchTerm} />
                      ) : (
                        chat.name
                      )}
                    </h3>
                    <span className="text-xs text-gray-500">
                      {/* Có thể thêm thời gian sau */}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 truncate">
                    Nhấn để bắt đầu trò chuyện
                  </p>
                </div>

                {/* Selected indicator */}
                {selectedChatId === chat.id && (
                  <div className="ml-2">
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Component để highlight từ khóa tìm kiếm
interface HighlightTextProps {
  text: string;
  highlight: string;
}

const HighlightText: React.FC<HighlightTextProps> = ({ text, highlight }) => {
  if (!highlight.trim()) {
    return <span>{text}</span>;
  }

  const regex = new RegExp(`(${highlight})`, 'gi');
  const parts = text.split(regex);

  return (
    <span>
      {parts.map((part, i) => 
        regex.test(part) ? (
          <mark key={i} className="bg-yellow-200 text-gray-900 px-1 rounded">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
};

// Helper function có thể dùng sau này
const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  
  if (hours < 1) return 'Vừa xong';
  if (hours < 24) return `${hours}h`;
  return new Date(date).toLocaleDateString('vi-VN');
};