from string_utils import reverse, is_palindrome, word_count, count_vowels, reverse_words
import pytest

def test_reverse():
    assert reverse("hello") == "olleh"
    assert reverse("") == ""
    assert reverse("a") == "a"

def test_is_palindrome():
    assert is_palindrome("racecar") is True
    assert is_palindrome("A man a plan a canal Panama") is True
    assert is_palindrome("hello") is False
    assert is_palindrome("No 'x' in Nixon") is True

def test_word_count():
    assert word_count("hello world") == 2
    assert word_count("  ") == 0
    assert word_count("one") == 1

def test_count_vowels():
    assert count_vowels("hello") == 2
    assert count_vowels("HELLO") == 2
    assert count_vowels("xyz") == 0
    assert count_vowels("") == 0

def test_reverse_words():
    assert reverse_words("hello world") == "world hello"
    assert reverse_words("  hello   world  ") == "world hello"
    assert reverse_words("one") == "one"
    assert reverse_words("") == ""
