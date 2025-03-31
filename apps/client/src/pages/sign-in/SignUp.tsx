import { Link } from "react-router-dom";
import { SignUpForm } from "../../features/sign-in";
import { Logo } from "../../components/Logo";
import { useTranslation } from "react-i18next";

export function SignUp() {
  const { t } = useTranslation();

  return (
    <div className="flex-1  flex flex-col items-center justify-center gap-4">
      <Logo apparence="red" className="md:hidden" />

      <div className="flex flex-col px-4 py-8 rounded max-w-[400px] w-full">
        <p className="text-xl font-bold font-montserrat my-8">
          {t("signIn.title")}
        </p>
        <div className="flex flex-col gap-2">
          <SignUpForm />
        </div>
        <p className="text-sm text-center mt-2 text-slate-700">
          {t("signIn.signUp.haveAccount")}{" "}
          <Link to="/sign-in" className="text-blue-700 cursor-pointer">
            {t("signIn.login.title")}
          </Link>
        </p>

        <p className="text-slate-700 text-sm text-center mt-2">
          {t("signIn.privacyMessage")}
        </p>
      </div>
    </div>
  );
}
