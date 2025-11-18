// src/components/footer/Footer.tsx

// src/components/footer/Footer.tsx

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss'; 
import MealUpLogo from '@/svg/Logo/Logo'; 
import PartnersInfoFooter from '@/components/partners/PartnersListFooter';

// 1. ІМПОРТУЄМО useTranslations
import { useTranslations } from 'next-intl';

import TelegramIcon from '@/svg/TelegramIcon/TelegramIcon';
import FacebookIcon from '@/svg/FacebookIcon/FacebookIcon';
import InstagramIcon from '@/svg/InstagramIcon/InstagramIcon';
import YoutubeIcon from '@/svg/YoutubeIcon/YoutubeIcon';

import SslIcon from '@/svg/SslIcon/SslIcon';
import LocalProductIcon from '@/svg/LocalProductIcon/LocalProductIcon';

// 2. Виносимо константи з перекладеними ключами (замість хардкодованих імен)
// Ключі для швидких посилань
const QUICK_LINK_KEYS = [
    { key: 'articles', href: '/articles' },
    { key: 'aboutUs', href: '/about' },
    { key: 'privacyPolicy', href: '/confidentiality' },
];

// Ключі для юридичних посилань
const LEGAL_LINK_KEYS = [
    { key: 'terms', href: '/confidentiality' },
    { key: 'privacy', href: '/confidentiality' },
    { key: 'cookies', href: '/confidentiality' },
    { key: 'accessibility', href: '/confidentiality' },
];


const Footer: React.FC = () => {
    // 3. ІНІЦІАЛІЗАЦІЯ ПЕРЕКЛАДУ (припускаємо простір імен "Footer")
    const t = useTranslations('Footer');

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.mainContent}>

                    {/* Секція 1: Контакти та лого */}
                    <div className={styles.companyInfo}>
                        <div className={styles.logoContainer}>
                            <MealUpLogo />
                        </div>
                        {/* 4. Перекладаємо слоган */}
                        <p className={styles.slogan}>
                            {t.rich('slogan', {
                                br: () => <br />,
                            })}
                        </p>

                        {/* Статичні контакти - краще винести їх у переклади, якщо вони можуть змінюватися */}
                        <div className={styles.contactInfo}>
                            {/* 5. Перекладаємо адресу */}
                            <div className={styles.contactItem}>
                                <span>{t('address')}</span>
                            </div>
                            {/* Телефон та Email (зазвичай статичні або винесені в конфіг/API) */}
                            <div className={styles.contactItem}>
                                <span>+380965874567</span> 
                            </div>
                            <div className={styles.contactItem}>
                                <span>hello@mealup.com</span>
                            </div>
                        </div>

                        {/* Соціальні мережі */}
                        <div className={styles.socials}>
                            {/* aria-label залишаємо статичним, або також перекладаємо (якщо потрібно) */}
                            <Link href="#" aria-label="Telegram" className={styles.socialIcon}>
                                <TelegramIcon />
                            </Link>
                            <Link href="#" aria-label="Facebook" className={styles.socialIcon}>
                                <FacebookIcon />
                            </Link>
                            <Link href="#" aria-label="Instagram" className={styles.socialIcon}>
                                <InstagramIcon />
                            </Link>
                            <Link href="#" aria-label="Youtube" className={styles.socialIcon}>
                                <YoutubeIcon />
                            </Link>
                        </div>
                    </div>

                    {/* Секція 2: Швидкі посилання */}
                    <div className={styles.quickLinks}>
                        {/* 6. Перекладаємо заголовок секції */}
                        <h4 className={styles.sectionTitle}>{t('quickLinksTitle')}</h4> 
                        <ul className={styles.linkList}>
                            {QUICK_LINK_KEYS.map((link) => (
                                <li key={link.key}>
                                    <Link href={link.href} className={styles.link}>
                                        {/* 7. Перекладаємо назви посилань */}
                                        {t(`quickLinks.${link.key}`)} 
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Секція 3: Інформація про партнерів (переклад вже налаштований у PartnersInfoFooter) */}
                    <div className={styles.partnersSection}>
                        <PartnersInfoFooter/>
                    </div>
                </div>

                {/* Нижня частина футера (копірайт та посилання) */}
                <div className={styles.bottomBar}>
                    {/* 8. Перекладаємо копірайт */}
                    <p className={styles.copyright}>
                        {t('copyright', { year: 2025 })}
                    </p>
                    
                    {/* Юридичні посилання */}
                    <div className={styles.legalLinks}>
                        {LEGAL_LINK_KEYS.map((link) => (
                            <Link key={link.key} href={link.href} className={styles.link}>
                                {/* 9. Перекладаємо юридичні посилання */}
                                {t(`legalLinks.${link.key}`)} 
                            </Link>
                        ))}
                    </div>
                </div>
                
                {/* Смуга безпеки (найнижча частина) */}
                <div className={styles.securityBar}>
                    <div className={styles.securityContainer}>
                        <div className={styles.securityItem}>
                            {/* <SslIcon className={styles.securityIcon} /> */}
                            {/* 10. Перекладаємо статус безпеки */}
                            <span>{t('sslProtected')}</span> 
                        </div>
                        <div className={styles.securityItem}>
                            {/* <LocalProductIcon className={styles.securityIcon} /> */}
                            {/* 11. Перекладаємо статус продукту */}
                            <span>{t('localProduct')}</span> 
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;