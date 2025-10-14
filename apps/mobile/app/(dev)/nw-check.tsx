import { View, Text, StyleSheet, Platform } from "react-native";

export default function NWCheck() {
  return (
    <View style={styles.container}>
      {/* Test avec StyleSheet (fallback) */}
      <View style={styles.pill}>
        <Text style={styles.pillText}>Pill StyleSheet (toujours visible)</Text>
      </View>
      
      {/* Test avec className (NativeWind) */}
      <View className="h-16 px-6 rounded-3xl bg-black/90 border border-white/10 items-center justify-center mt-4">
        <Text className="text-white font-semibold">Pill className (NativeWind)</Text>
      </View>
      
      <Text style={styles.info}>
        Si vous voyez 2 pills noirs → NativeWind fonctionne ✅{'\n'}
        Si vous voyez 1 pill + du texte → NativeWind ne fonctionne pas ❌
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  pill: {
    height: 64,
    paddingHorizontal: 24,
    borderRadius: 32,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  pillText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  info: {
    marginTop: 20,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
