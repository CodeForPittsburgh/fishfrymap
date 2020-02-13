/**
 * shim.js
 * 
 * browserify-shim configuration
 * 
 * primarily deals with ensuring jQuery is available globally in 
 * the window, which is where it is expected by packages like 
 * Bootstrap.js and Typeahead.js
 * 
 */

module.exports = {
    '../../node_modules/jquery/dist/jquery.js': {
        'exports': '$'
    },
    '../../node_modules/jquery/dist/jquery.js': {
        'exports': 'jQuery'
    },
    '../../node_modules/bootstrap/dist/js/bootstrap.js': {
        'depends': [
            '../../node_modules/jquery/dist/jquery.js:jQuery',
            '../../node_modules/jquery/dist/jquery.js:$'
        ]
    },
    // '../../node_modules/typeahead.js/dist/bloodhound.js': {
    //   'exports': 'Bloodhound' 
    // },
    // '../../node_modules/typeahead.js/dist/typeahead.jquery.js': {
    //   'depends': { 
    //     '../../node_modules/jquery/dist/jquery.js': null 
    //   }
    // }
}