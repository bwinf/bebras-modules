/* Calliope simulation prototype for the jwinf quickAlgo / Codecast 7.7 API.
 * New implementation; architecture inspired by quickAlgo Template and QuickPi.
 * No device compiler, no claim of electrical or timing fidelity. */
(function () {
  'use strict';
  var copy = function (x) { return JSON.parse(JSON.stringify(x)); };
  function getCalliopeContext(display, infos) {
    var context = quickAlgoContext(display, infos);
    var labels = {
      setRgb: 'RGB-Licht %1', clearDisplay: 'LED-Matrix löschen',
      setPixel: 'LED x %1 y %2 auf %3', showIcon: 'zeige %1',
      lightLevel: 'Helligkeit', temperature: 'Temperatur in °C',
      buttonPressed: 'Taste %1 gedrückt?', pause: 'warte %1 Millisekunden'
    };
    var code = {};
    Object.keys(labels).forEach(function (key) { code[key] = key; });
    context.setLocalLanguageStrings({de: {
      label: labels, code: code, startingBlockName: 'Programm',
      categories: {actions: 'Anzeige', sensors: 'Sensoren', time: 'Zeit'},
      description: {
        setRgb: 'setRgb(farbe): rot, grün, blau, weiß oder aus.',
        setPixel: 'setPixel(x, y, an): Koordinaten von 0 bis 4.',
        lightLevel: 'lightLevel(): Helligkeit von 0 bis 255.',
        temperature: 'temperature(): Temperatur in Grad Celsius.',
        buttonPressed: 'buttonPressed(taste): Zustand von A oder B.',
        pause: 'pause(ms): erhöht die simulierte Zeit, unabhängig vom Abspieltempo.',
        showIcon: 'showIcon(symbol): Herz, Haken oder Kreuz.',
        clearDisplay: 'clearDisplay(): schaltet alle 25 LEDs aus.'
      }, messages: {}
    }});
    var state, test = {mode: 'free'}, root;
    var manual = {light: 100, temperature: 21, A: false, B: false};
    var colours = {off:'#243044', red:'#ff476c', green:'#53e39c', blue:'#59b5ff', white:'#ffffff'};
    var icons = {heart:['01010','11111','11111','01110','00100'], check:['00001','00010','10100','01000','00000'], cross:['10001','01010','00100','01010','10001']};
    context.calliope = {};
    context.implementsInnerState = function () { return true; };
    context.getInnerState = function () { return copy({state: state, test: test}); };
    context.reloadInnerState = function (saved) {
      state = copy(saved.state); test = copy(saved.test); context.redrawDisplay();
    };
    context.reset = function (taskInfos) {
      if (taskInfos) test = copy(taskInfos);
      state = {pixels:Array(25).fill(false), rgb:'off', time:0, actions:0,
        light:test.mode === 'night' ? test.light : manual.light,
        temperature:manual.temperature, A:false, B:false};
      context.success = false;
      if (context.display) context.resetDisplay();
    };
    function changeSensor(payload) {
      if (test.mode !== 'free' || !state) return;
      if (payload.name === 'light') state.light = Math.max(0, Math.min(255, Math.round(Number(payload.value))));
      else if (payload.name === 'temperature') state.temperature = Math.max(-10, Math.min(50, Number(payload.value)));
      else if (payload.name === 'A' || payload.name === 'B') state[payload.name] = !!payload.value;
      else return;
      manual[payload.name] = state[payload.name];
      context.redrawDisplay();
    }
    context.calliope.changeSensor = function (name, value, callback) {
      changeSensor({name:name,value:value});
      if (callback) callback();
    };
    context.getEventListeners = function () { return {'calliope/changeSensor': 'changeSensor'}; };
    function input(name, value) {
      // Like QuickPi: apply a manual input immediately and log it for replay.
      // Executing a context call while the runner is idle would require a thread
      // that does not exist yet (e.g. moving the slider before pressing Play).
      changeSensor({name:name,value:value});
      if (context.dispatchContextEvent) context.dispatchContextEvent({type:'calliope/changeSensor', payload:[name,value],onlyLog:true});
    }
    context.resetDisplay = function () {
      var grid = document.getElementById('grid');
      if (!grid) return;
      grid.innerHTML = '<div class="calliope-sim"><div class="cp-heading"><b>Calliope mini</b><span class="cp-tag">SIMULATION</span></div>' +
        '<svg viewBox="0 0 360 290" role="img" aria-label="Simulierter Calliope mit LED-Matrix"><path d="M100 18 L260 18 L342 145 L260 272 L100 272 L18 145 Z" fill="#17283b" stroke="#3a536d" stroke-width="3"/>' +
        [[100,36],[260,36],[323,145],[260,252],[100,252],[37,145]].map(function(p){return '<circle cx="'+p[0]+'" cy="'+p[1]+'" r="12" fill="#d9ba6e"/><circle cx="'+p[0]+'" cy="'+p[1]+'" r="6" fill="#17283b"/>';}).join('') +
        '<rect x="141" y="24" width="78" height="23" rx="5" fill="#8ca0b2"/><text x="180" y="70" text-anchor="middle" fill="#a7bbcb" font-size="12">CALLIOPE · JWINF</text>' +
        Array.from({length:25},function(_,i){return '<rect data-pixel="'+i+'" x="'+(128+(i%5)*23)+'" y="'+(88+Math.floor(i/5)*23)+'" width="13" height="13" rx="3" fill="#344355"/>';}).join('') +
        '<circle data-rgb cx="180" cy="231" r="14" stroke="#648095" stroke-width="2"/>' +
        '<circle data-button="A" cx="76" cy="145" r="20" fill="#53687e"/><text x="76" y="150" text-anchor="middle" fill="white">A</text>' +
        '<circle data-button="B" cx="284" cy="145" r="20" fill="#53687e"/><text x="284" y="150" text-anchor="middle" fill="white">B</text></svg>' +
        '<div class="cp-output"><span data-rgb-label></span><span data-time></span></div>' +
        '<div class="cp-controls"><label>Helligkeit <output data-light></output><input aria-label="Helligkeit" data-input="light" type="range" min="0" max="255"></label>' +
        '<label>Temperatur <output data-temperature></output><input aria-label="Temperatur" data-input="temperature" type="range" min="-10" max="50"></label>' +
        '<div class="cp-buttons"><button type="button" data-key="A" aria-pressed="false">Taste A</button><button type="button" data-key="B" aria-pressed="false">Taste B</button></div>' +
        '<p class="cp-note"></p></div></div>';
      root = grid.querySelector('.calliope-sim');
      root.querySelectorAll('[data-input]').forEach(function (el) {
        el.addEventListener('input', function () { input(el.dataset.input, Number(el.value)); });
      });
      root.querySelectorAll('[data-key]').forEach(function (el) {
        // Toggle buttons work with mouse, touch and keyboard, including while stepping.
        el.addEventListener('click', function () { input(el.dataset.key, !state[el.dataset.key]); });
      });
      context.redrawDisplay();
    };
    context.redrawDisplay = function () {
      if (!context.display || !state) return;
      if (!root || !root.isConnected) { context.resetDisplay(); return; }
      root.querySelectorAll('[data-pixel]').forEach(function(el){el.setAttribute('fill',state.pixels[Number(el.dataset.pixel)] ? '#ff5672' : '#344355');});
      root.querySelector('[data-rgb]').setAttribute('fill', colours[state.rgb]);
      root.querySelector('[data-rgb-label]').textContent = 'RGB: ' + ({off:'aus',red:'rot',green:'grün',blue:'blau',white:'weiß'})[state.rgb];
      root.querySelector('[data-time]').textContent = state.time + ' ms simuliert';
      root.querySelector('[data-light]').textContent = state.light + ' / 255';
      root.querySelector('[data-temperature]').textContent = state.temperature + ' °C';
      root.querySelectorAll('[data-input]').forEach(function(el){el.value=state[el.dataset.input];el.disabled=test.mode!=='free';});
      root.querySelectorAll('[data-key]').forEach(function(el){el.disabled=test.mode!=='free';el.setAttribute('aria-pressed',String(state[el.dataset.key]));});
      ['A','B'].forEach(function(k){root.querySelector('[data-button="'+k+'"]').setAttribute('fill',state[k]?'#53e39c':'#53687e');});
      root.querySelector('.cp-note').textContent = test.mode==='free' ? 'Tasten anklicken: gedrückt / losgelassen. Sensoren sind während der Ausführung veränderbar.' : 'Testeingaben sind fest. Unter 50: RGB weiß. Ab 50: RGB aus.';
    };
    context.updateScale = function () { context.redrawDisplay(); };
    context.unload = function () { if (root) root.remove(); root=null; };
    function done(callback) { state.actions++; context.redrawDisplay(); context.waitDelay(callback); }
    context.calliope.setRgb = function (colour, callback) {
      if (!Object.prototype.hasOwnProperty.call(colours,colour)) throw new Error('Unbekannte RGB-Farbe.');
      state.rgb=colour; done(callback);
    };
    context.calliope.setPixel = function (x,y,on,callback) {
      if (!Number.isInteger(x)||!Number.isInteger(y)||x<0||x>4||y<0||y>4) throw new Error('LED-Koordinaten müssen ganze Zahlen zwischen 0 und 4 sein.');
      state.pixels[y*5+x]=on==='on'; done(callback);
    };
    context.calliope.clearDisplay = function (callback) { state.pixels.fill(false); done(callback); };
    context.calliope.showIcon = function (name,callback) {
      if (!icons[name]) throw new Error('Unbekanntes Symbol.');
      state.pixels=icons[name].join('').split('').map(function(x){return x==='1';}); done(callback);
    };
    context.calliope.lightLevel = function (callback) { context.callCallback(callback,state.light); };
    context.calliope.temperature = function (callback) { context.callCallback(callback,state.temperature); };
    context.calliope.buttonPressed = function (name,callback) { context.callCallback(callback,!!state[name]); };
    context.calliope.pause = function (ms,callback) {
      if (!Number.isFinite(ms)||ms<0||ms>60000) throw new Error('Wartezeit: 0 bis 60000 Millisekunden.');
      state.time+=Math.round(ms); done(callback);
    };
    context.checkCalliope = function (lastTurn) {
      if (!lastTurn) return;
      if (test.mode==='free') { context.success=true; throw 'Programm beendet. Im freien Modus wird keine Lösung bewertet.'; }
      var expected = state.light<50 ? 'white':'off';
      context.success = state.rgb===expected && state.actions>0;
      if (!context.success) throw 'Bei Helligkeit '+state.light+' muss das RGB-Licht '+(expected==='white'?'weiß leuchten':'aus sein')+'.';
      throw 'Richtig! Das Nachtlicht reagiert passend zur Helligkeit.';
    };
    function dropdown(name, options) { return {type:'field_dropdown',name:name,options:options}; }
    context.customBlocks = {calliope:{
      actions:[
        {name:'setRgb',params:['String'],blocklyJson:{args0:[dropdown('PARAM_0',[['aus','off'],['weiß','white'],['rot','red'],['grün','green'],['blau','blue']])]}},
        {name:'setPixel',params:['Number','Number','String'],blocklyJson:{args0:[{type:'input_value',name:'PARAM_0',check:'Number'},{type:'input_value',name:'PARAM_1',check:'Number'},dropdown('PARAM_2',[['an','on'],['aus','off']])]}},
        {name:'showIcon',params:['String'],blocklyJson:{args0:[dropdown('PARAM_0',[['Herz','heart'],['Haken','check'],['Kreuz','cross']])]}},
        {name:'clearDisplay'}
      ],
      sensors:[{name:'lightLevel',yieldsValue:'int'},{name:'temperature',yieldsValue:'int'},
        {name:'buttonPressed',params:['String'],yieldsValue:'bool',blocklyJson:{args0:[dropdown('PARAM_0',[['A','A'],['B','B']])]}}],
      time:[{name:'pause',params:['Number']}]
    }};
    context.provideBlocklyColours = function () { return {categories:{actions:'#b32962',sensors:'#327e95',time:'#8766bb'}}; };
    return context;
  }
  window.quickAlgoLibrariesList = window.quickAlgoLibrariesList || [];
  window.quickAlgoLibrariesList.push(['calliope',getCalliopeContext]);
  // Exposed for the included headless regression tests and debugging.
  window.createCalliopeContext = getCalliopeContext;
})();
