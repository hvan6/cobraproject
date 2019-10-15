set VENV=C:\cobraproject\env
python -m venv %VENV%
set PYTHONP=%VENV%\Scripts\python.exe
set PIPP=%VENV%\Scripts\pip.exe
%PYTHONP% -m pip install --upgrade pip
%PYTHONP% %PIPP% install "pyramid==1.10.4"
set /p DUMMY=Hit ENTER to continue ...