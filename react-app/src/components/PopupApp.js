import React, { useState, useRef, useEffect } from "react";
import './PopupApp.css';

function PopupApp() {
  //state
  const [isActive, setIsActive] = useState(false);
  const [colorInfo, setColorInfo] = useState({id: "red_btn", color: "rgba(255,0,0,0.6)"});

  const CURSORS = useRef("/cursors");
  const cursorPath = () => {return CURSORS.current};
  
  /*
   * Initial setup from chrome.storage.local
   */
  useEffect(()=> {
    /* eslint-disable */
      //This code will only make sense to the chrome extension after webpacking.
      chrome.storage.local.get("activated", result => {setIsActive(result.activated)});
      chrome.storage.local.get("colorInfo", result => {setColorInfo(result.colorInfo)});
    /* eslint-enable */
  }, []);

  /**
   * isActive useEffect - updates storage.
   */
  useEffect(()=> {
    /* eslint-disable */
      //This code will only make sense to the chrome extension after webpacking.
      chrome.storage.local.set({ activated: isActive });
      
      if(isActive) {
        chrome.runtime.sendMessage({ message: "getURL", args: [`${cursorPath()}/arrow4.png`] }, (path) => {
          const cursorPath = `url(${path})`;
          document.body.style.setProperty("--cursorVal", cursorPath);
        });
        document.body.classList.add('lumplink-active');
      }
      else {
        document.body.classList.remove('lumplink-active');
      }
    /* eslint-enable */
  }, [isActive]);
  
  /**
   * colorInfo useEffect - updates storage.
   */
  useEffect(()=> {
    /* eslint-disable */
      //This code will only make sense to the chrome extension after webpacking.
      chrome.storage.local.set({ colorInfo: colorInfo});
    /* eslint-enable */
  }, [colorInfo]);
  
  /**
   * OnClick Handlers
   */
  async function activate(state) {
    setIsActive(state);
  }

  async function update(updateObj) {  
    const color = getComputedStyle(document.body).getPropertyValue(updateObj.cssColorVar);
    const colorPayload = {id: updateObj.id, color: color};
    setColorInfo(colorPayload);
  }

  /**
   * sub components
   */
  function ColorSelectionList() {
    return (
      <div class="popup-group-div">
        <p class="popup-p">pick selection box color</p>
        <ul class="popup-list">
          <ColorButtonListItem buttonId="red_btn" buttonColorClass="red" cssColorVar="--red"></ColorButtonListItem>
          <ColorButtonListItem buttonId="green_btn" buttonColorClass="green" cssColorVar="--green"></ColorButtonListItem>
          <ColorButtonListItem buttonId="blue_btn" buttonColorClass="blue" cssColorVar="--blue"></ColorButtonListItem>
          <ColorButtonListItem buttonId="black_btn" buttonColorClass="black" cssColorVar="--black"></ColorButtonListItem>
        </ul>
      </div>
    );
  }

  function ColorButtonListItem(props) {
    const buttonId = props.buttonId;
    const buttonColorClass = props.buttonColorClass;
    const cssColorVar = props.cssColorVar;
    
    let decorator = "";
    if(buttonId === colorInfo.id) {
      decorator = "highlighted";
    }

    const btnClasses = `color-button ${buttonColorClass} ${decorator}`
    return (
      <li class="popup-li">
          <input id={buttonId} type="button" class={btnClasses} onClick={() => 
            update({id: buttonId, cssColorVar: cssColorVar})}></input>
      </li>
    )
  }

  function ActivationList() {
    return (
      <div class="popup-group-div">
        <p class="popup-p">click <b>enabled</b> or <b>disabled</b></p>
        <ul class="popup-list">
          <ActivationButtonListItem label="enabled" activationValue={true}></ActivationButtonListItem>
          <ActivationButtonListItem label="disabled" activationValue={false}></ActivationButtonListItem>
        </ul>  
      </div>
    );
  }

  function ActivationButtonListItem(props) {
    const label = props.label;
    const activationValue = props.activationValue;
    let decorator = "";
    if(props.activationValue === isActive) {
      decorator = "highlighted";
    }
    
    const btnClasses = `execute-button ${decorator}`;
    return (
      <li class="popup-li">
        <input type="button" class={btnClasses} value={label} onClick={() => 
          activate(activationValue)}></input>
      </li>
    );
  }

  /**
   * main component
   */
  return (
    <div className="popup-body-div">
      <hgroup class="popup-info-hgroup">
	      <h1 class="popup-title">LumpLink!</h1>
      </hgroup>
      <ColorSelectionList></ColorSelectionList>
      <hr class="popup-hr"></hr>
      <ActivationList></ActivationList>
    </div>
  );
}


export default PopupApp;
