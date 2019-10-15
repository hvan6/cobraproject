Requirement: install python 3

Windows instruction:
1/ clone "cobraproject" to local and place in the C:
The project directory will be: C:/cobraproject

2/ If you did not want the path C:/cobraproject, you can put to another directory
But then you need to edit the run.bat file

Modify the first line "set VENV=C:\cobraproject\env" to the path you place your project directory

3/ Run run.bat
Do not turn off the cmd windows

4/ Open any browser and navigate to home page:
http://localhost:6543/

5/ If you see a blank page with a string "Test Jason", 
press F12, click on Console tab.
If you can see 4 line of log:

Json number 2
Hello View Json
Object 1 : name Hello View Json
Object 2 : Json number 2

=> it worked.

6/ Short explain:
__init_.py:
# define home page
config.add_route('home', '/')

views.py:
# default render to file home.jinja2 inside of views folder
@view_defaults(renderer='views\\home.jinja2')

# home page routing definition
@view_config(route_name='home')
def home(self):
    return {'name': 'Home View'}

When navigate to home page, it will find function under config route name "home",
because there is not render define in view_config, then it will load the default
view at views\\home.jinja2

views\\home.jinja2
from home page, it call 2 ajax to server, server return 2 string.
