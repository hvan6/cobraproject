# -*- coding: utf-8 -*-

"""Visualization utilities
"""

import contextlib
import math
import matplotlib.pyplot as plt
import numpy as np

__all__ = ['plot_rvb_curve']


def price_formatter(price, loc):
    sign = '-' if price < 0 else ''
    price = abs(price)
    if price == 0:
        order = 0
    else:
        order = int(math.log10(price))
    if order >= 9:
        return '${}{:g}'.format(sign, price)
    decimals = 2 - order % 3
    price = round(price / 10 ** (order // 3 * 3), decimals)
    label = '${}{:.{:d}f}'.format(sign, price, decimals)
    suffix = {2: 'M', 1: 'K', 0: ''}
    return label + suffix[order // 3]


def crossover(a, b):
    sign = np.sign(a - b)
    idx, = np.where(sign[:-1] != sign[1:])
    idx += 1
    return idx


@contextlib.contextmanager
def style():
    import seaborn as sns
    sns.set_palette('colorblind')
    sns.set_style('darkgrid')
    try:
        yield
    finally:
        sns.reset_orig()


def plot_rvb_curve(r, b, show_crossover=True, **fig_kwargs):

    years = np.arange(1, r.size + 1)

    fig = plt.figure(**fig_kwargs)
    fig.clf()
    ax = fig.gca()

    ax.plot(years, r, label='Rent')
    ax.plot(years, b, label='Buy')

    ymin, ymax = ax.get_ylim()
    ymax = ymax + 0.2 * (ymax - ymin)

    if show_crossover:
        idx = crossover(r, b)
        ax.vlines(years[idx], ymin, ymax, color='k', linestyle='--')

    ax.set_xlim(1, r.size)
    ax.set_ylim(ymin, ymax)

    ax.legend(loc='upper right', frameon=True, framealpha=1.0, facecolor='w')
    ax.yaxis.set_major_formatter(plt.FuncFormatter(price_formatter))
    ax.set_xlabel('Year')
    ax.set_ylabel('Net Value')

    return fig
