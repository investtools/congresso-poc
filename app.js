function App() {
  this.brazilianCitizen = function() {
    return window.document.querySelector("#brazilianCitizen").checked
  }
  this.cpf = function() {
    return window.document.querySelector("#cpf").value
  }

  this.getKeyStore = function(callback) {
    if (!store.get('keyStore')) {
      this.generateKeyStore(function(ks){
        callback(lightwallet.keystore.deserialize(store.get('keyStore')))
      })
    }
    else {
      callback(lightwallet.keystore.deserialize(store.get('keyStore')));
    }
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

  this.generateKeyStore = function(callback) {
    var password = "123456";
    var seed = lightwallet.keystore.generateRandomSeed();

    lightwallet.keystore.createVault({
        password: password,
        seedPhrase: seed,
        hdPathString: "m/0'/0'/0'"
    }, function (err, ks) {
        console.log("dentro da criacao do vault", ks)
        ks.keyFromPassword(password, function (err, pwDerivedKey) {
            
            store.set('pwDerivedKey',pwDerivedKey)

            if (!ks.isDerivedKeyCorrect(pwDerivedKey)) {
                throw new Error("Incorrect derived key!");
            }
            try {
                ks.generateNewAddress(pwDerivedKey, 1);
            } catch (err) {
                console.log(err);
                console.trace();
            }
            serializedKs = ks.serialize()
            store.set('keyStore', serializedKs)
            callback(serializedKs)
        });
    });
    
  }
  
  this.authorize = function() {
    console.log("autorizando a chave....")
    console.log(this.cpf())
    this.getKeyStore(function(ks){
      var address = ks.addresses[0]
      var authorization = {cpf: this.cpf, address: address}
      //Nesse momento vai rolar o POST para api de autorizacao
    })
    
  }

  this.sendVote = function() {
    console.log("enviando o voto...")
    var message = {lawProject: this.lawProject(), comment: this.comment(), vote: this.vote()}

    this.getKeyStore(function(ks){
      var address = ks.addresses[0]
      ks.keyFromPassword("123456", function (err, pwDerivedKey) {
        var signedMessage = lightwallet.signing.signMsg(ks, pwDerivedKey, JSON.stringify(message), address, ks.hdPathString)
        console.log(signedMessage)
        //Nesse momento devemos fazer o POST pra api de votos com o campo message + signedMessage
      });
    })
  } 

  this.revoke = function() {
    console.log("Revogando a chave")
    console.log(this.publicKey())
  } 
}

App = new App()