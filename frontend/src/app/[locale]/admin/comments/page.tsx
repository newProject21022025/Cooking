// src/app/[locale]/admin/comments/page.tsx

"use client";

import React, { useState, useEffect } from 'react';
import styles from './page.module.scss';
import { getAllComments, Comment, deleteComment } from '@/api/commentsApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import Link from 'next/link';

export default function Comments() {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Отримуємо поточного користувача зі стану Redux
  const user = useSelector((state: RootState) => state.user.data);
  const token = useSelector((state: RootState) => state.auth.token);
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  // Перевірка прав доступу
  const isAdmin = user?.role === 'admin' && isAuthenticated;

  const fetchComments = async () => {
    try {
      setLoading(true);
      const fetchedComments = await getAllComments();
      setComments(fetchedComments);
    } catch (error) {
    console.error("Не вдалося завантажити коментарі.:", error);    
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchComments();
    }
  }, [isAdmin]);

  const handleDeleteComment = async (commentId: number) => {
    if (!isAdmin) {
      setError("У вас недостатньо прав для видалення коментарів.");
      return;
    }

    if (window.confirm("Ви впевнені, що хочете видалити цей коментар?")) {
      try {
        await deleteComment(commentId);
        // Оновлюємо список коментарів після успішного видалення
        setComments(comments.filter(comment => comment.id !== commentId));
      } catch (error) {
        console.error('Помилка при видаленні коментаря.');
      }
    }
  };

  if (loading) {
    return <div className={styles.container}>Завантаження...</div>;
  }

  if (error) {
    return <div className={styles.container}>Помилка: {error}</div>;
  }

  // Якщо користувач не адміністратор, показуємо повідомлення про відмову в доступі
  if (!isAdmin) {
    return <div className={styles.container}>Доступ заборонено.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Усі коментарі</h1>
      {comments.length > 0 ? (
        <ul className={styles.commentsList}>
          {comments.map((comment) => (
            <li key={comment.id} className={styles.commentItem}>
              <div className={styles.commentContent}>
                <p><strong>Коментар:</strong> {comment.comment_text}</p>
                <p><strong>Рейтинг:</strong> {comment.rating}</p>
                {comment.dish && (
                  <p>
                    <strong>Страва:</strong>
                    <Link href={`/dishes/${comment.dish.id}`} className={styles.dishLink}>
                       {comment.dish.name_ua}
                    </Link>
                  </p>
                )}
                {comment.user && (
                  <p>
                    <strong>Автор:</strong> {comment.user.firstName} {comment.user.lastName} ({comment.user.email})
                  </p>
                )}
                <p><strong>Дата:</strong> {new Date(comment.created_at).toLocaleDateString()}</p>
              </div>
              <button
                className={styles.deleteButton}
                onClick={() => handleDeleteComment(comment.id)}
              >
                Видалити
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>Коментарів поки що немає.</p>
      )}
    </div>
  );
}