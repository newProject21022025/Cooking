// src/app/[locale]/confidentiality/page.tsx

import React from 'react';
// Припустімо, що ви використовуєте глобальні стилі або окремий SCSS для сторінки
// В цьому прикладі використаємо умовний styles.privacyPage
// Якщо ви використовуєте Tailwind CSS, ви можете замінити класи.
import styles from './page.module.scss'; 

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className={styles.privacyPage}>
            <div className={styles.container}>
                {/* Заголовок */}
                <header className={styles.header}>
                    <h1 className={styles.title}>Політика конфіденційності MealUp</h1>
                    <p className={styles.date}>Останнє оновлення: 3 жовтня 2025 року</p>
                </header>

                {/* Вступний текст */}
                <p className={styles.introduction}>
                    MealUp поважає вашу конфіденційність і прагне захищати ваші персональні дані. Ця політика конфіденційності пояснює,
                    які дані ми збираємо, як їх використовуємо і зберігаємо, а також ваші права у зв'язку з цим.
                </p>

                {/* Розділ 1: Інформація, яку ми збираємо */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>1. Інформація, яку ми збираємо</h2>
                    <p className={styles.sectionText}>
                        Ми можемо збирати такі дані:
                    </p>
                    <p className={styles.sectionText}>
                        Персональні дані, які ви надаєте під час реєстрації або замовлення: ім'я, електронна адреса, телефон, адреса доставки.
                    </p>
                    <p className={styles.sectionText}>
                        Інформація про використання сайту: переглянуті сторінки, обраний товар, історія замовлень.
                    </p>
                    <p className={styles.sectionText}>
                        Технічні дані: IP-адреса, тип браузера, налаштування пристрою.
                    </p>
                    <p className={styles.sectionText}>
                        Файли cookie для покращення користувацького досвіду та персоналізації контенту.
                    </p>
                </section>

                {/* Розділ 2: Як ми використовуємо інформацію */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>2. Як ми використовуємо інформацію</h2>
                    <p className={styles.sectionText}>
                        Ваші дані використовуються для:
                    </p>
                    <p className={styles.sectionText}>
                        Обробки замовлень і доставки страв.
                    </p>
                    <p className={styles.sectionText}>
                        Надсилання підтверджень, оновлень замовлень та сервісних повідомлень.
                    </p>
                    <p className={styles.sectionText}>
                        Персоналізації контенту і рекомендацій на сайті.
                    </p>
                    <p className={styles.sectionText}>
                        Покращення роботи сайту та наших сервісів.
                    </p>
                    <p className={styles.sectionText}>
                        Зв'язку з вами у разі запитів або пропозицій.
                    </p>
                </section>

                {/* Розділ 3: Передача даних третім особам */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>3. Передача даних третім особам</h2>
                    <p className={styles.sectionText}>
                        Ми не продаємо ваші дані третім особам. Можливо передавати їх:
                    </p>
                    <p className={styles.sectionText}>
                        Постачальникам послуг: доставці, обробки платежів для виконання замовлень.
                    </p>
                    <p className={styles.sectionText}>
                        Командам-партнерам, які допомагають підтримувати роботу сайту.
                    </p>
                    <p className={styles.sectionText}>
                        У разі вимоги закону або для захисту прав MealUp.
                    </p>
                </section>

                {/* Розділ 4: Зберігання даних */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>4. Зберігання даних</h2>
                    <p className={styles.sectionText}>
                        Ми зберігаємо ваші персональні дані лише стільки, скільки необхідно для надання послуг або дотримання законодавства.
                        Після цього дані анонімізуються або видаляються.
                    </p>
                </section>

                {/* Розділ 5: Ваші права */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>5. Ваші права</h2>
                    <p className={styles.sectionText}>
                        Ви маєте право:
                    </p>
                    <p className={styles.sectionText}>
                        Дізнатися, які дані ми зберігаємо про вас.
                    </p>
                    <p className={styles.sectionText}>
                        Виправити неточності у ваших даних.
                    </p>
                    <p className={styles.sectionText}>
                        Вимагати видалення персональних даних (за винятком випадків, передбачених законом).
                    </p>
                    <p className={styles.sectionText}>
                        Відмовитися від отримання маркетингових повідомлень.
                    </p>
                </section>

                {/* Розділ 6: Файли cookie */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>6. Файли cookie</h2>
                    <p className={styles.sectionText}>
                        Сайт MealUp використовує сookies для:
                    </p>
                    <p className={styles.sectionText}>
                        Забезпечення коректної роботи сайту.
                    </p>
                    <p className={styles.sectionText}>
                        Персоналізації контенту.
                    </p>
                    <p className={styles.sectionText}>
                        Аналітики та покращення сервісу.
                    </p>
                    <p className={styles.sectionText}>
                        Ви можете налаштувати свій браузер для відмови від сookies, але деякі функції сайту можуть бути недоступні.
                    </p>
                </section>

                {/* Розділ 7: Безпека */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>7. Безпека</h2>
                    <p className={styles.sectionText}>
                        Ми застосовуємо технічні та організаційні заходи для захисту ваших даних від несанкціонованого доступу, втрати або зміни.
                    </p>
                </section>

                {/* Розділ 8: Контакти */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>8. Контакти</h2>
                    <p className={styles.sectionText}>
                        Якщо у вас є питання щодо політики конфіденційності, пишіть на:
                    </p>
                    <p className={styles.sectionText}>
                        Email: <a href="mailto:support@mealup.com" className={styles.emailLink}>support@mealup.com</a>
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;