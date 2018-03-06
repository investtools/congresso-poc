function handleLoad(e) {
  console.log('Loaded import: ' + e.target.href);
  var link = document.querySelector('link[rel="import"]');
  var content = link.import;
  var el = content.querySelector('.navbar');
  document.querySelector('#menu').appendChild(el.cloneNode(true));
}
function handleError(e) {
  console.log('Error loading import: ' + e.target.href);
}