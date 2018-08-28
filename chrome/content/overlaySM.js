var TimerFoxSM =
{
 _timer: Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer),
 _Seconds: 0,
 _Second: 0,
 _TimerID: 0,
 _Message: 'The countdown is complete!',
 _bAudio: false,
 _sAudio: '',
 _ToolTip: '',
 _mAPlayer: null,
 ToggleTimer: function()
 {
  if (document.getElementById("timer-button").className.indexOf("timer0") > -1)
   TimerFoxSM._StartTimer();
  else if (document.getElementById("timer-button").className.className.indexOf("timerA") > -1)
  {
   if (TimerFoxSM._mAPlayer != null && !TimerFoxSM._mAPlayer.ended)
   {
    TimerFoxSM._mAPlayer.pause();
    TimerFoxSM._mAPlayer = null;
   }
   TimerFoxSM._SetTimer(0);
   document.getElementById("timer-button").tooltipText = TimerFoxSM._ToolTip;
  }
  else
   TimerFoxSM._StopTimer(true);
 },
 _StartTimer: function()
 {
  TimerFoxSM._Second = 0;
  var pImg    = document.getElementById("timer-button");
  var retVals = { dHr:0, dMn:0, dSc:0, sMsg:'', bAud:false, sAud:''};
  var wnTop   = TimerFoxSM._GetIntPref("top");
  if ((wnTop > screen.height) || (wnTop < 0))
  {
   wnTop = 320;
  }
  var wnLeft  = TimerFoxSM._GetIntPref("left");
  if ((wnLeft > screen.width) || (wnLeft < 0))
  {
   wnLeft = 240;
  }
  var wnHeight = 100;
  if (typeof Audio != "undefined")
  {
   wnHeight = 140;
  }
  window.openDialog("chrome://timerfox/content/dialog.xul", "", "chrome,dialog,resizable=no,width=250,height=" + wnHeight + ",top=" + wnTop + ",left=" + wnLeft + ",alwaysRaised,modal", retVals);
  var tHr = parseInt(retVals.dHr * 60 * 60);
  var tMn = parseInt(retVals.dMn * 60);
  var tSc = parseInt(retVals.dSc);
  TimerFoxSM._Message = retVals.sMsg;
  TimerFoxSM._bAudio  = retVals.bAud;
  TimerFoxSM._sAudio  = retVals.sAud;
  TimerFoxSM._Seconds = tHr+tMn+tSc;
  if (TimerFoxSM._Seconds > 0)
  {
   TimerFoxSM._Second = 0;
   TimerFoxSM._timer.initWithCallback(TimerFoxSM.UpdateTimer, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
   TimerFoxSM._TimerID = 1;
   TimerFoxSM._SetTimer(1);
   TimerFoxSM._ToolTip = pImg.tooltipText;
  }
  else
  {
   TimerFoxSM._ToolTip = pImg.tooltipText;
   TimerFoxSM._StopTimer(true);
  }
 },
 UpdateTimer:
 {
  notify: function(timer)
  {
   TimerFoxSM._timer.cancel();
   var pImg = document.getElementById("timer-button");
   TimerFoxSM._Second++;
   var tLeft = TimerFoxSM._Seconds - TimerFoxSM._Second;
   if (tLeft > 0)
   {
    var pLeft = Math.floor(TimerFoxSM._Second / TimerFoxSM._Seconds * 8 + 1);
    TimerFoxSM._SetTimer(pLeft);
    pImg.tooltipText = TimerFoxSM._ConvertTime(TimerFoxSM._Seconds - TimerFoxSM._Second);
    TimerFoxSM._timer.initWithCallback(TimerFoxSM.UpdateTimer, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
   }
   else
   {
    TimerFoxSM._SetTimer(9);
    var simpleBeep = 0;
    if (typeof Audio == "undefined")
    {
     simpleBeep = 1;
    }
    if (!TimerFoxSM._bAudio)
    {
     simpleBeep = 1;
    }
    if (simpleBeep == 0)
    {
     try
     {
      TimerFoxSM._mAPlayer = new Audio(TimerFoxSM._sAudio);
      TimerFoxSM._mAPlayer.onerror = function()
      {
       TimerFoxSM._SetTimer(0);
       document.getElementById("timer-button").tooltipText = TimerFoxSM._ToolTip;
       var mPlayer = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
       mPlayer.init;
       mPlayer.beep();
      }
      TimerFoxSM._SetTimer('A');
      document.getElementById("timer-button").tooltipText = decodeURIComponent('%E2%99%AB');
      TimerFoxSM._mAPlayer.play();
      TimerFoxSM._mAPlayer.onended = function()
      {
       TimerFoxSM._SetTimer(0);
       document.getElementById("timer-button").tooltipText = TimerFoxSM._ToolTip;
       TimerFoxSM._mAPlayer = null;
      }
     }
     catch(e)
     {
      TimerFoxSM._SetTimer(0);
      document.getElementById("timer-button").tooltipText = TimerFoxSM._ToolTip;
      simpleBeep = 1;
     }
    }
    if (simpleBeep == 1)
    {
     var mPlayer = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
     mPlayer.init;
     mPlayer.beep();
    }
    alert(TimerFoxSM._Message);
    if (simpleBeep == 1)
     TimerFoxSM._StopTimer(true);
    else
     TimerFoxSM._StopTimer(false);
   }
  }
 },
 _StopTimer: function(resetTimer)
 {
  var pImg = document.getElementById("timer-button");
  if(TimerFoxSM._TimerID == 1)
  {
   TimerFoxSM._timer.cancel();
   TimerFoxSM._TimerID = 0;
  }
  TimerFoxSM._Seconds = 0;
  TimerFoxSM._Second = 0;
  if (resetTimer)
  {
   TimerFoxSM._SetTimer(0);
   pImg.tooltipText = TimerFoxSM._ToolTip;
  }
 },
 init: function()
 {
  window.removeEventListener("load", TimerFoxSM.init, false);
  TimerFoxSM._UpdatePrefs();
  if (!TimerFoxSM._checkInstalled())
   setTimeout(TimerFoxSM._addToolbar, 0);
  setTimeout(TimerFoxSM._runModern, 0);
 },
 _addToolbar: function()
 {
  const kToolBarID = "nav-bar";
  const kTBItemID = "timer-button";
  var tbElem = document.getElementById(kToolBarID);
  var tbItemElem = document.getElementById(kTBItemID);
  if (tbElem && !tbItemElem)
  {
   var newSet = tbElem.currentSet + "," + kTBItemID;
   tbElem.setAttribute("currentset", newSet);
   tbElem.currentSet = newSet;
   document.persist(kToolBarID, "currentset");
   try
   {
    BrowserToolboxCustomizeDone(true);
   }
   catch(e){}
  }
 },
 _checkInstalled: function()
 {
  var btnInstalled = TimerFoxSM._GetBoolPref("install", false);
  if (!btnInstalled)
   TimerFoxSM._SetBoolPref("install", true);
  return btnInstalled;
 },
 _runModern: function()
 {
  if (TimerFoxSM._detectModern())
   TimerFoxSM._appendModern();
 },
 _detectModern: function()
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  if (prefs.prefHasUserValue("general.skins.selectedSkin"))
  {
   if (prefs.getCharPref("general.skins.selectedSkin") == "modern/1.0")
    return true;
  }
  return false;
 },
 _appendModern: function()
 {
  var tbItemElem = document.getElementById("timer-button");
  if (tbItemElem)
   tbItemElem.className += " modern";
 },
 _ConvertTime: function(lSec)
 {
  var lMin;
  var lHour;
  lHour = Math.floor(lSec / 3600);
  lSec = lSec % 3600;
  lMin = Math.floor(lSec / 60);
  lSec = lSec % 60;
  if (lHour > 0)
   return (lHour + " h " + lMin + " m " + lSec + " s");
  else if (lMin > 0)
   return (lMin + " m " + lSec + " s ");
  else
   return (lSec + " s");
 },
 _SetTimer: function(lVal)
 {
  document.getElementById("timer-button").className = "toolbarbutton-1 chromeclass-toolbar-additional timer" + lVal;
  TimerFoxSM._runModern();
 },
 _UpdatePrefs: function()
 {
  TimerFoxSM._UpdatePref("hour");
  TimerFoxSM._UpdatePref("minute");
  TimerFoxSM._UpdatePref("second");
  TimerFoxSM._UpdatePref("message");
  TimerFoxSM._UpdatePref("customAudio");
  TimerFoxSM._UpdatePref("audio");
  TimerFoxSM._UpdatePref("install");
  TimerFoxSM._UpdatePref("top");
  TimerFoxSM._UpdatePref("left");
 },
 _UpdatePref: function(prefName)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  if (prefs.prefHasUserValue("timerfox." + prefName))
  {
   var prefType = prefs.getPrefType("timerfox." + prefName)
   if (prefType == prefs.PREF_STRING)
   {
    var prefVal = prefs.getCharPref("timerfox." + prefName);
    prefs.setCharPref("extensions.timerfox." + prefName, prefVal);
    prefs.clearUserPref("timerfox." + prefName);
    return true;
   }
   else if (prefType == prefs.PREF_INT)
   {
    var prefVal = prefs.getIntPref("timerfox." + prefName);
    if (prefs.getPrefType("extensions.timerfox." + prefName) == prefs.PREF_BOOL)
    {
     if (prefVal == 1)
     {
      prefs.setBoolPref("extensions.timerfox." + prefName, true);
     }
     else
     {
      prefs.setBoolPref("extensions.timerfox." + prefName, false);
     }
    }
    else
    {
     prefs.setIntPref("extensions.timerfox." + prefName, prefVal);
    }
    prefs.clearUserPref("timerfox." + prefName);
    return true;
   }
   else if (prefType == prefs.PREF_BOOL)
   {
    var prefVal = prefs.getBoolPref("timerfox." + prefName);
    prefs.setBoolPref("extensions.timerfox." + prefName, prefVal);
    prefs.clearUserPref("timerfox." + prefName);
    return true;
   }
  }
  return false;
 },
 _SetBoolPref: function(prefName, prefVal)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefName = "extensions.timerfox." + prefName;
  prefs.setBoolPref(prefName, prefVal);
 },
 _GetIntPref: function(prefName, defVal)
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
 },
 _GetBoolPref: function(prefName, defVal)
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
 }
};
window.addEventListener("load", TimerFoxSM.init, false);
