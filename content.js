
// const saveButton = document.getElementById('saveButton');
// const apiKeyInput = document.getElementById('apiKeyInput');

// saveButton.addEventListener('click', () => {
//   const key='APIKey';
//   const value = {name:apiKeyInput.value};
//   if (value) {
//     chrome.storage.local.set({key:value}, () => {
//       console.log("Saved");
//     });
//   }
// });


let isRequested = false;
document.addEventListener("keydown", function(event) {
  if (event.key === '`' && event.ctrlKey && !isRequested) {
    var selectedText = window.getSelection().toString();
    chrome.runtime.sendMessage({type: 'updateIcon', iconPath: 'orange.png'});
    console.log("doing");
    isRequested = true;

    // const key='APIKey';
    // chrome.storage.local.get([key], (apiKey) =>  {
      // console.log("apicatched:"+apiKey);
      fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer api_key`
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo',
          messages: [{
            role: 'user',
            content: selectedText
          }],
          temperature: 0.7
        })
      })
      .then(response => {
        chrome.runtime.sendMessage({type: 'updateIcon', iconPath: 'green.png'});
        return response.json();
      })
      .then(data => {
        var content = data.choices[0].message.content;
        navigator.clipboard.writeText(content);
        console.log(content);
        isRequested = false; 
      })
      .catch(error => {
        chrome.runtime.sendMessage({type: 'updateIcon', iconPath: 'red.png'});
        console.error(error);
        isRequested = false;
      });
    // });
  }
});
