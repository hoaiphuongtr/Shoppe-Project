import { createContext, useState } from 'react';
import { ExtendPurchase } from 'src/types/purchase.type';
import { User } from 'src/types/user.type';
import { getAccessTokenFromLS, getProfileFromLS } from 'src/utils/auth';

interface AppContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    profile: User | null;
    setProfile: React.Dispatch<React.SetStateAction<User | null>>;
    extendedPurchases: ExtendPurchase[],
    setExtendedPurchase: React.Dispatch<React.SetStateAction<ExtendPurchase[]>>,
    reset: () => void
}
const initialAppContext: AppContextType = {
    isAuthenticated: Boolean(getAccessTokenFromLS()),
    setIsAuthenticated: () => null,
    profile: getProfileFromLS(),
    setProfile: () => null,
    extendedPurchases: [],
    setExtendedPurchase: () => null,
    reset: () => null
};
export const AppContext = createContext<AppContextType>(initialAppContext);
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(
        initialAppContext.isAuthenticated
    );
    const [profile, setProfile] = useState<User | null>(
        initialAppContext.profile
    );
    const [extendedPurchases, setExtendedPurchase] = useState<ExtendPurchase[]>(initialAppContext.extendedPurchases)
    const reset = () => {
        setIsAuthenticated(false);
        setProfile(null);
        setExtendedPurchase([])
    }
    return (
        <AppContext.Provider
            value={{ isAuthenticated, setIsAuthenticated, profile, setProfile, extendedPurchases, setExtendedPurchase, reset }}
        >
            {children}
        </AppContext.Provider>
    );
};
