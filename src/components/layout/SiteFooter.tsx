import { BrandLogo } from '@/components/layout/BrandLogo';

type SiteFooterProps = {
  onGoBrands: () => void;
};

export function SiteFooter({ onGoBrands }: SiteFooterProps) {
  return (
    <footer id="contacto"><div className="footer-brand"><BrandLogo /><p>Tu tienda online de tecnología.</p></div><div><small>CONTACTO</small><p>ventas@dlustore.com<br />Lima, Perú</p></div><div><small>EXPLORA</small><p><a href="#/marcas" onClick={(event) => { event.preventDefault(); onGoBrands(); }}>Marcas oficiales</a><br />Redes y WiFi</p></div><div className="footer-note">Catálogo independiente<br />© 2025 D’Lu Store</div></footer>
  );
}
