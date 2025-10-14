import React from "react";
import { View, Pressable, ActivityIndicator, Platform, Keyboard, Animated, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePathname, router } from "expo-router";
import * as Haptics from "expo-haptics";
import { Text } from "react-native";
import * as Lucide from "lucide-react-native";

export type StickyActionItem = {
  key: string;
  label: string;
  iconName?: keyof typeof Lucide; // "Home" | "ReceiptText" | "UserRound" | ...
  href?: string;
  onPress?: () => void;
  disabled?: boolean;
  loading?: boolean;
  accessibilityLabel?: string;
  testID?: string;
  badgeCount?: number;
};

export type StickyBottomActionsProps = {
  items: StickyActionItem[];            // 2 ou 3
  elevated?: boolean;
  hideWhenKeyboardShown?: boolean;      // default: true
  bottomOffset?: number;
  activeHrefStrategy?: "exact" | "startsWith"; // default: "startsWith"
  containerClassName?: string;
  itemClassName?: string;
};

const useKeyboardVisible = () => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const s1 = Keyboard.addListener("keyboardDidShow", () => setVisible(true));
    const s2 = Keyboard.addListener("keyboardDidHide", () => setVisible(false));
    return () => { s1.remove(); s2.remove(); };
  }, []);
  return visible;
};

const isActiveHref = (pathname: string, href?: string, strategy: "exact" | "startsWith" = "startsWith") => {
  if (!href) return false;
  
  // Normaliser les chemins pour la comparaison
  const normalizedPathname = pathname.replace(/\/$/, ''); // Supprimer le slash final
  const normalizedHref = href.replace(/\/$/, ''); // Supprimer le slash final
  
  console.log(`[isActiveHref] Comparing: "${normalizedPathname}" with "${normalizedHref}"`);
  
  if (strategy === "exact") {
    return normalizedPathname === normalizedHref;
  } else {
    return normalizedPathname.startsWith(normalizedHref);
  }
};

const Pill: React.FC<{
  item: StickyActionItem;
  active: boolean;
  compact: boolean;
  itemClassName?: string;
}> = ({ item, active, compact, itemClassName }) => {
  console.log(`[Pill] ${item.label} - active: ${active}, href: ${item.href}`);
  if (active) {
    console.log(`[Pill] 🎯 ${item.label} is ACTIVE - applying pillActive styles`);
  }
  const scale = React.useRef(new Animated.Value(1)).current;
  const Icon = item.iconName && Lucide[item.iconName] ? Lucide[item.iconName] : Lucide.ChevronRight;

  const onPressInner = () => {
    if (item.disabled || item.loading) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (item.href) router.push(item.href);
    else item.onPress?.();
  };

  const onIn = () => Animated.spring(scale, { toValue: 0.98, useNativeDriver: true, speed: 50, bounciness: 0 }).start();
  const onOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50, bounciness: 0 }).start();

  const baseHeight = compact ? 52 : 56;

  return (
    <Animated.View style={{ transform: [{ scale }] }} className="flex-1">
      <Pressable
        onPress={onPressInner}
        onPressIn={onIn}
        onPressOut={onOut}
        disabled={item.disabled || item.loading}
        accessibilityRole="button"
        accessibilityLabel={item.accessibilityLabel ?? item.label}
        testID={item.testID}
        style={[
          styles.pill,
          {
            height: compact ? 52 : 56,
            paddingHorizontal: compact ? 16 : 20,
            opacity: item.disabled ? 0.5 : 1,
            ...(active ? styles.pillActive : {}),
          }
        ]}
      >
        <Text style={[
          styles.pillText,
          { fontSize: compact ? 14 : 16 },
          active ? styles.pillTextActive : {}
        ]}>
          {item.label}
        </Text>

        {item.loading ? (
          <ActivityIndicator />
        ) : (
          <View style={styles.pillRight}>
            {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{item.badgeCount}</Text>
              </View>
            )}
            <Icon size={compact ? 18 : 20} color={active ? "#000000" : "#fff"} />
          </View>
        )}
      </Pressable>
    </Animated.View>
  );
};

const StickyBottomActions: React.FC<StickyBottomActionsProps> = ({
  items,
  elevated = true,
  hideWhenKeyboardShown = true,
  bottomOffset = 0,
  activeHrefStrategy = "startsWith",
  containerClassName,
  itemClassName,
}) => {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const keyboardVisible = useKeyboardVisible();

  console.log('[StickyBottomActions] Current pathname:', pathname);

  const compact = items.length === 3; // auto-compact pour 3 boutons
  const gap = compact ? 10 : 12;

  if (hideWhenKeyboardShown && keyboardVisible) return null;

  return (
    <View
      pointerEvents="box-none"
      style={[
        styles.stickyContainer,
        { paddingBottom: insets.bottom + bottomOffset }
      ]}
    >
      {/* Pas de fond opaque: on ne rend que les pills */}
      <View style={[styles.pillsContainer, { columnGap: compact ? 10 : 12 }]}>
        {items.map((it) => (
          <Pill
            key={it.key}
            item={it}
            active={isActiveHref(pathname, it.href, activeHrefStrategy)}
            compact={compact}
            itemClassName={itemClassName}
          />
        ))}
      </View>
    </View>
  );
};

export default StickyBottomActions;

// Styles de fallback pour iOS (quand NativeWind ne fonctionne pas)
const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 24,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.4,
        shadowRadius: 10,
      },
      android: {
        elevation: 10,
      },
    }),
  },
  pillActive: {
    borderColor: 'rgba(0, 0, 0, 0.6)',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', // Fond blanc pour contraste
  },
  pillText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#000000', // Texte noir pour l'état actif
  },
  pillRight: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8, // Espacement entre texte et icône
  },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    borderRadius: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  badgeText: {
    fontSize: 11,
    color: '#ffffff',
    fontWeight: '600',
  },
  pillsContainer: {
    flexDirection: 'row',
  },
  stickyContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
    backgroundColor: 'transparent', // Pas de fond
    alignItems: 'center', // Centrer les boutons
  },
});