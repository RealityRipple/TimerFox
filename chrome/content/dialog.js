if (!com) var com = {};
if (!com.RealityRipple) com.RealityRipple = {};

com.RealityRipple.TimerFoxDialog = function()
{
 var pub  = {};
 var priv = {};

 priv.GetVar = function(elId)
 {
  var dVal = document.getElementById(elId).value;
  if (dVal)
  {
   if (isNaN(dVal))
   {
    return ("0");
   }
   else
   {
    return (dVal);
   }
  }
  else
  {
   return ("0");
  }
 };

 pub.OnNumBox = function()
 {
  var retVals  = window.arguments[0];
  retVals.dHr  = priv.GetVar("hour");
  retVals.dMn  = priv.GetVar("minute");
  retVals.dSc  = priv.GetVar("second");
  retVals.sMsg = document.getElementById("message").value;
  retVals.bAud = document.getElementById("customAudio").checked;
  document.getElementById("audio").disabled = !document.getElementById("customAudio").checked;
  document.getElementById("cmdBrowseAudio").disabled = !document.getElementById("customAudio").checked;
  retVals.sAud = document.getElementById("audio").value;
  document.getElementById("cmdOK").disabled = ((retVals.dHr == 0 && retVals.dMn == 0 && retVals.dSc == 0) || retVals.sMsg == '' || (retVals.bAud && retVals.sAud == ''))
 };

 pub.OnAudioBrowse = function()
 {
  var picker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
  var fileLocator = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties);
  picker.init(window, "Select Audio File to play...", picker.modeOpen);
  picker.appendFilters(picker.filterAudio);
  picker.appendFilters(picker.filterAll);
  picker.displayDirectory = fileLocator.get("Desk", Components.interfaces.nsILocalFile);
  if (picker.show() != picker.returnCancel)
  {
   document.getElementById("audio").value = picker.fileURL.prePath+picker.fileURL.path;
   com.RealityRipple.TimerFoxDialog.OnNumBox();
  }
 };

 pub.OnOK = function()
 {
  var retVals  = window.arguments[0];
  retVals.dHr  = priv.GetVar("hour");
  retVals.dMn  = priv.GetVar("minute");
  retVals.dSc  = priv.GetVar("second");  
  retVals.sMsg = document.getElementById("message").value;
  retVals.bAud = document.getElementById("customAudio").checked;
  retVals.sAud = document.getElementById("audio").value;
  priv.SetIntPref("top", window.screenY);
  priv.SetIntPref("left", window.screenX);
  priv.SetIntPref("hour", retVals.dHr);
  priv.SetIntPref("minute", retVals.dMn);
  priv.SetIntPref("second", retVals.dSc);
  priv.SetStrPref("message", retVals.sMsg);
  priv.SetBoolPref("customAudio", retVals.bAud);
  priv.SetStrPref("audio", retVals.sAud);
  return true;
 };

 pub.OnCancel = function()
 {
  var retVals  = window.arguments[0];
  priv.SetIntPref("top", window.screenY);
  priv.SetIntPref("left", window.screenX);
  retVals.dHr  = 0;
  retVals.dMn  = 0;
  retVals.dSc  = 0;
  retVals.sMsg = "";
  retVals.bAud = 0;
  retVals.sAud = "";
  return true;
 };

 pub.OnLoad = function()
 {
  document.getElementById("hour").value    = priv.GetIntPref("hour", 0);
  document.getElementById("minute").value  = priv.GetIntPref("minute", 0);
  document.getElementById("second").value  = priv.GetIntPref("second", 0);
  document.getElementById("message").value = priv.GetStrPref("message", "The countdown is complete!");
  if (typeof Audio == "undefined")
  {
   document.getElementById("customAudio").hidden    = true;
   document.getElementById("audio").hidden          = true;
   document.getElementById("cmdBrowseAudio").hidden = true;
  }
  else
  {
   document.getElementById("customAudio").hidden      = false;
   document.getElementById("audio").hidden            = false;
   document.getElementById("cmdBrowseAudio").hidden   = false;
   document.getElementById("customAudio").checked     = priv.GetBoolPref("customAudio", false);
   document.getElementById("audio").disabled          = !document.getElementById("customAudio").checked;
   document.getElementById("cmdBrowseAudio").disabled = !document.getElementById("customAudio").checked;
   document.getElementById("audio").value             = priv.GetStrPref("audio", "");
  }
 };

 priv.SetStrPref = function(prefName, prefVal)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefName = "extensions.timerfox." + prefName;
  prefs.setCharPref(prefName, prefVal);
 };

 priv.SetIntPref = function(prefName, prefVal)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefName = "extensions.timerfox." + prefName;
  prefs.setIntPref(prefName, prefVal);
 };

 priv.SetBoolPref = function(prefName, prefVal)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefName = "extensions.timerfox." + prefName;
  prefs.setBoolPref(prefName, prefVal);
 };

 priv.GetStrPref = function(prefName, defVal)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefName = "extensions.timerfox." + prefName;
  if (prefs.prefHasUserValue(prefName))
  {
   return prefs.getCharPref(prefName);
  }
  else
  {
   return defVal;
  }
 };

 priv.GetIntPref = function(prefName, defVal)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefName = "extensions.timerfox." + prefName;
  if (prefs.prefHasUserValue(prefName))
  {
   return prefs.getIntPref(prefName);
  }
  else
  {
   return defVal;
  }
 };

 priv.GetBoolPref = function(prefName, defVal)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefName = "extensions.timerfox." + prefName;
  if (prefs.prefHasUserValue(prefName))
  {
   return prefs.getBoolPref(prefName);
  }
  else
  {
   return defVal;
  }
 };
 
 return pub;
}();
