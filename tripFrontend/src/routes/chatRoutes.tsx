import { lazy } from 'react';
import { AuthMiddleware } from '@/middleware/authMiddleware.tsx';

const ChatPage = lazy(() => import('@/pages/Chat'));

export const chatRoutes = [
    {
        path: '/chats',
        element: (
            <AuthMiddleware requireAuth={true}>
                <ChatPage />
            </AuthMiddleware>
        ),
    },
];
