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
        templateString:     [   "<table cellspacing='0' cellpadding='0' border='0'>",
                                    "<tr>",
                                        "<td align='right' valign='top' style='background-color: #ffe; border-right: 2px solid red'>",
                                            "<pre dojoAttachPoint='_preLineNumbers' style='margin: 0 0 0 0; padding: 0'></pre>",
                                        "</td>",
                                        "<td align='left' valign='top'>",
                                            "<pre dojoAttachPoint='_preCode' style='margin: 0 0 0 20px; padding: 0'></pre>",
                                        "</td>",
                                    "</tr>",
                                "</table>"
                            ].join(""),

        postCreate:         function() {
                                this.inherited(arguments);

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

                                var lengthLN = ("" + arrLinesCodeUse.length).length + 1;

                                var arrOutputLines = [], arrOutputCode = [];
                                for (var i = 0; i < arrLinesCodeUse.length; i++) {
                                    var strLineNumber = "" + (i + 1);
                                    while (strLineNumber.length < lengthLN) strLineNumber = ' ' + strLineNumber;

                                    arrOutputLines.push("<span style='",
                                                                i > 0 ? "border-top: 1px solid #bbb;" : "",
                                                                "padding-right: 10px",
                                                            "'>");
                                    arrOutputLines.push(strLineNumber);
                                    arrOutputLines.push("</span>");
                                    arrOutputLines.push("<br>");

                                    arrOutputCode.push("<span>");
                                    arrOutputCode.push(arrLinesCodeUse[i]);
                                    arrOutputCode.push("</span>");
                                    arrOutputCode.push("<br>");
                                }

                                this._preLineNumbers.innerHTML = arrOutputLines.join("");
                                this._preCode.innerHTML = arrOutputCode.join("");
                            }
    });