/**
 * Window resize listener functionality.
 * Add callback functions that will be called on window resize,
 * but debounced to not be called more that every so many milliseconds.
 */
var debouncedFunction,
    callbacks = [],
    delay = 250,
    
    /**
     * Returns a function, that, as long as it continues to be invoked, 
     * will not be triggered. The function will be called after it 
     * stops being called for N milliseconds. If `immediate` is passed, 
     * trigger the function on the leading edge, instead of the trailing.
     * @see https://davidwalsh.name/javascript-debounce-function
     * @param  {Function} func Function to call after delay.
     * @param  {Number} wait Milliseconds to wait before next call.
     * @param  {Boolean} immediate True to not wait.
     */
    debounce = function(func, wait, immediate) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            var later = function() {
                timeout = null;
                if (!immediate) {
                    func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };

export default function addWindowResize(specs, my) {
    var that,
        
        /**
         * Add callback function to be called on debounced resize.
         * @param  {Function} callback Callback function.
         */
        addWindowResizeCallback = function(callback) {
            callbacks.push(callback);
            if (!debouncedFunction) {
                debouncedFunction = debounce(function() {
                    callbacks.forEach(function(callbackFunction) {
                        callbackFunction();
                    });
                }, delay);
                window.addEventListener('resize', debouncedFunction);
            }
        };
    
    my = my || {};
    my.addWindowResizeCallback = addWindowResizeCallback;
    
    that = specs.that || {};
    
    return that;
}