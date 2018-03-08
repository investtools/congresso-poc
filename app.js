function App() {
  this.brazilianCitizen = function() {
    return window.document.querySelector("#brazilianCitizen").checked
  }
  this.cpf = function() {
    return window.document.querySelector("#cpf").value
  }
  this.publicKey = function() {
    if (!localStorage.getItem("publicKey")) {
      localStorage.setItem("publicKey", this.generateEthKey().address);  
    }

    return localStorage.getItem("publicKey")
  }

  this.lawProject = function() {
    return window.document.querySelector("#lawProject").value
  }

  this.comment = function() {
    return window.document.querySelector("#comment").value
  }

  this.vote = function() {
    if (document.querySelector('input[name="vote"]:checked').value === "true")
      return true
    else
      return false
  }

  this.generateEthKey = function() {
    var privateKey = "10f2"
    var password = "123"
    var dk = keythereum.create()

    var options = {
      kdf: "pbkdf2",
      cipher: "aes-128-ctr",
      kdfparams: {
        c: 262144,
        dklen: 32,
        prf: "hmac-sha256"
      }
    };
    
    var keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options)
    return keyObject
  }
  
  this.authorize = function() {
    console.log("autorizando a chave....")
    console.log(this.cpf())
    console.log(this.brazilianCitizen())
    console.log(this.publicKey())
  }

  this.sendVote = function() {
    console.log("enviando o voto...")
    console.log(this.lawProject())
    console.log(this.comment())
    console.log(this.vote()) 
  } 

  this.revoke = function() {
    console.log("Revogando a chave")
    console.log(this.publicKey())
  } 
}

App = new App()