def check_balance(filename):
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()
    
    stack = []
    pairs = {')': '(', ']': '[', '}': '{'}
    lines = content.split('\n')
    
    for i, line in enumerate(lines):
        for char in line:
            if char in '([{':
                stack.append((char, i + 1))
            elif char in ')]}':
                if not stack:
                    print(f"Unexpected {char} on line {i + 1}")
                    return
                top, line_num = stack.pop()
                if top != pairs[char]:
                    print(f"Mismatch: {char} on line {i + 1} does not match {top} from line {line_num}")
                    return
    
    if stack:
        for char, line_num in stack:
            print(f"Unclosed {char} from line {line_num}")
    else:
        print("Balanced!")

check_balance('app/Http/Controllers/Widget/InitController.php')
