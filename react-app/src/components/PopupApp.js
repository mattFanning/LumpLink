import './PopupApp.css';

function PopupApp() {
  function setActive(state) {
    //This code will only make sense to the chrome extension after webpacking.
    /* eslint-disable */
      chrome.storage.local.set({ activated: state });
      
      // chrome.tabs.query({ currentWindow: true, active: true }, tabs => {
      //   chrome.tabs.reload();
      // });
      
    /* eslint-enable */
  }

  return (
    <div className="popup-body-div">
      <hgroup class="popup-info-hgroup">
	      <h1>LumpLink!</h1>
	      <p>pick color and press <b>activate</b></p>
      </hgroup>
      <ul class="color-picker-list">
        <li class="color-picker-li"><input type="button" class="color-button red"></input></li>
        <li class="color-picker-li"><input type="button" class="color-button green"></input></li>
        <li class="color-picker-li"><input type="button" class="color-button blue"></input></li>
        <li class="color-picker-li"><input type="color" class="color-button"value="#000000"></input></li>
      </ul>
      <ul class="color-picker-list">
        <li class="color-picker-li"><input type="button" class="execute-button" value="activate" onClick={() => setActive(true)}></input></li>
        <li class="color-picker-li"><input type="button" class="execute-button" value="deActivate" onClick={() => setActive(false)}></input></li>
      </ul>  
    </div>
  );
}


export default PopupApp;
