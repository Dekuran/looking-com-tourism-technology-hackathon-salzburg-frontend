import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import lookingLogo from "@/assets/looking-logo.png";

const Navigation = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    i18n.changeLanguage(i18n.language === 'de' ? 'en' : 'de');
  };

  const links = [
    { to: "/", label: t("nav.chat") },
    { to: "/hotel", label: t("nav.hotel") },
    { to: "/admin", label: t("nav.admin") },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <img src={lookingLogo} alt="looking.com" className="h-7" />
          <div className="flex gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link key={link.to} to={link.to}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    size="sm"
                    className="rounded-lg"
                  >
                    {link.label}
                  </Button>
                </Link>
              );
            })}
          </div>
        </div>
        <Button variant="ghost" size="sm" onClick={toggleLanguage} className="rounded-lg gap-2 font-medium">
          <span className="text-lg">{i18n.language === 'de' ? '🇩🇪' : '🇬🇧'}</span>
          <span className="text-xs">{i18n.language.toUpperCase()}</span>
        </Button>
      </div>
    </nav>
  );
};

export default Navigation;
