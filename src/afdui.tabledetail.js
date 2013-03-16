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
            buttons : null,
            table : null,
            form : null,
            formValidator : null,
            remoteAjax : null,
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

            // TODO:refactor less code for similar
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
         * get form objects array
         * 
         * @function
         * @private
         * @memberOf tabledetail#
         * @return {OBJECT} retrun the form object array
         */
        _getFormObj : function() {
            var obj = {};
            $.each($('.afdui-td-input'), function(index, value) {
                obj[value.id.slice(7)] = value;
            });
            return obj;
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
            if (typeof this.options.formValidator === 'function' && $('.afdui-td-input')[0].disabled === false) {
                var msg = this.options.formValidator(this._getFormObj());
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
         * @function
         * @memberOf tabledetail#
         */
        _updateDataTableContents : function(self, key, value) {
            if (self === undefined) {
                return;
            }
            var data = this._table.fnGetData(self);
            data[key] = value;
            this._table.dataTable().fnUpdate(data, this._table.dataTable().fnGetPosition(self));
        },
        /**
         * the click event handle to tr data
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
            event.data._trigger('rowClick', null, {
                current : this,
                sorting_1 : $(this).find("td.sorting_1")
            });
        },
        /**
         * the hover event handle to tr data
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_tr_hover : function(event) {
            if (event.type === 'mouseenter') {
                $(this).addClass('hover');
                $(this).find("td.sorting_1").addClass('hover');
            } else {
                $(this).removeClass("hover");
                $(this).find("td.sorting_1").removeClass("hover");
            }
            event.data._trigger('rowHover', event, {
                current : this,
                sorting_1 : $(this).find("td.sorting_1")
            });
        },
        /**
         * the change event handle to input
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
            // validator...
            var obj = self._searchInputById(id);
            if (self._table.find('tr.clickedtr.newTr').length === 0) {
                self._table.find('tr.clickedtr').addClass('updateTr');
            }
            if (obj.validator !== undefined) {
                if (!obj.validator($(this).val())) {
                    $('#' + this.id).tooltip('option', 'tooltipClass', 'ui-state-error');
                    $('#' + this.id).addClass('ui-state-error');
                    return false;
                }
                $('#' + this.id).tooltip('option', 'tooltipClass', '');
                $('#' + this.id).removeClass('ui-state-error');
            }
            $(this).addClass('changeInput');

            $('tr.clickedtr.newTr.noneEdit').removeClass('noneEdit');

            var inputself = this;
            // async to table...
            if (obj.type === 'select') {
                $.each(obj.options, function(key, value) {
                    if (value.id === inputself.value) {
                        self._updateDataTableContents(self._selected_tr, id, value.name);
                    }
                });
            } else {
                self._updateDataTableContents(self._selected_tr, id, inputself.value);
            }

            $('#form_message').hide().html('Saving...').slideDown(3000, function() {
                $(this).hide();
            });
        },
        /**
         * the click event handle of new button
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_btn_new : function(event) {
            var self = event.data;
            if (self._validateForm() === false) {
                return;
            }
            // new a null data
            var data = {};
            $.each(self.options.table.aoColumns, function(index, value) {
                data[value.mData] = "";
            });
            $(self._table.dataTable().fnAddDataAndDisplay(data).nTr).addClass('newTr').addClass('noneEdit').trigger('click');
            self._setDetailStatus("new");
            $.each(self.options.form.pages, function(i) {
                $.each(self.options.form.pages[i].controls, function(j, val) {
                    if (self.options.form.pages[i].controls[j].customData !== undefined) {
                        self._tabs.find('#detail_' + val.id)[0].value = val.customData();
                    }
                });
            });
            if (!self._trigger('closeButton', event, null)) {
                return;
            }
        },
        /**
         * the click event handle of save button
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_btn_save : function(event) {
            var self = event.data;
            if (self._validateForm() === false) {
                return;
            }
            var td = self._table.dataTable();
            if (self.options.remoteAjax !== null) {
                if (typeof self._table.find('tr.newTr')[0] !== 'undefined') {
                    $.each(self._table.find('tr.newTr'), function(index, value) {
                        self._createRemoteAjax(td.fnGetData(value));
                        self._table.find('tr.newTr').removeClass('newTr');
                    });
                }
                if (typeof self._table.find('.updateTr')[0] !== 'undefined') {
                    $.each(self._table.find('tr.updateTr'), function(index, value) {
                        self._updateRemoteAjax(td.fnGetData(value));
                        self._table.find('tr.updateTr').removeClass('updateTr');
                    });
                }
            }
            // self._table.find('tr.clickedtr').removeClass('newTr');
            $('.afdui-td-input').removeClass('changeInput');
            self._setDetailStatus("save");
            if (!self._trigger('closeButton', event, null)) {
                return;
            }
        },
        /**
         * the click event handle of delete button
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_btn_delete : function(event) {
            var self = event.data;
            var td = self._table.dataTable(), data = td.fnGetData(self._table.find('tr.clickedtr')[0]);
            $('.afdui-td-input').each(function(key, val) {
                val.value = "";
                if (val.tagName === "SELECT") {
                    val.value = val.firstChild.value;
                }
            });
            self._deleteRemoteAjax(data);
            td.fnDeleteRow(td.fnGetPosition(self._table.find('tr.clickedtr')[0]));
            self._setDetailStatus("delete");
            if (!self._trigger('closeButton', event, null)) {
                return;
            }
        },
        /**
         * the click event handle of close button
         * 
         * @private
         * @param {Event}
         *            event object
         * @function
         * @memberOf tabledetail#
         */
        _handle_btn_close : function(event) {
            var self = event.data;
            if (self._validateForm() === false) {
                return;
            }
            if (self._saveMessage() === false) {
                $.ui.dialog.prototype.close.apply(self);
                if (!self._trigger('closeButton', event, null)) {
                    return;
                }
            }
        },
        /**
         * the keyup event handle to select input
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
         * check the save message is save when close the dialog or click other
         * tr
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _saveMessage : function() {
            return (typeof $('.afdui-td-input .changeInput')[0] === 'object') ? true : false;
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
            var indexvalue = data[key.slice(1, key.length - 1)];
            var updateRemoteAjax = null;
            updateRemoteAjax = {
                "url" : updateRemoteUrl.replace(/_.+?_/g, indexvalue),
                "type" : "PUT",
                "contentType" : "application/json",
                "dataType" : "json",
                "data" : data
            };
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
                if (!self._trigger('editErrorMsg', null, xhr.status)) {
                    return;
                }
            };
            $.ajax(updateRemoteAjax);
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
            var indexvalue = data[key.slice(1, key.length - 1)];
            var deleteRemoteAjax = null;
            deleteRemoteAjax = {
                "url" : deleteRemoteUrl.replace(/_.+?_/g, indexvalue),
                "type" : "DELETE"
            };
            deleteRemoteAjax.success =
            /**
             * @ignore
             */
            function() {
                if (!self._trigger('delSuccessMsg')) {
                    return;
                }
                // return true;
            };
            deleteRemoteAjax.error =
            /**
             * @ignore
             */
            function(xhr) {
                if (!self._trigger('delErrorMsg', null, xhr.status)) {
                    return;
                }
            };
            $.ajax(deleteRemoteAjax);
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
            var createRemoteAjax = null;
            createRemoteAjax = {
                "url" : createRemoteUrl,
                "type" : "POST",
                "contentType" : "application/json",
                "dataType" : "json",
                "data" : data
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
                if (!self._trigger('createErrorMsg', null, xhr.status)) {
                    return;
                }
            };
            $.ajax(createRemoteAjax);
        },
        /**
         * search the input element by id
         * 
         * @private
         * @function
         * @memberOf tabledetail#
         */
        _searchInputById : function(id) {
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
