/**
 * Утилиты для валидации пользовательских данных
 */

import { parsePhoneNumberFromString, isValidPhoneNumber } from 'libphonenumber-js';
import type { CountryCode } from 'libphonenumber-js';

/**
 * Валидация email адреса
 * Проверяет корректность формата email
 */
export function validateEmail(email: string): { isValid: boolean; error?: string } {
  if (!email || email.trim() === '') {
    return { isValid: false, error: 'Email обязателен для заполнения' };
  }

  // Более строгая валидация email
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Введите корректный email адрес' };
  }

  // Проверка на слишком длинный email
  if (email.length > 254) {
    return { isValid: false, error: 'Email слишком длинный' };
  }

  // Проверка на кириллические символы
  if (/[а-яё]/i.test(email)) {
    return { isValid: false, error: 'Email не должен содержать кириллические символы' };
  }

  return { isValid: true };
}

/**
 * Валидация телефонного номера
 * Поддерживает международные номера из различных стран
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string; formatted?: string; country?: string } {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Телефон обязателен для заполнения' };
  }

  const cleanPhone = phone.trim();

  try {
    // Пытаемся распарсить номер как международный
    const phoneNumber = parsePhoneNumberFromString(cleanPhone);
    
    if (!phoneNumber) {
      return { isValid: false, error: 'Неверный формат номера телефона' };
    }

    if (!phoneNumber.isValid()) {
      return { isValid: false, error: 'Некорректный номер телефона' };
    }

    // Проверяем на повторяющиеся цифры (например, 1111111111)
    const nationalNumber = phoneNumber.nationalNumber;
    if (/^(\d)\1{6,}$/.test(nationalNumber)) {
      return { isValid: false, error: 'Номер телефона не может состоять из одинаковых цифр' };
    }

    // Получаем информацию о стране
    const country = phoneNumber.country;
    const countryName = getCountryName(country);

    return { 
      isValid: true, 
      formatted: phoneNumber.formatInternational(),
      country: countryName
    };

  } catch (error) {
    return { isValid: false, error: 'Неверный формат номера телефона' };
  }
}

/**
 * Получение названия страны по коду
 */
function getCountryName(countryCode: CountryCode | undefined): string {
  if (!countryCode) return 'Неизвестная страна';

  const countryNames: Record<string, string> = {
    'RU': 'Россия',
    'BY': 'Беларусь', 
    'KZ': 'Казахстан',
    'KG': 'Кыргызстан',
    'UZ': 'Узбекистан',
    'TJ': 'Таджикистан',
    'TM': 'Туркменистан',
    'AM': 'Армения',
    'AZ': 'Азербайджан',
    'GE': 'Грузия',
    'MD': 'Молдова',
    'UA': 'Украина',
    'AE': 'ОАЭ',
    'SA': 'Саудовская Аравия',
    'KW': 'Кувейт',
    'QA': 'Катар',
    'BH': 'Бахрейн',
    'OM': 'Оман',
    'JO': 'Иордания',
    'LB': 'Ливан',
    'SY': 'Сирия',
    'IQ': 'Ирак',
    'IR': 'Иран',
    'TR': 'Турция',
    'IL': 'Израиль',
    'PS': 'Палестина',
    'EG': 'Египет',
    'LY': 'Ливия',
    'TN': 'Тунис',
    'DZ': 'Алжир',
    'MA': 'Марокко',
    'SD': 'Судан',
    'ET': 'Эфиопия',
    'KE': 'Кения',
    'NG': 'Нигерия',
    'ZA': 'ЮАР',
    'GH': 'Гана',
    'UG': 'Уганда',
    'TZ': 'Танзания',
    'MW': 'Малави',
    'ZM': 'Замбия',
    'ZW': 'Зимбабве',
    'BW': 'Ботсвана',
    'NA': 'Намибия',
    'SZ': 'Свазиленд',
    'LS': 'Лесото',
    'MG': 'Мадагаскар',
    'MU': 'Маврикий',
    'SC': 'Сейшелы',
    'KM': 'Коморы',
    'DJ': 'Джибути',
    'SO': 'Сомали',
    'ER': 'Эритрея',
    'SS': 'Южный Судан',
    'CF': 'ЦАР',
    'TD': 'Чад',
    'NE': 'Нигер',
    'ML': 'Мали',
    'BF': 'Буркина-Фасо',
    'CI': 'Кот-д\'Ивуар',
    'LR': 'Либерия',
    'SL': 'Сьерра-Леоне',
    'GN': 'Гвинея',
    'GW': 'Гвинея-Бисау',
    'GM': 'Гамбия',
    'SN': 'Сенегал',
    'MR': 'Мавритания',
    'CV': 'Кабо-Верде',
    'ST': 'Сан-Томе и Принсипи',
    'GQ': 'Экваториальная Гвинея',
    'GA': 'Габон',
    'CG': 'Конго',
    'CD': 'ДР Конго',
    'AO': 'Ангола',
    'CM': 'Камерун',
    'BI': 'Бурунди',
    'RW': 'Руанда',
    'US': 'США',
    'CA': 'Канада',
    'MX': 'Мексика',
    'BR': 'Бразилия',
    'AR': 'Аргентина',
    'CL': 'Чили',
    'CO': 'Колумбия',
    'PE': 'Перу',
    'VE': 'Венесуэла',
    'UY': 'Уругвай',
    'PY': 'Парагвай',
    'BO': 'Боливия',
    'EC': 'Эквадор',
    'GY': 'Гайана',
    'SR': 'Суринам',
    'GF': 'Французская Гвиана',
    'FK': 'Фолклендские острова',
    'GS': 'Южная Георгия и Южные Сандвичевы острова',
    'CN': 'Китай',
    'IN': 'Индия',
    'JP': 'Япония',
    'KR': 'Южная Корея',
    'KP': 'Северная Корея',
    'TH': 'Таиланд',
    'VN': 'Вьетнам',
    'PH': 'Филиппины',
    'ID': 'Индонезия',
    'MY': 'Малайзия',
    'SG': 'Сингапур',
    'BN': 'Бруней',
    'MM': 'Мьянма',
    'LA': 'Лаос',
    'KH': 'Камбоджа',
    'BD': 'Бангладеш',
    'PK': 'Пакистан',
    'AF': 'Афганистан',
    'LK': 'Шри-Ланка',
    'MV': 'Мальдивы',
    'NP': 'Непал',
    'BT': 'Бутан',
    'MN': 'Монголия',
    'TW': 'Тайвань',
    'HK': 'Гонконг',
    'MO': 'Макао',
    'AU': 'Австралия',
    'NZ': 'Новая Зеландия',
    'FJ': 'Фиджи',
    'PG': 'Папуа-Новая Гвинея',
    'SB': 'Соломоновы острова',
    'VU': 'Вануату',
    'NC': 'Новая Каледония',
    'PF': 'Французская Полинезия',
    'WS': 'Самоа',
    'TO': 'Тонга',
    'KI': 'Кирибати',
    'TV': 'Тувалу',
    'NR': 'Науру',
    'PW': 'Палау',
    'FM': 'Микронезия',
    'MH': 'Маршалловы острова',
    'CK': 'Острова Кука',
    'NU': 'Ниуэ',
    'TK': 'Токелау',
    'WF': 'Уоллис и Футуна',
    'AS': 'Американское Самоа',
    'GU': 'Гуам',
    'MP': 'Северные Марианские острова',
    'VI': 'Виргинские острова США',
    'PR': 'Пуэрто-Рико',
    'GP': 'Гваделупа',
    'MQ': 'Мартиника',
    'BL': 'Сен-Бартелеми',
    'MF': 'Сен-Мартен',
    'SX': 'Синт-Мартен',
    'CW': 'Кюрасао',
    'AW': 'Аруба',
    'BQ': 'Бонэйр',
    'DM': 'Доминика',
    'GD': 'Гренада',
    'LC': 'Сент-Люсия',
    'VC': 'Сент-Винсент и Гренадины',
    'AG': 'Антигуа и Барбуда',
    'KN': 'Сент-Китс и Невис',
    'BB': 'Барбадос',
    'TT': 'Тринидад и Тобаго',
    'JM': 'Ямайка',
    'BS': 'Багамы',
    'CU': 'Куба',
    'DO': 'Доминиканская Республика',
    'HT': 'Гаити',
    'GT': 'Гватемала',
    'BZ': 'Белиз',
    'SV': 'Сальвадор',
    'HN': 'Гондурас',
    'NI': 'Никарагуа',
    'CR': 'Коста-Рика',
    'PA': 'Панама',
    'DE': 'Германия',
    'FR': 'Франция',
    'GB': 'Великобритания',
    'IT': 'Италия',
    'ES': 'Испания',
    'PT': 'Португалия',
    'NL': 'Нидерланды',
    'BE': 'Бельгия',
    'CH': 'Швейцария',
    'AT': 'Австрия',
    'LU': 'Люксембург',
    'IE': 'Ирландия',
    'DK': 'Дания',
    'SE': 'Швеция',
    'NO': 'Норвегия',
    'FI': 'Финляндия',
    'IS': 'Исландия',
    'PL': 'Польша',
    'CZ': 'Чехия',
    'SK': 'Словакия',
    'HU': 'Венгрия',
    'RO': 'Румыния',
    'BG': 'Болгария',
    'HR': 'Хорватия',
    'SI': 'Словения',
    'RS': 'Сербия',
    'BA': 'Босния и Герцеговина',
    'ME': 'Черногория',
    'MK': 'Северная Македония',
    'AL': 'Албания',
    'GR': 'Греция',
    'CY': 'Кипр',
    'MT': 'Мальта',
    'AD': 'Андорра',
    'MC': 'Монако',
    'SM': 'Сан-Марино',
    'VA': 'Ватикан',
    'LI': 'Лихтенштейн',
    'FO': 'Фарерские острова',
    'GL': 'Гренландия',
    'SJ': 'Шпицберген и Ян-Майен',
    'AX': 'Аландские острова',
    'GI': 'Гибралтар',
    'IM': 'Остров Мэн',
    'JE': 'Джерси',
    'GG': 'Гернси'
  };

  return countryNames[countryCode] || countryCode;
}

/**
 * Валидация имени пользователя
 */
export function validateName(name: string): { isValid: boolean; error?: string } {
  if (!name || name.trim() === '') {
    return { isValid: false, error: 'Имя обязательно для заполнения' };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < 2) {
    return { isValid: false, error: 'Имя должно содержать минимум 2 символа' };
  }

  if (trimmedName.length > 50) {
    return { isValid: false, error: 'Имя слишком длинное' };
  }

  // Проверяем на наличие только букв, пробелов и дефисов
  if (!/^[а-яёА-ЯЁa-zA-Z\s\-]+$/.test(trimmedName)) {
    return { isValid: false, error: 'Имя может содержать только буквы, пробелы и дефисы' };
  }

  // Проверяем, что имя содержит хотя бы одну букву
  if (!/[а-яёА-ЯЁa-zA-Z]/.test(trimmedName)) {
    return { isValid: false, error: 'Имя должно содержать хотя бы одну букву' };
  }

  return { isValid: true };
}

/**
 * Общая функция валидации формы пользователя
 */
export function validateUserForm(data: {
  name?: string;
  email?: string;
  phone?: string;
}, requiredFields: string[] = ['name', 'email']): {
  isValid: boolean;
  errors: Record<string, string>;
  formattedData?: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  const formattedData: Record<string, string> = {};

  // Валидация обязательных полей
  requiredFields.forEach(field => {
    if (!data[field as keyof typeof data]?.trim()) {
      errors[field] = 'Это обязательное поле';
    }
  });

  // Валидация имени
  if (data.name) {
    const nameValidation = validateName(data.name);
    if (!nameValidation.isValid) {
      errors.name = nameValidation.error!;
    } else {
      formattedData.name = data.name.trim();
    }
  }

  // Валидация email
  if (data.email) {
    const emailValidation = validateEmail(data.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error!;
    } else {
      formattedData.email = data.email.trim().toLowerCase();
    }
  }

  // Валидация телефона
  if (data.phone) {
    const phoneValidation = validatePhone(data.phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error!;
    } else {
      formattedData.phone = phoneValidation.formatted!;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    formattedData: Object.keys(formattedData).length > 0 ? formattedData : undefined
  };
}
