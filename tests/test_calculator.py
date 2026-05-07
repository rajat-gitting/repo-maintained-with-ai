import pytest
from calculator import add, subtract, multiply, power, square_root


def test_add():
    assert add(1, 2) == 3
    assert add(-1, 1) == 0
    assert add(0.1, 0.2) == pytest.approx(0.3)


def test_subtract():
    assert subtract(5, 3) == 2
    assert subtract(0, 5) == -5


def test_multiply():
    assert multiply(3, 4) == 12
    assert multiply(-2, 3) == -6
    assert multiply(0, 100) == 0


def test_power():
    assert power(2, 3) == 8.0
    assert power(2, -3) == 0.125
    assert power(0, 5) == 0.0
    assert power(5, 0) == 1.0
    assert power(0, 0) == 1.0  # By convention, 0^0 is often treated as 1


def test_square_root():
    assert square_root(4) == 2.0
    assert square_root(0) == 0.0
    with pytest.raises(ValueError, match='Cannot compute square root of a negative number'):
        square_root(-1)
