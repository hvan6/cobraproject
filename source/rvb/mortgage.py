# -*- coding: utf-8 -*-

"""Mortgage calculator
"""

import numpy as np

__all__ = [
    'payment',
    'balance'
]


def payment(P, r, n):

    c = (1 + r) ** n

    with np.errstate(invalid='ignore', divide='ignore'):
        vt = P * r * c / (c - 1)
    vf = P / n

    return np.where(r > 0, vt, vf)


def balance(P, r, n, p):

    m = 1 + r
    c = m ** n

    with np.errstate(invalid='ignore', divide='ignore'):
        Bt = P * (c - m ** p) / (c - 1)
    Bf = P * (1 - p / n)

    return np.maximum(0, np.where(r > 0, Bt, Bf))
