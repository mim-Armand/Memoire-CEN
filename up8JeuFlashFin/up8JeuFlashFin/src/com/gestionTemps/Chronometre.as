package com.gestionTemps 
{
	import flash.events.Event;
	import flash.events.EventDispatcher;

	/**
	 * ...
	 * un chronomètre qui permet de mesurer un laps de temps entre 
	 * debut et fin 
	 * determineDuree renvoie cette durée en seconde
	 * dureeMiseEnForme renvoie cette durée en min:sec
	 * @author samueld.fr
	 */
	public class Chronometre extends EventDispatcher
	{
		private var _debut:Date;
		private var _debutPause:Date;
		private var _fin:Date;
		private var _timeDebut:Number;
		private var _timeFin:Number;
		private var _duree:Number;
		
		
		public static const CHRONO_DEMARRE:String = "demarre";
		public static const CHRONO_RELEVE:String = "releve";
		
		private var _eventDemarre:Event = new Event(CHRONO_DEMARRE);
		private var _eventReleve:Event = new Event(CHRONO_RELEVE);
		
		public function Chronometre() 
		{
			//trace('Instanciation :', this);
		}
		
		public function demarre():void {
			_debut = new Date();
			_timeDebut = _debut.getTime();
			dispatchEvent(_eventDemarre);			
			//trace("_timeDebut :: ",_timeDebut);
		}
		
		
	
		
		
		public function determineDuree():Number {
			_fin = new Date();
			_timeFin = _fin.getTime();
			//trace("_timeFin :: ", _timeFin);
			_duree = Math.round((_timeFin - _timeDebut) / 1000);
			dispatchEvent(_eventReleve);
			return _duree
		}
		
		public function dureeMiseEnForme():String {
			var sec:Number=determineDuree();
			var min:Number=Math.floor(sec/60);
			var minaff:String;
			if(min<10){
				minaff="0"+String(min);
			}else{
				minaff=String(min);
			}
			
			var secaff:String;
			if(sec%60 < 10){
				secaff="0"+String(sec%60);
			}else{
				secaff=String(sec%60);
			}
			
			var affichageMinuteSeconde:String=minaff+":"+secaff;
			return affichageMinuteSeconde;
		}
		
	}

}