// src/components/footer/Footer.tsx

import React from 'react';
import Link from 'next/link';
import styles from './Footer.module.scss'; 
import MealUpLogo from '@/svg/Logo/Logo'; 
import PartnersInfoFooter from '@/components/partners/PartnersListFooter';


// import LocationIcon from '@/svg/LocationIcon/LocationIcon';
// import PhoneIcon from '@/svg/PhoneIcon/PhoneIcon';
// import EmailIcon from '@/svg/EmailIcon/EmailIcon';

import TelegramIcon from '@/svg/TelegramIcon/TelegramIcon';
import FacebookIcon from '@/svg/FacebookIcon/FacebookIcon';
import InstagramIcon from '@/svg/InstagramIcon/InstagramIcon';
import YoutubeIcon from '@/svg/YoutubeIcon/YoutubeIcon';

import SslIcon from '@/svg/SslIcon/SslIcon';
import LocalProductIcon from '@/svg/LocalProductIcon/LocalProductIcon';

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

// const partnerInfo = [
//     {
//         name: "Ім'я партнера",
//         location: 'М. Київ, вул. Дніпровська набережна, 12',
//         phone: '+380965874567',
//         email: 'hello@mealup.com',
//     },
//     {
//         name: "Ім'я партнера",
//         location: 'М. Київ, вул. Дніпровська набережна, 12',
//         phone: '+380965874567',
//         email: 'hello@mealup.com',
//     },
// ];

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
                            Зв&apos;яжіться з нами – <br />
                            Разом готувати це смачніше!
                        </p>

                                              
                        <div className={styles.contactInfo}>
                            <div className={styles.contactItem}>
                                
                                <span>М. Київ, вул. Дніпровська набережна, 12</span>
                            </div>
                            <div className={styles.contactItem}>
                                
                                <span>+380965874567</span>
                            </div>
                            <div className={styles.contactItem}>
                               
                                <span>hello@mealup.com</span>
                            </div>
                        </div>

                        {/* Соціальні мережі */}
                        <div className={styles.socials}>
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
                    <PartnersInfoFooter/>
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