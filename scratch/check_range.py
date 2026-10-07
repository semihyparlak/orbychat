def check_range(filename, start, end):
    with open(filename, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    content = "".join(lines[start-1:end])
    
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    
    for i, char in enumerate(content):
        if char in '([{':
            stack.append((char, i))
        elif char in ')]}':
            if not stack:
                print(f"Unexpected {char} at index {i}")
                continue
            top, pos = stack.pop()
            if top != pairs[char]:
                print(f"Mismatch: {char} at index {i} does not match {top} at {pos}")
    
    if stack:
        for char, pos in stack:
            print(f"Unclosed {char} at index {pos}")
    else:
        print("Range is balanced!")

check_range('app/Http/Controllers/Widget/InitController.php', 198, 331)
