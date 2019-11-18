# -*- coding: utf-8 -*-

"""Rent vs Buy calculator
"""

import numpy as np

from . import defaults
from . import mortgage

__all__ = [
    'Renter',
    'Buyer',
    'calculate_buyer_net_value',
    'calculate_renter_net_value'
]


class HomeSeeker:

    def __init__(self, params):
        for key, val in params.items():
            setattr(self, key, val)

    def __setattr__(self, name, value):
        super().__setattr__(name, np.asarray(value))


class Renter(HomeSeeker):

    def __init__(self):
        super().__init__(defaults.renter_params)

    @property
    def startup_costs(self):
        return self.rent_price * (self.security_deposit + self.brokers_fee)

    def calculate_rent_price(self, year):
        return self.rent_price * (1 + self.appreciation_rate) ** (year - 1)

    def calculate_monthly_costs(self, year):
        return (
            self.calculate_rent_price(year) +
            self.renters_insurance +
            self.utilities
        )

    def calculate_annual_costs(self, year):
        return 12 * self.calculate_monthly_costs(year)

    def calculate_total_costs(self, year):
        return (
            self.startup_costs +
            self.calculate_annual_costs(year).cumsum(axis=-1)
        )


class Buyer(HomeSeeker):

    def __init__(self):
        super().__init__(defaults.buyer_params)

    @property
    def startup_costs(self):
        return (self.down_payment +
                self.buying_closing_cost * self.home_price)

    @property
    def mortgage_amount(self):
        return np.maximum(0, self.home_price - self.down_payment)

    def calculate_mortgage_balance(self, month):
        return mortgage.balance(
            self.mortgage_amount,
            self.mortgage_rate / 12,
            12 * self.mortgage_term,
            month
        )

    def calculate_mortgage_payment(self, year):

        mortgage_payment = mortgage.payment(
            self.mortgage_amount,
            self.mortgage_rate / 12,
            12 * self.mortgage_term
        )
        mortgage_balance = self.calculate_mortgage_balance(12 * year)

        return np.minimum(mortgage_payment, mortgage_balance)

    def calculate_home_value(self, year):
        return self.home_price * (1 + self.appreciation_rate) ** (year - 1)

    def calculate_monthly_costs(self, year):
        return (
            self.calculate_mortgage_payment(year) +
            self.utilities +
            self.common_fees
        )

    def calculate_annual_costs(self, year):
        return (
            12 * self.calculate_monthly_costs(year) +
            self.calculate_home_value(year) * (
                self.homeowners_insurance_rate +
                self.property_tax_rate +
                self.maintenance_rate
            )
        )

    def calculate_total_costs(self, year):
        return (
            self.startup_costs +
            self.calculate_annual_costs(year).cumsum(axis=-1)
        )

    def calculate_home_equity(self, year):

        home_value = self.calculate_home_value(year)
        mortgage_balance = self.calculate_mortgage_balance(12 * year)

        return (
            home_value * (1 - self.selling_closing_cost) -
            mortgage_balance
        )


def calculate_cost_differential(renter, buyer, year):
    """Calculate difference between buyer's and renter's annual costs over
    time.
    """
    buyer_costs = buyer.calculate_annual_costs(year)
    renter_costs = renter.calculate_annual_costs(year)

    return (
        buyer_costs -
        renter_costs
    )


def calculate_roi(surplus, init_amount, return_rate):
    """
    Calculate renter's return on investment.

    .. math::
        \\text{ROI}_t = (1 + r) \\text{ROI}_{t - 1} + (1 + r / 2) S_{t - 1}

    Surplus is compounded at half the rate to reflect the fact that it's not
    available at the beginning of the year.

    Parameters
    ----------
    surplus : numpy.ndarray, shape (..., num_years)
        Rent versus buy surpluses from year 1 through year `num_years` - 1
        (>=0)

    init_amount : numpy.ndarray, broadcastable against `surplus`
        Initial investment amount (>=0)

    return_rate : numpy.ndarray, broadcastable against `surplus`
        Renter's investment return rate

    Returns
    -------
    roi : numpy.ndarray, shape (..., num_years)
        Renter's return on investment

    """
    surplus, init_amount, return_rate = np.broadcast_arrays(surplus,
                                                            init_amount,
                                                            return_rate)

    roi = np.empty_like(surplus)
    roi[..., 0] = init_amount[..., 0]
    for t in range(1, roi.shape[-1]):
        roi[..., t] = (
            roi[..., t - 1] * (1 + return_rate[..., t - 1]) +
            surplus[..., t - 1] * (1 + return_rate[..., t - 1] / 2)
        )

    return roi


def calculate_buyer_net_value(buyer, num_years):
    """
    Calculate buyer's net value as home equity over time. Home equity is
    defined as home value less closing costs and outstanding mortgage balance.

    Parameters
    ----------
    buyer : Buyer
        Buyer object

    num_years : int
        Number of years occupied

    Returns
    -------
    net_value : numpy.ndarray, shape (..., `num_years`)
        Net value

    """
    return buyer.calculate_home_equity(np.arange(1, num_years + 1))


def calculate_renter_net_value(renter, buyer, num_years):
    """
    Calculate renter's net value as taxed return on investment over time.

    .. math::
        \\text{NV}_t = \\text{ROI}_t - r * (\\text{ROI}_t - \\text{ROI}_1 -
        \\sum_{i=1}^{t-1} S_i) + \\sum_{i=1}^{t} D_i

    Parameters
    ----------
    renter : Renter
        Renter object

    buyer : Buyer
        Buyer object

    num_years : int
        Number of year occupied

    Returns
    -------
    net_value : numpy.ndarray, shape (..., `num_years`)
        Net value

    """
    # diff = buyer costs - renter costs
    diff = calculate_cost_differential(renter, buyer,
                                       np.arange(1, num_years + 1))

    surplus = np.maximum(0, diff)  # >= 0
    deficit = np.minimum(0, diff)  # < 0

    # return on investment
    roi = calculate_roi(surplus, buyer.startup_costs,
                        renter.investment_return_rate)

    # total contributions (accumulation of surpluses from previous year)
    contrib = np.zeros_like(surplus)
    surplus[..., :-1].cumsum(axis=-1, out=contrib[..., 1:])

    net_value = (
        roi -
        renter.investment_tax_rate * (
            roi -
            roi[..., 0, np.newaxis] +
            contrib
        ) +
        deficit.cumsum(axis=-1) +
        renter.rent_price * renter.security_deposit
    )

    return net_value
