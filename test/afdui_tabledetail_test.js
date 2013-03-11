(function($) {
    /*
     * ======== A Handy Little QUnit Reference ======== http://api.qunitjs.com/
     * 
     * Test methods: module(name, {[setup][ ,teardown]}) test(name, callback)
     * expect(numberOfAssertions) stop(increment) start(decrement) Test
     * assertions: ok(value, [message]) equal(actual, expected, [message])
     * notEqual(actual, expected, [message]) deepEqual(actual, expected,
     * [message]) notDeepEqual(actual, expected, [message]) strictEqual(actual,
     * expected, [message]) notStrictEqual(actual, expected, [message])
     * throws(block, [expected], [message])
     */

    module('afd Table Detail options testsuite');
    asyncTest('test the page basic value', function() {
        $.when($.ajax({
            url : "tabledetail_options_test.json",
            dataType : "json"
        })).done(
                function(options) {
                    var td = $('#tblDetail').tabledetail(options);

                    ok(360 === td.tabledetail("option", "width"), "the wigth is right");
                    ok(240 === td.tabledetail("option", "height"), "the high is right");

                    var defaultTableOption = {
                        "sScrollY" : "200px",
                        "bLengthChange" : false,
                        "iDisplayLength" : 10,
                        "bJQueryUI" : true
                    };
                    var key = null;
                    for (key in defaultTableOption) {
                        if (td.tabledetail("option", "table")[key] === undefined
                                || td.tabledetail("option", "table")[key] !== defaultTableOption[key]) {
                            ok(false, key + " " + defaultTableOption[key] + "the setting error");
                        }
                    }

                    td.tabledetail("destroy");
                    start();
                }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    var testOptions = {
        "width" : 800,
        "height" : 540,
        "table" : {
            "bLengthChange" : false,
            "iDisplayLength" : 25,
            "bJQueryUI" : true,
            "aoColumns" : [ {
                "sTitle" : "id",
                "mData" : "id"
            }, {
                "sTitle" : "name",
                "mData" : "name"
            }, {
                "sTitle" : "alias",
                "mData" : "alias"
            }, {
                "sTitle" : "voltageLevel",
                "mData" : "voltageLevel"
            } ]
        },
        "form" : {
            "pages" : [ {
                "title" : "the baisc message",
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
                        return '2400000';
                    }
                }, {
                    "label" : "name",
                    "id" : "name",
                    "type" : "input",
                    "format" : "text",
                    "read" : false,
                    "maxlength" : 32,
                    "size" : 32,
                    "validator" : function(value) {
                        return (1 <= value.length && value.length <= 32);
                    },
                    "message" : "the name length only be 1-32"
                }, {
                    "label" : "alias",
                    "id" : "alias",
                    "type" : "input",
                    "format" : "text",
                    "read" : false,
                    "maxlength" : 16,
                    "size" : 16,
                    "mask" : "9999",
                    "validator" : function(value) {
                        return (1 <= value.length && value.length <= 32 && !isNaN(Number(value) / 1));
                    },
                    "message" : "the name length only be 1-32,and only is number"
                }, {
                    "label" : "voltageLevel",
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
                    "read" : false,
                    "maxlength" : 16,
                    "size" : 16
                } ]
            }, {
                "title" : "topo message",
                "rows" : 1,
                "cols" : 4,
                "controls" : [ {
                    "label" : "startSubstationID",
                    "id" : "startSubstationID",
                    "type" : "select",
                    "format" : "number",
                    "options" : "info_substation.json",
                    "read" : false,
                    "maxlength" : 16,
                    "size" : 20
                }, {
                    "label" : "endSubstationID",
                    "id" : "endSubstationID",
                    "type" : "select",
                    "format" : "number",
                    "options" : "info_substation.json",
                    "read" : false,
                    "maxlength" : 16,
                    "size" : 20
                } ]
            } ]
        },
        "editSuccessMsg" : function() {
            var html = '<div id = returnDialog><p>success</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "delSuccessMsg" : function() {
            var html = '<div id = returnDialog><p>success</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "delErrorMsg" : function(e, ui) {
            var html = '<div id = returnDialog><p>' + ui + '</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "createSuccessMsg" : function() {
            var html = '<div id = returnDialog><p>success</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "selectChange" : function(e, ui) {
            var html = '<div id = returnDialog><p>' + ui + '</p></div>';
            $(html).appendTo($('#tblDetail'));
            $("#returnDialog").dialog({
                close : function() {
                    $(this).dialog('destroy').remove();
                }
            });
            $("#returnDialog").dialog('open');
        },
        "hoverTr" : function(e, ui) {
            if (e.handleObj.origType === "mouseenter") {
                ui.thistr.style.color = 'red';
            } else {
                ui.thistr.style.color = 'black';
            }
        },
        "clickTr" : function(e, ui) {
            ui.thistr.style.color = 'blue';
        }
    };

    module('afd Table Detail get set datas');
    var tdLoadInit = function(data) {
        var td = $('#tblDetail').tabledetail(testOptions);
        td.tabledetail('addData', data);
        return td;
    };

    asyncTest('settingdata-JSON', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            ok(572 === td.tabledetail("getData").length, "the test form data number is right");
            ok("240000003" === td.tabledetail("getData")[1].id, "the test form data subscript is right");

            // clean data
            td.tabledetail("cleanData");
            ok(0 === td.tabledetail("getData").length, "the test form data number is 0");

            td.tabledetail("destroy");

            start();
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('settingdata-form the codeshow', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            var vString = $($('#tblDetail tr td')[3]).text();

            ok('220kV' === vString, "the program-code is show on code");

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");

            start();
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('settingdata-input choose&modified be linked input', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        }))
                .done(
                        function(data) {
                            var td = tdLoadInit(data);

                            // test click event is update detailed pages
                            $('#tblDetail tr:eq(2)').trigger('click');
                            ok($($('#tblDetail tr td')[0]).text() === $('#detail_id').val(),
                                    'the detailed data same as choose data');
                            // the show is char，but the data is code，so can't
                            // the compare in the html
                            var vString = td.tabledetail("getData")[0].voltageLevel;
                            ok(vString === $('#detail_voltageLevel').val(),
                                    'the detailed voltageLevel code same as was selected data voltaheLeve code');

                            // test edit the detailed page is update table
                            $('#detail_name').trigger('click');
                            $('#detail_name').val('testwasmodifieddata').change();
                            ok($($('#tblDetail tr td')[1]).text() === $('#detail_name').val(),
                                    'modified table data is sync with input');

                            // test the detailed pages change select tag is
                            // update table
                            $('#detail_voltageLevel').val('3').change();
                            vString = td.tabledetail("getData")[0].voltageLevel;
                            ok(vString === $('#detail_voltageLevel').val(),
                                    'the detailed pages change select tag is update table');

                            $('#returnDialog').dialog('destroy').remove();
                            td.tabledetail("destroy");

                            start();
                        }).fail(function() {
                    ok(false, "load tabledetail_options_test.json is error");
                    start();
                });
    });

    asyncTest('settingdata-input modified data validator', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            // test click event is update detailed pages
            $('#tblDetail tr:eq(2)').trigger('click');

            // test edit event is update detailed pages
            $('#detail_name').focus();
            $('#detail_name').val('');
            $('#detail_name').trigger('change');
            $('#detail_alias').focus().delay(1000);

            ok($('#detail_name').hasClass('ui-state-error'), 'show the error message');

            $('#detail_name').focus();
            $('#detail_name').val('test');
            $('#detail_name').trigger('change');
            $('#detail_alias').focus();
            ok(false === $('#detail_name').hasClass('ui-state-error'), 'not show the error message');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");

            start();
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('settingdata-input validator the new null data', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            // click the new button, add a new null tr
            $('#detail_btn_new').trigger('click');

            // validator the new data's id is customed
            ok('2400000' === $('#detail_id').val(), 'show the add customed id');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");

            start();
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('settingdata-input validator mask', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            $($('#tblDetail tr')[2]).trigger('click');

            $('#detail_alias').focus();
            // alias is only number
            $('#detail_alias').val('2222').keypress();
            $('#detail_alias').blur();
            ok($('#detail_alias').val() === '2222', 'the validator mask is number');
            ok($($('#tblDetail tr td')[2]).text() === '2222', 'the modified number is sync to tr');

            $('#detail_alias').focus();
            $('#detail_alias').val('aaaa').keypress();
            $('#detail_alias').blur();
            ok($('#detail_alias').val() === '', 'the validator mask is number');
            ok($($('#tblDetail tr td')[2]).text() === '2222', 'input invalid,the table is not sync,remain unchanged');

            $('#returnDialog').dialog('destroy').remove();
            td.tabledetail("destroy");

            start();
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('settingdata-input deletedata', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            // deletedata
            var td = tdLoadInit(data), tb = $('#dataTable').dataTable();
            td.tabledetail("remoteAjax", {
                "create" : "/powerflow/api/config/devices/buses/new",
                "edit" : "/powerflow/api/config/devices/buses/_name_",
                "remove" : "/powerflow/api/config/devices/buses/_id_"
            });

            // select one data，checked the function of deleter is valid
            ok($('#detail_btn_delete').button('option', 'disabled') !== false, 'deletebutton is disabled');
            $('#tblDetail tr:eq(2)').trigger('click');
            ok($('#detail_btn_delete').button('option', 'disabled') === false, 'deletebutton is enabled');
            // delete,checked the total number of data
            ok(572 === tb.fnSettings().fnRecordsTotal(), 'the data is right before delete');
            $('#detail_btn_delete').trigger('click');
            setTimeout(function() {
                ok(571 === tb.fnSettings().fnRecordsTotal(), 'the data is right after delete');
                ok($('#detail_btn_delete').button('option', 'disabled') !== false, 'deletebutton is disabled');

                $('#returnDialog').dialog('destroy').remove();
                td.tabledetail("destroy");
                start();
            }, 1000);
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('settingdata-input deletedata-test of delete null tr', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            td.tabledetail("remoteAjax", {
                "create" : "/powerflow/api/config/devices/buses/new",
                "edit" : "/powerflow/api/config/devices/buses/_name_",
                "remove" : "/powerflow/api/config/devices/buses/_id_"
            });

            ok($('#detail_btn_delete').button('option', 'disabled') !== false, 'deletebutton is disabled');

            var tb = $('#dataTable').dataTable();
            tb.fnFilter('5555');
            $($('#tblDetail tr')[2]).trigger('click');
            setTimeout(function() {
                ok($('#detail_btn_delete').button('option', 'disabled') !== false, 'deletebutton is disabled');

                $('#returnDialog').dialog('destroy').remove();
                td.tabledetail("destroy");
                start();
            }, 1000);
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('settingdata-input the test of edit select input', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
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
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('settingdata-input  edit data the click the next page button', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(
                function(data) {
                    var td = tdLoadInit(data);

                    var tb = $('#dataTable').dataTable();
                    tb.fnFilter('5');
                    var rowCount = tb.fnSettings().fnRecordsDisplay();
                    ok(307 === rowCount, 'showing of the 307 entries');

                    tb.fnFilter('55');
                    rowCount = tb.fnSettings().fnRecordsDisplay();
                    ok(23 === rowCount, 'showing of the 23 entries');

                    $($('#tblDetail tr')[2]).trigger('click');
                    ok($($('#tblDetail tr td')[0]).text() === $('#detail_id').val(),
                            "the detailed data's id same as the be selected data's id");

                    var vString = td.tabledetail("getData")[0].voltageLevel;
                    ok(vString === $('#detail_voltageLevel').val(),
                            'the detailed data\'s voltageLevel code same as the be selected data\' voltageLevel code');

                    $('#detail_name').trigger('click');
                    $('#detail_name').val('the modefied data of test').change();
                    ok($($('#tblDetail tr td')[1]).text() === $('#detail_name').val(), 'the modefied data sync to table');

                    // modified the data after click the next page button
                    tb.fnPageChange('next');
                    $('#detail_name').trigger('click');
                    $('#detail_name').val('the modefied data of test').change();
                    ok($($('#tblDetail tr td')[1]).text() === $('#detail_name').val(), 'the modefied data sync to table');

                    $('#returnDialog').dialog('destroy').remove();
                    td.tabledetail("destroy");

                    start();
                }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    module('afd Table Detail customize event');
    asyncTest('the message of custom delete event', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            td.tabledetail("remoteAjax", {
                "remove" : "/powerflow/api/config/devices/buses/_id_"
            });

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/240000011",
                status : 500
            });

            $('#tblDetail tr:eq(9)').trigger('click');
            $('#detail_btn_delete').trigger('click');

            setTimeout(function() {
                var $returnDialog = $('#returnDialog');
                ok($returnDialog.find('p')[0].innerHTML === '500', 'the remote message is right after delete');
                $returnDialog.dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('the message of custom edit event', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            td.tabledetail("remoteAjax", {
                "edit" : "/powerflow/api/config/devices/buses/_id_"
            });

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/240000009",
                responseText : {
                    status : 'success'
                }
            });

            $('#tblDetail tr:eq(8)').trigger('click');
            $('#detail_name').val('hefeiTransform').trigger('change');
            $('#detail_btn_save').trigger('click');

            setTimeout(function() {
                var $returnDialog = $('#returnDialog');
                ok($returnDialog.find('p')[0].innerHTML === 'success', 'the remote message is right after edit');

                $returnDialog.dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('the message of custom create event', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            td.tabledetail("remoteAjax", {
                "create" : "/powerflow/api/config/devices/buses/new"
            });

            var id = $.mockjax({
                url : "/powerflow/api/config/devices/buses/new",
                responseText : {
                    status : 'success'
                }
            });

            $('#detail_btn_new').trigger('click');
            $('#detail_name').val('2400000002').trigger('change');
            $('#detail_name').val('hefeitransformed').trigger('change');

            $('#detail_btn_save').trigger('click');

            setTimeout(function() {
                var $returnDialog = $('#returnDialog');
                ok($returnDialog.find('p')[0].innerHTML === 'success', 'he remote message is right after modefied');

                $returnDialog.dialog('destroy').remove();
                td.tabledetail("destroy");

                $.mockjaxClear(id);
                start();
            }, 1000);
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('the message of custom select input event', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);

            // trigger the select input event
            $('#dataTable_filter input').val('12').trigger('keyup');

            var $returnDialog = $('#returnDialog');
            ok($returnDialog.find('p')[0].innerHTML === '12', 'the values of enter select same as return value');
            $returnDialog.dialog('destroy').remove();
            td.tabledetail("destroy");

            start();
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    asyncTest('the message of custom tr hover', function() {
        $.when($.ajax({
            url : "info_line.json",
            dataType : "json"
        })).done(function(data) {
            var td = tdLoadInit(data);
            // trigger mouseenter event
            $('#tblDetail tr :eq(2)').trigger('mouseenter');
            ok($('#tblDetail tr :eq(2)')[0].style.color === 'red', 'the tr\'s color changed to red after mouseenter');
            // trigger mouseleave event
            $('#tblDetail tr :eq(2)').trigger('mouseleave');
            ok($('#tblDetail tr :eq(2)')[0].style.color === 'black', 'the tr\'s color changed to black after mouseleave');
            td.tabledetail("destroy");

            start();
        }).fail(function() {
            ok(false, "load tabledetail_options_test.json is error");
            start();
        });
    });

    module('afd Table Detail remote ');
    asyncTest(
            'delete the data of table and ajax to remote',
            function() {
                $
                        .when($.ajax({
                            url : "info_line.json",
                            dataType : "json"
                        }))
                        .done(
                                function(data) {
                                    var td = tdLoadInit(data), tb = $('#dataTable').dataTable();
                                    td.tabledetail("remoteAjax", {
                                        "remove" : "/powerflow/api/config/devices/buses/_id_"
                                    });
                                    var remoteRet = false;
                                    var id = $
                                            .mockjax(function(settings) {
                                                remoteRet = ((settings.type === 'DELETE') && (settings.url === '/powerflow/api/config/devices/buses/240000001')) ? true
                                                        : false;
                                            });

                                    $($('#tblDetail tr')[2]).trigger('click');
                                    $('#detail_btn_delete').trigger('click');
                                    setTimeout(function() {
                                        ok(remoteRet, 'the value of return from remote is right');
                                        ok(571 === tb.fnSettings().fnRecordsTotal(), 'the data number is right after delete');
                                        ok($('#detail_btn_delete').button('option', 'disabled') !== false,
                                                'deletebutton is disabled');

                                        $('#returnDialog').dialog('destroy').remove();
                                        td.tabledetail("destroy");

                                        $.mockjaxClear(id);
                                        start();
                                    }, 1000);
                                }).fail(function() {
                            ok(false, "load tabledetail_options_test.json is error");
                            start();
                        });
            });

    asyncTest(
            'edit the data of table and ajax to remote',
            function() {
                $
                        .when($.ajax({
                            url : "info_line.json",
                            dataType : "json"
                        }))
                        .done(
                                function(data) {
                                    var td = tdLoadInit(data), tb = $('#dataTable').dataTable();

                                    td.tabledetail("remoteAjax", {
                                        "edit" : "/powerflow/api/config/devices/buses/_id_"
                                    });
                                    var remoteRet = false;
                                    var id = $
                                            .mockjax(function(settings) {
                                                remoteRet = ((settings.type === 'PUT') && (settings.url === '/powerflow/api/config/devices/buses/240000003')) ? true
                                                        : false;
                                            });

                                    $('#tblDetail tr :eq(3)').trigger('click');
                                    $('#detail_name').val('the transformed of hefei').trigger('change');

                                    $('#detail_btn_save').trigger('click');
                                    setTimeout(function() {
                                        ok(remoteRet, 'the value of return from remote is right');
                                        ok(572 === tb.fnSettings().fnRecordsTotal(), 'the data number is right after edit');
                                        ok($('#detail_btn_save').button('option', 'disabled') !== false,
                                                'deletebutton is disabled');

                                        $('#returnDialog').dialog('destroy').remove();
                                        td.tabledetail("destroy");

                                        $.mockjaxClear(id);
                                        start();
                                    }, 1000);
                                }).fail(function() {
                            ok(false, "load tabledetail_options_test.json is error");
                            start();
                        });
            });

    asyncTest(
            'create the data of table and ajax to remote',
            function() {
                $
                        .when($.ajax({
                            url : "info_line.json",
                            dataType : "json"
                        }))
                        .done(
                                function(data) {
                                    var td = $('#tblDetail').tabledetail(testOptions);
                                    td.tabledetail('addData', data);
                                    var tb = $('#dataTable').dataTable();
                                    td.tabledetail("remoteAjax", {
                                        "create" : "/powerflow/api/config/devices/buses/new"
                                    });
                                    var remoteRet = false;
                                    var id = $
                                            .mockjax(function(settings) {
                                                remoteRet = ((settings.type === 'POST') && (settings.url === '/powerflow/api/config/devices/buses/new')) ? true
                                                        : false;
                                            });

                                    // click the newbutton, enter two value of
                                    // new input and trigger the change event
                                    $('#detail_btn_new').trigger('click');
                                    $('#detail_name').val('2400000002').trigger('change');
                                    $('#detail_name').val('the transformed of hefei').trigger('change');

                                    $('#detail_btn_save').trigger('click');
                                    setTimeout(function() {
                                        ok(remoteRet, 'the value of return from remote is right');
                                        ok(573 === tb.fnSettings().fnRecordsTotal(), 'the data number is right after create');
                                        ok($('#detail_btn_save').button('option', 'disabled') !== false,
                                                'deletebutton is disabled');

                                        $('#returnDialog').dialog('destroy').remove();
                                        td.tabledetail("destroy");

                                        $.mockjaxClear(id);
                                        start();
                                    }, 1000);
                                }).fail(function() {
                            ok(false, "load tabledetail_options_test.json is error");
                            start();
                        });
            });

    asyncTest(
            'edit the different of tr value and ajax to remote',
            function() {
                $
                        .when($.ajax({
                            url : "info_line.json",
                            dataType : "json"
                        }))
                        .done(
                                function(data) {
                                    var td = $('#tblDetail').tabledetail(testOptions);
                                    td.tabledetail('addData', data);
                                    var tb = $('#dataTable').dataTable();
                                    td.tabledetail("remoteAjax", {
                                        "create" : "/powerflow/api/config/devices/buses/new",
                                        "edit" : "/powerflow/api/config/devices/buses/_id_"
                                    });

                                    var remoteRet = [];
                                    var id = $
                                            .mockjax(function(settings) {
                                                if (((settings.type === 'POST') && (settings.url === '/powerflow/api/config/devices/buses/new'))
                                                        || ((settings.type === 'PUT') && (settings.url === '/powerflow/api/config/devices/buses/240000005'))) {
                                                    remoteRet.push(true);
                                                } else {
                                                    remoteRet.push(false);
                                                }
                                            });

                                    // modified the value of fifth tr data
                                    $('#tblDetail tr :eq(5)').trigger('click');
                                    $('#detail_name').val('the transform of hefei').trigger('change');
                                    // add a new tr
                                    $('#detail_btn_new').trigger('click');
                                    $('#detail_id').val('240000002').trigger('change');
                                    $('#detail_name').val('the transform of hefei').trigger('change');
                                    // click the save button
                                    $('#detail_btn_save').trigger('click');

                                    setTimeout(function() {
                                        ok(remoteRet[0] && remoteRet[1], 'the value of return from remote is right');
                                        ok(573 === tb.fnSettings().fnRecordsTotal(), 'the data number is right after create');
                                        ok($('#detail_btn_save').button('option', 'disabled') !== false,
                                                'deletebutton is disabled');

                                        $('#returnDialog').dialog('destroy').remove();
                                        td.tabledetail("destroy");

                                        $.mockjaxClear(id);
                                        start();
                                    }, 1000);
                                }).fail(function() {
                            ok(false, "load tabledetail_options_test.json is error");
                            start();
                        });
            });
}(jQuery));
