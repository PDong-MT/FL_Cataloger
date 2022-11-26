# fl_cataloger

Updated, direct download links at the bottom

This is a simple program, acting as a remote control for FinishLynx. The source code is published here, but a cleaner download can be found at FieldWorks.app, where the program is packaged up in an Electron shell that can easily be installed.

The entirety of the program is here in full, and you are welcome to clone the repo and compile your own.

The program requests Lynx output a jpg image of certain time stamps labelled as the name of the athlete and school. For example:

RandomUniversity_JoeSmith.jpg

This tool was developed to quickly identify athletes with chip read issues (no read, missing chip, etc...)

For this to work natively, you'll need:

-FinishLynx 12.10 (available August 2022)
-FL_Cataloger
-FL_Cataloger.lss installed in your Lynx Directory (or updated if using newer version)
-NetCom plugin (there are work-arounds, but this is easiest)

Lynx needs several settings:
(these settings assume you're running FL_Cataloger on the same computer as FinishLynx)
-In Databases, select an output folder that you'd like to save the images to
-In Scoreboards, create a scoreboard, network (connect) port 42200 and IP Address 127.0.0.1, and have it output no time info, but 1 athlete at a time (paging 1), Include First Name (if you want) and Always Send Place.
Time must be set, I've tested down to 1 second reliably.
-In General, set Remote Control to Network (connect) port 42000, and IP address 127.0.0.1

Reload the software

Open Lynx to no event.
Open FL_Cataloger once installed

Open an event in Lynx

FL_Cataloger will run in the background before eventually running out of people to export.
-Close the event in Lynx
-If you want to do another event, in FL_Cataloger, go to View and Reload. (or reboot the software)
-Open a new event in Lynx

Known Issues:
-Lynx will automatically write over previous images, so if Joe Smith from Random University is encountered in another meet you are cataloging, only the most recent image will be saved. You can subvert this by moving older images to new folders.
-This entire program can be run via CLI by grabbing the processor.js file and running it via Node. If you don't know what this means, you should likely download the Electron based file below.

Old Files:
www.FieldWorks.app/catalog/FL_cataloger.lss
www.FieldWorks.app/catalog/FL_Cataloger_Setup.exe

New Downloads, as of 11-26-2022:
www.FieldWorks.app/catalog/FL_cataloger_Bib.lss<br>
www.FieldWorks.app/catalog/FL_Cataloger_Setup_1.1.exe  (Outputs Affiliation_AthleteName.jpg)<br>
www.FieldWorks.app/catalog/FL_cataloger_Setup_1.1_bib_1Camera.exe (Outputs ID#.jpg, set to camera 1, ideal for road races without a line scan in #1)<br>
www.FieldWorks.app/catalog/FL_cataloger_Setup_1.1_bib_2Camera.exe (Outputs ID#.jpg, set to camera 2)<br>
