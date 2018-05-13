if (!window.com) window.com = {};
if (!window.com.RealityRipple) window.com.RealityRipple = {};

window.com.RealityRipple.TimerFox = function()
{
 var pub  = {};
 var priv = {};

 priv.timer = Components.classes["@mozilla.org/timer;1"].createInstance(Components.interfaces.nsITimer);

 priv.Seconds  = 0;
 priv.Second   = 0;
 priv.TimerID  = 0;
 priv.Message  = 'The countdown is complete!';
 priv.bAudio   = false;
 priv.Audio    = '';
 priv.ToolTip  = '';
 priv.mAPlayer = null;

 pub.ToggleTimer = function()
 {
  if (document.getElementById("timer-button").className.indexOf("timer0") > -1)
   priv.StartTimer();
  else if (document.getElementById("timer-button").className.className.indexOf("timerA") > -1)
  {
   if (priv.mAPlayer != null && !priv.mAPlayer.ended)
   {
    priv.mAPlayer.pause();
    priv.mAPlayer = null;
   }
   priv.SetTimer(0);
   document.getElementById("timer-button").tooltipText = priv.ToolTip;
  }
  else
   priv.StopTimer(true);
 };

 priv.StartTimer = function()
 {
  priv.Second = 0;
  var pImg    = document.getElementById("timer-button");
  var retVals = { dHr:0, dMn:0, dSc:0, sMsg:'', bAud:false, sAud:''};
  var wnTop   = priv.GetIntPref("top");
  if ((wnTop > screen.height) || (wnTop < 0))
  {
   wnTop = 320;
  }
  var wnLeft  = priv.GetIntPref("left");
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
  priv.Message = retVals.sMsg;
  priv.bAudio  = retVals.bAud;
  priv.Audio   = retVals.sAud;
  priv.Seconds = tHr+tMn+tSc;
  if (priv.Seconds > 0)
  {
   priv.Second = 0;
   priv.timer.initWithCallback(priv.UpdateTimer, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
   priv.TimerID = 1;
   priv.SetTimer(1);
   priv.ToolTip = pImg.tooltipText;
  }
  else
  {
   priv.ToolTip = pImg.tooltipText;
   priv.StopTimer(true);
  }
 };

 priv.UpdateTimer = 
 {
  notify: function(timer)
  {
   priv.timer.cancel();
   var pImg = document.getElementById("timer-button");
   priv.Second++;
   var tLeft = priv.Seconds - priv.Second;
   if (tLeft > 0)
   {
    var pLeft = Math.floor(priv.Second / priv.Seconds * 8 + 1);
    priv.SetTimer(pLeft);
    pImg.tooltipText = priv.ConvertTime(priv.Seconds - priv.Second);
    priv.timer.initWithCallback(priv.UpdateTimer, 1000, Components.interfaces.nsITimer.TYPE_ONE_SHOT);
   }
   else
   {
    priv.SetTimer(9);
    var simpleBeep = 0;
    if (typeof Audio == "undefined")
    {
     simpleBeep = 1;
    }
    if (!priv.bAudio)
    {
     simpleBeep = 1;
    }
    if (simpleBeep == 0)
    {
     try
     {
      priv.mAPlayer = new Audio(priv.Audio);
      priv.mAPlayer.onerror = function()
      {
       var mPlayer = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
       mPlayer.init;
       mPlayer.beep();
      }
      priv.SetTimer('A');
      document.getElementById("timer-button").tooltipText = decodeURIComponent('%E2%99%AB');
      priv.mAPlayer.play();
      priv.mAPlayer.onended = function()
      {
       priv.SetTimer(0);
       document.getElementById("timer-button").tooltipText = priv.ToolTip;
       priv.mAPlayer = null;
      }
     }
     catch(e)
     {
      simpleBeep = 1;
     }
    }
    if (simpleBeep == 1)
    {
     var mPlayer = Components.classes["@mozilla.org/sound;1"].createInstance(Components.interfaces.nsISound);
     mPlayer.init;
     mPlayer.beep();
    }
    alert(priv.Message);
    if (simpleBeep == 1)
     priv.StopTimer(true);
    else
     priv.StopTimer(false);
   }
  }
 };

 priv.StopTimer = function(resetTimer)
 {
  var pImg = document.getElementById("timer-button");
  if(priv.TimerID == 1)
  {
   priv.timer.cancel();
   priv.TimerID = 0;
  }
  priv.Seconds = 0;
  priv.Second = 0;
  if (resetTimer)
  {
   priv.SetTimer(0);
   pImg.tooltipText = priv.ToolTip;
  }
 };

 priv.init = function()
 {
  window.removeEventListener("load", priv.init, false);
  priv.UpdatePrefs();
  if (!priv.checkInstalled())
   setTimeout(priv.addToolbar, 0);
  setTimeout(priv.runModern, 0);
 };

 priv.addToolbar = function()
 {
  const kToolBarID = "nav-bar";
  const kTBItemID = "timer-button";
  var tbElem = document.getElementById(kToolBarID);
  var tbItemElem = document.getElementById(kTBItemID);
  if (tbElem && tbItemElem)
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
 };

 priv.checkInstalled = function()
 {
  var btnInstalled = priv.GetBoolPref("install", false);
  if (!btnInstalled)
   priv.SetBoolPref("install", true);
  return btnInstalled;
 };

 priv.runModern = function()
 {
  if (priv.detectModern())
   priv.appendModern();
 }

 priv.detectModern = function()
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  if (prefs.prefHasUserValue("general.skins.selectedSkin"))
  {
   if (prefs.getCharPref("general.skins.selectedSkin") == "modern/1.0")
    return true;
  }
  return false;
 };

 priv.appendModern = function()
 {
  var tbItemElem = document.getElementById("timer-button");
  if (tbItemElem)
   tbItemElem.className += " modern";
 }

 priv.ConvertTime = function(lSec)
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
 };

 priv.SetTimer = function(lVal)
 {
  document.getElementById("timer-button").className = "toolbarbutton-1 chromeclass-toolbar-additional timer" + lVal;
  priv.runModern();
 };

 priv.UpdatePrefs = function()
 {
  priv.UpdatePref("hour");
  priv.UpdatePref("minute");
  priv.UpdatePref("second");
  priv.UpdatePref("message");
  priv.UpdatePref("customAudio");
  priv.UpdatePref("audio");
  priv.UpdatePref("install");
  priv.UpdatePref("top");
  priv.UpdatePref("left");
 }

 priv.UpdatePref = function(prefName)
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
 }

 priv.SetBoolPref = function(prefName, prefVal)
 {
  var prefs = Components.classes["@mozilla.org/preferences-service;1"].getService(Components.interfaces.nsIPrefBranch);
  prefName = "extensions.timerfox." + prefName;
  prefs.setBoolPref(prefName, prefVal);
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

 window.addEventListener("load", priv.init, false);
 return pub;
}();
