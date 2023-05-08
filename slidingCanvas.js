  function slideIn(target, duration=500){
    target.style.transitionProperty = 'width, margin, padding';
    target.style.transitionDuration = duration + 'ms';
    target.style.boxSizing = 'border-box';
    target.style.width = target.offsetWidth + 'px';
    target.offsetWidth;
    target.style.overflow = 'hidden';
    target.style.width = 0;
    target.style.paddingLeft = 0;
    target.style.paddingRight = 0;
    target.style.marginLeft = 0;
    target.style.marginRight = 0;
    window.setTimeout( () => {
      target.style.display = 'none';
      target.style.removeProperty('width');
      target.style.removeProperty('padding-left');
      target.style.removeProperty('padding-right');
      target.style.removeProperty('margin-left');
      target.style.removeProperty('margin-right');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
}


function slideOut(target, duration=500){
    target.style.removeProperty('display');
    let display = window.getComputedStyle(target).display;

    if (display === 'none')
      display = 'block';

    target.style.display = display;
    let width = target.offsetWidth;
    target.style.overflow = 'hidden';
    target.style.width = 0;
    target.style.paddingLeft = 0;
    target.style.paddingRight = 0;
    target.style.marginLeft = 0;
    target.style.marginRight = 0;
    target.offsetWidth;
    target.style.boxSizing = 'border-box';
    target.style.transitionProperty = "width, margin, padding";
    target.style.transitionDuration = duration + 'ms';
    target.style.width = width + 'px';
    target.style.removeProperty('padding-left');
    target.style.removeProperty('padding-right');
    target.style.removeProperty('margin-left');
    target.style.removeProperty('margin-right');
    window.setTimeout( () => {
      target.style.removeProperty('width');
      target.style.removeProperty('overflow');
      target.style.removeProperty('transition-duration');
      target.style.removeProperty('transition-property');
    }, duration);
}


function slideToggle(target, duration = 500){
    if (window.getComputedStyle(target).display === 'none') {
        return slideOut(target, duration);
    } else {
        return slideIn(target, duration);
    }
}
 
export { slideIn, slideOut, slideToggle };
