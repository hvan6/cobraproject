# -*- coding: utf-8 -*-

"""Default parameters
"""

__all__ = [
    'renter_params',
    'buyer_params'
]

renter_params = {
    'rent_price': 2500.0,  # $ per month
    'appreciation_rate': 0.025,  # fraction of rent price
    'security_deposit': 1,  # months
    'brokers_fee': 0.0,  # fraction of initial rent price
    'renters_insurance': 15.0,  # $ per month
    'utilities': 100.0,  # $ per month
    'investment_return_rate': 0.07,  # % of total investments
    'investment_tax_rate': 0.10  # % of total investments
}

buyer_params = {
    'home_price': 1000000.0,  # $
    'appreciation_rate': 0.043,  # fraction of home value
    'mortgage_rate': 0.039,  # fraction of mortgage per year
    'down_payment': 200000.0,  # $
    'mortgage_term': 30,  # years
    'property_tax_rate': 0.01,  # fraction of home value
    'buying_closing_cost': 0.04,  # fraction of home purchase price
    'selling_closing_cost': 0.06,  # fraction of home value
    'common_fees': 0.0,  # $ per month
    'homeowners_insurance_rate': 0.005,  # fraction of home value
    'utilities': 200.0,  # $ per month
    'maintenance_rate': 0.01  # fraction of home purchase price
}
