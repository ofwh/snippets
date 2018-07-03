/**
 * HTTPS Downgrade
 * click fiddler menu 'Rules' > 'Customize Rules...'
 */

// add definition
public static RulesOption("&HTTPS Degrade");
var m_bHTTPSDegrade: boolean = false;

// add code in 'onBeforeRequest' function
if (m_bHTTPSDegrade) { 
  var hosts = ["cdn.vip.qq.com", "*.gtimg.cn", "qc.vip.qq.com", "comic.vip.qq.com", "a.qq.com"]; 
  var isExistInHosts = false; 
  for (var i = 0; i < hosts.length; i ++) { 
    isExistInHosts = oSession.hostname.match(new RegExp('^' + hosts[i] + '$')); 
    if (isExistInHosts) { 
      break; 
    } 
  } 
  if (isExistInHosts) 
  { 
    if (oSession.HTTPMethodIs('CONNECT') && oSession.port === 443) 
    {  
      oSession['x-replywithtunnel'] = 'FakeTunnel'; 
      return; 
    } 
    if (oSession.isHTTPS) 
    { 
      oSession.oRequest["x-client-proto"] = "https"; 
      if (oSession["x-overrideHost"] && oSession["x-overrideHost"].IndexOf(':443') > -1) { 
        oSession["x-overrideHost"] = oSession["x-overrideHost"].Replace(':443', ':80'); 
      } 
      oSession.fullUrl = oSession.fullUrl.Replace("https://", "http://"); 
      oSession.port = 80; 
    } 
  } 
}
