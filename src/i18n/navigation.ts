import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

export const {
  Link: LocaleLink,
  getPathname: getLocalePathname,
  redirect: localeRedirect,
  usePathname: useLocalePathname,
  useRouter: useLocaleRouter,
} = createNavigation(routing);

