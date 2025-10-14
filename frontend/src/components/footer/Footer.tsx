// src/components/footer/Footer.tsx

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss'; // Імпорт SCSS модулів

// Припустімо, що ваші SVG-іконки імпортуються як компоненти
// Налаштуйте ці імпорти відповідно до вашої структури
// (Наприклад, якщо ви використовуєте @svgr/webpack)
// import LocationIcon from '@/public/icons/location.svg';
// import PhoneIcon from '@/public/icons/phone.svg';
// import EmailIcon from '@/public/icons/email.svg';

// import TelegramIcon from '@/public/icons/telegram.svg';
// import FacebookIcon from '@/public/icons/facebook.svg';
// import InstagramIcon from '@/public/icons/instagram.svg';
// import YoutubeIcon from '@/public/icons/youtube.svg';

// import SslIcon from '@/public/icons/ssl_lock.svg';
// import LocalProductIcon from '@/public/icons/local_product.svg';

// Приклад SVG для логотипу (замініть на ваш компонент або img)
const MealUpLogo = () => (
    <img src="/photo/logo.svg" alt="MealUp Logo" className={styles.logo} />
);

// Дані для футера
const quickLinks = [
    { name: 'Статті', href: '/articles' },
    { name: 'Про нас', href: '/about' },
    { name: 'Політика конфіденційності', href: '/confidentiality' },
];

const legalLinks = [
    { name: 'Умови', href: '/confidentiality' },
    { name: 'Конфіденційність', href: '/confidentiality' },
    { name: 'Файли cookie', href: '/confidentiality' },
    { name: 'Доступність', href: '/confidentiality' },
];

const partnerInfo = [
    {
        name: "Ім'я партнера",
        location: 'М. Київ, вул. Дніпровська набережна, 12',
        phone: '+380965874567',
        email: 'hello@mealup.com',
    },
    {
        name: "Ім'я партнера",
        location: 'М. Київ, вул. Дніпровська набережна, 12',
        phone: '+380965874567',
        email: 'hello@mealup.com',
    },
];

const Footer: React.FC = () => {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.mainContent}>

                    {/* Секція 1: Контакти та лого */}
                    <div className={styles.companyInfo}>
                        <div className={styles.logoContainer}>
                            <MealUpLogo />
                        </div>
                        <p className={styles.slogan}>
                            Зв'яжіться з нами – <br />
                            Разом готувати це смачніше!
                        </p>
                        
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                {/* <LocationIcon className={styles.icon} /> */}
                                <span>М. Київ, вул. Дніпровська набережна, 12</span>
                            </div>
                            <div className={styles.contactItem}>
                                {/* <PhoneIcon className={styles.icon} /> */}
                                <span>+380965874567</span>
                            </div>
                            <div className={styles.contactItem}>
                                {/* <EmailIcon className={styles.icon} /> */}
                                <span>hello@mealup.com</span>
                            </div>
                        </div>

                        {/* Соціальні мережі */}
                        <div className={styles.socials}>
                            <Link href="#" aria-label="Telegram" className={styles.socialIcon}>
                                {/* <TelegramIcon /> */}
                            </Link>
                            <Link href="#" aria-label="Facebook" className={styles.socialIcon}>
                                {/* <FacebookIcon /> */}
                            </Link>
                            <Link href="#" aria-label="Instagram" className={styles.socialIcon}>
                                {/* <InstagramIcon /> */}
                            </Link>
                            <Link href="#" aria-label="Youtube" className={styles.socialIcon}>
                                {/* <YoutubeIcon /> */}
                            </Link>
                        </div>
                    </div>

                    {/* Секція 2: Швидкі посилання */}
                    <div className={styles.quickLinks}>
                        <h4 className={styles.sectionTitle}>Швидкі посилання</h4>
                        <ul className={styles.linkList}>
                            {quickLinks.map((link) => (
                                <li key={link.name}>
                                    <Link href={link.href} className={styles.link}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Секція 3: Інформація про партнерів */}
                    <div className={styles.partnersSection}>
                        <h4 className={styles.sectionTitle}>Локації, інформація про Партнерів</h4>
                        <div className={styles.partnerList}>
                            {partnerInfo.map((partner, index) => (
                                <div key={index} className={styles.partnerInfo}>
                                    <h5 className={styles.partnerName}>{partner.name}</h5>
                                    <div className={styles.contactItem}>
                                        {/* <LocationIcon className={styles.icon} /> */}
                                        <span>{partner.location}</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        {/* <PhoneIcon className={styles.icon} /> */}
                                        <span>{partner.phone}</span>
                                    </div>
                                    <div className={styles.contactItem}>
                                        {/* <EmailIcon className={styles.icon} /> */}
                                        <span>{partner.email}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Нижня частина футера (копірайт та посилання) */}
                <div className={styles.bottomBar}>
                    <p className={styles.copyright}>
                        © MealUp. 2025 Всі права захищені
                    </p>
                    
                    {/* Юридичні посилання */}
                    <div className={styles.legalLinks}>
                        {legalLinks.map((link) => (
                            <Link key={link.name} href={link.href} className={styles.link}>
                                {link.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
            
            {/* Смуга безпеки (найнижча частина) */}
            <div className={styles.securityBar}>
                <div className={styles.securityContainer}>
                    <div className={styles.securityItem}>
                        {/* <SslIcon className={styles.securityIcon} /> */}
                        <span>SSL Захищений</span>
                    </div>
                    <div className={styles.securityItem}>
                        {/* <LocalProductIcon className={styles.securityIcon} /> */}
                        <span>Локальний продукт</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;