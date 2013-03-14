#JQuery UI TableDetail Widget#
[https://github.com/AnFfengDe/afdui.git](https://github.com/AnFfengDe/afdui.git)

JQuery UI TableDetail Widget displays JSON data on the Dialog Widget of JQuery UI in JQuery's form and DataTable.

How to build your own JQuery UI TableDetail Widget
---------------------------------------------------
First，clone  a copy of main JQuery git repo by running : 
``
git clone git://github.com/AnFengDe/afdui.git
``

Install the grunt-cli package so that you will have the correct version of grunt available from any project that needs it. This should be done as a global install:
``
npm install -g grunt-cli
``

Enter the jquery directory and install the Node dependencies, this time without specifying a global install:
``
cd jquery && npm install
``

Make sure you have grunt installed by testing:
``
grunt -version
``

Then, to get a complete, minified (w/ Uglify.js), linted (w/ JSHint) version of jQuery UI TableDeatail Widget, type the following:
`` 
grunt/grunt watch
``

Getting Started
----------------
Include jQuery,JQuery UI and the widget on a page, Then select a div to show deatail and call the tabledetail method.

    <script src="jquery.js"></script>
    <script src="jquery-ui.js"></script>
    <script src="tabledetail.js"></script>

    <script type = "text/javascript">
        $("divid").tabledetail(options);
    </script>

API
---------------
tableDetail consists of three methods, one to set up tableDetail, one to add Json data, one to get data form object from tabledetail, one to remove them.You'll find plenty of examples below. If you're looking for a specific option, checkout this list:

    $('divid').tabledetail(options) : create a tabledetail on the Dialog.

**options**: 

- **width**: the form width
- **height**: the form height
- **resizeable**: default as false 
- **modal**: default as true
- **buttons**: the form buttons(new, save,delete, close)
- **table**: the table option set
    - **sScrollY** : default as 200px
    - **bLengthChange** : default as false,
    - **bAutoWidth** : default as false,
    - **iDisplayLength** : defalut as 25,
    - **bJQueryUI** : default as true
- **form**: the form option set 
    - **pages** : the detail information show how many pages.
    - **title** : the title of pages,
    - **rows** : the rows of form,
    - **cols** : the cols of form,
    - **controls** : the controls of form,
    - **label** : the label of element, 
    - **id** : the id of element,
    - **type** : the type of element,
    - **format** : default as true,
    - **read** : default as true,
    - **maxlength** : the length is 10,
    - **size** : the input size is 10,
    - **customData** : custom Data function which displays default as input 
    - **validator** : the validator function which validates input value
    - **message** :  the message is showed when entering wrong value in the input
- **hoverTr**: custom event for table's tr of hover
- **clickTr**: custom event for table's tr of click
- **formValidator**: custom function for validating form
- **remoteAjax**:  remote data sending to server by REST
   - **create**: put data to server
   - **edit**: post data to server
   - **remove**: delete data to server

other method:

    $('divid').tabledetail("addData",Json_data): add Json_data to tabledetail.

    $('ele').tabledetail("getData"): get json_data from element.

    $('divid').tabledetail("destroy"): destroy element of tabledetail. 



For more information on how to use tabledetail widget, check the documentation or demo.

