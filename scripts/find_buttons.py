import os, sys

def find_buttons_without_title(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    results = []
    i = 0
    while i < len(content):
        idx = content.find('<Button', i)
        if idx == -1:
            break
        # Make sure it's not ButtonXyz (check next char is space, newline, / or >)
        if idx + 7 < len(content) and content[idx+7] not in (' ', '\n', '\r', '\t', '/', '>'):
            i = idx + 7
            continue
        j = idx + 7
        in_str = None
        depth = 0
        while j < len(content):
            c = content[j]
            if in_str:
                if c == in_str:
                    in_str = None
            elif c in ('"', "'"):
                in_str = c
            elif c == '{':
                depth += 1
            elif c == '}':
                depth -= 1
            elif c == '>' and depth == 0:
                break
            j += 1
        tag_text = content[idx:j+1]
        line_no = content[:idx].count('\n') + 1

        has_title = 'title=' in tag_text
        has_asChild = 'asChild' in tag_text

        if not has_title and not has_asChild:
            results.append((line_no, tag_text.replace('\n', ' ')[:200]))

        i = j + 1

    return results

files = sys.argv[1:]
if not files:
    # read from stdin
    files = [l.strip() for l in sys.stdin if l.strip()]

for f in files:
    if os.path.exists(f):
        res = find_buttons_without_title(f)
        if res:
            print('FILE: ' + f)
            for line, tag in res:
                print('  L' + str(line) + ': ' + tag[:180])
            print()
    else:
        print('MISSING: ' + f)
