package  {
	import flash.display.MovieClip;
	import flash.events.Event;
	
	public class Joueur extends MovieClip {


		
		//on cree deux varaiables dans lesquelles on met les animations de course et de saut
		private var _animSaut:BoucleSaut=new BoucleSaut();
		private var _animCourse:BoucleCourse=new BoucleCourse();
		
		private var _graphisme:MovieClip=_animCourse;
		

		public function Joueur() {
			trace(this);
		}
		
		//fonction qui place ces animations sur la scene et gere leur visibilite
		public function initJoueur(){
			trace("initJoueur");
			
			_animSaut.y=-60;
			
			addChild(_animCourse);
			addChild(_animSaut);
			_animSaut.visible=false;
		}
		
		//fonction en public
		//pour etre declenchee depuis la classe principale
		//fct qui va afficher l animation de saut
		public function saute(){
			
			_animSaut.visible=true;
			_animCourse.visible=false;
			_graphisme=_animSaut;
			//on doit poser un ecouteur de type enterframe
			//a chaque frame de l animation de saut
			// on doit savoir si c'est la frame de fin
			_animSaut.addEventListener(Event.ENTER_FRAME,everyFrame);
			
			_animSaut.gotoAndPlay(1);
		}
		
		private function everyFrame(e:Event){
			/*trace("________________");
			trace(e);
			trace(e.currentTarget);
			trace(e.currentTarget.currentLabel);
			trace("________________");*/
			
			
			if(e.currentTarget.currentLabel=="fin"){
				
				_animSaut.removeEventListener(Event.ENTER_FRAME,everyFrame);
				_animSaut.stop();
				_animSaut.visible=false;
				_animCourse.visible=true;
				_graphisme=_animCourse;
			}
		}


		//============================================
		//==============getters setters================
		//sont des methodes particulieres qui permettent de rendre
		//accessibles des proprietes privees d'une classe
		//get permet de recuperer sa valeur 
		//set permet d'affecter une valeur à la variable
		public function get graphisme():MovieClip
		{
			return _graphisme;
		}
		
		public function set graphisme(value:MovieClip)
		{
			_graphisme=value;
		}


	}
	
}
