const Theme = {
    colors: {
        primary: '#2563EB',       // Ocean Blue
        primaryPressed: '#1D4ED8', // Darker Blue
        primarySoft: '#EFF6FF',    // Light Blue
        secondary: '#0EA5E9',      // Sky Blue accent
        secondarySoft: '#F0F9FF',
        canvas: '#F8FAFC',         // Slate 50
        surface: '#FFFFFF',
        surfaceMuted: '#F1F5F9',   // Slate 100
        text: '#0F172A',           // Slate 900
        textMuted: '#64748B',      // Slate 500
        border: '#E2E8F0',         // Slate 200
        warning: '#F59E0B',        // Amber 500
        warningSoft: '#FFFBEB',
        danger: '#EF4444',         // Red 500
        dangerSoft: '#FEF2F2',
        success: '#10B981',        // Emerald 500
        successSoft: '#ECFDF5',
    },
    radius: {
        sm: 10,
        md: 16,
        lg: 24,
        pill: 999,
    },
    shadow: {
        shadowColor: '#182033',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.08,
        shadowRadius: 20,
        elevation: 4,
    },
};

export default Theme;
