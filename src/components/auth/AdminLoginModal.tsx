import { useState, type FormEvent } from 'react';
import { LogIn, X } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import { supabase } from '@/lib/supabase';

type AdminLoginModalProps = {
  open: boolean;
  onClose: () => void;
  onSuccess: (email: string) => void;
};

export function AdminLoginModal({ open, onClose, onSuccess }: AdminLoginModalProps) {
  const [authLoading, setAuthLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [authError, setAuthError] = useState('');

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); setAuthError(''); setAuthLoading(true);
    const form = new FormData(event.currentTarget);
    const email = String(form.get('email') ?? ''); const password = String(form.get('password') ?? '');
    if (!supabase) { setAuthError('La conexión segura aún no está disponible.'); setAuthLoading(false); return; }
    const result = isRegistering
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    setAuthLoading(false);
    if (result.error) { setAuthError(isRegistering ? 'No se pudo crear la cuenta. Verifica los datos.' : 'Correo o contraseña incorrectos.'); return; }
    if (isRegistering && !result.data.session) { setAuthError('Cuenta creada. Revisa tu correo para confirmar el acceso.'); return; }
    if (!result.data.session) { setAuthError('No se pudo validar la sesión.'); return; }
    onSuccess(result.data.user?.email ?? email);
  }

  if (!open) return null;

  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}><div className="login-modal"><button className="close-button" onClick={onClose}><X size={18} /></button><div className="login-mark"><BrandLogo /></div><div className="section-kicker">Área protegida</div><h2>Acceso administrativo</h2><p>Ingresa para gestionar el catálogo independiente de D’Lu Store.</p><form onSubmit={login}><label>Correo electrónico<input name="email" type="email" required placeholder="tu@empresa.com" /></label><label>Contraseña<input name="password" type="password" required placeholder="••••••••" /></label>{authError && <div className="form-error">{authError}</div>}<button className="primary-button full-width" disabled={authLoading}>{authLoading ? 'Verificando...' : <><LogIn size={17} /> {isRegistering ? 'Crear cuenta' : 'Iniciar sesión'}</>}</button></form><button className="switch-auth" onClick={() => { setIsRegistering(!isRegistering); setAuthError(''); }}>{isRegistering ? 'Ya tengo una cuenta' : 'Crear una cuenta administrativa'}</button><small className="shortcut-hint">Atajo rápido: Ctrl + 9 · alternativa Ctrl + Shift + 9</small></div></div>;
}
