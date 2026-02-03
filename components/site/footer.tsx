export function Footer() {
  return (
    <footer className="border-t border-border py-10 text-sm text-white/70">
      <div className="container flex flex-col md:flex-row justify-between gap-6">
        <div>
          <p className="text-lg font-semibold text-white">GiftCardPro</p>
          <p className="mt-2">Gift cards digitais com entrega rápida e segura.</p>
        </div>
        <div className="space-y-2">
          <p className="text-white font-semibold">Ajuda</p>
          <p>Suporte WhatsApp</p>
          <p>Política de reembolso</p>
          <p>Termos de uso</p>
        </div>
      </div>
    </footer>
  );
}
