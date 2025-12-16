export default function Header() {
  return (
    <header>
      <div className="header-content">
        <div className="header-logo">
          <img src="/logo.png" alt="Bannada Daara Logo" />
          <strong>Bannada Daara</strong>
        </div>

        <a
          href="https://wa.me/918105750221"
          target="_blank"
          rel="noopener noreferrer"
          className="whatsapp-btn"
          aria-label="Order on WhatsApp"
        >
          📱 Order on WhatsApp
        </a>
      </div>
    </header>
  );
}
