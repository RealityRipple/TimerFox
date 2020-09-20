var TimerFoxDialog =
{
 _GetVar: function(elId)
 {
  var dVal = document.getElementById(elId).value;
  if (dVal)
  {
   if (isNaN(dVal))
   {
    return ('0');
   }
   else
   {
    return (dVal);
   }
  }
  else
  {
   return ('0');
  }
 },
 OnNumBox: function()
 {
  var retVals  = window.arguments[0];
  retVals.dHr  = TimerFoxDialog._GetVar('hour');
  retVals.dMn  = TimerFoxDialog._GetVar('minute');
  retVals.dSc  = TimerFoxDialog._GetVar('second');
  retVals.sMsg = document.getElementById('message').value;
  retVals.bAud = document.getElementById('customAudio').checked;
  document.getElementById('audio').disabled = !document.getElementById('customAudio').checked;
  document.getElementById('cmdBrowseAudio').disabled = !document.getElementById('customAudio').checked;
  retVals.sAud = document.getElementById('audio').value;
  document.getElementById('cmdOK').disabled = ((retVals.dHr === 0 && retVals.dMn === 0 && retVals.dSc === 0) || retVals.sMsg === '' || (retVals.bAud && retVals.sAud === ''));
 },
 OnAudioBrowse: function()
 {
  var picker = Components.classes['@mozilla.org/filepicker;1'].createInstance(Components.interfaces.nsIFilePicker);
  var fileLocator = Components.classes['@mozilla.org/file/directory_service;1'].getService(Components.interfaces.nsIProperties);
  picker.init(window, 'Select Audio File to play...', picker.modeOpen);
  picker.appendFilters(picker.filterAudio);
  picker.appendFilters(picker.filterAll);
  picker.displayDirectory = fileLocator.get('Desk', Components.interfaces.nsILocalFile);
  if (picker.show() !== picker.returnCancel)
  {
   document.getElementById('audio').value = picker.fileURL.prePath+picker.fileURL.path;
   TimerFoxDialog.OnNumBox();
  }
 },
 OnOK: function()
 {
  var retVals  = window.arguments[0];
  retVals.dHr  = TimerFoxDialog._GetVar('hour');
  retVals.dMn  = TimerFoxDialog._GetVar('minute');
  retVals.dSc  = TimerFoxDialog._GetVar('second');  
  retVals.sMsg = document.getElementById('message').value;
  retVals.bAud = document.getElementById('customAudio').checked;
  retVals.sAud = document.getElementById('audio').value;
  TimerFoxDialog._SetIntPref('top', window.screenY);
  TimerFoxDialog._SetIntPref('left', window.screenX);
  TimerFoxDialog._SetIntPref('hour', retVals.dHr);
  TimerFoxDialog._SetIntPref('minute', retVals.dMn);
  TimerFoxDialog._SetIntPref('second', retVals.dSc);
  TimerFoxDialog._SetStrPref('message', retVals.sMsg);
  TimerFoxDialog._SetBoolPref('customAudio', retVals.bAud);
  TimerFoxDialog._SetStrPref('audio', retVals.sAud);
  return true;
 },
 OnCancel: function()
 {
  var retVals  = window.arguments[0];
  TimerFoxDialog._SetIntPref('top', window.screenY);
  TimerFoxDialog._SetIntPref('left', window.screenX);
  retVals.dHr  = 0;
  retVals.dMn  = 0;
  retVals.dSc  = 0;
  retVals.sMsg = '';
  retVals.bAud = 0;
  retVals.sAud = '';
  return true;
 },
 OnLoad: function()
 {
  document.getElementById('hour').value    = TimerFoxDialog._GetIntPref('hour', 0);
  document.getElementById('minute').value  = TimerFoxDialog._GetIntPref('minute', 0);
  document.getElementById('second').value  = TimerFoxDialog._GetIntPref('second', 0);
  document.getElementById('message').value = TimerFoxDialog._GetStrPref('message', 'The countdown is complete!');
  if (typeof Audio === 'undefined')
  {
   document.getElementById('customAudio').hidden    = true;
   document.getElementById('audio').hidden          = true;
   document.getElementById('cmdBrowseAudio').hidden = true;
  }
  else
  {
   document.getElementById('customAudio').hidden      = false;
   document.getElementById('audio').hidden            = false;
   document.getElementById('cmdBrowseAudio').hidden   = false;
   document.getElementById('customAudio').checked     = TimerFoxDialog._GetBoolPref('customAudio', false);
   document.getElementById('audio').disabled          = !document.getElementById('customAudio').checked;
   document.getElementById('cmdBrowseAudio').disabled = !document.getElementById('customAudio').checked;
   document.getElementById('audio').value             = TimerFoxDialog._GetStrPref('audio', '');
  }
 },
 _SetStrPref: function(prefName, prefVal)
 {
  var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefName = 'extensions.timerfox.' + prefName;
  prefs.setCharPref(prefName, prefVal);
 },
 _SetIntPref: function(prefName, prefVal)
 {
  var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefName = 'extensions.timerfox.' + prefName;
  prefs.setIntPref(prefName, prefVal);
 },
 _SetBoolPref: function(prefName, prefVal)
 {
  var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefName = 'extensions.timerfox.' + prefName;
  prefs.setBoolPref(prefName, prefVal);
 },
 _GetStrPref: function(prefName, defVal)
 {
  var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefName = 'extensions.timerfox.' + prefName;
  if (prefs.prefHasUserValue(prefName))
  {
   return prefs.getCharPref(prefName);
  }
  else
  {
   return defVal;
  }
 },
 _GetIntPref: function(prefName, defVal)
 {
  var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefName = 'extensions.timerfox.' + prefName;
  if (prefs.prefHasUserValue(prefName))
  {
   return prefs.getIntPref(prefName);
  }
  else
  {
   return defVal;
  }
 },
 _GetBoolPref: function(prefName, defVal)
 {
  var prefs = Components.classes['@mozilla.org/preferences-service;1'].getService(Components.interfaces.nsIPrefBranch);
  prefName = 'extensions.timerfox.' + prefName;
  if (prefs.prefHasUserValue(prefName))
  {
   return prefs.getBoolPref(prefName);
  }
  else
  {
   return defVal;
  }
 }
};
