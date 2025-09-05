// src/app/[locale]/admin/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import styles from "./page.module.scss";
import { User } from "@/types/user";
import { getAllUsers, blockUser, unblockUser, deleteUser as deleteUserApi } from "@/api/usersApi";
import { useTranslations, useLocale } from "next-intl";

interface UsersPageProps {
  params: { locale: string };
}

export default function UsersPage({ params }: UsersPageProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const locale = useLocale();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Помилка при отриманні користувачів:", error);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Безпечне блокування/розблокування
  const handleBlockToggle = async (user: User) => {
    if (!user.id) return; // якщо id null — нічого не робимо
    try {
      if (user.isBlocked) {
        await unblockUser(user.id);
      } else {
        await blockUser(user.id);
      }
      await fetchUsers();
    } catch (error) {
      console.error("Помилка при зміні статусу:", error);
    }
  };

  // 🔹 Безпечне видалення користувача
  const handleDeleteUser = async (userId: string | null | undefined) => {
    if (!userId) return; // перевірка
    if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return;

    try {
      await deleteUserApi(userId);
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Помилка при видаленні користувача:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div>Завантаження користувачів...</div>;
  if (!users.length) return <div>Користувачів ще немає</div>;

  return (
    <div className={styles.container}>
      <h1>Користувачі</h1>
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>Email</th>
            <th>Ім’я</th>
            <th>Прізвище</th>
            <th>Роль</th>
            <th>Блокування</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id || user.email}>
              <td>{user.email}</td>
              <td>{user.firstName}</td>
              <td>{user.lastName}</td>
              <td>{user.role}</td>
              <td>
                <button
                  onClick={() => handleBlockToggle(user)}
                  className={user.isBlocked ? styles.unblockBtn : styles.blockBtn}
                  disabled={!user.id} // блокуємо кнопку, якщо id немає
                >
                  {user.isBlocked ? "Розблокувати" : "Заблокувати"}
                </button>
              </td>
              <td>
                <button
                  onClick={() => handleDeleteUser(user.id)}
                  className={styles.deleteBtn}
                  disabled={!user.id}
                >
                  Видалити
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



// // src/app/[locale]/admin/users/page.tsx
// "use client";

// import { useState, useEffect } from "react";
// import styles from "./page.module.scss";
// import { User } from "@/types/user";
// import { getAllUsers, blockUser, unblockUser, deleteUser as deleteUserApi } from "@/api/usersApi";
// import { useTranslations, useLocale } from "next-intl";

// interface UsersPageProps {
//   params: { locale: string };
// }

// export default function UsersPage({ params }: UsersPageProps) {
//   const [users, setUsers] = useState<User[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const locale = useLocale();

//   const fetchUsers = async () => {
//     try {
//       setLoading(true);
//       const data = await getAllUsers();
//       setUsers(data);
//     } catch (error) {
//       console.error("Помилка при отриманні користувачів:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleBlockToggle = async (user: User) => {
//     try {
//       if (user.isBlocked) {
//         await unblockUser(user.id!);
//       } else {
//         await blockUser(user.id!);
//       }
//       await fetchUsers();
//     } catch (error) {
//       console.error("Помилка при зміні статусу:", error);
//     }
//   };

//   const handleDeleteUser = async (userId: string) => {
//     if (!confirm("Ви впевнені, що хочете видалити цього користувача?")) return;

//     try {
//       await deleteUserApi(userId);
//       setUsers((prev) => prev.filter((u) => u.id !== userId));
//     } catch (error) {
//       console.error("Помилка при видаленні користувача:", error);
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, []);

//   if (loading) return <div>Завантаження користувачів...</div>;

//   return (
//     <div className={styles.container}>
//       <h1>Користувачі</h1>
//       <table className={styles.usersTable}>
//         <thead>
//           <tr>
//             <th>Email</th>
//             <th>Ім’я</th>
//             <th>Прізвище</th>
//             <th>Роль</th>
//             <th>Блокування</th>
//             <th>Дії</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.map((user) => (
//             <tr key={user.id}>
//               <td>{user.email}</td>
//               <td>{user.firstName}</td>
//               <td>{user.lastName}</td>
//               <td>{user.role}</td>
//               <td>
//                 <button
//                   onClick={() => handleBlockToggle(user)}
//                   className={user.isBlocked ? styles.unblockBtn : styles.blockBtn}
//                 >
//                   {user.isBlocked ? "Розблокувати" : "Заблокувати"}
//                 </button>
//               </td>
//               <td>
//                 <button
//                   onClick={() => handleDeleteUser(user.id!)}
//                   className={styles.deleteBtn}
//                 >
//                   Видалити
//                 </button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// }
