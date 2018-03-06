function App() {
  
  localStorage.setItem("publicKey", "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABAQCp/SNDIPoEQTly7FfrtNTg6U3od/9OBAjn+U9q7gSylGYEtTyIVH00CBXyCR4CIZDXk4WXdTc+/Fp4UpZ11G7IxFCcrW3gcZcFQ5fUrPJibVUitd6Lj+x+aWz5GxHiEv03MkLbPkcT6s2RqiPVKFy694wgcOrsCi4NoD6wB8PJDQTjd7p5lsQrYu9CGKjCQnR0UKn53bL8A22bKyegNkxu6wEtURh9QozvbIqGdahSNg7Knd7Faq4dnsNbUoP3Z+ei1AenZ9Tfa5+Gdj/54BtfouTWJPCLWpLh36kb0dMKThZeWbQ03YQ8u/qWKFBc2fiFIpmlHcEziGfP8A5i4EfD akelmanson@MacBook-Air-de-Andre.local");  
  this.brazilianCitizen = function() {
    return window.document.querySelector("#brazilianCitizen").checked
  }
  this.cpf = function() {
    return window.document.querySelector("#cpf").value
  }
  this.publicKey = function() {
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