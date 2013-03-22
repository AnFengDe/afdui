/**
 * @fileoverview afdui.tabledetail widget
 * @author chtian@anfengde.com
 * @author afd.zwhu@gmail.com
 * @author afd.dhhuang@gmail.com
 * @version 2013.02.28
 * @copyright Copyright (c) 2013 HeFei AnFengDe Info Tech.
 * @license Licensed under the MIT license.
 */
(function($, undefined) {
    /**
     * the table detail widget for show record list and edit detail.
     * 
     * @name tabledetail
     * @class afdui.tabledetail is derived form jQuery.ui.dialog.
     */
    /** @namespace afdui.tabledetail */
    $.widget("afdui.tabledetail", $.ui.dialog, {
        /**
         * table default options
         * 
         * @private
         */
        _TABLE_DEFAULT : {
            "sScrollY" : "200px",
            "bLengthChange" : false,
            "bAutoWidth" : false,
            "iDisplayLength" : 25,
            "bJQueryUI" : true
        },
        /**
         * @name tableDetailButtons
         * @description tabledetail buttons object
         * @property {String} text the button's caption
         * @property {String} id the button's id
         * @property {Function} click the click handler function
         */
        /**
         * default buttons
         * 
         * @private
         */
        _BUTTON_DEFAULT : {
            "new" : {
                text : "new",
                id : "detail_btn_new",
                /**
                 * @ignore
                 */
                click : function() {
                }
            },
            "save" : {
                text : "save",
                id : "detail_btn_save",
                /**
                 * @ignore
                 */
                click : function() {
                }
            },
            "delete" : {
                text : "delete",
                id : "detail_btn_delete",
                /**
                 * @ignore
                 */
                click : function() {
                }
            },
            "close" : {
                text : "close",
                id : "detail_btn_close",
                /**
                 * @ignore
                 */
                click : function() {
                }
            }
        },
        /**
         * _language default options
         * 
         * @private
         */
        _LANGUAGE : {
            "table" : {
            },
            "form" : {
                "sSaving" : "",
            }
        },

        /**
         * @name tableDetailOptions
         * @description tabledetail options
         * @property {Integer} width the form width
         * @property {Integer} height the form height
         * @property {Boolean} resizeable default as false
         * @property {Boolean} modal default as true
         * @property {tableDetailButtons} buttons the form buttons(new, save,
         *           delete, close)
         * @property {tableDetailTable} table the table option set
         * @property {tableDetailForm} form the form definition, not null, will
         *           be set according create widget
         */

        /**
         * widget's options,will be used as default.
         * 
         * @type {tableDetailOptions}
         */
        options : {
            width : 600,
            height : 500,
            resizable : false,
            modal : true,
            close : function() {
                $(this).remove();
            },
            buttons : null,
            table : null,
            form : null,
            formValidator : null,
            remoteAjax : null,
            language : null,
            // handle detail field change event
            detailchange : function(e, id, value) {
                $('#detail_' + id).trigger('click');
                $('#detail_' + id).val(value).change();
            },
            // handle table row select event
            rowselect : function(e, index) {
                // offset 2 tr
                $('#tblDetail tr:eq(' + (index + 2) + ')').trigger('click');
            },
            //handle button click event
            buttonclick : function(e, id) {
                $('#detail_btn_' + id).trigger('click');
            },
            //handle detail field keypress event
            detailkeypress : function(e, id, value) {
                var $obj = $('#detail_' + id);
                $obj.focus().val(value).keypress().blur();
            }
        },
        /**
         * widget's methods
         * 
         * @construct
         * @memberOf tabledetail#
         */
        _create : function() {
            this._setOption();
            $.ui.dialog.prototype._create.apply(this);
            this._buildTable();
            this._buildDetailForm();

            // add the span of message
            $('.ui-dialog-buttonpane').prepend('<span id="form_message"></span>');

            $('.ui-dialog').addClass('afdui-td');
            $('.ui-dialog-titlebar').addClass('afdui-td-titlebar');

            this._btn_new = $('#detail_btn_new');
            this._btn_save = $('#detail_btn_save');
            this._btn_delete = $('#detail_btn_delete');
            this._btn_close = $('#detail_btn_close');

            this._setDetailStatus('init');
            this._bindEvents();

        },
        /**
         * destroy method
         * 
         * @memberOf tabledetail#
         */
        destroy : function() {
            this._btn_new.remove();
            this._btn_save.remove();
            this._btn_delete.remove();
            this._btn_close.remove();

            // clean the message of showing
            $('.ui-tooltip').remove();
            $('#tblDetailDialog').dialog('destroy').remove();

            this._table.remove();

            $.ui.dialog.prototype.destroy.apply(this);
            this._unbindEvents();
        },

        /**
         * initialize options，expand support the layer option
         * <li>this function not accept any parameter</li>
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _setOption : function() {
            if (this.options.form === null && this.options.table === null) {
                throw new Error('The table or form options must be set.');
            }

            this.options.language = $.extend({}, this._LANGUAGE, this.options.language);
            if (this.options.language.table !== null) {
                this._TABLE_DEFAULT["oLanguage"] = this.options.language.table;
            }
            this.options.table = $.extend({}, this._TABLE_DEFAULT, this.options.table);
            this.options.buttons = $.extend({}, this.options.buttons, this._BUTTON_DEFAULT);
        },
        /**
         * create html table tag
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _buildTable : function() {
            var html = '<div id="tableDiv"><table cellpadding="0" cellspacing="0" ';
            html += 'border="0" id="dataTable" width=\"100%\"></table></div>';
            $(html).appendTo(this.element);
            this._table = $('#dataTable');
            this._table.dataTable(this.options.table);
        },
        /**
         * return current data in detail form
         * 
         * @function
         * @memberOf tabledetail#
         * @return {Object} the current data object in detail form, if no data
         *         in form ,return empty object
         */
        getCurrent : function() {
            var obj = {};
            $.each($('.afdui-td-input'), function(index, value) {
                obj[value.id.slice(7)] = value.value;
            });
            return obj;
        },
        /**
         * return selected row data in table
         * 
         * @function
         * @memberOf tabledetail#
         * @return {Array} the selected data object in table, if no data in form
         *         ,return empty array
         */
        getSelected : function() {
            var selected = [];
            if (typeof this._selected_tr === 'object') {
                selected.push(this._table.dataTable().fnGetData(this._selected_tr));
            }
            return this._display2raw(selected);
        },
        /**
         * return boolean of input is have class
         * 
         * @function
         * @memberOf tabledetail#
         * @return {Boolean} return boolean of input
         *         is have class 
         */
        inputHasClass : function(id,value) {
            return $('#detail_' + id).hasClass(value);
        },
        
        /**
         * return boolean of button is disabled
         * 
         * @function
         * @memberOf tabledetail#
         * @return {Boolean} return boolean of button
         *         is disabled 
         */
        buttonIsDisabled : function(id) {
            return $('#detail_btn_' + id).button('option', 'disabled');
        },
        
        /**
         * conversion raw code to display string
         * 
         * @function
         * @memberOf tabledetail#
         * @param {JSON}
         *            raw raw data
         * @return {JSON} the changed raw data contain display string
         */
        _raw2display : function(raw) {
            $.each(this._code, function(key, define) {
                $.each(raw, function(index, value) {
                    value[key] = define[value[key]];
                });
            });
            return raw;
        },
        /**
         * conversion display string to raw code
         * 
         * @function
         * @private
         * @memberOf tabledetail#
         * @param {JSON}
         *            display display string
         * @return {JSON} retrun raw data code
         */
        _display2raw : function(display) {
            var self = this;
            if (self._code === undefined) {
                return display;
            }
            var temp = JSON.stringify(display);
            var raw = JSON.parse(temp);
            $.each(display, function(index, value) {
                $.each(self._code, function(code, define) {
                    if (value[code] === undefined) {
                        return;
                    }
                    $.each(define, function(key, name) {
                        if (value[code] === name) {
                            raw[index][code] = key;
                        }
                    });
                });
            });
            return raw;
        },
        /**
         * add data to widget, must be json object or json object array
         * 
         * @function
         * @private
         * @memberOf tabledetail#
         * @param {JSON|ARRAY}
         *            data json object or json object array
         */
        addData : function(data) {
            this._table.dataTable().fnAddData(this._raw2display(data));
        },
        /**
         * get the data of widget
         * 
         * @function
         * @memberOf tabledetail#
         * @return {ARRAY} data json object data or json object array
         */
        getData : function() {
            return this._display2raw(this._table.fnGetData());
        },
        /**
         * clean the data of widget
         * 
         * @function
         * @memberOf tabledetail#
         */
        cleanData : function() {
            this._table.dataTable().fnClearTable();
        },
        /**
         * Judgment form content is in line with the overall form of a
         * combination of verification
         * 
         * @function
         * @private
         * 
         * @memberOf tabledetail#
         */
        _validateForm : function() {
            if ($.isFunction(this.options.formValidator) && $('.afdui-td-input')[0].disabled === false) {
                var msg = this.options.formValidator(this.getCurrent());
                if (typeof msg === 'string') {
                    var html = '<div id = tblDetailDialog>' + msg + '</div>';
                    $(html).appendTo(this.element);
                    $("#tblDetailDialog").dialog({
                        autoOpen : true,
                        modal : true,
                        title : 'Form validate failure',
                        dialogClass : "alert",
                        resizable : false,
                        close : function() {
                            $(this).dialog('destroy').remove();
                        }
                    });
                    return false;
                }
            }
            return true;
        },
        /**
         * create the detail form pages(include input, select, tips and input
         * mask.
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _buildDetailForm : function() {
            var self = this;
            var html = '<div id="detailTabs" class="afdui-td-detailTabs">';
            var tabHeaders = [];
            var tabBodies = [];
            this._maskList = [];
            $.each(this.options.form.pages, function(index, value) {
                tabHeaders.push(self._buildTabHolder(index, value));
                tabBodies.push(self._buildTabBody(index, value));
            });
            html = html + '<ul>' + tabHeaders.join('') + '</ul>' + tabBodies.join('') + '</div>';
            var detailTabs = $(html);
            detailTabs.appendTo(self.element).tabs();
            $('[title]').tooltip();
            this._buildInputMask();
            this._tabs = $('#detailTabs');
        },
        /**
         * create the detail form tab holder
         * 
         * @private
         * @function
         * @param {Number}
         *            index subscrpit
         * @param {Object}
         *            page the page data definition object
         * @memberOf tabledetail#
         */
        _buildTabHolder : function(index, page) {
            if (typeof page.title === "undefined") {
                page.title = index;
            }
            return '<li><a href="#detailTab' + index + '">' + page.title + '</a></li>';
        },
        /**
         * create the detail form tab content area
         * 
         * @private
         * @function
         * @param {Number}
         *            index subscrpit
         * @param {Object}
         *            page page the page data definition object
         * @memberOf tabledetail#
         */
        _buildTabBody : function(index, page) {
            return '<div id="detailTab' + index + '">' + this._buildPage(page) + '</div>';
        },
        /**
         * create the input mask defined project object
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _buildInputMask : function() {
            $.each(this._maskList, function(index, value) {
                $('#' + value.name).mask(value.mask);
            });
        },
        /**
         * create the tooltip content
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _buildInputMessage : function(msg) {
            return (typeof msg === 'undefined') ? '' : 'title="' + msg + '"';
        },
        /**
         * create the html of input
         * 
         * @private
         * @function
         * @param {Object}
         *            input definition of input
         * @memberOf tabledetail#
         */
        _buildInput : function(input) {
            if (input.mask !== undefined) {
                this._maskList.push({
                    "name" : 'detail_' + input.id,
                    "mask" : input.mask
                });
            }
            return '<input id="detail_' + input.id + '" class="afdui-td-input" type="' + input.format + '" maxlength="'
                    + input.maxlength + '" size="' + input.size + '" ' + (input.readonly ? 'readonly ' : '')
                    + this._buildInputMessage(input.message) + '>';
        },
        /**
         * create the html of select
         * 
         * @private
         * @function
         * @param {Object}
         *            input definition of input
         * @memberOf tabledetail#
         */
        _buildSelect : function(input) {
            // <select><option>..</option></select>
            var select = [];
            select.push('<select id="detail_' + input.id + '" class="afdui-td-input">');
            var options = [];
            if ($.isArray(input.options)) {
                options = input.options;
            } else {
                $.ajax({
                    type : "GET",
                    url : input.options,
                    dataType : "json",
                    async : false,
                    success : function(data) {
                        options = data;
                    }
                });
            }
            var self = this;
            if (typeof self._code === 'undefined') {
                self._code = {};
            }
            $.each(options, function(index, value) {
                $.each(self.options.table.aoColumns, function(index, define) {
                    if (input.id === define.mData) {
                        if (typeof self._code[input.id] === 'undefined') {
                            self._code[input.id] = {};
                        }
                        self._code[input.id][value.id] = value.name;
                    }
                });
                select.push('<option value="' + value.id + '">' + value.name + "</option>");
            });
            select.push('</select>');
            return select.join('');
        },
        /**
         * create the html of detail form fields
         * 
         * @private
         * @function
         * @param {Object}
         *            definition of input
         * @memberOf tabledetail#
         */
        _buildDetailField : function(input) {
            if (typeof input.size === "undefined") {
                input.size = 10;
            }
            if (typeof input.maxlength === "undefined") {
                input.maxlength = input.size;
            }
            if (typeof input.format === "undefined") {
                input.format = "text";
            }
            if ("input" === input.type) {
                return this._buildInput(input);
            }
            if ("select" === input.type) {
                return this._buildSelect(input);
            }
        },
        /**
         * create the detail form tab content
         * 
         * @private
         * @param {Object}
         *            page detail form page object
         * @function
         * @memberOf tabledetail#
         */
        _buildPage : function(page) {
            var detailFields = [];
            var i = 0, j = 0;
            var rows = (typeof page.rows === 'number') ? page.rows : parseInt(page.rows, 10);
            var cols = (typeof page.cols === 'number') ? page.cols / 2 : parseInt(page.cols, 10) / 2;
            // <tr><td>..</td>....</tr>
            for (i = 0; i < rows; i++) {
                detailFields.push('<tr>');
                for (j = 0; j < cols; j++) {
                    detailFields.push('<td align="right">');
                    detailFields.push(page.controls[i * cols + j].label);
                    detailFields.push('</td>');
                    detailFields.push('<td>');
                    detailFields.push(this._buildDetailField(page.controls[i * cols + j]));
                    detailFields.push('</td>');
                }
                detailFields.push('</tr>');
            }
            return '<table width="100%"><tbody>' + detailFields.join('') + '</tbody></table>';
        },
        /**
         * setting the status of controls in detail form
         * 
         * @private
         * @param {String}
         *            status status string, include 'init','trclcik',
         *            'inputchange', 'new', 'delete'
         * @function
         * @memberOf tabledetail#
         */
        _setDetailStatus : function(status) {
            if (status === 'init') {
                this._tabs.find('.afdui-td-input').attr('disabled', true);
                this._btn_new.button('enable').removeClass('ui-state-focus');
                this._btn_save.button('disable');
                this._btn_delete.button('disable');
                this._btn_close.button('enable').removeClass('ui-state-focus');
            }
            if (status === 'trclick') {
                this._btn_delete.button('enable').removeClass('ui-state-focus');
            }
            if (status === 'inputchange') {
                this._btn_new.button('enable').removeClass('ui-state-focus');
                this._btn_save.button('enable').removeClass('ui-state-focus');
            }
            if (status === 'new') {
                this._btn_new.button('disable');
                this._btn_save.button('enable').removeClass('ui-state-focus');
                this._btn_delete.button('enable').removeClass('ui-state-focus');
            }
            if (status === 'save') {
                this._btn_new.button('enable').removeClass('ui-state-focus');
                this._btn_save.button('disable');
                this._btn_delete.button('enable').removeClass('ui-state-focus');
            }
            if (status === 'delete') {
                this._btn_new.button('enable').removeClass('ui-state-focus');
                this._btn_save.button('disable');
                this._btn_delete.button('disable');
                this._btn_close.button('enable').removeClass('ui-state-focus');
            }
        },
        /**
         * Sync content in the tabs within the element to the table
         * 
         * @private
         * @param {Object}
         *            selected the selected row object
         * @param {Object}
         *            key the data key
         * @param {Object}
         *            value the data value
         * @function
         * @memberOf tabledetail#
         */
        _updateDetail : function(selected, key, value) {
            if (selected === undefined) {
                return;
            }
            var data = this._table.fnGetData(selected);
            data[key] = value;
            this._table.dataTable().fnUpdate(data, this._table.dataTable().fnGetPosition(selected));
        },
        /**
         * the click event handler to tr data
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_tr_click : function(event) {
            var self = event.data;
            if (self._validateForm() === false || null === self._table.dataTable().fnGetData(this)) {
                return;
            }
            if (self._table.find("tr.clickedtr.noneEdit").length) {
                return;
            }
            if ($('tr.clickedtr.noneEdit').length) {
                return;
            }

            // modified the css of table
            self._tabs.find('.afdui-td-input').removeAttr('disabled');
            self._table.find("tr.clickedtr").removeClass("clickedtr");
            self._table.find("tr td.sorting_1").removeClass("clickedtr");
            $(this).addClass('clickedtr');
            $(this).find("td.sorting_1").addClass('clickedtr');

            // setting button status
            self._setDetailStatus('trclick');
            // record the was selected tr
            self._selected_tr = this;

            // assignment to detail pages
            $.each(self._table.dataTable().fnGetData(self._selected_tr), function(key, define) {
                if (typeof self._code[key] !== 'undefined') {
                    $.each(self._code[key], function(index, value) {
                        if (value === define) {
                            $("#detail_" + key).val(index);
                        }
                    });
                } else {
                    $("#detail_" + key).val(define);
                }
            });
            // call customize callback function
            event.data._trigger('rowClick', null, {
                current : this,
                sorting_1 : $(this).find("td.sorting_1")
            });
        },
        /**
         * the hover event handler to tr data
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_tr_hover : function(event) {
            if (event.type === 'mouseenter') {
                $(this).addClass('hover').find("td.sorting_1").addClass('hover');
            } else {
                $(this).removeClass("hover").find("td.sorting_1").removeClass("hover");
            }
            // call customize callback function
            event.data._trigger('rowHover', event, {
                current : this,
                sorting_1 : $(this).find("td.sorting_1")
            });
        },
        /**
         * the change event handler to input
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_input_change : function(event) {
            var self = event.data;

            self._setDetailStatus('inputchange');
            self._table.find('.noneEdit').removeClass('noneEdit');

            var id = this.id.slice(7, this.id.length);

            // add update flag
            if (self._table.find('tr.clickedtr.newTr').length === 0) {
                self._table.find('tr.clickedtr').addClass('updateTr');
            }

            // validator...
            var config = self._getConfigById(id);
            if (config.validator !== undefined) {
                if (!config.validator($(this).val())) {
                    $('#' + this.id).tooltip('option', 'tooltipClass', 'ui-state-error').addClass('ui-state-error');
                    return;
                }
                $('#' + this.id).tooltip('option', 'tooltipClass', '');
                $('#' + this.id).removeClass('ui-state-error');
            }
            $(this).addClass('changeInput');

            $('tr.clickedtr.newTr.noneEdit').removeClass('noneEdit');

            var inputself = this;

            // sync to table...
            if (config.type === 'select') {
                var obj = $.grep(config.options, function(e) {
                    return e.id === inputself.value;
                });
                if (obj.length > 0) {
                    self._updateDetail(self._selected_tr, id, obj[0].name);
                }
            } else {
                self._updateDetail(self._selected_tr, id, inputself.value);
            }

            $('#form_message').hide().html(
                    self.options.language.form.sSaving.length === '0' ? 'Saving...' : self.options.language.form.sSaving)
                    .slideDown(3000, function() {
                        $(this).hide();
                    });
        },
        /**
         * the click event handler of new button
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_btn_new : function(event) {
            var self = event.data;
            if (!self._trigger("beforeNewButton", event, null)) {
                return;
            }

            if (self._validateForm() === false) {
                return;
            }
            // new a null data
            var data = {};

            $.each(self.options.form.pages, function(i) {
                $.each(self.options.form.pages[i].controls, function(j, val) {
                    data[val.id] = (self.options.form.pages[i].controls[j].customData !== undefined) ? val.customData() : '';
                });
            });

            $(self._table.dataTable().fnAddDataAndDisplay(data).nTr).addClass('newTr').addClass('noneEdit').trigger('click');
            self._setDetailStatus("new");
        },
        /**
         * the click event handler of save button
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_btn_save : function(event) {
            var self = event.data;
            if (!self._trigger("beforeSaveButton", event, null)) {
                return;
            }

            if (self._validateForm() === false) {
                return;
            }
            var td = self._table.dataTable();
            if (self.options.remoteAjax !== null) {
                var newRec = self._table.find('tr.newTr');
                if (typeof newRec[0] !== 'undefined') {
                    $.each(newRec, function(index, value) {
                        self._createRemoteAjax(td.fnGetData(value));
                    });
                    newRec.removeClass('newTr');
                }

                var updateRec = self._table.find('tr.updateTr');
                if (typeof updateRec[0] !== 'undefined') {
                    $.each(updateRec, function(index, value) {
                        self._updateRemoteAjax(td.fnGetData(value));
                    });
                    updateRec.removeClass('updateTr');
                }
            }

            $('.afdui-td-input').removeClass('changeInput');
            self._setDetailStatus("save");
        },
        /**
         * the click event handler of delete button
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_btn_delete : function(event) {
            var self = event.data;
            if (!self._trigger("beforeDeleteButton", event, null)) {
                return;
            }
            var deleted = self._table.find('tr.clickedtr');
            var td = self._table.dataTable(), data = td.fnGetData(deleted[0]);
            if (!self._deleteRemoteAjax(data)) {
                return;
            }
            $('.afdui-td-input').each(function(key, val) {
                val.value = "";
                if (val.tagName === "SELECT") {
                    val.value = val.firstChild.value;
                }
            });

            td.fnDeleteRow(td.fnGetPosition(deleted[0]));

            self._setDetailStatus("delete");
        },
        /**
         * the click event handler of close button
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_btn_close : function(event) {
            var self = event.data;
            if (!self._trigger("beforeCloseButton", event, null)) {
                return;
            }
            self.destroy();
        },
        /**
         * the keyup event handler to select input
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_key_up : function(event) {
            var self = event.data, value = $('#dataTable_filter input').val();
            self._trigger("selectChange", null, value);
        },

        /**
         * update data，Ajax to remote
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _updateRemoteAjax : function(data) {
            var updateRemoteUrl = this.options.remoteAjax.edit, self = this;
            var key = updateRemoteUrl.match(/_.+?_/g)[0];
            var value = data[key.slice(1, key.length - 1)];
            var updateRemoteAjax = {
                "url" : updateRemoteUrl.replace(/_.+?_/g, value),
                "type" : "PUT",
                "contentType" : "application/json",
                "dataType" : "json",
                "data" : data,
                "async" : false
            }, statusCode = '200';
            updateRemoteAjax.success =
            /**
             * @ignore
             */
            function() {
                if (!self._trigger('editSuccessMsg')) {
                    return;
                }
            };
            updateRemoteAjax.error =
            /**
             * @ignore
             */
            function(xhr) {
                statusCode = xhr.status;
                if (!self._trigger('editErrorMsg', null, xhr.status)) {
                    return;
                }
            };
            $.ajax(updateRemoteAjax);
            if (statusCode !== '200') {
                return false;
            } else {
                return true;
            }
        },
        /**
         * delete data，Ajax to remote
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _deleteRemoteAjax : function(data) {
            var deleteRemoteUrl = this.options.remoteAjax.remove, self = this;
            var key = deleteRemoteUrl.match(/_.+?_/g)[0];
            var value = data[key.slice(1, key.length - 1)];
            var deleteRemoteAjax = null;
            var statusCode = '200';
            deleteRemoteAjax = {
                "url" : deleteRemoteUrl.replace(/_.+?_/g, value),
                "type" : "DELETE",
                "async" : false
            };
            deleteRemoteAjax.success =
            /**
             * @ignore
             */
            function() {
                if (!self._trigger('delSuccessMsg')) {
                    return;
                }
            };
            deleteRemoteAjax.error =
            /**
             * @ignore
             */
            function(xhr) {
                statusCode = xhr.status;
                if (!self._trigger('delErrorMsg', null, xhr)) {
                    return;
                }
            };
            $.ajax(deleteRemoteAjax);
            if (statusCode !== '200') {
                return false;
            } else {
                return true;
            }
        },
        /**
         * create data，Ajax to remote
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _createRemoteAjax : function(data) {
            var createRemoteUrl = this.options.remoteAjax.create, self = this;
            var createRemoteAjax = null, statusCode = '200';
            createRemoteAjax = {
                "url" : createRemoteUrl,
                "type" : "POST",
                "contentType" : "application/json",
                "dataType" : "json",
                "data" : data,
                "async" : false
            };
            createRemoteAjax.success =
            /**
             * @ignore
             */
            function() {
                if (!self._trigger('createSuccessMsg')) {
                    return;
                }
            };
            createRemoteAjax.error =
            /**
             * @ignore
             */
            function(xhr) {
                statusCode = xhr.status;
                if (!self._trigger('createErrorMsg', null, xhr.status)) {
                    return;
                }
            };
            $.ajax(createRemoteAjax);
            if (statusCode !== '200') {
                return false;
            } else {
                return true;
            }
        },
        /**
         * search the input element from options by id
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _getConfigById : function(id) {
            var input = null;
            $.each(this.options.form.pages, function() {
                var res = $.grep(this.controls, function(e) {
                    return e.id === id;
                });

                if (typeof res !== 'undefined' && res.length > 0 && typeof res[0].id !== 'undefined') {
                    input = res[0];
                }
            });
            return input;
        },
        /**
         * bind events
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _bindEvents : function() {
            var self = this;
            // bind the click,hover,change events
            this._table.delegate("tr", "click.tabledetail", self, this._handle_tr_click);
            this._table.delegate("tr", "hover.tabledetail", self, this._handle_tr_hover);
            this._tabs.delegate(".afdui-td-input", "change.tabledetail", self, this._handle_input_change);

            // bind the button events
            this._btn_new.click(self, this._handle_btn_new);
            this._btn_save.click(self, this._handle_btn_save);
            this._btn_delete.click(self, this._handle_btn_delete);
            this._btn_close.click(self, this._handle_btn_close);

            // bind the keyup event for select input
            $('#dataTable_filter input').keyup(self, this._handle_key_up);

        },
        /**
         * unbind events
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _unbindEvents : function() {
            this._table.unbind();
            this._tabs.unbind();
        }
    });
}(jQuery));
