var TimerFox =
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
  if (document.getElementById("timer-button").className == "toolbarbutton-1 chromeclass-toolbar-additional timer0")
   TimerFox._StartTimer();
  else if (document.getElementById("timer-button").className == "toolbarbutton-1 chromeclass-toolbar-additional timerA")
  {
   if (TimerFox._mAPlayer != null && !TimerFox._mAPlayer.ended)
   {
    TimerFox._mAPlayer.pause();
    TimerFox._mAPlayer = null;
   }
   TimerFox._SetTimer(0);
   document.getElementById("timer-button").tooltipText = TimerFox._ToolTip;
  }
  else
   TimerFox._StopTimer(true);
 },
 _StartTimer: function()
 {
  TimerFox._Second = 0;
  var pImg    = document.getElementById("timer-button");
  var retVals = { dHr:0, dMn:0, dSc:0, sMsg:'', bAud:false, sAud:''};
  var wnTop   = TimerFox._GetIntPref("top");
  if ((wnTop > screen.height) || (wnTop < 0))
  {
   wnTop = 320;
  }
  var wnLeft  = TimerFox._GetIntPref("left");
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
  TimerFox._Message = retVals.sMsg;
  TimerFox._bAudio  = retVals.bAud;
  TimerFox._sAudio  = retVals.sAud;
  TimerFox._Seconds = tHr+tMn+tSc;
  if (TimerFox._Seconds > 0)
  {
   TimerFox._Second = 0;
   TimerFox._timer.initWithCallback(TimerFox.UpdateTimer, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
   TimerFox._TimerID = 1;
   TimerFox._SetTimer(1);
   TimerFox._ToolTip = pImg.tooltipText;
  }
  else
  {
   TimerFox._ToolTip = pImg.tooltipText;
   TimerFox._StopTimer(true);
  }
 },
 UpdateTimer:
 {
  notify: function(timer)
  {
   TimerFox._timer.cancel();
   var pImg = document.getElementById("timer-button");
   TimerFox._Second++;
   var tLeft = TimerFox._Seconds - TimerFox._Second;
   if (tLeft > 0)
   {
    var pLeft = Math.floor(TimerFox._Second / TimerFox._Seconds * 8 + 1);
    TimerFox._SetTimer(pLeft);
    pImg.tooltipText = TimerFox._ConvertTime(TimerFox._Seconds - TimerFox._Second);
    TimerFox._timer.initWithCallback(TimerFox.UpdateTimer, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
   }
   else
   {
    TimerFox._SetTimer(9);
    var simpleBeep = 0;
    if (typeof Audio == "undefined")
    {
     simpleBeep = 1;
    }
    if (!TimerFox._bAudio)
    {
     simpleBeep = 1;
    }
    if (simpleBeep == 0)
    {
     try
     {
      TimerFox._mAPlayer = new Audio(TimerFox._sAudio);
      TimerFox._mAPlayer.onerror = function()
      {
       TimerFox._SetTimer(0);
       document.getElementById("timer-button").tooltipText = TimerFox._ToolTip;
       var mPlayer = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
       mPlayer.init();
       mPlayer.beep();
      };
      TimerFox._SetTimer('A');
      document.getElementById("timer-button").tooltipText = decodeURIComponent('%E2%99%AB');
      TimerFox._mAPlayer.play();
      TimerFox._mAPlayer.onended = function()
      {
       TimerFox._SetTimer(0);
       document.getElementById("timer-button").tooltipText = TimerFox._ToolTip;
       TimerFox._mAPlayer = null;
      };
     }
     catch(e)
     {
      TimerFox._SetTimer(0);
      document.getElementById("timer-button").tooltipText = TimerFox._ToolTip;
      simpleBeep = 1;
     }
    }
    if (simpleBeep == 1)
    {
     var mPlayer = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
     mPlayer.init();
     mPlayer.beep();
    }
    alert(TimerFox._Message);
    if (simpleBeep == 1)
     TimerFox._StopTimer(true);
    else
     TimerFox._StopTimer(false);
   }
  }
 },
 _StopTimer: function(resetTimer)
 {
  var pImg = document.getElementById("timer-button");
  if(TimerFox._TimerID == 1)
  {
   TimerFox._timer.cancel();
   TimerFox._TimerID = 0;
  }
  TimerFox._Seconds = 0;
  TimerFox._Second = 0;
  if (resetTimer)
  {
   TimerFox._SetTimer(0);
   pImg.tooltipText = TimerFox._ToolTip;
  }
 },
 init: function()
 {
  window.removeEventListener("load", TimerFox.init, false);
  TimerFox._UpdatePrefs();
  if (!TimerFox._checkInstalled())
   setTimeout(TimerFox._addToolbar, 0);
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
  var btnInstalled = TimerFox._GetBoolPref("install", false);
  if (!btnInstalled)
   TimerFox._SetBoolPref("install", true);
  return btnInstalled;
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
 },
 _UpdatePrefs: function()
 {
  TimerFox._UpdatePref("hour");
  TimerFox._UpdatePref("minute");
  TimerFox._UpdatePref("second");
  TimerFox._UpdatePref("message");
  TimerFox._UpdatePref("customAudio");
  TimerFox._UpdatePref("audio");
  TimerFox._UpdatePref("install");
  TimerFox._UpdatePref("top");
  TimerFox._UpdatePref("left");
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
window.addEventListener("load", TimerFox.init, false);
