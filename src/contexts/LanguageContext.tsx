
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'te';
  setLanguage: (lang: 'en' | 'te') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    'welcome': 'Welcome',
    'dashboard': 'Dashboard',
    'my_crops': 'My Crops',
    'market': 'Market',
    'tasks': 'Tasks',
    'contracts': 'Contracts',
    'wallet': 'Wallet',
    'profile': 'Profile',
    'logout': 'Logout',
    'add_new_crop': 'Add New Crop',
    'approve': 'Approve',
    'reject': 'Reject',
    'pending': 'Pending',
    'verified': 'Verified',
    'growing': 'Growing',
    'ready': 'Ready',
    'sold': 'Sold',
    'view_details': 'View Details',
    'edit_profile': 'Edit Profile',
    'notifications': 'Notifications',
    'help_support': 'Help & Support'
  },
  te: {
    'welcome': 'స్వాగతం',
    'dashboard': 'డ్యాష్‌బోర్డ్',
    'my_crops': 'నా పంటలు',
    'market': 'మార్కెట్',
    'tasks': 'పనులు',
    'contracts': 'ఒప్పందాలు',
    'wallet': 'వాలెట్',
    'profile': 'ప్రొఫైల్',
    'logout': 'లాగ్ అవుట్',
    'add_new_crop': 'కొత్త పంట జోడించండి',
    'approve': 'ఆమోదించు',
    'reject': 'తిరస్కరించు',
    'pending': 'పెండింగ్',
    'verified': 'ధృవీకరించబడింది',
    'growing': 'పెరుగుతోంది',
    'ready': 'సిద్ధం',
    'sold': 'అమ్మబడింది',
    'view_details': 'వివరాలు చూడండి',
    'edit_profile': 'ప్రొఫైల్ సవరించండి',
    'notifications': 'నోటిఫికేషన్లు',
    'help_support': 'సహాయం & మద్దతు'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<'en' | 'te'>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
