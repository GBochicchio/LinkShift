// Funzione per aggiornare la lista delle regole salvate
function updateRulesList() {
  chrome.storage.local.get(["rules"], function(result) {
    const rulesList = document.getElementById("rulesList");
    rulesList.innerHTML = "";

    if (result.rules) {
      result.rules.forEach((rule, index) => {
        const listItem = document.createElement("div");
        listItem.className = "rule-item";

        const ruleText = document.createElement("span");
        ruleText.textContent = `Dominio: ${rule.domain} -> Reindirizzamento: ${rule.redirect}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Elimina";
        deleteButton.addEventListener("click", function() {
          deleteRule(index);
        });

        listItem.appendChild(ruleText);
        listItem.appendChild(deleteButton);
        rulesList.appendChild(listItem);
      });
    }
  });
}

// Funzione per salvare una nuova regola
document.getElementById("saveRule").addEventListener("click", function() {
  const domain = document.getElementById("domain").value;
  const redirect = document.getElementById("redirect").value;

  if (domain && redirect) {
    chrome.storage.local.get(["rules"], function(result) {
      const rules = result.rules || [];
      rules.push({ domain, redirect });
      chrome.storage.local.set({ rules }, function() {
        updateRulesList();
      });
    });
  }
});

// Funzione per eliminare una regola
function deleteRule(index) {
  chrome.storage.local.get(["rules"], function(result) {
    const rules = result.rules || [];
    rules.splice(index, 1);
    chrome.storage.local.set({ rules }, function() {
      updateRulesList();
    });
  });
}

// Gestione dell'opzione "redirect alla home"
document.getElementById("defaultRedirect").addEventListener("change", function() {
  const isChecked = document.getElementById("defaultRedirect").checked;
  chrome.storage.local.set({ defaultRedirect: isChecked });
});

// Caricare il valore dell'opzione salvata
chrome.storage.local.get(["defaultRedirect"], function(result) {
  if (result.defaultRedirect !== undefined) {
    document.getElementById("defaultRedirect").checked = result.defaultRedirect;
  }
});

// Aggiorna la lista delle regole quando si carica la pagina
updateRulesList();
