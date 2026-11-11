import { useEffect, useState } from 'react';
import { Menu, ShieldCheck } from 'lucide-react';
import { BrandLogo } from '@/components/layout/BrandLogo';
import type { Page } from '@/lib/types';

type SiteHeaderProps = {
  page: Page;
  onNavigate: (page: Page) => void;
  onGoSection: (id: string) => void;
  onOpenAdmin: () => void;
};

export function SiteHeader({ page, onNavigate, onGoSection, onOpenAdmin }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [page]);

  function goToPage(nextPage: Page) {
    setMenuOpen(false);
    onNavigate(nextPage);
  }

  function goToSection(id: string) {
    setMenuOpen(false);
    onGoSection(id);
  }

  return (
    <header className="site-header">
      <a className="brand-lockup" href="#inicio" aria-label="D’Lu Store inicio" onClick={(event) => { event.preventDefault(); goToPage({ name: 'home' }); }}><BrandLogo /></a>
      <nav className={`main-nav ${menuOpen ? 'is-open' : ''}`}>
        <a href="#inicio" className={page.name === 'home' ? 'active' : ''} onClick={(event) => { event.preventDefault(); goToPage({ name: 'home' }); }}>Inicio</a>
        <a href="#/marcas" className={page.name === 'brands' || page.name === 'brand' ? 'active' : ''} onClick={(event) => { event.preventDefault(); goToPage({ name: 'brands' }); }}>Marcas</a>
        <a href="#catalogo" onClick={(event) => { event.preventDefault(); goToSection('catalogo'); }}>Catálogo</a>
        <a href="#empresa" onClick={(event) => { event.preventDefault(); goToSection('empresa'); }}>Nosotros</a>
        <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
        <button className="nav-admin" onClick={() => { setMenuOpen(false); onOpenAdmin(); }}><ShieldCheck size={16} /> Acceso administrativo</button>
      </nav>
      <div className="header-actions"><button className="ghost-button desktop-only" onClick={onOpenAdmin}><ShieldCheck size={16} /> Acceso administrativo</button><button className="menu-button" aria-label="Abrir menú" onClick={() => setMenuOpen(!menuOpen)}><Menu size={22} /></button></div>
    </header>
  );
}
