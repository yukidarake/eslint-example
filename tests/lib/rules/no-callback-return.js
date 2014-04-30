/**
 * @fileoverview Tests for multiple callback calls
 * @author yukidarake
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

var eslintTester = require('eslint-tester');

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

function heredoc(func) {
    return func
        .toString()
        .split('\n')
        .slice(1, -1)
        .join('\n');
}

eslintTester.addRuleTest('lib/rules/no-callback-return', {
    valid: [
        {
            code: heredoc(function() {/*
                function test(err, callback) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                }
            */}),
        },
        {
            code: heredoc(function() {/*
                function test(err, callback) {
                    if (err) {
                        return callback(err);
                    }
                    callback();
                }
            */}),
        },
        {
            code: heredoc(function() {/*
                function test(err, callback) {
                    if (err) {
                        callback(err);
                    } else {
                        callback();
                    }
                }
            */}),
        },
        {
            code: heredoc(function() {/*
                var test = function(err, callback) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                }
            */}),
        },
        {
            code: heredoc(function() {/*
                var test = function(err, callback) {
                    if (err) {
                        return callback(err);
                    }
                    callback();
                }
            */}),
        },
        {
            code: heredoc(function() {/*
                var test = function(err, callback) {
                    if (err) {
                        return callback(err);
                    } else {
                        callback();
                    }
                }
            */}),
        },
        {
            code: heredoc(function() {/*
                test(function(err) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    callback();
                });
            */}),
        },
        {
            code: heredoc(function() {/*
                test(function(err) {
                    if (err) {
                        return callback(err);
                    }
                    callback();
                });
            */}),
        },
        {
            code: heredoc(function() {/*
                test(function(err) {
                    if (err) {
                        return callback(err);
                    } else {
                        callback();
                    }
                });
            */}),
        },
        {
            code: heredoc(function() {/*
                var test = function(err, callback) {
                    if (err) {
                        test1(function(err) {
                            if (err) {
                                callback(err);
                                return;
                            }
                            callback();
                        });
                        return;
                    }
                    callback();
                };
            */}),
        },
        {
            code: heredoc(function() {/*
                var test = function(err, callback) {
                    if (err) {
                        test1(function(err) {
                            if (err) {
                                return callback(err);
                            }
                            callback();
                        });
                        return;
                    }
                    callback();
                };
            */}),
        },
        {
            code: heredoc(function() {/*
                var test = function(err, callback) {
                    if (err) {
                        test1(function(err) {
                            if (err) {
                                return callback(err);
                            } else {
                                callback();
                            }
                        });
                        return;
                    }
                    callback();
                };
            */}),
        },
    ],
    invalid: [
        {
            code: heredoc(function() {/*
                function test(err, callback) {
                    if (err) {
                        callback(err);
                    }
                    callback();
                }
            */}),
            errors: 1,
        },
        {
            code: heredoc(function() {/*
                var test = function(err, callback) {
                    if (err) {
                        callback(err);
                    }
                    callback();
                }
            */}),
            errors: 1,
        },
        {
            code: heredoc(function() {/*
                test(function(err) {
                    if (err) {
                        callback(err);
                    }
                    callback();
                });
            */}),
            errors: 1,
        },
        {
            code: heredoc(function() {/*
                var test = function(err, callback) {
                    if (err) {
                        test1(function(err) {
                            if (err) {
                                callback(err);
                            }
                            callback();
                        });
                        return;
                    }
                    callback();
                };
            */}),
            errors: 1,
        },
    ]
});
