import os
import re

directory = r'D:\OU_Learning_App\screens'

for root, _, files in os.walk(directory):
    for file in files:
        if file.endswith('.js'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            original_content = content
            
            # Find attribute=Theme.colors.something and replace with attribute={Theme.colors.something}
            # Be careful not to replace if it's already in braces, but the regex `(\w+)=Theme\.colors\.([a-zA-Z0-9_]+)`
            # only matches when there is NO brace before Theme.
            content = re.sub(r'(\w+)=Theme\.colors\.([a-zA-Z0-9_]+)', r'\1={Theme.colors.\2}', content)

            if content != original_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Fixed JSX in {filepath}')
