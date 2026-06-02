import { redirect } from "next/navigation";
import { DEFAULT_LOCALE } from "@/i18n/locale-list";

const RootPage = () => {
	redirect(`/${DEFAULT_LOCALE}`);
};

export default RootPage;
