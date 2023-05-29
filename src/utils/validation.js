import * as Yup from 'yup';

export const SignupSchema = Yup.object().shape({
    title: Yup.string()
        .max(100, 'Название слишком длинное!')
        .required('Обязательное поле!'),
    publicationYear: Yup.number()
        .min(1800, 'Пожалуйста, выберите год не раньше 1800!')
        .max(new Date().getFullYear(), 'Этот год еще не наступил!'),
    rating: Yup.number()
        .min(0, "Рейтинг не может быть меньше 0!")
        .max(10, "Рейтинг не может быть больше 10!"),
    ISBN: Yup.string()
        .max(21, "Длина ISBN не может быть больше 21 символа!"),
    firstAuthor: Yup.string()
        .required('Обязательное поле!'),
  });