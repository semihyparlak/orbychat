with open('app/Http/Controllers/Widget/InitController.php', 'r', encoding='utf-8') as f:
    content = f.read()

print(f"[: {content.count('[')}")
print(f"]: {content.count(']')}")
print(f"(: {content.count('(')}")
print(f"): {content.count(')')}")
print(f"{{: {content.count('{')}")
print(f"}}: {content.count('}')}")
