import React, { useState, useCallback, useEffect } from "react";
import './ContentApp.css';

function ContentApp() {
  //states
  const [activated, setActivated] = useState(false);
  const [mouse, setMouse] = useState({
    state: ""  //"Mouse Down", "Mouse Up"
  });
  const [selectionBox, setSelectionBox] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0
  });


  //useCallback
  const processSelection = useCallback(() => {
    const selector = document.getElementById("lumplink-selector");
    if(selector === null) {
        return;
    }
    const selectorRect = selector.getBoundingClientRect();

    const allLinks = Array.from( document.getElementsByTagName("a") );
    const selectedLinks = allLinks.filter(a => {
        if(boundingRectContainsElement(selectorRect, a) ) {
            return true;
        }
        return false;
    });
    
    console.log(`Selected Links: %c[`, "color:green");
    selectedLinks.forEach(l => {
      console.log(`\t%c${l},`, "color:green");
    });
    console.log(`%c]`, "color:green");

    //TODO: send link array to background for handling.
  },[]);

  const mouseHandler = useCallback((event) => {
    if(activated) {
      switch(event.type) {
        case "mousedown" :
          if(event.preventDefault) {
            event.preventDefault();
          }
          setMouse({state: "Mouse Down"});
          setSelectionBox({startX: event.pageX, startY: event.pageY});
          break;
        case "mouseup" :
          if(mouse.state === "Mouse Down") {
            setMouse({state: "Mouse Up"});
            processSelection();
          }
          break;
        case "mousemove" :
          if(mouse.state === "Mouse Down") {
            setSelectionBox({...selectionBox, endX: event.pageX, endY: event.pageY});
          }
          break;
        default :
          console.log(`Invaild event type: %c${event.type}`, "color:red");
          break;
      }
    }
  },[activated, mouse.state, processSelection, selectionBox]);


  //useEffect's
  useEffect(() => {
    //componentDidMount
    
    //This code will only make sense to the chrome extension after webpacking.
    /* eslint-disable */
      chrome.storage.local.get("activated", result => {
        setActivated(result.activated);
      });

      chrome.storage.onChanged.addListener((changes, areaName)=> {  //changes: object, areaName: string
        if(changes.activated) {
          //console.log(`CS picked up activated update of: %c${changes.activated.newValue}`, "color:green");
          setActivated(changes.activated.newValue);
        }
      });
    /* eslint-enable */
  }, []);

  useEffect(() => {
    //componentDidMount/Update
    document.body.addEventListener("mousedown", mouseHandler);
    document.body.addEventListener("mouseup", mouseHandler);
    document.body.addEventListener("mousemove", mouseHandler);
    return () => {
      // componentWillUnmount
      document.body.removeEventListener("mousedown", mouseHandler);
      document.body.removeEventListener("mouseup", mouseHandler);
      document.body.removeEventListener("mousemove", mouseHandler);
    }  
  }, [mouseHandler]);

  useEffect(() => {
    if(activated) {
      //This code will only make sense to the chrome extension after webpacking.
      /* eslint-disable */
        chrome.runtime.sendMessage({ message: "getURL", args: ['/contentScript/arrow4.png'] }, (path) => {
          const cursorPath = `url(${path})`;
          document.body.style.setProperty("--cursorVal", cursorPath);
          document.body.classList.add('lumplink-active');
        });
      /* eslint-enable */
    }
    else {
      document.body.classList.remove('lumplink-active');
    }
  }, [activated]);


  //helpers
  const boundingRectContainsElement = (rect, elem) => {
    const eRect = elem.getBoundingClientRect();
    return rect.x <= eRect.x && eRect.x <= rect.x + rect.width &&
           rect.y <= eRect.y && eRect.y <= rect.y + rect.height;
  };

  function calcSelectorStyle() {    
    const {startX, endX, startY, endY} = selectionBox;
    let top, left, height, width;
    switch(true) {
      case startX < endX && startY < endY:
        /* x increases, y increases */
        top = startY; left = startX; height = endY - startY; width = endX - startX;
        break;
      case startX < endX && startY >= endY:
        /* x increases, y decreases */
        top = endY; left = startX; height = startY - endY; width = endX - startX;
        break;
      case startX >= endX && startY < endY:
        /* x decreases, y increases */
        top = startY; left = endX; height = endY - startY; width = startX - endX;
        break;
      default :  //startX >= endX && startY >= endY
        /* x decreases, y decreases */
        top = endY; left = endX; height = startY - endY; width = startX - endX;
        break; 
    }

    return {
      top: top + "px",
      left: left + "px",
      height: height + "px",
      width: width + "px"
    }
  };

  
  //render
  if (activated && mouse.state === "Mouse Down") {
    const s = calcSelectorStyle();
    return(
      <div id="lumplink-selector" className="lumplink-selector" style={
        {top: s.top, left: s.left, height: s.height, width: s.width}}></div>
    );
  }
  return;  //do nothing unless activated
}


export default ContentApp;