// Global error handler for VEPA2
window.onerror = function(msg, url, line, col, err) {
  var e = document.createElement('div');
  e.style.cssText = 'position:fixed;top:0;left:0;right:0;z-index:9999;background:#f00;color:#fff;padding:12px;font-size:14px;font-family:monospace;word-break:break-all';
  e.textContent = 'ERROR: ' + msg + ' at ' + line + ':' + col;
  document.body.appendChild(e);
};
window.addEventListener('unhandledrejection', function(e) {
  var d = document.createElement('div');
  d.style.cssText = 'position:fixed;top:45px;left:0;right:0;z-index:9999;background:#f60;color:#fff;padding:12px;font-size:14px;font-family:monospace;word-break:break-all';
  d.textContent = 'PROMISE: ' + (e.reason && e.reason.message || String(e.reason));
  document.body.appendChild(d);
});
console.log('VEPA2 error handler installed');
