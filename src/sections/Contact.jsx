export default function Contact() {
  return (
    <section id="contact" className="contact">
      <h2>Get in Touch</h2>
      <p>Have questions? Want to place a custom order? We'd love to hear from you!</p>
      
      <div className="contact-info">
        <div className="contact-item">
          <span>📞</span>
          <a href="tel:+918105750221">81057 50221</a>
        </div>
        
        <div className="contact-item">
          <span>📷</span>
          <a 
            href="https://instagram.com/bannada_daara_21" 
            target="_blank" 
            rel="noopener noreferrer"
          >
            @bannada_daara_21
          </a>
        </div>
        
        <div className="contact-item">
          <span>✉️</span>
          <a href="mailto:lavanyajyothigudde@gmail.com">
            lavanyajyothigudde@gmail.com
          </a>
        </div>
      </div>
    </section>
  );
}
