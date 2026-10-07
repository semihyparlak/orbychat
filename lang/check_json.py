import json

try:
    with open('lang/tr.json', 'r', encoding='utf-8') as f:
        data = f.read()
        json.loads(data)
    print("Valid JSON")
except json.JSONDecodeError as e:
    print(f"Error at line {e.lineno}, col {e.colno}: {e.msg}")
    # Print lines around the error
    lines = data.split('\n')
    start = max(0, e.lineno - 5)
    end = min(len(lines), e.lineno + 5)
    for i in range(start, end):
        print(f"{i+1}: {lines[i]}")
except Exception as e:
    print(f"Other error: {e}")
