import React from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css';
import { Link } from 'react-router-dom';

const FooterComponent: React.FC = () => {
  return (
    <footer className="footer" lang="fa">
      <div className="footer-container">
        <div className="footer-section">
          <h3 className="footer-title">کنسرتیفای</h3>

        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">دسته‌بندی‌های محبوب</h4>
          <ul className="footer-list">
            <li>کنسرت‌های موسیقی</li>
            <li>تئاترها</li>
            <li>فیلم‌ها</li>
            <li>همایش‌ها</li>
            <li>کارگاه‌های آموزشی</li>
          </ul>
        </div>
        <div className="footer-section">
          <h4 className="footer-subtitle">لینک‌های مهم</h4>
          <ul className="footer-list">
            <li>درباره ما</li>
            <li>تماس با ما</li>
            <li>پرسش‌های متداول</li>
            <Link to="/events/recent" style={{color: "#ffeba7"}}>
            <li>آخرین پست‌ها</li>
            </Link>
          </ul>
        </div>
        <div className="footer-section">

        </div>
        {/* <div className="footer-social"> */}
        {/* </div> */}
      </div>
          <span>ما را دنبال کنید:</span>
          <FaFacebookF />
          <FaTwitter />
          <FaInstagram />
          <FaLinkedinIn />
      <div className="footer-bottom">
        <p>© ۲۰۲۴ کنسرتیفای. کلیه حقوق محفوظ است.</p>
      </div>
    </footer>
  );
};

export default FooterComponent;
