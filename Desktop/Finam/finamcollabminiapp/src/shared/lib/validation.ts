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
 * Нормализация телефонного номера для разных форматов ввода
 * Поддерживает альтернативные форматы для различных регионов
 */
function normalizePhoneNumber(phone: string): string[] {
  // Убираем все пробелы, дефисы, скобки для получения только цифр
  const digitsOnly = phone.replace(/[\s\-()]/g, '');
  const trimmed = phone.trim();
  
  // Если номер уже начинается с +, нормализуем его (убираем пробелы, если есть)
  if (trimmed.startsWith('+')) {
    // Если номер начинается с +7 и идет слитно (например, +71234567890), оставляем как есть
    // parsePhoneNumberFromString должен его правильно распарсить
    return [trimmed.replace(/\s/g, '')];
  }

  const normalizedVariants: string[] = [];

  // Россия (+7) и Казахстан (+7): варианты 8XXXXXXXXXX, 7XXXXXXXXXX
  if (/^8\d{10}$/.test(digitsOnly)) {
    normalizedVariants.push('+7' + digitsOnly.slice(1));
  }
  if (/^7\d{10}$/.test(digitsOnly)) {
    normalizedVariants.push('+7' + digitsOnly.slice(1));
  }

  // Беларусь (+375): вариант 80XXXXXXXXX (11 цифр, начинается с 80)
  if (/^80\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+375' + digitsOnly.slice(2));
  }
  // Беларусь (+375): вариант 375XXXXXXXXX (12 цифр, начинается с 375)
  if (/^375\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+375' + digitsOnly.slice(3));
  }

  // Украина (+380): вариант 0XXXXXXXXX (10 цифр, начинается с 0)
  if (/^0\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+380' + digitsOnly.slice(1));
  }
  // Украина (+380): вариант 380XXXXXXXXX (12 цифр, начинается с 380)
  if (/^380\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+380' + digitsOnly.slice(3));
  }

  // Казахстан (+7): варианты уже обработаны выше вместе с Россией
  // Но можно добавить специфичные варианты для Казахстана (если нужно)

  // ОАЭ (+971): вариант 0XXXXXXXXX (10 цифр, начинается с 0)
  // ОАЭ обычно имеет формат 05X XXX XXXX (9 цифр после 0)
  if (/^0\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+971' + digitsOnly.slice(1));
  }
  // ОАЭ (+971): вариант 971XXXXXXXXX (12 цифр, начинается с 971)
  if (/^971\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+971' + digitsOnly.slice(3));
  }

  // Саудовская Аравия (+966): вариант 0XXXXXXXXX (10 цифр, начинается с 0)
  if (/^0\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+966' + digitsOnly.slice(1));
  }
  // Саудовская Аравия (+966): вариант 966XXXXXXXXX (12 цифр)
  if (/^966\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+966' + digitsOnly.slice(3));
  }

  // Катар (+974): вариант 0XXXXXXXXX (10 цифр)
  if (/^974\d{8}$/.test(digitsOnly)) {
    normalizedVariants.push('+974' + digitsOnly.slice(3));
  }

  // Кувейт (+965): вариант 0XXXXXXXXX (10 цифр)
  if (/^965\d{8}$/.test(digitsOnly)) {
    normalizedVariants.push('+965' + digitsOnly.slice(3));
  }

  // Бахрейн (+973): вариант 0XXXXXXXXX (10 цифр)
  if (/^973\d{8}$/.test(digitsOnly)) {
    normalizedVariants.push('+973' + digitsOnly.slice(3));
  }

  // Оман (+968): вариант 0XXXXXXXXX (10 цифр)
  if (/^968\d{8}$/.test(digitsOnly)) {
    normalizedVariants.push('+968' + digitsOnly.slice(3));
  }

  // Иордания (+962): вариант 0XXXXXXXXX (10 цифр)
  if (/^962\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+962' + digitsOnly.slice(3));
  }

  // Израиль (+972): вариант 0XXXXXXXXX (10 цифр)
  if (/^972\d{8,9}$/.test(digitsOnly)) {
    normalizedVariants.push('+972' + digitsOnly.slice(3));
  }

  // Турция (+90): вариант 0XXXXXXXXX (10 цифр)
  if (/^90\d{10}$/.test(digitsOnly)) {
    normalizedVariants.push('+90' + digitsOnly.slice(2));
  }
  if (/^0\d{10}$/.test(digitsOnly) && digitsOnly.length === 11) {
    normalizedVariants.push('+90' + digitsOnly.slice(1));
  }

  // Армения (+374): вариант 0XXXXXXXXX (9 цифр после 0)
  if (/^0\d{8}$/.test(digitsOnly) && digitsOnly.length === 9) {
    normalizedVariants.push('+374' + digitsOnly.slice(1));
  }
  if (/^374\d{8}$/.test(digitsOnly)) {
    normalizedVariants.push('+374' + digitsOnly.slice(3));
  }

  // Азербайджан (+994): вариант 0XXXXXXXXX (9 цифр после 0)
  if (/^0\d{9}$/.test(digitsOnly) && digitsOnly.length === 10) {
    normalizedVariants.push('+994' + digitsOnly.slice(1));
  }
  if (/^994\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+994' + digitsOnly.slice(3));
  }

  // Грузия (+995): вариант 0XXXXXXXXX (9 цифр после 0)
  if (/^0\d{9}$/.test(digitsOnly) && digitsOnly.length === 10) {
    normalizedVariants.push('+995' + digitsOnly.slice(1));
  }
  if (/^995\d{9}$/.test(digitsOnly)) {
    normalizedVariants.push('+995' + digitsOnly.slice(3));
  }

  // Молдова (+373): вариант 0XXXXXXXXX (8-9 цифр после 0)
  if (/^0\d{8,9}$/.test(digitsOnly)) {
    normalizedVariants.push('+373' + digitsOnly.slice(1));
  }
  if (/^373\d{8,9}$/.test(digitsOnly)) {
    normalizedVariants.push('+373' + digitsOnly.slice(3));
  }

  // США (+1): вариант 1XXXXXXXXXX (10 цифр после 1)
  if (/^1\d{10}$/.test(digitsOnly)) {
    normalizedVariants.push('+1' + digitsOnly.slice(1));
  }

  // Если есть варианты, возвращаем их, иначе возвращаем исходный номер
  return normalizedVariants.length > 0 ? normalizedVariants : [trimmed];
}

/**
 * Форматирование телефонного номера в зависимости от страны
 */
function formatPhoneByCountry(phoneNumber: ReturnType<typeof parsePhoneNumberFromString>, country: CountryCode | undefined): string {
  if (!phoneNumber) {
    return '';
  }

  if (!country) {
    return phoneNumber.formatInternational();
  }

  const countryCode = phoneNumber.countryCallingCode;
  const nationalNumber = phoneNumber.nationalNumber;

  switch (country) {
    // Россия и Казахстан: +7 (123) 456 78-90
    case 'RU':
    case 'KZ':
      if (nationalNumber.length === 10) {
        return `+${countryCode} (${nationalNumber.slice(0, 3)}) ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6, 8)}-${nationalNumber.slice(8)}`;
      }
      break;

    // США и Канада: +1 (123) 456-7890
    case 'US':
    case 'CA':
      if (nationalNumber.length === 10) {
        return `+${countryCode} (${nationalNumber.slice(0, 3)}) ${nationalNumber.slice(3, 6)}-${nationalNumber.slice(6)}`;
      }
      break;

    // Великобритания: +44 20 1234 5678
    case 'GB':
      if (nationalNumber.length >= 9 && nationalNumber.length <= 10) {
        // Лондон (20) или другие города
        if (nationalNumber.startsWith('20') && nationalNumber.length === 10) {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 6)} ${nationalNumber.slice(6)}`;
        } else if (nationalNumber.length === 10) {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 6)} ${nationalNumber.slice(6)}`;
        } else if (nationalNumber.length === 9) {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
        }
      }
      break;

    // Германия: +49 30 12345678 или +49 30 1234 5678
    case 'DE':
      if (nationalNumber.length >= 9 && nationalNumber.length <= 11) {
        // Берлин (30) или другие города
        if (nationalNumber.startsWith('30') && nationalNumber.length === 10) {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 6)} ${nationalNumber.slice(6)}`;
        } else if (nationalNumber.length >= 10) {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 6)} ${nationalNumber.slice(6)}`;
        }
      }
      break;

    // Франция: +33 1 23 45 67 89
    case 'FR':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 1)} ${nationalNumber.slice(1, 3)} ${nationalNumber.slice(3, 5)} ${nationalNumber.slice(5, 7)} ${nationalNumber.slice(7)}`;
      }
      break;

    // Италия: +39 02 1234 5678
    case 'IT':
      if (nationalNumber.length === 9 || nationalNumber.length === 10) {
        if (nationalNumber.length === 10) {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 6)} ${nationalNumber.slice(6)}`;
        } else {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
        }
      }
      break;

    // Испания: +34 91 123 45 67
    case 'ES':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5, 7)} ${nationalNumber.slice(7)}`;
      }
      break;

    // ОАЭ: +971 50 123 4567
    case 'AE':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
      }
      break;

    // Беларусь: +375 29 123-45-67
    case 'BY':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)}-${nationalNumber.slice(5, 7)}-${nationalNumber.slice(7)}`;
      }
      break;

    // Украина: +380 50 123 4567
    case 'UA':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
      }
      break;

    // Турция: +90 212 123 45 67
    case 'TR':
      if (nationalNumber.length === 10) {
        return `+${countryCode} ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6, 8)} ${nationalNumber.slice(8)}`;
      }
      break;

    // Польша: +48 12 345 67 89
    case 'PL':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5, 7)} ${nationalNumber.slice(7)}`;
      }
      break;

    // Чехия: +420 123 456 789
    case 'CZ':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 3)} ${nationalNumber.slice(3, 6)} ${nationalNumber.slice(6)}`;
      }
      break;

    // Израиль: +972 50-123-4567
    case 'IL':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)}-${nationalNumber.slice(2, 5)}-${nationalNumber.slice(5)}`;
      }
      break;

    // Саудовская Аравия: +966 50 123 4567
    case 'SA':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
      }
      break;

    // Катар: +974 1234 5678
    case 'QA':
      if (nationalNumber.length === 8) {
        return `+${countryCode} ${nationalNumber.slice(0, 4)} ${nationalNumber.slice(4)}`;
      }
      break;

    // Кувейт: +965 1234 5678
    case 'KW':
      if (nationalNumber.length === 8) {
        return `+${countryCode} ${nationalNumber.slice(0, 4)} ${nationalNumber.slice(4)}`;
      }
      break;

    // Армения: +374 12 345678
    case 'AM':
      if (nationalNumber.length === 8) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2)}`;
      }
      break;

    // Азербайджан: +994 12 123 45 67
    case 'AZ':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5, 7)} ${nationalNumber.slice(7)}`;
      }
      break;

    // Грузия: +995 32 123 456
    case 'GE':
      if (nationalNumber.length === 9) {
        return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
      }
      break;

    // Молдова: +373 22 123 456
    case 'MD':
      if (nationalNumber.length === 8 || nationalNumber.length === 9) {
        if (nationalNumber.length === 9) {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
        } else {
          return `+${countryCode} ${nationalNumber.slice(0, 2)} ${nationalNumber.slice(2, 5)} ${nationalNumber.slice(5)}`;
        }
      }
      break;

    default:
      // Для остальных стран используем международный формат
      return phoneNumber.formatInternational();
  }

  // Если формат нестандартный, используем международный формат
  return phoneNumber.formatInternational();
}

/**
 * Валидация телефонного номера
 * Поддерживает международные номера из различных стран
 * Принимает различные форматы ввода для разных регионов
 */
export function validatePhone(phone: string): { isValid: boolean; error?: string; formatted?: string; country?: string } {
  if (!phone || phone.trim() === '') {
    return { isValid: false, error: 'Телефон обязателен для заполнения' };
  }

  // Получаем варианты нормализации
  const normalizedVariants = normalizePhoneNumber(phone);
  
  // Список популярных стран для попытки парсинга
  const defaultCountries: CountryCode[] = [
    'RU', 'KZ', 'BY', 'UA', 'AM', 'AZ', 'GE', 'MD', // СНГ и Восточная Европа
    'AE', 'SA', 'KW', 'QA', 'BH', 'OM', 'JO', 'IL', 'TR', // Ближний Восток
    'US', 'GB', 'DE', 'FR', 'IT', 'ES', 'PL', 'CZ' // Западная Европа и США
  ];

  try {
    let phoneNumber: ReturnType<typeof parsePhoneNumberFromString> = undefined;
    
    // Пробуем каждый вариант нормализации
    for (const normalizedPhone of normalizedVariants) {
      // Сначала пробуем распарсить без указания страны
      phoneNumber = parsePhoneNumberFromString(normalizedPhone);
      
      // Если получилось и номер валиден, используем его
      if (phoneNumber && phoneNumber.isValid()) {
        break;
      }
      
      // Если не получилось, пробуем с разными дефолтными странами
      if (!phoneNumber || !phoneNumber.isValid()) {
        for (const country of defaultCountries) {
          phoneNumber = parsePhoneNumberFromString(normalizedPhone, country);
          if (phoneNumber && phoneNumber.isValid()) {
            break;
          }
        }
      }
      
      // Если нашли валидный номер, выходим из цикла
      if (phoneNumber && phoneNumber.isValid()) {
        break;
      }
    }
    
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

    // Форматируем номер в нужный формат в зависимости от страны
    const formattedPhone = formatPhoneByCountry(phoneNumber, country);

    return { 
      isValid: true, 
      formatted: formattedPhone,
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
