COBRA
-----

Home Page: https://hvan6.github.io/cobraproject/
Demo on Amazon AWS: http://ec2-54-183-131-70.us-west-1.compute.amazonaws.com/

COBRA is a front-end web client application framework, with core functionality that is geared in support of LA Team (Data & Visual Analytics). COBRA is built on the Pyramid framework: https://trypyramid.com/



About COBRA
-----------

The Cost of Buying/Renting Algorithm (COBRA) to help home-seekers process the overwhelming amount of data points involved in buying or renting a home to make an optimal decision.



Description
-----------

In the search for a home, potential renters and buyers can become inundated with information found online about a multitude of real estate opportunities. It is believed that the average human has the capacity to hold approximately seven data points in short-term memory. While this exact number is disputed, it is eclipsed by the number of criteria that factor into identifying the optimal home and deciding whether to rent or to buy.

Our team plans to implement the Cost of Buying/Renting Algorithm (COBRA) to help home-seekers process the overwhelming amount of data points involved in buying or renting a home to make an optimal decision.



Try COBRA
---------

* Live Demo
COBRA is a web-based UI and is available for demo on Amazon AWS: http://ec2-54-183-131-70.us-west-1.compute.amazonaws.com/
The demo application was deployed in Ubuntu Server 18.04 LTS using web server uWSGI+ nginx

* Get COBRA working locally
The following steps will let you get COBRA installed and running locally

0. Requirement:
* Windows OS (10 or server 2016)
* Python >=3.7.5
* Internet

1. Clone COBRA GitHub repository:
Recommend clone COBRA to `C:\cobraproject`.
$ git clone https://github.com/hvan6/cobraproject.git

Make sure COBRA project has the following folder structure:
|-- C:\cobraproject
    |-- assets
    |-- source
        |-- cobra
            |-- lib
            |-- static
            |-- views
        |-- cobra.egg-info
        |-- rvb
        |-- firstRun.bat
        |-- run.bat
    |-- GetCobra.md
    |-- README.md
    |-- README.txt

2. COBRA env directory path setting:
If you clone `cobraproject` to another directory different with `C:\cobraproject`, **UPDATE** `VENV` path to the correct path to the directory of your local COBRA in following files:
  ```
  C:\cobraproject\source\firstRun.bat
  C:\cobraproject\source\run.bat
  ```

3. If project directory is `C:\cobraproject\`, make sure `set VENV=C:\cobraproject\env` is at the first line in following files:
  ```
  C:\cobraproject\source\firstRun.bat
  C:\cobraproject\source\run.bat
  ```
  
4. Unzip dataset
We are NOT allowed to push files larger than `100 MB` to GitHub due to [conditions for large files](https://help.github.com/en/github/managing-large-files/conditions-for-large-files), so you need to unzip dataset file manually before compiling COBRA project.

Unzip dataset zip file from:
  `C:\cobraproject\source\cobra\static\properties_2017_cleaned10-30.zip`
to:
  `C:\cobraproject\source\cobra\static\properties_2017_cleaned10-30.csv`

5. Start the COBRA server
* If it is the first time execution, double click on firstRun.bat to install environment packages and compile project. It will take a while to download packages and install, please wait until you see lines similar like below:
  ```
  Starting monitor for PID 4084.
  Starting server in PID 15988.
  Serving on http://GD0QXY2.mypc.com:6543
  Serving on http://GD0QXY2.mypc.com:6543
  ```
Please do **NOT** close command prompt window.

* Otherwise, double click on `run.bat` to compile project, wait until you see lines similar as above, do **NOT** close command prompt window

* Open a browser and navigate to: http://localhost:6543/

6. Trouble shooting
If you have any question to compile COBRA project, please contact us for help:
* [Hien Le](https://leohien.net/): hvan6@gatech.edu
* [Stephen Wang](http://stephenwang.me/): Stephen.Wang@gatech.edu



Operating System Support
------------------------

The local version of COBRA (clone from github) only works on Windows OS.



Documentation
-------------

More details documents about COBRA
* Proposal: https://github.com/hvan6/cobraproject/blob/master/assets/docs/team25proposal.pdf
* Proposal Video: https://youtu.be/oQHvVnzwzvQ
* Proposal Slides: https://github.com/hvan6/cobraproject/blob/master/assets/docs/team25slides.pdf
* Progress Report: https://github.com/hvan6/cobraproject/blob/master/assets/docs/team25progress.pdf



Contribution
------------

COBRA is developed by the LA Team (Data & Visual Analytics).
* 2019
  * Anne Benolkin
  * Hien Le: https://leohien.net/
  * Matthew Molinare
  * Crystal Nguyen
  * Stephen Wang: http://stephenwang.me/


