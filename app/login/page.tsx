'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Smartphone,
  Lock,
  Mail,
  User,
  Building2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Info,
  X,
  Phone,
  Check,
  KeyRound,
  MailCheck,
  RefreshCw,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';
import {
  loginAsync,
  registerClientAsync,
  getActiveSession,
  setActiveSession,
  logout,
  updateUserPasswordAsync,
} from '@/lib/auth';
import { supabase, SUPABASE_URL, getAppBaseUrl, saveBusinessToSupabase } from '@/lib/supabase';
import { AuthUser } from '@/types/auth';
import { Business } from '@/types/business';

interface SupabaseUserMetadata {
  full_name?: string;
  name?: string;
  avatar_url?: string;
  picture?: string;
  [key: string]: unknown;
}

function GoogleOfficialIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab');
        if (tabParam === 'register' || tabParam === 'trial') {
          return 'register';
        }
      } catch {}
    }
    return 'login';
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // Google OAuth Guide Modal
  const [showGoogleGuideModal, setShowGoogleGuideModal] = useState(false);

  // First-time Google Onboarding state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [googleUserData, setGoogleUserData] = useState<{ email: string; name: string } | null>(null);
  const [onboardBusinessName, setOnboardBusinessName] = useState('');
  const [onboardCategory, setOnboardCategory] = useState('');
  const [onboardPhone, setOnboardPhone] = useState('');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [regBusinessName, setRegBusinessName] = useState('');
  const [regCategory, setRegCategory] = useState('');

  // Selected plan state (Starter, PRO, Enterprise)
  const [selectedPlan, setSelectedPlan] = useState<'STARTER' | 'PRO' | 'ENTERPRISE'>(() => {
    if (typeof window !== 'undefined') {
      try {
        const params = new URLSearchParams(window.location.search);
        const planParam = params.get('plan')?.toUpperCase();
        if (planParam === 'STARTER' || planParam === 'PRO' || planParam === 'ENTERPRISE') {
          localStorage.setItem('tapcard_selected_plan', planParam);
          return planParam;
        }
        const cachedPlan = localStorage.getItem('tapcard_selected_plan')?.toUpperCase();
        if (cachedPlan === 'STARTER' || cachedPlan === 'PRO' || cachedPlan === 'ENTERPRISE') {
          return cachedPlan;
        }
        localStorage.setItem('tapcard_selected_plan', 'PRO');
      } catch {}
    }
    return 'PRO';
  });

  const handleSelectPlan = (plan: 'STARTER' | 'PRO' | 'ENTERPRISE') => {
    setSelectedPlan(plan);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('tapcard_selected_plan', plan);
      } catch {}
    }
  };

  // OTP Verification state for Email registration
  const [registerStep, setRegisterStep] = useState<'FORM' | 'OTP'>('FORM');
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // OTP Countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (registerStep === 'OTP' && resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [registerStep, resendTimer]);

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length > 0) {
        const nextOtp = [...otp];
        digits.forEach((d, i) => {
          if (index + i < 6) {
            nextOtp[index + i] = d;
          }
        });
        setOtp(nextOtp);
        const focusIdx = Math.min(index + digits.length, 5);
        inputRefs.current[focusIdx]?.focus();
      }
      return;
    }

    const cleanDigit = value.replace(/\D/g, '');
    const nextOtp = [...otp];
    nextOtp[index] = cleanDigit;
    setOtp(nextOtp);

    if (cleanDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleVerifyOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = otp.join('').trim();
    if (token.length !== 6) {
      setErrorMsg('Por favor introduce el código de 6 dígitos completo.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsVerifying(true);

    try {
      const cleanEmail = regEmail.toLowerCase().trim();

      // 1. Verify token with Supabase Auth
      const { error } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token,
        type: 'signup',
      });

      if (error) {
        setIsVerifying(false);
        setErrorMsg(
          error.message?.toLowerCase().includes('expired') || error.message?.toLowerCase().includes('invalid')
            ? 'El código OTP es incorrecto o ha expirado. Por favor revísalo o solicita uno nuevo.'
            : error.message || 'Código OTP inválido.'
        );
        return;
      }

      // 2. Complete provisioning in app_users and businesses
      const res = await registerClientAsync({
        userName: regName.trim(),
        email: cleanEmail,
        pass: regPassword.trim(),
        businessName: regBusinessName.trim(),
        category: regCategory,
        plan: selectedPlan,
      });

      setIsVerifying(false);
      if (res.success && res.user) {
        router.push('/dashboard');
      } else {
        setErrorMsg(res.error || 'Error al completar el registro.');
      }
    } catch (err: unknown) {
      setIsVerifying(false);
      const msg = err instanceof Error ? err.message : 'Error al verificar el código OTP';
      setErrorMsg(msg);
    }
  };

  const handleResendOtp = async () => {
    if (resendTimer > 0 || isResending) return;
    setIsResending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: regEmail.toLowerCase().trim(),
      });

      setIsResending(false);
      if (error) {
        setErrorMsg(error.message || 'Error al reenviar el código');
      } else {
        setSuccessMsg('¡Código OTP reenviado con éxito a tu correo!');
        setResendTimer(60);
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch (err: unknown) {
      setIsResending(false);
      const msg = err instanceof Error ? err.message : 'Error al reenviar el código';
      setErrorMsg(msg);
    }
  };

  // Password Recovery (Forgot Password) state
  const [forgotStep, setForgotStep] = useState<'IDLE' | 'EMAIL' | 'OTP' | 'NEW_PASSWORD' | 'SUCCESS'>('IDLE');
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [recoveryTimer, setRecoveryTimer] = useState(60);
  const [isRecoverySending, setIsRecoverySending] = useState(false);
  const [isRecoveryVerifying, setIsRecoveryVerifying] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const recoveryInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Recovery countdown timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (forgotStep === 'OTP' && recoveryTimer > 0) {
      timer = setInterval(() => {
        setRecoveryTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [forgotStep, recoveryTimer]);

  const handleRecoveryOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      if (digits.length > 0) {
        const nextOtp = [...recoveryOtp];
        digits.forEach((d, i) => {
          if (index + i < 6) {
            nextOtp[index + i] = d;
          }
        });
        setRecoveryOtp(nextOtp);
        const focusIdx = Math.min(index + digits.length, 5);
        recoveryInputRefs.current[focusIdx]?.focus();
      }
      return;
    }

    const cleanDigit = value.replace(/\D/g, '');
    const nextOtp = [...recoveryOtp];
    nextOtp[index] = cleanDigit;
    setRecoveryOtp(nextOtp);

    if (cleanDigit && index < 5) {
      recoveryInputRefs.current[index + 1]?.focus();
    }
  };

  const handleRecoveryOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !recoveryOtp[index] && index > 0) {
      recoveryInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowLeft' && index > 0) {
      recoveryInputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      recoveryInputRefs.current[index + 1]?.focus();
    }
  };

  const handleSendRecoveryEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = recoveryEmail.toLowerCase().trim();
    if (!cleanEmail) {
      setErrorMsg('Por favor ingresa tu correo electrónico.');
      return;
    }

    setIsRecoverySending(true);

    try {
      // 1. Check if user exists in app_users
      const { data: dbUser } = await supabase
        .from('app_users')
        .select('id, email, password_hash')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (!dbUser) {
        setIsRecoverySending(false);
        setErrorMsg('No encontramos ninguna cuenta registrada con este correo electrónico.');
        return;
      }

      if (dbUser.password_hash === 'google-oauth-linked') {
        setIsRecoverySending(false);
        setErrorMsg('Esta cuenta fue registrada con Google. Puedes acceder de forma directa con el botón "Continuar con Google".');
        return;
      }

      // 2. Send recovery OTP email via Supabase Auth
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(cleanEmail);

      setIsRecoverySending(false);
      if (resetError) {
        setErrorMsg(resetError.message || 'Error al enviar código de recuperación.');
        return;
      }

      setForgotStep('OTP');
      setRecoveryTimer(60);
      setRecoveryOtp(['', '', '', '', '', '']);
      setSuccessMsg(`Hemos enviado un código OTP de 6 dígitos a ${cleanEmail}`);
      setTimeout(() => {
        recoveryInputRefs.current[0]?.focus();
      }, 150);
    } catch (err: unknown) {
      setIsRecoverySending(false);
      const msg = err instanceof Error ? err.message : 'Error al enviar código de recuperación';
      setErrorMsg(msg);
    }
  };

  const handleResendRecoveryOtp = async () => {
    if (recoveryTimer > 0 || isRecoverySending) return;
    setIsRecoverySending(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    try {
      const cleanEmail = recoveryEmail.toLowerCase().trim();
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail);

      setIsRecoverySending(false);
      if (error) {
        setErrorMsg(error.message || 'Error al reenviar código.');
      } else {
        setSuccessMsg('¡Código de recuperación reenviado con éxito a tu correo!');
        setRecoveryTimer(60);
        setRecoveryOtp(['', '', '', '', '', '']);
        recoveryInputRefs.current[0]?.focus();
      }
    } catch (err: unknown) {
      setIsRecoverySending(false);
      const msg = err instanceof Error ? err.message : 'Error al reenviar código';
      setErrorMsg(msg);
    }
  };

  const handleVerifyRecoveryOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const token = recoveryOtp.join('').trim();
    if (token.length !== 6) {
      setErrorMsg('Por favor ingresa el código de 6 dígitos completo.');
      return;
    }

    setErrorMsg(null);
    setSuccessMsg(null);
    setIsRecoveryVerifying(true);

    try {
      const cleanEmail = recoveryEmail.toLowerCase().trim();

      // Verify OTP with type 'recovery'
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: cleanEmail,
        token,
        type: 'recovery',
      });

      setIsRecoveryVerifying(false);
      if (verifyError) {
        setErrorMsg(
          verifyError.message?.toLowerCase().includes('expired') || verifyError.message?.toLowerCase().includes('invalid')
            ? 'El código OTP es incorrecto o ha expirado. Por favor solicita uno nuevo.'
            : verifyError.message || 'Código OTP inválido.'
        );
        return;
      }

      setForgotStep('NEW_PASSWORD');
      setNewPassword('');
      setConfirmPassword('');
      setSuccessMsg('Código validado con éxito. Ahora ingresa tu nueva contraseña.');
    } catch (err: unknown) {
      setIsRecoveryVerifying(false);
      const msg = err instanceof Error ? err.message : 'Error al validar código';
      setErrorMsg(msg);
    }
  };

  const handleSaveNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const hasMinLength = newPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(newPassword);
    const hasNumber = /[0-9]/.test(newPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(newPassword);

    if (!hasMinLength || !hasUpper || !hasNumber || !hasSpecial) {
      const missing: string[] = [];
      if (!hasMinLength) missing.push('mínimo 8 caracteres');
      if (!hasUpper) missing.push('1 mayúscula');
      if (!hasNumber) missing.push('1 número');
      if (!hasSpecial) missing.push('1 carácter especial (!@#$%...)');

      setErrorMsg(`La nueva contraseña debe cumplir: ${missing.join(', ')}.`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Las contraseñas no coinciden. Por favor verifícalas.');
      return;
    }

    setIsLoading(true);

    try {
      const cleanEmail = recoveryEmail.toLowerCase().trim();

      // 1. Update Supabase Auth user password
      try {
        await supabase.auth.updateUser({ password: newPassword });
      } catch (authErr) {
        console.warn('Notice updating Supabase Auth user password:', authErr);
      }

      // 2. Update in app_users and local storage cache
      await updateUserPasswordAsync(cleanEmail, newPassword);

      setIsLoading(false);
      setForgotStep('SUCCESS');
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Error al guardar la nueva contraseña';
      setErrorMsg(msg);
    }
  };

  // Check active session, plan parameter, and Google OAuth callback on mount
  useEffect(() => {

    const session = getActiveSession();
    if (session) {
      if (session.role === 'SUPER_ADMIN') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
      return;
    }

    // Authenticate user against Supabase and prevent duplicate onboarding
    async function processAuthUser(user: { email?: string; user_metadata?: SupabaseUserMetadata }) {
      try {
        const email = user.email?.toLowerCase().trim();
        if (!email) return;

        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          '';

        // 1. EXCLUSIVE SUPER ADMIN CHECK
        if (email === 'swipeamg@gmail.com') {
          const superAdminUser: AuthUser = {
            id: 'usr-admin-swipeamg',
            email: 'swipeamg@gmail.com',
            name: fullName || 'Super Administrador (SwipeAMG)',
            role: 'SUPER_ADMIN',
            createdAt: new Date().toISOString(),
          };
          setActiveSession(superAdminUser);
          router.push('/admin');
          return;
        }

        // 2. Check if this user is already registered in app_users
        const { data: dbUser } = await supabase
          .from('app_users')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (dbUser && (dbUser.business_id || dbUser.role === 'SUPER_ADMIN')) {
          const safeUser: AuthUser = {
            id: dbUser.id,
            email: dbUser.email,
            name: dbUser.name,
            role: dbUser.role,
            businessId: dbUser.business_id,
            businessSlug: dbUser.business_slug,
            createdAt: dbUser.created_at,
          };
          setActiveSession(safeUser);
          router.push(safeUser.role === 'SUPER_ADMIN' ? '/admin' : '/dashboard');
          return;
        }

        // 3. Fallback: Check if a business already exists with this email in businesses table
        const { data: existingBiz } = await supabase
          .from('businesses')
          .select('*')
          .eq('email', email)
          .maybeSingle();

        if (existingBiz) {
          const newUserId = 'usr-' + Date.now();
          await supabase.from('app_users').upsert(
            {
              id: newUserId,
              email: email,
              name: fullName || email.split('@')[0],
              role: 'CLIENT',
              business_id: existingBiz.id,
              business_slug: existingBiz.slug,
              password_hash: 'google-oauth-linked',
            },
            { onConflict: 'email' }
          );

          const safeUser: AuthUser = {
            id: newUserId,
            email: email,
            name: fullName || email.split('@')[0],
            role: 'CLIENT',
            businessId: existingBiz.id,
            businessSlug: existingBiz.slug,
            createdAt: new Date().toISOString(),
          };
          setActiveSession(safeUser);
          router.push('/dashboard');
          return;
        }

        // 4. New Google User: Auto-provision in Supabase cloud immediately
        // Guarantees zero duplicate registrations and instant multi-device synchronization
        setIsLoading(true);
        const newBizId = 'biz-' + Date.now();
        const newUserId = 'usr-' + Date.now();
        const displayName = fullName || email.split('@')[0];
        let slug = displayName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]/g, '-')
          .replace(/-+/g, '-')
          .replace(/^-|-$/g, '');
        if (!slug) slug = 'negocio-' + Date.now().toString(36);

        // Check slug collision in Supabase
        try {
          const { data: slugCheck } = await supabase
            .from('businesses')
            .select('id')
            .eq('slug', slug)
            .maybeSingle();
          if (slugCheck) {
            slug = `${slug}-${Math.floor(100 + Math.random() * 900)}`;
          }
        } catch {}

        const avatarUrl =
          user.user_metadata?.avatar_url ||
          user.user_metadata?.picture ||
          'https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=400&auto=format&fit=crop';

        let resolvedPlan: 'STARTER' | 'PRO' | 'ENTERPRISE' = 'PRO';
        try {
          const cachedPlan = localStorage.getItem('tapcard_selected_plan')?.toUpperCase();
          if (cachedPlan === 'STARTER' || cachedPlan === 'PRO' || cachedPlan === 'ENTERPRISE') {
            resolvedPlan = cachedPlan;
          }
        } catch {}

        const autoBusiness: Business = {
          id: newBizId,
          slug,
          name: displayName,
          isVerified: true,
          category: 'Servicios Profesionales',
          bio: `Bienvenido a la tarjeta digital e interactiva de ${displayName}. Toca para contactarme.`,
          bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200&auto=format&fit=crop',
          logoUrl: avatarUrl,
          themeColor: '#2563eb',
          phone: '',
          whatsapp: '',
          email: email,
          address: '',
          googleMapsUrl: '',
          websiteUrl: '',
          plan: resolvedPlan,
          accountStatus: 'ACTIVE',
          createdAt: new Date().toISOString(),
          cards: [],
          links: [
            {
              id: 'link-wa-' + Date.now(),
              businessId: newBizId,
              type: 'whatsapp',
              title: 'WhatsApp Oficial',
              subtitle: 'Escríbeme directamente',
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

        await saveBusinessToSupabase(autoBusiness);

        await supabase.from('app_users').upsert(
          {
            id: newUserId,
            email: email,
            name: displayName,
            role: 'CLIENT',
            business_id: newBizId,
            business_slug: slug,
            password_hash: 'google-oauth-linked',
          },
          { onConflict: 'email' }
        );

        const safeUser: AuthUser = {
          id: newUserId,
          email: email,
          name: displayName,
          role: 'CLIENT',
          businessId: newBizId,
          businessSlug: slug,
          createdAt: new Date().toISOString(),
        };

        setActiveSession(safeUser);
        setIsLoading(false);
        router.push('/dashboard');
        return;
      } catch (err) {
        console.warn('OAuth session check notice:', err);
        setIsLoading(false);
      }
    }

    // A. Check current Supabase session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      if (currentSession?.user) {
        processAuthUser(currentSession.user);
      }
    });

    // B. Listen for OAuth redirect return (when redirected with access token hash)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, authSession) => {
      if ((event === 'SIGNED_IN' || event === 'INITIAL_SESSION') && authSession?.user) {
        await processAuthUser(authSession.user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  // Handle Google OAuth trigger
  const handleGoogleSignIn = async () => {
    setErrorMsg(null);
    setIsGoogleLoading(true);

    try {
      const baseUrl = getAppBaseUrl();
      const redirectUrl = `${baseUrl}/login/`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        },
      });

      if (error) {
        setIsGoogleLoading(false);
        // If Google provider hasn't been configured in Supabase yet, show helpful guide modal
        if (
          error.message.toLowerCase().includes('not enabled') ||
          error.message.toLowerCase().includes('unsupported provider') ||
          error.message.toLowerCase().includes('provider is not')
        ) {
          setShowGoogleGuideModal(true);
        } else {
          setErrorMsg(`Error de conexión con Google: ${error.message}`);
        }
      }
    } catch (err: unknown) {
      setIsGoogleLoading(false);
      const msg = err instanceof Error ? err.message : 'Error al conectar con Google';
      setErrorMsg(msg);
    }
  };

  // Complete Google Registration with Business Onboarding
  const handleCompleteGoogleOnboarding = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!googleUserData || !onboardBusinessName.trim()) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await registerClientAsync({
        userName: googleUserData.name,
        email: googleUserData.email,
        pass: 'google-oauth-' + Date.now(),
        businessName: onboardBusinessName.trim(),
        category: onboardCategory.trim() || 'Servicios Generales',
        plan: selectedPlan,
      });

      if (res.success && res.user) {
        setIsOnboardingOpen(false);
        router.push('/dashboard');
      } else {
        setErrorMsg(res.error || 'Error al guardar los datos del negocio');
        setIsLoading(false);
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Error al completar el registro';
      setErrorMsg(msg);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await loginAsync(loginEmail, loginPassword);
      setIsLoading(false);
      if (res.success && res.user) {
        if (res.user.role === 'SUPER_ADMIN') {
          router.push('/admin');
        } else {
          router.push('/dashboard');
        }
      } else {
        setErrorMsg(res.error || 'Credenciales inválidas');
      }
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setErrorMsg(msg);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    const cleanEmail = regEmail.toLowerCase().trim();
    if (!cleanEmail || !regPassword.trim() || !regName.trim() || !regBusinessName.trim() || !regCategory.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos.');
      return;
    }

    const hasMinLength = regPassword.length >= 8;
    const hasUpper = /[A-Z]/.test(regPassword);
    const hasNumber = /[0-9]/.test(regPassword);
    const hasSpecial = /[^A-Za-z0-9]/.test(regPassword);

    if (!hasMinLength || !hasUpper || !hasNumber || !hasSpecial) {
      const missing: string[] = [];
      if (!hasMinLength) missing.push('mínimo 8 caracteres');
      if (!hasUpper) missing.push('1 mayúscula');
      if (!hasNumber) missing.push('1 número');
      if (!hasSpecial) missing.push('1 carácter especial (!@#$%...)');

      setErrorMsg(`La contraseña debe cumplir los requisitos de seguridad: falta ${missing.join(', ')}.`);
      return;
    }

    setIsLoading(true);

    try {
      // 1. Check if user already exists in Supabase app_users table
      const { data: existingAppUser } = await supabase
        .from('app_users')
        .select('id, email')
        .eq('email', cleanEmail)
        .maybeSingle();

      if (existingAppUser) {
        setIsLoading(false);
        setErrorMsg('Ya existe una cuenta activa con este correo electrónico. Por favor inicia sesión.');
        return;
      }

      // 2. Trigger Supabase Auth signUp to send the 6-digit confirmation token via email
      const { error: signUpError } = await supabase.auth.signUp({
        email: cleanEmail,
        password: regPassword,
        options: {
          data: {
            name: regName.trim(),
            business_name: regBusinessName.trim(),
          },
        },
      });

      if (signUpError) {
        setIsLoading(false);
        if (signUpError.message?.toLowerCase().includes('already registered')) {
          setErrorMsg('Este correo ya está registrado. Por favor inicia sesión con tu contraseña.');
        } else {
          setErrorMsg(signUpError.message || 'Error al iniciar el registro con correo.');
        }
        return;
      }

      setIsLoading(false);
      setRegisterStep('OTP');
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      setSuccessMsg(`Hemos enviado un código OTP de 6 dígitos a ${cleanEmail}`);
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 150);
    } catch (err: unknown) {
      setIsLoading(false);
      const msg = err instanceof Error ? err.message : 'Error al enviar código de verificación';
      setErrorMsg(msg);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Background ambient glow */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/80 backdrop-blur-md px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/20">
            <Smartphone className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight">TapCard</span>
            <span className="text-xs text-blue-400 font-semibold block -mt-1">
              Plataforma SaaS NFC
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700/60"
        >
          Volver a Inicio
        </Link>
      </header>

      {/* Main Auth Container */}
      <main className="relative z-10 max-w-md w-full mx-auto px-4 py-8">
        <div className="bg-slate-900/90 rounded-3xl border border-slate-800 p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          {registerStep === 'OTP' ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* Back to form button */}
              <button
                type="button"
                onClick={() => {
                  setRegisterStep('FORM');
                  setErrorMsg(null);
                  setSuccessMsg(null);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Volver y corregir datos</span>
              </button>

              {/* Header Title */}
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-3 shadow-lg shadow-blue-500/10">
                  <MailCheck className="w-7 h-7" />
                </div>
                <h1 className="text-2xl font-extrabold text-white tracking-tight">
                  Verifica tu Correo
                </h1>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Ingresa el código OTP de 6 dígitos que enviamos a:
                  <br />
                  <span className="text-white font-bold">{regEmail}</span>
                </p>
              </div>

              {/* Error Message */}
              {errorMsg && (
                <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Success Message */}
              {successMsg && (
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* OTP Form */}
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                <div>
                  <label className="block text-center text-xs font-semibold text-slate-300 mb-3">
                    Código de Confirmación (OTP)
                  </label>

                  {/* 6 Digit Inputs */}
                  <div className="flex justify-center items-center gap-2 sm:gap-2.5">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => {
                          inputRefs.current[idx] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border transition-all focus:outline-none ${
                          digit
                            ? 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                            : 'bg-slate-800/90 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isVerifying || otp.join('').trim().length !== 6}
                  className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isVerifying ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Verificando y activando tu cuenta...</span>
                    </>
                  ) : (
                    <>
                      <KeyRound className="w-4 h-4" />
                      <span>Verificar y Activar Cuenta</span>
                    </>
                  )}
                </button>

                {/* Resend OTP Timer & Button */}
                <div className="text-center pt-3 border-t border-slate-800">
                  <p className="text-xs text-slate-400 mb-2">¿No recibiste el código o ya expiró?</p>
                  {resendTimer > 0 ? (
                    <span className="text-xs font-medium text-slate-500">
                      Podrás reenviar un nuevo código en{' '}
                      <span className="text-blue-400 font-bold">{resendTimer}s</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isResending}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                      <span>{isResending ? 'Reenviando código...' : 'Reenviar código OTP'}</span>
                    </button>
                  )}
                </div>
              </form>
            </div>
          ) : forgotStep !== 'IDLE' ? (
            <div className="space-y-6 animate-in fade-in zoom-in-95 duration-200">
              {/* STEP 1: SOLICITAR CÓDIGO POR EMAIL */}
              {forgotStep === 'EMAIL' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('IDLE');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Volver a Iniciar Sesión</span>
                  </button>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-3 shadow-lg shadow-blue-500/10">
                      <KeyRound className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">
                      Recupera tu Contraseña
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Ingresa el correo registrado con tu cuenta. Te enviaremos un código OTP de 6 dígitos para restablecer tu acceso.
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSendRecoveryEmail} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Correo Electrónico
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={recoveryEmail}
                          onChange={(e) => setRecoveryEmail(e.target.value)}
                          placeholder="tu@negocio.com"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isRecoverySending}
                      className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                      {isRecoverySending ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Enviando código OTP...</span>
                        </>
                      ) : (
                        <>
                          <span>Enviar Código OTP</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* STEP 2: VERIFICAR CÓDIGO OTP */}
              {forgotStep === 'OTP' && (
                <>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('EMAIL');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Cambiar correo</span>
                  </button>

                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/20 border border-blue-500/30 text-blue-400 mb-3 shadow-lg shadow-blue-500/10">
                      <MailCheck className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">
                      Código de Recuperación
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Ingresa el código OTP de 6 dígitos enviado a:
                      <br />
                      <span className="text-white font-bold">{recoveryEmail}</span>
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  {successMsg && (
                    <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleVerifyRecoveryOtp} className="space-y-6">
                    <div>
                      <label className="block text-center text-xs font-semibold text-slate-300 mb-3">
                        Código de Confirmación (OTP)
                      </label>
                      <div className="flex justify-center items-center gap-2 sm:gap-2.5">
                        {recoveryOtp.map((digit, idx) => (
                          <input
                            key={idx}
                            ref={(el) => {
                              recoveryInputRefs.current[idx] = el;
                            }}
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleRecoveryOtpChange(idx, e.target.value)}
                            onKeyDown={(e) => handleRecoveryOtpKeyDown(idx, e)}
                            className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-xl sm:text-2xl font-black rounded-xl border transition-all focus:outline-none ${
                              digit
                                ? 'bg-blue-600/20 border-blue-500 text-white ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/10'
                                : 'bg-slate-800/90 border-slate-700 text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isRecoveryVerifying || recoveryOtp.join('').trim().length !== 6}
                      className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRecoveryVerifying ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Validando código...</span>
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          <span>Verificar Código</span>
                        </>
                      )}
                    </button>

                    <div className="text-center pt-3 border-t border-slate-800">
                      <p className="text-xs text-slate-400 mb-2">¿No recibiste el código o ya expiró?</p>
                      {recoveryTimer > 0 ? (
                        <span className="text-xs font-medium text-slate-500">
                          Podrás reenviar un nuevo código en{' '}
                          <span className="text-blue-400 font-bold">{recoveryTimer}s</span>
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={handleResendRecoveryOtp}
                          disabled={isRecoverySending}
                          className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors disabled:opacity-50"
                        >
                          <RefreshCw className={`w-3.5 h-3.5 ${isRecoverySending ? 'animate-spin' : ''}`} />
                          <span>{isRecoverySending ? 'Reenviando...' : 'Reenviar código OTP'}</span>
                        </button>
                      )}
                    </div>
                  </form>
                </>
              )}

              {/* STEP 3: CREAR NUEVA CONTRASEÑA */}
              {forgotStep === 'NEW_PASSWORD' && (
                <>
                  <div className="text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
                      <ShieldCheck className="w-7 h-7" />
                    </div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">
                      Crea tu Nueva Contraseña
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                      Elige una nueva contraseña segura para tu cuenta:
                      <br />
                      <span className="text-white font-bold">{recoveryEmail}</span>
                    </p>
                  </div>

                  {errorMsg && (
                    <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
                      <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveNewPassword} className="space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Nueva Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Mínimo 8 caracteres"
                          className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>

                      {/* Indicadores en tiempo real de seguridad */}
                      <div className="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            Requisitos de seguridad
                          </span>
                          <span
                            className={`text-[9px] font-bold ${
                              newPassword.length >= 8 &&
                              /[A-Z]/.test(newPassword) &&
                              /[0-9]/.test(newPassword) &&
                              /[^A-Za-z0-9]/.test(newPassword)
                                ? 'text-emerald-400'
                                : 'text-amber-400'
                            }`}
                          >
                            {newPassword.length >= 8 &&
                            /[A-Z]/.test(newPassword) &&
                            /[0-9]/.test(newPassword) &&
                            /[^A-Za-z0-9]/.test(newPassword)
                              ? 'Segura ✓'
                              : 'Requerida'}
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              newPassword.length >= 8 ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                newPassword.length >= 8
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {newPassword.length >= 8 ? '✓' : '•'}
                            </div>
                            <span>8+ caracteres</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              /[A-Z]/.test(newPassword) ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                /[A-Z]/.test(newPassword)
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {/[A-Z]/.test(newPassword) ? '✓' : '•'}
                            </div>
                            <span>1 mayúscula (A-Z)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              /[0-9]/.test(newPassword) ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                /[0-9]/.test(newPassword)
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {/[0-9]/.test(newPassword) ? '✓' : '•'}
                            </div>
                            <span>1 número (0-9)</span>
                          </div>

                          <div
                            className={`flex items-center gap-1.5 transition-colors ${
                              /[^A-Za-z0-9]/.test(newPassword)
                                ? 'text-emerald-400 font-semibold'
                                : 'text-slate-500'
                            }`}
                          >
                            <div
                              className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                                /[^A-Za-z0-9]/.test(newPassword)
                                  ? 'bg-emerald-500/20 text-emerald-400'
                                  : 'bg-slate-800 text-slate-500'
                              }`}
                            >
                              {/[^A-Za-z0-9]/.test(newPassword) ? '✓' : '•'}
                            </div>
                            <span>1 símbolo (!@#$...)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Confirmar Nueva Contraseña *
                      </label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          required
                          minLength={8}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repite la nueva contraseña"
                          className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          tabIndex={-1}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                        >
                          {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      {confirmPassword && (
                        <div className="mt-1 text-[10px] flex items-center gap-1 font-semibold">
                          {newPassword === confirmPassword ? (
                            <span className="text-emerald-400 flex items-center gap-1">
                              <Check className="w-3 h-3" /> Las contraseñas coinciden
                            </span>
                          ) : (
                            <span className="text-rose-400">Las contraseñas no coinciden</span>
                          )}
                        </div>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                    >
                      {isLoading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Guardando nueva contraseña...</span>
                        </>
                      ) : (
                        <>
                          <ShieldCheck className="w-4 h-4" />
                          <span>Guardar Nueva Contraseña</span>
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}

              {/* STEP 4: ÉXITO */}
              {forgotStep === 'SUCCESS' && (
                <div className="text-center py-4 space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 shadow-xl shadow-emerald-500/20">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-extrabold text-white tracking-tight">
                      ¡Contraseña Actualizada!
                    </h1>
                    <p className="text-xs text-slate-400 mt-2 leading-relaxed max-w-xs mx-auto">
                      Tu contraseña ha sido restablecida con éxito. Ya puedes iniciar sesión con tus nuevas credenciales.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('IDLE');
                      setActiveTab('login');
                      setLoginEmail(recoveryEmail);
                      setLoginPassword('');
                      setErrorMsg(null);
                      setSuccessMsg('Contraseña actualizada con éxito. Inicia sesión con tus nuevas credenciales.');
                    }}
                    className="w-full py-3.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2"
                  >
                    <span>Iniciar Sesión Ahora</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Header Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 mb-3 shadow-inner">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">
              {activeTab === 'login' ? 'Iniciar Sesión' : 'Crea tu Negocio Digital'}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              {activeTab === 'login'
                ? 'Accede a tu panel para personalizar tus tarjetas y enlaces'
                : 'Registra tu negocio y obtén 30 días de prueba gratis sin tarjeta'}
            </p>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-800/80 p-1 rounded-2xl mb-6 border border-slate-700/60">
            <button
              type="button"
              onClick={() => {
                setActiveTab('login');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'login'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Iniciar Sesión
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('register');
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'register'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Prueba Gratis (Registro)
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-800 text-xs text-rose-300 flex items-center gap-2 animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Success Message */}
          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* PLAN SELECTION SELECTOR (Ubicado justo debajo de las pestañas en el flujo de Registro) */}
          {activeTab === 'register' && (
            <div className="space-y-1.5 mb-5 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-semibold text-slate-300">
                  Selecciona tu Plan (Prueba 30 días gratis) *
                </label>
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" /> Sin tarjeta hoy
                </span>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* STARTER */}
                <button
                  type="button"
                  onClick={() => handleSelectPlan('STARTER')}
                  className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    selectedPlan === 'STARTER'
                      ? 'bg-blue-600/15 border-blue-500 shadow-md shadow-blue-500/10 ring-1 ring-blue-500'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        selectedPlan === 'STARTER' ? 'text-blue-400' : 'text-slate-400'
                      }`}>
                        Starter
                      </span>
                      {selectedPlan === 'STARTER' && (
                        <span className="w-3.5 h-3.5 rounded-full bg-blue-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">$49</div>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1 leading-tight">
                    1-3 Tarjetas
                  </span>
                </button>

                {/* PRO */}
                <button
                  type="button"
                  onClick={() => handleSelectPlan('PRO')}
                  className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    selectedPlan === 'PRO'
                      ? 'bg-blue-600/20 border-cyan-400 shadow-md shadow-cyan-500/15 ring-1 ring-cyan-400'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <div className="absolute -top-2 right-1.5 px-1.5 py-0.2 rounded-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white text-[7px] font-black uppercase tracking-wider">
                    Popular
                  </div>
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        selectedPlan === 'PRO' ? 'text-cyan-300' : 'text-slate-400'
                      }`}>
                        PRO
                      </span>
                      {selectedPlan === 'PRO' && (
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 text-slate-900 flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">$69</div>
                  </div>
                  <span className="text-[9px] text-cyan-300/90 block mt-1 leading-tight">
                    4-8 + Acrílico
                  </span>
                </button>

                {/* ENTERPRISE */}
                <button
                  type="button"
                  onClick={() => handleSelectPlan('ENTERPRISE')}
                  className={`p-2 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    selectedPlan === 'ENTERPRISE'
                      ? 'bg-purple-600/15 border-purple-500 shadow-md shadow-purple-500/10 ring-1 ring-purple-500'
                      : 'bg-slate-800/60 border-slate-700/80 hover:border-slate-600 text-slate-400'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-bold uppercase tracking-wider ${
                        selectedPlan === 'ENTERPRISE' ? 'text-purple-400' : 'text-slate-400'
                      }`}>
                        Enterprise
                      </span>
                      {selectedPlan === 'ENTERPRISE' && (
                        <span className="w-3.5 h-3.5 rounded-full bg-purple-500 text-white flex items-center justify-center">
                          <Check className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                    <div className="text-sm font-black text-white mt-0.5">$99</div>
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-1 leading-tight">
                    8-12 + Acrílico
                  </span>
                </button>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-slate-800/50 border border-slate-700/50 text-[11px] text-slate-300 flex items-center justify-between">
                <span>
                  Plan asignado:{' '}
                  <strong className="text-white">
                    {selectedPlan === 'STARTER' && 'Plan Starter ($49/mes)'}
                    {selectedPlan === 'PRO' && 'Plan PRO ($69/mes • Recomendado)'}
                    {selectedPlan === 'ENTERPRISE' && 'Plan Enterprise ($99/mes)'}
                  </strong>
                </span>
                <span className="text-emerald-400 font-semibold text-[10px]">30 días gratis</span>
              </div>
            </div>
          )}

          {/* GOOGLE SIGN-IN BUTTON */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading}
              className="w-full py-3 px-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-3 border border-slate-300 group disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <div className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              ) : (
                <GoogleOfficialIcon className="w-4 h-4" />
              )}
              <span>
                {activeTab === 'login' ? 'Continuar con Google' : 'Registrarme con Google'}
              </span>
            </button>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-slate-900 px-3 text-[11px] font-semibold text-slate-500 uppercase tracking-wider relative">
                o con correo
              </span>
              <div className="border-t border-slate-800 w-full" />
            </div>
          </div>

          {/* LOGIN FORM */}
          {activeTab === 'login' ? (
            <form onSubmit={handleLoginSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Correo Electrónico
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="tu@negocio.com"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotStep('EMAIL');
                      setRecoveryEmail(loginEmail || '');
                      setErrorMsg(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-semibold text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    required
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowLoginPassword(!showLoginPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showLoginPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Iniciando sesión...' : 'Entrar al Panel'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* REGISTER FORM */
            <form onSubmit={handleRegisterSubmit} className="space-y-3.5 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre de tu Negocio o Marca *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regBusinessName}
                    onChange={(e) => setRegBusinessName(e.target.value)}
                    placeholder="Ej. Tacos El Pastor, Clínica Dental..."
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Giro o Categoría *
                </label>
                <input
                  type="text"
                  required
                  value={regCategory}
                  onChange={(e) => setRegCategory(e.target.value)}
                  placeholder="Ej. Restaurante, Salón de Belleza, Consultoría..."
                  className="w-full px-3.5 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tu Nombre Completo *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Ej. Alejandro Pérez"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico (Tu usuario) *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="contacto@miempresa.com"
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Contraseña Segura *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Mínimo 8 caracteres (Mayús, núm, símbolo)"
                    className="w-full pl-10 pr-10 py-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                    tabIndex={-1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                  >
                    {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Indicadores en tiempo real de seguridad de contraseña */}
                <div className="mt-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Requisitos de contraseña
                    </span>
                    <span
                      className={`text-[9px] font-bold ${
                        regPassword.length >= 8 &&
                        /[A-Z]/.test(regPassword) &&
                        /[0-9]/.test(regPassword) &&
                        /[^A-Za-z0-9]/.test(regPassword)
                          ? 'text-emerald-400'
                          : 'text-amber-400'
                      }`}
                    >
                      {regPassword.length >= 8 &&
                      /[A-Z]/.test(regPassword) &&
                      /[0-9]/.test(regPassword) &&
                      /[^A-Za-z0-9]/.test(regPassword)
                        ? 'Segura ✓'
                        : 'Requerida'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 text-[10px]">
                    <div
                      className={`flex items-center gap-1.5 transition-colors ${
                        regPassword.length >= 8 ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          regPassword.length >= 8
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {regPassword.length >= 8 ? '✓' : '•'}
                      </div>
                      <span>8+ caracteres</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 transition-colors ${
                        /[A-Z]/.test(regPassword) ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          /[A-Z]/.test(regPassword)
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {/[A-Z]/.test(regPassword) ? '✓' : '•'}
                      </div>
                      <span>1 mayúscula (A-Z)</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 transition-colors ${
                        /[0-9]/.test(regPassword) ? 'text-emerald-400 font-semibold' : 'text-slate-500'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          /[0-9]/.test(regPassword)
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {/[0-9]/.test(regPassword) ? '✓' : '•'}
                      </div>
                      <span>1 número (0-9)</span>
                    </div>

                    <div
                      className={`flex items-center gap-1.5 transition-colors ${
                        /[^A-Za-z0-9]/.test(regPassword)
                          ? 'text-emerald-400 font-semibold'
                          : 'text-slate-500'
                      }`}
                    >
                      <div
                        className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] ${
                          /[^A-Za-z0-9]/.test(regPassword)
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-slate-800 text-slate-500'
                        }`}
                      >
                        {/[^A-Za-z0-9]/.test(regPassword) ? '✓' : '•'}
                      </div>
                      <span>1 símbolo (!@#$...)</span>
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
              >
                <span>{isLoading ? 'Creando tu cuenta y tienda...' : 'Comenzar Mi Prueba Gratis'}</span>
                <Sparkles className="w-4 h-4" />
              </button>

              <div className="pt-2 text-center">
                <span className="text-[11px] text-slate-400 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>30 días de prueba gratis • Sin registrar tarjeta</span>
                </span>
              </div>
            </form>
          )}

          {/* Footer note inside card */}
          <div className="mt-6 pt-4 border-t border-slate-800 text-center">
            {activeTab === 'login' ? (
              <p className="text-xs text-slate-400">
                ¿Aún no tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('register')}
                  className="font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Regístrate e inicia tu prueba gratis
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                ¿Ya tienes una cuenta registrada?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('login')}
                  className="font-bold text-blue-400 hover:text-blue-300 hover:underline"
                >
                  Inicia sesión aquí
                </button>
              </p>
            )}
          </div>
            </>
          )}
        </div>
      </main>

      {/* MODAL 1: FIRST TIME GOOGLE USER ONBOARDING (Crea el negocio del cliente) */}
      {isOnboardingOpen && googleUserData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8">
            <button
              type="button"
              onClick={async () => {
                await logout();
                setIsOnboardingOpen(false);
                setGoogleUserData(null);
              }}
              title="Cerrar y volver al login"
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-600/20 text-blue-400 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
              </div>
              <h2 className="text-xl font-extrabold text-white">
                ¡Bienvenido a TapCard NFC!
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Conectado como <strong className="text-white">{googleUserData.email}</strong>. Configura tu negocio en 1 solo paso para generar tu tarjeta digital.
              </p>
            </div>

            <form onSubmit={handleCompleteGoogleOnboarding} className="space-y-4">
              {/* PLAN SELECTOR IN ONBOARDING */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-semibold text-slate-300">
                    Plan seleccionado (Prueba 30 días gratis) *
                  </label>
                  <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> Sin cobro hoy
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => handleSelectPlan('STARTER')}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedPlan === 'STARTER'
                        ? 'bg-blue-600/15 border-blue-500 ring-1 ring-blue-500'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold block text-blue-400">Starter</span>
                    <span className="text-xs font-bold text-white">$49</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPlan('PRO')}
                    className={`p-2 rounded-xl border text-left transition-all relative ${
                      selectedPlan === 'PRO'
                        ? 'bg-blue-600/20 border-cyan-400 ring-1 ring-cyan-400'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold block text-cyan-300">PRO</span>
                    <span className="text-xs font-bold text-white">$69</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleSelectPlan('ENTERPRISE')}
                    className={`p-2 rounded-xl border text-left transition-all ${
                      selectedPlan === 'ENTERPRISE'
                        ? 'bg-purple-600/15 border-purple-500 ring-1 ring-purple-500'
                        : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <span className="text-[10px] font-bold block text-purple-400">Enterprise</span>
                    <span className="text-xs font-bold text-white">$99</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Nombre de tu Empresa o Negocio *
                </label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    autoFocus
                    value={onboardBusinessName}
                    onChange={(e) => setOnboardBusinessName(e.target.value)}
                    placeholder="Ej. Mariscos Los Arcos, Salón Bella..."
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Giro o Categoría Comercial *
                </label>
                <input
                  type="text"
                  required
                  value={onboardCategory}
                  onChange={(e) => setOnboardCategory(e.target.value)}
                  placeholder="Ej. Restaurante, Clínica Estética, Inmobiliaria..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  WhatsApp o Teléfono (Opcional)
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={onboardPhone}
                    onChange={(e) => setOnboardPhone(e.target.value)}
                    placeholder="+52 55 1234 5678"
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-xs font-medium text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-600/30 transition-all active:scale-95 flex items-center justify-center gap-2 mt-4"
              >
                <span>{isLoading ? 'Creando perfil digital...' : 'Comenzar a Diseñar mi Tarjeta'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={async () => {
                  await logout();
                  setIsOnboardingOpen(false);
                  setGoogleUserData(null);
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-400 hover:text-white font-semibold text-xs transition-colors border border-slate-700/60 text-center"
              >
                Cancelar e iniciar con otra cuenta
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: GUÍA PASO A PASO PARA ACTIVAR GOOGLE EN SUPABASE */}
      {showGoogleGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-slate-900 rounded-3xl border border-slate-700 shadow-2xl p-6 sm:p-8">
            <button
              onClick={() => setShowGoogleGuideModal(false)}
              className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center flex-shrink-0">
                <Info className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Activar Google en Supabase</h3>
                <p className="text-xs text-slate-400">Guía rápida de 3 pasos para habilitar el inicio de sesión real</p>
              </div>
            </div>

            <div className="space-y-3 text-xs text-slate-300 bg-slate-950/60 p-4 rounded-2xl border border-slate-800">
              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">1</span>
                <div>
                  <p className="font-semibold text-white">Entra a tu consola de Supabase:</p>
                  <p className="text-slate-400 mt-0.5">Ve a <strong>Authentication &gt; Providers</strong> y haz clic en <strong>Google</strong>.</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">2</span>
                <div>
                  <p className="font-semibold text-white">Copia tu URL de Callback de Supabase:</p>
                  <div className="mt-1 p-2 rounded-lg bg-slate-900 border border-slate-700 font-mono text-[10px] text-cyan-300 break-all select-all">
                    {SUPABASE_URL}/auth/v1/callback
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">Pega esta URL en tu consola de Google Cloud (OAuth 2.0 Client ID).</p>
                </div>
              </div>

              <div className="flex gap-2.5">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center flex-shrink-0 text-[10px]">3</span>
                <div>
                  <p className="font-semibold text-white">Activa el interruptor en Supabase:</p>
                  <p className="text-slate-400 mt-0.5">Pega el <strong>Client ID</strong> y <strong>Client Secret</strong> que te da Google y presiona <strong>Save</strong>.</p>
                </div>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-3">
              <span className="text-[11px] text-slate-500">Mientras tanto, el registro manual por formulario funciona al 100%.</span>
              <button
                type="button"
                onClick={() => setShowGoogleGuideModal(false)}
                className="py-2 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
              >
                Entendido
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="relative z-10 text-center py-6 text-xs text-slate-500">
        TapCard SaaS Multi-Tenant • Tarjetas NFC & QR Corporativas
      </footer>
    </div>
  );
}
