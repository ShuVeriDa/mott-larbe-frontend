import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/locales";

const RootPage = () => {
	redirect(`/${DEFAULT_LOCALE}`);
};

export default RootPage;
