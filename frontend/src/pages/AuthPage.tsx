    // frontend/src/pages/AuthPage.tsx
    import AuthForm from '@/components/auth/AuthForm';
    import {useEffect } from 'react';

    export default function AuthPage() {
        useEffect(() => {
            // Mengubah judul halaman browser
            document.title = 'Auth | EthAnalyzer';
            }, []);

    return (
        <div className="flex min-h-screen items-center justify-center bg-background">
        <AuthForm />
        </div>
    );
    }