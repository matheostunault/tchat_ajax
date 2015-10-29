	var app = {

		//initialisation 
		initialize: function() {
			console.log('test');
			$inscription.on('submit', function(evt) {
				evt.preventDefault();
				console.log('chocolat');
				signIn($inscr_log.val(), $inscr_pswrd.val());
			});
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
			
				document.location.href = 'http://www.google.fr';
			})
		}
	} 