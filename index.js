'use strict';

var Combinatorics = require('js-combinatorics');
var _             = require('lodash');

function makeConfigObjectReducer(val) {
    return function(acc, key) { acc[key] = val; return acc; }
}

/**
 *   Given an array of keys (strings), generate an array of objects where
 *   each object has each one of the keys as a key in the object and the
 *   array is all the permutations of boolean values.
 *
 *    var boolPermutations = require('nf-bool-permutations');
 *    var maps = boolPermutations.build([ 'secure', 'rtl' ]);
 *    console.log(maps);
 *
 *     result:
 *     [
 *      {secure: false, rtl: false},
 *      {secure: false, rtl: true},
 *      {secure: true,  rtl: false},
 *      {secure: true,  rtl: true}
 *     ]
 *
 **/
function build(keys) {

    var falseReducer = makeConfigObjectReducer(false), // [ 'a', 'b' ]  -> {a: false, b:  false}
        trueReducer  = makeConfigObjectReducer(true);  // [ 'a', 'b' ]  -> {a: true,  b: true}

    var allFalse = _.reduce( keys, falseReducer, {} );
    return Combinatorics.power(keys, function(arr) {
        return _.assign( {}, allFalse, _.reduce( arr, trueReducer, {} ))
    });

}

/**
 *   Given an object that has a combination of boolean keys, genrate a label
 *   based on the values
 *
 *    var boolPermutations = require('nf-bool-permutations');
 *    console.log( boolPermutations.getLabel({secure: true, rtl: false}, 'css') )     ->   'css-secure'
 *    console.log( boolPermutations.getLabel({secure: false rtl: true},  'css') )     ->   'css-rtl'
 *    console.log( boolPermutations.getLabel({secure: true, rtl: true},  'css') )     ->   'css-secure-rtl'
 *
 **/
function getLabel(boolPerms, prefix) {
    var trueKeys =  _.reduce(boolPerms, function(acc, value, key) {
        if ( value ) { acc.push(key); }
        return acc;
    }, prefix ? [prefix] : [] );

    return trueKeys.join('-');
}

module.exports = {
    build:    build,
    getLabel: getLabel
};
