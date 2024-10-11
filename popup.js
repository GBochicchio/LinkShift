document.getElementById("redirect").addEventListener("click", function() {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    var currentUrl = new URL(tabs[0].url); // Ottieni l'hostname dall'URL corrente
    var hostname = currentUrl.hostname;

    chrome.storage.local.get(["rules"], function(result) {
      const rules = result.rules || [];
      let newUrl = "";

      // Cerca una regola che corrisponde al dominio corrente
      rules.forEach(function(rule) {
        if (hostname.includes(rule.domain)) {
          newUrl = rule.redirect;
        }
      });

      // Se esiste una regola, reindirizza
      if (newUrl !== "") {
        chrome.tabs.update(tabs[0].id, { url: newUrl });
      }
    });
  });
});
