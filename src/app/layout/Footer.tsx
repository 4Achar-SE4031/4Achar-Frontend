// Footer.tsx

import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';
import { Link } from 'react-router-dom';
import logo from "../../../public/concertify-logo.png"

const FooterComponent: React.FC = () => {
  return (
    <footer className="footer" lang="fa">
      <div className="footer-container">
        <div className="footer-section text-right">
          <h3 className="footer-title">کنسرتیفای</h3>
          <img src={logo} alt="Concertify Logo" />
        </div>

        <div className="footer-section text-right">
          <h4 className="footer-subtitle">دسته‌بندی‌های محبوب</h4>
          <ul className="footer-list">
            <li>کنسرت‌های موسیقی</li>
            <li>تئاترها</li>
            <li>فیلم‌ها</li>
            <li>همایش‌ها</li>
            <li>کارگاه‌های آموزشی</li>
          </ul>
        </div>

        <div className="footer-section text-right">
          <h4 className="footer-subtitle">لینک‌های مهم</h4>
          <ul className="footer-list">
            <li>درباره ما</li>
            <li>تماس با ما</li>
            <li>پرسش‌های متداول</li>
            <Link to="/events/recent" style={{ color: "#ffeba7" }}>
              <li>آخرین پست‌ها</li>
            </Link>
          </ul>
        </div>

        <div className="footer-section">
          {/* You can add another section or leave empty */}
        </div>
      </div>

      <div className="footer-social"style={{ display: 'flex' }}>
        <span>ما را در شبکه‌های اجتماعی دنبال کنید:</span>

        {/* Wrap each icon with an <a> tag, set `aria-label`, `href`, and other props */}
        <a
          href="https://www.facebook.com"
          aria-label="Facebook"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaFacebookF />
        </a>
        <a
          href="https://www.twitter.com"
          aria-label="Twitter"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaTwitter />
        </a>
        <a
          href="https://www.instagram.com"
          aria-label="Instagram"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaInstagram />
        </a>
        <a
          href="https://www.linkedin.com"
          aria-label="LinkedIn"
          target="_blank"
          rel="noopener noreferrer"
        >
          <FaLinkedinIn />
        </a>
      </div>

      <div className="footer-bottom">
        <p>© ۲۰۲۴ کنسرتیفای. کلیه حقوق محفوظ است.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
