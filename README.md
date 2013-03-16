# afdui [![Build Status](https://api.travis-ci.org/AnFengDe/afdui.png?branch=master)](https://api.travis-ci.org/AnFengDe/afdui) 
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
    <script src="datatables.js"></script>
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
- **fieldValidator**: custom function for validating table tr's field
- **remoteAjax**:  remote data sending to server by REST
   - **create**: put data to server
   - **edit**: post data to server
   - **remove**: delete data to server

other method:

    $('divid').tabledetail("addData",Json_data): add Json_data to tabledetail.

    $('ele').tabledetail("getData"): get json_data from element.

    $('divid').tabledetail("destroy"): destroy element of tabledetail. 

For example:

    var options = {
        "width" : 1000,
        "height" : 540, 
        "table" : {
            "sScrollY" : "220px",
            "iDisplayLength" : 10,
            "aoColumns" : [{
            "sTitle" : "ID",
            "mData" : "id",
            "sWidth" : "15%"
            }, {
            "sTitle" : "Name",
            "mData" : "name",
            "sWidth" : "45%"
            } ....]
        },
        "form" : {
            "pages" : [{
            "title" : "General Info",
            "rows" : "2",
            "controls" : [{
                "label" : "ID",
                "id" : "id",
                "type" : "input",
                "format" : "number",
                "readonly" : false,
                "maxlength" : 10,
                "size" : 10
            }, {
                "label" : "Name",
                "id" : "name",
                "type" : "input",
                "format" : "text",
                "readonly" : false,
                "maxlength" : 32,
                "size" : 32,
                "validator" : function(value) {
                    return (1 <= value.length && value.length <= 32);
                },
                "customData" : function() {
                    return '2400000'; 
                },
                "message" : "Name length between in 1 - 32"
                }] 
            }]
        },
        "rowHover" : function(e, data) {
            if (e.handleObj.origType === "mouseenter") {
                data.current.style.color = 'red';
            } else {
                data.current.style.color = 'black';
            }
        },
        "formValidator" : function(obj) {
            if ((obj.id.value === obj.name.value) && (obj.id.value.length !== 0 && obj.name.value.length !== 0)) {
                return 'The value of id can not same as name value!';
            }
        },
        "remoteAjax" : {
            "create" : "/powerflow/api/config/devices/buses/new",
            "edit" : "/powerflow/api/config/devices/buses/_name_",
            "remove" : "/powerflow/api/config/devices/buses/_id_"
        }
    }

Then, let's create a tabledetail on the html.

The first, create a div:

    <div id = "tabledetail"></div>

The second, settings data and add data to tabledetail:

    <script>
        var $divid = $("divid");
        $divid.tabledetail(options);
        $divid.tabledetail().addData(Jsondata);              
    </script>

![alt text](https://raw.github.com/AnFengDe/afdui/master/doc/demopic/demo1.png "the basic tabledetail pages")
         
![alt text](https://raw.github.com/AnFengDe/afdui/master/doc/demopic/demo2.png "the form pages")

![alt text](https://raw.github.com/AnFengDe/afdui/master/doc/demopic/demo3.png "the callback dialog")

![alt text](https://raw.github.com/AnFengDe/afdui/master/doc/demopic/demo4.png "the input validate message")

For more information on how to use tabledetail widget, check the documentation or demo.

