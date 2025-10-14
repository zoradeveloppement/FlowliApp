import React from "react";
import { View, Pressable, ActivityIndicator, Platform, Keyboard, Animated } from "react-native";
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
  return strategy === "exact" ? pathname === href : pathname.startsWith(href);
};

const Pill: React.FC<{
  item: StickyActionItem;
  active: boolean;
  compact: boolean;
  itemClassName?: string;
}> = ({ item, active, compact, itemClassName }) => {
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
        className={[
          "flex-row items-center justify-between",
          "rounded-3xl bg-black/90 border border-white/10",
          active ? "ring-1 ring-white/25" : "ring-0",
          Platform.OS === "ios" ? "shadow-lg" : "",
          itemClassName ?? "",
        ].join(" ")}
        style={{
          height: compact ? 52 : 56,
          paddingHorizontal: compact ? 16 : 20,
          ...(Platform.OS === "ios"
            ? { shadowColor: "#000", shadowOpacity: 0.4, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } }
            : { elevation: 10 }),
          opacity: item.disabled ? 0.5 : 1,
        }}
      >
        <Text className={compact ? "text-sm font-semibold text-white" : "text-base font-semibold text-white"}>
          {item.label}
        </Text>

        {item.loading ? (
          <ActivityIndicator />
        ) : (
          <View className="flex-row items-center">
            {typeof item.badgeCount === "number" && item.badgeCount > 0 && (
              <View className="min-w-5 h-5 px-1 rounded-full bg-white/15 items-center justify-center mr-2">
                <Text className="text-[11px] text-white">{item.badgeCount}</Text>
              </View>
            )}
            <Icon size={compact ? 18 : 20} color="#fff" />
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

  const compact = items.length === 3; // auto-compact pour 3 boutons
  const gap = compact ? 10 : 12;

  if (hideWhenKeyboardShown && keyboardVisible) return null;

  return (
    <View
      pointerEvents="box-none"
      className={["absolute inset-x-0 bottom-0 px-4 pt-2", containerClassName ?? ""].join(" ")}
      style={{ paddingBottom: insets.bottom + bottomOffset }}
    >
      {/* Pas de fond opaque: on ne rend que les pills */}
      <View className="flex-row" style={{ columnGap: compact ? 10 : 12 }}>
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