export interface User {
    id: string;
    email?: string;
    profile?: {
        display_name?: string;
        character_class?: string;
        bio?: string;
        level?: number;
    };
    user_metadata?: {
        [key: string]: any;
    };
}

export interface IAuthService {
    login(email: string): Promise<{ error: Error | null }>;
    logout(): Promise<{ error: Error | null }>;
    getUser(): Promise<{ user: User | null; error: Error | null }>;
    getSession(): Promise<{ session: unknown; error: Error | null }>;
    updateProfile(data: { displayName?: string; bio?: string; characterClass?: string }): Promise<{ error: Error | null }>;
}
