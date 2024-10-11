chrome.action.onClicked.addListener((tab) => {
  const currentUrl = new URL(tab.url);
  const hostname = currentUrl.hostname;

  chrome.storage.local.get(["rules", "defaultRedirect"], function(result) {
    const rules = result.rules || [];
    let newUrl = "";

    // Cerca una regola che corrisponde al dominio corrente
    rules.forEach(function(rule) {
      if (hostname.includes(rule.domain)) {
        newUrl = rule.redirect;
      }
    });

    // Se non esiste una regola e il redirect alla home è attivato, fai il redirect alla home del dominio
    if (newUrl === "" && result.defaultRedirect) {
      newUrl = `${currentUrl.protocol}//${hostname}`;
    }

    // Se esiste un URL (regola o home), reindirizza all'URL appropriato
    if (newUrl !== "") {
      chrome.tabs.update(tab.id, { url: newUrl });
    }
  });
});
