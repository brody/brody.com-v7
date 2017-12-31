document.onreadystatechange=function(){

  var date = new Date();
  var hour = date.getHours();

  if (hour > 17 || hour < 8) {
      document.body.className += ' ' + 'night';
  }

}
