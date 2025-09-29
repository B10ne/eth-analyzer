    // frontend/src/components/auth/AuthForm.tsx
    import { useState } from 'react';
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
    import { toast } from 'sonner';
    import { useAuth } from '@/contexts/AuthContext'; // Import useAuth
    import { useNavigate } from 'react-router-dom'; // Import useNavigate

    export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth(); // Gunakan hook useAuth
    const navigate = useNavigate(); // Gunakan hook useNavigate

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!isLogin && password !== confirmPassword) {
        toast.error("Passwords do not match.");
        setIsLoading(false);
        return;
        }
        
        const endpoint = isLogin ? 'http://localhost:8000/api/auth/login' : 'http://localhost:8000/api/auth/register';

        try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();

        if (response.ok) {
            toast.success(data.message || (isLogin ? 'Login successful!' : 'Registration successful!'));
            if (isLogin) {
            // PENTING: Panggil fungsi login dan arahkan pengguna
            login(data.access_token); // Asumsikan API mengembalikan access_token
            navigate('/'); // Arahkan ke halaman utama/dashboard
            }
        } else {
            toast.error(data.detail || `An error occurred during ${isLogin ? 'login' : 'registration'}.`);
        }
        } catch (error) {
        console.error("API call failed:", error);
        toast.error('Failed to connect to the server. Please try again later.');
        } finally {
        setIsLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen">
        <Card className="w-[380px]">
            <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">{isLogin ? 'Login' : 'Register'}</CardTitle>
            <CardDescription>
                {isLogin ? 'Enter your credentials to access your account.' : 'Create a new account in one click.'}
            </CardDescription>
            </CardHeader>
            <CardContent>
            <form onSubmit={handleSubmit}>
                <div className="grid gap-4">
                <Input
                    id="email"
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                {!isLogin && (
                    <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Register')}
                </Button>
                </div>
            </form>

            <div className="mt-4 text-center text-sm text-muted-foreground">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <a
                href="#"
                className="font-medium text-primary hover:underline"
                onClick={(e) => {
                    e.preventDefault();
                    setIsLogin(!isLogin);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                }}
                >
                {isLogin ? 'Register' : 'Login'}
                </a>
            </div>
            </CardContent>
        </Card>
        </div>
    );
    }