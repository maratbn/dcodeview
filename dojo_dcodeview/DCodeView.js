/**
 *  Copyright (c) 2010 Marat Nepomnyashy    maratbn@gmail
 *  All rights reserved.
 *
 *  Module:         dojo_dcodeview/DCodeView.js
 *
 *  Description:    A Dojo-based widget for embedding arbitrary source code
 *                  views inside web pages.
 *
 *  Redistribution and use in source and binary forms, with or without
 *  modification, are permitted provided that the following conditions are met:
 *      * Redistributions of source code must retain the above copyright
 *        notice, this list of conditions and the following disclaimer.
 *      * Redistributions in binary form must reproduce the above copyright
 *        notice, this list of conditions and the following disclaimer in the
 *        documentation and/or other materials provided with the distribution.
 *      * Neither the name of the <organization> nor the
 *        names of its contributors may be used to endorse or promote products
 *        derived from this software without specific prior written permission.
 * 
 *  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" 
 *  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 *  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 *  ARE DISCLAIMED. IN NO EVENT SHALL <COPYRIGHT HOLDER> BE LIABLE FOR ANY
 *  DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 *  (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 *  LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 *  ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 *  (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 *  THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

dojo.provide('dcodeview.DCodeView');

dojo.require('dijit._Templated');
dojo.require('dijit._Widget');

dojo.declare(
    'dcodeview.DCodeView',
    [dijit._Widget, dijit._Templated],
    {
        font_size:          "",

        templateString:     [   "<table cellspacing='0' cellpadding='0' border='0'",
                                        " style='border-top: 2px solid #bbb;border-bottom: 2px solid #bbb'",
                                    ">",
                                    "<tr>",
                                        "<td",
                                            " align='right'",
                                            " valign='top'",
                                            " style='",
                                                "background-color: #ffe;",
                                                "border-right: 2px solid #fbb;",
                                                "color: #555;",
                                            "'",
                                        ">",
                                            "<pre dojoAttachPoint='_preLineNumbers' style='margin: 0 0 0 0; padding: 0 10px'></pre>",
                                        "</td>",
                                        "<td align='left' valign='top'>",
                                            "<div style='position: relative; z-index: -1'>",
                                                "<div dojoAttachPoint='_divStripes' style='position: absolute; width: 100%'>",
                                                "</div>",
                                            "</div>",
                                            "<pre dojoAttachPoint='_preCode' style='margin: 0 10px; padding: 0'></pre>",
                                        "</td>",
                                    "</tr>",
                                "</table>"
                            ].join(""),

        postCreate:         function() {
                                this.inherited(arguments);

                                if (this.font_size) {
                                    dojo.style(this.domNode, 'fontSize', this.font_size);
                                }

                                var strCode = this.srcNodeRef.innerHTML || "";

                                // This prevents rendering of HTML tags that can mess up appearance of the source.
                                // The user should not be including unescaped HTML in the source anyway because that would
                                // prevent normal viewing without this widget, but just in case.
                                strCode = strCode.replace(/</g,'&lt;').replace(/>/g,'&gt;');

                                // This will produce a consistent array on both FF and IE with a line separator at each odd index.
                                var arrLinesCode = strCode.split(/($)/m);

                                // This will get rid of the odd indices as well as line separators at the start of each even-endex line.
                                var arrLinesCodeUse = [];
                                for (var i = 0; i < arrLinesCode.length; i+=2) {
                                    arrLinesCodeUse.push(arrLinesCode[i].replace(/\r\n|\r|\n/, ""));
                                }

                                // This removes the trailing blank lines from the source code.
                                while (arrLinesCodeUse.length > 0 && !arrLinesCodeUse[arrLinesCodeUse.length -1]) arrLinesCodeUse.pop();

                                // Different line break sequences work / do not work on different browsers.
                                // The sequence \r\n causes an extra line on IE, and an extra line of clipboard text in FF.
                                // The sequence \n works well on FF, but not IE.
                                // The sequence \r works well on IE.
                                var strLineBreak = dojo.isIE ? "\r" : "\n";

                                var arrOutputLines = [], arrOutputCode = [], arrOutputStripes = [];
                                for (var i = 0; i < arrLinesCodeUse.length; i++) {
                                    var strLineNumber = "" + (i + 1);

                                    dojo.place(document.createTextNode(strLineNumber), this._preLineNumbers);
                                    dojo.place(document.createTextNode(strLineBreak), this._preLineNumbers);

                                    dojo.place(document.createTextNode(arrLinesCodeUse[i]), this._preCode);
                                    dojo.place(document.createTextNode(strLineBreak), this._preCode);

                                    dojo.place(
                                        dojo.create(
                                                "div",
                                                {
                                                    style: {
                                                        backgroundColor: (i % 2 ? "#efefef" : "#edfded")
                                                    },
                                                    innerHTML: "&nbsp;"
                                                }),
                                        this._divStripes);
                                }
                            }
    });