import os
import pandas as pd
import numpy as np
import rvb

PROPERTIES_DS = 'cobra/static/properties_2017_cleaned10-30.csv'
ZIPCODEGEO_DS = 'cobra/static/cobraZipCodeGeo2.csv'
CHUNKSIZE = 500000

def do_rvb(home_price,rent_price,years):
    ###### buyer params ######
    buyer = rvb.Buyer()
    buyer.home_price = home_price
    buyer.mortgage_rate = 0.0425,  # fraction of mortgage per year
    buyer.down_payment = 0.2 * buyer.home_price
    buyer.mortgage_term = 30
    buyer.utilities = 0.0006 * home_price
    #USE DEFAULT
    #buyer.appreciation_rate = use default 0.043, # fraction of home value
    #buyer.property_tax_rate = use default 0.01,  # fraction of home value
    #buyer.buying_closing_cost = use default 0.04,  # fraction of home purchase price
    #buyer.selling_closing_cost = use default 0.06,  # fraction of home value
    #buyer.common_fees = use default 0.0,  # $ per month
    #buyer.homeowners_insurance_rate = use default 0.005,  # fraction of home value
    #buyer.maintenance_rate = user default 0.01  # fraction of home purchase price
    ###### rent params ######
    renter = rvb.Renter()
    renter.rent_price = rent_price  # $ per month
    renter.appreciation_rate = 0.05 # fraction of rent price
    renter.utilities = 0.005 * rent_price # $ per month
    #USE DEFAULT
    #renter.security_deposit = use default 1,  # months
    #renter.brokers_fee = use default 0.0,  # fraction of initial rent price
    #renter.renters_insurance = use default 15.0,  # $ per month
    #rent.investment_return_rate = use default 0.07,  # % of total investments
    #rent.investment_tax_rate = use default 0.10  # % of total investments

    ###### Do rvb ######
    num_years = years
    r = rvb.calculate_renter_net_value(renter, buyer, num_years)
    b = rvb.calculate_buyer_net_value(buyer, num_years)

    return (r,b)

def should_buy(rvb):
    r,b = rvb[0],rvb[1]
    if (r[len(r)-1] > b[len(b)-1]):
        return 0
    else:
        return 1

class Connection:
    def __init__(self):
        pass

    def getDataByQuery(self, query):
        searchZip = pd.read_csv(ZIPCODEGEO_DS)
        chunks = []
        for dfchunk in pd.read_csv(PROPERTIES_DS,chunksize=CHUNKSIZE):
            chunk = pd.merge(dfchunk, searchZip, on='regionidzip',how='inner')
            chunk.query(query, inplace=True)
            chunks.append(chunk)
        filterdata = pd.concat(chunks, ignore_index=True)
        #return filterdata.to_json(orient='records')
        return filterdata

    def getMedianData(self, query, numyears):
        data = self.getDataByQuery(query)
        #mean and median of house price
        grouped = data.groupby(['zipcode','ziplat','ziplon','city','rentprice'])
        agg = grouped['est_cost'].agg([np.mean, np.median]).reset_index()
        grouped_tax = data.groupby(['zipcode'])

        #mean and median of tax
        taxamount = grouped_tax['taxamount'].agg([np.mean]).reset_index()
        taxamount = taxamount.rename(columns={'mean': 'taxmean', 'median': 'taxmedian'})
        newdata = pd.merge(agg, taxamount, on='zipcode',how='inner')

        #mean of sqft
        sqft = grouped_tax['squarefeet'].agg([np.mean]).reset_index()
        sqft.rename(columns={'mean': 'sqftmean'},inplace=True)
        newdata = pd.merge(newdata, sqft, on='zipcode',how='inner')
        newdata['rental'] = newdata['sqftmean'] * newdata['rentprice']

        ### do rvb ###
        newdata['rvb'] = newdata.apply(lambda x: do_rvb(x['mean'],x['rental'],int(numyears)),axis=1)
        newdata['shouldbuy'] = newdata.apply(lambda x: should_buy(x['rvb']),axis=1)

        #newdata = newdata.to_json(orient='records')
        return newdata


class Criteria:
    def __init__(self, livecity, minbed, maxbed, minbath, maxbath, minbuilt, maxbuilt, minlotsize, maxlotsize,\
                        initcash, yearlysalary, yearlyraise, numyears):
        self.zipcode = livecity
        self.minbed = minbed
        self.maxbed = maxbed
        self.minbath = minbath
        self.maxbath = maxbath
        self.minbuilt = minbuilt
        self.maxbuilt = maxbuilt
        self.minlotsize = minlotsize
        self.maxlotsize = maxlotsize
        self.initcash = initcash
        self.yearlysalary = yearlysalary
        self.yearlyraise = yearlyraise
        self.numyears = numyears
        self.setCountyCityByZip()

    def asdict(self):
        return {'zipcode': self.zipcode, \
                'city': self.city, \
                'county': self.county, \
                'minbed': self.minbed, \
                'maxbed': self.maxbed, \
                'minbath': self.minbath, \
                'maxbath': self.maxbath, \
                'minbuilt': self.minbuilt, \
                'maxbuilt': self.maxbuilt, \
                'minlotsize': self.minlotsize, \
                'maxlotsize': self.maxlotsize, \
                'lat': self.lat,'lon': self.lon, \
                'queryHouseByCounty': self.queryHouseByCounty(), \
                'initcash': self.initcash, \
                'yearlysalary': self.yearlysalary, \
                'yearlyraise': self.yearlyraise, \
                'numyears': self.numyears}

    def setCountyCityByZip(self):
        searchZip = pd.read_csv(ZIPCODEGEO_DS)
        self.county = searchZip.query("zipcode==" + self.zipcode).iloc[0]['county']
        self.city = searchZip.query("zipcode==" + self.zipcode).iloc[0]['city']
        self.lat = searchZip.query("zipcode==" + self.zipcode).iloc[0]['ziplat']
        self.lon = searchZip.query("zipcode==" + self.zipcode).iloc[0]['ziplon']
        return self.county

    def queryHouseByCounty(self):
        housequery = "county=='" + self.county + "' and "\
            + self.minbed + " <= bedroomcnt and bedroomcnt <= " + self.maxbed + " and "\
            + self.minbath + " <= bathroomcnt and bathroomcnt <= " + self.maxbath + " and "\
            + self.minbuilt + " <= yearbuilt and yearbuilt <= " + self.maxbuilt + " and "\
            + self.minlotsize + " <= squarefeet and squarefeet <= " + self.maxlotsize + ""
        return housequery
