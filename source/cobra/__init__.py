from pyramid.config import Configurator

def main(global_config, **settings):
    config = Configurator(settings=settings)

    # define to use template
    config.include('pyramid_chameleon')
    config.include('pyramid_jinja2')

    ###### ROUTE DEFINITION ######
    # define home page
    config.add_route('home', '/')
    # set routing for ajax calling from home.jinja2
    config.add_route('getLAmap', '/getLAmap')
    config.add_route('test_json2', '/testjson2')


    ###### OTHER ROUTE DEFINITION ##########################################
    # testing URL routing with view
    config.add_route('routing', '/routingtest/{first}/{last}')
    # testing Static folder
    config.add_route('staticfolder', '/staticfolder')
    # testing sending and receive request
    config.add_route('plain', '/plain')
    # testing ajax with json render
    config.add_route('hello_json', '/howdy.json')
    # testing form and submit button
    config.add_route('form', '/form')
    config.add_route('hello', '/form/{first}/{last}')
    ###### OTHER ROUTE DEFINITION ##########################################


    # define the static folder to store css, js and images files
    config.add_static_view(name='static', path='cobra:static')
    config.add_static_view(name='lib', path='cobra:lib')
    config.add_static_view(name='js', path='cobra:js')

    # scan views.py to link view function to the route
    config.scan('.views')
    return config.make_wsgi_app()
