import React, { createContext, useContext, useEffect, ReactNode } from 'react';
import { useEnhancedUserSettings } from '@/hooks/useEnhancedUserSettings';

interface LanguageContextType {
  currentLanguage: string;
  t: (key: string, defaultValue?: string) => string;
  changeLanguage: (language: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation dictionaries
const translations: Record<string, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.library': 'Library',
    'nav.favorites': 'Favorites',
    'nav.customize': 'Customize',
    'nav.settings': 'Settings',
    
    // Home page
    'home.title': 'Daily Islamic Inspiration',
    'home.subtitle': 'Beautiful Quranic verses as wallpapers',
    'home.todayVerse': "Today's Verse",
    'home.generateWallpaper': 'Generate Wallpaper',
    'home.addToFavorites': 'Add to Favorites',
    'home.removeFromFavorites': 'Remove from Favorites',
    
    // Library
    'library.title': 'Verse Library',
    'library.subtitle': 'Explore our collection of Quranic verses',
    'library.search': 'Search verses...',
    'library.filter': 'Filter by theme',
    'library.all': 'All',
    'library.share': 'Share',
    'library.generateWallpaper': 'Generate Wallpaper',
    
    // Settings
    'settings.title': 'Settings',
    'settings.subtitle': 'Customize your Ayah Wallpaper experience',
    'settings.account': 'Account',
    'settings.appearance': 'Appearance',
    'settings.language': 'Language & Localization',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Data & Privacy',
    
    // Language Settings
    'language.interfaceLanguage': 'Interface Language',
    'language.interfaceLanguageDesc': 'Choose your preferred language for the app interface',
    'language.translationStyle': 'Translation Style',
    'language.translationStyleDesc': 'Choose how you prefer Quranic verses to be translated',
    'language.arabicTextSettings': 'Arabic Text Settings',
    'language.arabicTextSize': 'Arabic Text Size',
    'language.regionalSettings': 'Regional Settings',
    'language.dateFormat': 'Date Format',
    'language.timeFormat': 'Time Format',
    'language.unsavedChanges': 'You have unsaved changes',
    'language.discard': 'Discard',
    'language.saveChanges': 'Save changes',
    'language.saving': 'Saving...',
    
    // Translation styles
    'translation.literal': 'Literal Translation',
    'translation.interpretive': 'Interpretive Translation',
    'translation.simplified': 'Simplified Language',
    
    // Date/Time formats
    'format.gregorian': 'Gregorian Calendar',
    'format.hijri': 'Hijri Calendar',
    'format.both': 'Both Calendars',
    'format.12h': '12 Hour (AM/PM)',
    'format.24h': '24 Hour',
    
    // Account
    'account.displayName': 'Display Name',
    'account.email': 'Email Address',
    'account.verified': 'Verified',
    'account.signOut': 'Sign Out',
    'account.deleteAccount': 'Request Account Deletion',
    
    // Common
    'common.save': 'Save',
    'common.cancel': 'Cancel',
    'common.edit': 'Edit',
    'common.delete': 'Delete',
    'common.loading': 'Loading...',
    'common.error': 'Error',
    'common.success': 'Success',
    
    // Customize
    'customize.title': 'Customize Wallpaper',
    'customize.subtitle': 'Create your perfect Islamic wallpaper design',
    'customize.livePreview': 'Live Preview',
    'customize.reset': 'Reset',
    'customize.generateHint': 'Generate a preview to see your design',
    'customize.generatePreview': 'Generate Preview',
    'customize.generating': 'Generating...',
    'customize.download': 'Download Wallpaper',
    'customize.regenerate': 'Regenerate',
    'customize.sectionTitle': 'Customize Your Wallpaper',
    'customize.resolution': 'Resolution',
    'customize.backgroundImages': 'Background Images',
    'customize.gradient': 'Gradient',
    'customize.hide': 'Hide',
    'customize.customize': 'Customize',
    'customize.showOriginal': 'Show Original',
    
    // Wallpaper
    'wallpaper.newVerse': 'New Verse',
    'wallpaper.downloaded': 'Wallpaper downloaded',
    'wallpaper.savedToDevice': 'Your beautiful Islamic wallpaper has been saved to your device',
    'wallpaper.generated': 'Wallpaper generated',
    'wallpaper.previewReady': 'Your custom wallpaper preview is ready!',
    'wallpaper.addedToFavorites': 'Added to favorites',
    'wallpaper.savedToFavorites': 'This verse has been saved to your favorites',
    'wallpaper.signInToSave': 'Please sign in to save favorites',
  }
  
  fr: {
    // Navigation
    'nav.home': 'Accueil',
    'nav.library': 'Bibliothèque',
    'nav.favorites': 'Favoris',
    'nav.customize': 'Personnaliser',
    'nav.settings': 'Paramètres',
    
    // Home page
    'home.title': 'Inspiration Islamique Quotidienne',
    'home.subtitle': 'Beaux versets coraniques en fond d\'écran',
    'home.todayVerse': 'Verset du jour',
    'home.generateWallpaper': 'Générer un fond d\'écran',
    'home.addToFavorites': 'Ajouter aux favoris',
    'home.removeFromFavorites': 'Retirer des favoris',
    
    // Library
    'library.title': 'Bibliothèque de versets',
    'library.subtitle': 'Explorez notre collection de versets coraniques',
    'library.search': 'Rechercher des versets...',
    'library.filter': 'Filtrer par thème',
    'library.all': 'Tous',
    'library.share': 'Partager',
    'library.generateWallpaper': 'Générer un fond d\'écran',
    
    // Settings
    'settings.title': 'Paramètres',
    'settings.subtitle': 'Personnalisez votre expérience Ayah Wallpaper',
    'settings.account': 'Compte',
    'settings.appearance': 'Apparence',
    'settings.language': 'Langue et localisation',
    'settings.notifications': 'Notifications',
    'settings.privacy': 'Données et confidentialité',
    
    // Language Settings
    'language.interfaceLanguage': 'Langue de l\'interface',
    'language.interfaceLanguageDesc': 'Choisissez votre langue préférée pour l\'interface de l\'application',
    'language.translationStyle': 'Style de traduction',
    'language.translationStyleDesc': 'Choisissez comment vous préférez que les versets coraniques soient traduits',
    'language.arabicTextSettings': 'Paramètres du texte arabe',
    'language.arabicTextSize': 'Taille du texte arabe',
    'language.regionalSettings': 'Paramètres régionaux',
    'language.dateFormat': 'Format de date',
    'language.timeFormat': 'Format d\'heure',
    'language.unsavedChanges': 'Vous avez des modifications non enregistrées',
    'language.discard': 'Abandonner',
    'language.saveChanges': 'Enregistrer les modifications',
    'language.saving': 'Enregistrement...',
    
    // Translation styles
    'translation.literal': 'Traduction littérale',
    'translation.interpretive': 'Traduction interprétative',
    'translation.simplified': 'Langage simplifié',
    
    // Date/Time formats
    'format.gregorian': 'Calendrier grégorien',
    'format.hijri': 'Calendrier hégirien',
    'format.both': 'Les deux calendriers',
    'format.12h': '12 heures (AM/PM)',
    'format.24h': '24 heures',
    
    // Account
    'account.displayName': 'Nom d\'affichage',
    'account.email': 'Adresse e-mail',
    'account.verified': 'Vérifié',
    'account.signOut': 'Se déconnecter',
    'account.deleteAccount': 'Demander la suppression du compte',
    
    // Common
    'common.save': 'Enregistrer',
    'common.cancel': 'Annuler',
    'common.edit': 'Modifier',
    'common.delete': 'Supprimer',
    'common.loading': 'Chargement...',
    'common.error': 'Erreur',
    'common.success': 'Succès',
  },
  
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.library': 'المكتبة',
    'nav.favorites': 'المفضلة',
    'nav.customize': 'تخصيص',
    'nav.settings': 'الإعدادات',
    
    // Home page
    'home.title': 'الإلهام الإسلامي اليومي',
    'home.subtitle': 'آيات قرآنية جميلة كخلفيات',
    'home.todayVerse': 'آية اليوم',
    'home.generateWallpaper': 'إنشاء خلفية',
    'home.addToFavorites': 'إضافة إلى المفضلة',
    'home.removeFromFavorites': 'إزالة من المفضلة',
    
    // Library
    'library.title': 'مكتبة الآيات',
    'library.subtitle': 'استكشف مجموعتنا من الآيات القرآنية',
    'library.search': 'البحث في الآيات...',
    'library.filter': 'فلترة حسب الموضوع',
    'library.all': 'الكل',
    'library.share': 'مشاركة',
    'library.generateWallpaper': 'إنشاء خلفية',
    
    // Settings
    'settings.title': 'الإعدادات',
    'settings.subtitle': 'خصص تجربة خلفيات الآيات الخاصة بك',
    'settings.account': 'الحساب',
    'settings.appearance': 'المظهر',
    'settings.language': 'اللغة والموقع',
    'settings.notifications': 'الإشعارات',
    'settings.privacy': 'البيانات والخصوصية',
    
    // Language Settings
    'language.interfaceLanguage': 'لغة الواجهة',
    'language.interfaceLanguageDesc': 'اختر لغتك المفضلة لواجهة التطبيق',
    'language.translationStyle': 'نمط الترجمة',
    'language.translationStyleDesc': 'اختر كيف تفضل ترجمة الآيات القرآنية',
    'language.arabicTextSettings': 'إعدادات النص العربي',
    'language.arabicTextSize': 'حجم النص العربي',
    'language.regionalSettings': 'الإعدادات الإقليمية',
    'language.dateFormat': 'تنسيق التاريخ',
    'language.timeFormat': 'تنسيق الوقت',
    'language.unsavedChanges': 'لديك تغييرات غير محفوظة',
    'language.discard': 'تجاهل',
    'language.saveChanges': 'حفظ التغييرات',
    'language.saving': 'جاري الحفظ...',
    
    // Translation styles
    'translation.literal': 'ترجمة حرفية',
    'translation.interpretive': 'ترجمة تفسيرية',
    'translation.simplified': 'لغة مبسطة',
    
    // Date/Time formats
    'format.gregorian': 'التقويم الميلادي',
    'format.hijri': 'التقويم الهجري',
    'format.both': 'كلا التقويمين',
    'format.12h': '12 ساعة (ص/م)',
    'format.24h': '24 ساعة',
    
    // Account
    'account.displayName': 'اسم العرض',
    'account.email': 'عنوان البريد الإلكتروني',
    'account.verified': 'مُتحقق منه',
    'account.signOut': 'تسجيل الخروج',
    'account.deleteAccount': 'طلب حذف الحساب',
    
    // Common
    'common.save': 'حفظ',
    'common.cancel': 'إلغاء',
    'common.edit': 'تعديل',
    'common.delete': 'حذف',
    'common.loading': 'جاري التحميل...',
    'common.error': 'خطأ',
    'common.success': 'نجح',
  },
  
  es: {
    // Navigation
    'nav.home': 'Inicio',
    'nav.library': 'Biblioteca',
    'nav.favorites': 'Favoritos',
    'nav.customize': 'Personalizar',
    'nav.settings': 'Configuración',
    
    // Home page
    'home.title': 'Inspiración Islámica Diaria',
    'home.subtitle': 'Hermosos versos coránicos como fondos de pantalla',
    'home.todayVerse': 'Verso de hoy',
    'home.generateWallpaper': 'Generar fondo de pantalla',
    'home.addToFavorites': 'Agregar a favoritos',
    'home.removeFromFavorites': 'Quitar de favoritos',
    
    // Library
    'library.title': 'Biblioteca de versos',
    'library.subtitle': 'Explora nuestra colección de versos coránicos',
    'library.search': 'Buscar versos...',
    'library.filter': 'Filtrar por tema',
    'library.all': 'Todos',
    'library.share': 'Compartir',
    'library.generateWallpaper': 'Generar fondo de pantalla',
    
    // Settings
    'settings.title': 'Configuración',
    'settings.subtitle': 'Personaliza tu experiencia con Ayah Wallpaper',
    'settings.account': 'Cuenta',
    'settings.appearance': 'Apariencia',
    'settings.language': 'Idioma y localización',
    'settings.notifications': 'Notificaciones',
    'settings.privacy': 'Datos y privacidad',
    
    // Language Settings
    'language.interfaceLanguage': 'Idioma de la interfaz',
    'language.interfaceLanguageDesc': 'Elige tu idioma preferido para la interfaz de la aplicación',
    'language.translationStyle': 'Estilo de traducción',
    'language.translationStyleDesc': 'Elige cómo prefieres que se traduzcan los versos coránicos',
    'language.arabicTextSettings': 'Configuración del texto árabe',
    'language.arabicTextSize': 'Tamaño del texto árabe',
    'language.regionalSettings': 'Configuración regional',
    'language.dateFormat': 'Formato de fecha',
    'language.timeFormat': 'Formato de hora',
    'language.unsavedChanges': 'Tienes cambios no guardados',
    'language.discard': 'Descartar',
    'language.saveChanges': 'Guardar cambios',
    'language.saving': 'Guardando...',
    
    // Translation styles
    'translation.literal': 'Traducción literal',
    'translation.interpretive': 'Traducción interpretativa',
    'translation.simplified': 'Lenguaje simplificado',
    
    // Date/Time formats
    'format.gregorian': 'Calendario gregoriano',
    'format.hijri': 'Calendario hijri',
    'format.both': 'Ambos calendarios',
    'format.12h': '12 horas (AM/PM)',
    'format.24h': '24 horas',
    
    // Account
    'account.displayName': 'Nombre para mostrar',
    'account.email': 'Dirección de correo electrónico',
    'account.verified': 'Verificado',
    'account.signOut': 'Cerrar sesión',
    'account.deleteAccount': 'Solicitar eliminación de cuenta',
    
    // Common
    'common.save': 'Guardar',
    'common.cancel': 'Cancelar',
    'common.edit': 'Editar',
    'common.delete': 'Eliminar',
    'common.loading': 'Cargando...',
    'common.error': 'Error',
    'common.success': 'Éxito',
    
    // Personalizar
    'customize.title': 'Personalizar fondo',
    'customize.subtitle': 'Crea tu fondo islámico perfecto',
    'customize.livePreview': 'Vista previa en vivo',
    'customize.reset': 'Restablecer',
    'customize.generateHint': 'Genera una vista previa para ver tu diseño',
    'customize.generatePreview': 'Generar vista previa',
    'customize.generating': 'Generando...',
    'customize.download': 'Descargar fondo',
    'customize.regenerate': 'Regenerar',
    'customize.sectionTitle': 'Personaliza tu fondo',
    'customize.resolution': 'Resolución',
    'customize.backgroundImages': 'Imágenes de fondo',
    'customize.gradient': 'Degradado',
    'customize.hide': 'Ocultar',
    'customize.customize': 'Personalizar',
    'customize.showOriginal': 'Ver original',
    
    // Fondo de pantalla
    'wallpaper.newVerse': 'Nuevo verso',
    'wallpaper.downloaded': 'Fondo descargado',
    'wallpaper.savedToDevice': 'Tu hermoso fondo islámico se ha guardado en tu dispositivo',
    'wallpaper.generated': 'Fondo generado',
    'wallpaper.previewReady': '¡Tu vista previa personalizada está lista!',
    'wallpaper.addedToFavorites': 'Agregado a favoritos',
    'wallpaper.savedToFavorites': 'Este verso se ha guardado en tus favoritos',
    'wallpaper.signInToSave': 'Inicia sesión para guardar favoritos',
  }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { settings, updateSettings } = useEnhancedUserSettings();
  
  const t = (key: string, defaultValue?: string): string => {
    const currentTranslations = translations[settings.language] || translations.en;
    return currentTranslations[key] || defaultValue || key;
  };

  const changeLanguage = async (language: string) => {
    await updateSettings({ language });
    
    // Update document direction for RTL languages
    if (language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = language;
    }
  };

  // Set initial direction and language
  useEffect(() => {
    if (settings.language === 'ar') {
      document.documentElement.dir = 'rtl';
      document.documentElement.lang = 'ar';
    } else {
      document.documentElement.dir = 'ltr';
      document.documentElement.lang = settings.language;
    }
  }, [settings.language]);

  return (
    <LanguageContext.Provider value={{
      currentLanguage: settings.language,
      t,
      changeLanguage
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};