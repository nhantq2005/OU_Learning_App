import { useColorScheme } from "react-native";


const Colors = {
    light: {
        primary: "#0961F5",
        onPrimary: "#FFFFFF",
        primaryContainer: "#D6E3FF",
        onPrimaryContainer: "#001A41",

        secondary: "#202244",
        onSecondary: "#FFFFFF",
        secondaryContainer: "#DDE1FF",
        onSecondaryContainer: "#141632",

        tertiary: "#167F71",
        onTertiary: "#FFFFFF",
        tertiaryContainer: "#AEECE2",
        onTertiaryContainer: "#003731",

        background: "#F5F9FF",
        onBackground: "#202244",

        surface: "#FFFFFF",
        onSurface: "#202244",

        surfaceVariant: "#E2E6EA",
        onSurfaceVariant: "#545454",

        outline: "#A0A4AB",
        outlineVariant: "#B4BDC4",

        error: "#FF6B00",
        onError: "#FFFFFF",
        errorContainer: "#FFE1CC",
        onErrorContainer: "#3A1600",
    },

    dark: {
        primary: "#AFC8FF",
        onPrimary: "#00306F",
        primaryContainer: "#0047A8",
        onPrimaryContainer: "#D6E3FF",

        secondary: "#BDC2FF",
        onSecondary: "#181B36",
        secondaryContainer: "#2F3158",
        onSecondaryContainer: "#DDE1FF",

        tertiary: "#8DD0C6",
        onTertiary: "#003731",
        tertiaryContainer: "#005048",
        onTertiaryContainer: "#AEECE2",

        background: "#0E0F12",
        onBackground: "#E3E7ED",

        surface: "#121317",
        onSurface: "#E3E7ED",

        surfaceVariant: "#41464F",
        onSurfaceVariant: "#C7CBD4",

        outline: "#8D929A",

        error: "#FFB599",
        onError: "#4A1A00",
    }
};

// const scheme = useColorScheme();
// const theme = scheme === "light" ? Colors.light : Colors.dark;

export default Colors;


