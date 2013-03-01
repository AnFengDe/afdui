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
                click : function(event) {
                }
            },
            "save" : {
                text : "save",
                id : "detail_btn_save",
                /**
                 * @ignore
                 */
                click : function(event) {
                }
            },
            "delete" : {
                text : "delete",
                id : "detail_btn_delete",
                /**
                 * @ignore
                 */
                click : function(event) {
                }
            },
            "close" : {
                text : "close",
                id : "detail_btn_close",
                /**
                 * @ignore
                 */
                click : function(event) {
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
            buttons : this._BUTTON_DEFAULT,
            table : this._TABLE_DEFAULT,
            form : null
        },
        /**
         * widget's methods
         * 
         * @construct
         * @memberOf tabledetail#
         */
        _create : function() {
        },
        destroy : function() {
        }
    /**
     * widget's events
     * 
     * @memberOf tabledetail#
     */
    });
}(jQuery));
