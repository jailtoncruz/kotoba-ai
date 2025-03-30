import { useTranslation } from "react-i18next";
import LanguageSwitcher from "@components/LanguageSwitcher";
import { Logo } from "@components/Logo";
import { Text } from "@radix-ui/themes";
import { Route, Routes } from "react-router-dom";
import { Login } from "./Login";
import { SignUp } from "./SignUp";

export function SignIn() {
  const { t } = useTranslation();

  return (
    <div className="bg-primary flex-1 flex flex-row">
      <div className="flex-1 flex-col items-center hidden md:flex">
        <div className="flex-1 max-w-[400px] flex flex-col items-center justify-center gap-16">
          <Logo apparence="off-white" />
          <div className="flex flex-col items-center justify-center gap-2">
            <Text
              className="font-montserrat font-black text-xl text-background"
              align={"center"}
            >
              {t("signIn.message1")}
            </Text>
            <Text
              className="font-montserrat font-semibold text-base text-background"
              align={"center"}
            >
              {t("signIn.message2")}
            </Text>
          </div>
        </div>
      </div>

      <div className="flex flex-1 flex-col bg-background py-2 ">
        <Routes>
          <Route path="" element={<Login />} />
          <Route path="sign-up" element={<SignUp />} />
        </Routes>

        <footer className="flex flex-col items-center justify-center gap-2">
          <div className="flex flex-row gap-4 items-center">
            🌐 <LanguageSwitcher />
          </div>
          <p className="font-montserrat text-sm text-center">
            {t("copyright.title")}
          </p>
        </footer>
      </div>
    </div>
  );
}
