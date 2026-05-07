def add(a: float, b: float) -> float:
    return a + b


def subtract(a: float, b: float) -> float:
    return a - b


def multiply(a: float, b: float) -> float:
    return a * b


def power(base: float, exponent: float) -> float:
    return base ** exponent


def square_root(n: float) -> float:
    if n < 0:
        raise ValueError('Cannot compute square root of a negative number')
    return n ** 0.5
