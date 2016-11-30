<template>
  <div id="app">
    <img src="./assets/logo.png">
    <h2>O que você quer aprender no próximo domingo (4 de dezembro)</h2>
    <ul>
      <li><a href="https://www.webdevbr.com.br" target="_blank">site</a></li>
      <li><a href="https://www.facebook.com/webdevbrasil/" target="_blank">facebook</a></li>
      <li><a href="https://github.com/webdevbr" target="_blank">github</a></li>
    </ul>

    <div v-if="!isLogged">
      <h3>Login com:</h3>
      <p><a href="" @click.prevent="login('facebook')" class="btn">Facebook</a></p>
      <p><a href="" @click.prevent="login('google')" class="btn">Google</a></p>
      <p><a href="" @click.prevent="login('github')" class="btn">GitHub</a></p>
    </div>

    <div v-else>
      <div class="user-box">
        <p>Olá {{isLogged.displayName}}</p>
        <p><img :src="isLogged.photoURL" alt=""></p>
        <p><a href="" @click.prevent="logout()">deslogar</a></p>
      </div>

      <input type="text" v-model.trim="add_question" @keyup.enter="add()" placeholder="Adicione uma nova sugestão..." autofocus>
      <nav>
        <ul>
          <li v-for="(o, index) in questions"><a href="" @click.prevent="vote(o['.key'])">{{ o.label }} <span>{{ o.voting }} votos</span></a></li>
        </ul>
      </nav>
    </div>

  </div>
</template>

<script>
import {Firebase} from './Firebase';
import alertify from 'alertifyjs';

require('../node_modules/alertifyjs/build/css/alertify.css');
require('../node_modules/alertifyjs/build/css/themes/default.rtl.min.css');

let firebase = new Firebase;
let db = firebase.start();

export default {
  name: 'app',
  firebase: {
    questions: db.ref('questions')
  },
  data () {
    return {
      add_question: null,
      isLogged: false
    }
  },
  created() {
    firebase.isLogged().then((user)=>{
      this.isLogged = user;
    })
  },
  methods: {
    add: function() {
      console.log(!this.add_question);
      if (!this.add_question) {
        alertify.warning('O campo está vazio!');
        return;
      }
      this.$firebaseRefs.questions.push({
        label: this.add_question,
        voting: 1,
        users: [this.isLogged.email]
      })
      this.add_question = '';
      alertify.success('Sugestão adicionada!');
    },
    vote: function(index) {
      this.$firebaseRefs.questions.child(index).once('value').then((result)=>{
        let checkVote = false;

        result.val().users.forEach((item)=>{
          if (item == this.isLogged.email) {
            checkVote = true;
          }
        })

        if (checkVote) {
          alertify.error('Você já votou neste item!');
          return;
        }

        let data = {};
        data[index+'/voting'] = result.val().voting + 1;

        let users = result.val().users;
        users.push(this.isLogged.email);
        data[index+'/users'] = users;

        this.$firebaseRefs.questions.update(data);

        alertify.success('Voto confirmado!');
      })
    },
    login: function(provider) {
      firebase.login(provider).then((result) => {
        this.isLogged = result.user;
        this.$bindAsArray('questions', db.ref('questions'));;
      });
    },
    logout: function() {
      firebase.logout();
      this.isLogged = false;
    }
  }
}
</script>

<style>
body {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

nav ul li {
  display: block;
  padding: 10px 0;
  text-align: center;
}

nav ul li a, .btn {
  display: inline-block;
  max-width: 400px;
  width: 100%;
  text-align: center;
  background-color: #e74c3c;
  color: #fff;
  padding: 10px;
  text-decoration: none;
  border-radius: 4px;
  border: 1px solid #c0392b;
}

nav ul li a:hover, .btn:hover {
  background-color: #c0392b;
  color: #fff;
}

nav ul li a span {
  display: inline-block;
  background-color: #fff;
  color: #e74c3c;
  padding: 5px;
  border-radius: 4px;
}

a {
  color: #e74c3c;
}

a:hover {
  text-decoration: none;
  transition: all .3s linear;
}

input {
  padding: 10px 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 300px;
}

.user-box {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 10px 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
  max-width: 200px;
}

.user-box img {
  width: 100%;
  height: auto;
}
</style>
