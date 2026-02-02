export interface UserProfile {
    display_name?: string;
    character_class?: string;
    bio?: string;
    level?: number;
}

/**
 * Represents a user in the system.
 */
export interface User {
    id: string;
    email?: string;
    profile?: UserProfile;
    user_metadata?: {
        [key: string]: unknown;
    };
}

/**
 * Interface defining the authentication service operations.
 */
export interface IAuthService {
    /**
     * Signs in a user with their email.
     */
    login(email: string): Promise<{ error: Error | null }>;

    /**
     * Signs out the current user.
     */
    logout(): Promise<{ error: Error | null }>;

    /**
     * Retrieves the current authenticated user.
     */
    getUser(): Promise<{ user: User | null; error: Error | null }>;

    /**
     * Retrieves the current session.
     */
    getSession(): Promise<{ session: unknown; error: Error | null }>;

    /**
     * Updates the user's profile information.
     */
    updateProfile(data: { displayName?: string; bio?: string; characterClass?: string }): Promise<{ error: Error | null }>;
}
