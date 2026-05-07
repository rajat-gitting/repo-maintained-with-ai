def reverse(s: str) -> str:
    return s[::-1]


def is_palindrome(s: str) -> bool:
    cleaned = s.lower().replace(" ", "")
    return cleaned == cleaned[::-1]


def word_count(s: str) -> int:
    return len(s.split()) if s.strip() else 0
