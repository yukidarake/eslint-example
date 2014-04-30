/**
 * @fileoverview コールバックが呼ばれる際にreturnがあるか
 * @author yukidarake
 */

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------
var estraverse = require('estraverse');

module.exports = function(context) {
    "use strict";

    var ifStack = [];
    var callbackRe = /callback|^(?:next|cb|done)/i;

    function checkCallback(node) {
        // callbackっぽいか
        if (!callbackRe.test(node.callee.name)) {
            return;
        }

        // ifブロック内ではない
        var ifNode = ifStack.length && ifStack[ifStack.length - 1];
        if (!ifNode) {
            return;
        }

        // elseあり
        if (ifNode.alternate) {
            return;
        }

        // if (callback) { callback(); } のパターン
        var isCallbackTest = ifNode.test.type === 'Identifier' &&
            callbackRe.test(ifNode.test.name);

        if (isCallbackTest) {
            return;
        }

        var returnExists = false;

        estraverse.traverse(ifNode, {
            enter: function(node) {
                if (node.type === 'ReturnStatement') {
                    returnExists = true;
                    this.break();
                    return;
                }

                if (node.type === 'FunctionStatement' || node.type === 'FunctionDeclaration') {
                    this.skip();
                    return;
                }
            },
        });

        if (returnExists) {
            return;
        }

        context.report(node, 'no callback return!');
    }

    function startIf(node) {
        ifStack.push(node);
    }

    function endIf() {
        ifStack.pop();
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
        "CallExpression": checkCallback,
        "IfStatement": startIf,
        "IfStatement:exit": endIf,
    };
};
