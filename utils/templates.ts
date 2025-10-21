import { PasswordEntry } from '@/types';

/**
 * Template passwords for new users
 * These are sample passwords that help users understand the app's capabilities
 */
export const TEMPLATE_PASSWORDS: PasswordEntry[] = [
  {
    id: "template-1",
    title: "Facebook",
    username: "your_username",
    email: "your.email@example.com",
    password: "YourSecurePassword123!",
    url: "https://facebook.com",
    category: "Social",
    notes: "Personal social media account - Replace with your actual credentials",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: true
  },
  {
    id: "template-2", 
    title: "Gmail",
    username: "your.email@gmail.com",
    email: "your.email@gmail.com",
    password: "YourEmailPassword456#",
    url: "https://gmail.com",
    category: "Work",
    notes: "Primary email account - Update with your real email and password",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: false
  },
  {
    id: "template-3",
    title: "Chase Bank",
    username: "your_username",
    email: "your.email@example.com", 
    password: "YourBankPassword789$",
    url: "https://chase.com",
    category: "Finance",
    notes: "Banking account - Replace with your actual bank credentials",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: true
  },
  {
    id: "template-4",
    title: "Amazon",
    username: "your_username",
    email: "your.email@example.com",
    password: "YourShoppingPassword2024@",
    url: "https://amazon.com",
    category: "Shopping", 
    notes: "Online shopping account - Update with your Amazon credentials",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: false
  },
  {
    id: "template-5",
    title: "Netflix",
    username: "your.email@example.com",
    email: "your.email@example.com",
    password: "YourStreamingPassword!",
    url: "https://netflix.com",
    category: "Entertainment",
    notes: "Streaming service - Replace with your Netflix login details",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: false
  },
  {
    id: "template-6",
    title: "GitHub",
    username: "your_username",
    email: "your.email@example.com",
    password: "YourDevPassword123#",
    url: "https://github.com",
    category: "Work",
    notes: "Development platform - Update with your GitHub credentials",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: true
  }
];

/**
 * Check if passwords are template passwords
 */
export const isTemplatePassword = (password: PasswordEntry): boolean => {
  return password.id.startsWith('template-');
};

/**
 * Get template passwords with a note that they're examples
 */
export const getTemplatePasswords = (): PasswordEntry[] => {
  return TEMPLATE_PASSWORDS.map(template => ({
    ...template,
    notes: `${template.notes} (This is a template - replace with your actual credentials)`
  }));
};
