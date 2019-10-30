from pyramid.view import (
    view_config,
    view_defaults
    )
from pyramid.httpexceptions import HTTPFound
from pyramid.response import Response
import json,os
import pandas as pd

# if using jinja2
@view_defaults(renderer='views\\home.jinja2')
# if using chameleon
#@view_defaults(renderer='views\\home.pt')
class CobraViews:
    def __init__(self, request):
        self.request = request
        self.view_name = 'CobraForm'

    # home page
    # http://localhost:6543/
    @view_config(route_name='home')
    def home(self):
        return {'name': 'Home View'}

    # Return string for 2 ajax call from home jinja2
    @view_config(route_name='getLAmap', renderer='json')
    def getLAmap(self):
        #print(os.getcwd())
        try:
            with open('cobra\\static\\la.json') as json_file:
                laMap = json.load(json_file)
                return laMap
        except Exception as e:
            return {'failure' : str(e)}

    @view_config(route_name='leaflet', renderer='views\\leaflet.jinja2')
    def leaflet(self):
        return {'name': 'leaflet'}

    @view_config(route_name='medianbyzip', renderer='json')
    def medianbyzip(self):
        print(os.getcwd())
        try:
            df=pd.read_csv('cobra\\static\\properties_cleaned.tsv',delimiter='\t',encoding='utf-8')
            medianByZip = df.groupby('regionidzip')['est_cost'].median()
            return medianByZip.to_json()
        except Exception as e:
            return {'failure' : str(e)}

    ###### OTHER TESTING ###################################################
    # No need to read at beginning
    ########################################################################
    # routing test
    # try sending below request in any browser
    # http://localhost:6543/routingtest/amy/smith
    @view_config(route_name='routing',renderer='views\\routingtest.pt')
    def routing(self):
        #return {'name': 'Home View'}
        first = self.request.matchdict['first']
        last = self.request.matchdict['last']
        return {
            'name': 'Routing Test',
            'first': first,
            'last': last
        }

    # static foler test
    # try sending below request in any browser
    # http://localhost:6543/staticfolder
    @view_config(route_name='staticfolder',renderer='views\\statictesting.pt')
    def staticfolder(self):
        return {'message': 'testing successfully'}

    # example of sending request and receive/response request
    # try sending below request in any browser
    # http://localhost:6543/plain
    # http://localhost:6543/plain?name=alice
    @view_config(route_name='plain')
    def plain(self):
        name = self.request.params.get('name', 'No Name Provided')

        body = 'URL %s with name: %s' % (self.request.url, name)
        return Response(
            content_type='text/plain',
            body=body
        )

    # testing render json, use to return a json to html page
    @view_config(route_name='hello_json', renderer='json')
    def hello_json(self):
        return {'name': 'Hello Jason'}

    ###### TESTING FORM ######
    @property
    def full_name(self):
        first = self.request.matchdict['first']
        last = self.request.matchdict['last']
        return first + ' ' + last
    # link1: http://localhost:6543/form
    # link2: http://localhost:6543/form/jane/doe
    # form page
    @view_config(route_name='form', renderer='views\\form.pt')
    def form(self):
        return {'page_title': 'Form View'}
    # Retrieving /form/first/last the first time
    @view_config(route_name='hello', renderer='views\\hello.pt')
    def hello(self):
        return {'page_title': 'Change Name'}

    # Posting to /form/first/last via the "Edit" submit button
    @view_config(route_name='hello', request_method='POST', renderer='views\\edit.pt')
    def edit(self):
        new_name = self.request.params['new_name']
        return {'page_title': 'Edit View', 'new_name': new_name}

    # Posting to /form/first/last via the "Delete" submit button
    @view_config(route_name='hello', request_method='POST', request_param='form.delete', renderer='views\\delete.pt')
    def delete(self):
        print ('Deleted')
        return {'page_title': 'Delete View'}
