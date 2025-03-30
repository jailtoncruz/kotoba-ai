import { Link } from "react-router-dom";
import { Logo } from "../../components/Logo";
import { useTranslation } from "react-i18next";
import { LoginForm } from "../../features/sign-in";
import { Separator } from "@radix-ui/themes";

export function Login() {
  const { t } = useTranslation();
  return (
    <div className="flex-1  flex flex-col items-center justify-center gap-4">
      <Logo apparence="red" className="md:hidden" />

      <div className="flex flex-col px-4 py-8 rounded max-w-[400px] w-full">
        <p className="text-xl font-bold font-montserrat my-8">
          {t("signIn.title")}
        </p>
        <div className="flex flex-col gap-2">
          <LoginForm />
        </div>
        <p className="text-sm text-center mt-2 text-slate-700">
          Don't have an account?{" "}
          <Link to="sign-up" className="text-blue-700 cursor-pointer">
            Sign Up
          </Link>
        </p>

        <p className="text-slate-700 text-sm text-center mt-2">
          {t("signIn.privacyMessage")}
        </p>

        <Separator className="my-4" size={"4"} />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 px-4 rounded-lg hover:bg-red-500 transition duration-200"
        >
          {t("signIn.guest")}
        </button>

        <p className="text-slate-700 text-sm text-center mt-4">
          {t("signIn.noLoginMessage")}
        </p>
      </div>
    </div>
  );
}
