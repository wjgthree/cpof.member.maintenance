Folder contains the files necessary to create and deploy the web app:
 - CPOF_Sample_Data.xlsx: Random generated data, used to populate google sheet
 - Code.gs: Javascript back-end code.
 - Index.html: HTML front-end code.
 - cpof-become-member-qr.png: Image resource
 - cpof-logo-tp.png: Image resource

To Deploy and run:
 - Open google drive for existing google account.
 - Upload image resources, set sharing to public, generate link and get "id" value.
 - Create new google sheet, create "Roster" tab.
 - Paste sample data into new google sheet tab.
 - Open Apps Script under Extensions menu of google sheet.
 - Paste Code.gs and Index.html code into new Apps Script project.
 - Update image resource links in Index.html with new "id" from above.
 - Use Apps Script to deploy code and generate executable link.
