package  {
	
	//ici nous avons les importations de classes  necessaires au bon fonctionnement
	//du code de la classe JeuSaut
	import flash.display.MovieClip;
	import flash.events.MouseEvent;
	import flash.events.Event;
	import com.gestionTemps.Minuteur;
	import flash.text.TextField;
	import com.gestionFonts.FormatageFonts;
	import flash.text.TextFieldAutoSize;
	
	
	
	public class JeuSaut extends MovieClip {
		
		//declaration des variables 
		private var _joueur:Joueur=new Joueur();// le personage qui court
		private var _btSaut:BoutonSaut=new BoutonSaut();// le bouton qui declenche l'action de saut
		private var _minuterieObstacle:Minuteur=new Minuteur();
		
		private var _tabObstacles:Array=new Array();
		
		private var _nbTotalVies:uint=3;
		private var _viesActuelles:uint=3;
		private var _chVies:TextField=new TextField();
		
		private var _formatText:FormatageFonts=new FormatageFonts();
		
		private var _btRecommencer:BtInit=new BtInit();
		
		
		public function JeuSaut() {
			// le constructeur
			trace("instance de ::",this);
			
			placeInteractivite();
			
			
		}
		
		
		//fonction qui place les elements sur la scene
		public function placeInteractivite(){
			//on ajoute le joueur a la scene
			this.addChild(_joueur);
			_joueur.visible=true;
			_joueur.initJoueur();
			//on determine sa position (coordonnees en x et y)
			_joueur.x=330;
			_joueur.y=520;
			
			
			//choix de la position du bouton
			_btSaut.x=600;
			_btSaut.y = 760;
			//la propriete boutonMode transforme le curseur en main au survol 
			_btSaut.buttonMode = true;
			
			//on ecoute l evenement mouse down sur le bouton et on declenche la fonction saute
			_btSaut.addEventListener(MouseEvent.MOUSE_DOWN,saute);
			this.addChild(_btSaut);
			
			_minuterieObstacle.temps=4000;
			_minuterieObstacle.nbSonneries=17;
			_minuterieObstacle.addEventListener(Minuteur.MINUTEUR_SONNE,creationPoubelle);
			_minuterieObstacle.initialise();
			addEventListener(Event.ENTER_FRAME,testeCollision);
			
			//le champs texte pour afficher les vies
			_chVies.x= 150;
			_chVies.y= 30;
			_chVies.autoSize=TextFieldAutoSize.LEFT;
			_chVies.defaultTextFormat=_formatText.formatageNbVies;
			_chVies.text="Nombre de vies :: "+_viesActuelles;
			addChild(_chVies);
			
			//le bouton recommencer jeu
			_btRecommencer.x=150;
			_btRecommencer.y=150;
			_btRecommencer.visible=false;
			_btRecommencer.addEventListener(MouseEvent.MOUSE_DOWN,recommenceJeu);
			addChild(_btRecommencer);
		}
		
		private function saute(e:Event){
			trace("clic");
			_joueur.saute();
			
		}
		
		
		
		private function creationPoubelle(e:Event){
			
			var _maPoubelle:Poubelle=new Poubelle();
			_maPoubelle.x=2250;
			
			_maPoubelle.y=550;
			addChild(_maPoubelle);
			_maPoubelle.avance();
			_minuterieObstacle.temps=Math.random()*7000;
			var indiceCourant:uint=_tabObstacles.push(_maPoubelle);
			_maPoubelle.indice=indiceCourant;
		}
		
		
		
		private function testeCollision(e:Event){
			trace("nb obstacles::",_tabObstacles.length);
			for each(var obstacle:MovieClip in _tabObstacles){
				if(obstacle.hitTestObject(_joueur.graphisme)){
					obstacle.visible=false;
					_tabObstacles=_tabObstacles.splice(obstacle.indice,1);
					//_joueur.visible=false;
					trace("ouch");
					_viesActuelles=_viesActuelles -1;
					_chVies.text="Nombre de vies :: "+_viesActuelles;
					
					if(_viesActuelles==0){
						_chVies.text="Game Over";
						_joueur.visible=false;
						_btRecommencer.visible=true;
						
					}//fin de if
					
				}//fin de if
			}//fin du for
		}
		
		
		private function recommenceJeu(e:Event){
			//repasser les vies au max
			_viesActuelles=_nbTotalVies;
			
			//enlever tous les objets graphiques de la liste d'affichage
			removeChild(_joueur);
			for each(var obstacle:MovieClip in _tabObstacles){
				removeChild(obstacle);
				
			}
			_tabObstacles=_tabObstacles.splice(0);
			removeChild(_btSaut);
			
			//virer les ecouteurs
			_btSaut.removeEventListener(MouseEvent.MOUSE_DOWN,saute);
			removeEventListener(Event.ENTER_FRAME,testeCollision);
			
			placeInteractivite();
		}
		
	}
	
}
