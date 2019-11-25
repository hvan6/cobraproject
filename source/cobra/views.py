from pyramid.view import (
    view_config,
    view_defaults
    )
from pyramid.httpexceptions import HTTPFound
from pyramid.response import Response
import json
import os
import pandas as pd
from .models import (
    Connection, Criteria
)
import rvb

# if using jinja2
@view_defaults(renderer='views/home.jinja2')
class CobraViews:
    def __init__(self, request):
        self.request = request
        self.view_name = 'CobraForm'

    # home page
    # http://localhost:6543/
    @view_config(route_name='home')
    def home(self):
        return {'show': 'Home View'}

    @view_config(route_name='home', request_method='POST',  renderer='views/cobra.jinja2')
    def home_submit(self):
        criteria = Criteria(self.request.params['livecity'], \
                    self.request.params['minBedroom'], \
                    self.request.params['maxBedroom'], \
                    self.request.params['minBathroom'], \
                    self.request.params['maxBathroom'], \
                    self.request.params['minYearbuilt'], \
                    self.request.params['maxYearbuilt'], \
                    self.request.params['minLotSize'], \
                    self.request.params['maxLotSize'],\
                    self.request.params['initbudget'],\
                    self.request.params['downpayment'],\
                    self.request.params['yearlyraise'],\
                    self.request.params['numyears'])
        return criteria.asdict()


    @view_config(route_name='getmedianbyzip', renderer='json')
    def getmedianbyzip(self):
        ######
        zipcode = self.request.POST.get('zipcode',None)
        initbudget = float(self.request.POST.get('initbudget',None))
        downpayment = float(self.request.POST.get('downpayment',None))
        yearlyraise = float(self.request.POST.get('yearlyraise',None))
        numyears = int(self.request.POST.get('numyears',None))
        queryHouseByCounty = self.request.POST.get('queryHouseByCounty',None)
        yearlyraise = yearlyraise/100

        conn = Connection()
        data = conn.run_algorithm(queryHouseByCounty,initbudget,downpayment,yearlyraise,numyears)

        data = data.to_json(orient='records')
        return {'result': data}
