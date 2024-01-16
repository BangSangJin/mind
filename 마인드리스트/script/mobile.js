
$(document).ready(function(){
    let vh = 0;

useEffect(() => {
  vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
}, []);
});