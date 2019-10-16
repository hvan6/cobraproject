Requirement: install python 3

#I Clone project
clone "cobraproject" to local and place in the C:
The project directory will be: C:/cobraproject

#II Update path
If you did not want the path C:/cobraproject, you can put to another directory
But then you need to edit the run.bat file
Modify the first line "set VENV=C:\cobraproject\env" to the path you place your project directory

#III Run
If first run: double click firstRun.bat
From second run: double click run.bat
After run, do not turn off the cmd windows

#IV Run website
Open any browser and navigate to home page:
http://localhost:6543/

#V Check
If you see a LA map => it worked.

#VI Explain:

##1/ important file:

###development.ini:
setting parameter (do not change)

###cobra\\__init__.py:
configuration: routing, resource folder path (the static folder)
To define home page routing:
```
config.add_route('home', '/')
```

###cobra\\views.py:
define a view class include all views for routing.
A view include render (a html page), a function with data return to html page
For example, define home view:
```
@view_defaults(renderer='views\\home.jinja2')
class CobraViews:
    def __init__(self, request):
        self.request = request
        self.view_name = 'CobraForm'

    @view_config(route_name='home')
    def home(self):
        return {'name': 'Home View'}
```

###cobra\\views\\home.jinja2:
HTML jinja2 template of home view
This file include all html, javascript and jinja2 code to display website
