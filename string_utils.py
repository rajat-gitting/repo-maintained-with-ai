import re

def reverse(s: str) -> str:
    return s[::-1]

def is_palindrome(s: str) -> bool:
    cleaned = re.sub(r'[^a-zA-Z0-9]', '', s).lower()
    return cleaned == cleaned[::-1]

def word_count(s: str) -> int:
    return len(s.split()) if s.strip() else 0

def count_vowels(s: str) -> int:
    return sum(1 for char in s.lower() if char in 'aeiou')

def reverse_words(s: str) -> str:
    return ' '.join(reversed(s.split()))
