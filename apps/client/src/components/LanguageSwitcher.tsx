import { useTranslation } from "react-i18next";

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex space-x-4">
      <button
        onClick={() => changeLanguage("en")}
        className="text-slate-600 rounded"
      >
        English
      </button>
      <button
        onClick={() => changeLanguage("ja")}
        className="text-slate-600 rounded"
      >
        日本語
      </button>
      <button
        onClick={() => changeLanguage("pt")}
        className="text-slate-600 rounded"
      >
        Português
      </button>
    </div>
  );
};

export default LanguageSwitcher;
