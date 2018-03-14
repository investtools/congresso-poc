function App() {

  this.server = function() {
    return axios.create({
      baseURL: 'http://localhost:3333/api/v1'
    });
  }

  this.buildLawProjects = function() {
    this.server().get('/law_projects')
      .then(function (response) {
        selectElement = document.querySelector("#lawProject")
        for(i=0; i<=response.data.length; i++) {
          console.log(response.data[i])
          var opt = document.createElement('option');
          opt.value = response.data[i].id;
          opt.innerHTML = response.data[i].title;
          selectElement.appendChild(opt)
        }
      })
      .catch(function (error) {
        if (error.response) {
          toastr.error(error.response.data.msg[0])
        }
      });
  }

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

  this.address = function() {
    return window.document.querySelector("#address").value
  }

  this.vote = function() {
    if (document.querySelector('input[name="vote"]:checked') == null) {
      return null
    }
    else if (document.querySelector('input[name="vote"]:checked').value === "true")
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

    that = this
    
    if ((this.cpf() == undefined || this.cpf().length == 0) || this.brazilianCitizen() == false)
      toastr.error("Preencha todos os campos")
    else {
      this.getKeyStore(function(ks){
        var address = ks.addresses[0]
        var authorization = {cpf: that.cpf(), address: address}
        
        that.server().post('/authorizations', authorization)
          .then(function (response) {
            toastr.success('Chave autorizada com sucesso!')
          })
          .catch(function (error) {
            if (error.response) {
              toastr.error(error.response.data.msg[0])
            }
          });
      })
    }
  }

  this.sendVote = function() {

    if (this.lawProject() == undefined || this.vote() == null)
      toastr.error("Preencha todos os campos obrigatórios")
    else {
      var vote = {law_project_id: this.lawProject(), comment: this.comment(), vote_choice: this.vote()}

      that = this

      this.getKeyStore(function(ks){
        var address = ks.addresses[0]
        ks.keyFromPassword("123456", function (err, pwDerivedKey) {
          var signedMessage = lightwallet.signing.signMsg(ks, pwDerivedKey, JSON.stringify(vote), address, ks.hdPathString)
          console.log(signedMessage)

          vote.address = address
          vote.signed_message = JSON.stringify(signedMessage)

          that.server().post('/votes', vote)
            .then(function (response) {
              toastr.success('Voto registrado com sucesso!')
            })
            .catch(function (error) {
              if (error.response) {
                toastr.error(error.response.data.msg[0])
              }
            });
        });
      })
    }
  } 

  this.revoke = function() {
    console.log("Revogando a chave")

    var authorization = {address: this.address()}

    this.server().delete('/authorizations/'+this.address())
      .then(function (response) {
        store.remove('keyStore')
        toastr.success('Chave revogada com sucesso!')
      })
      .catch(function (error) {
        console.log(error)
        if (error.response) {
          toastr.error(error.response.data.msg[0])
        }
      });
  } 
}

App = new App()