// src/components/ArticleCreator/articleValidation.ts

import * as Yup from 'yup';

// -------------------------------------------------------------------
// Допоміжні схеми
// -------------------------------------------------------------------

// Схема для MultiLang { uk: string; en: string; }
const MultiLangSchema = Yup.object().shape({
  uk: Yup.string()
    .min(3, 'Поле повинно містити принаймні 3 символи (укр.)')
    .required('Це обов\'язкове поле (укр.)'),
  en: Yup.string()
    .min(3, 'Поле повинно містити принаймні 3 символи (англ.)')
    .required('Це обов\'язкове поле (англ.)'),
});

// Схема для ArticleBlock { title: MultiLang; description: MultiLang; }
const ArticleBlockSchema = Yup.object().shape({
  // Заголовок блоку може бути опціональним
  title: Yup.object().shape({
    uk: Yup.string().optional(),
    en: Yup.string().optional(),
  }).optional(),
  
  description: MultiLangSchema, // Опис блоку є обов'язковим
});

// -------------------------------------------------------------------
// Основна схема для форми
// -------------------------------------------------------------------

export const ArticleValidationSchema = Yup.object().shape({
  title: MultiLangSchema,
  description: MultiLangSchema,
  
  photo: Yup.string()
    .url('URL фотографії повинен бути коректним')
    .required('URL головного фото є обов\'язковим'),
    
  blocks: Yup.array(ArticleBlockSchema)
    .min(1, 'Стаття повинна містити принаймні один блок.')
    .required('Блоки контенту є обов\'язковими'),
});

// -------------------------------------------------------------------
// Початкові значення форми
// -------------------------------------------------------------------

// Відповідає інтерфейсу CreateArticleDto
export const initialArticleValues = {
  title: { uk: '', en: '' },
  description: { uk: '', en: '' },
  photo: '',
  blocks: [
    { 
      title: { uk: '', en: '' }, 
      description: { uk: 'Початковий текст...', en: 'Initial text...' } 
    },
  ],
};