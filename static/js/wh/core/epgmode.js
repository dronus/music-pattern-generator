/**
 * Unchangeable application configuration settings.
 * 
 * @namespace WH
 */
window.WH = window.WH || {};

(function (WH) {
    
    function createEPGMode() {
        
        var processors = [],
            selectedOutputProcessor = null,
            selectedOutputPortCallback = null,
            
            addProcessor = function(processor) {
                processors.push(processor);
                console.debug('%c EPGMode addProcessor processors: ' + processors.length, 'color:#090;');
                
                // connect the processor to the selected output
                if (processor.getType() == 'epg' && selectedOutputProcessor) {
                    processor.connect(selectedOutputProcessor);
                }
            },
            
            removeProcessor = function(processor) {
                for (var i = 0, n = processors.length; i < n; i++) {
                    if (processors[i] == processor) {
                        processors.splice(i, 1);
                        break;
                    }
                }
                console.debug('%c EPGMode removeProcessor processors: ' + processors.length, 'color:#090;');
            },
            
            selectMIDIOutPort = function(processorID, midiPortCallback) {
                console.debug('%c EPGMode selectMIDIOutPort processorID: ' + processorID, 'color:#090;');
                
                // disconnect all EPG processors from the old selected processor
                if (selectedOutputProcessor && selectedOutputPortCallback) {
                    // do nothing if the old and new output are the same,
                    // for example when a MIDI device was disconnected and reconnected
                    console.log(selectedOutputProcessor.getID(), processorID);
                    if (selectedOutputProcessor.getID() == processorID) {
                        return;
                    }
                    
                    selectedOutputPortCallback(false);
                }
                
                // reset selected output
                selectedOutputProcessor = null;
                selectedOutputPortCallback = null;
                
                // find the new output processor and set as selected
                if (processorID) {
                    for (var i = 0, n = processors.length; i < n; i++) {
                        if (processors[i].getID() == processorID) {
                            selectedOutputProcessor = processors[i];
                            selectedOutputPortCallback = midiPortCallback;
                            break;
                        }
                    }
                }
                
                // connect all EPG processors to the new selected processor
                if (selectedOutputProcessor) {
                    for (var i = 0, n = processors.length; i < n; i++) {
                        if (processors[i].getType() == 'epg') {
                            processors[i].connect(selectedOutputProcessor);
                        }
                    }
                }
            };
        
        return {
            addProcessor: addProcessor,
            removeProcessor: removeProcessor,
            selectMIDIOutPort: selectMIDIOutPort
        };
    }
    
    WH.EPGMode = createEPGMode();
})(WH);
