set VENV=C:\cobraproject\env
python -m venv %VENV%
set PYTHONP=%VENV%\Scripts\python.exe
set PIPP=%VENV%\Scripts\pip.exe
set PSERVE=%VENV%\Scripts\pserve.exe
%PYTHONP% %PIPP% install "pyramid==1.10.4"
%PIPP% install pyramid_chameleon
%PYTHONP% %PIPP% install -e ".[dev]"
%PYTHONP% %PSERVE% development.ini --reload
set /p DUMMY=Hit ENTER to continue ...