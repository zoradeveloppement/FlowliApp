import React from "react";
import StickyBottomActions from "./StickyBottomActions";
import { usePathname } from "expo-router";

const AppBottomNav = () => {
  const pathname = usePathname();

  console.log('[AppBottomNav] Current pathname:', pathname);

  // Optionnel: n'afficher que sur les routes racines
  const showOn = ["/home", "/factures", "/profile"];
  const visible = showOn.some((p) => pathname.startsWith(p));
  
  console.log('[AppBottomNav] Show on routes:', showOn);
  console.log('[AppBottomNav] Visible:', visible);
  
  if (!visible) {
    console.log('[AppBottomNav] Not rendering - route not in whitelist');
    return null;
  }

  console.log('[AppBottomNav] Rendering navigation pills');

  return (
    <StickyBottomActions
      items={[
        { key: "home",    label: "Home",        iconName: "Home",        href: "/(app)/home",     testID: "nav-home" },
        { key: "billing", label: "Facturation", iconName: "ReceiptText", href: "/(app)/factures", testID: "nav-billing" },
        { key: "profile", label: "Profil",      iconName: "UserRound",   href: "/(app)/profile",  testID: "nav-profile" },
      ]}
      elevated
      hideWhenKeyboardShown
      activeHrefStrategy="startsWith"
    />
  );
};

export default AppBottomNav;
