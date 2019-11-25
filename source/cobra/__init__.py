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
    config.add_route('getmedianbyzip','/getmedianbyzip')

    # define the static folder to store css, js and images files
    config.add_static_view(name='static', path='cobra:static')
    config.add_static_view(name='lib', path='cobra:lib')
    config.add_static_view(name='js', path='cobra:js')

    # scan views.py to link view function to the route
    config.scan('.views')
    return config.make_wsgi_app()
