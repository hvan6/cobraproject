# GET COBRA
How to install and setup code.


**Requirement**:
* Windows OS (10 or server 2016)
* Python >=3.7.5

​

These steps will get COBRA installed and running:
​
* Clone COBRA GitHub repository:
​

  `git clone https://github.com/hvan6/cobraproject.git`
​
* Update COBRA directory:


	Modify `set VENV=C:\cobraproject\env` in both `firstRun.bat` and `run.bat` to the directory of your local COBRA
​
* Start the development server:
​

  * If it is the first time execution, double click on `firstRun.bat` to install environment packages and compile project, do **NOT** close command prompt window
  
  * Otherwise, double click on `run.bat` to compile project, do **NOT** close command prompt window 
​
* Open a browser and navigate to: http://localhost:6543/
