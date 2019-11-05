import os
import pandas as pd
import numpy as np

PROPERTIES_DS = 'cobra/static/properties_2017_cleaned10-30.csv'
ZIPCODEGEO_DS = 'cobra/static/cobraZipCodeGeo.csv'
CHUNKSIZE = 500000

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

    def getMedianData(self, query):
        data = self.getDataByQuery(query)
        grouped = data.groupby(['zipcode','ziplat','ziplon','city'])
        agg = grouped['est_cost'].agg([np.mean, np.median]).reset_index()
        agg = agg.to_json(orient='records')
        return agg


class Criteria:
    def __init__(self, livecity, minbed, maxbed, minbath, maxbath, minbuilt, maxbuilt, minlotsize, maxlotsize):
        self.zipcode = livecity
        self.minbed = minbed
        self.maxbed = maxbed
        self.minbath = minbath
        self.maxbath = maxbath
        self.minbuilt = minbuilt
        self.maxbuilt = maxbuilt
        self.minlotsize = minlotsize
        self.maxlotsize = maxlotsize
        self.setCountyCityByZip()

    def asdict(self):
        return {'zipcode': self.zipcode, 'city': self.city, 'county': self.county, 'minbed': self.minbed, 'maxbed': self.maxbed, 'minbath': self.minbath, 'maxbath': self.maxbath, 'minbuilt': self.minbuilt, 'maxbuilt': self.maxbuilt, 'minlotsize': self.minlotsize, 'maxlotsize': self.maxlotsize,'lat': self.lat,'lon': self.lon, 'queryHouseByCounty': self.queryHouseByCounty()}

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
