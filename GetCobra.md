# GET COBRA to local
How to install and setup code.

**Requirement**:
* Windows OS (10 or server 2016)
* Python >=3.7.5
* Internet



These steps will get COBRA installed and running:

### Clone COBRA GitHub repository
**Recommend** clone to `C:\cobraproject`

$ `git clone https://github.com/hvan6/cobraproject.git`  

  ![gitClone](./assets/imgs/gitClone.png)

* Make sure the project has the following structure.  

  ![folderStructure](./assets/imgs/structure.png)


### COBRA env directory path setting
* If you clone `cobraproject` to another directory different with `C:\cobraproject`, **UPDATE** `VENV` path to the correct path to the directory of your local COBRA in both `C:\cobraproject\source\firstRun.bat` and `C:\cobraproject\source\run.bat` files.

* Make sure `set VENV=C:\cobraproject\env` is at the first line in both `C:\cobraproject\source\firstRun.bat` and `C:\cobraproject\source\run.bat` files.


### Unzip dataset
We are NOT allowed to push files larger than `100 MB` to GitHub due to [conditions for large files](https://help.github.com/en/github/managing-large-files/conditions-for-large-files), so you need to unzip dataset file manually before compiling COBRA project.

Unzip dataset zip file from:

  `C:\cobraproject\source\cobra\static\properties_2017_cleaned10-30.zip`
  
to:

  `C:\cobraproject\source\cobra\static\properties_2017_cleaned10-30.csv`


### Start the COBRA server

* If it is the first time execution, double click on `firstRun.bat` to install environment packages and compile project, do **NOT** close command prompt window

* Otherwise, double click on `run.bat` to compile project, do **NOT** close command prompt window

* Open a browser and navigate to: http://localhost:6543/
