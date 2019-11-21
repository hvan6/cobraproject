#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import numpy as np
import pandas as pd

import rvb

if __name__ == '__main__':

    # user inputs
    num_years = 5
    down_payment = 200000.0
    initial_monthly_budget = 3000.0
    annual_raise = 0.03

    # parcel ids
    parcelids = [
        14721251,
        11321198,
        13904879,
        12702816,
        14250492,
        10932280,
        12771616,
        11048058,
        11657809,
        12528982,
        14221069,
        11000359
    ]

    # read zipcode meta data
    meta = pd.read_csv('cobra/static/cobraZipCodeGeo2.csv')

    # read properties data
    reader = pd.read_csv('cobra/static/properties_2017_cleaned10-30.csv',
                         chunksize=100000)
    chunks = [chunk.loc[chunk['parcelid'].isin(parcelids)] for chunk in reader]
    df = pd.concat(chunks, ignore_index=True)
    df['parcelid'] = pd.Categorical(df['parcelid'], parcelids)
    df.sort_values('parcelid', inplace=True)
    df = df.merge(meta, how='inner', on='regionidzip')

    # get rent/home price
    rent_price = (df['rentprice'] * df['squarefeet']).values[:, np.newaxis]
    home_price = df['est_cost'].values[:, np.newaxis]

    # compute monthly budget over time
    year = np.arange(1, num_years + 1)
    monthly_budget = initial_monthly_budget * (1 + annual_raise) ** (year - 1)

    # create renter
    renter = rvb.Renter()
    renter.rent_price = rent_price

    # create buyer
    buyer = rvb.Buyer()
    buyer.home_price = home_price
    buyer.down_payment = down_payment

    # calculate net value
    renter_net_value = rvb.calculate_renter_net_value(renter, buyer, num_years)
    buyer_net_value = rvb.calculate_buyer_net_value(buyer, num_years)

    # calculate monthly costs
    renter_monthly_costs = renter.calculate_annual_costs(year) / 12
    buyer_monthly_costs = buyer.calculate_annual_costs(year) / 12

    # find where monthly costs exceed budget
    renter_over_budget = (renter_monthly_costs > monthly_budget).any(axis=1)
    buyer_over_budget = (buyer_monthly_costs > monthly_budget).any(axis=1)

    # get score
    renter_score = np.where(renter_over_budget, -np.inf,
                            renter_net_value[:, -1])
    buyer_score = np.where(buyer_over_budget, -np.inf, buyer_net_value[:, -1])

    # get decision criteria
    recommend_buy = (buyer_score >= renter_score) & ~buyer_over_budget
    recommend_rent = (buyer_score < renter_score) & ~renter_over_budget
    exclude = renter_over_budget & buyer_over_budget

    # get labels
    labels = np.empty(df.shape[0], dtype=np.int)
    labels[recommend_buy] = 1
    labels[recommend_rent] = 2
    labels[exclude] = 3

    df['label'] = labels

    # print results
    msg = {
        1: 'Buy',
        2: 'Rent',
        3: 'Exclude'
    }
    for _, row in df.iterrows():
        print(row['parcelid'], msg[row['label']])

    # save results
    df.to_csv('cobra_testing.csv')
