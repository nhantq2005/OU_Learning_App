import os
import re

directory = r'D:\OU_Learning_App\screens'

# Colors mapping to replace
colors_map = {
    '#0961F5': 'Theme.colors.primary',
    '#202244': 'Theme.colors.text',
    '#545454': 'Theme.colors.textMuted',
    '#F5F9FF': 'Theme.colors.canvas',
    '#FFFFFF': 'Theme.colors.surface',
    '#FF6B00': 'Theme.colors.danger',
    '#167F71': 'Theme.colors.secondary',
    '#E2E6EA': 'Theme.colors.border',
    '#A0A4AB': 'Theme.colors.textMuted',
    '#333': 'Theme.colors.text',
    '#666': 'Theme.colors.textMuted',
    '#888': 'Theme.colors.textMuted',
    '#999': 'Theme.colors.textMuted',
    '#ccc': 'Theme.colors.border',
    '#eee': 'Theme.colors.surfaceMuted',
    '#f5f5f5': 'Theme.colors.canvas',
    '#fff': 'Theme.colors.surface',
    '#000': 'Theme.colors.text',
    'black': 'Theme.colors.text',
    'white': 'Theme.colors.surface',
    'red': 'Theme.colors.danger',
    'gray': 'Theme.colors.textMuted',
}

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content
            
            rel_path = os.path.relpath(filepath, r'D:\OU_Learning_App\screens')
            num_dirs_up = len(os.path.dirname(rel_path).split(os.sep))
            # Screens are in e.g., 'user/Login.js' -> num_dirs_up = 1.
            # So from user/Login.js to styles/Theme.js, it's ../../styles/Theme
            theme_path = '../' * (num_dirs_up + 1) + 'styles/Theme'
            theme_import_statement = f"import Theme from '{theme_path}';"
            
            if 'import Theme from' not in content:
                # Add import Theme after other imports
                last_import_idx = content.rfind('import ')
                if last_import_idx != -1:
                    end_of_line = content.find('\n', last_import_idx)
                    content = content[:end_of_line+1] + theme_import_statement + '\n' + content[end_of_line+1:]
                else:
                    content = theme_import_statement + '\n' + content

            for hex_code, theme_var in colors_map.items():
                content = re.sub(f'[\"\']{hex_code}[\"\']', theme_var, content, flags=re.IGNORECASE)

            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {filepath}')
