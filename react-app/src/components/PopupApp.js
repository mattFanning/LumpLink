import React, { useState, useRef, useEffect } from "react";
import './PopupApp.css';

function PopupApp() {
  //state
  const [isActive, setIsActive] = useState(false);

  const CURSORS = useRef("/cursors");
  const cursorPath = () => {return CURSORS.current};
  
  //Initial setup of isActive.
  useEffect(()=>{
    /* eslint-disable */
      //This code will only make sense to the chrome extension after webpacking.
      chrome.storage.local.get("activated", result => {setIsActive(result.activated)});
    /* eslint-enable */
  });
  
  //OnClick Handlers
  async function activate(state) {
    /* eslint-disable */
      //This code will only make sense to the chrome extension after webpacking.
      await chrome.storage.local.set({ activated: state });
      chrome.runtime.sendMessage({ message: "getURL", args: [`${cursorPath()}/arrow4.png`] }, (path) => {
        const cursorPath = `url(${path})`;
        document.body.style.setProperty("--cursorVal", cursorPath);
        document.body.classList.add('lumplink-active');
      });
    /* eslint-enable */
  }

  async function update(updateObj) {
    if(updateObj.color) {  
      const color = getComputedStyle(document.body).getPropertyValue(updateObj.color);
      console.log(`updating the color to ${color}`);
      /* eslint-disable */
        //This code will only make sense to the chrome extension after webpacking.
        await chrome.storage.local.set({ color: color });
      /* eslint-enable */
    }
  }

  return (
    <div className="popup-body-div">
      <hgroup class="popup-info-hgroup">
	      <h1>LumpLink!</h1>
	      <p>pick color and press <b>activate</b></p>
      </hgroup>
      <ul class="color-picker-list">
        <li class="color-picker-li"><input type="button" class="color-button red" onClick={() => update({color: "--red"})}></input></li>
        <li class="color-picker-li"><input type="button" class="color-button green" onClick={() => update({color: "--green"})}></input></li>
        <li class="color-picker-li"><input type="button" class="color-button blue" onClick={() => update({color: "--blue"})}></input></li>
        <li class="color-picker-li"><input type="button" class="color-button black" onClick={() => update({color: "--black"})}></input></li>
        {/* <li class="color-picker-li"><input type="color" class="color-button"value="#000000" onClick={() => update({color: "#000000"})}></input></li> */}
      </ul>
      <ul class="color-picker-list">
        <li class="color-picker-li"><input type="button" class="execute-button" value="activate" onClick={() => activate(true)}></input></li>
        <li class="color-picker-li"><input type="button" class="execute-button" value="deactivate" onClick={() => activate(false)}></input></li>
      </ul>  
    </div>
  );
}


export default PopupApp;
