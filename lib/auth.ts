import { AuthUser } from '@/types/auth';
import { Business } from '@/types/business';
import {
  mockNexoBusiness,
  mockRestaurantBusiness,
  mockSalonBusiness,
} from '@/lib/mock-data';

const SESSION_STORAGE_KEY = 'tapcard_current_auth_session';
const REGISTERED_USERS_KEY = 'tapcard_saas_registered_users';
const BUSINESSES_KEY = 'tapcard_saas_all_businesses';

export const SUPER_ADMIN_ACCOUNT: AuthUser = {
  id: 'usr-admin-001',
  email: 'admin@tapcard.com',
  name: 'Super Administrador (Tú)',
  role: 'SUPER_ADMIN',
  createdAt: '2026-01-01T00:00:00Z',
};

const DEFAULT_USERS: Array<AuthUser & { passwordHash: string }> = [
  {
    ...SUPER_ADMIN_ACCOUNT,
    passwordHash: 'admin123',
  },
  {
    id: 'usr-nexo-002',
    email: 'nexo@empresa.com',
    name: 'Roberto Gómez (Nexo)',
    role: 'CLIENT',
    businessId: 'biz-nexo-001',
    businessSlug: 'nexosoluciones',
    createdAt: '2026-01-15T09:00:00Z',
    passwordHash: 'nexo123',
  },
  {
    id: 'usr-fuego-003',
    email: 'fuego@grill.com',
    name: 'Chef Carlos (Fuego & Leña)',
    role: 'CLIENT',
    businessId: 'biz-fuego-002',
    businessSlug: 'fuego-lena-grill',
    createdAt: '2026-02-01T10:00:00Z',
    passwordHash: 'fuego123',
  },
  {
    id: 'usr-aura-004',
    email: 'aura@spa.com',
    name: 'Mariana Silva (Aura Nails)',
    role: 'CLIENT',
    businessId: 'biz-aura-003',
    businessSlug: 'aura-beauty-spa',
    createdAt: '2026-03-05T11:00:00Z',
    passwordHash: 'aura123',
  },
];

// Helper to get registered users list
function getStoredUsers(): Array<AuthUser & { passwordHash: string }> {
  if (typeof window === 'undefined') return DEFAULT_USERS;
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(DEFAULT_USERS));
  return DEFAULT_USERS;
}

// Get current active session
export function getActiveSession(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch {}
  return null;
}

// Set active session
export function setActiveSession(user: AuthUser | null) {
  if (typeof window === 'undefined') return;
  try {
    if (user) {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    }
  } catch {}
}

// Login with email and password
export function login(
  email: string,
  pass: string
): { success: boolean; user?: AuthUser; error?: string } {
  const cleanEmail = email.toLowerCase().trim();
  const cleanPass = pass.trim();

  const users = getStoredUsers();
  const found = users.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.passwordHash === cleanPass
  );

  if (!found) {
    return {
      success: false,
      error: 'Correo o contraseña incorrectos. Verifica tus credenciales.',
    };
  }

  const { passwordHash: _, ...safeUser } = found;
  setActiveSession(safeUser);
  return { success: true, user: safeUser };
}

// Register a new client with their own business
export function registerClient(params: {
  userName: string;
  email: string;
  pass: string;
  businessName: string;
  category: string;
}): { success: boolean; user?: AuthUser; error?: string } {
  const cleanEmail = params.email.toLowerCase().trim();
  const users = getStoredUsers();

  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'Ya existe una cuenta con este correo electrónico.' };
  }

  // Generate unique slug
  let slug = params.businessName
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-');
  if (!slug) slug = 'negocio-' + Date.now().toString(36);

  const newBusinessId = 'biz-' + Date.now();
  const newUserId = 'usr-' + Date.now();

  // Create the new business record
  const newBusiness: Business = {
    id: newBusinessId,
    slug,
    name: params.businessName.trim(),
    isVerified: true,
    category: params.category.trim() || 'Servicios Generales',
    bio: `Bienvenido al perfil interactivo oficial de ${params.businessName.trim()}. Toca para conectar con nosotros.`,
    bannerUrl: '',
    logoUrl: '',
    themeColor: '#2563eb',
    phone: '',
    whatsapp: '',
    email: cleanEmail,
    address: '',
    googleMapsUrl: '',
    websiteUrl: '',
    plan: 'PRO',
    accountStatus: 'ACTIVE',
    createdAt: new Date().toISOString(),
    cards: [],
    links: [
      {
        id: 'link-wa-' + Date.now(),
        businessId: newBusinessId,
        type: 'whatsapp',
        title: 'WhatsApp Oficial',
        subtitle: 'Escríbenos en tiempo real',
        url: 'https://wa.me/',
        iconName: 'whatsapp',
        order: 1,
        isActive: true,
        highlighted: true,
      },
    ],
    quickAccess: {
      enabled: true,
      showPhone: true,
      showEmail: true,
      showMaps: false,
      showCatalog: false,
    },
  };

  // Save new business to all businesses list
  try {
    let currentBusinesses: Business[] = [
      mockNexoBusiness,
      mockRestaurantBusiness,
      mockSalonBusiness,
    ];
    const rawList = localStorage.getItem(BUSINESSES_KEY);
    if (rawList) {
      const parsed = JSON.parse(rawList);
      if (Array.isArray(parsed)) currentBusinesses = parsed;
    }
    currentBusinesses = [newBusiness, ...currentBusinesses];
    localStorage.setItem(BUSINESSES_KEY, JSON.stringify(currentBusinesses));

    // Also set as active business data
    localStorage.setItem('tapcard_business_data_nexo', JSON.stringify(newBusiness));
    localStorage.setItem('tapcard_active_business_id', newBusinessId);
  } catch (e) {
    console.error('Error saving new business in register', e);
  }

  // Create new user
  const newUser: AuthUser & { passwordHash: string } = {
    id: newUserId,
    email: cleanEmail,
    name: params.userName.trim(),
    role: 'CLIENT',
    businessId: newBusinessId,
    businessSlug: slug,
    createdAt: new Date().toISOString(),
    passwordHash: params.pass.trim(),
  };

  const updatedUsers = [...users, newUser];
  try {
    localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify(updatedUsers));
  } catch {}

  const { passwordHash: _, ...safeUser } = newUser;
  setActiveSession(safeUser);
  return { success: true, user: safeUser };
}

// Logout
export function logout() {
  setActiveSession(null);
}
