export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer>
      <div className="footer-content">
        <p>© {currentYear} Bannada Daara. All rights reserved.</p>
        <p style={{ marginTop: '0.5rem', fontSize: '0.9rem', opacity: 0.8 }}>
          Handmade with 💚 | Eco-friendly • Sustainable • Upcycled
        </p>
      </div>
    </footer>
  );
}
