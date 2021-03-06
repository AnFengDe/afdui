(function($) {
    var testOptions = {
        "width" : 800,
        "height" : 540,
        "table" : {
            "bLengthChange" : false,
            "iDisplayLength" : 25,
            "bJQueryUI" : true,
            "aoColumns" : [ {
                "sTitle" : "ID",
                "mData" : "id"
            }, {
                "sTitle" : "Name",
                "mData" : "name"
            }, {
                "sTitle" : "Alias",
                "mData" : "alias"
            }, {
                "sTitle" : "Voltage Level",
                "mData" : "voltageLevel"
            } ]
        },
        "form" : {
            "pages" : [ {
                "title" : "General Info",
                "rows" : 2,
                "cols" : 4,
                "controls" : [ {
                    "label" : "ID",
                    "id" : "id",
                    "type" : "input",
                    "format" : "number",
                    "read" : true,
                    "maxlength" : 10,
                    "size" : 10,
                    "customData" : function() {
                        // You can define new data generate rule yourself.
                        return '2400000';
                    }
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
                    "message" : "Name length between 1-32"
                }, {
                    "label" : "Alias",
                    "id" : "alias",
                    "type" : "input",
                    "format" : "text",
                    "readonly" : false,
                    "maxlength" : 16,
                    "size" : 16,
                    "mask" : "9999",
                    "validator" : function(value) {
                        return (1 <= value.length && value.length <= 32 && !isNaN(Number(value) / 1));
                    },
                    "message" : "Numeric length between 1-32"
                }, {
                    "label" : "Voltage Level",
                    "id" : "voltageLevel",
                    "type" : "select",
                    "format" : "text",
                    "options" : [ {
                        "id" : "1",
                        "name" : "500kV"
                    }, {
                        "id" : "2",
                        "name" : "220kV"
                    }, {
                        "id" : "3",
                        "name" : "110kV"
                    } ],
                    "readonly" : false,
                    "maxlength" : 16,
                    "size" : 16
                } ]
            }, {
                "title" : "Topo Info",
                "rows" : 1,
                "cols" : 4,
                "controls" : [ {
                    "label" : "Start Substation",
                    "id" : "startSubstationID",
                    "type" : "select",
                    "format" : "number",
                    "options" : "info_substation.json",
                    "readonly" : false,
                    "maxlength" : 16,
                    "size" : 20
                }, {
                    "label" : "End Substation",
                    "id" : "endSubstationID",
                    "type" : "select",
                    "format" : "number",
                    "options" : "info_substation.json",
                    "readonly" : false,
                    "maxlength" : 16,
                    "size" : 20
                } ]
            } ]
        },
        "editSuccessMsg" : function() {
            if (typeof $('#returnDialog')[0] !== 'undefined') {
                $("#returnDialog").dialog('close');
            }
            var html = '<div id = returnDialog><p>Update Data Success!</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "delSuccessMsg" : function() {
            if (typeof $('#returnDialog')[0] !== 'undefined') {
                $("#returnDialog").dialog('close');
            }
            var html = '<div id = returnDialog><p>Remove Data Success!</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "delErrorMsg" : function(e, data) {
            if (typeof $('#returnDialog')[0] !== 'undefined') {
                $("#returnDialog").dialog('close');
            }
            var html = '<div id = returnDialog><p>Error Code:' + data.status + '</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "createSuccessMsg" : function() {
            if (typeof $('#returnDialog')[0] !== 'undefined') {
                $("#returnDialog").dialog('close');
            }
            var html = '<div id = returnDialog><p>Create Data Success</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "selectChange" : function(e, data) {
            if (typeof $('#returnDialog')[0] !== 'undefined') {
                $("#returnDialog").dialog('close');
            }
            var html = '<div id = returnDialog><p>' + data + '</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "rowHover" : function(e, data) {
            if (e.handleObj.origType === "mouseenter") {
                data.current.style.color = 'red';
            } else {
                data.current.style.color = 'black';
            }
        },
        "rowClick" : function(e, data) {
            data.current.style.color = 'blue';
        },
        "formValidator" : function(obj) {
            if ((obj.id === obj.name) && (obj.id.length !== 0 && obj.name.length !== 0)) {
                return 'The value of id can not same as name!';
            }
        },
        "remoteAjax" : {
            "create" : "/powerflow/api/config/devices/buses/new",
            "edit" : "/powerflow/api/config/devices/buses/_name_",
            "remove" : "/powerflow/api/config/devices/buses/_id_"
        }
    };

    module('afd Table Detail options testsuite');
    test('test the table and form data is null in options', function() {
        raises(function() {
            $('#tblDetail').tabledetail({
                "width" : "800",
                "height" : "600"
            });
        }, Error, "Must throw error to pass");
    });

    var tdLoadInit = function(data) {
        var td = $('#tblDetail').tabledetail(testOptions);
        td.tabledetail('addData', data);
        return td;
    };
    var asyncCommon = function(testcase) {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            testcase(data);
        }).fail(function() {
            ok(false, "Load info_line.json is error");
            start();
        });
    };
    asyncTest('test the page basic value', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            ok(800 === td.tabledetail("option", "width"), "the wigth is right");
            ok(540 === td.tabledetail("option", "height"), "the height is right");

            var defaultTableOption = {
                "sScrollY" : "200px",
                "bLengthChange" : false,
                "iDisplayLength" : 25,
                "bJQueryUI" : true
            };
            var key = null;
            for (key in defaultTableOption) {
                var ret = td.tabledetail("option", "table")[key] === undefined;
                ret = ret || (td.tabledetail("option", "table")[key] !== defaultTableOption[key]);
                if (ret) {
                    ok(false, key + " " + defaultTableOption[key] + " The option setting error");
                }
            }

            td.tabledetail("destroy");
            start();
        };

        asyncCommon(testcase);
    });

    module('afd Table Detail get set datas');
    asyncTest('setting data-JSON', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            ok(572 === td.tabledetail("getData").length, "The test form data count is right");
            ok("240000003" === td.tabledetail("getData")[1].id, "The test form data by index is right");

            // clean data
            td.tabledetail("cleanData");
            ok(0 === td.tabledetail("getData").length, "The test form data count is 0");

            td.tabledetail("destroy");
            start();
        };

        asyncCommon(testcase);
    });

    asyncTest('setting data-show name by code in form', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            var vString = $($('#tblDetail tr td')[3]).text();

            ok('220kV' === vString, "The voltage string is 220kV.");

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");
            start();
        };
        asyncCommon(testcase);
    });

    asyncTest('setting data-input choose&modified be linked input', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            // test click event for select first row, update detailed pages
            td.data("tabledetail")._trigger('rowselect', null, [ 0 ]);
            var selected = td.tabledetail("getSelected");
            var current = td.tabledetail("getCurrent");
            ok(selected[0].id === current.id, 'the detailed data same as choose data');

            // the show is char，but the data is code，so can't the compare in the
            // html
            var ret = (selected[0].voltageLevel === current.voltageLevel);
            ok(ret, 'the detailed voltageLevel code same as was selected data voltaheLeve code');

            // test edit the detailed page is update table
            td.data("tabledetail")._trigger('detailchange', null, [ 'name', 'testwasmodifieddata' ]);
            // something change,call get function again.
            selected = td.tabledetail("getSelected");
            current = td.tabledetail("getCurrent");
            ok(selected[0].name === current.name, 'modified table data is sync with input');

            // test the detailed pages change select tag is
            // update table
            td.data("tabledetail")._trigger('detailchange', null, [ 'voltageLevel', '3' ]);
            // something change,call get function again.
            selected = td.tabledetail("getSelected");
            current = td.tabledetail("getCurrent");
            ret = (selected[0].voltageLevel === current.voltageLevel);
            ok(ret, 'the detailed pages change select tag is update table');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");
            start();
        };

        asyncCommon(testcase);
    });

    asyncTest('setting data-input, modified data validator', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            // test click event is update detailed pages
            td.data("tabledetail")._trigger('rowselect', null, [ 0 ]);

            td.data("tabledetail")._trigger('detailchange', null, [ 'name', '' ]);

            ok(td.data("tabledetail").inputHasClass('name', 'ui-state-error'), 'displays error message');

            td.data("tabledetail")._trigger('detailchange', null, [ 'name', 'test' ]);
            ok(false === td.data("tabledetail").inputHasClass('name', 'ui-state-error'), 'don\'t display the error message');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");
            start();
        };

        asyncCommon(testcase);
    });

    asyncTest('setting data-input validator to the new null data', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            // click the new button, add a new null tr
            td.data("tabledetail")._trigger('buttonclick', null, 'new');
            var current = td.tabledetail("getCurrent");
            // validator the new data's id is customed
            ok('2400000' === current.id, 'show the add customed id');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");
            start();
        };
        asyncCommon(testcase);
    });

    asyncTest('setting data-input validator mask', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);
            td.data("tabledetail")._trigger('rowselect', null, [ 0 ]);
            td.data("tabledetail")._trigger('detailchange', null, [ 'alias', '2222' ]);
            var current = td.tabledetail("getCurrent");
            var select = td.tabledetail("getSelected");
            ok(current.alias === '2222', 'the validator mask is number');
            ok(select[0].alias === '2222', 'the modified numberic was updated to tr');

            td.data("tabledetail")._trigger('detailkeypress', null, [ 'alias', 'aaaa' ]);
            ok($('#detail_alias').val() === '', 'the validator mask is number');
            ok($($('#tblDetail tr td')[2]).text() === '2222', 'input invalid,the table is not async,remain unchanged');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");
            start();
        };
        asyncCommon(testcase);
    });

    asyncTest('setting data-input deletedata', function() {
        var testcase = function(data) {
            // deletedata
            var td = tdLoadInit(data), tb = $('#dataTable').dataTable();
            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/240000001",
                responseText : {
                    status : 'success'
                }
            });

            // select one data，checked the function of deleter is valid
            ok(td.data("tabledetail").buttonIsDisabled('delete') !== false, 'deletebutton is disabled');
            td.data("tabledetail")._trigger('rowselect', null, [ 0 ]);
            ok(td.data("tabledetail").buttonIsDisabled('delete') === false, 'deletebutton is enabled');
            // delete,checked the total number of data
            ok(572 === tb.fnSettings().fnRecordsTotal(), 'the data is right before delete');
            td.data("tabledetail")._trigger('buttonclick', null, 'delete');
            // $('#detail_btn_delete').trigger('click');
            setTimeout(function() {
                ok(571 === tb.fnSettings().fnRecordsTotal(), 'the data is right after delete');
                ok(td.data("tabledetail").buttonIsDisabled('delete') !== false, 'deletebutton is disabled');

                $('#returnDialog').dialog('destroy').remove();
                td.tabledetail("destroy");
                $.mockjaxClear(id);
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });

    asyncTest('setting data-input deletedata-test of delete null tr', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            ok(td.data("tabledetail").buttonIsDisabled('delete') !== false, 'deletebutton is disabled');

            var tb = $('#dataTable').dataTable();
            tb.fnFilter('5555');
            td.data("tabledetail")._trigger('rowselect', null, [ 0 ]);
            setTimeout(function() {
                ok(td.data("tabledetail").buttonIsDisabled('delete') !== false, 'deletebutton is disabled');

                $('#returnDialog').dialog('destroy').remove();
                td.tabledetail("destroy");
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });

    asyncTest('setting data-input the test of edit select input', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            // enter a new data in the select input
            var tb = $('#dataTable').dataTable();
            tb.fnFilter('5');
            var rowCount = tb.fnSettings().fnRecordsDisplay();
            ok(307 === rowCount, 'showing of the 307 entries');

            tb.fnFilter('55');
            rowCount = tb.fnSettings().fnRecordsDisplay();
            ok(23 === rowCount, 'showing of the 23 entries');

            tb.fnFilter('555');
            rowCount = tb.fnSettings().fnRecordsDisplay();
            ok(1 === rowCount, 'showing of the 1 entries');

            tb.fnFilter('5555');
            rowCount = tb.fnSettings().fnRecordsDisplay();
            ok(0 === rowCount, 'showing of the 0 entries');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");

            start();
        };
        asyncCommon(testcase);
    });

    asyncTest('setting data-input  edit data the click the next page button', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            var tb = $('#dataTable').dataTable();
            tb.fnFilter('5');
            var rowCount = tb.fnSettings().fnRecordsDisplay();
            ok(307 === rowCount, 'showing of the 307 entries');

            tb.fnFilter('55');
            rowCount = tb.fnSettings().fnRecordsDisplay();
            ok(23 === rowCount, 'showing of the 23 entries');
            td.data('tabledetail')._trigger('rowselect', null, [ 0 ]);
            var selected = td.tabledetail("getSelected");
            var current = td.tabledetail("getCurrent");
            var ret = (selected[0].id === current.id);
            ok(ret, "the detailed data's id same as the be selected data's id");

            selected = td.tabledetail("getSelected");
            current = td.tabledetail("getCurrent");
            ret = (selected[0].voltageLevel === current.voltageLevel);
            ok(ret, 'the detailed data\'s voltageLevel code same as the be selected data\' voltageLevel code');

            td.data("tabledetail")._trigger('detailchange', null, [ 'name', 'the modefied data of test' ]);
            ok(td.tabledetail("getSelected")[0].name === td.tabledetail("getCurrent").name, 'the modefied data sync to table');

            // modified the data after click the next page button
            tb.fnPageChange('next');
            td.data("tabledetail")._trigger('detailchange', null, [ 'name', 'the modefied data of test' ]);
            ok(td.tabledetail("getSelected")[0].name === td.tabledetail("getCurrent").name, 'the modefied data sync to table');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");

            start();
        };
        asyncCommon(testcase);
    });

    module('afd Table Detail customize event');
    asyncTest('the message of custom delete event', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data), tb = $('#dataTable').dataTable();

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/240000011",
                status : 404
            });

            td.data("tabledetail")._trigger('rowselect', null, [ 7 ]);
            td.data("tabledetail")._trigger('buttonclick', null, 'delete');

            setTimeout(function() {
                var $returnDialog = $('#returnDialog');
                ok($returnDialog.find('p')[0].innerHTML === 'Error Code:404', 'the remote message is right after delete');
                ok(572 === tb.fnSettings().fnRecordsTotal(), 'The data\'s count is right after delete failure');
                $returnDialog.dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });

    asyncTest('the message of custom edit event', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/hefeiTransform",
                responseText : {
                    status : 'success'
                }
            });

            td.data("tabledetail")._trigger('rowselect', null, [ 6 ]);
            td.data("tabledetail")._trigger('detailchange', null, [ 'name', 'hefeiTransform' ]);
            td.data("tabledetail")._trigger('buttonclick', null, 'save');

            setTimeout(function() {
                var $returnDialog = $('#returnDialog');
                ok($returnDialog.find('p')[0].innerHTML === 'Update Data Success!', 'the remote message is right after edit');

                $returnDialog.dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });

    asyncTest('the message of custom create event', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/new",
                responseText : {
                    status : 'success'
                }
            });

            td.data("tabledetail")._trigger('buttonclick', null, 'new');
            td.data("tabledetail")._trigger('detailchange', null, [ 'name', 'hefeiTransform' ]);

            td.data("tabledetail")._trigger('buttonclick', null, 'save');

            setTimeout(function() {
                var $returnDialog = $('#returnDialog');
                var ret = ($returnDialog.find('p')[0].innerHTML === 'Create Data Success');
                ok(ret, 'he remote message is right after modefied');

                $returnDialog.dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });

    asyncTest('the message of custom select input event', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);

            // trigger the select input event
            $('#dataTable_filter input').val('12').trigger('keyup');

            var $returnDialog = $('#returnDialog');
            ok($returnDialog.find('p')[0].innerHTML === '12', 'the values of enter select same as return value');
            $returnDialog.dialog('destroy').remove();
            td.tabledetail("destroy");

            start();
        };
        asyncCommon(testcase);
    });

    asyncTest('the message of custom tr hover', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data);
            // trigger mouseenter event
            td.data('tabledetail')._trigger('rowenter', null, [0]);
            ok(td.data('tabledetail').getRowStyle([0]).color === 'red', 'the tr\'s color changed to red after mouseenter');
            // trigger mouseleave event
            td.data('tabledetail')._trigger('rowleave', null, [0]);
            ok(td.data('tabledetail').getRowStyle([0]).color === 'black', 'the tr\'s color changed to black after mouseleave');
            td.tabledetail("destroy");

            start();
        };
        asyncCommon(testcase);
    });

    module('afd Table Detail remote ');
    asyncTest('delete the data of table and ajax to remote', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data), tb = $('#dataTable').dataTable();

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/240000001",
                responseText : {
                    status : 'success'
                }
            });

            td.data("tabledetail")._trigger("rowselect", null, [ 0 ]);
            td.data("tabledetail")._trigger('buttonclick', null, 'delete');

            setTimeout(function() {
                ok($('#returnDialog').find('p')[0].innerHTML === 'Remove Data Success!',
                        'the value of return from remote is right');
                ok(571 === tb.fnSettings().fnRecordsTotal(), 'The data count is right after delete');
                ok(td.data("tabledetail").buttonIsDisabled('delete') !== false, 'Delete button is disabled');

                $('#returnDialog').dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });

    asyncTest('edit the data of table and ajax to remote', function() {
        var testcase = function(data) {
            var td = tdLoadInit(data), tb = $('#dataTable').dataTable();

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/hefeiTransformed",
                responseText : {
                    status : 'success'
                }
            });

            td.data("tabledetail")._trigger("rowselect", null, [ 1 ]);
            td.data("tabledetail")._trigger("detailchange", null, [ 'name', 'hefeiTransformed' ]);
            td.data("tabledetail")._trigger('buttonclick', null, 'save');

            setTimeout(function() {
                var ret = ($('#returnDialog').find('p')[0].innerHTML === 'Update Data Success!');
                ok(ret, 'the value of return from remote is right');
                ok(572 === tb.fnSettings().fnRecordsTotal(), 'The data count is right after edit');
                ret = (td.data("tabledetail").buttonIsDisabled('save') !== false);
                ok(ret, 'delete button is disabled');

                $('#returnDialog').dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });

    asyncTest('create the data of table and ajax to remote', function() {
        var testcase = function(data) {
            var td = $('#tblDetail').tabledetail(testOptions);
            td.tabledetail('addData', data);
            var tb = $('#dataTable').dataTable();

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/new",
                responseText : {
                    status : 'success'
                }
            });

            // click the newbutton, enter two value of
            // new input and trigger the change event
            td.data("tabledetail")._trigger('buttonclick', null, 'new');
            td.data("tabledetail")._trigger("detailchange", null, [ 'id', '2222222' ]);
            td.data("tabledetail")._trigger("detailchange", null, [ 'name', 'hefeiTransformed' ]);

            td.data("tabledetail")._trigger('buttonclick', null, 'save');
            setTimeout(function() {
                ok($('#returnDialog').find('p')[0].innerHTML === 'Create Data Success',
                        'the value of return from remote is right');
                ok(573 === tb.fnSettings().fnRecordsTotal(), 'the data number is right after create');
                ok($('#detail_btn_save').button('option', 'disabled') !== false, 'deletebutton is disabled');

                $('#returnDialog').dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });

    asyncTest('edit the different of tr value and ajax to remote', function() {
        var testcase = function(data) {
            var td = $('#tblDetail').tabledetail(testOptions);
            td.tabledetail('addData', data);
            var tb = $('#dataTable').dataTable();

            var id1 = $.mockjax({
                url : "/powerflow/api/config/devices/buses/new",
                responseText : {
                    status : 'success'
                }
            });
            var id2 = $.mockjax({
                url : "/powerflow/api/config/devices/buses/huaibeiTransformed",
                responseText : {
                    status : 'success'
                }
            });
            // modified the value of fifth tr data
            td.data("tabledetail")._trigger('rowselect', null, [ '3' ]);
            td.data("tabledetail")._trigger('detailchange', null, [ 'name', 'huaibeiTransformed' ]);
            // add a new tr
            td.data("tabledetail")._trigger('buttonclick', null, 'new');
            td.data("tabledetail")._trigger('detailchange', null, [ 'id', '240000002' ]);
            td.data("tabledetail")._trigger('detailchange', null, [ 'name', 'huaibeiTransformed' ]);
            // click the save button
            td.data("tabledetail")._trigger('buttonclick', null, 'save');

            setTimeout(function() {
                // ok(remoteRet[0] && remoteRet[1], 'the value of return from
                // remote is right');
                ok(573 === tb.fnSettings().fnRecordsTotal(), 'the data number is right after create');
                ok(td.data("tabledetail").buttonIsDisabled('save') !== false, 'save button is disabled');

                $('#returnDialog').dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id1);
                $.mockjaxClear(id2);
                start();
            }, 1000);
        };
        asyncCommon(testcase);
    });
}(jQuery));
