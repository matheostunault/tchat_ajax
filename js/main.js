(function(window, $) {
	'use strict';

	//constante d'url de l'api
	const API_ROOT_url	= "http://greenvelvet.alwaysdata.net/kwick/api/";

	//constantes du formulaire de connection
	const $connection	= $("#connection");
	const $cnct_log		= $("#cnct_log");
	const $cnct_pswrd	= $("#cnct_pswrd");
	const $log_in 		= $("#log_in");
	
	//constantes du formulaire d'inscription
	const $inscription	= $("#inscription");
	const $inscr_log	= $("#inscr_log");
	const $inscr_pswrd	= $("#inscr_pswrd");
	const $sign_in		= $("#sign_in");

	//constante du boutton de deconnection
	const $deconnection = $("#deconnection");

	//constante du boutton de soumission de message
	const $user_msg		= $('#user_msg');
	const $msg 			= $('#msg')		

	//constante pour l'affichage 
	const $user_name 	= $("#user_name");
	const $flux_msg		= $("#flux_msg");
	const $users 		= $("#users");

	//variables
	var messages		= '';

	function callKwickAPi(url, callback) {
		var request = $.ajax({
			type 		: 'GET',
			url 		: API_ROOT_url + url,
			dataType	: 'jsonp'
		});

		//En cas d'erreur
		request.fail(function(jqXHR, textStatus, errorTrown){
			callback(textStatus, null);
		});

		//En cas de succès
		request.done(function(data) {
			callback(null, data);
		});
	};   

	var app = {

		//initialisation 
		initialize: function() {

			$inscription.on('submit', function(evt) {
				evt.preventDefault();
				app.signIn($inscr_log.val(), $inscr_pswrd.val());
				localStorage.setItem('name',$inscr_log.val())
				
			});

			$connection.on('submit', function(evt) {
				evt.preventDefault();
				app.logIn($cnct_log.val(), $cnct_pswrd.val());	
				localStorage.setItem('name',$cnct_log.val())	
			});

			$deconnection.on('submit', function(evt) {
				evt.preventDefault();
				app.logOut(localStorage.token, localStorage.id);
			});

			$user_msg.on('submit', function(evt) {
				evt.preventDefault();
				app.sendMessage(localStorage.token, localStorage.id, encodeURI($msg.val()));
			});

			setInterval(function(){
				app.allMessages(localStorage.token);		
			},400);

			setInterval(function(){
				app.allUsers(localStorage.token);
			},400);
			
		},

		/**
		 * signIn permet de renvoyer vers la page du tchat après inscription
		 * @param  {string} user_name login récupéré dans le formulaire d'inscription
		 * @param  {string} password  password récupéré dans le formulaire d'inscription
		 * @return {string}           return une erreur si il y a une erreur
		 */
		signIn: function(user_name, password) {
			callKwickAPi('signup/' + user_name  + '/' + password, function(err, data) {
				if (err) 
					return alert('ERREUR');

				localStorage.setItem("token", data.result.token);
				localStorage.setItem("id", data.result.id);

				document.location.href = 'tchat.html';

			})
		},

		/**
		 * logIn permet de renvoyer vers la page du tchat après connection
		 * @param  {string} user_name login recuperer dans le formulaire de conection
		 * @param  {string} password  password recuperé dan le formulaire de connection
		 * @return {string}           return une erreur si il y a une erreur
		 */
		logIn: function(user_name, password) {
			callKwickAPi('login/' + user_name  + '/' + password, function(err, data) {
				if (err) 
					return alert('ERREUR');
				
				if (data.result.status !== "failure") 
					localStorage.setItem("token", data.result.token);
					localStorage.setItem("id", data.result.id);

					document.location.href = 'tchat.html';

			})
		},

		/**
		 * logOut permet de se deconnecter du tchat, renvois vers la page de connection/inscription
		 * @param  {string} token   le token délivré à lu'tilisateur a la création de sons compte
		 * @param  {string} user_id l'id délivré à lu'tilisateur a la création de sons compte
		 * @return {[type]}         renvois vers la page du chat
		 */
		logOut: function(token, user_id) {
			callKwickAPi('logout/' + token  + '/' + user_id, function(err, data) {
				if (err) 
					return alert('ERREUR');
				
					document.location.href = 'index.html';

			})
		},

		/**
		 * afficheUser permet d'afficher l'utilisateur connecté sur la page
		 * @return {string} return un objet html sous forme de string
		 */
		afficheUser: function() {
			$user_name.append("<h3>" + localStorage.name + "</h3>");
		},

		/**
		 * sendMessage permet d'envoyer un message
		 * @param  {string} token   le token délivré à lu'tilisateur a la création de sons compte
		 * @param  {string} user_id l'id délivré à lu'tilisateur a la création de sons compte
		 * @param  {string} msg     le message a recuperer
		 * @return {string}         le message de l'utilisateur dans le tchat
		 */
		sendMessage: function(token, user_id, msg) {
			callKwickAPi('say/' + token  + '/' + user_id + '/' + msg, function(err, data) {
				if (err) 
					return alert('ERREUR');

				$msg.val('');
			})
		},

		/**
		 * allMessage affichage des messages envoyé
		 * @param  {string} token le token délivré à lu'tilisateur a la création de sons compte
		 * @return {string}       renvois les message dan sla page html
		 */
		allMessages: function(token) {
			callKwickAPi('/talk/list/' + token + '/0', function(err, data) {
				if (err) 
					return alert('ERREUR');
				
				$flux_msg.empty();

				for (var i = 0; i < data.result.talk.length; i++) {
					$flux_msg.prepend('<p class="message"><p class="users">' + data.result.talk[i].user_name  + ' : </p><p class="msg_content">' + data.result.talk[i].content + '<p></p></br>');
				}
			})
		},

		/**
		 * allUser affiche les utilisateurs connectés
		 * @param  {string} token le token délivré à l'utilisateur a la création de son compte
		 * @return {string}       les utilisateur sous forme de liste en html
		 */
		allUsers: function(token) {
			callKwickAPi('/user/logged/' + token, function(err, data) {
				if (err) 
					return alert('ERREUR');
				

				$users.empty();

				for (var i = 0; i < data.result.user.length; i++) {
					$users.append('<li>' + data.result.user[i]  + '</li>');
				}
				$users.prepend('<h2>Utilisateurs connectés :</h2>')
			})
		}
	}

	window.app = app;

})(window, jQuery)
	